import type { Metadata } from "next";
import AdminSitePanel from "@/components/admin/admin-site-panel";
import {
  getAdminSiteControls,
  getAdminSiteGateFlags,
  getAdminSiteOperatorRows,
  getAdminSiteStats,
} from "@/data/admin-site";

export const metadata: Metadata = {
  title: "Site · Admin · Shwequest",
  robots: { index: false, follow: false },
};

export default function AdminSitePage() {
  const gate = getAdminSiteGateFlags();

  return (
    <AdminSitePanel
      stats={getAdminSiteStats(undefined, gate)}
      gate={gate}
      controls={getAdminSiteControls()}
      rows={getAdminSiteOperatorRows()}
    />
  );
}
