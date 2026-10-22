"use client";

import { useMessages } from "@/i18n/locale-context";

export default function TeachersIntro() {
  const copy = useMessages();

  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight">{copy.teachers.title}</h2>
      <p className="mt-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
        {copy.teachers.body}
      </p>
    </>
  );
}
