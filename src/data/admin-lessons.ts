import {
  FREE_LESSONS,
  freeLessonById,
  freeLessonHref,
  type FreeLesson,
} from "@/data/self-study";

export type AdminLessonStatus = "live" | "soon";

export type AdminLessonRow = {
  id: string;
  title: string;
  titleMy?: string;
  accent: FreeLesson["accent"];
  duration: string;
  sectionCount: number;
  status: AdminLessonStatus;
  href: string;
  siteHref: string;
};

export type AdminLessonStats = {
  total: number;
  live: number;
  soon: number;
  sections: number;
};

export function adminLessonHref(id: string): string {
  return `/admin/lessons/${id}`;
}

export function adminLessonStatus(lesson: FreeLesson): AdminLessonStatus {
  return lesson.available === true ? "live" : "soon";
}

export function getAdminLessonStats(
  lessons: readonly FreeLesson[] = FREE_LESSONS,
): AdminLessonStats {
  let live = 0;
  let sections = 0;
  for (const lesson of lessons) {
    if (lesson.available === true) live += 1;
    sections += lesson.sections.length;
  }
  return {
    total: lessons.length,
    live,
    soon: lessons.length - live,
    sections,
  };
}

export function getAdminLessonRows(
  lessons: readonly FreeLesson[] = FREE_LESSONS,
): AdminLessonRow[] {
  return lessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    titleMy: lesson.titleMy,
    accent: lesson.accent,
    duration: lesson.duration,
    sectionCount: lesson.sections.length,
    status: adminLessonStatus(lesson),
    href: adminLessonHref(lesson.id),
    siteHref: freeLessonHref(lesson.id),
  }));
}

export function getAdminLessonDetail(id: string) {
  const lesson = freeLessonById(id);
  if (!lesson) return undefined;
  return {
    lesson,
    status: adminLessonStatus(lesson),
    siteHref: freeLessonHref(lesson.id),
    listHref: "/admin/lessons",
  };
}
