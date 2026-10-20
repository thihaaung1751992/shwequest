import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Play } from "lucide-react";
import { ROADMAP_NODES, VIDEO_TOTAL } from "@/components/roadmap/roadmap-data";

const HERO_FIGURE = "/home/hero-figure.svg";

const GAME_TOTAL = ROADMAP_NODES.filter((node) => node.kind === "boss").length;

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

/** Spin is nested so the ring's centering translate is not replaced by the rotation. */
function OrbitDot({
  motionClassName,
  startClassName,
  dotClassName,
}: {
  motionClassName: string;
  startClassName: string;
  dotClassName: string;
}) {
  return (
    <span className={`absolute inset-0 ${motionClassName}`}>
      <span className={`absolute inset-0 ${startClassName}`}>
        <span
          className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${dotClassName}`}
        />
      </span>
    </span>
  );
}

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="home-hero-title">
      <div className="mx-auto grid w-full max-w-page items-center gap-6 px-4 pt-6 pb-4 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8 lg:pt-14">
        <div className="max-w-xl">
          <p className="inline-flex -rotate-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-600 motion-reduce:rotate-none dark:bg-orange-500/15 dark:text-orange-300">
            Learning path
          </p>
          <h2
            id="home-hero-title"
            className="mt-5 text-4xl leading-[1.05] font-extrabold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl dark:text-white"
          >
            Smart learning
            <span className="mt-1 block">Deeper with a teacher</span>
            <span className="mt-1 block text-orange-500">—Start here</span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed font-medium text-zinc-600 sm:text-base dark:text-zinc-300">
            Choose a teacher and follow the path. {VIDEO_TOTAL} videos and {GAME_TOTAL} games.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/teachers"
              className={`inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-500 px-5 text-sm font-bold text-white transition-transform motion-safe:hover:-translate-y-0.5 ${FOCUS}`}
            >
              See teachers
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link
              href="/teachers"
              className={`inline-flex min-h-11 items-center gap-3 rounded-full pr-2 text-sm font-bold text-zinc-950 dark:text-white ${FOCUS}`}
            >
              <span className="grid size-12 place-items-center rounded-full bg-orange-500 text-white">
                <Play aria-hidden className="size-5 fill-current" />
              </span>
              How it works
            </Link>
          </div>
        </div>

        <div className="relative mx-auto h-[22rem] w-full max-w-xl sm:h-[32rem]" aria-hidden>
          <span className="absolute top-4 left-1/2 size-72 -translate-x-1/2 sm:size-96">
            <span className="absolute inset-0 rounded-full border border-orange-200 dark:border-orange-500/30" />
            <OrbitDot
              motionClassName="motion-safe:animate-hero-orbit"
              startClassName="rotate-45"
              dotClassName="size-3 bg-orange-400"
            />
            <OrbitDot
              motionClassName="motion-safe:animate-hero-orbit-reverse"
              startClassName="-rotate-12"
              dotClassName="size-2 bg-emerald-500"
            />
          </span>
          <span className="absolute top-16 left-1/2 size-48 -translate-x-1/2 sm:size-64">
            <span className="absolute inset-0 rounded-full border border-orange-200/80 dark:border-orange-500/20" />
            <OrbitDot
              motionClassName="motion-safe:animate-hero-orbit-inner"
              startClassName="-rotate-90"
              dotClassName="size-2.5 bg-orange-300"
            />
          </span>
          <span className="absolute right-0 bottom-8 h-52 w-36 rotate-12 bg-orange-500 [clip-path:polygon(22%_0,100%_0,78%_100%,0_100%)] sm:h-72 sm:w-48" />
          <span className="absolute right-[12%] bottom-12 h-56 w-44 -rotate-6 bg-teal-400 [clip-path:polygon(16%_0,100%_0,84%_100%,0_100%)] sm:h-80 sm:w-60">
            <span className="absolute top-8 right-4 text-5xl font-black tracking-tight text-white/40 sm:text-7xl">
              Learn
            </span>
          </span>
          <span className="absolute top-24 left-[6%] z-20 grid size-14 place-items-center rounded-2xl bg-white shadow-lg ring-1 ring-zinc-950/5 motion-safe:animate-hero-bob sm:left-[12%]">
            <span className="grid size-8 place-items-center rounded-full bg-amber-300 text-amber-950">
              <Check className="size-4" strokeWidth={3} />
            </span>
          </span>
          <div className="absolute bottom-0 left-1/2 z-10 h-72 w-64 -translate-x-1/2 sm:h-[26rem] sm:w-80">
            <Image
              src={HERO_FIGURE}
              alt=""
              fill
              sizes="(min-width: 640px) 320px, 256px"
              className="object-contain object-bottom drop-shadow-md"
              preload
            />
          </div>
        </div>
      </div>
      <div className="h-14 bg-linear-to-b from-cream to-white dark:from-slate-950 dark:to-slate-950" />
    </section>
  );
}
