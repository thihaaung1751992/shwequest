"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useMessages } from "@/i18n/locale-context";
import { type Theme } from "@/theme/theme";
import { useTheme } from "@/theme/theme-context";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

/** Springy overshoot — same family as count-pop / nav-sheet. */
const SPRING = "ease-[cubic-bezier(0.34,1.56,0.64,1)]";

const OPTIONS: readonly {
  value: Theme;
  Icon: LucideIcon;
  thumb: string;
}[] = [
  { value: "light", Icon: Sun, thumb: "translate-x-0" },
  { value: "system", Icon: Monitor, thumb: "translate-x-full" },
  { value: "dark", Icon: Moon, thumb: "translate-x-[200%]" },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const copy = useMessages();
  const active = OPTIONS.find((option) => option.value === theme) ?? OPTIONS[0];

  return (
    <div
      role="radiogroup"
      aria-label={copy.theme}
      className="stat-chip-3d pill-3d-emerald-deep relative grid h-8 w-[5.5rem] shrink-0 grid-cols-3 items-center rounded-full p-0.5 sm:h-9 sm:w-[6.25rem]"
    >
      <span
        key={theme}
        aria-hidden
        className={`pointer-events-none absolute top-0.5 left-0.5 z-[1] aspect-square h-[calc(100%-4px)] rounded-full bg-linear-to-b from-white to-zinc-100 shadow-[inset_0_1.5px_0_rgb(255_255_255/0.95),inset_0_-1px_0_rgb(0_0_0/0.06),0_2px_0_var(--color-zinc-300),0_4px_8px_-3px_rgb(0_0_0/0.28)] transition-transform duration-500 motion-safe:animate-count-pop motion-reduce:transition-none ${SPRING} ${active.thumb}`}
      />
      {OPTIONS.map(({ value, Icon }) => {
        const selected = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={copy.toggleTheme(value)}
            className={`relative z-[2] grid size-full cursor-pointer place-items-center rounded-full transition-[color,transform] duration-200 active:scale-90 ${SPRING} ${FOCUS} ${
              selected
                ? "text-emerald-900"
                : "text-white hover:scale-110 hover:text-white [text-shadow:0_1px_0_rgb(0_0_0/0.3)]"
            }`}
            onClick={() => setTheme(value)}
          >
            <Icon
              key={selected ? `${value}-on` : value}
              className={`size-3.5 sm:size-4 motion-reduce:animate-none ${
                selected ? "motion-safe:animate-count-pop" : ""
              }`}
              strokeWidth={selected ? 2.5 : 2.25}
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}
