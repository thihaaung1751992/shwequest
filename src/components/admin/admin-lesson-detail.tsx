import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CircleDashed,
  CircleDot,
} from "lucide-react";
import type { AdminLessonStatus } from "@/data/admin-lessons";
import type { FreeLesson } from "@/data/self-study";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

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

export default function AdminLessonDetail({
  lesson,
  status,
  siteHref,
  listHref,
}: {
  lesson: FreeLesson;
  status: AdminLessonStatus;
  siteHref: string;
  listHref: string;
}) {
  const statusMeta = STATUS[status];
  const StatusIcon = statusMeta.Icon;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={listHref}
          className={`inline-flex items-center gap-1.5 rounded-xl border border-zinc-200/80 bg-white px-3 py-2 text-xs font-bold text-zinc-800 dark:border-white/10 dark:bg-slate-900 dark:text-zinc-100 ${FOCUS}`}
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          All lessons
        </Link>
        {status === "live" ? (
          <Link
            href={siteHref}
            className={`inline-flex items-center gap-1.5 rounded-xl border border-sky-300/80 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-900 dark:border-sky-500/40 dark:bg-sky-950/40 dark:text-sky-200 ${FOCUS}`}
          >
            Open on site
            <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200/80 bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
            Not live on site yet
          </span>
        )}
      </div>

      <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:border-white/10 dark:bg-slate-900/80">
        <div className="grid gap-5 p-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:p-5">
          <div className="relative mx-auto aspect-4/3 w-full max-w-44 overflow-hidden rounded-xl bg-zinc-100 dark:bg-white/5 sm:mx-0">
            <Image
              src={lesson.image}
              alt=""
              fill
              sizes="176px"
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[0.7rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              {lesson.id}
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
              {lesson.title}
            </h2>
            {lesson.titleMy ? (
              <p
                lang="my"
                className="mt-1 text-sm font-bold text-zinc-600 dark:text-zinc-300"
              >
                {lesson.titleMy}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${statusMeta.className}`}
              >
                <StatusIcon className="size-3.5" aria-hidden strokeWidth={2.25} />
                {statusMeta.label}
              </span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold capitalize text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                {lesson.accent}
              </span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-mono text-xs font-bold tabular-nums text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                {lesson.duration}
              </span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-mono text-xs font-bold tabular-nums text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                {lesson.sections.length} sections
              </span>
            </div>
            {lesson.descriptionMy ? (
              <p
                lang="my"
                className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-300"
              >
                {lesson.descriptionMy}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="admin-lesson-sections-heading"
        className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:border-white/10 dark:bg-slate-900/80"
      >
        <div className="border-b border-zinc-200/80 px-4 py-4 dark:border-white/10 sm:px-5">
          <p className="text-[0.65rem] font-bold tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
            Section inventory
          </p>
          <h3
            id="admin-lesson-sections-heading"
            className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Titles only — no dialog bodies
          </h3>
        </div>
        <ol className="max-h-[min(36rem,70vh)] divide-y divide-zinc-100 overflow-y-auto dark:divide-white/5">
          {lesson.sections.map((section, index) => (
            <li
              key={section.id}
              className="flex items-start gap-3 px-4 py-3 sm:px-5"
            >
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-zinc-100 font-mono text-[0.7rem] font-black tabular-nums text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {section.title}
                </p>
                <p className="mt-0.5 font-mono text-[0.7rem] font-bold text-zinc-500 dark:text-zinc-400">
                  {section.id}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
