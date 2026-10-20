import AccountSummary from "@/components/account-summary";

/** Account pill above the site header. Surface matches the header under it. */
export default function LearnerStrip({
  xp,
  tone = "paper",
}: {
  xp?: number;
  tone?: "cream" | "paper";
}) {
  const surface =
    tone === "cream"
      ? "bg-cream dark:bg-slate-950"
      : "border-t-4 border-t-sky-700 bg-white dark:border-t-sky-400 dark:bg-slate-950";

  return (
    <section
      aria-label="Account"
      className={`px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 ${surface}`}
    >
      <div className="mx-auto flex w-full max-w-page justify-end">
        <AccountSummary xp={xp} />
      </div>
    </section>
  );
}
