"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUp, ArrowUpRight, Play, Swords, Users } from "lucide-react";
import FrostGlass from "@/components/frost-glass";
import { useMessages } from "@/i18n/locale-context";
import { TEACHERS, catalogTotals } from "@/data/teachers";

const TOTALS = catalogTotals();

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/teachers", label: "Teachers" },
  { href: "/team", label: "Team" },
  { href: "/leaderboard", label: "Leaderboard" },
] as const;

const STATS = [
  { value: TOTALS.videos, id: "videos", Icon: Play, tone: "pill-3d-amber text-amber-950" },
  { value: TOTALS.games, id: "games", Icon: Swords, tone: "pill-3d-emerald text-white" },
  { value: TEACHERS.length, id: "teachers", Icon: Users, tone: "pill-3d-sky text-sky-950" },
] as const;

const TIKTOK_NOTE =
  "M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5 fill-current">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 2.188 2.188 0 0 0-1.635.57 2.32 2.32 0 0 0-.529 1.727v2.674h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  );
}

function TikTokMark() {
  return (
    <span className="relative block size-5">
      <svg viewBox="0 0 24 24" aria-hidden className="absolute inset-0 size-5 translate-x-px fill-[#25F4EE]">
        <path d={TIKTOK_NOTE} />
      </svg>
      <svg viewBox="0 0 24 24" aria-hidden className="absolute inset-0 size-5 -translate-x-px fill-[#FE2C55]">
        <path d={TIKTOK_NOTE} />
      </svg>
      <svg viewBox="0 0 24 24" aria-hidden className="relative size-5 fill-zinc-950 dark:fill-white">
        <path d={TIKTOK_NOTE} />
      </svg>
    </span>
  );
}

const SOCIAL = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    className: "pill-3d-orange text-white",
    Mark: FacebookMark,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/",
    className:
      "text-zinc-800 [--pill-edge:var(--color-amber-300)] [--pill-top:var(--color-white)] [--pill-bottom:var(--color-amber-50)] [--pill-text-shadow:transparent] dark:text-white dark:[--pill-edge:var(--color-slate-950)] dark:[--pill-top:var(--color-slate-600)] dark:[--pill-bottom:var(--color-slate-800)]",
    Mark: TikTokMark,
  },
] as const;

export default function SiteFooter() {
  const copy = useMessages();
  const linkLabel = {
    "/": copy.nav.home,
    "/teachers": copy.nav.teachers,
    "/team": copy.nav.team,
    "/leaderboard": copy.nav.leaderboard,
  } as const;

  const backToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer className="footer-stage mt-auto overflow-hidden rounded-t-[2.5rem] text-zinc-600 sm:rounded-t-[3rem] dark:text-zinc-300">
      <div className="mx-auto flex w-full max-w-page flex-col gap-6 px-4 pt-10 sm:gap-8 sm:pt-14">
        <section
          aria-labelledby="footer-cta-title"
          className="footer-card-3d footer-card-orange flex flex-col gap-6 overflow-hidden rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 lg:px-10"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -top-16 -right-10 -z-10 size-48 rounded-full bg-orange-300/40 blur-2xl"
          />
          <div className="flex min-w-0 flex-col gap-3">
            <p className="pill-3d pill-3d-amber w-fit -rotate-2 rounded-full px-3 py-1 text-sm font-bold text-amber-950 motion-reduce:rotate-none">
              {copy.footer.start}
            </p>
            <h2
              id="footer-cta-title"
              className="text-2xl font-black tracking-tight text-balance text-white [text-shadow:0_2px_0_rgb(0_0_0/0.18)] sm:text-3xl lg:text-4xl"
            >
              {copy.footer.ctaTitle}
            </h2>
            <p className="max-w-md text-sm leading-6 text-white/90">{copy.footer.startBody}</p>
          </div>
          <Link
            href="/teachers"
            className={`group relative inline-flex min-h-12 w-fit shrink-0 items-center gap-2 overflow-hidden rounded-full px-5 text-sm font-bold text-white transition-[translate,box-shadow,overflow] motion-safe:hover:-translate-y-0.5 motion-safe:hover:overflow-visible sm:text-base dark:text-zinc-950 cta-3d cta-3d-ink ${FOCUS}`}
          >
            <FrostGlass />
            <span className="relative z-10">{copy.seeTeachers}</span>
            <ArrowRight
              aria-hidden
              className="relative z-10 size-4 transition-transform motion-safe:group-hover:translate-x-0.5"
            />
          </Link>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="footer-card-3d flex flex-col gap-4 rounded-3xl p-5 sm:col-span-2 sm:flex-row sm:items-end sm:justify-between sm:p-6 lg:col-span-1 lg:flex-col lg:items-stretch lg:justify-start">
            <div className="flex flex-col gap-4">
              <Link href="/" aria-label="Shwequest" className={`inline-flex w-fit items-center gap-2.5 rounded-xl ${FOCUS}`}>
                <Image
                  src="/shwequest-logo.jpg"
                  alt=""
                  width={560}
                  height={486}
                  className="h-11 w-auto rounded-xl shadow-[0_3px_0_var(--color-amber-300)] ring-2 ring-amber-300"
                />
                <span className="text-xl font-black tracking-tight text-orange-600 dark:text-orange-400">
                  SHWEQUEST
                  <span aria-hidden className="ml-1.5 inline-block size-2 rounded-full bg-orange-500 align-middle" />
                </span>
              </Link>
              <p className="max-w-xs text-sm leading-6">{copy.footer.blurb}</p>
            </div>
            <div className="mt-auto flex flex-col gap-3">
              <p className="text-xs font-black tracking-wider text-amber-700 uppercase dark:text-amber-300">
                {copy.footer.social}
              </p>
              <ul className="flex items-center gap-3 pb-1">
                {SOCIAL.map(({ name, href, className, Mark }) => (
                  <li key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      className={`pill-3d grid size-11 place-items-center rounded-full ${FOCUS} ${className}`}
                    >
                      <Mark />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <nav aria-label={copy.footer.explore} className="footer-card-3d flex flex-col gap-3 rounded-3xl p-5 sm:p-6">
            <h2 className="text-xs font-black tracking-wider text-amber-700 uppercase dark:text-amber-300">
              {copy.footer.explore}
            </h2>
            <ul className="grid grid-cols-2 gap-2.5">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`group flex min-h-11 items-center justify-between gap-2 rounded-2xl border-2 border-amber-100 bg-amber-50/70 px-3 text-sm font-bold text-zinc-800 shadow-[0_2px_0_var(--color-amber-200)] transition-[translate,border-color,background-color,box-shadow] hover:border-amber-300 hover:bg-white hover:shadow-[0_4px_0_var(--color-amber-300)] motion-safe:hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:shadow-[0_2px_0_rgb(255_255_255/0.06)] dark:hover:border-amber-400/50 dark:hover:bg-white/10 ${FOCUS}`}
                  >
                    <span className="min-w-0 truncate">{linkLabel[link.href]}</span>
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 shrink-0 text-amber-500 transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-label={copy.footer.onPath} className="footer-card-3d flex flex-col gap-3 rounded-3xl p-5 sm:p-6">
            <h2 className="text-xs font-black tracking-wider text-amber-700 uppercase dark:text-amber-300">
              {copy.footer.onPath}
            </h2>
            <ul className="grid grid-cols-3 gap-2.5 pb-1">
              {STATS.map(({ value, id, Icon, tone }) => (
                <li
                  key={id}
                  className={`stat-chip-3d flex min-w-0 flex-col items-center gap-0.5 rounded-2xl px-2 py-3 text-center ${tone}`}
                >
                  <Icon aria-hidden className="size-4" />
                  <span className="text-2xl leading-tight font-black tabular-nums">{value}</span>
                  <span className="w-full truncate text-xs font-bold">{copy.footer[id]}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <p
          aria-hidden
          className="pointer-events-none -mb-[0.18em] bg-linear-to-b from-amber-400/70 to-amber-400/0 bg-clip-text text-center text-[clamp(3rem,15vw,12.5rem)] leading-none font-black tracking-tighter text-transparent select-none dark:from-white/20 dark:to-white/0"
        >
          SHWEQUEST
        </p>
      </div>

      <div className="relative border-t-2 border-amber-200/80 bg-white/40 dark:border-white/10 dark:bg-black/20">
        <div className="mx-auto flex w-full max-w-page items-center justify-between gap-4 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">© 2026 Shwequest</p>
          <button
            type="button"
            onClick={backToTop}
            className={`pill-3d pill-3d-amber inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full px-4 text-sm font-bold text-amber-950 ${FOCUS}`}
          >
            <ArrowUp aria-hidden className="size-4" />
            {copy.footer.backToTop}
          </button>
        </div>
      </div>
    </footer>
  );
}
