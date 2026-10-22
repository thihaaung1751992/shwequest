"use client";

import Link from "next/link";
import { LayoutGrid, LayoutList, PanelsTopLeft } from "lucide-react";
import { useMessages } from "@/i18n/locale-context";
import type { TeacherView } from "@/components/teachers/teacher-view";

const OPTIONS: { view: TeacherView; Icon: typeof LayoutGrid }[] = [
  { view: "card", Icon: PanelsTopLeft },
  { view: "tile", Icon: LayoutGrid },
  { view: "list", Icon: LayoutList },
];

export default function TeacherViewToggle({ current }: { current: TeacherView }) {
  const copy = useMessages();
  const label = {
    card: copy.teachers.card,
    tile: copy.teachers.tile,
    list: copy.teachers.list,
  } as const;

  return (
    <nav
      aria-label={copy.teachers.layout}
      className="inline-flex rounded-full bg-white p-1 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.22)] ring-1 ring-zinc-200/80 dark:bg-slate-950 dark:ring-white/10"
    >
      {OPTIONS.map(({ view, Icon }) => {
        const active = view === current;
        return (
          <Link
            key={view}
            href={view === "card" ? "/teachers" : `/teachers?view=${view}`}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${
              active
                ? "bg-orange-500 text-white shadow-xs"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-300 dark:hover:bg-white/10"
            }`}
          >
            <Icon aria-hidden className="size-4" />
            {label[view]}
          </Link>
        );
      })}
    </nav>
  );
}
