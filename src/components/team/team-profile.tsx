"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import FrostGlass from "@/components/frost-glass";
import TeacherPortrait from "@/components/teachers/teacher-portrait";
import { useMessages } from "@/i18n/locale-context";
import type { TeamPerson } from "@/data/team";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

export default function TeamProfile({ person }: { person: TeamPerson }) {
  const copy = useMessages();
  const role = person.kind === "builder" ? copy.team.builderRole : copy.team.teacherRole;

  return (
    <article className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <Link
        href="/team"
        className={`inline-flex min-h-11 w-fit items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-200 ${FOCUS}`}
      >
        <ArrowLeft aria-hidden className="size-4" />
        {copy.team.back}
      </Link>

      <div className="flex flex-col items-start gap-5 rounded-3xl border-2 border-amber-200 bg-white/90 p-5 sm:flex-row sm:items-center dark:border-white/10 dark:bg-slate-900/80">
        <TeacherPortrait src={person.image} size="card" />
        <div className="min-w-0">
          <p className="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
            {role}
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight">{person.label}</h2>
        </div>
      </div>

      {person.kind === "teacher" ? (
        <Link
          href={`/map?teacher=${person.id}`}
          className={`group relative inline-flex min-h-11 w-fit items-center gap-2 overflow-hidden rounded-full bg-zinc-950 px-4 text-sm font-bold text-white transition-[overflow] motion-safe:hover:overflow-visible dark:bg-white dark:text-zinc-950 ${FOCUS}`}
        >
          <FrostGlass />
          <span className="relative z-10">{copy.team.seeLessons}</span>
          <ArrowRight aria-hidden className="relative z-10 size-4" />
        </Link>
      ) : null}
    </article>
  );
}
