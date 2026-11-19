import type { Metadata } from "next";
import { Suspense } from "react";
import PageShell from "@/components/page-shell";
import { SelfStudyVideosPageDeco } from "@/components/self-study/self-study-videos-deco";
import SelfStudyVideosHero from "@/components/self-study/self-study-videos-hero";
import SelfStudyVideosPlaylist from "@/components/self-study/self-study-videos-playlist";
import { selfStudyViewFromParam } from "@/components/self-study/self-study-view";

export const metadata: Metadata = {
  title: "Free videos · Shwequest",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function firstParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

async function SelfStudyVideosPlaylistFromUrl({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const view = selfStudyViewFromParam(firstParam(params.view));
  return <SelfStudyVideosPlaylist view={view} />;
}

export default function SelfStudyVideosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <PageShell title="Free videos">
      <div className="relative">
        <SelfStudyVideosPageDeco />
        <SelfStudyVideosHero />
        <Suspense fallback={<SelfStudyVideosPlaylist view="card" />}>
          <SelfStudyVideosPlaylistFromUrl searchParams={searchParams} />
        </Suspense>
      </div>
    </PageShell>
  );
}
