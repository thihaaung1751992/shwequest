/** Suspense / route loading placeholder for `/self-study/[id]` — layout bones + shimmer. */
export default function SelfStudyCourseSkeleton() {
  return (
    <div
      className="mb-16 flex flex-col gap-5 sm:mb-24"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading course</span>

      <div className="skeleton-shimmer h-11 w-28 rounded-full" />

      <div className="skeleton-shimmer h-36 w-full rounded-[2rem] sm:h-44" />

      <div className="grid gap-5 lg:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)] lg:items-start">
        <aside
          aria-hidden
          className="flex flex-col gap-3 overflow-hidden rounded-[1.75rem] border-2 border-amber-200/50 bg-amber-50/50 p-4 dark:border-white/10 dark:bg-white/5 sm:p-5"
        >
          <div className="skeleton-shimmer h-11 rounded-2xl" />
          <div className="mt-2 hidden flex-col gap-1.5 lg:flex">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="skeleton-shimmer h-10 rounded-xl"
                style={{ animationDelay: `${index * 90}ms` }}
              />
            ))}
          </div>
          <div className="skeleton-shimmer mt-1 h-11 rounded-2xl lg:hidden" />
        </aside>

        <section
          aria-hidden
          className="flex min-h-[18rem] flex-col gap-4 overflow-hidden rounded-[1.75rem] border-2 border-amber-200/50 bg-amber-50/50 p-5 dark:border-white/10 dark:bg-white/5 sm:min-h-[24rem] sm:p-7"
        >
          <div className="skeleton-shimmer h-3.5 w-14 rounded-full" />
          <div className="skeleton-shimmer h-8 w-[min(100%,18rem)] rounded-xl sm:h-9 sm:w-[min(100%,24rem)]" />
          <div className="mt-4 flex flex-col gap-3 border-t-2 border-dashed border-zinc-900/10 pt-6 dark:border-white/10">
            <div className="skeleton-shimmer h-4 w-full rounded-lg" />
            <div className="skeleton-shimmer h-4 w-[94%] rounded-lg [animation-delay:80ms]" />
            <div className="skeleton-shimmer h-4 w-[88%] rounded-lg [animation-delay:160ms]" />
            <div className="skeleton-shimmer h-4 w-[72%] rounded-lg [animation-delay:240ms]" />
            <div className="skeleton-shimmer mt-4 h-4 w-full rounded-lg [animation-delay:320ms]" />
            <div className="skeleton-shimmer h-4 w-[90%] rounded-lg [animation-delay:400ms]" />
            <div className="skeleton-shimmer h-4 w-[60%] rounded-lg [animation-delay:480ms]" />
          </div>
        </section>
      </div>
    </div>
  );
}
