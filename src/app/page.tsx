import type { Metadata } from "next";
import { Suspense } from "react";
import HomeAbout from "@/components/home-about";
import HomeHero from "@/components/home-hero";
import HomeLeaderboardCta from "@/components/home-leaderboard-cta";
import HomePricing from "@/components/home-pricing";
import PageShell from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Home · Shwequest",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function firstParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

async function HomePricingFromUrl({ searchParams }: { searchParams: SearchParams }) {
  const result = firstParam((await searchParams).result);
  return <HomePricing forceComplete={result === "true"} />;
}

export default function HomePage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <PageShell title="Shwequest">
      <HomeHero />
      <HomeLeaderboardCta />
      <Suspense fallback={<HomePricing />}>
        <HomePricingFromUrl searchParams={searchParams} />
      </Suspense>
      <HomeAbout />
    </PageShell>
  );
}
