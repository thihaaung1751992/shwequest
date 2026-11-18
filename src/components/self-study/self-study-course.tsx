"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ACCENT_STYLES } from "@/components/teachers/teacher-accent";
import { useMessages } from "@/i18n/locale-context";
import type { FreeLesson } from "@/data/self-study";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

export default function SelfStudyCourse({ lesson }: { lesson: FreeLesson }) {
  const copy = useMessages();
  const accent = ACCENT_STYLES[lesson.accent];
  const firstSectionId = lesson.sections[0]?.id ?? "";
  const [activeId, setActiveId] = useState(firstSectionId);
  const activeIndex = lesson.sections.findIndex((section) => section.id === activeId);
  const activeSection =
    activeIndex >= 0 ? lesson.sections[activeIndex] : lesson.sections[0];
  const activeNumber = activeIndex >= 0 ? activeIndex + 1 : 1;

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/self-study"
        className={`pill-3d pill-3d-amber inline-flex min-h-11 w-fit items-center gap-2 rounded-full px-4 text-sm font-bold text-amber-950 ${FOCUS}`}
      >
        <ArrowLeft aria-hidden className="size-4" />
        {copy.selfStudy.back}
      </Link>

      <div className="grid gap-5 lg:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)] lg:items-start">
        <aside
          aria-label={copy.selfStudy.sections}
          className={`teacher-card-3d relative flex max-h-[min(70vh,42rem)] flex-col overflow-hidden rounded-[1.75rem] p-4 sm:p-5 lg:max-h-[calc(100vh-10rem)] ${accent.tone}`}
        >
          <span
            aria-hidden
            className="price-card-face pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
          />
          <p
            className={`stat-chip-3d inline-flex rounded-full px-2.5 py-0.5 text-[0.7rem] font-black tracking-wider uppercase ${accent.pill} ${accent.pillText}`}
          >
            {copy.selfStudy.free}
          </p>
          <h2 className="mt-3 shrink-0 text-xl font-black tracking-tight sm:text-2xl">
            {lesson.title}
          </h2>
          <nav
            aria-label={copy.selfStudy.sections}
            className="mt-5 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain pe-1"
          >
            <ul className="flex min-w-0 flex-col gap-1.5">
              {lesson.sections.map((section, index) => {
                const current = section.id === activeId;
                return (
                  <li key={section.id} className="min-w-0">
                    <button
                      type="button"
                      aria-current={current ? "true" : undefined}
                      onClick={() => setActiveId(section.id)}
                      className={`flex w-full min-h-11 min-w-0 cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-bold tracking-tight transition-colors ${FOCUS} ${
                        current
                          ? "bg-white text-zinc-950 shadow-[0_6px_14px_-10px_rgba(15,23,42,0.35)] dark:bg-slate-800 dark:text-white"
                          : "text-zinc-700 hover:bg-white/70 dark:text-zinc-200 dark:hover:bg-white/10"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`grid h-7 min-w-7 shrink-0 place-items-center rounded-full px-1 text-xs font-black tabular-nums ${
                          current
                            ? accent.badge
                            : "bg-zinc-200/80 text-zinc-600 dark:bg-white/10 dark:text-zinc-300"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1 wrap-break-word leading-snug">
                        {section.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <section
          aria-label={copy.selfStudy.content}
          aria-live="polite"
          className={`teacher-card-3d relative flex min-h-[18rem] flex-col overflow-hidden rounded-[1.75rem] p-5 sm:min-h-[24rem] sm:p-7 lg:min-h-[calc(100vh-10rem)] ${accent.tone}`}
        >
          <span
            aria-hidden
            className="price-card-face pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
          />
          {activeSection ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="teacher-stage relative overflow-hidden rounded-[1.35rem] px-5 py-6 sm:px-7 sm:py-8">
                <p
                  className={`stat-chip-3d inline-flex rounded-full px-2.5 py-0.5 text-[0.7rem] font-black tracking-wider tabular-nums ${accent.pill} ${accent.pillText}`}
                >
                  {activeNumber} / {lesson.sections.length}
                </p>
                <h3 className="mt-4 text-3xl font-black tracking-tight text-balance text-zinc-950 sm:text-4xl lg:text-5xl dark:text-white">
                  {activeSection.title}
                </h3>
              </div>
              {activeSection.bodyMy ? (
                <p className="mt-6 text-xl leading-relaxed font-bold text-zinc-800 sm:text-2xl sm:leading-relaxed dark:text-zinc-100">
                  {activeSection.bodyMy}
                </p>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
