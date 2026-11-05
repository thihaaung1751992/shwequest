import { Star } from "lucide-react";
import Image from "next/image";
import { LEARNER } from "@/data/learner";

export default function AccountSummary({ xp }: { xp?: number }) {
  return (
    <div
      className={`flex min-w-0 max-w-full items-center gap-2.5 rounded-full bg-transparent py-0.5 pl-1 sm:gap-3 ${xp !== undefined ? "pr-0.5" : "pr-2.5"}`}
    >
      <span className="relative block size-7 shrink-0 overflow-hidden rounded-full bg-amber-200 ring-2 ring-amber-400 ring-offset-2 ring-offset-white sm:size-8 dark:ring-amber-500 dark:ring-offset-slate-900">
        <Image src={LEARNER.image} alt="" fill sizes="32px" className="object-cover" />
      </span>
      <p className="hidden min-w-0 truncate text-sm font-black tracking-tight text-amber-950 sm:block sm:max-w-28 md:max-w-36 dark:text-amber-50">
        {LEARNER.displayName}
      </p>
      {xp !== undefined ? (
        <>
          <span
            aria-hidden
            className="hidden h-4 w-px shrink-0 bg-amber-300 sm:block dark:bg-white/20"
          />
          <p className="stat-chip-3d pill-3d-amber inline-flex min-h-7 shrink-0 items-center gap-1 rounded-full px-2.5 text-xs font-black text-amber-950 tabular-nums sm:min-h-8 sm:px-3 sm:text-sm">
            <Star
              className="size-3.5 shrink-0 fill-white text-amber-700 sm:size-4"
              strokeWidth={2.25}
              aria-hidden
            />
            {xp} XP
          </p>
        </>
      ) : null}
    </div>
  );
}
