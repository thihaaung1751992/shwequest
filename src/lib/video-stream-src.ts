const VIDEO_ID_PATH = /^\/api\/video\/[1-9]\d*$/;

export function videoStreamSrc(videoId: string | number): string | null {
  const id = String(videoId).trim();
  if (!/^[1-9]\d*$/.test(id)) return null;
  return `/api/video/${id}`;
}

export function isVideoStreamSrc(src: string): boolean {
  return VIDEO_ID_PATH.test(src);
}
