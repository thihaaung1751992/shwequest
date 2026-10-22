"use client";

import AccountSummary from "@/components/account-summary";
import LanguageMenu from "@/components/language-menu";
import PlanDaysLeft from "@/components/plan-days-left";
import { useMessages } from "@/i18n/locale-context";
import { LEARNER } from "@/data/learner";

/** Account row above the site header. Chip strip — days · world · learner · XP. */
export default function LearnerStrip({
  xp,
  tone = "paper",
}: {
  xp?: number;
  tone?: "cream" | "paper";
}) {
  const copy = useMessages();
  const surface =
    tone === "cream"
      ? "bg-cream dark:bg-slate-950"
      : "border-t-4 border-t-sky-700 bg-white dark:border-t-sky-400 dark:bg-slate-950";

  return (
    <section
      aria-label={copy.account}
      className={`relative z-50 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2.5 sm:px-4 sm:pb-3 ${surface}`}
    >
      <div className="mx-auto flex w-full max-w-page min-w-0 items-center gap-1.5 rounded-full border border-amber-200/90 bg-white/95 px-1.5 py-1 shadow-[0_8px_20px_-14px_rgba(120,53,15,0.55)] ring-1 ring-amber-100/80 sm:gap-2 sm:px-2.5 sm:py-1.5 dark:border-white/10 dark:bg-slate-900/95 dark:ring-white/10">
        <PlanDaysLeft endsOn={LEARNER.planEndsOn} />
        <span
          aria-hidden
          className="mx-0.5 h-4 w-px shrink-0 bg-amber-200/90 dark:bg-white/20"
        />
        <LanguageMenu />
        <div className="min-w-0 flex-1" />
        <AccountSummary xp={xp} />
      </div>
    </section>
  );
}
