"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { useMessages } from "@/i18n/locale-context";
import FrostGlass from "@/components/frost-glass";
import SelfStudyComingSoon from "@/components/self-study/self-study-coming-soon";
import { ACCENT_STYLES } from "@/components/teachers/teacher-accent";
import { resetTilt, tiltCard } from "@/components/teachers/teacher-tilt";
import { freeLessonHref, type FreeLesson } from "@/data/self-study";

export default function SelfStudyLessonCard({ lesson }: { lesson: FreeLesson }) {
  const copy = useMessages();
  const accent = ACCENT_STYLES[lesson.accent];
  const available = lesson.available === true;

  const shellClass = `teacher-card-3d group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-700 ${accent.tone}${available ? "" : " cursor-not-allowed"}`;

  const body = (
    <>
      <span
        aria-hidden
        className="price-card-face pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
      />

      <div className="teacher-stage relative aspect-video w-full overflow-hidden">
        <Image
          src={lesson.image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-contain transition-transform duration-300${available ? " motion-safe:group-hover:scale-[1.04]" : " opacity-80"}`}
        />
        <span
          aria-hidden
          className={`stat-chip-3d absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.7rem] font-black tracking-wider uppercase ${accent.pill} ${accent.pillText}`}
        >
          {copy.selfStudy.free}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
        <h3 className="line-clamp-2 text-xl font-black tracking-tight sm:text-2xl">
          {lesson.title}
        </h3>
        {lesson.titleMy ? (
          <p
            lang="my"
            className="mt-1.5 line-clamp-2 text-sm font-bold text-zinc-600 dark:text-zinc-300"
          >
            {lesson.titleMy}
          </p>
        ) : null}
        <p
          className={`mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold stat-chip-3d ${accent.pill} ${accent.pillText}`}
        >
          <Clock aria-hidden className="size-3.5" />
          {lesson.duration}
        </p>

        <div className="min-h-5 flex-1" aria-hidden />

        <span
          className={`relative inline-flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-4 font-extrabold text-white transition-[box-shadow,overflow] cta-3d ${accent.cta}${available ? " motion-safe:group-hover:overflow-visible" : " opacity-40"}`}
        >
          <FrostGlass />
          <span className="relative z-10">{copy.selfStudy.openLesson}</span>
          <ArrowRight
            aria-hidden
            className={`relative z-10 size-4 transition-transform${available ? " motion-safe:group-hover:translate-x-1" : ""}`}
          />
        </span>
      </div>

      {!available ? (
        <SelfStudyComingSoon label={copy.selfStudy.comingSoon} />
      ) : null}
    </>
  );

  if (available) {
    return (
      <Link
        href={freeLessonHref(lesson.id)}
        onPointerMove={tiltCard}
        onPointerLeave={resetTilt}
        className={shellClass}
      >
        {body}
      </Link>
    );
  }

  return (
    <div
      className={shellClass}
      aria-disabled="true"
      aria-label={`${lesson.title} — ${copy.selfStudy.comingSoon}`}
    >
      {body}
    </div>
  );
}
