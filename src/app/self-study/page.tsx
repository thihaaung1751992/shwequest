import type { Metadata } from "next";
import { Suspense } from "react";
import PageShell from "@/components/page-shell";
import SelfStudyBrowse from "@/components/self-study/self-study-browse";
import SelfStudyHero from "@/components/self-study/self-study-hero";
import {
  selfStudyPageFromParam,
  selfStudyViewFromParam,
} from "@/components/self-study/self-study-view";
import { FREE_LESSONS } from "@/data/self-study";

export const metadata: Metadata = {
  title: "Self study for free · Shwequest",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function firstParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

async function SelfStudyBrowseFromUrl({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const view = selfStudyViewFromParam(firstParam(params.view));
  const page = selfStudyPageFromParam(firstParam(params.page));
  return <SelfStudyBrowse lessons={FREE_LESSONS} view={view} page={page} />;
}

export default function SelfStudyPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <PageShell title="Self study">
      <SelfStudyHero />
      <Suspense
        fallback={
          <SelfStudyBrowse lessons={FREE_LESSONS} view="card" page={1} />
        }
      >
        <SelfStudyBrowseFromUrl searchParams={searchParams} />
      </Suspense>
    </PageShell>
  );
}
