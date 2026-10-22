"use client";

import { Trophy } from "lucide-react";
import { useMessages } from "@/i18n/locale-context";
import DiamondAvatar from "@/components/leaderboard/diamond-avatar";
import {
  formatRank,
  type LeaderboardEntry,
  LEADERBOARD,
} from "@/data/leaderboard";

const PODIUM_ORDER = [2, 1, 3] as const;

function byRank(rank: number): LeaderboardEntry | undefined {
  return LEADERBOARD.find((entry) => entry.rank === rank);
}

function PodiumSlot({
  entry,
  place,
}: {
  entry: LeaderboardEntry;
  place: 1 | 2 | 3;
}) {
  const isFirst = place === 1;

  return (
    <li
      className={`flex flex-col items-center text-center ${
        isFirst ? "-translate-y-3 sm:-translate-y-5" : "translate-y-2 sm:translate-y-3"
      }`}
    >
      <p className="text-sm font-extrabold tracking-wide text-zinc-900 sm:text-base">
        {formatRank(entry.rank)}
      </p>
      <Trophy
        aria-hidden
        strokeWidth={1.5}
        className={`mt-1 fill-amber-400 text-amber-500 drop-shadow-sm ${
          isFirst ? "size-14 sm:size-16" : "size-9 sm:size-10"
        }`}
      />
      <p className="mt-2 text-sm font-extrabold tracking-wide text-zinc-950 uppercase sm:text-base">
        {entry.displayName}
      </p>
      <p className="mt-0.5 text-xs font-semibold text-zinc-700/90 sm:text-sm">
        {entry.score}
      </p>
    </li>
  );
}

export default function LeaderboardBoard() {
  const copy = useMessages();
  const podium = PODIUM_ORDER.map((place) => {
    const entry = byRank(place);
    return entry ? { place, entry } : null;
  }).filter((slot): slot is { place: 1 | 2 | 3; entry: LeaderboardEntry } => slot !== null);

  return (
    <section
      aria-labelledby="leaderboard-heading"
      className="bg-linear-to-b from-cream to-white"
    >
      <div className="mx-auto flex w-full max-w-lg flex-col px-4 pt-8 pb-12 sm:max-w-xl sm:pt-10 sm:pb-16">
        <h2 id="leaderboard-heading" className="sr-only">
          {copy.ranks.topLearners}
        </h2>

        <ol
          aria-label={copy.ranks.topThree}
          className="grid grid-cols-3 items-end gap-2 sm:gap-4"
        >
          {podium.map(({ place, entry }) => (
            <PodiumSlot key={entry.id} entry={entry} place={place} />
          ))}
        </ol>

        <ol aria-label={copy.ranks.fullRanking} className="mt-10 flex flex-col gap-3 sm:mt-12 sm:gap-3.5">
          {LEADERBOARD.map((entry) => (
            <li key={entry.id} className="flex items-center gap-2.5 sm:gap-3">
              <span className="w-8 shrink-0 text-right text-sm font-extrabold text-orange-700 tabular-nums sm:w-9 sm:text-base">
                {formatRank(entry.rank)}
              </span>
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full bg-white py-2 pr-4 pl-2 shadow-[0_8px_18px_-10px_rgba(120,53,15,0.55)] sm:gap-4 sm:py-2.5 sm:pr-5">
                <DiamondAvatar src={entry.image} frame={entry.frame} />
                <span className="min-w-0 flex-1 truncate text-sm font-extrabold tracking-wide text-zinc-900 uppercase sm:text-base">
                  {entry.displayName}
                </span>
                <span className="shrink-0 text-sm font-extrabold text-orange-600 tabular-nums sm:text-base">
                  {entry.score}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
