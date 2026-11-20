import {
  formatRank,
  LEADERBOARD,
  type LeaderboardEntry,
  type LeaderboardFrame,
} from "@/data/leaderboard";

export type AdminLeaderboardRow = {
  id: string;
  rank: number;
  rankLabel: string;
  displayName: string;
  score: number;
  frame: LeaderboardFrame;
  image: string;
  href: string;
  siteHref: string;
};

export type AdminLeaderboardStats = {
  total: number;
  topScore: number;
  orange: number;
  amber: number;
  sky: number;
};

export const ADMIN_LEADERBOARD_FRAME_LABEL: Record<LeaderboardFrame, string> = {
  orange: "Orange",
  amber: "Amber",
  sky: "Sky",
};

export const ADMIN_LEADERBOARD_FRAMES: readonly LeaderboardFrame[] = [
  "orange",
  "amber",
  "sky",
] as const;

export function adminLeaderboardHref(id: string): string {
  return `/admin/leaderboard/${id}`;
}

/** Public learner board (single page — no per-rank route). */
export function adminLeaderboardSiteHref(): string {
  return "/leaderboard";
}

export function leaderboardEntryById(
  id: string,
): LeaderboardEntry | undefined {
  return LEADERBOARD.find((entry) => entry.id === id);
}

export function leaderboardStaticParams(): { id: string }[] {
  return LEADERBOARD.map((entry) => ({ id: entry.id }));
}

export function getAdminLeaderboardStats(
  entries: readonly LeaderboardEntry[] = LEADERBOARD,
): AdminLeaderboardStats {
  let orange = 0;
  let amber = 0;
  let sky = 0;
  let topScore = 0;

  for (const entry of entries) {
    if (entry.frame === "orange") orange += 1;
    else if (entry.frame === "amber") amber += 1;
    else sky += 1;
    if (entry.score > topScore) topScore = entry.score;
  }

  return {
    total: entries.length,
    topScore,
    orange,
    amber,
    sky,
  };
}

export function getAdminLeaderboardRows(
  entries: readonly LeaderboardEntry[] = LEADERBOARD,
): AdminLeaderboardRow[] {
  return entries.map((entry) => ({
    id: entry.id,
    rank: entry.rank,
    rankLabel: formatRank(entry.rank),
    displayName: entry.displayName,
    score: entry.score,
    frame: entry.frame,
    image: entry.image,
    href: adminLeaderboardHref(entry.id),
    siteHref: adminLeaderboardSiteHref(),
  }));
}

/** Top N ranks for Overview activity (keeps the table short). */
export function getAdminLeaderboardActivityRows(limit = 5) {
  return [...LEADERBOARD]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
    .map((entry) => ({
      id: `rank-${entry.id}`,
      label: `#${formatRank(entry.rank)} ${entry.displayName}`,
      kind: "Rank",
      status: "demo" as const,
      href: adminLeaderboardHref(entry.id),
    }));
}

export function getAdminLeaderboardDetail(id: string) {
  const entry = leaderboardEntryById(id);
  if (!entry) return undefined;

  return {
    entry,
    rankLabel: formatRank(entry.rank),
    siteHref: adminLeaderboardSiteHref(),
    listHref: "/admin/leaderboard",
  };
}
