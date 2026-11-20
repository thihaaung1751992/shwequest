"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpenCheck,
  CalendarClock,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { formatXp } from "@/components/profile/profile-draft";
import { PROFILE_FOCUS } from "@/components/profile/profile-focus";
import { useMessages } from "@/i18n/locale-context";

type ProfileStatTilesProps = {
  myXp: number;
  myRank: number;
  rival: { name: string; gap: number } | null;
  lessonsDone: number;
  lessonsTotal: number;
  planLabel: string | null;
};

function StatTile({
  icon: Icon,
  chip,
  value,
  label,
  children,
}: {
  icon: LucideIcon;
  /** stat-chip-3d colour helper + text colour for the icon badge. */
  chip: string;
  value: string;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <li className="bento-tile flex flex-col gap-3 p-4 sm:p-5">
      <span
        className={`stat-chip-3d inline-flex size-11 items-center justify-center rounded-2xl ${chip}`}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-black tracking-tight tabular-nums sm:text-3xl">{value}</p>
        <p className="mt-0.5 text-xs font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
          {label}
        </p>
      </div>
      {children}
    </li>
  );
}

export default function ProfileStatTiles({
  myXp,
  myRank,
  rival,
  lessonsDone,
  lessonsTotal,
  planLabel,
}: ProfileStatTilesProps) {
  const copy = useMessages();
  const lessonsPercent = lessonsTotal === 0 ? 0 : Math.round((lessonsDone / lessonsTotal) * 100);

  return (
    <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile
        icon={Star}
        chip="pill-3d-amber text-amber-950"
        value={formatXp(myXp)}
        label={copy.profile.statXp}
      />
      <StatTile
        icon={Trophy}
        chip="pill-3d-sky text-sky-950"
        value={`#${myRank}`}
        label={copy.profile.statRank}
      >
        <Link
          href="/leaderboard"
          className={`group mt-auto inline-flex items-start gap-1 text-xs font-bold text-sky-800 hover:underline dark:text-sky-300 ${PROFILE_FOCUS}`}
        >
          <span>
            {rival
              ? copy.profile.xpToPass(formatXp(rival.gap), rival.name)
              : copy.profile.topOfBoard}
          </span>
          <ArrowUpRight
            className="size-3.5 shrink-0 transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
            aria-hidden
          />
        </Link>
      </StatTile>
      <StatTile
        icon={BookOpenCheck}
        chip="pill-3d-emerald text-white"
        value={`${lessonsDone}/${lessonsTotal}`}
        label={copy.profile.statLessons}
      >
        <span
          aria-hidden
          className="mt-auto block h-2 overflow-hidden rounded-full bg-zinc-200/80 shadow-[inset_0_1px_2px_rgb(0_0_0/0.15)] dark:bg-white/10"
        >
          <span
            className="block h-full rounded-full bg-linear-to-r from-emerald-300 to-emerald-600"
            style={{ width: `${lessonsPercent}%` }}
          />
        </span>
      </StatTile>
      <StatTile
        icon={CalendarClock}
        chip="pill-3d-orange text-white"
        value={planLabel ?? "—"}
        label={copy.profile.statPlan}
      />
    </ul>
  );
}
