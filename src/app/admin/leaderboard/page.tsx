import type { Metadata } from "next";
import AdminLeaderboardCatalog from "@/components/admin/admin-leaderboard-catalog";
import {
  getAdminLeaderboardRows,
  getAdminLeaderboardStats,
} from "@/data/admin-leaderboard";

export const metadata: Metadata = {
  title: "Leaderboard · Admin · Shwequest",
  robots: { index: false, follow: false },
};

export default function AdminLeaderboardPage() {
  return (
    <AdminLeaderboardCatalog
      stats={getAdminLeaderboardStats()}
      rows={getAdminLeaderboardRows()}
    />
  );
}
