"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { useMessages } from "@/i18n/locale-context";
import FrostGlass from "@/components/frost-glass";
import { ACCENT_STYLES } from "@/components/teachers/teacher-accent";
import { resetTilt, tiltCard } from "@/components/teachers/teacher-tilt";
import type { FreeLesson } from "@/data/self-study";

/** Interim player until each free lesson has its own watch route. */
const LESSON_HREF = "/test-video";

export default function SelfStudyLessonCard({ lesson }: { lesson: FreeLesson }) {
  const copy = useMessages();
  const accent = ACCENT_STYLES[lesson.accent];

  return (
    <Link
      href={LESSON_HREF}
      onPointerMove={tiltCard}
      onPointerLeave={resetTilt}
      className={`teacher-card-3d group flex h-full flex-col overflow-hidden rounded-[1.75rem] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-700 ${accent.tone}`}
    >
      <span
        aria-hidden
        className="price-card-face pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
      />

      <div className="teacher-stage relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={lesson.image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.04]"
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
        <p
          className={`mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold stat-chip-3d ${accent.pill} ${accent.pillText}`}
        >
          <Clock aria-hidden className="size-3.5" />
          {lesson.duration}
        </p>

        <span
          className={`relative mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-4 font-extrabold text-white transition-[box-shadow,overflow] motion-safe:group-hover:overflow-visible cta-3d ${accent.cta}`}
        >
          <FrostGlass />
          <span className="relative z-10">{copy.selfStudy.openLesson}</span>
          <ArrowRight
            aria-hidden
            className="relative z-10 size-4 transition-transform motion-safe:group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
