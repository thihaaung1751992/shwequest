"use client";

import { useId, useRef } from "react";
import { Search, X } from "lucide-react";
import { useMessages } from "@/i18n/locale-context";

export default function SelfStudySearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const copy = useMessages();
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      role="search"
      className="nav-track-3d flex w-full min-w-0 items-center gap-2 rounded-full py-1.5 pr-1.5 pl-5 sm:max-w-md"
      onSubmit={(event) => {
        event.preventDefault();
        inputRef.current?.blur();
      }}
    >
      <label htmlFor={id} className="sr-only">
        {copy.selfStudy.searchLabel}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="search"
        inputMode="search"
        value={value}
        maxLength={80}
        placeholder={copy.selfStudy.searchPlaceholder}
        autoComplete="off"
        aria-controls="self-study-results"
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 bg-transparent py-2 text-sm font-semibold text-zinc-900 outline-hidden placeholder:font-medium placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={copy.selfStudy.clear}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:text-zinc-300 dark:hover:bg-white/10"
        >
          <X aria-hidden className="size-4" strokeWidth={2.75} />
        </button>
      ) : null}
      <button
        type="submit"
        aria-label={copy.selfStudy.search}
        className="flex size-10 shrink-0 items-center justify-center rounded-full text-white transition-[box-shadow] cta-3d cta-3d-emerald focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
      >
        <Search aria-hidden className="size-4" strokeWidth={2.75} />
      </button>
    </form>
  );
}
