import type { Metadata } from "next";
import PageShell from "@/components/page-shell";
import TeamShowcase from "@/components/team/team-showcase";

export const metadata: Metadata = {
  title: "Team · Shwequest",
};

export default function TeamPage() {
  return (
    <PageShell title="Team">
      <TeamShowcase />
    </PageShell>
  );
}
