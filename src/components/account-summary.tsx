import Image from "next/image";
import { LEARNER } from "@/data/learner";

export default function AccountSummary({ xp }: { xp?: number }) {
  return (
    <div
      className={`flex min-w-0 max-w-full items-center gap-1.5 rounded-full bg-transparent py-0.5 pl-0.5 sm:gap-2 ${xp !== undefined ? "pr-0.5" : "pr-2"}`}
    >
      <span className="relative block size-7 shrink-0 overflow-hidden rounded-full bg-amber-200 ring-2 ring-amber-300 sm:size-8 dark:ring-amber-700">
        <Image src={LEARNER.image} alt="" fill sizes="32px" className="object-cover" />
      </span>
      <p className="hidden min-w-0 truncate text-sm font-extrabold tracking-tight text-amber-950 sm:block sm:max-w-28 md:max-w-36 dark:text-amber-100">
        {LEARNER.displayName}
      </p>
      {xp !== undefined ? (
        <p className="shrink-0 rounded-full bg-linear-to-b from-amber-200 to-amber-400 px-2.5 py-1 text-xs font-extrabold text-amber-950 shadow-[inset_0_2px_0_rgba(255,255,255,0.8)] sm:px-3 sm:text-sm">
          {xp} XP
        </p>
      ) : null}
    </div>
  );
}
