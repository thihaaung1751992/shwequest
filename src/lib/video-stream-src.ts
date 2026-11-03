const VIDEO_ID_PATH = /^\/api\/video\/[1-9]\d*$/;

function cdnPrefix(raw: string | undefined = process.env.NEXT_PUBLIC_VIDEO_CDN_URL): string {
  const value = (raw ?? "").trim().replace(/\/+$/, "");
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) return "";
    if (url.pathname !== "" && url.pathname !== "/") return "";
    return url.origin;
  } catch {
    return "";
  }
}

export function videoStreamSrc(videoId: string | number, cdnUrl?: string): string | null {
  const id = String(videoId).trim();
  if (!/^[1-9]\d*$/.test(id)) return null;
  return `${cdnPrefix(cdnUrl)}/api/video/${id}`;
}

export function isVideoStreamSrc(src: string): boolean {
  if (VIDEO_ID_PATH.test(src)) return true;
  const cdn = cdnPrefix();
  if (!cdn) return false;
  try {
    const url = new URL(src);
    if (url.origin !== cdn || url.username || url.password || url.search || url.hash) return false;
    return VIDEO_ID_PATH.test(url.pathname);
  } catch {
    return false;
  }
}
