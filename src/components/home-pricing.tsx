"use client";

import Link from "next/link";
import { ArrowRight, Calculator, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import FrostGlass from "@/components/frost-glass";
import PlanCalculator, { type CalcPlanMonths } from "@/components/plan-calculator";

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
  { card: string; kicker: string; meta: string; total: string; chip: string; row: string; cta: string }
> = {
  1: {
    card: "border-sky-200 border-b-sky-700 bg-sky-50/70 text-sky-950 shadow-[0_22px_40px_-28px_rgba(3,105,161,0.9)] dark:border-sky-800 dark:border-b-sky-400 dark:bg-sky-950/70 dark:text-sky-50",
    kicker: "bg-white/80 text-sky-800 dark:bg-sky-900 dark:text-sky-100",
    meta: "text-sky-800 dark:text-sky-200",
    total: "text-sky-950 dark:text-sky-50",
    chip: "bg-sky-100 text-sky-950 dark:bg-sky-900 dark:text-sky-50",
    row: "bg-white/90 text-zinc-800 ring-1 ring-sky-100 dark:bg-sky-950/80 dark:text-sky-100 dark:ring-sky-800",
    cta: "bg-sky-800 text-white",
  },
  3: {
    card: "border-amber-200 border-b-amber-600 bg-amber-50/70 text-amber-950 shadow-[0_22px_40px_-28px_rgba(180,83,9,0.85)] dark:border-amber-800 dark:border-b-amber-400 dark:bg-amber-950/70 dark:text-amber-50",
    kicker: "bg-white/80 text-amber-900 dark:bg-amber-900 dark:text-amber-100",
    meta: "text-amber-900 dark:text-amber-200",
    total: "text-amber-950 dark:text-amber-50",
    chip: "bg-amber-100 text-amber-950 dark:bg-amber-900 dark:text-amber-50",
    row: "bg-white/90 text-zinc-800 ring-1 ring-amber-100 dark:bg-amber-950/80 dark:text-amber-100 dark:ring-amber-800",
    cta: "bg-amber-700 text-white",
  },
  6: {
    card: "border-orange-200 border-b-orange-600 bg-orange-50/70 text-orange-950 shadow-[0_22px_40px_-28px_rgba(194,65,12,0.85)] dark:border-orange-800 dark:border-b-orange-400 dark:bg-orange-950/70 dark:text-orange-50",
    kicker: "bg-white/80 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
    meta: "text-orange-900 dark:text-orange-200",
    total: "text-orange-950 dark:text-orange-50",
    chip: "bg-orange-100 text-orange-950 dark:bg-orange-900 dark:text-orange-50",
    row: "bg-white/90 text-zinc-800 ring-1 ring-orange-100 dark:bg-orange-950/80 dark:text-orange-100 dark:ring-orange-800",
    cta: "bg-orange-700 text-white",
  },
  12: {
    card: "border-emerald-200 border-b-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-[0_22px_40px_-28px_rgba(5,150,105,0.85)] dark:border-emerald-800 dark:border-b-emerald-400 dark:bg-emerald-950/70 dark:text-emerald-50",
    kicker: "bg-white/80 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
    meta: "text-emerald-900 dark:text-emerald-200",
    total: "text-emerald-950 dark:text-emerald-50",
    chip: "bg-emerald-100 text-emerald-950 dark:bg-emerald-900 dark:text-emerald-50",
    row: "bg-white/90 text-zinc-800 ring-1 ring-emerald-100 dark:bg-emerald-950/80 dark:text-emerald-100 dark:ring-emerald-800",
    cta: "bg-emerald-700 text-white",
  },
};

/** Spelling fixed: FLUENT → FLUENTLY. Words wrap on small screens. */
const PUZZLE_WORDS = ["LEARN", "ENGLISH", "FLUENTLY"] as const;
const PUZZLE_SLOTS = PUZZLE_WORDS.flatMap((word) =>
  word.split("").map((char, index) => ({
    key: `${word}-${index}`,
    char,
    word,
  })),
);

const LETTER_TINTS = [
  "text-sky-600/90",
  "text-amber-600/90",
  "text-orange-600/90",
  "text-emerald-600/90",
  "text-zinc-600/90",
] as const;

type LetterTint = (typeof LETTER_TINTS)[number];

/** Solid slot fill after fly-in — same hue as the floor glyph, full opacity. */
const LETTER_FILL: Record<LetterTint, string> = {
  "text-sky-600/90": "text-sky-600",
  "text-amber-600/90": "text-amber-600",
  "text-orange-600/90": "text-orange-600",
  "text-emerald-600/90": "text-emerald-600",
  "text-zinc-600/90": "text-zinc-600",
};

/** Matches `letter-fly-in` in globals.css. */
const FLY_MS = 560;

type LetterFly = {
  id: number;
  /** Puzzle slot this fly lands in (one floor glyph → one slot). */
  slotKey: string;
  char: string;
  left: number;
  top: number;
  dx: number;
  dy: number;
  scale: number;
  rotate: number;
  delay: number;
  tint: LetterTint;
};

type FlyStyle = CSSProperties & {
  "--fly-x"?: string;
  "--fly-y"?: string;
  "--fly-scale"?: number;
  "--fly-rotate"?: string;
};

type LetterDrop = {
  /** Unique floor glyph id (puzzle slot key or decoy-* ). */
  id: string;
  char: string;
  left: number;
  delay: number;
  duration: number;
  lift: number;
  /** Seed order in the pile — higher = on top (z-index). */
  stack: number;
  landRotate: number;
  spinStart: number;
  tint: LetterTint;
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

/** Alpha above this counts as painted glyph ink (empty box padding passes through). */
const GLYPH_INK_ALPHA = 20;

let glyphHitCanvas: HTMLCanvasElement | null = null;

function glyphHitContext(w: number, h: number): CanvasRenderingContext2D | null {
  if (typeof document === "undefined") return null;
  if (!glyphHitCanvas) glyphHitCanvas = document.createElement("canvas");
  if (glyphHitCanvas.width !== w) glyphHitCanvas.width = w;
  if (glyphHitCanvas.height !== h) glyphHitCanvas.height = h;
  return glyphHitCanvas.getContext("2d", { willReadFrequently: true });
}

/**
 * True when the point sits on the letter's painted ink — not the transparent
 * rectangular padding that would otherwise steal clicks from letters underneath.
 */
function glyphInkHits(el: HTMLElement, clientX: number, clientY: number): boolean {
  const rect = el.getBoundingClientRect();
  const w = Math.max(1, Math.ceil(rect.width));
  const h = Math.max(1, Math.ceil(rect.height));
  const x = Math.floor(clientX - rect.left);
  const y = Math.floor(clientY - rect.top);
  if (x < 0 || y < 0 || x >= w || y >= h) return false;

  const char = el.textContent?.trim() ?? "";
  if (!char) return false;

  const ctx = glyphHitContext(w, h);
  if (!ctx) return true;

  const cs = getComputedStyle(el);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#000";
  ctx.font = cs.font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (cs.letterSpacing) ctx.letterSpacing = cs.letterSpacing;

  const matrix = new DOMMatrix(cs.transform === "none" ? undefined : cs.transform);
  ctx.translate(w / 2, h / 2);
  ctx.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
  ctx.fillText(char, 0, 0);

  try {
    return (ctx.getImageData(x, y, 1, 1).data[3] ?? 0) >= GLYPH_INK_ALPHA;
  } catch {
    return true;
  }
}

/**
 * Topmost letter whose *ink* contains the point. Front glyphs with empty
 * padding at the click yield to whatever peeks out underneath.
 */
function pickLetterAtPoint(
  clientX: number,
  clientY: number,
  drops: readonly LetterDrop[],
  settled: ReadonlySet<string>,
  hops: Readonly<Record<string, LetterHop>>,
  consumed: ReadonlySet<string>,
  els: ReadonlyMap<string, HTMLElement>,
): { drop: LetterDrop; el: HTMLElement } | null {
  const candidates: { drop: LetterDrop; el: HTMLElement; stack: number }[] = [];
  for (const drop of drops) {
    if (consumed.has(drop.id) || !settled.has(drop.id) || hops[drop.id]) continue;
    const el = els.get(drop.id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      continue;
    }
    candidates.push({ drop, el, stack: drop.stack });
  }
  candidates.sort((a, b) => b.stack - a.stack);
  for (const candidate of candidates) {
    if (glyphInkHits(candidate.el, clientX, clientY)) {
      return { drop: candidate.drop, el: candidate.el };
    }
  }
  return null;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
/** Extra full alphabets mixed into the floor pile (unmatched → hop). */
const DECOY_ALPHABET_SETS = 3;

/** Floor span across the full Plans section (percent). Pad so glyphs do not clip. */
const FLOOR_LEFT_MIN = 4;
const FLOOR_LEFT_MAX = 96;
/** Columns across the full floor — each letter lands on the tallest occupied column under it. */
const FLOOR_BIN_COUNT = 28;
/**
 * Default glyph hitbox width in % of section (centers on `left`).
 * Keep ≈ one bin (~3.3%) so side-by-side letters do not form phantom platforms.
 */
const LETTER_WIDTH_PCT = 2.8;
/** How much each landed letter raises the surface under its bins (px). */
const STACK_STEP_PX = 26;
/**
 * Cap so stacks stay inside the floor spacer (h-44/sm:h-56) and do not pin to
 * `floorTop` via the dropY clamp (usable ≈ floorHeight − glyph + sink).
 */
const PILE_LIFT_CAP = 120;
/** Occasional wild left so the pile stays irregular, not a flat fill. */
const WILD_LEFT_CHANCE = 0.12;

/** Thin glyphs need a tighter hitbox or they look mid-air next to neighbors. */
function letterHitWidthPct(char?: string): number {
  if (!char) return LETTER_WIDTH_PCT;
  if (char === "I" || char === "J" || char === "L" || char === "F" || char === "T") {
    return LETTER_WIDTH_PCT * 0.55;
  }
  if (char === "M" || char === "W") return LETTER_WIDTH_PCT * 1.2;
  return LETTER_WIDTH_PCT;
}

/** Bin index for a letter's center `left` %. */
function leftToCenterBin(left: number): number {
  const span = FLOOR_LEFT_MAX - FLOOR_LEFT_MIN;
  return Math.min(
    FLOOR_BIN_COUNT - 1,
    Math.max(0, Math.floor(((left - FLOOR_LEFT_MIN) / span) * FLOOR_BIN_COUNT)),
  );
}

function clampFloorLeft(left: number): number {
  return Math.min(FLOOR_LEFT_MAX, Math.max(FLOOR_LEFT_MIN, left));
}

/** Any horizontal position across the section floor. */
function floorLeft(): number {
  return (
    FLOOR_LEFT_MIN + Math.random() * (FLOOR_LEFT_MAX - FLOOR_LEFT_MIN)
  );
}

/** Bin center → left %, with light jitter so glyphs are not grid-locked. */
function leftFromBin(bin: number): number {
  const span = FLOOR_LEFT_MAX - FLOOR_LEFT_MIN;
  const center =
    FLOOR_LEFT_MIN + ((bin + 0.5) / FLOOR_BIN_COUNT) * span;
  const jitter = (Math.random() - 0.5) * (span / FLOOR_BIN_COUNT) * 0.7;
  return clampFloorLeft(center + jitter);
}

/** Max surface height under a letter's horizontal hitbox. */
function surfaceUnder(
  left: number,
  surfaces: readonly number[],
  char?: string,
): number {
  const { start, end } = leftToBins(left, char);
  let surface = 0;
  for (let i = start; i <= end; i += 1) {
    surface = Math.max(surface, surfaces[i] ?? 0);
  }
  return surface;
}

/**
 * Prefer the lowest *landing* (hitbox max across bins) so the pile fills from
 * the floor up and spreads sideways before climbing. Wild chance keeps texture.
 */
function pickLowestSurfaceLeft(surfaces: readonly number[]): number {
  if (Math.random() < WILD_LEFT_CHANCE) return floorLeft();

  const span = FLOOR_LEFT_MAX - FLOOR_LEFT_MIN;
  let bestH = Infinity;
  const lowBins: number[] = [];
  for (let i = 0; i < FLOOR_BIN_COUNT; i += 1) {
    const probe =
      FLOOR_LEFT_MIN + ((i + 0.5) / FLOOR_BIN_COUNT) * span;
    const h = surfaceUnder(probe, surfaces);
    if (h < bestH) {
      bestH = h;
      lowBins.length = 0;
      lowBins.push(i);
    } else if (h === bestH) {
      lowBins.push(i);
    }
  }
  const bin = lowBins[Math.floor(Math.random() * lowBins.length)] ?? 0;
  return leftFromBin(bin);
}

/**
 * Hop landing: prefer a low collision slot away from the current left.
 * Falls back to a kicked random left if every sample stays too close.
 */
function pickFloorHopLeft(
  current: number,
  others: readonly LetterDrop[],
  char?: string,
): number {
  if (Math.random() < WILD_LEFT_CHANCE) {
    let next = floorLeft();
    if (Math.abs(next - current) < 8) {
      const mid = (FLOOR_LEFT_MIN + FLOOR_LEFT_MAX) / 2;
      const kick = (current <= mid ? 1 : -1) * (12 + Math.random() * 18);
      next = clampFloorLeft(current + kick);
    }
    return next;
  }

  let bestLeft = floorLeft();
  let bestLift = Infinity;
  for (let attempt = 0; attempt < 16; attempt += 1) {
    const candidate = leftFromBin(Math.floor(Math.random() * FLOOR_BIN_COUNT));
    if (Math.abs(candidate - current) < 8) continue;
    const lift = collisionLift(candidate, others, char);
    if (lift < bestLift) {
      bestLift = lift;
      bestLeft = candidate;
    }
  }
  if (Math.abs(bestLeft - current) < 8) {
    const mid = (FLOOR_LEFT_MIN + FLOOR_LEFT_MAX) / 2;
    const kick = (current <= mid ? 1 : -1) * (12 + Math.random() * 18);
    return clampFloorLeft(current + kick);
  }
  return bestLeft;
}

/** Map a letter's horizontal hitbox onto floor bin indices. */
function leftToBins(left: number, char?: string): { start: number; end: number } {
  const span = FLOOR_LEFT_MAX - FLOOR_LEFT_MIN;
  const halfW = letterHitWidthPct(char) / 2;
  const start = Math.max(
    0,
    Math.floor(((left - halfW - FLOOR_LEFT_MIN) / span) * FLOOR_BIN_COUNT),
  );
  const end = Math.min(
    FLOOR_BIN_COUNT - 1,
    Math.floor(((left + halfW - FLOOR_LEFT_MIN) / span) * FLOOR_BIN_COUNT),
  );
  return { start, end: Math.max(start, end) };
}

/**
 * Place one letter on the current column surfaces.
 * Returns lift (px above floor). Only the *center* bin rises — raising the full
 * hitbox built sideways "bridges" so letters looked mid-air with nothing under them.
 */
function placeOnSurface(left: number, surfaces: number[], char?: string): number {
  const surface = surfaceUnder(left, surfaces, char);
  const lift = Math.min(PILE_LIFT_CAP, surface);
  const raised = Math.min(PILE_LIFT_CAP, lift + STACK_STEP_PX);
  const center = leftToCenterBin(left);
  surfaces[center] = Math.max(surfaces[center] ?? 0, raised);
  return lift;
}

/** Lift for a hop landing: top of any overlapping settled letter + one step. */
function collisionLift(
  left: number,
  others: readonly LetterDrop[],
  char?: string,
): number {
  const mine = leftToBins(left, char);
  let top = 0;
  for (const other of others) {
    const theirs = leftToBins(other.left, other.char);
    if (theirs.end < mine.start || theirs.start > mine.end) continue;
    top = Math.max(top, other.lift + STACK_STEP_PX);
  }
  return Math.min(PILE_LIFT_CAP, top);
}

/**
 * After a support leaves (match fly or hop away), drop remaining letters into
 * the gap: keep each `left`, re-place bottom-up on column surfaces.
 */
function restackLifts(letters: readonly LetterDrop[]): LetterDrop[] {
  if (letters.length === 0) return [];
  const ordered = [...letters].sort(
    (a, b) => a.lift - b.lift || a.stack - b.stack,
  );
  const surfaces = Array.from({ length: FLOOR_BIN_COUNT }, () => 0);
  const nextLift = new Map<string, number>();
  for (const letter of ordered) {
    nextLift.set(letter.id, placeOnSurface(letter.left, surfaces, letter.char));
  }
  return letters.map((letter) => {
    const lift = nextLift.get(letter.id);
    return lift === undefined || lift === letter.lift
      ? letter
      : { ...letter, lift };
  });
}

/** Apply restacked lifts onto the full drops list; ids in `skip` keep prior pose. */
function withRestacked(
  drops: readonly LetterDrop[],
  active: readonly LetterDrop[],
  skip: ReadonlySet<string>,
): LetterDrop[] {
  const byId = new Map(restackLifts(active).map((d) => [d.id, d]));
  return drops.map((d) => (skip.has(d.id) ? d : (byId.get(d.id) ?? d)));
}

function makeDrop(
  id: string,
  char: string,
  stackIndex: number,
  left: number,
  lift: number,
  stackTotal: number,
): LetterDrop {
  // Lower stack indices fall first so later letters visually land on the pile.
  const delay =
    stackTotal <= 1
      ? Math.random() * 0.4
      : (stackIndex / (stackTotal - 1)) * 1.35 + Math.random() * 0.25;
  return {
    id,
    char,
    left,
    delay,
    duration: 1.15 + Math.random() * 1.15,
    lift,
    stack: stackIndex,
    landRotate: randomLandRotate(),
    spinStart: (Math.random() - 0.5) * 140,
    tint: LETTER_TINTS[Math.floor(Math.random() * LETTER_TINTS.length)]!,
  };
}

/** Floor bag = puzzle multiset + 3× A–Z decoys, stacked on column surfaces. */
function seedLetters(): LetterDrop[] {
  const ids: { id: string; char: string }[] = PUZZLE_SLOTS.map((slot) => ({
    id: slot.key,
    char: slot.char,
  }));
  for (let set = 0; set < DECOY_ALPHABET_SETS; set += 1) {
    for (let i = 0; i < ALPHABET.length; i += 1) {
      const char = ALPHABET[i]!;
      ids.push({ id: `decoy-${set}-${char}`, char });
    }
  }
  for (let i = ids.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = ids[i]!;
    ids[i] = ids[j]!;
    ids[j] = tmp;
  }
  const total = ids.length;
  const surfaces = Array.from({ length: FLOOR_BIN_COUNT }, () => 0);
  return ids.map((item, i) => {
    const left = pickLowestSurfaceLeft(surfaces);
    const lift = placeOnSurface(left, surfaces, item.char);
    return makeDrop(item.id, item.char, i, left, lift, total);
  });
}

function kyat(amount: number): string {
  return `Ks ${amount.toLocaleString("en-US")}`;
}

function isCalcPlan(months: PlanMonths): months is CalcPlanMonths {
  return months === 3 || months === 6 || months === 12;
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
  const [flippedPlan, setFlippedPlan] = useState<CalcPlanMonths | null>(null);
  /** slotKey → floor tint used for solid fill. */
  const [filled, setFilled] = useState<Readonly<Partial<Record<string, LetterTint>>>>({});
  const filledRef = useRef(filled);
  filledRef.current = filled;
  /** Floor glyph ids removed after a match fly starts. */
  const [consumed, setConsumed] = useState<ReadonlySet<string>>(() => new Set());
  const consumedRef = useRef(consumed);
  consumedRef.current = consumed;
  const [flies, setFlies] = useState<LetterFly[]>([]);
  const slotRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  /** Landed glyph nodes — used for ink hit-testing under overlaps. */
  const letterElsRef = useRef<Map<string, HTMLElement>>(new Map());
  /** slotKeys with an in-flight fill (blocks picking the same slot twice). */
  const pendingFlyRef = useRef<Record<string, number>>({});
  const fillTintRef = useRef<Partial<Record<string, LetterTint>>>({});
  const flyIdRef = useRef(0);
  const flyTimersRef = useRef<number[]>([]);

  const clearHopTimers = useCallback(() => {
    for (const timer of Object.values(hopTimersRef.current)) {
      window.clearTimeout(timer);
    }
    hopTimersRef.current = {};
  }, []);

  const clearFlyTimers = useCallback(() => {
    for (const timer of flyTimersRef.current) {
      window.clearTimeout(timer);
    }
    flyTimersRef.current = [];
  }, []);

  /** True once a puzzle letter is matched (fill, consume, or in-flight fly). Hop-only does not count. */
  const hasPuzzleProgress = useCallback(
    () =>
      Object.keys(filledRef.current).length > 0 ||
      consumedRef.current.size > 0 ||
      Object.keys(pendingFlyRef.current).length > 0,
    [],
  );

  /** Clear fills / in-flight motion and drop a fresh floor bag (same as viewport re-enter when idle). */
  const restartPuzzle = useCallback(() => {
    clearHopTimers();
    clearFlyTimers();
    setSettled(new Set());
    setHops({});
    filledRef.current = {};
    setFilled({});
    const empty = new Set<string>();
    consumedRef.current = empty;
    setConsumed(empty);
    setFlies([]);
    pendingFlyRef.current = {};
    fillTintRef.current = {};
    setRunId((n) => n + 1);
    setDrops(seedLetters());
  }, [clearFlyTimers, clearHopTimers]);

  const commitFill = useCallback((slotKey: string) => {
    const tint = fillTintRef.current[slotKey] ?? LETTER_TINTS[0]!;
    setFilled((prev) => {
      if (prev[slotKey]) return prev;
      return { ...prev, [slotKey]: tint };
    });
    setFlies((prev) => prev.filter((fly) => fly.slotKey !== slotKey));
    delete pendingFlyRef.current[slotKey];
  }, []);

  /** One floor glyph → one empty puzzle slot of the same letter. */
  const startFillFly = useCallback(
    (slotKey: string, sourceEl: HTMLElement, drop: LetterDrop) => {
      const section = sectionRef.current;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      fillTintRef.current[slotKey] = drop.tint;

      setConsumed((prev) => {
        const next = new Set(prev);
        next.add(drop.id);
        consumedRef.current = next;
        // Gap left by this glyph: letters above settle into free surface.
        setDrops((prevDrops) => {
          const skip = next;
          const active = prevDrops.filter((d) => !skip.has(d.id));
          return withRestacked(prevDrops, active, skip);
        });
        return next;
      });

      if (!section || reduceMotion) {
        commitFill(slotKey);
        return;
      }

      const source = sourceEl.getBoundingClientRect();
      const sectionBox = section.getBoundingClientRect();
      const target = slotRefs.current.get(slotKey);

      if (!target || source.width < 1 || source.height < 1) {
        commitFill(slotKey);
        return;
      }

      const dest = target.getBoundingClientRect();
      const scale =
        dest.height > 0 && source.height > 0 ? dest.height / source.height : 0.35;
      const nextFly: LetterFly = {
        id: ++flyIdRef.current,
        slotKey,
        char: drop.char,
        left: source.left - sectionBox.left,
        top: source.top - sectionBox.top,
        dx: dest.left + dest.width / 2 - (source.left + source.width / 2),
        dy: dest.top + dest.height / 2 - (source.top + source.height / 2),
        scale,
        rotate: drop.landRotate,
        delay: 0,
        tint: drop.tint,
      };

      pendingFlyRef.current[slotKey] = 1;
      setFlies((prev) => [...prev, nextFly]);

      const timer = window.setTimeout(() => {
        commitFill(slotKey);
      }, FLY_MS + 80);
      flyTimersRef.current.push(timer);
    },
    [commitFill],
  );

  const commitHop = useCallback((dropId: string, finished: LetterHop) => {
    window.clearTimeout(hopTimersRef.current[dropId]);
    delete hopTimersRef.current[dropId];
    setDrops((prev) => {
      const skip = consumedRef.current;
      const hopper = prev.find((item) => item.id === dropId);
      const others = restackLifts(
        prev.filter((item) => item.id !== dropId && !skip.has(item.id)),
      );
      // Hop animation ends at the start height (Y=0). Never climb after that
      // settle — only allow gravity down into a lower gap at the new column.
      const landLift = Math.min(
        hopper?.lift ?? finished.nextLift,
        collisionLift(finished.nextLeft, others, hopper?.char),
      );
      const byId = new Map(others.map((d) => [d.id, d]));
      return prev.map((item) => {
        if (item.id === dropId) {
          return {
            ...item,
            left: finished.nextLeft,
            lift: landLift,
            landRotate: finished.nextRotate,
            spinStart: finished.nextRotate,
          };
        }
        if (skip.has(item.id)) return item;
        return byId.get(item.id) ?? item;
      });
    });
    setHops((prev) => {
      if (prev[dropId]?.id !== finished.id) return prev;
      const next = { ...prev };
      delete next[dropId];
      return next;
    });
  }, []);

  /** Match-fly or hop for the letter whose ink was actually clicked. */
  const activateFloorLetter = useCallback(
    (
      drop: LetterDrop,
      sourceEl: HTMLElement,
      floorDrops: readonly LetterDrop[],
      activeHops: Readonly<Record<string, LetterHop>>,
    ) => {
      if (consumedRef.current.has(drop.id) || activeHops[drop.id]) return;

      const emptySlot = PUZZLE_SLOTS.find(
        (slot) =>
          slot.char === drop.char &&
          !fillTintRef.current[slot.key] &&
          !pendingFlyRef.current[slot.key],
      );
      if (emptySlot) {
        startFillFly(emptySlot.key, sourceEl, drop);
        return;
      }

      const section = sectionRef.current;
      if (!section) return;
      const skip = consumedRef.current;
      const others = restackLifts(
        floorDrops.filter((item) => item.id !== drop.id && !skip.has(item.id)),
      );
      const nextLeft = pickFloorHopLeft(drop.left, others, drop.char);
      const hopX = ((nextLeft - drop.left) / 100) * section.clientWidth;
      const nextLift = Math.min(
        drop.lift,
        collisionLift(nextLeft, others, drop.char),
      );
      const finished: LetterHop = {
        id: (activeHops[drop.id]?.id ?? 0) + 1,
        hopX,
        nextLeft,
        nextLift,
        nextRotate: randomLandRotate(),
      };
      setDrops((prev) => {
        const active = prev.filter(
          (item) => item.id !== drop.id && !skip.has(item.id),
        );
        const hopping = new Set(skip);
        hopping.add(drop.id);
        return withRestacked(prev, active, hopping);
      });
      setHops((prev) => ({ ...prev, [drop.id]: finished }));
      window.clearTimeout(hopTimersRef.current[drop.id]);
      hopTimersRef.current[drop.id] = window.setTimeout(() => {
        commitHop(drop.id, finished);
      }, HOP_MS + 70);
    },
    [commitHop, startFillFly],
  );

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

        // rootMargin shrinks the hit box so a tall Plans (cards + floor) does not
        // stay "in view" forever from a floor sliver. Idle leave/re-enter reseeds;
        // after any puzzle letter match, keep state (enter from above or below).
        if (entry.isIntersecting) {
          if (!wasInView) {
            measure();
            if (!hasPuzzleProgress()) restartPuzzle();
          }
          wasInView = true;
          return;
        }

        wasInView = false;
        if (hasPuzzleProgress()) return;

        clearHopTimers();
        clearFlyTimers();
        setSettled(new Set());
        setHops({});
        filledRef.current = {};
        setFilled({});
        consumedRef.current = new Set();
        setConsumed(new Set());
        setFlies([]);
        pendingFlyRef.current = {};
        fillTintRef.current = {};
        setDrops([]);
      },
      { threshold: 0, rootMargin: "-18% 0px -18% 0px" },
    );

    io.observe(section);
    return () => {
      io.disconnect();
      ro.disconnect();
      clearHopTimers();
      clearFlyTimers();
    };
  }, [clearFlyTimers, clearHopTimers, hasPuzzleProgress, restartPuzzle]);

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
            ? drops
                .filter((drop) => !consumed.has(drop.id))
                .map((drop) => {
                const sink = Math.round(glyphHeight * 0.18);
                const dropY = Math.max(
                  floorTop,
                  sectionHeight - glyphHeight + sink - drop.lift,
                );
                const landed = settled.has(drop.id);
                const hop = hops[drop.id];
                const style: LetterStyle = landed
                  ? {
                      left: `${drop.left}%`,
                      transform: `translate(-50%, ${dropY}px)`,
                      zIndex: drop.stack,
                      // Gravity settle when lift drops after a support is removed.
                      transition: hop
                        ? undefined
                        : "transform 0.55s cubic-bezier(0.33, 0, 0.2, 1)",
                    }
                  : {
                      left: `${drop.left}%`,
                      animationDelay: `${drop.delay}s`,
                      animationDuration: `${drop.duration}s`,
                      "--drop-y": `${dropY}px`,
                      zIndex: drop.stack,
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
                    key={`${runId}-${drop.id}`}
                    className={`pointer-events-none absolute top-0 text-7xl leading-none font-extrabold tracking-tight drop-shadow-[0_2px_2px_rgb(0_0_0_/_0.45)] select-none sm:text-8xl ${drop.tint} ${landed ? "" : "motion-safe:animate-letter-fall"}`}
                    style={style}
                    onAnimationEnd={(event) => {
                      if (event.target !== event.currentTarget) return;
                      if (event.animationName !== "letter-fall") return;
                      setSettled((prev) => {
                        if (prev.has(drop.id)) return prev;
                        const next = new Set(prev);
                        next.add(drop.id);
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
                        commitHop(drop.id, hop);
                      }}
                    >
                      <span
                        ref={(node) => {
                          if (node) letterElsRef.current.set(drop.id, node);
                          else letterElsRef.current.delete(drop.id);
                        }}
                        data-letter-id={drop.id}
                        className={`block ${landed ? "" : "motion-safe:animate-letter-spin"} ${landed && !hop ? "pointer-events-auto cursor-pointer" : "pointer-events-none"}`}
                        style={spinStyle}
                        onClick={(event) => {
                          if (!landed) return;
                          // Front letter boxes steal clicks on empty padding — resolve by ink
                          // so a peeking letter underneath is the one that activates.
                          const hit = pickLetterAtPoint(
                            event.clientX,
                            event.clientY,
                            drops,
                            settled,
                            hops,
                            consumed,
                            letterElsRef.current,
                          );
                          if (!hit) return;
                          activateFloorLetter(hit.drop, hit.el, drops, hops);
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

      {flies.length > 0 ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-30">
          {flies.map((fly) => {
            const flyStyle: FlyStyle = {
              left: fly.left,
              top: fly.top,
              animationDelay: `${fly.delay}ms`,
              "--fly-x": `${fly.dx}px`,
              "--fly-y": `${fly.dy}px`,
              "--fly-scale": fly.scale,
              "--fly-rotate": `${fly.rotate}deg`,
            };
            return (
              <span
                key={fly.id}
                className={`pointer-events-none absolute text-7xl leading-none font-extrabold tracking-tight select-none sm:text-8xl ${fly.tint} motion-safe:animate-letter-fly-in`}
                style={flyStyle}
                onAnimationEnd={(event) => {
                  if (event.target !== event.currentTarget) return;
                  if (!event.animationName.includes("letter-fly-in")) return;
                  const left = (pendingFlyRef.current[fly.slotKey] ?? 1) - 1;
                  pendingFlyRef.current[fly.slotKey] = left;
                  if (left <= 0) commitFill(fly.slotKey);
                }}
              >
                {fly.char}
              </span>
            );
          })}
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
            const total = months * MONTHLY_KYAT;
            const billedDays = months * 30;
            const coveredDays = billedDays + extraDays;
            const canFlip = isCalcPlan(months);
            const flipped = canFlip && flippedPlan === months;

            const front = (
              <article
                className={`flex h-full min-h-[28rem] flex-col rounded-[1.75rem] border-2 border-b-8 px-5 pt-5 pb-12 sm:px-6 sm:pt-6 sm:pb-14 ${tone.card}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`w-fit rounded-full px-3 py-1 text-sm font-bold ${tone.kicker}`}>
                    {lengthLabel}
                  </span>
                  {canFlip ? (
                    <button
                      type="button"
                      className={`grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border-2 border-white shadow-md ring-1 ring-black/5 transition-transform motion-safe:hover:-translate-y-0.5 ${tone.cta} ${FOCUS}`}
                      aria-label={`Flip to calculator for ${lengthLabel}`}
                      aria-pressed={flipped}
                      onClick={() => setFlippedPlan(months)}
                    >
                      <Calculator aria-hidden className="size-3.5" />
                    </button>
                  ) : null}
                </div>
                <p className={`mt-3 text-sm font-semibold ${tone.meta}`}>
                  {kyat(MONTHLY_KYAT)} / month
                </p>

                <div className="mt-4 grid flex-1 gap-2">
                  <div className={`rounded-3xl px-3.5 py-3.5 ${tone.row}`}>
                    <p className="text-[11px] font-bold tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
                      Total due
                    </p>
                    <p
                      className={`mt-1.5 text-[1.75rem] leading-none font-extrabold tracking-tight ${tone.total}`}
                    >
                      {kyat(total)}
                    </p>
                  </div>
                  <div
                    className={`flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-semibold ${tone.chip}`}
                  >
                    <span>
                      {months} × {kyat(MONTHLY_KYAT)}
                    </span>
                    <span className="font-bold tabular-nums">{kyat(total)}</span>
                  </div>
                  <div
                    className={`flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-semibold ${tone.row}`}
                  >
                    <span>Billed days</span>
                    <span className="font-bold tabular-nums">{billedDays} days</span>
                  </div>
                  {extraDays > 0 ? (
                    <div
                      className={`flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-semibold ${tone.row}`}
                    >
                      <span>Extra days</span>
                      <span className="font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                        +{extraDays}
                      </span>
                    </div>
                  ) : null}
                  <div
                    className={`flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-semibold ${tone.row}`}
                  >
                    <span>Access covers</span>
                    <span className="font-bold tabular-nums">{coveredDays} days</span>
                  </div>
                </div>

                <Link
                  href="/teachers"
                  className={`group relative mt-5 inline-flex min-h-12 w-fit items-center gap-2 overflow-hidden rounded-full px-6 text-sm font-bold transition-[transform,overflow] motion-safe:hover:-translate-y-0.5 motion-safe:hover:overflow-visible ${tone.cta} ${FOCUS}`}
                >
                  <FrostGlass />
                  <span className="relative z-10">See teachers</span>
                  <ArrowRight aria-hidden className="relative z-10 size-4" />
                </Link>
              </article>
            );

            if (!canFlip) {
              return (
                <li key={months} className="min-w-0">
                  {front}
                </li>
              );
            }

            return (
              <li key={months} className="min-w-0 [perspective:1200px]">
                <div
                  className={`relative min-h-[28rem] transition-transform duration-500 ease-out [transform-style:preserve-3d] motion-reduce:duration-0 ${
                    flipped ? "[transform:rotateY(180deg)]" : ""
                  }`}
                >
                  <div
                    className={`[backface-visibility:hidden] ${
                      flipped ? "pointer-events-none" : ""
                    }`}
                  >
                    {front}
                  </div>
                  <div
                    className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                      flipped ? "" : "pointer-events-none"
                    }`}
                    aria-hidden={!flipped}
                  >
                    <PlanCalculator
                      months={months}
                      shellClassName={tone.card}
                      active={flipped}
                      onClose={() => setFlippedPlan(null)}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div
          className="pointer-events-none mx-auto mt-12 flex max-w-3xl flex-col items-center gap-2 sm:mt-16 sm:gap-3"
          role="group"
          aria-label="Learn English fluently"
        >
          <p className="sr-only">
            Click matching letters on the floor to fill LEARN ENGLISH FLUENTLY.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 sm:gap-x-8 sm:gap-y-4">
            {PUZZLE_WORDS.map((word) => (
              <div key={word} className="flex items-center gap-0.5 sm:gap-1" aria-hidden>
                {word.split("").map((char, index) => {
                  const key = `${word}-${index}`;
                  const tint = filled[key];
                  return (
                    <span
                      key={key}
                      ref={(el) => {
                        if (el) slotRefs.current.set(key, el);
                        else slotRefs.current.delete(key);
                      }}
                      className={`inline-grid place-items-center text-5xl leading-none font-extrabold tracking-tight sm:text-7xl ${
                        tint
                          ? `${LETTER_FILL[tint]} motion-safe:animate-letter-slot-in`
                          : "puzzle-letter-outline"
                      }`}
                    >
                      {tint ? (
                        char
                      ) : (
                        <>
                          <span className="puzzle-letter-outline__stroke" aria-hidden>
                            {char}
                          </span>
                          <span className="puzzle-letter-outline__fill">{char}</span>
                        </>
                      )}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={restartPuzzle}
            className={`pointer-events-auto inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 border-zinc-300 bg-white px-5 text-sm font-bold text-zinc-800 shadow-sm transition-[transform,background-color,border-color,box-shadow] motion-safe:hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-zinc-50 hover:shadow-md active:translate-y-0 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-400 dark:hover:bg-zinc-800 ${FOCUS}`}
          >
            <RotateCcw aria-hidden className="size-4 shrink-0" />
            Restart puzzle
          </button>
        </div>

        <div ref={floorRef} aria-hidden className="pointer-events-none h-44 sm:h-56" />
      </div>
    </section>
  );
}
