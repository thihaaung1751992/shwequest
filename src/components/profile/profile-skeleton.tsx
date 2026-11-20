/** Suspense / hydration placeholder for `/profile` — bento bones + shimmer. */
export default function ProfileSkeleton() {
  return (
    <div
      className="mb-16 flex flex-col gap-4 sm:mb-24 sm:gap-5"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading profile</span>

      {/* Hero — cover + avatar + name/bio */}
      <section aria-hidden className="bento-tile overflow-hidden">
        <div className="profile-cover h-32 sm:h-44">
          <span className="absolute -top-10 left-[12%] size-40 rounded-full bg-amber-300/40 blur-2xl dark:bg-amber-500/20" />
          <span className="absolute -right-6 -bottom-12 size-48 rounded-full bg-sky-300/35 blur-2xl dark:bg-sky-500/15" />
        </div>
        <div className="relative px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
            <div className="relative -mt-16 shrink-0 sm:-mt-20">
              <span className="block rounded-[2rem] bg-linear-to-br from-amber-300/70 via-orange-400/60 to-sky-400/70 p-1 dark:from-amber-400/50 dark:via-orange-500/40 dark:to-sky-500/50">
                <span className="skeleton-shimmer block size-36 rounded-[1.75rem] sm:size-44" />
              </span>
            </div>
            <div className="flex w-full min-w-0 flex-1 flex-col items-center gap-2 sm:items-start sm:pb-1">
              <div className="skeleton-shimmer h-9 w-48 max-w-full rounded-xl sm:h-10 sm:w-64" />
              <div className="skeleton-shimmer h-4 w-64 max-w-full rounded-lg [animation-delay:80ms] sm:w-80" />
              <div className="skeleton-shimmer h-4 w-40 max-w-full rounded-lg [animation-delay:160ms] sm:w-56" />
            </div>
          </div>
        </div>
      </section>

      {/* Stat tiles — 2×2 / 4-col */}
      <ul aria-hidden className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <li key={index} className="bento-tile flex flex-col gap-3 p-4 sm:p-5">
            <div
              className="skeleton-shimmer size-11 rounded-2xl"
              style={{ animationDelay: `${index * 70}ms` }}
            />
            <div
              className="skeleton-shimmer h-8 w-20 rounded-lg sm:h-9"
              style={{ animationDelay: `${index * 70 + 40}ms` }}
            />
            <div
              className="skeleton-shimmer h-3 w-16 rounded-full"
              style={{ animationDelay: `${index * 70 + 80}ms` }}
            />
          </li>
        ))}
      </ul>

      {/* Body — courses | contact + social */}
      <div className="grid items-start gap-4 sm:gap-5 lg:grid-cols-12">
        <section aria-hidden className="bento-tile p-5 sm:p-7 lg:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="skeleton-shimmer size-11 shrink-0 rounded-2xl" />
              <div className="flex flex-col gap-2">
                <div className="skeleton-shimmer h-5 w-28 rounded-lg" />
                <div className="skeleton-shimmer h-3.5 w-44 max-w-full rounded-full [animation-delay:80ms]" />
              </div>
            </div>
            <div className="skeleton-shimmer h-6 w-16 rounded-full [animation-delay:120ms]" />
          </div>
          <ul className="mt-6 grid gap-4">
            {Array.from({ length: 2 }, (_, index) => (
              <li
                key={index}
                className="flex flex-col gap-4 rounded-[1.5rem] border-2 border-amber-200/50 bg-amber-50/40 p-4 sm:flex-row sm:items-center sm:p-5 dark:border-white/10 dark:bg-white/5"
              >
                <div
                  className="skeleton-shimmer mx-auto size-20 shrink-0 rounded-full sm:mx-0"
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                />
                <div className="min-w-0 flex-1 space-y-2 text-center sm:text-left">
                  <div
                    className="skeleton-shimmer mx-auto h-5 w-36 rounded-lg sm:mx-0"
                    style={{ animationDelay: `${240 + index * 100}ms` }}
                  />
                  <div
                    className="skeleton-shimmer mx-auto h-3.5 w-24 rounded-full sm:mx-0"
                    style={{ animationDelay: `${280 + index * 100}ms` }}
                  />
                  <div
                    className="skeleton-shimmer mx-auto mt-3 h-2 w-full max-w-xs rounded-full sm:mx-0"
                    style={{ animationDelay: `${320 + index * 100}ms` }}
                  />
                </div>
                <div
                  className="skeleton-shimmer mx-auto h-11 w-28 shrink-0 rounded-xl sm:mx-0"
                  style={{ animationDelay: `${360 + index * 100}ms` }}
                />
              </li>
            ))}
          </ul>
        </section>

        <aside aria-hidden className="flex flex-col gap-4 sm:gap-5 lg:col-span-4">
          <section className="bento-tile p-3 sm:p-4">
            <div className="skeleton-shimmer mx-2 mt-1 mb-3 h-5 w-24 rounded-lg" />
            <div className="grid gap-1">
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-2xl px-2 py-2.5"
                >
                  <div
                    className="skeleton-shimmer size-9 shrink-0 rounded-xl"
                    style={{ animationDelay: `${index * 60}ms` }}
                  />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div
                      className="skeleton-shimmer h-2.5 w-12 rounded-full"
                      style={{ animationDelay: `${index * 60 + 30}ms` }}
                    />
                    <div
                      className="skeleton-shimmer h-3.5 w-[70%] rounded-lg"
                      style={{ animationDelay: `${index * 60 + 60}ms` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bento-tile p-3 sm:p-4">
            <div className="skeleton-shimmer mx-2 mt-1 mb-3 h-5 w-20 rounded-lg [animation-delay:80ms]" />
            <div className="grid gap-1">
              {Array.from({ length: 5 }, (_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-2xl px-2 py-2.5"
                >
                  <div
                    className="skeleton-shimmer size-9 shrink-0 rounded-xl"
                    style={{ animationDelay: `${120 + index * 60}ms` }}
                  />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div
                      className="skeleton-shimmer h-2.5 w-14 rounded-full"
                      style={{ animationDelay: `${150 + index * 60}ms` }}
                    />
                    <div
                      className="skeleton-shimmer h-3.5 w-[55%] rounded-lg"
                      style={{ animationDelay: `${180 + index * 60}ms` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
