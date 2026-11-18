"use client";

import { type ReactNode } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import type { FreeLessonGrammar } from "@/data/any-grammar";

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

export default function SectionGrammar({
  grammar,
}: {
  grammar: FreeLessonGrammar;
}) {
  return (
    <section
      aria-labelledby="any-grammar-title"
      className="min-w-0"
    >
      <div className="relative overflow-hidden rounded-[1.75rem] border-[3px] border-zinc-900 bg-linear-to-br from-amber-50 via-white to-sky-50 shadow-[5px_5px_0_var(--color-zinc-900)] dark:border-zinc-100 dark:from-amber-950/40 dark:via-slate-900 dark:to-sky-950/40 dark:shadow-[5px_5px_0_var(--color-zinc-100)]">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,var(--color-amber-500)_1.15px,transparent_1.5px)] bg-size-[14px_14px] opacity-[0.18] dark:opacity-10"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-10 size-44 rounded-full bg-orange-400/25 blur-2xl dark:bg-orange-400/15"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-12 size-48 rounded-full bg-sky-400/20 blur-2xl dark:bg-sky-400/10"
        />

        <div className="relative flex min-w-0 flex-col gap-7 p-5 sm:gap-8 sm:p-7">
          <header className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-zinc-900 bg-orange-400 px-3 py-1 text-[0.7rem] font-black tracking-wider text-zinc-950 uppercase shadow-[2px_2px_0_var(--color-zinc-900)] dark:border-zinc-100 dark:shadow-[2px_2px_0_var(--color-zinc-100)]">
                <BookOpen aria-hidden className="size-3.5" strokeWidth={2.5} />
                {grammar.kicker}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border-2 border-dashed border-zinc-900/25 bg-white/70 px-2.5 py-1 text-[0.65rem] font-bold tracking-wide text-zinc-600 dark:border-white/20 dark:bg-white/5 dark:text-zinc-300">
                <Sparkles aria-hidden className="size-3" />
                Any
              </span>
            </div>
            <h4
              id="any-grammar-title"
              lang="my"
              className="mt-4 text-2xl leading-snug font-black tracking-tight text-zinc-950 sm:text-3xl dark:text-white"
            >
              {grammar.title}
            </h4>
            <p
              lang="my"
              className="mt-3 max-w-prose text-base leading-relaxed font-medium text-zinc-700 sm:text-lg dark:text-zinc-200"
            >
              {grammar.intro}
            </p>
          </header>

          <ol className="flex min-w-0 flex-col gap-5 sm:gap-6">
            {grammar.rules.map((rule) => (
              <li
                key={rule.n}
                className="min-w-0 rounded-[1.35rem] border-2 border-zinc-900/12 bg-white/80 p-4 sm:p-5 dark:border-white/12 dark:bg-slate-950/45"
              >
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <span
                    aria-hidden
                    className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-zinc-900 bg-emerald-400 text-sm font-black text-zinc-950 shadow-[2px_2px_0_var(--color-zinc-900)] dark:border-zinc-100 dark:shadow-[2px_2px_0_var(--color-zinc-100)]"
                  >
                    {rule.n}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h5
                      lang="my"
                      className="text-lg leading-snug font-black text-zinc-950 sm:text-xl dark:text-white"
                    >
                      {rule.title}
                      <span className="mt-1 block text-sm font-bold tracking-wide text-orange-600 sm:inline sm:mt-0 sm:ms-2 dark:text-orange-400">
                        ({rule.titleEn})
                      </span>
                    </h5>
                    <p
                      lang="my"
                      className="mt-2 text-sm leading-relaxed font-medium text-zinc-700 sm:text-base dark:text-zinc-300"
                    >
                      {rule.body}
                    </p>

                    {rule.pattern ? (
                      <p className="mt-3 inline-flex max-w-full flex-wrap items-baseline gap-x-2 gap-y-1 rounded-xl border-2 border-dashed border-emerald-600/40 bg-emerald-50 px-3 py-2 font-mono text-xs leading-snug font-semibold text-emerald-950 sm:text-sm dark:border-emerald-400/35 dark:bg-emerald-950/40 dark:text-emerald-100">
                        <span className="shrink-0 text-[0.65rem] font-black tracking-wider text-emerald-700 uppercase dark:text-emerald-300">
                          Pattern
                        </span>
                        <span className="min-w-0 wrap-break-word">
                          {rule.pattern}
                        </span>
                      </p>
                    ) : null}

                    {rule.examples?.length ? (
                      <ul className="mt-4 flex min-w-0 flex-col gap-2.5">
                        {rule.examples.map((ex) => (
                          <li
                            key={ex.en}
                            className="min-w-0 rounded-2xl border-2 border-zinc-900 bg-lime-100 px-3.5 py-3 shadow-[3px_3px_0_var(--color-zinc-900)] dark:border-zinc-100 dark:bg-emerald-950 dark:shadow-[3px_3px_0_var(--color-zinc-100)]"
                          >
                            <p className="text-base leading-snug font-bold text-zinc-950 sm:text-lg dark:text-zinc-50">
                              {highlightAnyWords(ex.en)}
                            </p>
                            {ex.my ? (
                              <p
                                lang="my"
                                className="mt-2 border-t-2 border-dashed border-zinc-900/20 pt-2 text-sm leading-snug font-medium text-zinc-700 dark:border-zinc-100/20 dark:text-zinc-300"
                              >
                                {ex.my}
                              </p>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {rule.note ? (
                      <p
                        lang="my"
                        className="mt-4 rounded-xl border-2 border-amber-500/50 bg-amber-100/80 px-3.5 py-2.5 text-sm leading-relaxed font-semibold text-amber-950 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-100"
                      >
                        <span className="me-1.5 inline-block rounded-md bg-amber-500 px-1.5 py-0.5 text-[0.65rem] font-black tracking-wider text-white uppercase">
                          Note
                        </span>
                        {rule.note}
                      </p>
                    ) : null}

                    {rule.compounds?.length ? (
                      <ul className="mt-4 flex min-w-0 flex-col gap-3">
                        {rule.compounds.map((compound) => (
                          <li
                            key={compound.word}
                            className="min-w-0 rounded-2xl border-2 border-sky-600/25 bg-sky-50/90 p-3.5 dark:border-sky-400/25 dark:bg-sky-950/40"
                          >
                            <p className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                              <span className="rounded-lg border-2 border-zinc-900 bg-sky-300 px-2 py-0.5 text-sm font-black text-zinc-950 shadow-[2px_2px_0_var(--color-zinc-900)] dark:border-zinc-100 dark:shadow-[2px_2px_0_var(--color-zinc-100)]">
                                {compound.word}
                              </span>
                              <span
                                lang="my"
                                className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                              >
                                = {compound.meaning}
                              </span>
                            </p>
                            {compound.examples.map((ex) => (
                              <div key={ex.en} className="mt-2.5 min-w-0">
                                <p className="text-base leading-snug font-bold text-zinc-950 dark:text-zinc-50">
                                  {highlightAnyWords(ex.en)}
                                </p>
                                {ex.my ? (
                                  <p
                                    lang="my"
                                    className="mt-1 text-sm leading-snug font-medium text-zinc-600 dark:text-zinc-400"
                                  >
                                    {ex.my}
                                  </p>
                                ) : null}
                              </div>
                            ))}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
