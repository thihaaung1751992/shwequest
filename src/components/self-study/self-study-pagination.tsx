"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMessages } from "@/i18n/locale-context";
import { selfStudyHref, type SelfStudyView } from "@/components/self-study/self-study-view";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

export default function SelfStudyPagination({
  view,
  page,
  pageCount,
}: {
  view: SelfStudyView;
  page: number;
  pageCount: number;
}) {
  const copy = useMessages();
  if (pageCount <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= pageCount;

  return (
    <nav
      aria-label={copy.selfStudy.pagination}
      className="mt-8 flex flex-col items-center gap-3"
    >
      <p className="text-sm font-bold text-zinc-600 tabular-nums dark:text-zinc-300">
        {copy.selfStudy.pageOf(page, pageCount)}
      </p>
      <div className="nav-track-3d inline-flex max-w-full flex-wrap items-center justify-center gap-1 rounded-full p-1.5">
        {prevDisabled ? (
          <span
            aria-disabled="true"
            className="inline-flex size-10 items-center justify-center rounded-full text-zinc-300 dark:text-zinc-600"
          >
            <ChevronLeft aria-hidden className="size-5" strokeWidth={2.75} />
            <span className="sr-only">{copy.selfStudy.prev}</span>
          </span>
        ) : (
          <Link
            href={selfStudyHref(view, page - 1)}
            scroll={false}
            aria-label={copy.selfStudy.prev}
            className={`inline-flex size-10 items-center justify-center rounded-full font-bold text-zinc-700 transition-colors hover:bg-emerald-100/80 hover:text-emerald-950 dark:text-zinc-200 dark:hover:bg-white/10 dark:hover:text-white ${FOCUS}`}
          >
            <ChevronLeft aria-hidden className="size-5" strokeWidth={2.75} />
          </Link>
        )}

        {Array.from({ length: pageCount }, (_, index) => {
          const n = index + 1;
          const active = n === page;
          return (
            <Link
              key={n}
              href={selfStudyHref(view, n)}
              scroll={false}
              aria-label={copy.selfStudy.page(n)}
              aria-current={active ? "page" : undefined}
              className={`inline-flex size-10 items-center justify-center rounded-full text-sm tabular-nums transition-colors ${FOCUS} ${
                active
                  ? "stat-chip-3d pill-3d-emerald font-black text-white"
                  : "font-bold text-zinc-600 hover:bg-emerald-100/80 hover:text-emerald-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              {n}
            </Link>
          );
        })}

        {nextDisabled ? (
          <span
            aria-disabled="true"
            className="inline-flex size-10 items-center justify-center rounded-full text-zinc-300 dark:text-zinc-600"
          >
            <ChevronRight aria-hidden className="size-5" strokeWidth={2.75} />
            <span className="sr-only">{copy.selfStudy.next}</span>
          </span>
        ) : (
          <Link
            href={selfStudyHref(view, page + 1)}
            scroll={false}
            aria-label={copy.selfStudy.next}
            className={`inline-flex size-10 items-center justify-center rounded-full font-bold text-zinc-700 transition-colors hover:bg-emerald-100/80 hover:text-emerald-950 dark:text-zinc-200 dark:hover:bg-white/10 dark:hover:text-white ${FOCUS}`}
          >
            <ChevronRight aria-hidden className="size-5" strokeWidth={2.75} />
          </Link>
        )}
      </div>
    </nav>
  );
}
