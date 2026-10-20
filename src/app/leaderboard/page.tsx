import type { Metadata } from "next";
import LeaderboardBoard from "@/components/leaderboard/leaderboard-board";
import PageShell from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Leaderboard · Shwequest",
};

export default function LeaderboardPage() {
  return (
    <PageShell title="Leaderboard" bleed>
      <LeaderboardBoard />
    </PageShell>
  );
}
