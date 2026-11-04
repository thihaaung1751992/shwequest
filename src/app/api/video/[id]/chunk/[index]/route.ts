import { chunkBounds, VIDEO_WINDOW_BYTES } from "@/lib/video-chunk-range";
import { openVideo, parseMessageId, readVideoWindow, videoFailureResponse } from "@/lib/telegram-video-bytes";

const CHUNK_CACHE_CONTROL = "public, max-age=0, must-revalidate";
const CHUNK_CDN_CACHE_CONTROL = "max-age=604800";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string; index: string }> },
) {
  const { id, index } = await context.params;
  const messageId = parseMessageId(id);
  if (messageId === null) {
    return new Response("Message id must be a positive integer.", { status: 400 });
  }
  if (!/^(0|[1-9]\d*)$/.test(index)) {
    return new Response("Chunk index must be a non-negative integer.", { status: 400 });
  }

  try {
    const { client, cache } = await openVideo(messageId);
    const bounds = chunkBounds(index, cache.video.size, VIDEO_WINDOW_BYTES);
    if (bounds === "bad-index") {
      return new Response("Chunk index must be a non-negative integer.", { status: 400 });
    }
    if (bounds === "past-end") {
      return new Response("Range not satisfiable.", {
        status: 416,
        headers: {
          "Content-Range": `bytes */${cache.video.size}`,
          "Accept-Ranges": "none",
        },
      });
    }

    const body = await readVideoWindow(client, cache, bounds.start, bounds.end);
    if (body.byteLength !== bounds.end - bounds.start + 1) {
      return new Response("Could not stream video.", { status: 502 });
    }
    const bytes = new ArrayBuffer(body.byteLength);
    new Uint8Array(bytes).set(body);

    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": String(body.byteLength),
        "Cache-Control": CHUNK_CACHE_CONTROL,
        "CDN-Cache-Control": CHUNK_CDN_CACHE_CONTROL,
        "Accept-Ranges": "none",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return videoFailureResponse(error);
  }
}
