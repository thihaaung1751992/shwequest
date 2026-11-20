import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminVideoDetail from "@/components/admin/admin-video-detail";
import {
  getAdminVideoDetail,
  selfStudyPlaylistStaticParams,
} from "@/data/admin-videos";

type VideoParams = Promise<{ id: string }>;

export function generateStaticParams() {
  return selfStudyPlaylistStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: VideoParams;
}): Promise<Metadata> {
  const { id } = await params;
  const detail = getAdminVideoDetail(id);
  if (!detail) {
    return {
      title: "Video · Admin · Shwequest",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `${detail.playlist.title} · Admin · Shwequest`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminVideoDetailPage({
  params,
}: {
  params: VideoParams;
}) {
  const { id } = await params;
  const detail = getAdminVideoDetail(id);
  if (!detail) notFound();

  return (
    <AdminVideoDetail
      playlist={detail.playlist}
      siteHref={detail.siteHref}
      listHref={detail.listHref}
    />
  );
}
