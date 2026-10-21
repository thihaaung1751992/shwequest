import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Swords, Users } from "lucide-react";
import FrostGlass from "@/components/frost-glass";
import { TEACHERS, catalogTotals } from "@/data/teachers";

const TOTALS = catalogTotals();

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/teachers", label: "Teachers" },
  { href: "/leaderboard", label: "Leaderboard" },
] as const;

const STATS = [
  { value: TOTALS.videos, label: "videos", Icon: Play },
  { value: TOTALS.games, label: "games", Icon: Swords },
  { value: TEACHERS.length, label: "teachers", Icon: Users },
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
    className: "border-orange-500 bg-orange-500 text-white hover:bg-orange-600",
    Mark: FacebookMark,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/",
    className:
      "border-orange-100 bg-white text-zinc-800 hover:border-orange-300 dark:border-white/15 dark:bg-slate-900 dark:text-white",
    Mark: TikTokMark,
  },
] as const;

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-orange-100 bg-cream text-zinc-600 dark:border-white/10 dark:bg-slate-950 dark:text-zinc-300">
      <div className="mx-auto grid w-full max-w-page gap-10 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Link href="/" aria-label="Shwequest" className={`inline-flex items-center gap-2.5 ${FOCUS}`}>
            <Image
              src="/shwequest-logo.jpg"
              alt=""
              width={560}
              height={486}
              className="h-10 w-auto rounded-lg ring-2 ring-orange-200"
            />
            <span className="text-xl font-extrabold tracking-tight text-orange-600 dark:text-orange-400">
              SHWEQUEST
              <span aria-hidden className="ml-1.5 inline-block size-2 rounded-full bg-orange-500 align-middle" />
            </span>
          </Link>
          <p className="max-w-xs text-sm leading-6">Choose a teacher and follow the learning path.</p>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Social</p>
            <ul className="flex items-center gap-2.5">
              {SOCIAL.map(({ name, href, className, Mark }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className={`grid size-11 place-items-center rounded-full border-2 ${FOCUS} ${className}`}
                  >
                    <Mark />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <nav aria-label="Explore" className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Explore</h2>
          <ul className="flex flex-col">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`inline-flex min-h-11 items-center text-sm font-medium hover:text-orange-600 dark:hover:text-orange-300 ${FOCUS}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-label="On the path" className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">On the path</h2>
          <ul className="flex flex-col gap-3">
            {STATS.map(({ value, label, Icon }) => (
              <li key={label} className="flex items-center gap-3 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
                  <Icon aria-hidden className="size-4" />
                </span>
                <span>
                  {value} {label}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Start" className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Start</h2>
          <p className="max-w-xs text-sm leading-6">Open the teacher list and follow the lessons already on the path.</p>
          <Link
            href="/teachers"
            className={`group relative inline-flex min-h-11 w-fit items-center gap-2 overflow-hidden rounded-xl bg-orange-500 px-4 text-sm font-bold text-white transition-[background-color,overflow] hover:bg-orange-600 motion-safe:hover:overflow-visible ${FOCUS}`}
          >
            <FrostGlass />
            <span className="relative z-10">See teachers</span>
            <ArrowRight aria-hidden className="relative z-10 size-4" />
          </Link>
        </section>
      </div>

      <div className="border-t border-orange-100 dark:border-white/10">
        <p className="mx-auto w-full max-w-page px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center text-sm text-zinc-500 dark:text-zinc-400">
          © 2026 Shwequest
        </p>
      </div>
    </footer>
  );
}
