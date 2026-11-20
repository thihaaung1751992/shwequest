import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminLeaderboardDetail from "@/components/admin/admin-leaderboard-detail";
import {
  getAdminLeaderboardDetail,
  leaderboardStaticParams,
} from "@/data/admin-leaderboard";

type LeaderboardParams = Promise<{ id: string }>;

export function generateStaticParams() {
  return leaderboardStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: LeaderboardParams;
}): Promise<Metadata> {
  const { id } = await params;
  const detail = getAdminLeaderboardDetail(id);
  if (!detail) {
    return {
      title: "Leaderboard · Admin · Shwequest",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `${detail.entry.displayName} · Admin · Shwequest`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminLeaderboardDetailPage({
  params,
}: {
  params: LeaderboardParams;
}) {
  const { id } = await params;
  const detail = getAdminLeaderboardDetail(id);
  if (!detail) notFound();

  return (
    <AdminLeaderboardDetail
      entry={detail.entry}
      rankLabel={detail.rankLabel}
      siteHref={detail.siteHref}
      listHref={detail.listHref}
    />
  );
}
