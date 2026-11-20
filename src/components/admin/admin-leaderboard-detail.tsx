import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Medal, Trophy } from "lucide-react";
import { ADMIN_LEADERBOARD_FRAME_LABEL } from "@/data/admin-leaderboard";
import type { LeaderboardEntry } from "@/data/leaderboard";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

const FRAME_CHIP: Record<
  LeaderboardEntry["frame"],
  { className: string; Icon: typeof Trophy }
> = {
  orange: {
    className:
      "bg-orange-500/15 text-orange-900 dark:bg-orange-400/15 dark:text-orange-300",
    Icon: Trophy,
  },
  amber: {
    className:
      "bg-amber-500/15 text-amber-900 dark:bg-amber-400/15 dark:text-amber-300",
    Icon: Medal,
  },
  sky: {
    className:
      "bg-sky-500/15 text-sky-800 dark:bg-sky-400/15 dark:text-sky-300",
    Icon: Trophy,
  },
};

export default function AdminLeaderboardDetail({
  entry,
  rankLabel,
  siteHref,
  listHref,
}: {
  entry: LeaderboardEntry;
  rankLabel: string;
  siteHref: string;
  listHref: string;
}) {
  const frameMeta = FRAME_CHIP[entry.frame];
  const FrameIcon = frameMeta.Icon;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={listHref}
          className={`inline-flex items-center gap-1.5 rounded-xl border border-zinc-200/80 bg-white px-3 py-2 text-xs font-bold text-zinc-800 dark:border-white/10 dark:bg-slate-900 dark:text-zinc-100 ${FOCUS}`}
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          All ranks
        </Link>
        <Link
          href={siteHref}
          className={`inline-flex items-center gap-1.5 rounded-xl border border-sky-300/80 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-900 dark:border-sky-500/40 dark:bg-sky-950/40 dark:text-sky-200 ${FOCUS}`}
        >
          Open on site
          <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </div>

      <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:border-white/10 dark:bg-slate-900/80">
        <div className="grid gap-5 p-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:p-5">
          <div className="relative mx-auto aspect-square w-full max-w-44 overflow-hidden rounded-xl bg-zinc-100 dark:bg-white/5 sm:mx-0">
            <Image
              src={entry.image}
              alt=""
              fill
              sizes="176px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[0.7rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              {entry.id}
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
              {entry.displayName}
            </h2>
            <p className="mt-1 font-mono text-sm font-bold tabular-nums text-zinc-600 dark:text-zinc-300">
              Rank #{rankLabel} · {entry.score.toLocaleString("en-US")} XP
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${frameMeta.className}`}
              >
                <FrameIcon className="size-3.5" aria-hidden strokeWidth={2.25} />
                {ADMIN_LEADERBOARD_FRAME_LABEL[entry.frame]}
              </span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                Demo rank
              </span>
            </div>
            <dl className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[0.65rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                  Rank
                </dt>
                <dd className="font-mono font-black tabular-nums text-zinc-900 dark:text-zinc-50">
                  #{rankLabel}
                </dd>
              </div>
              <div>
                <dt className="text-[0.65rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                  Score
                </dt>
                <dd className="font-mono font-black tabular-nums text-zinc-900 dark:text-zinc-50">
                  {entry.score.toLocaleString("en-US")} XP
                </dd>
              </div>
              <div>
                <dt className="text-[0.65rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                  Frame
                </dt>
                <dd className="font-semibold capitalize text-zinc-800 dark:text-zinc-200">
                  {entry.frame}
                </dd>
              </div>
              <div>
                <dt className="text-[0.65rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                  Avatar path
                </dt>
                <dd className="truncate font-mono text-xs font-bold text-zinc-600 dark:text-zinc-300">
                  {entry.image}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-900/60 sm:p-5">
        <p className="text-[0.65rem] font-bold tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
          Demo data only
        </p>
        <p className="mt-1 max-w-2xl text-sm font-medium text-zinc-600 dark:text-zinc-300">
          Scores and names are stand-ins until a real ranking feed exists. The
          public board animation is not mirrored here — open the site board to
          preview learner UX. Source:{" "}
          <span className="font-mono text-xs">LEADERBOARD</span>.
        </p>
      </section>
    </div>
  );
}
