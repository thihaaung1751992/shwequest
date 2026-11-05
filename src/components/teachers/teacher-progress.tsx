"use client";

import { useMessages } from "@/i18n/locale-context";
import { teacherProgress, type Teacher } from "@/data/teachers";
import { ACCENT_STYLES } from "@/components/teachers/teacher-accent";

/** Keeps a sliver of fill visible once any lesson is done (1/66 rounds to 2%). */
const MIN_FILL_PERCENT = 4;

export default function TeacherProgress({
  teacher,
  variant = "full",
}: {
  teacher: Teacher;
  /** `bar` = track only, label for screen readers. */
  variant?: "full" | "bar";
}) {
  const copy = useMessages();
  const accent = ACCENT_STYLES[teacher.accent];
  const { done, total, percent } = teacherProgress(teacher);
  const label = done === 0 ? copy.teachers.notStarted : copy.teachers.lessonsDone(done, total);
  const fill = done === 0 ? 0 : Math.max(percent, MIN_FILL_PERCENT);

  const track = (
    <span
      aria-hidden
      className="relative block h-2.5 overflow-hidden rounded-full bg-zinc-200/80 shadow-[inset_0_1px_2px_rgb(0_0_0/0.15)] dark:bg-white/10"
    >
      <span
        className={`absolute inset-y-0 left-0 rounded-full bg-linear-to-r shadow-[inset_0_1px_0_rgb(255_255_255/0.6)] ${accent.bar}`}
        style={{ width: `${fill}%` }}
      />
    </span>
  );

  if (variant === "bar") {
    return (
      <span className="block w-full">
        {track}
        <span className="sr-only">{label}</span>
      </span>
    );
  }

  return (
    <span className="block w-full text-left">
      <span className="mb-1.5 flex items-baseline justify-between gap-2 text-xs font-bold">
        <span className="text-zinc-500 dark:text-zinc-400">{copy.teachers.progress}</span>
        <span className="text-zinc-800 tabular-nums dark:text-zinc-100">
          {label}
          {done > 0 ? ` · ${percent}%` : null}
        </span>
      </span>
      {track}
    </span>
  );
}
