import type { Metadata } from "next";
import AdminMembersCatalog from "@/components/admin/admin-members-catalog";
import {
  getAdminMemberRows,
  getAdminMemberStats,
} from "@/data/admin-members";

export const metadata: Metadata = {
  title: "Members · Admin · Shwequest",
  robots: { index: false, follow: false },
};

export default function AdminMembersPage() {
  return (
    <AdminMembersCatalog
      stats={getAdminMemberStats()}
      rows={getAdminMemberRows()}
    />
  );
}
