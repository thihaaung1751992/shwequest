"use client";

import { type ReactNode } from "react";
import { StickyNote } from "lucide-react";
import type { FreeLessonDialogNote } from "@/data/any-dialog-note";

const ANY_WORD = /\bany(?:one|body|thing|where|time)?\b/gi;

function highlightAnyWords(text: string) {
  const parts: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  ANY_WORD.lastIndex = 0;
  while ((match = ANY_WORD.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    parts.push(
      <strong
        key={`${match.index}-${match[0]}`}
        className="font-black text-orange-600 dark:text-orange-400"
      >
        {match[0]}
      </strong>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    parts.push(text.slice(last));
  }
  return parts.length > 0 ? parts : text;
}

export default function SectionDialogNote({
  note,
}: {
  note: FreeLessonDialogNote;
}) {
  return (
    <aside
      aria-labelledby="any-dialog-note-title"
      className="mt-6 min-w-0 sm:mt-8"
    >
      <div className="relative overflow-hidden rounded-[1.5rem] border-[3px] border-zinc-900 bg-linear-to-br from-teal-200 via-teal-50 to-cyan-100 shadow-[4px_4px_0_var(--color-zinc-900)] dark:border-zinc-100 dark:from-teal-950 dark:via-slate-900 dark:to-cyan-950 dark:shadow-[4px_4px_0_var(--color-zinc-100)]">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,var(--color-teal-600)_1.1px,transparent_1.4px)] bg-size-[12px_12px] opacity-[0.14] dark:opacity-[0.12]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -top-14 -right-8 size-36 rounded-full bg-cyan-400/35 blur-2xl dark:bg-cyan-400/20"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-10 size-40 rounded-full bg-teal-500/25 blur-2xl dark:bg-teal-400/15"
        />

        <div className="relative flex min-w-0 flex-col gap-4 p-4 sm:gap-5 sm:p-5">
          <header className="flex min-w-0 flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-zinc-900 bg-teal-500 px-3 py-1 text-[0.7rem] font-black tracking-wider text-white uppercase shadow-[2px_2px_0_var(--color-zinc-900)] dark:border-zinc-100 dark:bg-teal-400 dark:text-zinc-950 dark:shadow-[2px_2px_0_var(--color-zinc-100)]">
              <StickyNote aria-hidden className="size-3.5" strokeWidth={2.5} />
              Dialog note
            </span>
            <h4
              id="any-dialog-note-title"
              lang="my"
              className="min-w-0 text-lg leading-snug font-black tracking-tight text-teal-950 sm:text-xl dark:text-teal-50"
            >
              {note.title}
            </h4>
          </header>

          <ol className="flex min-w-0 flex-col gap-3 sm:gap-3.5">
            {note.items.map((item, index) => (
              <li
                key={`${item.titleEn}-${index}`}
                className="flex min-w-0 items-start gap-3 rounded-2xl border-2 border-teal-800/20 bg-white/90 px-3.5 py-3 shadow-[2px_2px_0_var(--color-teal-800)] dark:border-teal-300/25 dark:bg-teal-950/55 dark:shadow-[2px_2px_0_var(--color-teal-300)]"
              >
                <span
                  aria-hidden
                  className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border-2 border-zinc-900 bg-teal-400 text-xs font-black text-zinc-950 shadow-[2px_2px_0_var(--color-zinc-900)] dark:border-zinc-100 dark:bg-teal-500 dark:text-white dark:shadow-[2px_2px_0_var(--color-zinc-100)]"
                >
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    lang="my"
                    className="text-base leading-snug font-black text-teal-950 sm:text-lg dark:text-teal-50"
                  >
                    {item.title}
                    <span className="mt-0.5 block text-sm font-bold tracking-wide text-teal-700 sm:mt-0 sm:ms-2 sm:inline dark:text-teal-300">
                      ({item.titleEn})
                    </span>
                  </p>
                  <p
                    lang="my"
                    className="mt-2 text-sm leading-relaxed font-medium text-teal-900/85 sm:text-base dark:text-teal-100/90"
                  >
                    {highlightAnyWords(item.body)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </aside>
  );
}
