"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FrostGlass from "@/components/frost-glass";
import { useMessages } from "@/i18n/locale-context";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

const STEPS = [
  {
    place: "2",
    height: "h-24 sm:h-28",
    cap: "bg-linear-to-b from-amber-200 to-amber-300",
    front: "bg-linear-to-b from-amber-400 via-amber-400 to-amber-600",
    edge: "shadow-[inset_-10px_0_12px_-8px_rgb(0_0_0/0.35)]",
    medal: "from-white via-zinc-300 to-zinc-500",
    digit: "text-zinc-600",
    delay: "0s",
  },
  {
    place: "1",
    height: "h-36 sm:h-44",
    cap: "bg-linear-to-b from-sky-300 to-sky-400",
    front: "bg-linear-to-b from-sky-500 via-sky-600 to-sky-800",
    edge: "",
    medal: "from-yellow-100 via-amber-400 to-amber-600",
    digit: "text-amber-700",
    delay: "2s",
  },
  {
    place: "3",
    height: "h-16 sm:h-20",
    cap: "bg-linear-to-b from-orange-300 to-orange-400",
    front: "bg-linear-to-b from-orange-500 via-orange-500 to-orange-700",
    edge: "shadow-[inset_10px_0_12px_-8px_rgb(0_0_0/0.35)]",
    medal: "from-orange-100 via-orange-400 to-orange-700",
    digit: "text-orange-800",
    delay: "4s",
  },
] as const;

const SPARKLES = [
  { position: "-left-5 top-3 size-3", delay: "0s" },
  { position: "-right-6 top-1 size-4", delay: "0.8s" },
  { position: "-right-3 bottom-4 size-2.5", delay: "1.6s" },
] as const;

function Sparkle({ className, delay }: { className: string; delay: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`absolute text-amber-300 motion-safe:animate-podium-twinkle dark:text-amber-200 ${className}`}
      style={{ animationDelay: delay }}
      aria-hidden
    >
      <path
        d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function HomeLeaderboardCta() {
  const copy = useMessages();

  return (
    <section aria-labelledby="home-leaderboard-title" className="bg-white dark:bg-slate-950">
      <div className="mx-auto grid w-full max-w-page items-center gap-10 px-4 pt-16 pb-10 sm:gap-12 sm:pt-20 sm:pb-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-center" aria-hidden>
          <div className="relative flex w-full max-w-xs flex-col items-center sm:max-w-sm">
            <div className="relative z-10 flex w-full max-w-[14.5rem] items-end justify-center pt-20 sm:max-w-[17rem] sm:pt-24">
              {STEPS.map((step) => (
                <div
                  key={step.place}
                  className="relative flex w-1/3 flex-col items-center justify-end"
                >
                  {step.place === "1" ? (
                    <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-0.5 -translate-x-1/2">
                      <span
                        className="relative grid size-16 place-items-center motion-safe:animate-podium-star sm:size-[4.5rem]"
                        style={{ animationDelay: step.delay }}
                      >
                        <span className="absolute top-1/2 left-1/2 size-36 -translate-x-1/2 -translate-y-1/2 sm:size-40">
                          <span className="block size-full rounded-full bg-[repeating-conic-gradient(rgb(251_191_36/0.4)_0deg_7deg,transparent_7deg_22deg)] [mask-image:radial-gradient(circle_at_50%_45%,black_18%,transparent_62%)] motion-safe:animate-hero-orbit dark:bg-[repeating-conic-gradient(rgb(251_191_36/0.25)_0deg_7deg,transparent_7deg_22deg)]" />
                        </span>
                        <span className="absolute inset-0 scale-125 rounded-full bg-radial from-amber-200/90 to-transparent to-70% blur-md dark:from-amber-400/40" />
                        {SPARKLES.map((sparkle) => (
                          <Sparkle key={sparkle.position} className={sparkle.position} delay={sparkle.delay} />
                        ))}
                        <svg
                          viewBox="0 0 64 64"
                          className="relative size-full drop-shadow-[0_6px_6px_rgb(146_64_14/0.35)]"
                          aria-hidden
                        >
                          <defs>
                            <linearGradient id="lb-cup-gold" x1="0" x2="1" y1="0" y2="0">
                              <stop offset="0" stopColor="#fde68a" />
                              <stop offset="0.3" stopColor="#fbbf24" />
                              <stop offset="0.5" stopColor="#fff3c4" />
                              <stop offset="0.72" stopColor="#f59e0b" />
                              <stop offset="1" stopColor="#b45309" />
                            </linearGradient>
                            <linearGradient id="lb-cup-base" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0" stopColor="#fb923c" />
                              <stop offset="1" stopColor="#9a3412" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M16.5 18.2c-6.2.7-9.2 4.8-8.1 9 .9 3.6 4.6 5.4 8.6 4.4l-.2-3.4c-2.4.5-4.4-.4-4.9-2.2-.6-2.2 1-4.2 4.4-4.6l.2-3.2Z"
                            fill="url(#lb-cup-gold)"
                            stroke="#92400e"
                            strokeWidth="1.4"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M47.5 18.2c6.2.7 9.2 4.8 8.1 9-.9 3.6-4.6 5.4-8.6 4.4l.2-3.4c2.4.5 4.4-.4 4.9-2.2.6-2.2-1-4.2-4.4-4.6l-.2-3.2Z"
                            fill="url(#lb-cup-gold)"
                            stroke="#92400e"
                            strokeWidth="1.4"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M18.2 12.4h27.6c.7 0 1.2.6 1.1 1.3l-2.2 14.2c-1.2 7.6-7.6 12.4-12.7 13.4-5.1-1-11.5-5.8-12.7-13.4L17.1 13.7c-.1-.7.4-1.3 1.1-1.3Z"
                            fill="url(#lb-cup-gold)"
                            stroke="#92400e"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M20.4 14.6h23.2c.5 0 .8.5.7 1l-.5 2.4H20.2l-.5-2.4c-.1-.5.2-1 .7-1Z"
                            fill="#ffe08a"
                          />
                          <path
                            d="M24.2 20.2c.4 6.2 2 11.4 3.6 14.6-2.4-.8-6.4-4-7.6-9.4l-1-5.2h5Z"
                            fill="#ffffff"
                            fillOpacity="0.7"
                          />
                          <path
                            d="M30.2 41.2h3.6c.4 0 .8.3.8.8v4.2h-5.2v-4.2c0-.5.4-.8.8-.8Z"
                            fill="url(#lb-cup-gold)"
                            stroke="#92400e"
                            strokeWidth="1.3"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M22.4 46.2h19.2c1.1 0 1.9 1 1.6 2.1l-.7 2.4c-.3.8-1 1.3-1.8 1.3H23.3c-.8 0-1.5-.5-1.8-1.3l-.7-2.4c-.3-1.1.5-2.1 1.6-2.1Z"
                            fill="url(#lb-cup-gold)"
                            stroke="#92400e"
                            strokeWidth="1.3"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M18.6 52.4h26.8c1 0 1.8.8 1.8 1.8v1.5c0 1-.8 1.8-1.8 1.8H18.6c-1 0-1.8-.8-1.8-1.8v-1.5c0-1 .8-1.8 1.8-1.8Z"
                            fill="url(#lb-cup-base)"
                            stroke="#92400e"
                            strokeWidth="1.3"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </span>
                  ) : null}
                  <div
                    className={`flex w-full origin-bottom flex-col motion-safe:animate-podium-press ${step.height}`}
                    style={{ animationDelay: step.delay }}
                  >
                    <div
                      className={`h-2.5 shrink-0 [clip-path:polygon(8%_0,92%_0,100%_100%,0_100%)] sm:h-3 ${step.cap}`}
                    />
                    <div
                      className={`relative flex flex-1 flex-col items-center justify-end overflow-hidden shadow-[inset_0_1px_0_rgb(255_255_255/0.55)] ${step.front}`}
                    >
                      <span className="absolute inset-y-0 left-[12%] w-[18%] bg-linear-to-r from-white/0 via-white/25 to-white/0" />
                      <span className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/20 to-transparent" />
                      {step.edge ? <span className={`absolute inset-0 ${step.edge}`} /> : null}
                      <span
                        className={`relative mb-2 grid size-9 place-items-center rounded-full bg-linear-to-b p-[3px] shadow-[0_3px_0_rgb(0_0_0/0.22),0_6px_10px_rgb(0_0_0/0.25)] sm:mb-3 sm:size-11 ${step.medal}`}
                      >
                        <span
                          className={`grid size-full place-items-center rounded-full bg-linear-to-b from-white to-zinc-100 text-base font-black shadow-[inset_0_2px_3px_rgb(0_0_0/0.18)] text-shadow-[0_1px_0_rgb(255_255_255)] sm:text-lg ${step.digit}`}
                        >
                          {step.place}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative isolate -mt-1 w-full max-w-[16rem] sm:max-w-[18.75rem]">
              <div className="absolute inset-x-[-6%] -bottom-3 -z-10 h-4 rounded-full bg-slate-900/25 blur-md dark:bg-black/70" />
              <div className="h-2 bg-linear-to-b from-slate-500 to-slate-600 [clip-path:polygon(4%_0,96%_0,100%_100%,0_100%)] sm:h-2.5" />
              <div className="h-3 rounded-b-md bg-linear-to-b from-slate-700 to-slate-900 shadow-[inset_0_1px_0_rgb(255_255_255/0.15)] sm:h-3.5" />
            </div>

            <p className="mt-5 text-center text-xl font-extrabold tracking-tight text-zinc-900 sm:text-2xl dark:text-white">
              {copy.ranks.board}
            </p>
          </div>
        </div>

        <div className="max-w-md lg:justify-self-start">
          <p className="pill-3d pill-3d-amber inline-flex -rotate-2 rounded-full px-3 py-1 text-sm font-bold text-amber-950 motion-reduce:rotate-none">
            {copy.ranks.kicker}
          </p>
          <h2
            id="home-leaderboard-title"
            className="mt-5 text-3xl leading-tight font-extrabold tracking-tight text-zinc-950 sm:text-4xl dark:text-white"
          >
            {copy.ranks.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed font-medium text-zinc-600 sm:text-lg dark:text-zinc-300">
            {copy.ranks.body}
          </p>
          <Link
            href="/leaderboard"
            className={`group relative mt-8 inline-flex min-h-12 items-center gap-2 overflow-hidden rounded-full bg-sky-700 px-6 text-sm font-bold text-white transition-[transform,overflow] motion-safe:hover:-translate-y-0.5 motion-safe:hover:overflow-visible ${FOCUS}`}
          >
            <FrostGlass />
            <span className="relative z-10">{copy.ranks.cta}</span>
            <ArrowRight aria-hidden className="relative z-10 size-4" />
          </Link>
        </div>
      </div>
      <div aria-hidden className="mx-auto w-full max-w-page px-4 pb-10 sm:pb-12">
        <div className="h-0.5 w-full bg-zinc-300 [clip-path:ellipse(50%_50%_at_50%_50%)] dark:bg-white/25" />
      </div>
    </section>
  );
}
