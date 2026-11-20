import PageShell from "@/components/page-shell";
import ProfileSkeleton from "@/components/profile/profile-skeleton";

/** Instant route fallback while `/profile` streams. */
export default function ProfileLoading() {
  return (
    <PageShell title="Profile">
      <ProfileSkeleton />
    </PageShell>
  );
}
