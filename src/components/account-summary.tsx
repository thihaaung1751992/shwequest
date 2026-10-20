import { LEARNER } from "@/data/learner";
import { earnedXp } from "@/components/roadmap/roadmap-data";

export default function AccountSummary({ xp = earnedXp() }: { xp?: number }) {
  return (
    <div className="flex max-w-full items-center gap-2 rounded-full border-2 border-amber-200 bg-white py-0.5 pr-1 pl-3 shadow-[0_3px_0_0_#f6c445] transition-transform motion-safe:hover:-translate-y-0.5 dark:border-white/10 dark:bg-slate-900">
      <p className="max-w-36 truncate text-sm font-extrabold tracking-tight text-amber-950 dark:text-amber-100">
        {LEARNER.displayName}
      </p>
      <p className="shrink-0 rounded-full bg-linear-to-b from-amber-200 to-amber-400 px-3 py-1 text-sm font-extrabold text-amber-950 shadow-[inset_0_2px_0_rgba(255,255,255,0.8)]">
        {xp} XP
      </p>
    </div>
  );
}
