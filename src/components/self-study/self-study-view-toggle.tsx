"use client";

import Link from "next/link";
import { LayoutList, PanelsTopLeft } from "lucide-react";
import { useMessages } from "@/i18n/locale-context";
import {
  selfStudyHref,
  type SelfStudyView,
} from "@/components/self-study/self-study-view";

const OPTIONS: { view: SelfStudyView; Icon: typeof PanelsTopLeft }[] = [
  { view: "card", Icon: PanelsTopLeft },
  { view: "list", Icon: LayoutList },
];

export default function SelfStudyViewToggle({ current }: { current: SelfStudyView }) {
  const copy = useMessages();
  const label = {
    card: copy.selfStudy.card,
    list: copy.selfStudy.list,
  } as const;

  return (
    <nav
      aria-label={copy.selfStudy.layout}
      className="nav-track-3d inline-flex gap-0.5 rounded-full p-1.5"
    >
      {OPTIONS.map(({ view, Icon }) => {
        const active = view === current;
        return (
          <Link
            key={view}
            href={selfStudyHref(view, 1)}
            scroll={false}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-3.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${
              active
                ? "stat-chip-3d pill-3d-emerald font-black text-white"
                : "font-bold text-zinc-600 hover:bg-emerald-100/80 hover:text-emerald-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
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
