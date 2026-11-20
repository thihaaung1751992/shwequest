import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminTeacherDetail from "@/components/admin/admin-teacher-detail";
import {
  getAdminTeacherDetail,
  teacherStaticParams,
} from "@/data/admin-teachers";

type TeacherParams = Promise<{ id: string }>;

export function generateStaticParams() {
  return teacherStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: TeacherParams;
}): Promise<Metadata> {
  const { id } = await params;
  const detail = getAdminTeacherDetail(id);
  if (!detail) {
    return {
      title: "Teacher · Admin · Shwequest",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `${detail.teacher.label} · Admin · Shwequest`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminTeacherDetailPage({
  params,
}: {
  params: TeacherParams;
}) {
  const { id } = await params;
  const detail = getAdminTeacherDetail(id);
  if (!detail) notFound();

  return (
    <AdminTeacherDetail
      teacher={detail.teacher}
      status={detail.status}
      siteHref={detail.siteHref}
      listHref={detail.listHref}
      videos={detail.videos}
      games={detail.games}
      units={detail.units}
      progress={detail.progress}
    />
  );
}
