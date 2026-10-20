import AccountSummary from "@/components/account-summary";
import PlanDaysLeft from "@/components/plan-days-left";
import { LEARNER } from "@/data/learner";

/** Account row above the site header. The rounded bar is the content row, not the page edge. */
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
      <div className="mx-auto flex w-full max-w-page min-w-0 flex-nowrap items-center justify-end gap-2 rounded-full border-2 border-amber-200 bg-white px-2 py-1.5 shadow-[0_10px_22px_-16px_rgba(120,53,15,0.65)] sm:px-3 dark:border-white/10 dark:bg-slate-900">
        <PlanDaysLeft endsOn={LEARNER.planEndsOn} />
        <AccountSummary xp={xp} />
      </div>
    </section>
  );
}
