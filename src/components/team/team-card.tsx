"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FrostGlass from "@/components/frost-glass";
import TeacherPortrait from "@/components/teachers/teacher-portrait";
import { useMessages } from "@/i18n/locale-context";
import type { TeamPerson } from "@/data/team";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

export default function TeamCard({ person }: { person: TeamPerson }) {
  const copy = useMessages();
  const role = person.kind === "builder" ? copy.team.builderRole : copy.team.teacherRole;

  return (
    <Link
      href={`/team/${person.id}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-b-[6px] border-amber-300 bg-white/90 p-5 shadow-sm transition-transform motion-safe:hover:-translate-y-1 motion-safe:active:translate-y-0.5 motion-safe:active:border-b-2 dark:border-amber-500/40 dark:bg-slate-900/80 ${FOCUS}`}
    >
      <div className="relative flex items-center gap-4">
        <span className="transition-transform motion-safe:group-hover:scale-105">
          <TeacherPortrait src={person.image} size="card" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
            {role}
          </p>
          <h3 className="truncate text-xl font-extrabold tracking-tight">{person.label}</h3>
        </div>
      </div>
      <span className="relative mt-6 inline-flex min-h-11 items-center justify-center gap-2 self-stretch overflow-hidden rounded-2xl border-b-4 border-orange-700 bg-orange-500 px-4 py-2 font-extrabold text-white transition-[background-color,overflow] hover:bg-orange-400 motion-safe:group-hover:overflow-visible">
        <FrostGlass />
        <span className="relative z-10">{copy.team.open}</span>
        <ArrowRight
          aria-hidden
          className="relative z-10 size-4 transition-transform motion-safe:group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
