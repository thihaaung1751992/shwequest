import type { Metadata } from "next";
import { Suspense } from "react";
import PageShell from "@/components/page-shell";
import TeacherResults from "@/components/teachers/teacher-results";
import TeacherSearch from "@/components/teachers/teacher-search";
import TeacherViewToggle, {
  teacherViewFromParam,
} from "@/components/teachers/teacher-view-toggle";
import { ROADMAP_NODES, VIDEO_TOTAL } from "@/components/roadmap/roadmap-data";
import { TEACHERS } from "@/data/teachers";

export const metadata: Metadata = {
  title: "Teachers · Shwequest",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const GAME_TOTAL = ROADMAP_NODES.filter((node) => node.kind === "boss").length;

function firstParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

async function TeacherToggleFromUrl({ searchParams }: { searchParams: SearchParams }) {
  const view = teacherViewFromParam(firstParam((await searchParams).view));
  return <TeacherViewToggle current={view} />;
}

async function TeacherResultsFromUrl({ searchParams }: { searchParams: SearchParams }) {
  const view = teacherViewFromParam(firstParam((await searchParams).view));
  return (
    <TeacherResults
      view={view}
      teachers={TEACHERS}
      videoCount={VIDEO_TOTAL}
      gameCount={GAME_TOTAL}
    />
  );
}

export default function TeachersPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <PageShell title="Teachers">
      <h2 className="text-2xl font-bold tracking-tight">Choose a teacher</h2>
      <p className="mt-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
        Open one teacher to see the learning path.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TeacherSearch />
        <div className="flex shrink-0 justify-end">
          <Suspense fallback={<TeacherViewToggle current="card" />}>
            <TeacherToggleFromUrl searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
      <p id="teacher-search-status" className="sr-only" aria-live="polite" />
      <div id="teacher-results">
        <Suspense
          fallback={
            <TeacherResults
              view="card"
              teachers={TEACHERS}
              videoCount={VIDEO_TOTAL}
              gameCount={GAME_TOTAL}
            />
          }
        >
          <TeacherResultsFromUrl searchParams={searchParams} />
        </Suspense>
        <p
          id="teacher-search-empty"
          hidden
          className="mt-4 rounded-2xl border-2 border-dashed border-amber-200 bg-white/80 px-4 py-10 text-center text-sm font-bold text-zinc-600 dark:border-white/10 dark:bg-slate-950/70 dark:text-zinc-300"
        >
          No teachers match &ldquo;
          <span data-query="" />
          &rdquo;.
        </p>
      </div>
    </PageShell>
  );
}
