"use client";

import Link from "next/link";
import { ArrowRight, CirclePlay, Gamepad2 } from "lucide-react";
import { useMessages } from "@/i18n/locale-context";
import FrostGlass from "@/components/frost-glass";
import SelfStudyComingSoon, {
  SelfStudyComingSoonPill,
} from "@/components/self-study/self-study-coming-soon";
import { countLessons } from "@/components/roadmap/roadmap-data";
import { ACCENT_STYLES } from "@/components/teachers/teacher-accent";
import TeacherPortrait from "@/components/teachers/teacher-portrait";
import TeacherProgress from "@/components/teachers/teacher-progress";
import { teacherComingSoon, type Teacher } from "@/data/teachers";

export default function TeacherListRow({ teacher }: { teacher: Teacher }) {
  const copy = useMessages();
  const accent = ACCENT_STYLES[teacher.accent];
  const { videos, games } = countLessons(teacher.nodes);
  const available = !teacherComingSoon(teacher.id);
  const shellClass = `teacher-card-3d group relative flex min-h-20 items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-700 sm:gap-4 sm:px-4 ${accent.tone}${available ? "" : " cursor-not-allowed"}`;

  const body = (
    <>
      <span className={`teacher-stage shrink-0 rounded-[0.9rem] p-1.5${available ? "" : " opacity-80"}`}>
        <TeacherPortrait src={teacher.image} size="list" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-black tracking-tight">{teacher.label}</span>{" "}
        <span className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs font-bold text-zinc-600 dark:text-zinc-300">
          <span className="inline-flex items-center gap-1">
            <CirclePlay aria-hidden className="size-3.5" />
            {copy.teachers.videos(videos)}
          </span>
          <span className="sr-only">, </span>
          <span className="inline-flex items-center gap-1">
            <Gamepad2 aria-hidden className="size-3.5" />
            {copy.teachers.games(games)}
          </span>
        </span>
        <span className="mt-2 block max-w-xs">
          <TeacherProgress teacher={teacher} variant="bar" />
        </span>
      </span>
      {available ? (
        <span
          className={`relative inline-flex min-h-10 shrink-0 items-center gap-1.5 overflow-hidden rounded-xl px-3 text-sm font-extrabold text-white transition-[box-shadow,overflow] motion-safe:group-hover:overflow-visible cta-3d ${accent.cta}`}
        >
          <FrostGlass />
          <span className="relative z-10 hidden sm:inline">{copy.teachers.openPath}</span>
          <ArrowRight aria-hidden className="relative z-10 size-4" />
        </span>
      ) : (
        <>
          <SelfStudyComingSoon label={copy.teachers.comingSoon} variant="row" />
          <SelfStudyComingSoonPill label={copy.teachers.comingSoon} />
        </>
      )}
    </>
  );

  if (available) {
    return (
      <Link href={`/map?teacher=${teacher.id}`} className={shellClass}>
        {body}
      </Link>
    );
  }

  return (
    <div
      className={shellClass}
      aria-disabled="true"
      aria-label={`${teacher.label} — ${copy.teachers.comingSoon}`}
    >
      {body}
    </div>
  );
}
