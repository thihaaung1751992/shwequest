import Link from "next/link";
import type { Teacher } from "@/data/teachers";
import { ACCENT_STYLES } from "@/components/teachers/teacher-accent";
import TeacherPortrait from "@/components/teachers/teacher-portrait";

export default function TeacherTile({ teacher }: { teacher: Teacher }) {
  const accent = ACCENT_STYLES[teacher.accent];

  return (
    <Link
      href={`/map?teacher=${teacher.id}`}
      className={`group flex aspect-square flex-col items-center justify-center gap-3 rounded-3xl border-2 border-b-[6px] bg-white/90 p-3 text-center shadow-xs transition-transform focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-700 motion-safe:hover:-translate-y-1 motion-safe:active:translate-y-0.5 motion-safe:active:border-b-2 dark:bg-slate-900/80 ${accent.edge}`}
    >
      <span className="transition-transform motion-safe:group-hover:scale-105">
        <TeacherPortrait src={teacher.image} size="tile" />
      </span>
      <span className="w-full truncate text-sm font-extrabold sm:text-base">{teacher.label}</span>
    </Link>
  );
}
