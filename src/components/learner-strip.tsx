import { Globe } from "lucide-react";
import AccountSummary from "@/components/account-summary";
import PlanDaysLeft from "@/components/plan-days-left";
import { LEARNER } from "@/data/learner";

/** Account row above the site header. Chip strip — days · world · learner · XP. */
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
      className={`px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2.5 sm:px-4 sm:pb-3 ${surface}`}
    >
      <div className="mx-auto flex w-full max-w-page min-w-0 items-center gap-1.5 rounded-full border border-amber-200/90 bg-white/95 px-1.5 py-1 shadow-[0_8px_20px_-14px_rgba(120,53,15,0.55)] ring-1 ring-amber-100/80 sm:gap-2 sm:px-2.5 sm:py-1.5 dark:border-white/10 dark:bg-slate-900/95 dark:ring-white/10">
        <PlanDaysLeft endsOn={LEARNER.planEndsOn} />
        <span
          aria-hidden
          className="mx-0.5 h-4 w-px shrink-0 bg-amber-200/90 dark:bg-white/20"
        />
        <span
          aria-hidden
          className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-zinc-300 bg-white text-zinc-600 shadow-[0_4px_10px_-6px_rgba(24,24,27,0.35)] sm:size-9 dark:border-white/25 dark:bg-slate-800 dark:text-zinc-300"
        >
          <Globe className="size-4 sm:size-[1.15rem]" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1" />
        <AccountSummary xp={xp} />
      </div>
    </section>
  );
}
