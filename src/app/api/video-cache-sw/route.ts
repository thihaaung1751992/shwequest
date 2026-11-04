import { videoCacheWorkerScript } from "@/lib/video-cache-worker";

export function GET() {
  return new Response(videoCacheWorkerScript(), {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache",
      "Service-Worker-Allowed": "/",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
