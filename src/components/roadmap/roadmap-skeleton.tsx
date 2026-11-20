import LearnerStrip from "@/components/learner-strip";
import {
  PATH_ISLAND_MAX_WIDTH,
  PATH_LANE_MAX,
} from "@/components/roadmap/roadmap-data";
import { SITE_HEADER_CLASS } from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import SiteLogo from "@/components/site-logo";
import SiteNav from "@/components/site-nav";

const ISLANDS = [
  {
    key: "emerald",
    shell:
      "border-emerald-200/80 bg-emerald-50/70 dark:border-emerald-900/50 dark:bg-emerald-950/35",
  },
  {
    key: "amber",
    shell:
      "border-amber-200/80 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/30",
  },
] as const;

/** Three lesson slots, then a wider boss — same cluster as the live path. */
const NODE_ALIGN = ["self-start", "self-center", "self-end", "self-center"] as const;

/**
 * Path-only bones — used by route Suspense and by RoadmapView until column
 * width is measured (avoids the 320px SSR path stretched across a wide lane).
 * Island / lane max widths come from live `laneBounds` + island margins.
 */
export function RoadmapPathBones() {
  return (
    <div
      className="mx-auto flex w-full max-w-page flex-col gap-8"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading path</span>
      {ISLANDS.map((island, islandIndex) => (
        <section
          key={island.key}
          aria-hidden
          className={`mx-auto flex w-full flex-col gap-12 rounded-[2.75rem] border-2 px-8 py-10 sm:px-14 sm:py-14 ${island.shell}`}
          style={{ maxWidth: PATH_ISLAND_MAX_WIDTH }}
        >
          <div
            className="skeleton-shimmer mx-auto h-9 w-48 rounded-full md:h-10 md:w-56"
            style={{ animationDelay: `${islandIndex * 120}ms` }}
          />
          <div
            className="mx-auto flex w-full flex-col gap-16 md:gap-20"
            style={{ maxWidth: PATH_LANE_MAX }}
          >
            {NODE_ALIGN.map((align, nodeIndex) => {
              const boss = nodeIndex === NODE_ALIGN.length - 1;
              const delay = islandIndex * 360 + nodeIndex * 90;
              return (
                <div key={nodeIndex} className={`flex flex-col items-center gap-3 ${align}`}>
                  {/* Ring + lip shadow mirrors live faceClass so bones read as coin-sized. */}
                  <div
                    className={`skeleton-shimmer rounded-full shadow-[0_0_0_4px_rgb(255_255_255/0.85),0_0_0_7px_rgb(251_191_36/0.4),0_9px_0_7px_rgb(180_83_9/0.22)] dark:shadow-[0_0_0_4px_rgb(71_85_105/0.9),0_0_0_7px_rgb(148_163_184/0.35),0_9px_0_7px_rgb(15_23_42/0.45)] ${
                      boss ? "size-28 md:size-32" : "size-[4.75rem] md:size-[5.5rem]"
                    }`}
                    style={{ animationDelay: `${delay}ms` }}
                  />
                  <div
                    className="skeleton-shimmer h-5 w-28 rounded-lg md:h-5 md:w-32"
                    style={{ animationDelay: `${delay + 40}ms` }}
                  />
                  <div
                    className="skeleton-shimmer h-4 w-16 rounded-full"
                    style={{ animationDelay: `${delay + 80}ms` }}
                  />
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

/** Suspense / route loading placeholder for `/map` — chrome stays, path is bones. */
export default function RoadmapSkeleton() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-linear-to-b from-cream to-white font-sans text-zinc-900 dark:from-slate-950 dark:to-slate-950 dark:text-zinc-50">
      <LearnerStrip tone="cream" />
      <header className={SITE_HEADER_CLASS}>
        <div className="mx-auto flex w-full max-w-page flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="order-1 shrink-0">
            <SiteLogo />
          </h1>
          <div className="order-2 ml-auto shrink-0 md:order-3 md:ml-0">
            <SiteNav layout="cluster" />
          </div>
          <div className="order-3 min-w-0 basis-full md:order-2 md:flex-1 md:basis-auto">
            <div className="skeleton-shimmer h-3 w-44 max-w-full rounded-full" />
          </div>
        </div>
        <div className="mx-auto mt-3 flex w-full max-w-page items-center gap-3">
          <div className="skeleton-shimmer h-5 min-w-0 flex-1 rounded-full" />
          <div className="skeleton-shimmer h-8 w-24 shrink-0 rounded-full" />
        </div>
      </header>

      <main className="relative z-10 flex-1 bg-linear-to-b from-sky-100/80 via-sky-50/60 to-cream px-4 pt-6 pb-24 sm:pb-32 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <RoadmapPathBones />
      </main>

      <SiteFooter />
    </div>
  );
}
