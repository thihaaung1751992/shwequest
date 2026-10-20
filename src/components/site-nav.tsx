"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/teachers", label: "Teachers" },
] as const;

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

export default function SiteNav({ layout = "bar" }: { layout?: "bar" | "cluster" }) {
  const pathname = usePathname();
  const spread = layout === "bar";

  return (
    <nav
      aria-label="Main"
      className={
        spread
          ? "flex min-w-0 basis-full flex-wrap items-center gap-x-2 gap-y-1 sm:flex-1 sm:basis-auto sm:flex-nowrap"
          : "flex max-w-full flex-wrap items-center justify-end gap-x-2 gap-y-1"
      }
    >
      <ul
        className={
          spread
            ? "flex min-w-0 flex-1 items-center justify-center gap-1 sm:gap-5"
            : "flex items-center gap-1 sm:gap-4"
        }
      >
        {LINKS.map((link) => {
          const current = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm font-semibold sm:px-2.5 ${FOCUS} ${
                  current
                    ? "text-zinc-950 dark:text-white"
                    : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
                }`}
              >
                {current ? (
                  <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-orange-500" />
                ) : null}
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="flex shrink-0 items-center gap-2">
        <span
          aria-hidden
          className="hidden size-11 place-items-center rounded-full bg-orange-500 text-white sm:grid"
        >
          <Globe className="size-5" />
        </span>
        <Link
          href="/teachers"
          className={`inline-flex min-h-11 items-center rounded-full bg-zinc-950 px-3.5 text-sm font-bold whitespace-nowrap text-white sm:px-4 dark:bg-white dark:text-zinc-950 ${FOCUS}`}
        >
          See teachers
        </Link>
      </div>
    </nav>
  );
}
