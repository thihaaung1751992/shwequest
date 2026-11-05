"use client";

import { CirclePlay, Gamepad2, GraduationCap } from "lucide-react";
import { useMessages } from "@/i18n/locale-context";
import { catalogTotals, TEACHERS } from "@/data/teachers";
import TeacherPortrait from "@/components/teachers/teacher-portrait";

/** Fixed fan for the decorative portrait stack (index order). */
const FAN = ["-rotate-6", "rotate-3 -translate-y-2", "-rotate-2"] as const;
const BOB_DELAY_MS = 300;

export default function TeachersIntro() {
  const copy = useMessages();
  const { videos, games } = catalogTotals();
  const chip = "stat-chip-3d inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold";

  return (
    <section
      aria-labelledby="teachers-title"
      className="teacher-stage teacher-tone-amber relative overflow-hidden rounded-[2rem] border-2 border-amber-300 px-5 py-7 shadow-[inset_0_2px_0_rgb(255_255_255/0.9),0_5px_0_var(--color-amber-300),0_20px_36px_-18px_rgb(180_83_9/0.45)] sm:px-8 sm:py-9 dark:border-white/10 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_5px_0_rgb(255_255_255/0.08)]"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="pill-3d pill-3d-orange inline-flex -rotate-2 items-center gap-1.5 rounded-full px-3.5 py-1 text-sm font-bold text-orange-950 motion-reduce:rotate-none">
            <GraduationCap aria-hidden className="size-4" />
            {copy.teachers.kicker}
          </p>
          <h2
            id="teachers-title"
            className="mt-4 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl dark:text-white"
          >
            {copy.teachers.title}
          </h2>
          <p className="mt-2 max-w-prose text-sm font-medium text-zinc-700 sm:text-base dark:text-zinc-300">
            {copy.teachers.body}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            <li className={`${chip} pill-3d-amber text-amber-950`}>
              <GraduationCap aria-hidden className="size-4" />
              {copy.teachers.teacherCount(TEACHERS.length)}
            </li>
            <li className={`${chip} pill-3d-sky text-sky-950`}>
              <CirclePlay aria-hidden className="size-4" />
              {copy.teachers.videos(videos)}
            </li>
            <li className={`${chip} pill-3d-emerald text-white`}>
              <Gamepad2 aria-hidden className="size-4" />
              {copy.teachers.games(games)}
            </li>
          </ul>
        </div>

        <div aria-hidden className="hidden shrink-0 items-center pr-2 sm:flex">
          {TEACHERS.slice(0, FAN.length).map((teacher, index) => (
            <span
              key={teacher.id}
              className={`-ml-5 first:ml-0 ${FAN[index]}`}
            >
              <span
                className="block motion-safe:animate-hero-bob"
                style={{ animationDelay: `${index * BOB_DELAY_MS}ms` }}
              >
                <TeacherPortrait src={teacher.image} size="tile" />
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
