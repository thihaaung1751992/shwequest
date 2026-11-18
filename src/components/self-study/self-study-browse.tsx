"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SelfStudyPagination from "@/components/self-study/self-study-pagination";
import SelfStudyResults from "@/components/self-study/self-study-results";
import SelfStudySearch from "@/components/self-study/self-study-search";
import SelfStudyViewToggle from "@/components/self-study/self-study-view-toggle";
import {
  SELF_STUDY_PAGE_SIZE,
  selfStudyHref,
  type SelfStudyView,
} from "@/components/self-study/self-study-view";
import type { FreeLesson } from "@/data/self-study";
import { useMessages } from "@/i18n/locale-context";

export default function SelfStudyBrowse({
  lessons,
  view,
  page,
}: {
  lessons: FreeLesson[];
  view: SelfStudyView;
  page: number;
}) {
  const copy = useMessages();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return lessons;
    return lessons.filter((lesson) => lesson.title.toLowerCase().includes(q));
  }, [lessons, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / SELF_STUDY_PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pageCount);

  useEffect(() => {
    if (page === current) return;
    router.replace(selfStudyHref(view, current), { scroll: false });
  }, [page, current, view, router]);

  function onQueryChange(next: string) {
    setQuery(next);
    if (page !== 1) {
      router.replace(selfStudyHref(view, 1), { scroll: false });
    }
  }

  const slice = filtered.slice(
    (current - 1) * SELF_STUDY_PAGE_SIZE,
    current * SELF_STUDY_PAGE_SIZE,
  );
  const q = query.trim();
  const searching = q.length > 0;

  return (
    <>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SelfStudySearch value={query} onChange={onQueryChange} />
        <div className="flex shrink-0 justify-end">
          <SelfStudyViewToggle current={view} />
        </div>
      </div>

      <p id="self-study-search-status" className="sr-only" aria-live="polite">
        {searching ? copy.selfStudy.matches(filtered.length) : ""}
      </p>

      <div id="self-study-results" className="mb-16 sm:mb-24">
        {filtered.length > 0 ? (
          <>
            <SelfStudyResults view={view} lessons={slice} />
            <SelfStudyPagination view={view} page={current} pageCount={pageCount} />
          </>
        ) : null}

        {searching && filtered.length === 0 ? (
          <p className="mt-4 rounded-2xl border-2 border-dashed border-emerald-200 bg-white/80 px-4 py-10 text-center text-sm font-bold text-zinc-600 dark:border-white/10 dark:bg-slate-950/70 dark:text-zinc-300">
            {copy.selfStudy.emptyLead}
            {q}
            {copy.selfStudy.emptyTail}
          </p>
        ) : null}
      </div>
    </>
  );
}
