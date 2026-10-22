"use client";

import { Check, Globe } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { localeLabel, LOCALES, type Locale } from "@/i18n/messages";
import { useLocale, useMessages } from "@/i18n/locale-context";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

export default function LanguageMenu() {
  const { locale, setLocale } = useLocale();
  const copy = useMessages();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const currentName = localeLabel(locale);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const selected = rootRef.current?.querySelector<HTMLButtonElement>(
      '[aria-checked="true"]',
    );
    selected?.focus();
  }, [open]);

  function choose(next: Locale) {
    setLocale(next);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function onMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const items = [
      ...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'),
    ];
    if (items.length === 0) return;
    const index = items.findIndex((item) => item === document.activeElement);
    const delta = event.key === "ArrowDown" ? 1 : -1;
    const next = items[(index + delta + items.length) % items.length];
    next?.focus();
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        className={`grid size-8 shrink-0 cursor-pointer place-items-center rounded-full border bg-white text-zinc-700 shadow-[0_3px_8px_-5px_rgba(24,24,27,0.4)] transition-[background-color,border-color,color,box-shadow,transform] duration-150 sm:size-9 dark:bg-slate-800 dark:text-zinc-200 ${FOCUS} ${
          open
            ? "border-amber-400 bg-amber-50 text-amber-950 dark:border-amber-300 dark:bg-amber-400/15 dark:text-amber-100"
            : "border-zinc-300 hover:-translate-y-px hover:border-amber-400 hover:bg-amber-50 hover:text-amber-950 hover:shadow-[0_6px_14px_-6px_rgba(180,83,9,0.45)] dark:border-white/25 dark:hover:border-amber-300 dark:hover:bg-amber-400/15 dark:hover:text-amber-100"
        }`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={copy.currentLanguage(currentName)}
        onClick={() => setOpen((value) => !value)}
      >
        <Globe className="size-6 sm:size-7" strokeWidth={1.75} aria-hidden />
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={copy.language}
          onKeyDown={onMenuKeyDown}
          className="absolute top-[calc(100%+0.45rem)] left-0 z-50 min-w-44 overflow-hidden rounded-2xl border border-amber-200/90 bg-white py-1 shadow-[0_16px_40px_-18px_rgba(120,53,15,0.5)] dark:border-white/15 dark:bg-slate-900"
        >
          {LOCALES.map((option) => {
            const selected = option === locale;
            const label = localeLabel(option);
            return (
              <button
                key={option}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                lang={option === "my" ? "my" : "en"}
                className={`flex min-h-11 w-full cursor-pointer items-center gap-2 px-3 text-left text-sm font-bold ${FOCUS} ${
                  selected
                    ? "bg-amber-100 text-amber-950 dark:bg-amber-400/15 dark:text-amber-100"
                    : "text-zinc-800 hover:bg-amber-50 dark:text-zinc-100 dark:hover:bg-white/10"
                }`}
                onClick={() => choose(option)}
              >
                <span className="grid size-4 shrink-0 place-items-center" aria-hidden>
                  {selected ? <Check className="size-4" strokeWidth={2.75} /> : null}
                </span>
                {label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
