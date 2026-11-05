import { VIDEO_WINDOW_BYTES } from "@/lib/video-chunk-range";
import { openVideo, parseMessageId, streamVideo, videoFailureResponse } from "@/lib/telegram-video-bytes";

const STREAM_CACHE_CONTROL =
  "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400";
// A cache that stores this URL keeps one 2 MB window and can serve it as the whole file.
const STREAM_CDN_CACHE_CONTROL = "no-store";

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

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const rangeHeader = request.headers.get("range");
  const { id } = await context.params;
  const messageId = parseMessageId(id);
  if (messageId === null) {
    return new Response("Message id must be a positive integer.", { status: 400 });
  }

  try {
    const { client, cache } = await openVideo(messageId);
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
    const ranged = range !== null || end - start + 1 > VIDEO_WINDOW_BYTES;
    if (end - start + 1 > VIDEO_WINDOW_BYTES) end = start + VIDEO_WINDOW_BYTES - 1;
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
    return videoFailureResponse(error);
  }
}
