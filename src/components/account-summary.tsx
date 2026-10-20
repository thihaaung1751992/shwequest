import Image from "next/image";
import { LEARNER } from "@/data/learner";

export default function AccountSummary({ xp }: { xp?: number }) {
  return (
    <div
      className={`flex max-w-full items-center gap-2 rounded-full bg-white py-0.5 pl-1 transition-transform motion-safe:hover:-translate-y-0.5 dark:bg-slate-900 ${xp !== undefined ? "pr-1" : "pr-3"}`}
    >
      <span className="relative block size-8 shrink-0 overflow-hidden rounded-full bg-amber-200 ring-2 ring-amber-300 dark:ring-amber-700">
        <Image src={LEARNER.image} alt="" fill sizes="32px" className="object-cover" />
      </span>
      <p className="max-w-36 truncate text-sm font-extrabold tracking-tight text-amber-950 dark:text-amber-100">
        {LEARNER.displayName}
      </p>
      {xp !== undefined ? (
        <p className="shrink-0 rounded-full bg-linear-to-b from-amber-200 to-amber-400 px-3 py-1 text-sm font-extrabold text-amber-950 shadow-[inset_0_2px_0_rgba(255,255,255,0.8)]">
          {xp} XP
        </p>
      ) : null}
    </div>
  );
}
