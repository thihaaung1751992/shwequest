import { openVideo, parseMessageId, videoFailureResponse } from "@/lib/telegram-video-bytes";

const META_CACHE_CONTROL = "public, max-age=3600";
const META_CDN_CACHE_CONTROL = "max-age=604800";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const messageId = parseMessageId(id);
  if (messageId === null) {
    return new Response("Message id must be a positive integer.", { status: 400 });
  }

  try {
    const { cache } = await openVideo(messageId);
    const mime = cache.video.mime.startsWith("video/") ? cache.video.mime : "video/mp4";
    return Response.json(
      { size: cache.video.size, mime },
      {
        headers: {
          "Cache-Control": META_CACHE_CONTROL,
          "CDN-Cache-Control": META_CDN_CACHE_CONTROL,
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  } catch (error) {
    return videoFailureResponse(error);
  }
}
