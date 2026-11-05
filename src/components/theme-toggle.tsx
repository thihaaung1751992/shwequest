"use client";

import { Moon, Sun } from "lucide-react";
import { useMessages } from "@/i18n/locale-context";
import { useTheme } from "@/theme/theme-context";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const copy = useMessages();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className={`grid size-8 shrink-0 cursor-pointer place-items-center rounded-full border border-zinc-300 bg-white text-zinc-700 shadow-[0_3px_8px_-5px_rgba(24,24,27,0.4)] transition-[background-color,border-color,color,box-shadow,transform] duration-150 hover:-translate-y-px hover:border-amber-400 hover:bg-amber-50 hover:text-amber-950 hover:shadow-[0_6px_14px_-6px_rgba(180,83,9,0.45)] sm:size-9 dark:border-white/25 dark:bg-slate-800 dark:text-zinc-200 dark:hover:border-amber-300 dark:hover:bg-amber-400/15 dark:hover:text-amber-100 ${FOCUS}`}
      aria-label={copy.toggleTheme(next)}
      aria-pressed={theme === "dark"}
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <Sun className="size-5 sm:size-6" strokeWidth={1.75} aria-hidden />
      ) : (
        <Moon className="size-5 sm:size-6" strokeWidth={1.75} aria-hidden />
      )}
    </button>
  );
}
