import Image from "next/image";
import Link from "next/link";
import { Play, Swords, Users } from "lucide-react";
import { ROADMAP_NODES, VIDEO_TOTAL } from "@/components/roadmap/roadmap-data";
import { TEACHERS } from "@/data/teachers";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/teachers", label: "Teachers" },
] as const;

const STATS = [
  { value: VIDEO_TOTAL, label: "videos", Icon: Play },
  {
    value: ROADMAP_NODES.filter((node) => node.kind === "boss").length,
    label: "games",
    Icon: Swords,
  },
  { value: TEACHERS.length, label: "teachers", Icon: Users },
] as const;

const TIKTOK_NOTE =
  "M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z";

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-6 fill-current">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 2.188 2.188 0 0 0-1.635.57 2.32 2.32 0 0 0-.529 1.727v2.674h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  );
}

function TikTokMark() {
  return (
    <span className="relative block size-6">
      <svg viewBox="0 0 24 24" aria-hidden className="absolute inset-0 size-6 translate-x-px fill-[#25F4EE]">
        <path d={TIKTOK_NOTE} />
      </svg>
      <svg viewBox="0 0 24 24" aria-hidden className="absolute inset-0 size-6 -translate-x-px fill-[#FE2C55]">
        <path d={TIKTOK_NOTE} />
      </svg>
      <svg viewBox="0 0 24 24" aria-hidden className="relative size-6 fill-white">
        <path d={TIKTOK_NOTE} />
      </svg>
    </span>
  );
}

const SOCIAL = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    className:
      "border-[#0866FF] border-b-[#0546b3] bg-[#0866FF] text-white focus-visible:outline-sky-700",
    Mark: FacebookMark,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/",
    className:
      "border-zinc-950 border-b-black bg-zinc-950 text-white focus-visible:outline-sky-700",
    Mark: TikTokMark,
  },
] as const;

export default function SiteFooter() {
  return (
    <footer className="mt-auto">
      <section
        aria-label="Social"
        className="border-t border-sky-100 bg-white px-4 py-5 dark:border-white/10 dark:bg-slate-950"
      >
        <div className="mx-auto flex w-full max-w-page flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-5">
          <p className="text-sm font-extrabold tracking-wide text-sky-800 uppercase dark:text-sky-200">
            Follow
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-3">
            {SOCIAL.map(({ name, href, className, Mark }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex min-h-12 items-center gap-2 rounded-2xl border-2 border-b-[5px] px-3.5 text-sm font-extrabold transition-transform motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0.5 motion-safe:active:border-b-2 focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
                >
                  <Mark />
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="border-t-4 border-t-amber-400 bg-linear-to-br from-sky-800 to-sky-950 text-sky-50">
      <div className="mx-auto w-full max-w-page px-4 pt-8 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href="/"
              aria-label="Shwequest"
              className="inline-flex shrink-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
            >
              <Image
                src="/shwequest-logo.jpg"
                alt=""
                width={560}
                height={486}
                className="h-14 w-auto rounded-xl ring-2 ring-amber-300/80"
              />
            </Link>
            <div className="min-w-0">
              <p className="text-lg font-bold tracking-tight">Shwequest</p>
              <p className="mt-1 max-w-xs text-sm font-medium text-sky-100">
                Choose a teacher and follow the learning path.
              </p>
            </div>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-2">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center rounded-full bg-white/10 px-4 text-sm font-bold text-amber-100 hover:bg-amber-400 hover:text-amber-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <ul className="mt-6 flex flex-wrap gap-2">
          {STATS.map(({ value, label, Icon }) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-bold"
            >
              <Icon aria-hidden className="size-4 text-amber-300" />
              <span>{value}</span>
              <span className="font-medium text-sky-100">{label}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 border-t border-white/15 pt-4 text-xs font-medium text-sky-200">
          © 2026 Shwequest
        </p>
      </div>
      </div>
    </footer>
  );
}
