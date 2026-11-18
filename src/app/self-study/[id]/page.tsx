import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import PageShell from "@/components/page-shell";
import SelfStudyCourse from "@/components/self-study/self-study-course";
import {
  freeLessonById,
  freeLessonStaticParams,
  resolveFreeLessonSectionId,
} from "@/data/self-study";

type LessonParams = Promise<{ id: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function firstParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export function generateStaticParams() {
  return freeLessonStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: LessonParams;
}): Promise<Metadata> {
  const { id } = await params;
  const lesson = freeLessonById(id);
  if (!lesson) return { title: "Self study · Shwequest" };
  return { title: `${lesson.title} · Shwequest` };
}

async function SelfStudyCourseFromParams({
  params,
  searchParams,
}: {
  params: LessonParams;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const lesson = freeLessonById(id);
  if (!lesson) notFound();
  const sectionParam = firstParam((await searchParams).section);
  const initialSectionId = resolveFreeLessonSectionId(
    lesson.sections,
    sectionParam,
  );
  return (
    <SelfStudyCourse lesson={lesson} initialSectionId={initialSectionId} />
  );
}

export default function SelfStudyCoursePage({
  params,
  searchParams,
}: {
  params: LessonParams;
  searchParams: SearchParams;
}) {
  return (
    <PageShell title="Self study">
      <Suspense
        fallback={
          <div className="grid gap-5 lg:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)]">
            <div className="h-80 rounded-[1.75rem] bg-amber-100/60 dark:bg-white/5" />
            <div className="min-h-[18rem] rounded-[1.75rem] bg-amber-50/80 dark:bg-white/5 sm:min-h-[24rem]" />
          </div>
        }
      >
        <SelfStudyCourseFromParams
          params={params}
          searchParams={searchParams}
        />
      </Suspense>
    </PageShell>
  );
}
