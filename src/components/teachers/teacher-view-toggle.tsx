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
      className="nav-track-3d inline-flex gap-0.5 rounded-full p-1.5"
    >
      {OPTIONS.map(({ view, Icon }) => {
        const active = view === current;
        return (
          <Link
            key={view}
            href={view === "card" ? "/teachers" : `/teachers?view=${view}`}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-3.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${
              active
                ? "stat-chip-3d pill-3d-amber font-black text-amber-950"
                : "font-bold text-zinc-600 hover:bg-amber-100/80 hover:text-amber-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
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
