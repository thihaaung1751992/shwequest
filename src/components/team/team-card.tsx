"use client";

import Link from "next/link";
import { ArrowRight, Code2, GraduationCap } from "lucide-react";
import FrostGlass from "@/components/frost-glass";
import TeamChips from "@/components/team/team-chips";
import { ACCENT_STYLES } from "@/components/teachers/teacher-accent";
import TeacherPortrait from "@/components/teachers/teacher-portrait";
import { resetTilt, tiltCard } from "@/components/teachers/teacher-tilt";
import { useMessages } from "@/i18n/locale-context";
import type { TeamPerson } from "@/data/team";

export default function TeamCard({ person }: { person: TeamPerson }) {
  const copy = useMessages();
  const accent = ACCENT_STYLES[person.accent];
  const isBuilder = person.kind === "builder";
  const role = isBuilder ? copy.team.builderRole : copy.team.teacherRole;
  const RoleIcon = isBuilder ? Code2 : GraduationCap;

  return (
    <Link
      href={`/team/${person.id}`}
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
          className={`stat-chip-3d inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.7rem] font-black tracking-wider uppercase ${accent.pill} ${accent.pillText}`}
        >
          <RoleIcon aria-hidden className="size-3.5" />
          {role}
        </span>
      </div>

      <div className="relative -mt-16 flex flex-1 flex-col items-center px-5 pb-5 text-center">
        <span className="transition-transform duration-300 motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:scale-105">
          <TeacherPortrait src={person.image} size="card" />
        </span>
        <h3 className="mt-3 max-w-full truncate text-2xl font-black tracking-tight">
          {person.label}
        </h3>

        <TeamChips person={person} className="mt-3 justify-center" />

        <span className="mt-auto block w-full pt-6">
          <span
            className={`relative inline-flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-4 font-extrabold text-white transition-[box-shadow,overflow] motion-safe:group-hover:overflow-visible cta-3d ${accent.cta}`}
          >
            <FrostGlass />
            <span className="relative z-10">{copy.team.open}</span>
            <ArrowRight
              aria-hidden
              className="relative z-10 size-4 transition-transform motion-safe:group-hover:translate-x-1"
            />
          </span>
        </span>
      </div>
    </Link>
  );
}
