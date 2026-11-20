"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import ThemeToggle from "@/components/theme-toggle";
import {
  BookOpen,
  Clapperboard,
  ContactRound,
  LayoutDashboard,
  Menu,
  Shield,
  Trophy,
  Users,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

type NavItem = {
  href: string;
  label: string;
  Icon: LucideIcon;
  match?: "exact" | "prefix";
};

const NAV: readonly NavItem[] = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard, match: "exact" },
  { href: "/admin/site", label: "Site", Icon: Shield, match: "prefix" },
  { href: "/admin/lessons", label: "Lessons", Icon: BookOpen, match: "prefix" },
  {
    href: "/admin/videos",
    label: "Videos",
    Icon: Clapperboard,
    match: "prefix",
  },
  { href: "/admin/teachers", label: "Teachers", Icon: Users, match: "prefix" },
  { href: "/admin/team", label: "Team", Icon: UserRound, match: "prefix" },
  {
    href: "/admin/members",
    label: "Members",
    Icon: ContactRound,
    match: "prefix",
  },
  {
    href: "/admin/leaderboard",
    label: "Leaderboard",
    Icon: Trophy,
    match: "prefix",
  },
];

function navActive(pathname: string, item: NavItem): boolean {
  if (item.match === "exact") return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function shellTitle(pathname: string): string {
  if (pathname === "/admin") return "Overview";
  if (pathname === "/admin/site" || pathname.startsWith("/admin/site/")) {
    return "Site";
  }
  if (
    pathname === "/admin/lessons" ||
    pathname.startsWith("/admin/lessons/")
  ) {
    return "Lessons";
  }
  if (
    pathname === "/admin/videos" ||
    pathname.startsWith("/admin/videos/")
  ) {
    return "Videos";
  }
  if (
    pathname === "/admin/teachers" ||
    pathname.startsWith("/admin/teachers/")
  ) {
    return "Teachers";
  }
  if (pathname === "/admin/team" || pathname.startsWith("/admin/team/")) {
    return "Team";
  }
  if (
    pathname === "/admin/members" ||
    pathname.startsWith("/admin/members/")
  ) {
    return "Members";
  }
  if (
    pathname === "/admin/leaderboard" ||
    pathname.startsWith("/admin/leaderboard/")
  ) {
    return "Leaderboard";
  }
  const match = NAV.find((item) => navActive(pathname, item));
  return match?.label ?? "Admin";
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const panelId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const nav = (
    <nav aria-label="Admin" className="flex flex-1 flex-col gap-1 p-3">
      {NAV.map((item) => {
        const active = navActive(pathname, item);
        const Icon = item.Icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${FOCUS} ${
              active
                ? "bg-emerald-600 text-white shadow-[0_2px_0_rgb(4_120_87)]"
                : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <Icon
              className={`size-4.5 shrink-0 ${active ? "text-white" : "text-zinc-500 group-hover:text-emerald-700 dark:text-zinc-400 dark:group-hover:text-emerald-300"}`}
              aria-hidden
              strokeWidth={2.25}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="relative flex min-h-dvh bg-cream font-sans text-zinc-900 dark:bg-slate-950 dark:text-zinc-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgb(16_185_129_/_0.12),_transparent_45%),radial-gradient(ellipse_at_bottom_right,_rgb(14_165_233_/_0.1),_transparent_40%)] dark:bg-[radial-gradient(ellipse_at_top_left,_rgb(16_185_129_/_0.1),_transparent_45%),radial-gradient(ellipse_at_bottom_right,_rgb(14_165_233_/_0.08),_transparent_40%)]"
      />

      {/* Desktop sidebar */}
      <aside className="relative z-20 hidden w-64 shrink-0 flex-col border-r border-zinc-200/80 bg-white/80 backdrop-blur-md lg:flex dark:border-white/10 dark:bg-slate-900/80">
        <div className="flex items-center gap-3 border-b border-zinc-200/80 px-4 py-4 dark:border-white/10">
          <Link
            href="/"
            aria-label="Shwequest home"
            className={`inline-flex shrink-0 rounded-xl ${FOCUS}`}
          >
            <Image
              src="/shwequest-logo.jpg"
              alt=""
              width={560}
              height={486}
              className="h-10 w-auto rounded-lg ring-2 ring-amber-200 dark:ring-amber-500/40"
            />
          </Link>
          <div className="min-w-0">
            <p className="truncate text-sm font-black tracking-tight">Shwequest</p>
            <p className="truncate text-[0.65rem] font-bold tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
              Admin
            </p>
          </div>
        </div>
        {nav}
        <p className="px-4 pb-4 text-[0.65rem] font-medium text-zinc-400 dark:text-zinc-500">
          Demo catalog · site gate only
        </p>
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[2px]"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute inset-y-0 left-0 flex w-[min(18rem,88vw)] flex-col border-r border-zinc-200/80 bg-cream shadow-xl dark:border-white/10 dark:bg-slate-950"
          >
            <div className="flex items-center justify-between border-b border-zinc-200/80 px-4 py-3 dark:border-white/10">
              <p id={titleId} className="text-sm font-black">
                Admin menu
              </p>
              <button
                type="button"
                className={`inline-flex size-9 items-center justify-center rounded-xl text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10 ${FOCUS}`}
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      ) : null}

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-zinc-200/80 bg-cream/85 px-4 py-3 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/85 sm:px-6">
          <button
            type="button"
            className={`inline-flex size-10 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-zinc-800 lg:hidden dark:border-white/10 dark:bg-slate-900 dark:text-zinc-100 ${FOCUS}`}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" aria-hidden />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[0.65rem] font-bold tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
              Project dashboard
            </p>
            <h1 className="truncate text-lg font-black tracking-tight sm:text-xl">
              {shellTitle(pathname)}
            </h1>
          </div>
          <ThemeToggle />
          <Link
            href="/"
            className={`hidden items-center rounded-full border border-zinc-200/80 bg-white px-3 py-2 text-xs font-bold text-zinc-800 sm:inline-flex dark:border-white/10 dark:bg-slate-900 dark:text-zinc-100 ${FOCUS}`}
          >
            Back to site
          </Link>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
