import type { Metadata } from "next";
import HomeAbout from "@/components/home-about";
import HomeHero from "@/components/home-hero";
import HomeLeaderboardCta from "@/components/home-leaderboard-cta";
import HomePricing from "@/components/home-pricing";
import PageShell from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Home · Shwequest",
};

export default function HomePage() {
  return (
    <PageShell title="Shwequest">
      <HomeHero />
      <HomeLeaderboardCta />
      <HomePricing />
      <HomeAbout />
    </PageShell>
  );
}
