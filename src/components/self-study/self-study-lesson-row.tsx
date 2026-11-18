"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { useMessages } from "@/i18n/locale-context";
import FrostGlass from "@/components/frost-glass";
import { ACCENT_STYLES } from "@/components/teachers/teacher-accent";
import { freeLessonHref, type FreeLesson } from "@/data/self-study";

export default function SelfStudyLessonRow({ lesson }: { lesson: FreeLesson }) {
  const copy = useMessages();
  const accent = ACCENT_STYLES[lesson.accent];

  return (
    <Link
      href={freeLessonHref(lesson.id)}
      className={`teacher-card-3d group flex min-h-24 items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-700 sm:gap-4 sm:px-4 ${accent.tone}`}
    >
      <span className="teacher-stage relative h-20 w-28 shrink-0 overflow-hidden rounded-[0.9rem] sm:h-24 sm:w-36">
        <Image
          src={lesson.image}
          alt=""
          fill
          sizes="144px"
          className="object-cover"
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-black tracking-tight sm:text-lg">
          {lesson.title}
        </span>
        <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-zinc-600 dark:text-zinc-300">
          <Clock aria-hidden className="size-3.5" />
          {lesson.duration}
        </span>
      </span>
      <span
        className={`relative inline-flex min-h-10 shrink-0 items-center gap-1.5 overflow-hidden rounded-xl px-3 text-sm font-extrabold text-white transition-[box-shadow,overflow] motion-safe:group-hover:overflow-visible cta-3d ${accent.cta}`}
      >
        <FrostGlass />
        <span className="relative z-10 hidden sm:inline">{copy.selfStudy.openLesson}</span>
        <ArrowRight aria-hidden className="relative z-10 size-4" />
      </span>
    </Link>
  );
}
