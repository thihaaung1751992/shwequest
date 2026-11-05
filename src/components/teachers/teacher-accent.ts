import type { TeacherAccent } from "@/data/teachers";

type AccentStyle = {
  /** teacher-tone-* helper: drives teacher-card-3d and teacher-stage. */
  tone: string;
  /** pill-3d-* helper for stat-chip-3d chips. */
  pill: string;
  pillText: string;
  /** cta-3d-* helper for the Open path button. */
  cta: string;
  /** Progress fill gradient stops. */
  bar: string;
};

/** Full class strings so Tailwind can detect them at build time. */
export const ACCENT_STYLES: Record<TeacherAccent, AccentStyle> = {
  amber: {
    tone: "teacher-tone-amber",
    pill: "pill-3d-amber",
    pillText: "text-amber-950",
    cta: "cta-3d-orange",
    bar: "from-amber-300 to-orange-500",
  },
  sky: {
    tone: "teacher-tone-sky",
    pill: "pill-3d-sky",
    pillText: "text-sky-950",
    cta: "cta-3d-sky",
    bar: "from-sky-300 to-sky-600",
  },
  emerald: {
    tone: "teacher-tone-emerald",
    pill: "pill-3d-emerald",
    pillText: "text-white",
    cta: "cta-3d-emerald",
    bar: "from-emerald-300 to-emerald-600",
  },
};
