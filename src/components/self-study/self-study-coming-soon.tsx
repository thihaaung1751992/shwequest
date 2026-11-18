import { Hourglass } from "lucide-react";

/** Frosted veil for unavailable free lessons; `card` adds a 45° corner sash. */
export default function SelfStudyComingSoon({
  label,
  variant = "card",
}: {
  label: string;
  variant?: "card" | "row";
}) {
  return (
    <span
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[inherit] bg-white/45 backdrop-saturate-50 dark:bg-zinc-950/45"
      aria-hidden
    >
      {variant === "card" ? (
        <span className="coming-soon-candy absolute top-9 -right-14 w-56 rotate-45 py-1.5 text-center">
          <span className="block border-y border-dashed border-white/70 py-0.5 text-[0.7rem] font-black tracking-[0.18em] uppercase">
            {label}
          </span>
        </span>
      ) : null}
    </span>
  );
}

/** Candy pill that replaces the CTA on unavailable list rows (sits above the veil). */
export function SelfStudyComingSoonPill({ label }: { label: string }) {
  return (
    <span
      aria-hidden
      className="coming-soon-candy relative z-30 inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-black tracking-wider uppercase"
    >
      <Hourglass className="size-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </span>
  );
}
