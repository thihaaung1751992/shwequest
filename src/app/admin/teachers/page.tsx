import type { Metadata } from "next";
import AdminTeachersCatalog from "@/components/admin/admin-teachers-catalog";
import {
  getAdminTeacherRows,
  getAdminTeacherStats,
} from "@/data/admin-teachers";

export const metadata: Metadata = {
  title: "Teachers · Admin · Shwequest",
  robots: { index: false, follow: false },
};

export default function AdminTeachersPage() {
  return (
    <AdminTeachersCatalog
      stats={getAdminTeacherStats()}
      rows={getAdminTeacherRows()}
    />
  );
}
