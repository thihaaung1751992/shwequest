import type { TeacherAccent } from "@/data/teachers";

type AccentStyle = {
  glow: string;
  edge: string;
  chip: string;
  cta: string;
};

/** Full class strings so Tailwind can detect them at build time. */
export const ACCENT_STYLES: Record<TeacherAccent, AccentStyle> = {
  amber: {
    glow: "bg-amber-300/40 dark:bg-amber-500/20",
    edge: "border-amber-300 dark:border-amber-500/40",
    chip: "bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-100",
    cta: "border-orange-700 bg-orange-500 hover:bg-orange-400",
  },
  sky: {
    glow: "bg-sky-300/40 dark:bg-sky-500/20",
    edge: "border-sky-300 dark:border-sky-500/40",
    chip: "bg-sky-100 text-sky-900 dark:bg-sky-500/15 dark:text-sky-100",
    cta: "border-indigo-700 bg-indigo-500 hover:bg-indigo-400",
  },
  emerald: {
    glow: "bg-emerald-300/40 dark:bg-emerald-500/20",
    edge: "border-emerald-300 dark:border-emerald-500/40",
    chip: "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-100",
    cta: "border-teal-800 bg-teal-600 hover:bg-teal-500",
  },
};
