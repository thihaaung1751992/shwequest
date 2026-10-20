import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Home · Shwequest",
};

export default function HomePage() {
  return (
    <PageShell title="Shwequest">
      <h2 className="text-2xl font-bold tracking-tight">Start from a teacher</h2>
      <p className="mt-2 max-w-prose text-sm font-medium text-zinc-600 dark:text-zinc-300">
        The learning path opens when you choose a teacher.
      </p>
      <Link
        href="/teachers"
        className="mt-6 inline-flex min-h-11 items-center rounded-full bg-amber-400 px-5 text-sm font-bold text-amber-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
      >
        See teachers
      </Link>
    </PageShell>
  );
}
