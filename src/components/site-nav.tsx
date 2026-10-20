"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/teachers", label: "Teachers" },
] as const;

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

const PRESS =
  "transition-transform motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0.5";

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="shrink-0 rounded-full border-2 border-amber-200 bg-amber-50 p-1 dark:border-white/10 dark:bg-white/5"
    >
      <ul className="flex items-center gap-1">
        {LINKS.map((link) => {
          const current = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={
                  current
                    ? `inline-flex min-h-11 items-center rounded-full bg-linear-to-b from-amber-200 to-amber-400 px-3 text-sm font-extrabold text-amber-950 shadow-[inset_0_2px_0_rgba(255,255,255,0.8),0_4px_0_0_#b45309] motion-safe:hover:shadow-[inset_0_2px_0_rgba(255,255,255,0.8),0_6px_0_0_#b45309] motion-safe:active:shadow-[inset_0_2px_0_rgba(255,255,255,0.8),0_1px_0_0_#b45309] ${PRESS} ${FOCUS}`
                    : `inline-flex min-h-11 items-center rounded-full px-3 text-sm font-extrabold text-amber-900 hover:bg-white hover:text-amber-950 hover:shadow-[0_4px_0_0_#f6c445] dark:text-amber-100 dark:hover:bg-white/10 ${PRESS} ${FOCUS}`
                }
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
