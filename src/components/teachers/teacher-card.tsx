import Link from "next/link";
import { ArrowRight, CirclePlay, Gamepad2 } from "lucide-react";
import type { Teacher } from "@/data/teachers";
import { ACCENT_STYLES } from "@/components/teachers/teacher-accent";
import TeacherPortrait from "@/components/teachers/teacher-portrait";

export default function TeacherCard({
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
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-b-[6px] bg-white/90 p-5 shadow-sm transition-transform focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-700 motion-safe:hover:-translate-y-1 motion-safe:active:translate-y-0.5 motion-safe:active:border-b-2 dark:bg-slate-900/80 ${accent.edge}`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute -top-16 -right-16 size-44 rounded-full blur-2xl transition-transform motion-safe:group-hover:scale-125 ${accent.glow}`}
      />

      <div className="relative flex items-center gap-4">
        <span className="transition-transform motion-safe:group-hover:scale-105">
          <TeacherPortrait src={teacher.image} size="card" />
        </span>
        <div className="min-w-0">
          <p aria-hidden className="text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
            Teacher
          </p>
          <h3 className="truncate text-xl font-extrabold tracking-tight">{teacher.label}</h3>
        </div>
      </div>

      <ul className="relative mt-5 flex flex-wrap gap-2 text-sm font-bold">
        <li className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${accent.chip}`}>
          <CirclePlay aria-hidden className="size-4" />
          {videoCount} videos
        </li>
        <li className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${accent.chip}`}>
          <Gamepad2 aria-hidden className="size-4" />
          {gameCount} games
        </li>
      </ul>

      <span
        className={`relative mt-6 inline-flex min-h-11 items-center justify-center gap-2 self-stretch rounded-2xl border-b-4 px-4 py-2 font-extrabold text-white transition-colors ${accent.cta}`}
      >
        Open path
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform motion-safe:group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
