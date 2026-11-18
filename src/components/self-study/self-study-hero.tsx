"use client";

import { BookOpen, Sparkles } from "lucide-react";
import { useMessages } from "@/i18n/locale-context";

export default function SelfStudyHero() {
  const copy = useMessages();

  return (
    <section
      aria-labelledby="self-study-title"
      className="teacher-stage teacher-tone-emerald relative overflow-hidden rounded-[2rem] border-2 border-emerald-300 px-5 py-7 shadow-[inset_0_2px_0_rgb(255_255_255/0.9),0_5px_0_var(--color-emerald-300),0_20px_36px_-18px_rgb(4_120_87/0.4)] sm:px-8 sm:py-9 dark:border-white/10 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_5px_0_rgb(255_255_255/0.08)]"
    >
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="pill-3d pill-3d-emerald inline-flex -rotate-2 items-center gap-1.5 rounded-full px-3.5 py-1 text-sm font-bold text-white motion-reduce:rotate-none">
            <BookOpen aria-hidden className="size-4" />
            {copy.selfStudy.kicker}
          </p>
          <h2
            id="self-study-title"
            className="mt-4 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl dark:text-white"
          >
            {copy.selfStudy.title}
          </h2>
          <p className="mt-2 max-w-prose text-sm font-medium text-zinc-700 sm:text-base dark:text-zinc-300">
            {copy.selfStudy.body}
          </p>
        </div>

        <div
          className="stat-chip-3d pill-3d-emerald-deep relative mx-auto w-full max-w-[16rem] shrink-0 rotate-2 rounded-[1.75rem] px-6 pt-5 pb-6 text-center text-white motion-safe:animate-hero-bob motion-reduce:rotate-none sm:mx-0 sm:max-w-[18rem]"
          aria-label={`${copy.selfStudy.priceLabel}: ${copy.selfStudy.free}`}
        >
          <Sparkles
            aria-hidden
            className="absolute top-3 right-3 size-5 text-emerald-100 opacity-90"
          />
          <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-emerald-100">
            {copy.selfStudy.priceLabel}
          </p>
          <p className="mt-2 text-5xl leading-none font-black tracking-tight sm:text-6xl">
            {copy.selfStudy.free}
          </p>
          <p className="mt-3 text-sm font-bold text-emerald-100/90">
            {copy.selfStudy.priceHint}
          </p>
        </div>
      </div>
    </section>
  );
}
