"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CircleDashed,
  CircleDot,
  Layers,
} from "lucide-react";
import type {
  AdminLessonRow,
  AdminLessonStats,
  AdminLessonStatus,
} from "@/data/admin-lessons";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

type Filter = "all" | AdminLessonStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "soon", label: "Soon" },
];

const STATUS: Record<
  AdminLessonStatus,
  { label: string; className: string; Icon: typeof CircleDot }
> = {
  live: {
    label: "Live",
    className:
      "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300",
    Icon: CircleDot,
  },
  soon: {
    label: "Soon",
    className:
      "bg-amber-500/15 text-amber-900 dark:bg-amber-400/15 dark:text-amber-300",
    Icon: CircleDashed,
  },
};

export default function AdminLessonsCatalog({
  stats,
  rows,
}: {
  stats: AdminLessonStats;
  rows: readonly AdminLessonRow[];
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(() => {
    if (filter === "all") return rows;
    return rows.filter((row) => row.status === filter);
  }, [filter, rows]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <section className="rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-900/60 sm:p-5">
        <p className="text-[0.65rem] font-bold tracking-wide text-amber-700 uppercase dark:text-amber-400">
          Free lessons catalog
        </p>
        <p className="mt-1 max-w-2xl text-sm font-medium text-zinc-600 dark:text-zinc-300">
          Manage the static self-study lesson index inside admin. Counts come
          from <span className="font-mono text-xs">FREE_LESSONS</span> — not a
          live CMS. Open a row to inspect sections; use “Open on site” only when
          you need the learner course.
        </p>
      </section>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            id: "total",
            label: "Total lessons",
            value: stats.total,
            hint: "Catalog entries",
            Icon: BookOpen,
            chip: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
            icon: "text-emerald-600 dark:text-emerald-400",
          },
          {
            id: "live",
            label: "Live",
            value: stats.live,
            hint: "available = true",
            Icon: CircleDot,
            chip: "bg-sky-500/15 text-sky-800 dark:text-sky-300",
            icon: "text-sky-600 dark:text-sky-400",
          },
          {
            id: "soon",
            label: "Coming soon",
            value: stats.soon,
            hint: "Not yet clickable on site",
            Icon: CircleDashed,
            chip: "bg-amber-500/15 text-amber-900 dark:text-amber-300",
            icon: "text-amber-600 dark:text-amber-400",
          },
          {
            id: "sections",
            label: "Sections",
            value: stats.sections,
            hint: "Across all lessons",
            Icon: Layers,
            chip: "bg-orange-500/15 text-orange-900 dark:text-orange-300",
            icon: "text-orange-600 dark:text-orange-400",
          },
        ].map((kpi) => {
          const Icon = kpi.Icon;
          return (
            <li
              key={kpi.id}
              className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:border-white/10 dark:bg-slate-900/80"
            >
              <span
                className={`inline-flex size-9 items-center justify-center rounded-xl ${kpi.chip}`}
              >
                <Icon className={`size-4.5 ${kpi.icon}`} aria-hidden strokeWidth={2.25} />
              </span>
              <p className="mt-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                {kpi.label}
              </p>
              <p className="mt-1 font-mono text-3xl font-black tracking-tight text-zinc-900 tabular-nums dark:text-zinc-50">
                {kpi.value.toLocaleString("en-US")}
              </p>
              <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {kpi.hint}
              </p>
            </li>
          );
        })}
      </ul>

      <section
        aria-labelledby="admin-lessons-heading"
        className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:border-white/10 dark:bg-slate-900/80"
      >
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-zinc-200/80 px-4 py-4 dark:border-white/10 sm:px-5">
          <div>
            <p className="text-[0.65rem] font-bold tracking-wide text-sky-700 uppercase dark:text-sky-400">
              Lesson index
            </p>
            <h2
              id="admin-lessons-heading"
              className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              All free lessons
            </h2>
          </div>
          <div
            role="group"
            aria-label="Filter by status"
            className="flex flex-wrap gap-1.5"
          >
            {FILTERS.map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(item.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${FOCUS} ${
                    active
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-200 dark:hover:bg-white/15"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200/80 text-[0.7rem] font-bold tracking-wide text-zinc-500 uppercase dark:border-white/10 dark:text-zinc-400">
                <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                  Lesson
                </th>
                <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                  Accent
                </th>
                <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                  Duration
                </th>
                <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                  Sections
                </th>
                <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-right font-bold sm:px-5">
                  Manage
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400 sm:px-5"
                  >
                    No lessons match this filter.
                  </td>
                </tr>
              ) : (
                visible.map((row) => {
                  const status = STATUS[row.status];
                  const StatusIcon = status.Icon;
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-zinc-100 last:border-0 dark:border-white/5"
                    >
                      <td className="max-w-[18rem] px-4 py-3 sm:px-5">
                        <p className="truncate font-semibold text-zinc-900 dark:text-zinc-50">
                          {row.title}
                        </p>
                        <p className="mt-0.5 font-mono text-[0.7rem] font-bold text-zinc-500 dark:text-zinc-400">
                          {row.id}
                        </p>
                        {row.titleMy ? (
                          <p
                            lang="my"
                            className="mt-0.5 truncate text-xs font-medium text-zinc-500 dark:text-zinc-400"
                          >
                            {row.titleMy}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 capitalize text-zinc-600 dark:text-zinc-300 sm:px-5">
                        {row.accent}
                      </td>
                      <td className="px-4 py-3 font-mono tabular-nums text-zinc-600 dark:text-zinc-300 sm:px-5">
                        {row.duration}
                      </td>
                      <td className="px-4 py-3 font-mono tabular-nums text-zinc-600 dark:text-zinc-300 sm:px-5">
                        {row.sectionCount}
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${status.className}`}
                        >
                          <StatusIcon
                            className="size-3.5"
                            aria-hidden
                            strokeWidth={2.25}
                          />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right sm:px-5">
                        <Link
                          href={row.href}
                          className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-sky-700 transition-colors hover:bg-sky-500/10 dark:text-sky-300 ${FOCUS}`}
                        >
                          Open
                          <ArrowUpRight className="size-3.5" aria-hidden />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <p className="border-t border-zinc-200/80 px-4 py-3 text-xs font-medium text-zinc-500 dark:border-white/10 dark:text-zinc-400 sm:px-5">
          Showing {visible.length} of {rows.length} lessons
        </p>
      </section>
    </div>
  );
}
