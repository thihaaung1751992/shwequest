"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";

const MONTHLY_KYAT = 15_000;

/** Year is capped at 30 days. Shorter plans stay below half of the next length. */
const PLANS = [
  { months: 1, extraDays: 0 },
  { months: 3, extraDays: 3 },
  { months: 6, extraDays: 10 },
  { months: 12, extraDays: 30 },
] as const;

type PlanMonths = (typeof PLANS)[number]["months"];

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

/** Soft site tints. Every length, including the year, stays a light wash. */
const TONE: Record<
  PlanMonths,
  { card: string; kicker: string; meta: string; extra: string; cta: string }
> = {
  1: {
    card: "border-sky-200 border-b-sky-700 bg-sky-50/70 text-sky-950 shadow-[0_22px_40px_-28px_rgba(3,105,161,0.9)] dark:border-sky-800 dark:border-b-sky-400 dark:bg-sky-950/70 dark:text-sky-50",
    kicker: "bg-white/80 text-sky-800 dark:bg-sky-900 dark:text-sky-100",
    meta: "text-sky-800 dark:text-sky-200",
    extra: "text-sky-800 dark:text-sky-200",
    cta: "bg-sky-800 text-white",
  },
  3: {
    card: "border-amber-200 border-b-amber-600 bg-amber-50/70 text-amber-950 shadow-[0_22px_40px_-28px_rgba(180,83,9,0.85)] dark:border-amber-800 dark:border-b-amber-400 dark:bg-amber-950/70 dark:text-amber-50",
    kicker: "bg-white/80 text-amber-900 dark:bg-amber-900 dark:text-amber-100",
    meta: "text-amber-900 dark:text-amber-200",
    extra: "text-amber-900 dark:text-amber-200",
    cta: "bg-amber-700 text-white",
  },
  6: {
    card: "border-orange-200 border-b-orange-600 bg-orange-50/70 text-orange-950 shadow-[0_22px_40px_-28px_rgba(194,65,12,0.85)] dark:border-orange-800 dark:border-b-orange-400 dark:bg-orange-950/70 dark:text-orange-50",
    kicker: "bg-white/80 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
    meta: "text-orange-900 dark:text-orange-200",
    extra: "text-orange-900 dark:text-orange-200",
    cta: "bg-orange-700 text-white",
  },
  12: {
    card: "border-emerald-200 border-b-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-[0_22px_40px_-28px_rgba(5,150,105,0.85)] dark:border-emerald-800 dark:border-b-emerald-400 dark:bg-emerald-950/70 dark:text-emerald-50",
    kicker: "bg-white/80 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
    meta: "text-emerald-900 dark:text-emerald-200",
    extra: "text-emerald-900 dark:text-emerald-200",
    cta: "bg-emerald-700 text-white",
  },
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

	const LETTER_TINTS = [
	  "text-sky-600/45",
	  "text-amber-600/45",
	  "text-orange-600/45",
	  "text-emerald-600/45",
	  "text-zinc-600/45",
	] as const;

type LetterDrop = {
  char: string;
  left: number;
  delay: number;
  duration: number;
  lift: number;
  landRotate: number;
  spinStart: number;
  tint: (typeof LETTER_TINTS)[number];
};

type LetterStyle = CSSProperties & {
  "--drop-y"?: string;
};

type SpinStyle = CSSProperties & {
  "--land-rotate"?: string;
  "--spin-start"?: string;
};

type HopStyle = CSSProperties & {
  "--hop-x"?: string;
};

/** Matches `letter-hop` (1.05s) in globals.css. */
const HOP_MS = 1050;

type LetterHop = {
  id: number;
  hopX: number;
  nextLeft: number;
  nextLift: number;
  nextRotate: number;
};

function randomLandRotate(): number {
  const pose = Math.random();
  if (pose < 0.3) return (Math.random() - 0.5) * 24;
  if (pose < 0.65) return (Math.random() < 0.5 ? 1 : -1) * (28 + Math.random() * 36);
  return (Math.random() < 0.5 ? 1 : -1) * (78 + Math.random() * 30);
}

/** Pick a floor spot far enough sideways that the hop reads as a real move. */
function pickNextLeft(current: number): number {
  const minDelta = 14;
  const maxDelta = 34;
  const sign = Math.random() < 0.5 ? -1 : 1;
  let next = current + sign * (minDelta + Math.random() * (maxDelta - minDelta));
  if (next < 4 || next > 96) {
    next = current - sign * (minDelta + Math.random() * (maxDelta - minDelta));
  }
  return Math.min(96, Math.max(4, next));
}

function seedLetters(): LetterDrop[] {
  return ALPHABET.map((char) => ({
    char,
    left: 4 + Math.random() * 92,
    delay: Math.random() * 1.2,
    duration: 1.15 + Math.random() * 1.15,
    lift: Math.random() * 12,
    landRotate: randomLandRotate(),
    spinStart: (Math.random() - 0.5) * 140,
    tint: LETTER_TINTS[Math.floor(Math.random() * LETTER_TINTS.length)]!,
  }));
}

function kyat(amount: number): string {
  return `Ks ${amount.toLocaleString("en-US")}`;
}

export default function HomePricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const glyphRef = useRef<HTMLSpanElement>(null);
  const [drops, setDrops] = useState<LetterDrop[]>([]);
  const [runId, setRunId] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(0);
  const [glyphHeight, setGlyphHeight] = useState(0);
  const [floorTop, setFloorTop] = useState(0);
  const [settled, setSettled] = useState<ReadonlySet<string>>(() => new Set());
  const [hops, setHops] = useState<Record<string, LetterHop>>({});
  const hopTimersRef = useRef<Record<string, number>>({});

  const clearHopTimers = useCallback(() => {
    for (const timer of Object.values(hopTimersRef.current)) {
      window.clearTimeout(timer);
    }
    hopTimersRef.current = {};
  }, []);

  const commitHop = useCallback((char: string, finished: LetterHop) => {
    window.clearTimeout(hopTimersRef.current[char]);
    delete hopTimersRef.current[char];
    setDrops((prev) =>
      prev.map((item) =>
        item.char === char
          ? {
              ...item,
              left: finished.nextLeft,
              lift: finished.nextLift,
              landRotate: finished.nextRotate,
              spinStart: finished.nextRotate,
            }
          : item,
      ),
    );
    setHops((prev) => {
      if (prev[char]?.id !== finished.id) return prev;
      const next = { ...prev };
      delete next[char];
      return next;
    });
  }, []);

  const readMetrics = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const floor = floorRef.current;
    const glyph = glyphRef.current;
    if (floor) {
      setFloorTop(floor.getBoundingClientRect().top - section.getBoundingClientRect().top);
    }
    setSectionHeight(section.clientHeight);
    if (glyph && glyph.offsetHeight > 0) setGlyphHeight(glyph.offsetHeight);
  }, []);

  useLayoutEffect(() => {
    readMetrics();
  }, [drops, runId, readMetrics]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const measure = () => {
      const floor = floorRef.current;
      const glyph = glyphRef.current;
      if (floor) {
        setFloorTop(floor.getBoundingClientRect().top - section.getBoundingClientRect().top);
      }
      setSectionHeight(section.clientHeight);
      if (glyph && glyph.offsetHeight > 0) setGlyphHeight(glyph.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);

    let wasInView = false;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          if (!wasInView) {
            measure();
            clearHopTimers();
            setSettled(new Set());
            setHops({});
            setRunId((n) => n + 1);
            setDrops(seedLetters());
          }
          wasInView = true;
          return;
        }

        wasInView = false;
        clearHopTimers();
        setSettled(new Set());
        setHops({});
        setDrops([]);
      },
      // 0 = clear only when the Plans section has fully left the viewport.
      // A higher threshold cleared A–Z while the floor band was still on screen.
      { threshold: 0 },
    );

    io.observe(section);
    return () => {
      io.disconnect();
      ro.disconnect();
      clearHopTimers();
    };
  }, [clearHopTimers]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-pricing-title"
      className="relative overflow-hidden bg-white dark:bg-slate-950"
    >
      {drops.length > 0 ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <span
            ref={glyphRef}
            className="pointer-events-none absolute top-0 text-7xl leading-none font-extrabold opacity-0 sm:text-8xl"
          >
            M
          </span>
          {sectionHeight > 0 && glyphHeight > 0 && floorTop > 0
            ? drops.map((drop) => {
                const sink = Math.round(glyphHeight * 0.18);
                const dropY = Math.max(
                  floorTop,
                  sectionHeight - glyphHeight + sink - drop.lift,
                );
                const landed = settled.has(drop.char);
                const hop = hops[drop.char];
                const style: LetterStyle = landed
                  ? {
                      left: `${drop.left}%`,
                      transform: `translate(-50%, ${dropY}px)`,
                    }
                  : {
                      left: `${drop.left}%`,
                      animationDelay: `${drop.delay}s`,
                      animationDuration: `${drop.duration}s`,
                      "--drop-y": `${dropY}px`,
                    };
                const spinStyle: SpinStyle = landed
                  ? { transform: `rotate(${drop.landRotate}deg)` }
                  : {
                      animationDelay: `${drop.delay}s`,
                      animationDuration: `${drop.duration}s`,
                      "--land-rotate": `${drop.landRotate}deg`,
                      "--spin-start": `${drop.spinStart}deg`,
                    };
                const hopStyle: HopStyle | undefined = hop
                  ? { "--hop-x": `${hop.hopX}px` }
                  : undefined;
                return (
                  <span
                    key={`${runId}-${drop.char}`}
                    className={`pointer-events-none absolute top-0 text-7xl leading-none font-extrabold tracking-tight select-none sm:text-8xl ${drop.tint} ${landed ? "" : "motion-safe:animate-letter-fall"}`}
                    style={style}
                    onAnimationEnd={(event) => {
                      if (event.target !== event.currentTarget) return;
                      if (event.animationName !== "letter-fall") return;
                      setSettled((prev) => {
                        if (prev.has(drop.char)) return prev;
                        const next = new Set(prev);
                        next.add(drop.char);
                        return next;
                      });
                    }}
                  >
                    <span
                      key={hop?.id ?? 0}
                      className={`block ${hop ? "motion-safe:animate-letter-hop" : ""}`}
                      style={hopStyle}
                      onAnimationEnd={(event) => {
                        if (event.target !== event.currentTarget) return;
                        if (!event.animationName.includes("letter-hop")) return;
                        if (!hop) return;
                        commitHop(drop.char, hop);
                      }}
                    >
                      <span
                        className={`block ${landed ? "" : "motion-safe:animate-letter-spin"} ${landed && !hop ? "pointer-events-auto cursor-pointer" : "pointer-events-none"}`}
                        style={spinStyle}
                        onClick={() => {
                          if (!landed || hops[drop.char]) return;
                          const section = sectionRef.current;
                          if (!section) return;
                          const nextLeft = pickNextLeft(drop.left);
                          const hopX = ((nextLeft - drop.left) / 100) * section.clientWidth;
                          const finished: LetterHop = {
                            id: (hops[drop.char]?.id ?? 0) + 1,
                            hopX,
                            nextLeft,
                            nextLift: Math.random() * 12,
                            nextRotate: randomLandRotate(),
                          };
                          setHops((prev) => ({
                            ...prev,
                            [drop.char]: finished,
                          }));
                          window.clearTimeout(hopTimersRef.current[drop.char]);
                          hopTimersRef.current[drop.char] = window.setTimeout(() => {
                            commitHop(drop.char, finished);
                          }, HOP_MS + 70);
                        }}
                      >
                        {drop.char}
                      </span>
                    </span>
                  </span>
                );
              })
            : null}
        </div>
      ) : null}

      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-page px-4 pt-4 pb-6">
        <h2
          id="home-pricing-title"
          className="pointer-events-auto mx-auto w-fit -rotate-2 rounded-full bg-emerald-500 px-3 py-1 text-sm font-semibold text-white motion-reduce:rotate-none"
        >
          Plans
        </h2>
        <p className="pointer-events-auto mx-auto mt-6 max-w-2xl text-center text-lg leading-snug font-bold text-zinc-700 sm:text-2xl dark:text-zinc-200">
          Every length is {kyat(MONTHLY_KYAT)} per month.
        </p>
        <ul className="pointer-events-auto mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map(({ months, extraDays }) => {
            const tone = TONE[months];
            const lengthLabel = months === 1 ? "1 month" : `${months} months`;
            return (
              <li key={months} className="min-w-0">
                <article
                  className={`flex h-full min-h-[28rem] flex-col rounded-3xl border-2 border-b-8 px-6 pt-6 pb-14 sm:px-7 sm:pt-7 sm:pb-16 ${tone.card}`}
                >
                  <span className={`w-fit rounded-full px-3 py-1 text-sm font-bold ${tone.kicker}`}>
                    {lengthLabel}
                  </span>
                  <span className="mt-8 text-4xl font-extrabold tracking-tight">
                    {kyat(months * MONTHLY_KYAT)}
                  </span>
                  <span className={`mt-2 text-sm font-semibold ${tone.meta}`}>
                    {kyat(MONTHLY_KYAT)} / month
                  </span>
                  <span className={`mt-6 min-h-12 text-base leading-snug font-bold ${tone.extra}`}>
                    {extraDays > 0 ? `Includes ${extraDays} extra days.` : null}
                  </span>
                  <Link
                    href="/teachers"
                    className={`mt-auto inline-flex min-h-12 w-fit items-center gap-2 rounded-full px-6 text-sm font-bold transition-transform motion-safe:hover:-translate-y-0.5 ${tone.cta} ${FOCUS}`}
                  >
                    See teachers
                    <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>
        <div ref={floorRef} aria-hidden className="pointer-events-none h-36 sm:h-44" />
      </div>
    </section>
  );
}
