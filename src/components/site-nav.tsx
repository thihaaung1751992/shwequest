"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ArrowRight, Globe } from "lucide-react";
import FrostGlass from "@/components/frost-glass";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/teachers", label: "Teachers" },
  { href: "/leaderboard", label: "Leaderboard" },
] as const;

type LinkHref = (typeof LINKS)[number]["href"];

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

type PillBox = { x: number; y: number; w: number; h: number };

export default function SiteNav({ layout = "bar" }: { layout?: "bar" | "cluster" }) {
  const pathname = usePathname();
  const spread = layout === "bar";
  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Partial<Record<LinkHref, HTMLAnchorElement | null>>>({});
  const [hoverHref, setHoverHref] = useState<LinkHref | null>(null);
  const [pill, setPill] = useState<PillBox | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const activeHref =
    LINKS.find((link) => link.href === pathname)?.href ?? null;
  const targetHref = hoverHref ?? activeHref;

  const placePill = useCallback(() => {
    const list = listRef.current;
    if (!list || !targetHref) {
      setPill(null);
      return;
    }
    const el = linkRefs.current[targetHref];
    if (!el) {
      setPill(null);
      return;
    }
    // getBoundingClientRect vs list — offsetLeft breaks when <li> is position:relative
    // (pill stuck at x≈0 with the target's width, e.g. Leaderboard covering Home+Teachers).
    const listBox = list.getBoundingClientRect();
    const linkBox = el.getBoundingClientRect();
    setPill({
      x: linkBox.left - listBox.left + list.scrollLeft,
      y: linkBox.top - listBox.top + list.scrollTop,
      w: linkBox.width,
      h: linkBox.height,
    });
  }, [targetHref]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    placePill();
    const list = listRef.current;
    if (!list) return;
    const ro = new ResizeObserver(() => placePill());
    ro.observe(list);
    return () => ro.disconnect();
  }, [placePill]);

  return (
    <nav
      aria-label="Main"
      className={
        spread
          ? "flex min-w-0 basis-full flex-wrap items-center gap-x-3 gap-y-1 sm:flex-1 sm:basis-auto sm:flex-nowrap"
          : "flex max-w-full flex-wrap items-center justify-end gap-x-3 gap-y-1"
      }
    >
      <ul
        ref={listRef}
        onPointerLeave={() => setHoverHref(null)}
        className={
          spread
            ? "relative flex min-w-0 items-center gap-0.5 rounded-full bg-amber-100/70 p-1 ring-1 ring-amber-200/80 sm:gap-1 dark:bg-white/10 dark:ring-white/15"
            : "relative flex items-center gap-0.5 rounded-full bg-amber-100/70 p-1 ring-1 ring-amber-200/80 sm:gap-1 dark:bg-white/10 dark:ring-white/15"
        }
      >
        {pill ? (
          <span
            aria-hidden
            className={`pointer-events-none absolute top-0 left-0 z-0 rounded-full bg-amber-400 shadow-[0_6px_14px_-8px_rgba(180,83,9,0.55)] dark:bg-amber-400 ${
              reducedMotion
                ? ""
                : "transition-[transform,width,height] duration-300 ease-[cubic-bezier(0.34,1.2,0.64,1)]"
            }`}
            style={{
              width: pill.w,
              height: pill.h,
              transform: `translate(${pill.x}px, ${pill.y}px)`,
            }}
          />
        ) : null}
        {LINKS.map((link) => {
          const current = pathname === link.href;
          const lit = targetHref === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                ref={(node) => {
                  linkRefs.current[link.href] = node;
                }}
                aria-current={current ? "page" : undefined}
                onPointerEnter={() => setHoverHref(link.href)}
                onFocus={() => setHoverHref(link.href)}
                onBlur={() => setHoverHref(null)}
                className={`relative z-10 inline-flex min-h-9 items-center rounded-full px-2.5 text-sm font-semibold sm:min-h-10 sm:px-3 ${FOCUS} ${
                  lit
                    ? "font-bold text-amber-950"
                    : "text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <span
          aria-hidden
          className="hidden size-11 place-items-center rounded-full border border-zinc-300 text-zinc-500 sm:grid dark:border-white/20 dark:text-zinc-400"
        >
          <Globe className="size-5" strokeWidth={1.75} />
        </span>
        <Link
          href="/teachers"
          className={`group relative inline-flex min-h-11 items-center gap-2 overflow-hidden rounded-full bg-zinc-950 px-3.5 text-sm font-bold whitespace-nowrap text-white transition-[overflow] motion-safe:hover:overflow-visible sm:px-4 dark:bg-white dark:text-zinc-950 ${FOCUS}`}
        >
          <FrostGlass />
          <span className="relative z-10">See teachers</span>
          <ArrowRight aria-hidden className="relative z-10 size-4" />
        </Link>
      </div>
    </nav>
  );
}
