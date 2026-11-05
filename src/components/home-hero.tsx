"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Play, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import FrostGlass from "@/components/frost-glass";
import { useMessages } from "@/i18n/locale-context";
import { catalogTotals } from "@/data/teachers";

const HOW_VIDEO = "/api/video/3";

const TOTALS = catalogTotals();

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

/** Orbit awhile, then slip off one by one into the banner. */
const ORBIT_MS = 2600;
const SLIP_STAGGER_MS = 200;
/** Grow from orbit size while free; fade as soon as the letter slips off. */
const TARGET_SCALE_MOBILE = 2.6;
const TARGET_SCALE_DESKTOP = 5.5;
/** Tailwind `sm` — keep bounce glyphs smaller below this width. */
const TARGET_SCALE_BREAKPOINT = 640;
/** Per-letter share of the target scale; far (small) letters also fade more. */
const DEPTH_STEPS = [1, 0.62, 0.82, 0.5, 0.9, 0.7] as const;
const GROW_PER_SEC = 2.6;
const FADE_PER_SEC = 0.55;
const FADE_FLOOR_BASE = 0.14;
const FADE_FLOOR_PER_DEPTH = 0.12;
/** Release / bounce speed (px/s). */
const SLIP_SPEED = 260;
/** Lean toward travel at full slip speed (deg); eased so wall flips swing. */
const MAX_TILT_DEG = 10;
const TILT_EASE_PER_SEC = 5;
/** Wall-hit squash: impulse decays to 0 over this many seconds. */
const SQUASH_SEC = 0.22;
const SQUASH_AMOUNT = 0.3;
/** +1 = CSS clockwise (hero-orbit), −1 = reverse. */
type OrbitSense = 1 | -1;

type OrbitRing = "outer" | "mid" | "inner";

type OrbitSpec = {
  id: string;
  letter: string;
  ring: OrbitRing;
  motionClassName: string;
  counterClassName: string;
  /** Degrees around the ring; applied as inline rotate (avoids Tailwind JIT gaps). */
  startDeg: number;
  toneClassName: string;
  orbitSense: OrbitSense;
};

const LETTER_TONES = [
  "hero-glyph-orange",
  "hero-glyph-emerald",
  "hero-glyph-amber",
  "hero-glyph-sky",
] as const;

const GLYPH_CLASS = "hero-glyph text-base leading-none font-black sm:text-lg";

const RING_MOTION: Record<
  OrbitRing,
  { motionClassName: string; counterClassName: string; orbitSense: OrbitSense }
> = {
  outer: {
    motionClassName: "motion-safe:animate-hero-orbit",
    counterClassName: "motion-safe:animate-[hero-orbit_22s_linear_infinite_reverse]",
    orbitSense: 1,
  },
  mid: {
    motionClassName: "motion-safe:animate-hero-orbit-reverse",
    counterClassName: "motion-safe:animate-[hero-orbit_17s_linear_infinite]",
    orbitSense: -1,
  },
  inner: {
    motionClassName: "motion-safe:animate-hero-orbit-inner",
    counterClassName: "motion-safe:animate-[hero-orbit_13s_linear_infinite_reverse]",
    orbitSense: 1,
  },
};

/** Banner phrase — outer / mid / inner rings (spaces omitted). */
const RING_WORDS: { ring: OrbitRing; word: string }[] = [
  { ring: "outer", word: "LEARN" },
  { ring: "mid", word: "ENGLISH" },
  { ring: "inner", word: "FLUENTLY" },
];

function buildOrbitLetters(): OrbitSpec[] {
  const specs: OrbitSpec[] = [];
  let toneIndex = 0;
  for (const { ring, word } of RING_WORDS) {
    const motion = RING_MOTION[ring];
    const chars = word.split("");
    chars.forEach((letter, index) => {
      specs.push({
        id: `${ring}-${index}-${letter}`,
        letter,
        ring,
        motionClassName: motion.motionClassName,
        counterClassName: motion.counterClassName,
        startDeg: (360 / chars.length) * index,
        toneClassName: LETTER_TONES[toneIndex % LETTER_TONES.length]!,
        orbitSense: motion.orbitSense,
      });
      toneIndex += 1;
    });
  }
  return specs;
}

const ORBIT_LETTERS = buildOrbitLetters();

type FreeBody = {
  id: string;
  letter: string;
  toneClassName: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  opacity: number;
  /** One of DEPTH_STEPS: 1 = nearest / largest. */
  depth: number;
  tiltDeg: number;
  /** 1 right after a wall hit, eases to 0. */
  squash: number;
  squashAxis: "x" | "y";
};

/** Squash in screen axes, then lean, then grow. */
function freeTransform({ scale, tiltDeg, squash, squashAxis }: FreeBody): string {
  const flat = 1 - SQUASH_AMOUNT * squash;
  const tall = 1 + SQUASH_AMOUNT * 0.6 * squash;
  const [sx, sy] = squashAxis === "x" ? [flat, tall] : [tall, flat];
  return `translate(-50%, -50%) scale(${sx}, ${sy}) rotate(${tiltDeg}deg) scale(${scale})`;
}

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
 * path translate; start angle is an inline rotate on the middle layer.
 */
function OrbitLetter({
  letter,
  motionClassName,
  counterClassName,
  startDeg,
  toneClassName,
  glyphRef,
}: OrbitSpec & {
  glyphRef: (node: HTMLSpanElement | null) => void;
}) {
  return (
    <span className={`absolute inset-0 ${motionClassName}`}>
      <span className="absolute inset-0" style={{ transform: `rotate(${startDeg}deg)` }}>
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span
            ref={glyphRef}
            data-glyph={letter}
            className={`${GLYPH_CLASS} ${counterClassName} ${toneClassName}`}
          >
            {letter}
          </span>
        </span>
      </span>
    </span>
  );
}

/** Below this, a 0 currentTime is the real start, not a reset after hide. */
const RESUME_MIN_SEC = 0.5;

type HowPanel = "video" | "guide";

/**
 * Ignore a hide-induced jump to 0. Read concealment from the element so a
 * stale event (fired as `hidden` is applied) cannot replace a real position.
 * A seek to the start while the video is on screen still saves.
 */
function rememberHowTime(video: HTMLVideoElement, savedSec: number): number {
  const concealed = video.hidden || video.offsetParent === null;
  const resetWhileHidden =
    concealed && savedSec > RESUME_MIN_SEC && video.currentTime < RESUME_MIN_SEC;
  return resetWhileHidden ? savedSec : video.currentTime;
}

/**
 * Resume the same media element. If hiding it dropped playback to 0,
 * seek and wait for `seeked` before `play()` so an ended clip does not restart.
 * Returns a detach function for effect cleanup.
 */
function resumeHowVideo(
  video: HTMLVideoElement,
  savedSec: number,
  isCancelled: () => boolean,
): () => void {
  let removeSeeked = () => {};

  const playIfContinuing = () => {
    if (isCancelled()) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (video.ended) return;
    void video.play().then(() => {
      if (isCancelled()) video.pause();
    }).catch(() => {});
  };

  const seekThenPlay = () => {
    if (isCancelled()) return;
    const resetToStart =
      savedSec > RESUME_MIN_SEC && video.currentTime < RESUME_MIN_SEC;
    if (!resetToStart) {
      playIfContinuing();
      return;
    }
    const onSeeked = () => {
      removeSeeked = () => {};
      playIfContinuing();
    };
    video.addEventListener("seeked", onSeeked, { once: true });
    removeSeeked = () => video.removeEventListener("seeked", onSeeked);
    video.currentTime = savedSec;
  };

  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    seekThenPlay();
    return () => removeSeeked();
  }

  const onMeta = () => seekThenPlay();
  video.addEventListener("loadedmetadata", onMeta, { once: true });
  return () => {
    video.removeEventListener("loadedmetadata", onMeta);
    removeSeeked();
  };
}

export default function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const glyphRefs = useRef<Partial<Record<string, HTMLSpanElement | null>>>({});
  const freeNodeRefs = useRef<Partial<Record<string, HTMLSpanElement | null>>>({});
  const bodiesRef = useRef<FreeBody[]>([]);
  const samplesRef = useRef<Partial<Record<string, OrbitSample>>>({});
  const [freeLetters, setFreeLetters] = useState<FreeBody[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const howButtonRef = useRef<HTMLButtonElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const videoTabRef = useRef<HTMLButtonElement>(null);
  const guideTabRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  /** Playback position kept while the overlay or the video tab is hidden. */
  const playbackTimeRef = useRef(0);
  const howWasOpenRef = useRef(false);
  const [howOpen, setHowOpen] = useState(false);
  const [howPanel, setHowPanel] = useState<HowPanel>("video");

  const closeHow = () => {
    const video = videoRef.current;
    if (video) {
      playbackTimeRef.current = rememberHowTime(video, playbackTimeRef.current);
      video.pause();
    }
    setHowPanel("video");
    setHowOpen(false);
  };

  const selectHowPanel = (panel: HowPanel) => {
    if (panel === howPanel) return;
    if (howPanel === "video") {
      const video = videoRef.current;
      if (video) {
        playbackTimeRef.current = rememberHowTime(video, playbackTimeRef.current);
        video.pause();
      }
    }
    setHowPanel(panel);
  };

  const onHowTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next: HowPanel = howPanel === "video" ? "guide" : "video";
    selectHowPanel(next);
    (next === "video" ? videoTabRef : guideTabRef).current?.focus();
  };

  const howTabClass = (selected: boolean) =>
    `inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center rounded-full px-2.5 text-sm font-bold transition-[transform,background-color,color] motion-safe:hover:-translate-y-0.5 sm:px-3 active:translate-y-0 ${
      selected
        ? "bg-amber-400 text-amber-950 shadow-[0_6px_14px_-8px_rgba(180,83,9,0.55)]"
        : "text-amber-950/75 hover:bg-white/80 dark:text-zinc-200 dark:hover:bg-white/15"
    } ${FOCUS}`;

  const released = useMemo(
    () => new Set(freeLetters.map((body) => body.id)),
    [freeLetters],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (howOpen) backButtonRef.current?.focus();
  }, [howOpen]);

  useEffect(() => {
    const video = videoRef.current;
    if (!howOpen || howPanel !== "video") {
      if (video) {
        playbackTimeRef.current = rememberHowTime(video, playbackTimeRef.current);
        video.pause();
      }
      if (!howOpen && howWasOpenRef.current) {
        howButtonRef.current?.focus();
      }
      return;
    }

    howWasOpenRef.current = true;
    if (!video) return;
    let cancelled = false;
    const detach = resumeHowVideo(video, playbackTimeRef.current, () => cancelled);
    return () => {
      cancelled = true;
      detach();
    };
  }, [howOpen, howPanel]);

  // Sample orbit positions so slip velocity matches travel direction.
  useEffect(() => {
    if (reducedMotion || howOpen) return;

    let raf = 0;
    const sample = (now: number) => {
      const section = sectionRef.current;
      if (section) {
        const sr = section.getBoundingClientRect();
        for (const spec of ORBIT_LETTERS) {
          const glyph = glyphRefs.current[spec.id];
          if (!glyph) continue;
          const gr = glyph.getBoundingClientRect();
          samplesRef.current[spec.id] = {
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
  }, [reducedMotion, howOpen]);

  useEffect(() => {
    if (howOpen || reducedMotion) return;

    const timers = ORBIT_LETTERS.map((spec, index) =>
      window.setTimeout(() => {
        const section = sectionRef.current;
        const glyph = glyphRefs.current[spec.id];
        if (!section || !glyph) return;

        const now = performance.now();
        const sr = section.getBoundingClientRect();
        const gr = glyph.getBoundingClientRect();
        const x = gr.left - sr.left + gr.width / 2;
        const y = gr.top - sr.top + gr.height / 2;

        let vx = 0;
        let vy = 0;
        const prev = samplesRef.current[spec.id];
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

        delete samplesRef.current[spec.id];
        const body: FreeBody = {
          id: spec.id,
          letter: spec.letter,
          toneClassName: spec.toneClassName,
          x,
          y,
          vx,
          vy,
          scale: 1,
          opacity: 1,
          depth: DEPTH_STEPS[index % DEPTH_STEPS.length]!,
          tiltDeg: 0,
          squash: 0,
          squashAxis: "x",
        };
        bodiesRef.current = [...bodiesRef.current, body];
        setFreeLetters(bodiesRef.current);
      }, ORBIT_MS + index * SLIP_STAGGER_MS),
    );

    return () => {
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [reducedMotion, howOpen]);

  useEffect(() => {
    if (reducedMotion || howOpen) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const section = sectionRef.current;
      if (section && bodiesRef.current.length > 0) {
        const w = section.clientWidth;
        const h = section.clientHeight;
        const targetScale =
          w < TARGET_SCALE_BREAKPOINT ? TARGET_SCALE_MOBILE : TARGET_SCALE_DESKTOP;

        bodiesRef.current = bodiesRef.current.map((body) => {
          let { x, y, vx, vy, scale, opacity, tiltDeg, squash, squashAxis } = body;
          const { depth } = body;
          scale = Math.min(Math.max(1, targetScale * depth), scale + GROW_PER_SEC * dt);
          opacity = Math.max(
            FADE_FLOOR_BASE + FADE_FLOOR_PER_DEPTH * depth,
            opacity - FADE_PER_SEC * dt,
          );
          squash = Math.max(0, squash - dt / SQUASH_SEC);
          const half = Math.max(14, 12 * scale);

          x += vx * dt;
          y += vy * dt;

          if (x < half) {
            x = half;
            vx = Math.abs(vx) * 0.92;
            squash = 1;
            squashAxis = "x";
          } else if (x > w - half) {
            x = w - half;
            vx = -Math.abs(vx) * 0.92;
            squash = 1;
            squashAxis = "x";
          }
          if (y < half) {
            y = half;
            vy = Math.abs(vy) * 0.92;
            squash = 1;
            squashAxis = "y";
          } else if (y > h - half) {
            y = h - half;
            vy = -Math.abs(vy) * 0.92;
            squash = 1;
            squashAxis = "y";
          }

          const tiltTarget = Math.max(-1, Math.min(1, vx / SLIP_SPEED)) * MAX_TILT_DEG;
          tiltDeg += (tiltTarget - tiltDeg) * Math.min(1, TILT_EASE_PER_SEC * dt);

          const next = { ...body, x, y, vx, vy, scale, opacity, tiltDeg, squash, squashAxis };
          const node = freeNodeRefs.current[body.id];
          if (node) {
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            node.style.opacity = String(opacity);
            node.style.transform = freeTransform(next);
          }

          return next;
        });
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, howOpen]);

  const orbitById = useMemo(
    () => new Map(ORBIT_LETTERS.map((spec) => [spec.id, spec])),
    [],
  );

  const showOrbit = (id: string) => {
    if (released.has(id)) return null;
    const spec = orbitById.get(id);
    if (!spec) return null;
    return (
      <OrbitLetter
        key={id}
        {...spec}
        glyphRef={(node) => {
          glyphRefs.current[id] = node;
        }}
      />
    );
  };

  const ringIds = (ring: OrbitRing) =>
    ORBIT_LETTERS.filter((spec) => spec.ring === ring).map((spec) => spec.id);

  const copy = useMessages();

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      aria-labelledby={howOpen ? undefined : "home-hero-title"}
      aria-label={howOpen ? copy.hero.how : undefined}
    >
      <div
        className={howOpen ? "invisible" : undefined}
        inert={howOpen ? true : undefined}
        aria-hidden={howOpen ? true : undefined}
      >
      <div className="relative z-20 mx-auto grid w-full max-w-page items-center gap-6 px-4 pt-6 pb-4 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8 lg:pt-14">
        <div className="relative z-20 max-w-xl">
          <p className="pill-3d pill-3d-orange inline-flex -rotate-2 rounded-full px-3 py-1 text-sm font-bold text-orange-950 motion-reduce:rotate-none">
            {copy.hero.kicker}
          </p>
          <h2
            id="home-hero-title"
            className="mt-5 text-4xl leading-[1.05] font-extrabold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl dark:text-white"
          >
            {copy.hero.title}
            <span className="mt-1 block">{copy.hero.deeper}</span>
            <span className="mt-1 block text-orange-500">{copy.hero.start}</span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed font-medium text-zinc-600 sm:text-base dark:text-zinc-300">
            {copy.hero.body(TOTALS.videos, TOTALS.games)}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/teachers"
              className={`group relative inline-flex min-h-11 items-center gap-2 overflow-hidden rounded-full px-5 text-sm font-bold text-white transition-[translate,box-shadow,overflow] motion-safe:hover:-translate-y-0.5 motion-safe:hover:overflow-visible cta-3d cta-3d-emerald ${FOCUS}`}
            >
              <FrostGlass />
              <span className="relative z-10">{copy.seeTeachers}</span>
              <ArrowRight aria-hidden className="relative z-10 size-4" />
            </Link>
            <button
              ref={howButtonRef}
              type="button"
              className={`group inline-flex min-h-11 cursor-pointer items-center gap-3 rounded-full pr-2 text-sm font-bold text-zinc-950 dark:text-white ${FOCUS}`}
              onClick={() => {
                bodiesRef.current = [];
                setFreeLetters([]);
                setHowOpen(true);
              }}
            >
              <span className="relative grid size-12 place-items-center overflow-hidden rounded-full bg-linear-to-b from-orange-400 to-orange-600 text-white shadow-[0_3px_0_0_var(--color-orange-700),0_10px_18px_-8px_rgb(154_52_18/0.6)] transition-[transform,box-shadow,overflow] motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:overflow-visible group-hover:shadow-[0_5px_0_0_var(--color-orange-700),0_14px_22px_-8px_rgb(154_52_18/0.6)]">
                <FrostGlass />
                <Play aria-hidden className="relative z-10 size-5 fill-current" />
              </span>
              {copy.hero.how}
              <ArrowRight aria-hidden className="size-4" />
            </button>
          </div>
        </div>

        <div className="relative mx-auto h-[22rem] w-full max-w-xl sm:h-[32rem]" aria-hidden>
          <span
            data-hero-ring
            className="absolute top-4 left-1/2 size-72 -translate-x-1/2 sm:size-96"
          >
            <span className="absolute inset-0 rounded-full border border-orange-200 dark:border-orange-500/30" />
            {ringIds("outer").map((id) => showOrbit(id))}
          </span>
          <span
            data-hero-ring
            className="absolute top-10 left-1/2 size-60 -translate-x-1/2 sm:top-12 sm:size-80"
          >
            <span className="absolute inset-0 rounded-full border border-orange-200/90 dark:border-orange-500/25" />
            {ringIds("mid").map((id) => showOrbit(id))}
          </span>
          <span
            data-hero-ring
            className="absolute top-16 left-1/2 size-48 -translate-x-1/2 sm:size-64"
          >
            <span className="absolute inset-0 rounded-full border border-orange-200/80 dark:border-orange-500/20" />
            {ringIds("inner").map((id) => showOrbit(id))}
          </span>
          <span className="absolute bottom-10 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-amber-200/50 blur-3xl sm:bottom-16 sm:h-56 sm:w-96 dark:bg-emerald-400/15" />
          <svg
            className="absolute bottom-2 left-1/2 z-10 w-72 -translate-x-1/2 overflow-visible sm:bottom-4 sm:w-[26rem]"
            viewBox="0 0 400 260"
            fill="none"
          >
            <defs>
              <linearGradient id="hero-page-left" x1="30" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" className="[stop-color:#fffdf9] dark:[stop-color:#e4e4e7]" />
                <stop offset="1" className="[stop-color:#eee3d5] dark:[stop-color:#a1a1aa]" />
              </linearGradient>
              <linearGradient id="hero-page-right" x1="370" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" className="[stop-color:#fffdf9] dark:[stop-color:#e4e4e7]" />
                <stop offset="1" className="[stop-color:#eee3d5] dark:[stop-color:#a1a1aa]" />
              </linearGradient>
            </defs>
            <ellipse cx="200" cy="240" rx="176" ry="12" className="fill-zinc-900/10 dark:fill-black/40" />
            <path
              className="fill-emerald-700 dark:fill-emerald-800"
              d="M200 58 Q110 24 12 38 L12 210 Q110 198 200 230 Q290 198 388 210 L388 38 Q290 24 200 58 Z"
            />
            <path
              className="fill-orange-500"
              d="M232 190 L250 192 L250 252 L241 243 L232 252 Z"
            />
            <path
              className="fill-[#e9dccb] dark:fill-zinc-400"
              d="M200 52 Q120 20 24 34 L24 202 Q120 190 200 220 Q280 190 376 202 L376 34 Q280 20 200 52 Z"
            />
            <path
              fill="url(#hero-page-left)"
              d="M200 46 Q120 14 30 28 L30 194 Q120 182 200 214 Z"
            />
            <path
              fill="url(#hero-page-right)"
              d="M200 46 Q280 14 370 28 L370 194 Q280 182 200 214 Z"
            />
            <path d="M200 46 L200 214" className="stroke-[#d6c6b2] dark:stroke-zinc-500" strokeWidth="2" />
            <g className="stroke-[#e2d5c4] dark:stroke-zinc-400" strokeWidth="5" strokeLinecap="round">
              <path d="M56 70 Q120 58 178 80" />
              <path d="M56 92 Q120 80 178 102" />
              <path d="M56 114 Q120 102 178 124" />
              <path d="M56 136 Q120 124 178 146" />
              <path d="M56 158 Q100 150 140 160" />
              <path d="M300 116 Q320 113 344 114" />
              <path d="M222 140 Q280 126 344 136" />
              <path d="M222 162 Q280 148 344 158" />
            </g>
            <rect x="222" y="66" width="62" height="62" rx="14" className="fill-emerald-100 dark:fill-emerald-200" />
            <path
              d="M241 112 L253 80 L265 112 M245 102 L261 102"
              className="stroke-emerald-700"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M300 84 Q320 80 344 82" className="stroke-orange-300" strokeWidth="5" strokeLinecap="round" />
            <path d="M300 100 Q320 97 336 98" className="stroke-[#e2d5c4] dark:stroke-zinc-400" strokeWidth="5" strokeLinecap="round" />
            <g className="fill-amber-400">
              <path d="M120 -6 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z" />
              <path d="M300 -24 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 Z" className="fill-emerald-400" />
              <path d="M330 4 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" />
            </g>
          </svg>
          <span
            className="absolute bottom-40 left-1/2 z-20 grid h-24 w-20 -translate-x-1/2 place-items-center rounded-2xl bg-white/80 shadow-xl ring-1 ring-white/70 backdrop-blur-md motion-safe:animate-hero-bob sm:bottom-60 sm:h-28 sm:w-24 dark:bg-zinc-900/70 dark:ring-white/10"
            style={{ animationDelay: "-0.9s" }}
          >
            <span className="flex flex-col items-center gap-1.5">
              <span className="text-3xl leading-none font-extrabold tracking-tight text-emerald-700 sm:text-4xl dark:text-emerald-300">
                Aa
              </span>
              <span className="h-1 w-8 rounded-full bg-orange-400" />
            </span>
          </span>
          <span className="absolute top-24 left-[4%] z-20 grid size-14 place-items-center rounded-2xl bg-white/75 shadow-lg ring-1 ring-white/70 backdrop-blur-md motion-safe:animate-hero-bob sm:left-[10%] dark:bg-zinc-900/60 dark:ring-white/10">
            <span className="grid size-8 place-items-center rounded-full bg-amber-300 text-amber-950">
              <Check className="size-4" strokeWidth={3} />
            </span>
          </span>
          <span
            className="absolute top-16 right-[2%] z-20 flex items-center gap-2.5 rounded-2xl bg-white/75 p-2 pr-3.5 shadow-lg ring-1 ring-white/70 backdrop-blur-md motion-safe:animate-hero-bob sm:top-40 sm:right-[6%] dark:bg-zinc-900/60 dark:ring-white/10"
            style={{ animationDelay: "-0.6s" }}
          >
            <span className="grid size-8 place-items-center rounded-full bg-emerald-500 text-white">
              <Play className="ml-0.5 size-3.5 fill-current" />
            </span>
            <span className="h-1.5 w-14 overflow-hidden rounded-full bg-zinc-200 sm:w-16 dark:bg-white/15">
              <span className="block h-full w-2/3 rounded-full bg-emerald-500" />
            </span>
          </span>
        </div>
      </div>
      </div>

      {howOpen ? null : (
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {freeLetters.map((body) => (
          <span
            key={body.id}
            ref={(node) => {
              freeNodeRefs.current[body.id] = node;
            }}
            data-glyph={body.letter}
            className={`absolute! ${GLYPH_CLASS} ${body.toneClassName}`}
            style={{
              left: body.x,
              top: body.y,
              opacity: body.opacity,
              transform: freeTransform(body),
            }}
          >
            {body.letter}
          </span>
        ))}
      </div>
      )}

      <div className="relative z-0 h-14 bg-linear-to-b from-cream to-white dark:from-slate-950 dark:to-slate-950" />

      {/* Stay mounted so Back/Close keeps currentTime on this element. */}
      <div
        className={
          howOpen
            ? "absolute inset-0 z-30 flex justify-center bg-linear-to-b from-amber-50 to-cream dark:from-slate-950 dark:to-slate-950"
            : "hidden"
        }
        inert={howOpen ? undefined : true}
      >
          <div className="flex h-full w-full max-w-page flex-col px-4 py-4 sm:py-6">
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-amber-200/80 pb-3 dark:border-white/10">
              <button
                ref={backButtonRef}
                type="button"
                className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full bg-white px-3.5 text-sm font-bold text-amber-950 ring-1 ring-amber-200 shadow-[0_6px_14px_-10px_rgba(180,83,9,0.55)] transition-[transform,background-color] motion-safe:hover:-translate-y-0.5 hover:bg-amber-50 active:translate-y-0 dark:bg-slate-900 dark:text-amber-100 dark:ring-white/15 dark:hover:bg-white/10 ${FOCUS}`}
                onClick={closeHow}
              >
                <ArrowLeft aria-hidden className="size-4" />
                {copy.hero.back}
              </button>
              <div className="flex min-w-0 flex-1 justify-center">
                <div
                  role="tablist"
                  aria-label={copy.hero.how}
                  className="flex w-max max-w-full min-w-0 gap-1 rounded-full bg-amber-100/80 p-1 ring-1 ring-amber-200/80 dark:bg-white/10 dark:ring-white/15"
                  onKeyDown={onHowTabKeyDown}
                >
                  <button
                    ref={videoTabRef}
                    id="how-tab-video"
                    type="button"
                    role="tab"
                    aria-selected={howPanel === "video"}
                    aria-controls="how-video-panel"
                    tabIndex={howPanel === "video" ? 0 : -1}
                    className={howTabClass(howPanel === "video")}
                    onClick={() => selectHowPanel("video")}
                  >
                    {copy.hero.videoTab}
                  </button>
                  <button
                    ref={guideTabRef}
                    id="how-tab-guide"
                    type="button"
                    role="tab"
                    aria-selected={howPanel === "guide"}
                    aria-controls="how-guide-panel"
                    tabIndex={howPanel === "guide" ? 0 : -1}
                    className={howTabClass(howPanel === "guide")}
                    onClick={() => selectHowPanel("guide")}
                  >
                    {copy.hero.guideTab}
                  </button>
                </div>
              </div>
              <button
                type="button"
                className={`grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-white text-amber-950 ring-1 ring-amber-200 shadow-[0_6px_14px_-10px_rgba(180,83,9,0.55)] transition-[transform,background-color] motion-safe:hover:-translate-y-0.5 hover:bg-amber-50 active:translate-y-0 dark:bg-slate-900 dark:text-amber-100 dark:ring-white/15 dark:hover:bg-white/15 ${FOCUS}`}
                aria-label={copy.path.close}
                onClick={closeHow}
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <video
              id="how-video-panel"
              ref={videoRef}
              role="tabpanel"
              aria-labelledby="how-tab-video"
              hidden={howPanel !== "video"}
              src={HOW_VIDEO}
              controls
              playsInline
              preload="metadata"
              aria-label={copy.hero.how}
              className="min-h-0 w-full flex-1 rounded-2xl bg-zinc-950 object-contain ring-1 ring-amber-200/80 shadow-[0_18px_40px_-24px_rgba(120,53,15,0.45)] dark:ring-white/10"
              onTimeUpdate={(event) => {
                playbackTimeRef.current = rememberHowTime(
                  event.currentTarget,
                  playbackTimeRef.current,
                );
              }}
              onPause={(event) => {
                playbackTimeRef.current = rememberHowTime(
                  event.currentTarget,
                  playbackTimeRef.current,
                );
              }}
            />
            <div
              id="how-guide-panel"
              role="tabpanel"
              aria-labelledby="how-tab-guide"
              hidden={howPanel !== "guide"}
              className="min-h-0 w-full flex-1 overflow-y-auto rounded-2xl bg-white px-5 py-6 ring-1 ring-amber-200/80 shadow-[0_18px_40px_-24px_rgba(120,53,15,0.4)] sm:px-8 dark:bg-slate-900 dark:ring-white/10"
            >
              <h3 className="text-xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                {copy.hero.guideTitle}
              </h3>
              <ol className="mt-5 flex list-none flex-col gap-4 p-0">
                {copy.hero.guideSteps.map((step, index) => (
                  <li
                    key={step}
                    className="flex items-start gap-3 text-sm leading-relaxed font-medium text-zinc-700 sm:text-base dark:text-zinc-200"
                  >
                    <span
                      aria-hidden
                      className="grid size-8 shrink-0 place-items-center rounded-full bg-orange-500 text-sm font-bold text-white"
                    >
                      {index + 1}
                    </span>
                    <span className="pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
      </div>
    </section>
  );
}
