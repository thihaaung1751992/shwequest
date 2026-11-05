"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Code2, GraduationCap } from "lucide-react";
import FrostGlass from "@/components/frost-glass";
import TeamChips from "@/components/team/team-chips";
import { ACCENT_STYLES } from "@/components/teachers/teacher-accent";
import TeacherPortrait from "@/components/teachers/teacher-portrait";
import TeacherProgress from "@/components/teachers/teacher-progress";
import { teacherById } from "@/data/teachers";
import { useMessages } from "@/i18n/locale-context";
import type { TeamPerson } from "@/data/team";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

export default function TeamProfile({ person }: { person: TeamPerson }) {
  const copy = useMessages();
  const accent = ACCENT_STYLES[person.accent];
  const isBuilder = person.kind === "builder";
  const role = isBuilder ? copy.team.builderRole : copy.team.teacherRole;
  const RoleIcon = isBuilder ? Code2 : GraduationCap;
  const teacher = isBuilder ? undefined : teacherById(person.id);

  return (
    <article className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <Link
        href="/team"
        className={`pill-3d pill-3d-amber inline-flex min-h-11 w-fit items-center gap-2 rounded-full px-4 text-sm font-bold text-amber-950 ${FOCUS}`}
      >
        <ArrowLeft aria-hidden className="size-4" />
        {copy.team.back}
      </Link>

      <div
        className={`relative isolate overflow-hidden rounded-[2rem] border-2 border-(--card-border) bg-white shadow-[inset_0_2px_0_rgb(255_255_255/0.9),0_6px_0_var(--card-edge),0_22px_36px_-18px_var(--card-edge)] dark:border-white/10 dark:bg-slate-900 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_6px_0_rgb(255_255_255/0.08)] ${accent.tone}`}
      >
        <span
          aria-hidden
          className="price-card-face pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
        />

        <div className="teacher-stage relative h-36 px-5 pt-4 sm:h-40">
          <span
            className={`stat-chip-3d inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black tracking-wider uppercase ${accent.pill} ${accent.pillText}`}
          >
            <RoleIcon aria-hidden className="size-4" />
            {role}
          </span>
        </div>

        <div className="relative -mt-20 flex flex-col items-center px-5 pb-7 text-center sm:px-8">
          <span className="block motion-safe:animate-hero-bob">
            <TeacherPortrait src={person.image} size="card" />
          </span>
          <h2 className="mt-4 max-w-full text-3xl font-black tracking-tight wrap-break-word sm:text-4xl">
            {person.label}
          </h2>

          <TeamChips person={person} className="mt-4 justify-center" />

          {teacher ? (
            <>
              <span className="mt-6 block w-full max-w-sm">
                <TeacherProgress teacher={teacher} />
              </span>
              <Link
                href={`/map?teacher=${person.id}`}
                className={`group relative mt-7 inline-flex min-h-12 items-center gap-2 overflow-hidden rounded-2xl px-6 font-extrabold text-white transition-[translate,box-shadow,overflow] motion-safe:hover:overflow-visible cta-3d ${accent.cta} ${FOCUS}`}
              >
                <FrostGlass />
                <span className="relative z-10">{copy.team.seeLessons}</span>
                <ArrowRight
                  aria-hidden
                  className="relative z-10 size-4 transition-transform motion-safe:group-hover:translate-x-1"
                />
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}
