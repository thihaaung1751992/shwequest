"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import FrostGlass from "@/components/frost-glass";
import { catalogTotals } from "@/data/teachers";

const HERO_FIGURE = "/home/hero-figure.svg";

const TOTALS = catalogTotals();

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

/** Orbit awhile, then slip off one by one into the banner. */
const ORBIT_MS = 2600;
const SLIP_STAGGER_MS = 380;
/** Grow from orbit size while free; fade as soon as the letter slips off. */
const TARGET_SCALE = 14;
const GROW_PER_SEC = 2.6;
const FADE_PER_SEC = 0.55;
const FADE_FLOOR = 0.18;
/** Release / bounce speed (px/s). */
const SLIP_SPEED = 260;
/** +1 = CSS clockwise (hero-orbit), −1 = reverse. */
type OrbitSense = 1 | -1;

type OrbitSpec = {
  letter: string;
  motionClassName: string;
  counterClassName: string;
  startClassName: string;
  toneClassName: string;
  orbitSense: OrbitSense;
};

const ORBIT_LETTERS: OrbitSpec[] = [
  {
    letter: "E",
    motionClassName: "motion-safe:animate-hero-orbit",
    counterClassName: "motion-safe:animate-[hero-orbit_22s_linear_infinite_reverse]",
    startClassName: "rotate-45",
    toneClassName: "text-orange-500",
    orbitSense: 1,
  },
  {
    letter: "N",
    motionClassName: "motion-safe:animate-hero-orbit-reverse",
    counterClassName: "motion-safe:animate-[hero-orbit_17s_linear_infinite]",
    startClassName: "-rotate-12",
    toneClassName: "text-emerald-600",
    orbitSense: -1,
  },
  {
    letter: "G",
    motionClassName: "motion-safe:animate-hero-orbit",
    counterClassName: "motion-safe:animate-[hero-orbit_22s_linear_infinite_reverse]",
    startClassName: "rotate-[130deg]",
    toneClassName: "text-amber-600",
    orbitSense: 1,
  },
  {
    letter: "I",
    motionClassName: "motion-safe:animate-hero-orbit-reverse",
    counterClassName: "motion-safe:animate-[hero-orbit_17s_linear_infinite]",
    startClassName: "-rotate-[50deg]",
    toneClassName: "text-sky-600",
    orbitSense: -1,
  },
  {
    letter: "S",
    motionClassName: "motion-safe:animate-hero-orbit-inner",
    counterClassName: "motion-safe:animate-[hero-orbit_13s_linear_infinite_reverse]",
    startClassName: "-rotate-90",
    toneClassName: "text-orange-400",
    orbitSense: 1,
  },
  {
    letter: "H",
    motionClassName: "motion-safe:animate-hero-orbit-reverse",
    counterClassName: "motion-safe:animate-[hero-orbit_17s_linear_infinite]",
    startClassName: "rotate-[110deg]",
    toneClassName: "text-emerald-500",
    orbitSense: -1,
  },
];

type FreeBody = {
  letter: string;
  toneClassName: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  opacity: number;
};

type OrbitSample = { x: number; y: number; t: number };

/** CSS clockwise tangent for a unit radial (ux, uy); flip with orbitSense. */
function tangentVelocity(
  ux: number,
  uy: number,
  sense: OrbitSense,
  speed: number,
): { vx: number; vy: number } {
  return {
    vx: sense * -uy * speed,
    vy: sense * ux * speed,
  };
}

/**
 * Bare letter on the ring. Counter-spin is nested so it does not wipe the
 * path translate; start angle is a static rotate on the middle layer.
 */
function OrbitLetter({
  letter,
  motionClassName,
  counterClassName,
  startClassName,
  toneClassName,
  glyphRef,
}: OrbitSpec & {
  glyphRef: (node: HTMLSpanElement | null) => void;
}) {
  return (
    <span className={`absolute inset-0 ${motionClassName}`}>
      <span className={`absolute inset-0 ${startClassName}`}>
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span
            ref={glyphRef}
            className={`block text-sm leading-none font-extrabold sm:text-base ${counterClassName} ${toneClassName}`}
          >
            {letter}
          </span>
        </span>
      </span>
    </span>
  );
}

export default function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const glyphRefs = useRef<Partial<Record<string, HTMLSpanElement | null>>>({});
  const freeNodeRefs = useRef<Partial<Record<string, HTMLSpanElement | null>>>({});
  const bodiesRef = useRef<FreeBody[]>([]);
  const samplesRef = useRef<Partial<Record<string, OrbitSample>>>({});
  const [freeLetters, setFreeLetters] = useState<FreeBody[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  const released = useMemo(
    () => new Set(freeLetters.map((body) => body.letter)),
    [freeLetters],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Sample orbit positions so slip velocity matches travel direction.
  useEffect(() => {
    if (reducedMotion) return;

    let raf = 0;
    const sample = (now: number) => {
      const section = sectionRef.current;
      if (section) {
        const sr = section.getBoundingClientRect();
        for (const spec of ORBIT_LETTERS) {
          const glyph = glyphRefs.current[spec.letter];
          if (!glyph) continue;
          const gr = glyph.getBoundingClientRect();
          samplesRef.current[spec.letter] = {
            x: gr.left - sr.left + gr.width / 2,
            y: gr.top - sr.top + gr.height / 2,
            t: now,
          };
        }
      }
      raf = requestAnimationFrame(sample);
    };

    raf = requestAnimationFrame(sample);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const timers = ORBIT_LETTERS.map((spec, index) =>
      window.setTimeout(() => {
        const section = sectionRef.current;
        const glyph = glyphRefs.current[spec.letter];
        if (!section || !glyph) return;

        const now = performance.now();
        const sr = section.getBoundingClientRect();
        const gr = glyph.getBoundingClientRect();
        const x = gr.left - sr.left + gr.width / 2;
        const y = gr.top - sr.top + gr.height / 2;

        let vx = 0;
        let vy = 0;
        const prev = samplesRef.current[spec.letter];
        const sampleDt = prev ? (now - prev.t) / 1000 : 0;
        if (prev && sampleDt > 0.001 && sampleDt < 0.12) {
          const sx = (x - prev.x) / sampleDt;
          const sy = (y - prev.y) / sampleDt;
          const speed = Math.hypot(sx, sy);
          if (speed > 8) {
            vx = (sx / speed) * SLIP_SPEED;
            vy = (sy / speed) * SLIP_SPEED;
          }
        }

        if (vx === 0 && vy === 0) {
          // Fallback: ring-local radial → orbit-sense tangent.
          const ring = glyph.closest<HTMLElement>("[data-hero-ring]");
          const rr = (ring ?? section).getBoundingClientRect();
          const cx = rr.left - sr.left + rr.width / 2;
          const cy = rr.top - sr.top + rr.height / 2;
          const dx = x - cx;
          const dy = y - cy;
          const len = Math.hypot(dx, dy) || 1;
          ({ vx, vy } = tangentVelocity(dx / len, dy / len, spec.orbitSense, SLIP_SPEED));
        }

        delete samplesRef.current[spec.letter];
        const body: FreeBody = {
          letter: spec.letter,
          toneClassName: spec.toneClassName,
          x,
          y,
          vx,
          vy,
          scale: 1,
          opacity: 1,
        };
        bodiesRef.current = [...bodiesRef.current, body];
        setFreeLetters(bodiesRef.current);
      }, ORBIT_MS + index * SLIP_STAGGER_MS),
    );

    return () => {
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const section = sectionRef.current;
      if (section && bodiesRef.current.length > 0) {
        const w = section.clientWidth;
        const h = section.clientHeight;

        bodiesRef.current = bodiesRef.current.map((body) => {
          let { x, y, vx, vy, scale, opacity } = body;
          scale = Math.min(TARGET_SCALE, scale + GROW_PER_SEC * dt);
          opacity = Math.max(FADE_FLOOR, opacity - FADE_PER_SEC * dt);
          const half = Math.max(14, 11 * scale);

          x += vx * dt;
          y += vy * dt;

          if (x < half) {
            x = half;
            vx = Math.abs(vx) * 0.92;
          } else if (x > w - half) {
            x = w - half;
            vx = -Math.abs(vx) * 0.92;
          }
          if (y < half) {
            y = half;
            vy = Math.abs(vy) * 0.92;
          } else if (y > h - half) {
            y = h - half;
            vy = -Math.abs(vy) * 0.92;
          }

          const node = freeNodeRefs.current[body.letter];
          if (node) {
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            node.style.opacity = String(opacity);
            node.style.transform = `translate(-50%, -50%) scale(${scale})`;
          }

          return { ...body, x, y, vx, vy, scale, opacity };
        });
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  const orbitByLetter = useMemo(
    () => new Map(ORBIT_LETTERS.map((spec) => [spec.letter, spec])),
    [],
  );

  const showOrbit = (letter: string) => {
    if (released.has(letter)) return null;
    const spec = orbitByLetter.get(letter);
    if (!spec) return null;
    return (
      <OrbitLetter
        key={letter}
        {...spec}
        glyphRef={(node) => {
          glyphRefs.current[letter] = node;
        }}
      />
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      aria-labelledby="home-hero-title"
    >
      <div className="relative z-20 mx-auto grid w-full max-w-page items-center gap-6 px-4 pt-6 pb-4 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8 lg:pt-14">
        <div className="relative z-20 max-w-xl">
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
            Choose a teacher and follow their path. {TOTALS.videos} videos and {TOTALS.games} games
            across the teachers.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/teachers"
              className={`group relative inline-flex min-h-11 items-center gap-2 overflow-hidden rounded-full bg-emerald-500/90 px-5 text-sm font-bold text-white transition-[transform,background-color,overflow] motion-safe:hover:-translate-y-0.5 motion-safe:hover:overflow-visible hover:bg-emerald-500 ${FOCUS}`}
            >
              <FrostGlass />
              <span className="relative z-10">See teachers</span>
              <ArrowRight aria-hidden className="relative z-10 size-4" />
            </Link>
            <Link
              href="/teachers"
              className={`group inline-flex min-h-11 items-center gap-3 rounded-full pr-2 text-sm font-bold text-zinc-950 dark:text-white ${FOCUS}`}
            >
              <span className="relative grid size-12 place-items-center overflow-hidden rounded-full bg-orange-500/90 text-white transition-[background-color,overflow] motion-safe:group-hover:overflow-visible group-hover:bg-orange-500">
                <FrostGlass />
                <Play aria-hidden className="relative z-10 size-5 fill-current" />
              </span>
              How it works
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto h-[22rem] w-full max-w-xl sm:h-[32rem]" aria-hidden>
          <span
            data-hero-ring
            className="absolute top-4 left-1/2 size-72 -translate-x-1/2 sm:size-96"
          >
            <span className="absolute inset-0 rounded-full border border-orange-200 dark:border-orange-500/30" />
            {showOrbit("E")}
            {showOrbit("N")}
          </span>
          <span
            data-hero-ring
            className="absolute top-10 left-1/2 size-60 -translate-x-1/2 sm:top-12 sm:size-80"
          >
            <span className="absolute inset-0 rounded-full border border-orange-200/90 dark:border-orange-500/25" />
            {showOrbit("G")}
            {showOrbit("I")}
          </span>
          <span
            data-hero-ring
            className="absolute top-16 left-1/2 size-48 -translate-x-1/2 sm:size-64"
          >
            <span className="absolute inset-0 rounded-full border border-orange-200/80 dark:border-orange-500/20" />
            {showOrbit("S")}
            {showOrbit("H")}
          </span>
          <svg
            className="pointer-events-none absolute right-[-6%] bottom-0 h-[18.5rem] w-[17rem] overflow-visible sm:right-[-2%] sm:h-[29rem] sm:w-[26rem]"
            viewBox="0 0 560 620"
            fill="none"
          >
            <defs>
              <filter
                id="hero-card-shadow"
                x="-35%"
                y="-25%"
                width="170%"
                height="170%"
                colorInterpolationFilters="sRGB"
              >
                <feDropShadow
                  dx="0"
                  dy="18"
                  stdDeviation="14"
                  floodColor="#3a2a22"
                  floodOpacity="0.24"
                />
              </filter>
            </defs>
            <path
              filter="url(#hero-card-shadow)"
              fill="#cc6840"
              transform="translate(-120 4)"
              d="M 59.8 511.5 L 203.2 229.2 Q 217.7 200.7 249.7 200.7 L 565.7 200.7 Q 597.7 200.7 583.2 229.2 L 439.8 511.5 Q 425.3 540 393.3 540 L 77.3 540 Q 45.3 540 59.8 511.5 Z"
            />
            <path
              filter="url(#hero-card-shadow)"
              fill="#48a084"
              transform="translate(-28 -8)"
              d="M 58.6 483.1 L 243.6 118.8 Q 259 88.5 292.8 85 L 434 70.1 Q 467.8 66.6 452.4 96.9 L 267.4 461.2 Q 252 491.5 218.2 495 L 77 509.9 Q 43.2 513.4 58.6 483.1 Z"
            />
            <text
              x="300"
              y="148"
              textAnchor="middle"
              fill="none"
              stroke="#7dceb4"
              strokeWidth="2.5"
              transform="rotate(-16 300 148)"
              style={{
                fontFamily: "var(--font-geist-sans), Arial, sans-serif",
                fontSize: 86,
                fontWeight: 800,
                letterSpacing: "-0.045em",
              }}
            >
              Learn
            </text>
          </svg>
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

      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {freeLetters.map((body) => (
          <span
            key={body.letter}
            ref={(node) => {
              freeNodeRefs.current[body.letter] = node;
            }}
            className={`absolute text-sm leading-none font-extrabold sm:text-base ${body.toneClassName}`}
            style={{
              left: body.x,
              top: body.y,
              opacity: body.opacity,
              transform: `translate(-50%, -50%) scale(${body.scale})`,
            }}
          >
            {body.letter}
          </span>
        ))}
      </div>

      <div className="relative z-0 h-14 bg-linear-to-b from-cream to-white dark:from-slate-950 dark:to-slate-950" />
    </section>
  );
}
