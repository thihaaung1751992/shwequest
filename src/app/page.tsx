import type { Metadata } from "next";
import HomeHero from "@/components/home-hero";
import PageShell from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Home · Shwequest",
};

export default function HomePage() {
  return (
    <PageShell title="Shwequest">
      <HomeHero />
    </PageShell>
  );
}
