import PageShell from "@/components/page-shell";
import SelfStudyCourseSkeleton from "@/components/self-study/self-study-course-skeleton";

/** Instant route fallback while `/self-study/[id]` streams. */
export default function SelfStudyCourseLoading() {
  return (
    <PageShell title="Self study">
      <SelfStudyCourseSkeleton />
    </PageShell>
  );
}
