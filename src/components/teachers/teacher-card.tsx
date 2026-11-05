"use client";

import Link from "next/link";
import { ArrowRight, CirclePlay, Gamepad2 } from "lucide-react";
import { useMessages } from "@/i18n/locale-context";
import type { Teacher } from "@/data/teachers";
import FrostGlass from "@/components/frost-glass";
import { countLessons } from "@/components/roadmap/roadmap-data";
import { ACCENT_STYLES } from "@/components/teachers/teacher-accent";
import TeacherPortrait from "@/components/teachers/teacher-portrait";
import TeacherProgress from "@/components/teachers/teacher-progress";
import { resetTilt, tiltCard } from "@/components/teachers/teacher-tilt";

export default function TeacherCard({ teacher }: { teacher: Teacher }) {
  const copy = useMessages();
  const accent = ACCENT_STYLES[teacher.accent];
  const { videos, games } = countLessons(teacher.nodes);
  const chip = `stat-chip-3d inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${accent.pill} ${accent.pillText}`;

  return (
    <Link
      href={`/map?teacher=${teacher.id}`}
      onPointerMove={tiltCard}
      onPointerLeave={resetTilt}
      className={`teacher-card-3d group flex h-full flex-col overflow-hidden rounded-[1.75rem] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-700 ${accent.tone}`}
    >
      <span
        aria-hidden
        className="price-card-face pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
      />

      <div className="teacher-stage relative h-28 px-4 pt-3.5">
        <span
          aria-hidden
          className={`stat-chip-3d inline-block rounded-full px-2.5 py-0.5 text-[0.7rem] font-black tracking-wider uppercase ${accent.pill} ${accent.pillText}`}
        >
          {copy.teachers.role}
        </span>
      </div>

      <div className="relative -mt-16 flex flex-1 flex-col items-center px-5 pb-5 text-center">
        <span className="transition-transform duration-300 motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:scale-105">
          <TeacherPortrait src={teacher.image} size="card" />
        </span>
        <h3 className="mt-3 max-w-full truncate text-2xl font-black tracking-tight">{teacher.label}</h3>

        <ul className="mt-3 flex flex-wrap justify-center gap-2 text-sm font-bold">
          <li className={chip}>
            <CirclePlay aria-hidden className="size-4" />
            {copy.teachers.videos(videos)}
          </li>
          <li className={chip}>
            <Gamepad2 aria-hidden className="size-4" />
            {copy.teachers.games(games)}
          </li>
        </ul>

        <span className="my-5 block w-full">
          <TeacherProgress teacher={teacher} />
        </span>

        <span
          className={`relative mt-auto inline-flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-4 font-extrabold text-white transition-[box-shadow,overflow] motion-safe:group-hover:overflow-visible cta-3d ${accent.cta}`}
        >
          <FrostGlass />
          <span className="relative z-10">{copy.teachers.openPath}</span>
          <ArrowRight
            aria-hidden
            className="relative z-10 size-4 transition-transform motion-safe:group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
