import AccountSummary from "@/components/account-summary";

/** Account pill above the site header. Not part of the header bar. */
export default function LearnerStrip({ xp }: { xp?: number }) {
  return (
    <section
      aria-label="Account"
      className="relative overflow-hidden bg-linear-to-r from-sky-800 via-sky-700 to-amber-400 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 dark:from-sky-950 dark:via-sky-900 dark:to-amber-600"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-8 right-0 size-40 rounded-full bg-white/30 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/4 size-24 rounded-full bg-amber-200/30 blur-2xl"
      />
      <div className="relative mx-auto flex w-full max-w-page justify-end">
        <AccountSummary xp={xp} />
      </div>
    </section>
  );
}
