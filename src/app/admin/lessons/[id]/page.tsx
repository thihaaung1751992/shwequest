import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminLessonDetail from "@/components/admin/admin-lesson-detail";
import { getAdminLessonDetail } from "@/data/admin-lessons";
import { freeLessonStaticParams } from "@/data/self-study";

type LessonParams = Promise<{ id: string }>;

export function generateStaticParams() {
  return freeLessonStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: LessonParams;
}): Promise<Metadata> {
  const { id } = await params;
  const detail = getAdminLessonDetail(id);
  if (!detail) {
    return {
      title: "Lesson · Admin · Shwequest",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `${detail.lesson.title} · Admin · Shwequest`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminLessonDetailPage({
  params,
}: {
  params: LessonParams;
}) {
  const { id } = await params;
  const detail = getAdminLessonDetail(id);
  if (!detail) notFound();

  return (
    <AdminLessonDetail
      lesson={detail.lesson}
      status={detail.status}
      siteHref={detail.siteHref}
      listHref={detail.listHref}
    />
  );
}
