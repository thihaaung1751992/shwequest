import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CircleDashed,
  CircleDot,
  CirclePlay,
  Gamepad2,
  Layers,
} from "lucide-react";
import type { AdminTeacherStatus } from "@/data/admin-teachers";
import type { Teacher } from "@/data/teachers";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

const STATUS: Record<
  AdminTeacherStatus,
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

export default function AdminTeacherDetail({
  teacher,
  status,
  siteHref,
  listHref,
  videos,
  games,
  units,
  progress,
}: {
  teacher: Teacher;
  status: AdminTeacherStatus;
  siteHref: string;
  listHref: string;
  videos: number;
  games: number;
  units: number;
  progress: { done: number; total: number; percent: number };
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
          All teachers
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
          <div className="relative mx-auto aspect-square w-full max-w-44 overflow-hidden rounded-xl bg-zinc-100 dark:bg-white/5 sm:mx-0">
            <Image
              src={teacher.image}
              alt=""
              fill
              sizes="176px"
              className="object-cover object-[center_18%]"
            />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[0.7rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              {teacher.id}
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
              {teacher.label}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${statusMeta.className}`}
              >
                <StatusIcon className="size-3.5" aria-hidden strokeWidth={2.25} />
                {statusMeta.label}
              </span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold capitalize text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                {teacher.accent}
              </span>
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between gap-3 text-xs font-bold text-zinc-500 dark:text-zinc-400">
                <span>Path progress</span>
                <span className="font-mono tabular-nums">
                  {progress.done}/{progress.total} · {progress.percent}%
                </span>
              </div>
              <div
                className="mt-2 h-2.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10"
                role="progressbar"
                aria-valuenow={progress.percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Path progress"
              >
                <div
                  className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ul className="grid gap-3 sm:grid-cols-3">
        {[
          {
            id: "videos",
            label: "Path videos",
            value: videos,
            Icon: CirclePlay,
            chip: "bg-sky-500/15 text-sky-800 dark:text-sky-300",
            icon: "text-sky-600 dark:text-sky-400",
          },
          {
            id: "games",
            label: "Path games",
            value: games,
            Icon: Gamepad2,
            chip: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
            icon: "text-emerald-600 dark:text-emerald-400",
          },
          {
            id: "units",
            label: "Units",
            value: units,
            Icon: Layers,
            chip: "bg-amber-500/15 text-amber-900 dark:text-amber-300",
            icon: "text-amber-600 dark:text-amber-400",
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
                <Icon
                  className={`size-4.5 ${kpi.icon}`}
                  aria-hidden
                  strokeWidth={2.25}
                />
              </span>
              <p className="mt-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                {kpi.label}
              </p>
              <p className="mt-1 font-mono text-3xl font-black tracking-tight text-zinc-900 tabular-nums dark:text-zinc-50">
                {kpi.value.toLocaleString("en-US")}
              </p>
            </li>
          );
        })}
      </ul>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-900/60 sm:p-5">
        <p className="text-[0.65rem] font-bold tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
          Summary only
        </p>
        <p className="mt-1 max-w-2xl text-sm font-medium text-zinc-600 dark:text-zinc-300">
          Node titles are not listed here — open the learner map when the
          teacher is live. Catalog is static demo data from{" "}
          <span className="font-mono text-xs">TEACHERS</span>.
        </p>
      </section>
    </div>
  );
}
