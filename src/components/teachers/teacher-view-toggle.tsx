import Link from "next/link";
import { LayoutGrid, LayoutList, PanelsTopLeft } from "lucide-react";

export type TeacherView = "card" | "tile" | "list";

export const TEACHER_VIEWS: TeacherView[] = ["card", "tile", "list"];

export function teacherViewFromParam(value: string | null): TeacherView {
  return TEACHER_VIEWS.find((view) => view === value) ?? "card";
}

const OPTIONS: { view: TeacherView; label: string; Icon: typeof LayoutGrid }[] = [
  { view: "card", label: "Card", Icon: PanelsTopLeft },
  { view: "tile", label: "Tile", Icon: LayoutGrid },
  { view: "list", label: "List", Icon: LayoutList },
];

export default function TeacherViewToggle({ current }: { current: TeacherView }) {
  return (
    <nav
      aria-label="Teacher layout"
      className="inline-flex rounded-2xl border-2 border-amber-200 bg-white/80 p-1 shadow-xs dark:border-white/10 dark:bg-slate-950/70"
    >
      {OPTIONS.map(({ view, label, Icon }) => {
        const active = view === current;
        return (
          <Link
            key={view}
            href={view === "card" ? "/teachers" : `/teachers?view=${view}`}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${
              active
                ? "bg-amber-400 text-amber-950 shadow-xs"
                : "text-zinc-600 hover:bg-amber-50 dark:text-zinc-300 dark:hover:bg-white/5"
            }`}
          >
            <Icon aria-hidden className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
