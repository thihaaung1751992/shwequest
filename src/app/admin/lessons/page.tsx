import type { Metadata } from "next";
import AdminLessonsCatalog from "@/components/admin/admin-lessons-catalog";
import {
  getAdminLessonRows,
  getAdminLessonStats,
} from "@/data/admin-lessons";

export const metadata: Metadata = {
  title: "Lessons · Admin · Shwequest",
  robots: { index: false, follow: false },
};

export default function AdminLessonsPage() {
  return (
    <AdminLessonsCatalog
      stats={getAdminLessonStats()}
      rows={getAdminLessonRows()}
    />
  );
}
