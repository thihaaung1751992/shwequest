import type { Metadata } from "next";
import PageShell from "@/components/page-shell";
import LearnerProfileView from "@/components/profile/learner-profile-view";

export const metadata: Metadata = {
  title: "Profile · Shwequest",
};

export default function ProfilePage() {
  return (
    <PageShell title="Profile">
      <LearnerProfileView />
    </PageShell>
  );
}
