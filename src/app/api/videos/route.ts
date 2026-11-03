import { listChannelVideos } from "@/lib/telegram-video";

const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" };

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status, headers: PRIVATE_HEADERS });
}

export async function GET() {
  const channel = process.env.TELEGRAM_CHANNEL;
  if (!channel || !process.env.TELEGRAM_API_ID || !process.env.TELEGRAM_API_HASH || !process.env.TELEGRAM_BOT_TOKEN) {
    return jsonError("Telegram is not configured.", 500);
  }

  try {
    const list = await listChannelVideos(channel);
    return Response.json(list, { headers: PRIVATE_HEADERS });
  } catch (error) {
    const text = error instanceof Error ? error.message : "";
    console.error("Telegram video list failed", error instanceof Error ? error.name : "error");
    if (
      /No user has .+ as username/i.test(text) ||
      /CHANNEL_PRIVATE|CHANNEL_INVALID|PEER_ID_INVALID|CHAT_ID_INVALID/i.test(text)
    ) {
      return jsonError("Channel not found.", 404);
    }
    return jsonError("Could not list videos.", 502);
  }
}
