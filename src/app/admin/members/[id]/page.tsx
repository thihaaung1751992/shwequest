import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminMembersDetail from "@/components/admin/admin-members-detail";
import {
  getAdminMemberDetail,
  memberStaticParams,
} from "@/data/admin-members";

type MemberParams = Promise<{ id: string }>;

export function generateStaticParams() {
  return memberStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: MemberParams;
}): Promise<Metadata> {
  const { id } = await params;
  const detail = getAdminMemberDetail(id);
  if (!detail) {
    return {
      title: "Members · Admin · Shwequest",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `${detail.member.displayName} · Admin · Shwequest`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminMemberDetailPage({
  params,
}: {
  params: MemberParams;
}) {
  const { id } = await params;
  const detail = getAdminMemberDetail(id);
  if (!detail) notFound();

  return (
    <AdminMembersDetail
      member={detail.member}
      planLabel={detail.planLabel}
      teachers={detail.teachers}
      siteHref={detail.siteHref}
      listHref={detail.listHref}
    />
  );
}
