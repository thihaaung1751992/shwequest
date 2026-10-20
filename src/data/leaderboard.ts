export type LeaderboardFrame = "orange" | "amber" | "sky";

export type LeaderboardEntry = {
  id: string;
  rank: number;
  displayName: string;
  /** Stand-in XP until a real ranking feed exists. */
  score: number;
  image: string;
  frame: LeaderboardFrame;
};

/**
 * Mock board for the `/leaderboard` UI.
 * Swap scores/names when a real ranking source exists.
 */
export const LEADERBOARD: LeaderboardEntry[] = [
  {
    id: "emma",
    rank: 1,
    displayName: "Emma",
    score: 16847,
    image: "/learner/placeholder.svg",
    frame: "orange",
  },
  {
    id: "george",
    rank: 2,
    displayName: "George",
    score: 15902,
    image: "/learner/placeholder.svg",
    frame: "amber",
  },
  {
    id: "paul",
    rank: 3,
    displayName: "Paul",
    score: 15879,
    image: "/learner/placeholder.svg",
    frame: "orange",
  },
  {
    id: "ben",
    rank: 4,
    displayName: "Ben",
    score: 15800,
    image: "/learner/placeholder.svg",
    frame: "sky",
  },
  {
    id: "mia",
    rank: 5,
    displayName: "Mia",
    score: 15240,
    image: "/learner/placeholder.svg",
    frame: "orange",
  },
  {
    id: "leo",
    rank: 6,
    displayName: "Leo",
    score: 14910,
    image: "/learner/placeholder.svg",
    frame: "amber",
  },
  {
    id: "nora",
    rank: 7,
    displayName: "Nora",
    score: 14102,
    image: "/learner/placeholder.svg",
    frame: "orange",
  },
  {
    id: "sam",
    rank: 8,
    displayName: "Sam",
    score: 13688,
    image: "/learner/placeholder.svg",
    frame: "sky",
  },
];

export function formatRank(rank: number): string {
  return String(rank).padStart(2, "0");
}
