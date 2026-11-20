import LearnerStrip from "@/components/learner-strip";
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
          <div className="skeleton-shimmer h-7 w-16 shrink-0 rounded-full" />
        </div>
      </header>

      <main className="relative z-10 flex-1 bg-linear-to-b from-sky-100/80 via-sky-50/60 to-cream px-4 pt-6 pb-24 sm:pb-32 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
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
              className={`mx-auto flex w-full max-w-xl flex-col gap-10 rounded-[2.75rem] border-2 px-6 py-8 sm:px-10 sm:py-10 ${island.shell}`}
            >
              <div
                className="skeleton-shimmer mx-auto h-8 w-36 rounded-full"
                style={{ animationDelay: `${islandIndex * 120}ms` }}
              />
              <div className="flex flex-col gap-14">
                {NODE_ALIGN.map((align, nodeIndex) => {
                  const boss = nodeIndex === NODE_ALIGN.length - 1;
                  const delay = islandIndex * 360 + nodeIndex * 90;
                  return (
                    <div key={nodeIndex} className={`flex flex-col items-center gap-2 ${align}`}>
                      <div
                        className={`skeleton-shimmer rounded-full ${
                          boss ? "size-28 md:size-32" : "size-[4.75rem] md:size-[5.5rem]"
                        }`}
                        style={{ animationDelay: `${delay}ms` }}
                      />
                      <div
                        className="skeleton-shimmer h-4 w-20 rounded-lg"
                        style={{ animationDelay: `${delay + 40}ms` }}
                      />
                      <div
                        className="skeleton-shimmer h-4 w-12 rounded-full"
                        style={{ animationDelay: `${delay + 80}ms` }}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
