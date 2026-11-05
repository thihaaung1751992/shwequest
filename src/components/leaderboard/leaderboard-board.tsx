"use client";

import Image from "next/image";
import { Crown, Star, TrendingUp, Trophy, Users } from "lucide-react";
import { useMessages } from "@/i18n/locale-context";
import DiamondAvatar from "@/components/leaderboard/diamond-avatar";
import { resetTilt, tiltCard } from "@/components/teachers/teacher-tilt";
import { LEARNER } from "@/data/learner";
import {
  formatRank,
  type LeaderboardEntry,
  type LeaderboardFrame,
  LEADERBOARD,
} from "@/data/leaderboard";
import { earnedXpTotal } from "@/data/teachers";

const PODIUM_ORDER = [2, 1, 3] as const;
const ROW_STAGGER_MS = 70;
/** Avatars drop in after their pillar has mostly grown. */
const AVATAR_AFTER_PILLAR_MS = 450;
const MIN_BAR_PERCENT = 6;

type Place = (typeof PODIUM_ORDER)[number];

const PODIUM: Record<
  Place,
  {
    pillar: string;
    cap: string;
    front: string;
    edge: string;
    medal: string;
    digit: string;
    ring: string;
    avatar: string;
    chip: string;
    delayMs: number;
  }
> = {
  1: {
    pillar: "h-36 sm:h-48",
    cap: "from-amber-200 to-amber-300",
    front: "from-amber-400 via-amber-400 to-amber-600",
    edge: "",
    medal: "from-yellow-100 via-amber-400 to-amber-600",
    digit: "text-amber-700",
    ring: "from-yellow-200 via-amber-400 to-amber-600 shadow-[0_4px_0_var(--color-amber-700),0_14px_20px_-8px_rgb(180_83_9/0.6)]",
    avatar: "size-20 sm:size-24",
    chip: "pill-3d-amber text-amber-950",
    delayMs: 400,
  },
  2: {
    pillar: "h-28 sm:h-36",
    cap: "from-sky-200 to-sky-300",
    front: "from-sky-400 via-sky-500 to-sky-700",
    edge: "shadow-[inset_-10px_0_12px_-8px_rgb(0_0_0/0.35)]",
    medal: "from-white via-zinc-300 to-zinc-500",
    digit: "text-zinc-600",
    ring: "from-white via-slate-300 to-slate-500 shadow-[0_4px_0_var(--color-slate-600),0_12px_18px_-8px_rgb(15_23_42/0.5)]",
    avatar: "size-16 sm:size-20",
    chip: "pill-3d-sky text-sky-950",
    delayMs: 200,
  },
  3: {
    pillar: "h-20 sm:h-28",
    cap: "from-orange-200 to-orange-300",
    front: "from-orange-400 via-orange-500 to-orange-700",
    edge: "shadow-[inset_10px_0_12px_-8px_rgb(0_0_0/0.35)]",
    medal: "from-orange-100 via-orange-400 to-orange-700",
    digit: "text-orange-800",
    ring: "from-orange-200 via-orange-400 to-orange-700 shadow-[0_4px_0_var(--color-orange-800),0_12px_18px_-8px_rgb(154_52_18/0.55)]",
    avatar: "size-16 sm:size-20",
    chip: "pill-3d-orange text-orange-950",
    delayMs: 0,
  },
};

/** Card tone follows the avatar frame colour. */
const ROW_TONE: Record<LeaderboardFrame, { card: string; coin: string }> = {
  orange: { card: "teacher-tone-orange", coin: "pill-3d-orange text-orange-950" },
  amber: { card: "teacher-tone-amber", coin: "pill-3d-amber text-amber-950" },
  sky: { card: "teacher-tone-sky", coin: "pill-3d-sky text-sky-950" },
};

const SPARKLES = [
  { position: "-left-6 top-2 size-3.5", delay: "0s" },
  { position: "-right-7 top-0 size-4", delay: "0.8s" },
  { position: "-right-4 bottom-3 size-2.5", delay: "1.6s" },
  { position: "-left-3 bottom-5 size-2.5", delay: "1.2s" },
] as const;

function formatXp(xp: number): string {
  return xp.toLocaleString("en-US");
}

function byRank(rank: number): LeaderboardEntry | undefined {
  return LEADERBOARD.find((entry) => entry.rank === rank);
}

function Sparkle({ className, delay }: { className: string; delay: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`absolute text-amber-300 motion-safe:animate-podium-twinkle dark:text-amber-200 ${className}`}
      style={{ animationDelay: delay }}
      aria-hidden
    >
      <path
        d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PodiumSlot({ entry, place }: { entry: LeaderboardEntry; place: Place }) {
  const style = PODIUM[place];
  const isFirst = place === 1;

  return (
    <li className="relative flex min-w-0 flex-col items-center justify-end text-center">
      <span className="sr-only">{formatRank(place)}</span>
      <div
        className="relative z-10 flex w-full min-w-0 flex-col items-center px-1 motion-safe:animate-teacher-rise"
        style={{ animationDelay: `${style.delayMs + AVATAR_AFTER_PILLAR_MS}ms` }}
      >
        <span className="relative grid place-items-center">
          {isFirst ? (
            <span aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
              <span className="absolute size-44 sm:size-56">
                <span className="block size-full rounded-full bg-[repeating-conic-gradient(rgb(251_191_36/0.45)_0deg_7deg,transparent_7deg_22deg)] [mask-image:radial-gradient(circle_at_50%_50%,black_20%,transparent_64%)] motion-safe:animate-hero-orbit dark:bg-[repeating-conic-gradient(rgb(251_191_36/0.28)_0deg_7deg,transparent_7deg_22deg)]" />
              </span>
              <span className="absolute size-28 rounded-full bg-radial from-amber-200/90 to-transparent to-70% blur-md sm:size-32 dark:from-amber-400/35" />
              {SPARKLES.map((sparkle) => (
                <Sparkle key={sparkle.position} className={sparkle.position} delay={sparkle.delay} />
              ))}
            </span>
          ) : null}
          {isFirst ? (
            <span
              aria-hidden
              className="absolute bottom-full left-1/2 z-10 -mb-2 -translate-x-1/2 motion-safe:animate-hero-bob"
            >
              <Crown
                strokeWidth={2}
                className="size-9 fill-amber-300 text-amber-600 drop-shadow-[0_3px_0_var(--color-amber-700)] sm:size-11"
              />
            </span>
          ) : null}
          <span
            className={`relative block rounded-full bg-linear-to-b p-1 sm:p-1.5 ${style.ring} ${style.avatar}`}
          >
            <span className="relative block size-full overflow-hidden rounded-full bg-amber-50 ring-2 ring-white/80 dark:bg-slate-800">
              <Image src={entry.image} alt="" fill sizes="96px" className="object-cover" />
            </span>
          </span>
        </span>
        <p className="mt-3 w-full truncate text-sm font-black tracking-tight text-zinc-950 sm:text-lg dark:text-white">
          {entry.displayName}
        </p>
        <p
          className={`stat-chip-3d mt-1.5 inline-flex max-w-full rounded-full px-2 py-0.5 text-[0.7rem] font-black whitespace-nowrap tabular-nums sm:px-3 sm:text-sm ${style.chip}`}
        >
          {formatXp(entry.score)} XP
        </p>
      </div>

      <div
        aria-hidden
        className={`mt-4 flex w-full origin-bottom flex-col motion-safe:animate-podium-rise ${style.pillar}`}
        style={{ animationDelay: `${style.delayMs}ms` }}
      >
        <div
          className={`h-3 shrink-0 bg-linear-to-b [clip-path:polygon(8%_0,92%_0,100%_100%,0_100%)] sm:h-4 ${style.cap}`}
        />
        <div
          className={`relative flex flex-1 flex-col items-center justify-start overflow-hidden bg-linear-to-b pt-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.55)] sm:pt-4 ${style.front}`}
        >
          <span className="absolute inset-y-0 left-[12%] w-[18%] bg-linear-to-r from-white/0 via-white/25 to-white/0" />
          <span className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/20 to-transparent" />
          {style.edge ? <span className={`absolute inset-0 ${style.edge}`} /> : null}
          <span
            className={`relative grid size-10 place-items-center rounded-full bg-linear-to-b p-[3px] shadow-[0_3px_0_rgb(0_0_0/0.22),0_6px_10px_rgb(0_0_0/0.25)] sm:size-12 ${style.medal}`}
          >
            <span
              className={`grid size-full place-items-center rounded-full bg-linear-to-b from-white to-zinc-100 text-lg font-black shadow-[inset_0_2px_3px_rgb(0_0_0/0.18)] text-shadow-[0_1px_0_rgb(255_255_255)] sm:text-xl ${style.digit}`}
            >
              {place}
            </span>
          </span>
        </div>
      </div>
    </li>
  );
}

export default function LeaderboardBoard() {
  const copy = useMessages();
  const podium = PODIUM_ORDER.map((place) => {
    const entry = byRank(place);
    return entry ? { place, entry } : null;
  }).filter((slot): slot is { place: Place; entry: LeaderboardEntry } => slot !== null);
  const rest = LEADERBOARD.filter((entry) => entry.rank > 3);
  const leaderScore = Math.max(...LEADERBOARD.map((entry) => entry.score));

  const myXp = earnedXpTotal();
  const ahead = LEADERBOARD.filter((entry) => entry.score > myXp);
  const myRank = ahead.length + 1;
  const nextUp = ahead.reduce<LeaderboardEntry | undefined>(
    (lowest, entry) => (!lowest || entry.score < lowest.score ? entry : lowest),
    undefined,
  );
  const chip = "stat-chip-3d inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold";

  return (
    <section
      aria-labelledby="leaderboard-heading"
      className="relative overflow-hidden bg-linear-to-b from-cream via-cream to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(45%_40%_at_15%_10%,rgb(253_186_116/0.35),transparent_70%),radial-gradient(40%_35%_at_90%_25%,rgb(125_211_252/0.35),transparent_70%)] dark:bg-[radial-gradient(45%_40%_at_15%_10%,rgb(251_146_60/0.12),transparent_70%),radial-gradient(40%_35%_at_90%_25%,rgb(56_189_248/0.12),transparent_70%)]"
      />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col px-4 pt-6 pb-16 sm:pt-10 sm:pb-20">
        <div className="teacher-stage teacher-tone-amber relative overflow-hidden rounded-[2rem] border-2 border-amber-300 px-5 py-7 shadow-[inset_0_2px_0_rgb(255_255_255/0.9),0_5px_0_var(--color-amber-300),0_20px_36px_-18px_rgb(180_83_9/0.45)] sm:px-8 sm:py-9 dark:border-white/10 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_5px_0_rgb(255_255_255/0.08)]">
          <div className="flex items-center justify-between gap-6">
            <div className="min-w-0">
              <p className="pill-3d pill-3d-orange inline-flex -rotate-2 items-center gap-1.5 rounded-full px-3.5 py-1 text-sm font-bold text-orange-950 motion-reduce:rotate-none">
                <Trophy aria-hidden className="size-4" />
                {copy.ranks.kicker}
              </p>
              <h2
                id="leaderboard-heading"
                className="mt-4 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl dark:text-white"
              >
                {copy.ranks.boardTitle}
              </h2>
              <p className="mt-2 max-w-prose text-sm font-medium text-zinc-700 sm:text-base dark:text-zinc-300">
                {copy.ranks.boardBody}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2.5">
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

            <span aria-hidden className="hidden shrink-0 rotate-6 pr-2 sm:block motion-reduce:rotate-none">
              <span className="stat-chip-3d pill-3d-amber grid size-28 place-items-center rounded-[2rem] motion-safe:animate-hero-bob">
                <Trophy strokeWidth={1.75} className="size-14 fill-white/90 text-amber-700" />
              </span>
            </span>
          </div>
        </div>

        <div className="teacher-stage teacher-tone-sky relative isolate mt-8 overflow-hidden rounded-[2rem] border-2 border-sky-300 px-3 pt-16 pb-7 shadow-[inset_0_2px_0_rgb(255_255_255/0.9),0_5px_0_var(--color-sky-300),0_20px_36px_-18px_rgb(3_105_161/0.45)] sm:px-10 sm:pt-20 sm:pb-9 dark:border-white/10 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_5px_0_rgb(255_255_255/0.08)]">
          <ol
            aria-label={copy.ranks.topThree}
            className="relative mx-auto grid max-w-md grid-cols-3 items-end"
          >
            {podium.map(({ place, entry }) => (
              <PodiumSlot key={entry.id} entry={entry} place={place} />
            ))}
          </ol>
          <div aria-hidden className="relative isolate mx-auto -mt-px w-full max-w-[29rem]">
            <div className="absolute inset-x-[-4%] -bottom-3 -z-10 h-4 rounded-full bg-slate-900/25 blur-md dark:bg-black/70" />
            <div className="h-2.5 bg-linear-to-b from-slate-500 to-slate-600 [clip-path:polygon(3%_0,97%_0,100%_100%,0_100%)] sm:h-3" />
            <div className="h-3.5 rounded-b-lg bg-linear-to-b from-slate-700 to-slate-900 shadow-[inset_0_1px_0_rgb(255_255_255/0.15)] sm:h-4" />
          </div>
        </div>

        <ol aria-label={copy.ranks.restRanking} className="mt-10 flex flex-col gap-4 sm:mt-12">
          {rest.map((entry, index) => {
            const tone = ROW_TONE[entry.frame];
            const share = Math.max(MIN_BAR_PERCENT, Math.round((entry.score / leaderScore) * 100));

            return (
              <li
                key={entry.id}
                className="motion-safe:animate-teacher-rise"
                style={{ animationDelay: `${index * ROW_STAGGER_MS}ms` }}
              >
                <div
                  onPointerMove={tiltCard}
                  onPointerLeave={resetTilt}
                  className={`teacher-card-3d flex items-center gap-3 rounded-3xl py-2.5 pr-4 pl-2.5 sm:gap-4 sm:py-3 sm:pr-5 sm:pl-3 ${tone.card}`}
                >
                  <span
                    aria-hidden
                    className="price-card-face pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
                  />
                  <span
                    className={`stat-chip-3d grid size-10 shrink-0 place-items-center rounded-full text-sm font-black tabular-nums sm:size-11 sm:text-base ${tone.coin}`}
                  >
                    {formatRank(entry.rank)}
                  </span>
                  <DiamondAvatar src={entry.image} frame={entry.frame} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-base font-black tracking-tight text-zinc-950 sm:text-lg dark:text-white">
                      {entry.displayName}
                    </span>
                    <span aria-hidden className="progress-track-3d mt-1.5 block h-3 overflow-hidden rounded-full">
                      <span className="progress-fill-3d block h-full rounded-full" style={{ width: `${share}%` }} />
                    </span>
                  </span>
                  <span className="shrink-0 text-right font-black tabular-nums">
                    <span className="block text-lg leading-none text-zinc-950 sm:text-xl dark:text-white">
                      {formatXp(entry.score)}
                    </span>
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">XP</span>
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-8">
          <div className="relative isolate flex items-center gap-3 overflow-hidden rounded-3xl border-2 border-orange-300 bg-linear-to-b from-orange-400 to-orange-600 py-2.5 pr-4 pl-2.5 text-white shadow-[inset_0_2px_0_rgb(255_255_255/0.45),0_6px_0_var(--color-orange-800),0_20px_32px_-12px_rgb(154_52_18/0.65)] text-shadow-[0_1px_1px_rgb(0_0_0/0.25)] sm:gap-4 sm:py-3 sm:pr-5 sm:pl-3 dark:border-orange-400/60">
            <span
              aria-hidden
              className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(255_255_255/0.2)_1.2px,transparent_1.5px)] bg-size-[16px_16px]"
            />
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-b from-white to-orange-50 text-sm font-black text-orange-600 tabular-nums shadow-[0_3px_0_var(--color-orange-800)] text-shadow-none sm:size-11 sm:text-base">
              {formatRank(myRank)}
            </span>
            <span className="relative block size-10 shrink-0 overflow-hidden rounded-full bg-amber-100 ring-2 ring-white sm:size-12">
              <Image src={LEARNER.image} alt="" fill sizes="48px" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex min-w-0 items-center gap-2">
                <span className="truncate text-base font-black tracking-tight sm:text-lg">
                  {LEARNER.displayName}
                </span>
                <span className="shrink-0 rounded-full bg-white/25 px-2 py-0.5 text-[0.7rem] font-black tracking-wider uppercase ring-1 ring-white/40">
                  {copy.ranks.you}
                </span>
              </span>
              {nextUp ? (
                <span className="mt-0.5 block truncate text-xs font-bold text-orange-50 sm:text-sm">
                  {copy.ranks.xpToNext(formatXp(nextUp.score - myXp), nextUp.rank)}
                </span>
              ) : null}
            </span>
            <span className="shrink-0 text-right font-black tabular-nums">
              <span className="block text-lg leading-none sm:text-xl">{formatXp(myXp)}</span>
              <span className="text-xs font-bold text-orange-50">XP</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
