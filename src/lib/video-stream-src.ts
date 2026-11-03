const VIDEO_PATH = "/api/video/";

function cdnPrefix(): string {
  const raw = (process.env.NEXT_PUBLIC_VIDEO_CDN_URL || "").trim().replace(/\/+$/, "");
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) return "";
    if (url.pathname !== "" && url.pathname !== "/") return "";
    return url.origin;
  } catch {
    return "";
  }
}

export function videoStreamSrc(videoId: string | number): string | null {
  const id = String(videoId).trim();
  if (!/^[1-9]\d*$/.test(id)) return null;
  const cdnUrl = cdnPrefix();
  return `${cdnUrl}${VIDEO_PATH}${id}`;
}

export function isVideoStreamSrc(src: string): boolean {
  const id = src.slice(src.lastIndexOf("/") + 1);
  return videoStreamSrc(id) === src;
}
