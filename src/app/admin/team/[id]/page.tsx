import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminTeamDetail from "@/components/admin/admin-team-detail";
import {
  builderStaticParams,
  getAdminTeamDetail,
} from "@/data/admin-team";

type TeamParams = Promise<{ id: string }>;

export function generateStaticParams() {
  return builderStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: TeamParams;
}): Promise<Metadata> {
  const { id } = await params;
  const detail = getAdminTeamDetail(id);
  if (!detail) {
    return {
      title: "Team · Admin · Shwequest",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `${detail.person.label} · Admin · Shwequest`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminTeamDetailPage({
  params,
}: {
  params: TeamParams;
}) {
  const { id } = await params;
  const detail = getAdminTeamDetail(id);
  if (!detail) notFound();

  return (
    <AdminTeamDetail
      person={detail.person}
      status={detail.status}
      summary={detail.summary}
      siteHref={detail.siteHref}
      listHref={detail.listHref}
    />
  );
}
