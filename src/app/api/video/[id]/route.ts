import bigInt from "big-integer";
import { Api, TelegramClient } from "telegram";
import { telegramClient, videoFile, type VideoFile } from "@/lib/telegram-video";

const CHUNK_BYTES = 512 * 1024;
const WINDOW_BYTES = 2 * 1024 * 1024;
const CACHE_BYTES = 16 * 1024 * 1024;
// Seven days for shared caches. Vary: Range keeps each byte slice separate.
const STREAM_CACHE_CONTROL =
  "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400";
const STREAM_CDN_CACHE_CONTROL = "max-age=604800";

type FileCache = {
  video: VideoFile;
  blocks: Map<number, Buffer>;
  inflight: Map<number, Promise<Buffer>>;
  order: number[];
  stored: number;
};

const globalForTelegram = globalThis as typeof globalThis & {
  __shwequestVideoFiles?: Map<number, FileCache>;
};

function parseRange(
  header: string | null,
  size: number,
): { start: number; end: number } | "unsatisfiable" | null {
  if (!header) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match || size <= 0) return "unsatisfiable";
  const startText = match[1] ?? "";
  const endText = match[2] ?? "";
  if (startText === "" && endText === "") return "unsatisfiable";

  if (startText === "") {
    const suffix = Number(endText);
    if (!Number.isInteger(suffix) || suffix <= 0) return "unsatisfiable";
    return { start: Math.max(0, size - suffix), end: size - 1 };
  }

  const start = Number(startText);
  if (!Number.isInteger(start) || start < 0 || start >= size) return "unsatisfiable";
  const end = endText === "" ? size - 1 : Number(endText);
  if (!Number.isInteger(end) || end < start) return "unsatisfiable";
  return { start, end: Math.min(end, size - 1) };
}

function videoFiles(): Map<number, FileCache> {
  if (!globalForTelegram.__shwequestVideoFiles) {
    globalForTelegram.__shwequestVideoFiles = new Map();
  }
  return globalForTelegram.__shwequestVideoFiles;
}

function blockOffsets(start: number, end: number): number[] {
  const offsets: number[] = [];
  for (let offset = Math.floor(start / CHUNK_BYTES) * CHUNK_BYTES; offset <= end; offset += CHUNK_BYTES) {
    offsets.push(offset);
  }
  return offsets;
}

function storeBlock(cache: FileCache, offset: number, block: Buffer, size: number) {
  if (cache.blocks.has(offset)) return;
  cache.blocks.set(offset, block);
  if (offset + CHUNK_BYTES >= size) return;
  cache.order.push(offset);
  cache.stored += block.length;
  while (cache.stored > CACHE_BYTES && cache.order.length > 0) {
    const old = cache.order.shift();
    if (old === undefined) break;
    const removed = cache.blocks.get(old);
    if (!removed) continue;
    cache.blocks.delete(old);
    cache.stored -= removed.length;
  }
}

async function downloadBlock(
  client: TelegramClient,
  file: Api.TypeMessageMedia,
  offset: number,
  length: number,
): Promise<Buffer> {
  const parts: Buffer[] = [];
  let got = 0;
  // GramJS calls offset.divide, so a plain number throws.
  const iter = client
    .iterDownload({
      file,
      offset: bigInt(offset),
      requestSize: CHUNK_BYTES,
    })
    [Symbol.asyncIterator]();
  try {
    while (got < length) {
      const next = await iter.next();
      if (next.done || !next.value?.length) break;
      parts.push(next.value);
      got += next.value.length;
    }
  } finally {
    await iter.return?.();
  }
  const merged = parts.length === 1 ? parts[0] : Buffer.concat(parts);
  if (!merged || merged.length < length) {
    throw new Error("Short video read");
  }
  return merged.subarray(0, length);
}

function loadBlock(
  client: TelegramClient,
  cache: FileCache,
  offset: number,
): Promise<Buffer> {
  const cached = cache.blocks.get(offset);
  if (cached) return Promise.resolve(cached);
  const pending = cache.inflight.get(offset);
  if (pending) return pending;
  const length = Math.min(CHUNK_BYTES, cache.video.size - offset);
  const promise = downloadBlock(client, cache.video.media, offset, length)
    .then((block) => {
      storeBlock(cache, offset, block, cache.video.size);
      return block;
    })
    .finally(() => {
      cache.inflight.delete(offset);
    });
  cache.inflight.set(offset, promise);
  return promise;
}

function warmBlocks(client: TelegramClient, cache: FileCache, offsets: number[], closed: () => boolean) {
  void (async () => {
    for (const offset of offsets) {
      if (closed() || offset < 0 || offset >= cache.video.size) return;
      try {
        await loadBlock(client, cache, offset);
      } catch {
        return;
      }
    }
  })();
}

function streamVideo(
  client: TelegramClient,
  cache: FileCache,
  start: number,
  end: number,
): ReadableStream<Uint8Array> {
  const offsets = blockOffsets(start, end);
  const tailOffset = Math.floor((cache.video.size - 1) / CHUNK_BYTES) * CHUNK_BYTES;
  const ahead = blockOffsets(end + 1, Math.min(cache.video.size - 1, end + WINDOW_BYTES));
  let index = 0;
  let closed = false;

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (closed) return;
      if (index >= offsets.length) {
        closed = true;
        controller.close();
        return;
      }
      const offset = offsets[index];
      index += 1;
      try {
        const block = await loadBlock(client, cache, offset);
        if (closed) return;
        const from = Math.max(start, offset) - offset;
        const to = Math.min(end + 1, offset + block.length) - offset;
        if (to > from) controller.enqueue(new Uint8Array(block.subarray(from, to)));
        if (index === 1) {
          void loadBlock(client, cache, tailOffset).catch(() => undefined);
          warmBlocks(client, cache, ahead, () => closed);
        }
        if (index >= offsets.length) {
          closed = true;
          controller.close();
        }
      } catch (error) {
        closed = true;
        console.error("Telegram video stream failed", error instanceof Error ? error.name : "error");
        controller.error(error);
      }
    },
    cancel() {
      closed = true;
    },
  });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const rangeHeader = request.headers.get("range");
  const { id } = await context.params;
  if (!/^[1-9]\d*$/.test(id)) {
    return new Response("Message id must be a positive integer.", { status: 400 });
  }
  const messageId = Number(id);
  if (!Number.isSafeInteger(messageId)) {
    return new Response("Message id must be a positive integer.", { status: 400 });
  }

  const channel = process.env.TELEGRAM_CHANNEL;
  if (!channel || !process.env.TELEGRAM_API_ID || !process.env.TELEGRAM_API_HASH || !process.env.TELEGRAM_BOT_TOKEN) {
    return new Response("Telegram is not configured.", { status: 500 });
  }

  try {
    const client = await telegramClient();
    let cache = videoFiles().get(messageId);
    if (!cache) {
      const messages = await client.getMessages(channel, { ids: [messageId] });
      const message = messages[0];
      if (!(message instanceof Api.Message)) {
        return new Response("Video not found.", { status: 404 });
      }
      const video = videoFile(message);
      if (!video) {
        return new Response("Video not found.", { status: 404 });
      }
      const existing = videoFiles().get(messageId);
      cache = existing ?? {
        video,
        blocks: new Map(),
        inflight: new Map(),
        order: [],
        stored: 0,
      };
      if (!existing) videoFiles().set(messageId, cache);
    }
    const video = cache.video;
    if (video.size === 0) {
      return new Response(null, {
        status: 200,
        headers: {
          "Content-Type": video.mime,
          "Accept-Ranges": "bytes",
          "Cache-Control": "private, max-age=3600",
          "Content-Length": "0",
        },
      });
    }

    const range = parseRange(rangeHeader, video.size);
    if (range === "unsatisfiable") {
      return new Response("Range not satisfiable.", {
        status: 416,
        headers: {
          "Content-Range": `bytes */${video.size}`,
          "Accept-Ranges": "bytes",
        },
      });
    }

    const start = range?.start ?? 0;
    let end = range?.end ?? video.size - 1;
    // Open ranges used to stream the whole file. The index sits at the end, so a seek
    // waited on that download. Cap each response and let the player ask for the next piece.
    const ranged = range !== null || end - start + 1 > WINDOW_BYTES;
    if (end - start + 1 > WINDOW_BYTES) end = start + WINDOW_BYTES - 1;
    const headers = new Headers({
      "Content-Type": video.mime,
      "Accept-Ranges": "bytes",
      "Cache-Control": STREAM_CACHE_CONTROL,
      "CDN-Cache-Control": STREAM_CDN_CACHE_CONTROL,
      Vary: "Range",
      "Content-Length": String(end - start + 1),
    });
    if (ranged) {
      headers.set("Content-Range", `bytes ${start}-${end}/${video.size}`);
    }
    return new Response(streamVideo(client, cache, start, end), {
      status: ranged ? 206 : 200,
      headers,
    });
  } catch (error) {
    const text = error instanceof Error ? error.message : "";
    console.error("Telegram video stream failed", error instanceof Error ? error.name : "error");
    if (
      /No user has .+ as username/i.test(text) ||
      /CHANNEL_PRIVATE|CHANNEL_INVALID|PEER_ID_INVALID|CHAT_ID_INVALID/i.test(text)
    ) {
      return new Response("Channel or video not found.", { status: 404 });
    }
    return new Response("Could not stream video.", { status: 502 });
  }
}
