"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { Crown, Flag, Star, TrendingUp, Trophy, Users } from "lucide-react";
import { useMessages } from "@/i18n/locale-context";
import { CountUp, CountUpScope } from "@/components/count-up";
import { LEARNER } from "@/data/learner";
import {
  formatRank,
  type LeaderboardEntry,
  type LeaderboardFrame,
  LEADERBOARD,
} from "@/data/leaderboard";
import { earnedXpTotal } from "@/data/teachers";

const PODIUM_ORDER = [2, 1, 3] as const;
const LANE_STAGGER_MS = 90;
/** Badges drop in after their step has mostly grown. */
const BADGE_AFTER_STEP_MS = 450;
/** Runners stay inside the lane so the token never touches the edges. */
const RUN_MIN = 8;
const RUN_MAX = 92;

type Place = (typeof PODIUM_ORDER)[number];

const PODIUM: Record<Place, { tier: string; step: string; badge: string; delayMs: number }> = {
  1: { tier: "lb-tier-gold", step: "h-32 sm:h-44", badge: "w-24 sm:w-32", delayMs: 400 },
  2: { tier: "lb-tier-silver", step: "h-24 sm:h-32", badge: "w-20 sm:w-24", delayMs: 200 },
  3: { tier: "lb-tier-bronze", step: "h-16 sm:h-24", badge: "w-20 sm:w-24", delayMs: 0 },
};

const RUNNER_RING: Record<LeaderboardFrame, string> = {
  orange: "ring-orange-300",
  amber: "ring-amber-300",
  sky: "ring-sky-300",
};

const CONFETTI = [
  { left: "4%", delay: 0, duration: 3.2, color: "bg-sky-400", size: "h-3 w-1.5", drift: "2rem", spin: "540deg" },
  { left: "10%", delay: 0.5, duration: 3.6, color: "bg-white", size: "size-2", drift: "-1.5rem", spin: "420deg" },
  { left: "17%", delay: 0.2, duration: 3, color: "bg-emerald-400", size: "h-2.5 w-1.5", drift: "3rem", spin: "-480deg" },
  { left: "24%", delay: 0.9, duration: 3.4, color: "bg-rose-400", size: "h-3 w-1.5", drift: "-2rem", spin: "600deg" },
  { left: "31%", delay: 0.3, duration: 3.8, color: "bg-amber-200", size: "size-2", drift: "1rem", spin: "-360deg" },
  { left: "38%", delay: 1.1, duration: 3.1, color: "bg-sky-300", size: "h-2.5 w-1.5", drift: "-3rem", spin: "520deg" },
  { left: "45%", delay: 0.1, duration: 3.5, color: "bg-white", size: "h-3 w-1.5", drift: "2.5rem", spin: "-560deg" },
  { left: "52%", delay: 0.7, duration: 3.3, color: "bg-emerald-300", size: "size-2", drift: "-1rem", spin: "440deg" },
  { left: "59%", delay: 0.4, duration: 3.7, color: "bg-rose-300", size: "h-2.5 w-1.5", drift: "3rem", spin: "-500deg" },
  { left: "66%", delay: 1, duration: 3, color: "bg-sky-400", size: "h-3 w-1.5", drift: "-2.5rem", spin: "580deg" },
  { left: "73%", delay: 0.2, duration: 3.6, color: "bg-amber-100", size: "size-2", drift: "1.5rem", spin: "-420deg" },
  { left: "80%", delay: 0.8, duration: 3.2, color: "bg-emerald-400", size: "h-2.5 w-1.5", drift: "-2rem", spin: "500deg" },
  { left: "87%", delay: 0.35, duration: 3.9, color: "bg-white", size: "h-3 w-1.5", drift: "2rem", spin: "-620deg" },
  { left: "94%", delay: 0.6, duration: 3.4, color: "bg-rose-400", size: "size-2", drift: "-1.5rem", spin: "460deg" },
] as const;

/** [x, y, stem angle] along the laurel stem; two leaves sprout from each point. */
const LAUREL_LEAVES = [
  [22, 84, -40],
  [16, 72, -30],
  [12, 59, -18],
  [10, 46, -6],
  [11, 33, 6],
  [14, 20, 18],
] as const;

function formatXp(xp: number): string {
  return xp.toLocaleString("en-US");
}

function xpLabel(xp: number): string {
  return `${formatXp(xp)} XP`;
}

function byRank(rank: number): LeaderboardEntry | undefined {
  return LEADERBOARD.find((entry) => entry.rank === rank);
}

/** Maps a 0–1 share onto the lane, between RUN_MIN and RUN_MAX percent. */
function lanePercent(share: number): number {
  const clamped = Math.min(1, Math.max(0, share));
  return RUN_MIN + (RUN_MAX - RUN_MIN) * clamped;
}

function Laurel({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 32 96" className={className} aria-hidden>
      <path
        d="M26 94C8 72 4 36 18 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {LAUREL_LEAVES.map(([x, y, angle]) => (
        <g key={y} className="fill-amber-300 stroke-amber-600 dark:fill-amber-400" strokeWidth="1.2">
          <ellipse cx={x} cy={y - 6} rx="3.2" ry="6.5" transform={`rotate(${angle - 45} ${x} ${y})`} />
          <ellipse cx={x} cy={y - 6} rx="3.2" ry="6.5" transform={`rotate(${angle + 35} ${x} ${y})`} />
        </g>
      ))}
    </svg>
  );
}

function ShieldBadge({ src, className }: { src: string; className: string }) {
  return (
    <span className={`lb-lift relative block aspect-[1/1.15] ${className}`}>
      <span className="lb-shield-shape lb-metal absolute inset-0" />
      <span className="lb-shield-shape absolute inset-[8%] overflow-hidden bg-amber-50 dark:bg-slate-800">
        <Image src={src} alt="" fill sizes="128px" className="object-cover" />
      </span>
      <span className="lb-shield-shape pointer-events-none absolute inset-0 bg-linear-to-b from-white/40 to-transparent to-35%" />
    </span>
  );
}

function PodiumSlot({ entry, place }: { entry: LeaderboardEntry; place: Place }) {
  const style = PODIUM[place];
  const isFirst = place === 1;

  return (
    <li className={`relative flex min-w-0 flex-col items-center justify-end text-center ${style.tier}`}>
      <span className="sr-only">{formatRank(place)}</span>
      <div
        className="relative z-10 flex w-full min-w-0 flex-col items-center px-1 motion-safe:animate-teacher-rise"
        style={{ animationDelay: `${style.delayMs + BADGE_AFTER_STEP_MS}ms` }}
      >
        <span className="relative">
          {isFirst ? (
            <>
              <span
                aria-hidden
                className="absolute top-1/2 left-1/2 size-[170%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial from-yellow-100/90 to-transparent to-70% blur-md dark:from-amber-400/35"
              />
              <Laurel className="absolute top-[12%] -left-6 hidden h-[82%] text-amber-700 sm:-left-8 sm:block" />
              <Laurel className="absolute top-[12%] -right-6 hidden h-[82%] -scale-x-100 text-amber-700 sm:-right-8 sm:block" />
              <span
                aria-hidden
                className="absolute bottom-full left-1/2 z-10 -mb-1 -translate-x-1/2 motion-safe:animate-hero-bob"
              >
                <Crown
                  strokeWidth={2}
                  className="size-9 fill-amber-300 text-amber-600 drop-shadow-[0_3px_0_var(--color-amber-800)] sm:size-12"
                />
              </span>
            </>
          ) : null}
          <ShieldBadge src={entry.image} className={style.badge} />
        </span>
        <span className="lb-lift relative z-10 -mt-3 inline-block max-w-full">
          <span className="lb-ribbon block px-3.5 py-1 text-[0.7rem] font-black whitespace-nowrap text-zinc-950 tabular-nums sm:px-5 sm:text-sm">
            <CountUp value={entry.score} format={xpLabel} />
          </span>
        </span>
        <p className="mt-2 w-full truncate text-sm font-black tracking-tight text-zinc-950 sm:text-lg dark:text-white">
          {entry.displayName}
        </p>
      </div>

      <div
        aria-hidden
        className={`mt-3 flex w-full origin-bottom flex-col motion-safe:animate-podium-rise ${style.step}`}
        style={{ animationDelay: `${style.delayMs}ms` }}
      >
        <div className="lb-step-cap h-3 shrink-0 sm:h-4" />
        <div className="lb-step flex flex-1 items-start justify-center overflow-hidden pt-2 sm:pt-3">
          <span className="lb-engrave text-4xl leading-none font-black sm:text-6xl">{place}</span>
        </div>
      </div>
    </li>
  );
}

function Runner({
  src,
  ring,
  percent,
  delayMs,
  className = "",
}: {
  src: string;
  ring: string;
  percent: number;
  delayMs: number;
  className?: string;
}) {
  return (
    <span
      className={`absolute top-1/2 left-0 motion-safe:animate-lb-run ${className}`}
      style={{ translate: `calc(${percent}cqw - 50%) -50%`, animationDelay: `${delayMs}ms` }}
    >
      <span
        className={`relative block size-9 overflow-hidden rounded-full border-2 border-white bg-amber-50 shadow-[0_4px_0_rgb(0_0_0/0.25)] ring-3 sm:size-11 dark:bg-slate-800 ${ring}`}
      >
        <Image src={src} alt="" fill sizes="44px" className="object-cover" />
      </span>
    </span>
  );
}

function LaneTrail({ percent, delayMs, tone }: { percent: number; delayMs: number; tone: string }) {
  return (
    <>
      <span className={`absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed ${tone}`} />
      <span
        className="absolute top-1/2 left-0 h-1.5 origin-left -translate-y-1/2 rounded-full bg-linear-to-r from-white/0 to-white/70 motion-safe:animate-lb-trail"
        style={{ width: `${percent}%`, animationDelay: `${delayMs}ms` }}
      />
    </>
  );
}

export default function LeaderboardBoard() {
  const copy = useMessages();
  const podium = PODIUM_ORDER.map((place) => {
    const entry = byRank(place);
    return entry ? { place, entry } : null;
  }).filter((slot): slot is { place: Place; entry: LeaderboardEntry } => slot !== null);
  const rest = LEADERBOARD.filter((entry) => entry.rank > 3);
  const scores = LEADERBOARD.map((entry) => entry.score);
  const leaderScore = Math.max(...scores);
  const lowScore = Math.min(...scores);
  const spread = leaderScore - lowScore;

  const myXp = earnedXpTotal();
  const ahead = LEADERBOARD.filter((entry) => entry.score > myXp);
  const myRank = ahead.length + 1;
  const nextUp = ahead.reduce<LeaderboardEntry | undefined>(
    (lowest, entry) => (!lowest || entry.score < lowest.score ? entry : lowest),
    undefined,
  );
  const myPercent = nextUp ? lanePercent(myXp / nextUp.score) : RUN_MAX;
  const youDelayMs = rest.length * LANE_STAGGER_MS;
  const chip = "stat-chip-3d inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold";

  return (
    <section
      aria-labelledby="leaderboard-heading"
      className="relative overflow-hidden bg-linear-to-b from-cream via-cream to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950"
    >
      <div className="relative mx-auto flex w-full max-w-page flex-col px-4 pt-6 pb-16 sm:pt-10 sm:pb-20">
        <div className="lb-stage relative isolate overflow-hidden rounded-[2.5rem] px-3 pt-8 pb-8 sm:px-10 sm:pt-12 sm:pb-10 lg:px-16">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <span className="lb-sunburst absolute top-[62%] left-1/2 size-[64rem] -translate-x-1/2 -translate-y-1/2 motion-safe:animate-lb-spin" />
            <span className="lb-beam absolute -top-6 left-1/2 h-[36rem] w-56 -translate-x-1/2 opacity-60" />
            <span className="lb-beam absolute -top-6 left-[12%] h-[32rem] w-40 origin-top -translate-x-1/2 -rotate-[16deg] opacity-40" />
            <span className="lb-beam absolute -top-6 left-[88%] h-[32rem] w-40 origin-top -translate-x-1/2 rotate-[16deg] opacity-40" />
            {CONFETTI.map((piece) => (
              <span
                key={piece.left}
                className={`absolute top-0 rounded-[2px] motion-safe:animate-lb-confetti motion-reduce:hidden ${piece.color} ${piece.size}`}
                style={
                  {
                    left: piece.left,
                    animationDelay: `${piece.delay}s`,
                    animationDuration: `${piece.duration}s`,
                    "--drift": piece.drift,
                    "--spin": piece.spin,
                  } as CSSProperties
                }
              />
            ))}
          </div>

          <div className="flex flex-col items-center px-2 text-center">
            <p className="pill-3d pill-3d-amber inline-flex -rotate-2 items-center gap-1.5 rounded-full px-3.5 py-1 text-sm font-bold text-amber-950 motion-reduce:rotate-none">
              <Trophy aria-hidden className="size-4" />
              {copy.ranks.kicker}
            </p>
            <h2
              id="leaderboard-heading"
              className="lb-title mt-4 text-4xl font-black tracking-tight sm:text-6xl"
            >
              {copy.ranks.boardTitle}
            </h2>
            <p className="mt-3 max-w-xl text-sm font-semibold text-orange-950 sm:text-base dark:text-zinc-300">
              {copy.ranks.boardBody}
            </p>
            <ul className="mt-5 flex flex-wrap justify-center gap-2.5">
              <li className={`${chip} pill-3d-amber text-amber-950`}>
                <Users aria-hidden className="size-4" />
                {copy.ranks.learners(LEADERBOARD.length)}
              </li>
              <li className={`${chip} pill-3d-sky text-sky-950 tabular-nums`}>
                <Star aria-hidden className="size-4 fill-white" />
                {copy.ranks.topXp(formatXp(leaderScore))}
              </li>
              <li className={`${chip} pill-3d-emerald text-white tabular-nums`}>
                <TrendingUp aria-hidden className="size-4" />
                {copy.ranks.yourRank(myRank)}
              </li>
            </ul>
          </div>

          <CountUpScope className="relative mx-auto mt-14 max-w-md sm:mt-20 sm:max-w-lg lg:max-w-2xl">
            <ol aria-label={copy.ranks.topThree} className="grid grid-cols-3 items-end">
              {podium.map(({ place, entry }) => (
                <PodiumSlot key={entry.id} entry={entry} place={place} />
              ))}
            </ol>
          </CountUpScope>
          <div aria-hidden className="relative isolate mx-auto -mt-px w-full max-w-[34rem] lg:max-w-[44rem]">
            <div className="absolute inset-x-[-6%] -bottom-4 -z-10 h-6 rounded-full bg-orange-900/30 blur-lg dark:bg-black/70" />
            <div className="h-3 bg-linear-to-b from-amber-100 to-amber-300 [clip-path:polygon(3%_0,97%_0,100%_100%,0_100%)] sm:h-4 dark:from-slate-500 dark:to-slate-600" />
            <div className="h-4 rounded-b-xl bg-linear-to-b from-amber-700 to-amber-900 shadow-[inset_0_1px_0_rgb(255_255_255/0.2)] sm:h-5 dark:from-slate-700 dark:to-slate-900" />
          </div>
        </div>

        <div className="lb-track mt-10 overflow-hidden rounded-[2rem] sm:mt-12">
          <ol aria-label={copy.ranks.restRanking} className="divide-y-2 divide-white/60 dark:divide-white/10">
            {rest.map((entry, index) => {
              const percent = lanePercent(spread > 0 ? (entry.score - lowScore) / spread : 1);
              const above = byRank(entry.rank - 1);
              const delayMs = index * LANE_STAGGER_MS;

              return (
                <li
                  key={entry.id}
                  className="flex items-stretch text-white transition-colors motion-safe:animate-teacher-rise hover:bg-white/5"
                  style={{ animationDelay: `${delayMs}ms` }}
                >
                  <span className="grid w-11 shrink-0 place-items-center text-2xl font-black text-white/85 italic tabular-nums text-shadow-[0_2px_0_rgb(0_0_0/0.25)] sm:w-16 sm:text-4xl">
                    {formatRank(entry.rank)}
                  </span>
                  <span aria-hidden className="@container relative min-w-0 flex-1">
                    <LaneTrail percent={percent} delayMs={delayMs} tone="border-white/25" />
                    <Runner src={entry.image} ring={RUNNER_RING[entry.frame]} percent={percent} delayMs={delayMs} />
                  </span>
                  <span aria-hidden className="lb-checker w-2 shrink-0 sm:w-3" />
                  <span className="flex w-32 shrink-0 flex-col justify-center py-3 pr-3 pl-3 sm:w-44 sm:pr-5 sm:pl-4 lg:w-56">
                    <span className="truncate text-sm font-black tracking-tight sm:text-lg">{entry.displayName}</span>
                    <span className="text-xs font-bold text-white/90 tabular-nums sm:text-sm">
                      {xpLabel(entry.score)}
                    </span>
                    {above ? (
                      <span className="mt-1 w-fit max-w-full rounded-lg bg-black/20 px-1.5 py-0.5 text-[0.65rem] leading-tight font-bold tabular-nums">
                        {copy.ranks.behind(formatXp(above.score - entry.score), above.rank)}
                      </span>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ol>

          <div
            className="lb-lane-you relative flex items-stretch border-t-4 border-white text-amber-950 motion-safe:animate-teacher-rise dark:border-amber-400/40 dark:text-amber-50"
            style={{ animationDelay: `${youDelayMs}ms` }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-1.5 rounded-[1.4rem] border-2 border-dashed border-amber-900/45 motion-safe:animate-pulse dark:border-amber-300/50"
            />
            <span className="grid w-11 shrink-0 place-items-center text-2xl font-black italic tabular-nums sm:w-16 sm:text-4xl">
              {formatRank(myRank)}
            </span>
            <span aria-hidden className="@container relative min-w-0 flex-1">
              <LaneTrail percent={myPercent} delayMs={youDelayMs} tone="border-amber-900/25 dark:border-amber-200/25" />
              {nextUp ? (
                <span
                  className="absolute top-1/2 left-0 flex flex-col items-center"
                  style={{ translate: `calc(${RUN_MAX}cqw - 50%) -50%` }}
                >
                  <span className="relative block size-9 overflow-hidden rounded-full border-2 border-dashed border-amber-900/60 opacity-60 grayscale sm:size-11 dark:border-amber-200/60">
                    <Image src={nextUp.image} alt="" fill sizes="44px" className="object-cover" />
                  </span>
                  <span className="absolute -top-3 inline-flex items-center gap-0.5 rounded-full bg-amber-950 px-1.5 py-px text-[0.6rem] font-black text-amber-50 tabular-nums dark:bg-amber-300 dark:text-amber-950">
                    <Flag className="size-2.5" />#{nextUp.rank}
                  </span>
                </span>
              ) : null}
              <Runner
                src={LEARNER.image}
                ring="ring-orange-500"
                percent={myPercent}
                delayMs={youDelayMs}
                className="z-10"
              />
            </span>
            <span className="flex w-32 shrink-0 flex-col justify-center py-3 pr-3 pl-3 sm:w-44 sm:pr-5 sm:pl-4 lg:w-56">
              <span className="flex min-w-0 items-center gap-1.5">
                <span className="truncate text-sm font-black tracking-tight sm:text-lg">{LEARNER.displayName}</span>
                <span className="shrink-0 rounded-full bg-amber-950 px-1.5 py-px text-[0.6rem] font-black tracking-wider text-amber-50 uppercase dark:bg-amber-300 dark:text-amber-950">
                  {copy.ranks.you}
                </span>
              </span>
              <span className="text-xs font-bold tabular-nums sm:text-sm">{xpLabel(myXp)}</span>
              {nextUp ? (
                <span className="mt-0.5 text-[0.65rem] leading-tight font-bold">
                  {copy.ranks.xpToNext(formatXp(nextUp.score - myXp), nextUp.rank)}
                </span>
              ) : null}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
