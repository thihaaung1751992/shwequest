"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import FrostGlass from "@/components/frost-glass";
import { useMessages } from "@/i18n/locale-context";

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
  const copy = useMessages();
  const pathname = usePathname();
  const linkLabel: Record<LinkHref, string> = {
    "/": copy.nav.home,
    "/teachers": copy.nav.teachers,
    "/leaderboard": copy.nav.leaderboard,
  };
  const spread = layout === "bar";
  const panelId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Partial<Record<LinkHref, HTMLAnchorElement | null>>>({});
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [hoverHref, setHoverHref] = useState<LinkHref | null>(null);
  const [pill, setPill] = useState<PillBox | null>(null);
  const [pillMotion, setPillMotion] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathSeen = useRef(pathname);

  // Route change: drop hover and snap. Transition stays off until after that paint
  // so a remounted nav does not slide the pill in a second time.
  if (pathSeen.current !== pathname) {
    pathSeen.current = pathname;
    if (hoverHref !== null) setHoverHref(null);
    if (pillMotion) setPillMotion(false);
  }

  const activeHref =
    LINKS.find((link) => link.href === pathname)?.href ?? null;
  const targetHref = hoverHref ?? activeHref;

  const closeMenu = useCallback(() => setMenuOpen(false), []);

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

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      first?.focus();
    });
    return () => {
      document.body.style.overflow = previous;
      window.cancelAnimationFrame(frame);
      menuButtonRef.current?.focus();
    };
  }, [menuOpen]);

  useLayoutEffect(() => {
    placePill();
    const list = listRef.current;
    if (!list) return;
    const ro = new ResizeObserver(() => placePill());
    ro.observe(list);
    for (const link of LINKS) {
      const el = linkRefs.current[link.href];
      if (el) ro.observe(el);
    }
    let frame = 0;
    frame = window.requestAnimationFrame(() => setPillMotion(true));
    return () => {
      window.cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [placePill]);

  function onPanelKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusable = [
      ...panelRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      ),
    ];
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const ctaClass = `group relative inline-flex min-h-11 items-center gap-2 overflow-hidden rounded-full bg-zinc-950 px-3.5 text-sm font-bold whitespace-nowrap text-white transition-[overflow] motion-safe:hover:overflow-visible sm:px-4 dark:bg-white dark:text-zinc-950 ${FOCUS}`;

  return (
    <nav
      aria-label={copy.nav.main}
      className={
        spread
          ? "flex min-w-0 flex-1 items-center justify-end gap-2 md:gap-3"
          : "flex max-w-full shrink-0 items-center justify-end gap-2"
      }
    >
      {/* Mobile: hamburger */}
      <button
        ref={menuButtonRef}
        type="button"
        className={`grid size-11 shrink-0 place-items-center rounded-full border border-amber-200 bg-white text-amber-950 shadow-[0_6px_14px_-10px_rgba(180,83,9,0.55)] md:hidden dark:border-white/15 dark:bg-slate-900 dark:text-amber-100 ${FOCUS}`}
        aria-expanded={menuOpen}
        aria-controls={panelId}
        aria-label={menuOpen ? copy.nav.closeMenu : copy.nav.openMenu}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? (
          <X className="size-5" strokeWidth={2.25} aria-hidden />
        ) : (
          <Menu className="size-5" strokeWidth={2.25} aria-hidden />
        )}
      </button>

      {/* Desktop: sliding pill follows hover, snaps on the active route */}
      <div className="hidden min-w-0 items-center gap-x-3 md:flex">
        <ul
          ref={listRef}
          onPointerLeave={() => setHoverHref(null)}
          className="relative flex items-center gap-0.5 rounded-full bg-amber-100/70 p-1 ring-1 ring-amber-200/80 sm:gap-1 dark:bg-white/10 dark:ring-white/15"
        >
          {pill ? (
            <span
              aria-hidden
              className={`pointer-events-none absolute top-0 left-0 z-0 rounded-full bg-amber-400 shadow-[0_6px_14px_-8px_rgba(180,83,9,0.55)] dark:bg-amber-400 ${
                reducedMotion || !pillMotion
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
                  className={`relative z-10 inline-flex min-h-10 items-center rounded-full px-3 text-sm font-semibold ${FOCUS} ${
                    lit
                      ? "font-bold text-amber-950"
                      : "text-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  {linkLabel[link.href]}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/teachers" className={ctaClass}>
            <FrostGlass />
            <span className="relative z-10">{copy.seeTeachers}</span>
            <ArrowRight aria-hidden className="relative z-10 size-4" />
          </Link>
        </div>
      </div>

      {/* Mobile sheet */}
      {menuOpen ? (
        <div className="fixed inset-0 z-50 md:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
            aria-label={copy.nav.closeMenu}
            onClick={closeMenu}
          />
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label={copy.nav.menu}
            tabIndex={-1}
            onKeyDown={onPanelKeyDown}
            className={`absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col bg-cream shadow-[-12px_0_40px_-20px_rgba(15,23,42,0.45)] outline-hidden dark:bg-slate-950 ${
              reducedMotion ? "" : "animate-nav-sheet-in"
            }`}
          >
            <div className="flex items-center justify-between border-b border-amber-200/80 px-4 py-3 dark:border-white/10">
              <p className="text-xs font-bold tracking-[0.14em] text-amber-800 uppercase dark:text-amber-300">
                {copy.nav.menu}
              </p>
              <button
                type="button"
                className={`grid size-11 place-items-center rounded-full bg-white text-zinc-800 ring-1 ring-amber-200 dark:bg-slate-900 dark:text-zinc-100 dark:ring-white/15 ${FOCUS}`}
                aria-label={copy.nav.closeMenu}
                onClick={closeMenu}
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <ul className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
              {LINKS.map((link) => {
                const current = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      onClick={closeMenu}
                      className={`flex min-h-12 items-center rounded-2xl px-4 text-base font-bold tracking-tight ${FOCUS} ${
                        current
                          ? "bg-amber-400 text-amber-950 shadow-[0_8px_18px_-12px_rgba(180,83,9,0.7)]"
                          : "bg-white/70 text-zinc-900 ring-1 ring-amber-100 hover:bg-amber-50 dark:bg-white/5 dark:text-zinc-50 dark:ring-white/10 dark:hover:bg-white/10"
                      }`}
                    >
                      {linkLabel[link.href]}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-amber-200/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-white/10">
              <Link
                href="/teachers"
                onClick={closeMenu}
                className={`${ctaClass} w-full justify-center`}
              >
                <FrostGlass />
                <span className="relative z-10">{copy.seeTeachers}</span>
                <ArrowRight aria-hidden className="relative z-10 size-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
