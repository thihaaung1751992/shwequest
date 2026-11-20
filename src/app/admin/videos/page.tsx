import type { Metadata } from "next";
import AdminVideosCatalog from "@/components/admin/admin-videos-catalog";
import {
  getAdminVideoRows,
  getAdminVideoStats,
} from "@/data/admin-videos";

export const metadata: Metadata = {
  title: "Videos · Admin · Shwequest",
  robots: { index: false, follow: false },
};

export default function AdminVideosPage() {
  return (
    <AdminVideosCatalog
      stats={getAdminVideoStats()}
      rows={getAdminVideoRows()}
    />
  );
}
