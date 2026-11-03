import TestVideoScreen from "@/components/test-video-screen";

export default function TestVideoPage() {
  const cdnUrl = process.env.NEXT_PUBLIC_VIDEO_CDN_URL ?? "";
  return <TestVideoScreen cdnUrl={cdnUrl} />;
}
