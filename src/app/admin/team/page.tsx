import type { Metadata } from "next";
import AdminTeamCatalog from "@/components/admin/admin-team-catalog";
import { getAdminTeamRows, getAdminTeamStats } from "@/data/admin-team";

export const metadata: Metadata = {
  title: "Team · Admin · Shwequest",
  robots: { index: false, follow: false },
};

export default function AdminTeamPage() {
  return (
    <AdminTeamCatalog
      stats={getAdminTeamStats()}
      rows={getAdminTeamRows()}
    />
  );
}
