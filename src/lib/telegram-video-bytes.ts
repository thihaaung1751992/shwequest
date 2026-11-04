import bigInt from "big-integer";
import { Api, TelegramClient } from "telegram";
import { VIDEO_WINDOW_BYTES } from "@/lib/video-chunk-range";
import { telegramClient, videoFile, type VideoFile } from "@/lib/telegram-video";

const BLOCK_BYTES = 512 * 1024;
const CACHE_BYTES = 16 * 1024 * 1024;

type FileCache = {
  video: VideoFile;
  blocks: Map<number, Buffer>;
  inflight: Map<number, Promise<Buffer>>;
  order: number[];
  stored: number;
};

export type OpenedVideo = {
  client: TelegramClient;
  cache: FileCache;
};

const globalForTelegram = globalThis as typeof globalThis & {
  __shwequestVideoFiles?: Map<number, FileCache>;
};

export class VideoHttpError extends Error {
  readonly status: 400 | 404 | 500 | 502;

  constructor(status: 400 | 404 | 500 | 502, message: string) {
    super(message);
    this.name = "VideoHttpError";
    this.status = status;
  }
}

export function parseMessageId(id: string): number | null {
  if (!/^[1-9]\d*$/.test(id)) return null;
  const messageId = Number(id);
  if (!Number.isSafeInteger(messageId)) return null;
  return messageId;
}

export function videoFailureResponse(error: unknown): Response {
  if (error instanceof VideoHttpError) {
    return new Response(error.message, { status: error.status });
  }
  console.error("Telegram video stream failed", error instanceof Error ? error.name : "error");
  return new Response("Could not stream video.", { status: 502 });
}

function videoFiles(): Map<number, FileCache> {
  if (!globalForTelegram.__shwequestVideoFiles) {
    globalForTelegram.__shwequestVideoFiles = new Map();
  }
  return globalForTelegram.__shwequestVideoFiles;
}

function blockOffsets(start: number, end: number): number[] {
  const offsets: number[] = [];
  for (let offset = Math.floor(start / BLOCK_BYTES) * BLOCK_BYTES; offset <= end; offset += BLOCK_BYTES) {
    offsets.push(offset);
  }
  return offsets;
}

function storeBlock(cache: FileCache, offset: number, block: Buffer, size: number) {
  if (cache.blocks.has(offset)) return;
  cache.blocks.set(offset, block);
  if (offset + BLOCK_BYTES >= size) return;
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
      requestSize: BLOCK_BYTES,
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

function loadBlock(client: TelegramClient, cache: FileCache, offset: number): Promise<Buffer> {
  const cached = cache.blocks.get(offset);
  if (cached) return Promise.resolve(cached);
  const pending = cache.inflight.get(offset);
  if (pending) return pending;
  const length = Math.min(BLOCK_BYTES, cache.video.size - offset);
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

export function streamVideo(
  client: TelegramClient,
  cache: FileCache,
  start: number,
  end: number,
): ReadableStream<Uint8Array> {
  const offsets = blockOffsets(start, end);
  const tailOffset = Math.floor((cache.video.size - 1) / BLOCK_BYTES) * BLOCK_BYTES;
  const ahead = blockOffsets(end + 1, Math.min(cache.video.size - 1, end + VIDEO_WINDOW_BYTES));
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

export async function readVideoWindow(
  client: TelegramClient,
  cache: FileCache,
  start: number,
  end: number,
): Promise<Uint8Array> {
  const offsets = blockOffsets(start, end);
  const pieces: Uint8Array[] = [];
  for (const offset of offsets) {
    const block = await loadBlock(client, cache, offset);
    const from = Math.max(start, offset) - offset;
    const to = Math.min(end + 1, offset + block.length) - offset;
    if (to > from) pieces.push(new Uint8Array(block.subarray(from, to)));
  }
  if (pieces.length === 1 && pieces[0]) return pieces[0];
  const total = pieces.reduce((sum, piece) => sum + piece.length, 0);
  const merged = new Uint8Array(total);
  let cursor = 0;
  for (const piece of pieces) {
    merged.set(piece, cursor);
    cursor += piece.length;
  }
  return merged;
}

export async function openVideo(messageId: number): Promise<OpenedVideo> {
  const channel = process.env.TELEGRAM_CHANNEL;
  if (!channel || !process.env.TELEGRAM_API_ID || !process.env.TELEGRAM_API_HASH || !process.env.TELEGRAM_BOT_TOKEN) {
    throw new VideoHttpError(500, "Telegram is not configured.");
  }

  try {
    const client = await telegramClient();
    let cache = videoFiles().get(messageId);
    if (!cache) {
      const messages = await client.getMessages(channel, { ids: [messageId] });
      const message = messages[0];
      if (!(message instanceof Api.Message)) {
        throw new VideoHttpError(404, "Video not found.");
      }
      const video = videoFile(message);
      if (!video) {
        throw new VideoHttpError(404, "Video not found.");
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
    return { client, cache };
  } catch (error) {
    if (error instanceof VideoHttpError) throw error;
    const text = error instanceof Error ? error.message : "";
    console.error("Telegram video stream failed", error instanceof Error ? error.name : "error");
    if (
      /No user has .+ as username/i.test(text) ||
      /CHANNEL_PRIVATE|CHANNEL_INVALID|PEER_ID_INVALID|CHAT_ID_INVALID/i.test(text)
    ) {
      throw new VideoHttpError(404, "Channel or video not found.");
    }
    throw new VideoHttpError(502, "Could not stream video.");
  }
}
