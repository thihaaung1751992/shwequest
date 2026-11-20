import { BUILDERS } from "@/data/team";
import { getAdminLeaderboardActivityRows } from "@/data/admin-leaderboard";
import { adminLessonHref } from "@/data/admin-lessons";
import {
  getAdminMemberStats,
  getAdminMembersActivityRows,
} from "@/data/admin-members";
import { getAdminSiteActivityRows } from "@/data/admin-site";
import { adminTeacherHref } from "@/data/admin-teachers";
import { adminTeamHref } from "@/data/admin-team";
import { adminVideoHref } from "@/data/admin-videos";
import { FREE_LESSONS } from "@/data/self-study";
import { SELF_STUDY_PLAYLISTS } from "@/data/self-study-videos";
import {
  TEACHERS,
  catalogTotals,
  teacherComingSoon,
} from "@/data/teachers";

export type AdminKpiTone = "emerald" | "sky" | "amber" | "orange";

export type AdminKpi = {
  id: string;
  label: string;
  value: number;
  hint: string;
  tone: AdminKpiTone;
};

export type AdminTrendPoint = {
  label: string;
  value: number;
};

export type AdminActivityStatus = "live" | "soon" | "demo";

export type AdminActivityRow = {
  id: string;
  label: string;
  kind: string;
  status: AdminActivityStatus;
  href: string;
};

export type AdminMetrics = {
  kpis: readonly AdminKpi[];
  trend: readonly AdminTrendPoint[];
  activity: readonly AdminActivityRow[];
  catalog: { videos: number; games: number };
};

/** Catalog snapshot for the `/admin` demo dashboard (static data only). */
export function getAdminMetrics(): AdminMetrics {
  const sectionCount = FREE_LESSONS.reduce(
    (sum, lesson) => sum + lesson.sections.length,
    0,
  );
  const liveTeachers = TEACHERS.filter((t) => !teacherComingSoon(t.id)).length;
  const memberStats = getAdminMemberStats();
  const catalog = catalogTotals();

  const kpis: AdminKpi[] = [
    {
      id: "lessons",
      label: "Free lessons",
      value: FREE_LESSONS.length,
      hint: `${sectionCount} sections in catalog`,
      tone: "emerald",
    },
    {
      id: "playlists",
      label: "Video playlists",
      value: SELF_STUDY_PLAYLISTS.length,
      hint: "Self-study video shelf",
      tone: "sky",
    },
    {
      id: "teachers",
      label: "Teachers",
      value: TEACHERS.length,
      hint: `${liveTeachers} live · ${TEACHERS.length - liveTeachers} soon`,
      tone: "amber",
    },
    {
      id: "members",
      label: "Members",
      value: memberStats.total,
      hint: `${memberStats.active} active · ${memberStats.pending} pending`,
      tone: "orange",
    },
  ];

  // Deterministic weekly curve scaled to catalog size (not live analytics).
  const peak = Math.max(8, sectionCount + SELF_STUDY_PLAYLISTS.length);
  const weights = [0.42, 0.48, 0.55, 0.62, 0.71, 0.84, 1] as const;
  const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
  const trend: AdminTrendPoint[] = weekLabels.map((label, i) => ({
    label,
    value: Math.round(peak * weights[i]),
  }));

  const activity: AdminActivityRow[] = [
    ...FREE_LESSONS.map((lesson) => ({
      id: `lesson-${lesson.id}`,
      label: lesson.title,
      kind: "Lesson",
      status: lesson.available ? ("live" as const) : ("soon" as const),
      href: adminLessonHref(lesson.id),
    })),
    ...SELF_STUDY_PLAYLISTS.slice(0, 4).map((playlist) => ({
      id: `playlist-${playlist.id}`,
      label: playlist.title,
      kind: "Playlist",
      status: "live" as const,
      href: adminVideoHref(playlist.id),
    })),
    ...TEACHERS.map((teacher) => ({
      id: `teacher-${teacher.id}`,
      label: teacher.label,
      kind: "Teacher",
      status: teacherComingSoon(teacher.id)
        ? ("soon" as const)
        : ("live" as const),
      href: adminTeacherHref(teacher.id),
    })),
    ...BUILDERS.map((builder) => ({
      id: `builder-${builder.id}`,
      label: builder.label,
      kind: "Builder",
      status: builder.profile ? ("live" as const) : ("soon" as const),
      href: adminTeamHref(builder.id),
    })),
    ...getAdminMembersActivityRows(5),
    ...getAdminLeaderboardActivityRows(5),
    ...getAdminSiteActivityRows(3),
  ];

  return { kpis, trend, activity, catalog };
}
