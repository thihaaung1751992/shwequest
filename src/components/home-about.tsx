"use client";

import { Play, Swords, Users } from "lucide-react";
import { useMessages } from "@/i18n/locale-context";
import { TEACHERS, catalogTotals } from "@/data/teachers";

const TOTALS = catalogTotals();

const STATS = [
  { value: String(TOTALS.videos), id: "videos", Icon: Play },
  { value: String(TOTALS.games), id: "games", Icon: Swords },
  { value: String(TEACHERS.length), id: "teachers", Icon: Users },
] as const;

export default function HomeAbout() {
  const copy = useMessages();

  return (
    <section aria-labelledby="home-about-title" className="bg-cream dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-page flex-col items-center px-4 pt-8 pb-4 sm:pt-12 sm:pb-6">
        <h2
          id="home-about-title"
          className="inline-flex -rotate-2 rounded-full bg-emerald-500 px-3 py-1 text-sm font-semibold text-white motion-reduce:rotate-none"
        >
          {copy.about.title}
        </h2>
        <p className="mt-6 max-w-3xl text-center text-lg leading-snug font-bold text-zinc-700 sm:text-2xl dark:text-zinc-200">
          {copy.about.body}
        </p>
        <ul className="mt-10 grid w-full max-w-4xl sm:mt-14 sm:grid-cols-3 sm:divide-x sm:divide-zinc-200 dark:sm:divide-white/15">
          {STATS.map((stat) => (
            <li
              key={stat.id}
              className="flex flex-col items-center gap-3 border-b border-zinc-200 px-4 py-5 last:border-b-0 sm:border-b-0 sm:px-6 sm:py-0 dark:border-white/15"
            >
              <span className="grid size-20 place-items-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
                <stat.Icon aria-hidden className="size-10" strokeWidth={2.25} />
              </span>
              <span className="flex items-center gap-3">
                <span className="text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl dark:text-white">
                  {stat.value}
                </span>
                <span className="max-w-32 text-left text-sm leading-snug font-medium text-zinc-500 dark:text-zinc-400">
                  {copy.about[stat.id]}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <div
          aria-hidden
          className="mt-16 h-0.5 w-full bg-zinc-300 [clip-path:ellipse(50%_50%_at_50%_50%)] sm:mt-24 dark:bg-white/25"
        />
      </div>
    </section>
  );
}
