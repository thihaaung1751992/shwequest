import Link from "next/link";
import { ArrowRight, CirclePlay, Gamepad2 } from "lucide-react";
import { ACCENT_STYLES } from "@/components/teachers/teacher-accent";
import TeacherPortrait from "@/components/teachers/teacher-portrait";
import type { Teacher } from "@/data/teachers";

export default function TeacherListRow({
  teacher,
  videoCount,
  gameCount,
}: {
  teacher: Teacher;
  videoCount: number;
  gameCount: number;
}) {
  const accent = ACCENT_STYLES[teacher.accent];

  return (
    <Link
      href={`/map?teacher=${teacher.id}`}
      className={`group flex min-h-16 items-center gap-3 rounded-2xl border-2 border-b-4 bg-white/90 px-3 py-2.5 shadow-xs transition-transform focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-700 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0.5 motion-safe:active:border-b-2 dark:bg-slate-900/80 ${accent.edge}`}
    >
      <TeacherPortrait src={teacher.image} size="list" />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-extrabold tracking-tight">{teacher.label}</span>{" "}
        <span className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs font-bold text-zinc-600 dark:text-zinc-300">
          <span className="inline-flex items-center gap-1">
            <CirclePlay aria-hidden className="size-3.5" />
            {videoCount} videos
          </span>
          <span className="sr-only">, </span>
          <span className="inline-flex items-center gap-1">
            <Gamepad2 aria-hidden className="size-3.5" />
            {gameCount} games
          </span>
        </span>
      </span>
      <span
        className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl border-b-4 px-3 text-sm font-extrabold text-white ${accent.cta}`}
      >
        <span className="hidden sm:inline">Open path</span>
        <ArrowRight aria-hidden className="size-4" />
      </span>
    </Link>
  );
}
