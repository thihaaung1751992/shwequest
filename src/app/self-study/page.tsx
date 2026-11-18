import type { Metadata } from "next";
import PageShell from "@/components/page-shell";
import SelfStudyHero from "@/components/self-study/self-study-hero";

export const metadata: Metadata = {
  title: "Self study for free · Shwequest",
};

export default function SelfStudyPage() {
  return (
    <PageShell title="Self study">
      <SelfStudyHero />
    </PageShell>
  );
}
