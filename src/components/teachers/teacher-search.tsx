"use client";

import { useEffect, useId, useState } from "react";
import { Search, X } from "lucide-react";

const RESULTS_ID = "teacher-results";

export default function TeacherSearch() {
  const id = useId();
  const [value, setValue] = useState("");

  useEffect(() => {
    const q = value.trim().toLowerCase();

    const apply = () => {
      const root = document.getElementById(RESULTS_ID);
      if (!root) return;

      const items = root.querySelectorAll<HTMLElement>("[data-teacher-name]");
      let shown = 0;
      items.forEach((item) => {
        const name = item.dataset.teacherName?.toLowerCase() ?? "";
        const match = q.length === 0 || name.includes(q);
        item.hidden = !match;
        if (match) shown += 1;
      });

      root.querySelectorAll("ul").forEach((list) => {
        const visible = [...list.querySelectorAll<HTMLElement>("[data-teacher-name]")].some(
          (item) => !item.hidden,
        );
        list.hidden = !visible;
      });

      const empty = document.getElementById("teacher-search-empty");
      if (empty) {
        empty.hidden = q.length === 0 || shown > 0;
        const slot = empty.querySelector("[data-query]");
        const nextQuery = value.trim();
        if (slot && slot.textContent !== nextQuery) slot.textContent = nextQuery;
      }

      const status = document.getElementById("teacher-search-status");
      if (status) {
        status.textContent =
          q.length === 0 ? "" : `${shown} matching ${shown === 1 ? "teacher" : "teachers"}`;
      }
    };

    apply();
    const root = document.getElementById(RESULTS_ID);
    if (!root) return;
    const observer = new MutationObserver(apply);
    observer.observe(root, { childList: true });
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className="relative w-full min-w-0 sm:max-w-sm">
      <label htmlFor={id} className="sr-only">
        Search teachers
      </label>
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1.5 flex size-9 -translate-y-1/2 items-center justify-center rounded-xl bg-amber-400 text-amber-950 shadow-xs"
      >
        <Search className="size-4" strokeWidth={2.75} />
      </span>
      <input
        id={id}
        type="search"
        inputMode="search"
        value={value}
        maxLength={80}
        placeholder="Search teachers"
        autoComplete="off"
        aria-controls={RESULTS_ID}
        onChange={(event) => setValue(event.target.value)}
        className="h-12 w-full rounded-2xl border-2 border-amber-200 bg-white/80 pr-11 pl-12 text-sm font-bold text-zinc-900 shadow-xs outline-hidden placeholder:font-semibold placeholder:text-zinc-400 focus-visible:border-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:border-white/10 dark:bg-slate-950/70 dark:text-zinc-100 dark:placeholder:text-zinc-500 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-1.5 flex size-9 -translate-y-1/2 items-center justify-center rounded-xl text-zinc-500 hover:bg-amber-50 hover:text-amber-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:text-zinc-300 dark:hover:bg-white/5"
        >
          <X aria-hidden className="size-4" strokeWidth={2.75} />
        </button>
      ) : null}
    </div>
  );
}
