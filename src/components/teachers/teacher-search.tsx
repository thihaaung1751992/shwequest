"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useMessages } from "@/i18n/locale-context";

const RESULTS_ID = "teacher-results";

export default function TeacherSearch() {
  const copy = useMessages();
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
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

      // Only the Card/Tile/List grids own [data-teacher-name] items as direct
      // children. Skip nested lists (e.g. video/game chips inside TeacherCard).
      root.querySelectorAll("ul").forEach((list) => {
        const owned = [
          ...list.querySelectorAll<HTMLElement>(":scope > [data-teacher-name]"),
        ];
        if (owned.length === 0) return;
        list.hidden = !owned.some((item) => !item.hidden);
      });

      const empty = document.getElementById("teacher-search-empty");
      if (empty) {
        empty.hidden = q.length === 0 || shown > 0;
        const slot = empty.querySelector("[data-query]");
        const nextQuery = value.trim();
        if (slot && slot.textContent !== nextQuery) slot.textContent = nextQuery;
        const lead = empty.querySelector("[data-empty-lead]");
        const tail = empty.querySelector("[data-empty-tail]");
        if (lead && lead.textContent !== copy.teachers.emptyLead) {
          lead.textContent = copy.teachers.emptyLead;
        }
        if (tail && tail.textContent !== copy.teachers.emptyTail) {
          tail.textContent = copy.teachers.emptyTail;
        }
      }

      const status = document.getElementById("teacher-search-status");
      if (status) {
        status.textContent = q.length === 0 ? "" : copy.teachers.matches(shown);
      }
    };

    apply();
    const root = document.getElementById(RESULTS_ID);
    if (!root) return;
    const observer = new MutationObserver(apply);
    observer.observe(root, { childList: true });
    return () => observer.disconnect();
  }, [value, copy]);

  return (
    <form
      role="search"
      className="flex w-full min-w-0 items-center gap-2 rounded-full bg-white py-1.5 pr-1.5 pl-5 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.28)] ring-1 ring-zinc-200/80 dark:bg-slate-950 dark:ring-white/10 sm:max-w-md"
      onSubmit={(event) => {
        event.preventDefault();
        inputRef.current?.blur();
      }}
    >
      <label htmlFor={id} className="sr-only">
        {copy.teachers.searchLabel}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="search"
        inputMode="search"
        value={value}
        maxLength={80}
        placeholder={copy.teachers.searchPlaceholder}
        autoComplete="off"
        aria-controls={RESULTS_ID}
        onChange={(event) => setValue(event.target.value)}
        className="min-w-0 flex-1 bg-transparent py-2 text-sm font-semibold text-zinc-900 outline-hidden placeholder:font-medium placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label={copy.teachers.clear}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:text-zinc-300 dark:hover:bg-white/10"
        >
          <X aria-hidden className="size-4" strokeWidth={2.75} />
        </button>
      ) : null}
      <button
        type="submit"
        aria-label={copy.teachers.search}
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-xs transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
      >
        <Search aria-hidden className="size-4" strokeWidth={2.75} />
      </button>
    </form>
  );
}
