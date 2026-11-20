import { countLessons } from "@/components/roadmap/roadmap-data";
import {
  TEACHERS,
  teacherById,
  teacherComingSoon,
  teacherProgress,
  catalogTotals,
  type Teacher,
  type TeacherAccent,
} from "@/data/teachers";

export type AdminTeacherStatus = "live" | "soon";

export type AdminTeacherRow = {
  id: string;
  label: string;
  accent: TeacherAccent;
  status: AdminTeacherStatus;
  videos: number;
  games: number;
  units: number;
  progressDone: number;
  progressTotal: number;
  progressPercent: number;
  href: string;
  siteHref: string;
};

export type AdminTeacherStats = {
  total: number;
  live: number;
  soon: number;
  videos: number;
  games: number;
};

export function adminTeacherHref(id: string): string {
  return `/admin/teachers/${id}`;
}

/** Learner path for a live teacher (matches TeacherCard). */
export function adminTeacherSiteHref(id: string): string {
  return `/map?teacher=${id}`;
}

export function adminTeacherStatus(id: string): AdminTeacherStatus {
  return teacherComingSoon(id) ? "soon" : "live";
}

export function teacherStaticParams(): { id: string }[] {
  return TEACHERS.map((teacher) => ({ id: teacher.id }));
}

export function getAdminTeacherStats(
  teachers: readonly Teacher[] = TEACHERS,
): AdminTeacherStats {
  let live = 0;
  for (const teacher of teachers) {
    if (!teacherComingSoon(teacher.id)) live += 1;
  }
  const { videos, games } = catalogTotals(teachers);
  return {
    total: teachers.length,
    live,
    soon: teachers.length - live,
    videos,
    games,
  };
}

export function getAdminTeacherRows(
  teachers: readonly Teacher[] = TEACHERS,
): AdminTeacherRow[] {
  return teachers.map((teacher) => {
    const { videos, games } = countLessons(teacher.nodes);
    const progress = teacherProgress(teacher);
    return {
      id: teacher.id,
      label: teacher.label,
      accent: teacher.accent,
      status: adminTeacherStatus(teacher.id),
      videos,
      games,
      units: teacher.units.length,
      progressDone: progress.done,
      progressTotal: progress.total,
      progressPercent: progress.percent,
      href: adminTeacherHref(teacher.id),
      siteHref: adminTeacherSiteHref(teacher.id),
    };
  });
}

export function getAdminTeacherDetail(id: string) {
  const teacher = teacherById(id);
  if (!teacher) return undefined;
  const { videos, games } = countLessons(teacher.nodes);
  const progress = teacherProgress(teacher);
  return {
    teacher,
    status: adminTeacherStatus(teacher.id),
    siteHref: adminTeacherSiteHref(teacher.id),
    listHref: "/admin/teachers",
    videos,
    games,
    units: teacher.units.length,
    progress,
  };
}
