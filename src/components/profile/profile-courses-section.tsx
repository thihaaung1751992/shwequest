"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import FrostGlass from "@/components/frost-glass";
import { formatXp } from "@/components/profile/profile-draft";
import { PROFILE_FOCUS } from "@/components/profile/profile-focus";
import TeacherProgress from "@/components/teachers/teacher-progress";
import { ACCENT_STYLES } from "@/components/teachers/teacher-accent";
import { earnedXp } from "@/components/roadmap/roadmap-data";
import {
  TEACHER_PLACEHOLDER_IMAGE,
  TEACHERS,
  teacherById,
  teacherProgress,
  type TeacherAccent,
} from "@/data/teachers";
import { useMessages } from "@/i18n/locale-context";

const RING_COLOR: Record<TeacherAccent, string> = {
  amber: "var(--color-orange-500)",
  sky: "var(--color-sky-500)",
  emerald: "var(--color-emerald-500)",
};

type ProfileCoursesSectionProps = {
  formId: string;
  enrolledTeacherIds: readonly string[];
};

export default function ProfileCoursesSection({
  formId,
  enrolledTeacherIds,
}: ProfileCoursesSectionProps) {
  const copy = useMessages();
  const courses = enrolledTeacherIds
    .map((id) => teacherById(id))
    .filter((teacher): teacher is NonNullable<typeof teacher> => Boolean(teacher));

  return (
    <section aria-labelledby={`${formId}-courses`} className="bento-tile p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="stat-chip-3d pill-3d-amber inline-flex size-11 shrink-0 items-center justify-center rounded-2xl text-amber-950"
          >
            <GraduationCap className="size-5" />
          </span>
          <div>
            <h3 id={`${formId}-courses`} className="text-lg font-black tracking-tight">
              {copy.profile.courses}
            </h3>
            <p className="mt-0.5 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
              {copy.profile.coursesBody}
            </p>
          </div>
        </div>
        <p className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900 tabular-nums dark:bg-white/10 dark:text-amber-100">
          {copy.profile.courseCount(courses.length)}
        </p>
      </div>

      {courses.length === 0 ? (
        <p className="mt-6 rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/60 px-4 py-10 text-center text-sm font-bold text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
          {copy.profile.coursesEmpty}
        </p>
      ) : (
        <ul className="mt-6 grid gap-4">
          {courses.map((teacher) => {
            const accent = ACCENT_STYLES[teacher.accent];
            const xp = earnedXp(teacher.nodes);
            const { percent } = teacherProgress(teacher);
            return (
              <li
                key={teacher.id}
                className={`relative overflow-hidden rounded-[1.5rem] border-2 border-(--card-border) bg-linear-to-br from-white to-(--card-stage-top) p-4 shadow-[inset_0_2px_0_rgb(255_255_255/0.9),0_4px_0_var(--card-edge)] sm:p-5 dark:border-white/10 dark:from-slate-950 dark:to-slate-950 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_4px_0_rgb(255_255_255/0.06)] ${accent.tone}`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <span
                    className="profile-ring relative mx-auto block size-20 shrink-0 rounded-full p-1 sm:mx-0"
                    style={{
                      ["--ring" as string]: percent,
                      ["--ring-color" as string]: RING_COLOR[teacher.accent],
                    }}
                  >
                    <span className="relative block size-full overflow-hidden rounded-full bg-stone-100 ring-2 ring-white dark:bg-stone-800 dark:ring-slate-950">
                      <Image
                        src={teacher.image || TEACHER_PLACEHOLDER_IMAGE}
                        alt=""
                        fill
                        sizes="72px"
                        className="object-cover object-[center_18%]"
                      />
                    </span>
                    <span
                      aria-hidden
                      className={`absolute -right-1 -bottom-1 rounded-full px-1.5 py-0.5 text-[0.625rem] font-black tabular-nums shadow-sm ring-2 ring-white dark:ring-slate-950 ${accent.badge}`}
                    >
                      {percent}%
                    </span>
                  </span>
                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <p className="text-base font-black tracking-tight">{teacher.label}</p>
                    <p className="mt-0.5 text-xs font-bold text-zinc-500 tabular-nums dark:text-zinc-400">
                      {copy.profile.courseXp(formatXp(xp))}
                    </p>
                    <span className="mt-3 block">
                      <TeacherProgress teacher={teacher} />
                    </span>
                  </div>
                  <Link
                    href={`/map?teacher=${teacher.id}`}
                    className={`group relative inline-flex min-h-11 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl px-4 text-sm font-extrabold text-white transition-[box-shadow,overflow] motion-safe:hover:overflow-visible cta-3d ${accent.cta} ${PROFILE_FOCUS}`}
                  >
                    <FrostGlass />
                    <span className="relative z-10">{copy.teachers.openPath}</span>
                    <ArrowRight
                      aria-hidden
                      className="relative z-10 size-4 transition-transform motion-safe:group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {TEACHERS.length > courses.length ? (
        <p className="mt-5 text-center text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          {copy.profile.moreTeachers}{" "}
          <Link
            href="/teachers"
            className={`font-black text-sky-800 underline-offset-2 hover:underline dark:text-sky-300 ${PROFILE_FOCUS}`}
          >
            {copy.nav.teachers}
          </Link>
        </p>
      ) : null}
    </section>
  );
}
