"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import FrostGlass from "@/components/frost-glass";
import LearnerStrip from "@/components/learner-strip";
import { SITE_HEADER_CLASS } from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import SiteLogo from "@/components/site-logo";
import SiteNav from "@/components/site-nav";
import { useMessages } from "@/i18n/locale-context";
import type { Teacher } from "@/data/teachers";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, Check, Clock, Crown, Flag, Lock, Play, Star, Swords, X } from "lucide-react";
import {
  type IslandBox,
  type PathUnit,
  type RoadmapNode,
  earnedXp,
  nodePoint,
  roadmapHeight,
  smoothPath,
  unitAt,
  unitChipY,
  unitIsland,
  videoNumberAt,
} from "@/components/roadmap/roadmap-data";

const TRAIL_GRADIENT_ID = "roadmap-trail-done";
const ISLAND_DOTS_ID = "roadmap-island-dots";
const CONFETTI_COLORS = ["#f6c445", "#22c55e", "#fb923c", "#fef9c3", "#4ade80"];
// Scenery needs the island margin beside the lane, which only opens up on wide columns.
const SCENERY_MIN_WIDTH = 960;
const SCENERY_MIN_MARGIN = 80;

const ISLAND_TINTS = [
  {
    top: "fill-emerald-100 dark:fill-slate-800",
    rim: "stroke-emerald-300 dark:stroke-emerald-700",
    wall: "fill-emerald-300 dark:fill-emerald-900",
    base: "fill-emerald-500 dark:fill-emerald-950",
    ribbon: "pill-3d-emerald text-white",
  },
  {
    top: "fill-amber-100 dark:fill-slate-800",
    rim: "stroke-amber-300 dark:stroke-amber-700",
    wall: "fill-amber-300 dark:fill-amber-900",
    base: "fill-amber-500 dark:fill-amber-950",
    ribbon: "pill-3d-amber text-amber-950",
  },
  {
    top: "fill-sky-100 dark:fill-slate-800",
    rim: "stroke-sky-300 dark:stroke-sky-700",
    wall: "fill-sky-300 dark:fill-sky-900",
    base: "fill-sky-500 dark:fill-sky-950",
    ribbon: "pill-3d-sky text-sky-950",
  },
] as const;

type SceneryKind = "tree" | "bush" | "rock";
const SCENERY_KINDS: readonly SceneryKind[] = ["tree", "bush", "rock"];

function LessonLine({ text }: { text: string }) {
  return (
    <p className="truncate text-xs font-medium text-amber-800 dark:text-amber-200">{text}</p>
  );
}

type RoadmapViewProps = {
  teacher?: Teacher;
};

export default function RoadmapView({ teacher }: RoadmapViewProps) {
  const copy = useMessages();
  const nodes = teacher?.nodes ?? [];
  const units = teacher?.units ?? [];
  const columnRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLLIElement>(null);
  const scrolledRef = useRef(false);
  const [width, setWidth] = useState(320);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const lockTipId = useId();
  const [lockedTip, setLockedTip] = useState<LockTip | null>(null);
  const reduce = useReducedMotion() === true;

  const completed = nodes.filter((node) => node.status === "completed");
  const xpEarned = teacher ? earnedXp(nodes) : undefined;
  const current = nodes.find((node) => node.status === "current");
  const lesson = current ? copy.path.now(current.title) : copy.path.learning;
  const lessonLine = teacher ? `${teacher.label} · ${lesson}` : lesson;
  const progress = nodes.length === 0 ? 0 : Math.round((completed.length / nodes.length) * 100);
  const height = roadmapHeight(nodes.length, width);
  const points = nodes.map((_, index) => nodePoint(index, nodes.length, width));
  const currentIndex = nodes.findIndex((node) => node.status === "current");
  const lastCompleted = nodes.reduce(
    (end, node, index) => (node.status === "completed" ? index : end),
    -1,
  );
  const trailEnd = currentIndex >= 0 ? currentIndex : lastCompleted;
  const fullPath = smoothPath(points);
  const donePath = trailEnd >= 0 ? smoothPath(points.slice(0, trailEnd + 1)) : "";
  const selectedIndex = nodes.findIndex((node) => node.id === selectedId);
  const selected = selectedIndex >= 0 ? nodes[selectedIndex] : null;
  const islands = units
    .map((_, unitIndex) => unitIsland(unitIndex, nodes.length, width))
    .filter((box): box is IslandBox => box !== null);
  const scenic = width >= SCENERY_MIN_WIDTH;

  useLayoutEffect(() => {
    const column = columnRef.current;
    if (!column) return;
    const measure = () => setWidth(Math.max(1, column.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(column);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (scrolledRef.current) return;
    const active = activeRef.current;
    if (!active) return;
    const frame = window.requestAnimationFrame(() => {
      scrolledRef.current = true;
      active.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "center",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [reduce, width]);

  useEffect(() => {
    if (!lockedTip) return;
    const timer = window.setTimeout(() => setLockedTip(null), 2200);
    return () => window.clearTimeout(timer);
  }, [lockedTip]);

  return (
    <div className="relative flex min-h-dvh flex-col bg-linear-to-b from-cream to-white font-sans text-zinc-900 dark:from-slate-950 dark:to-slate-950 dark:text-zinc-50">
      <LearnerStrip xp={xpEarned} tone="cream" />
      <header className={SITE_HEADER_CLASS}>
        <div className="mx-auto flex w-full max-w-page flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="order-1 shrink-0">
            <SiteLogo />
          </h1>
          <div className="order-2 ml-auto shrink-0 md:order-3 md:ml-0">
            <SiteNav layout="cluster" />
          </div>
          <div className="order-3 min-w-0 basis-full md:order-2 md:flex-1 md:basis-auto">
            <LessonLine text={lessonLine} />
          </div>
        </div>
        {teacher ? (
          <div className="mx-auto mt-3 flex w-full max-w-page items-center gap-3">
            <div className="relative min-w-0 flex-1">
              <div
                className="progress-track-3d h-5 overflow-hidden rounded-full p-0.5"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={nodes.length}
                aria-valuenow={completed.length}
                aria-label={copy.path.lessonsCompleted}
              >
                {progress > 0 ? (
                  <div
                    className="progress-fill-3d h-full rounded-full transition-[width] duration-700 ease-out motion-safe:animate-progress-stripes"
                    style={{ width: `max(${progress}%, 1rem)` }}
                  />
                ) : null}
              </div>
              <span
                aria-hidden
                className="pointer-events-none absolute top-1/2 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-linear-to-b from-white to-amber-100 shadow-[0_3px_0_var(--color-amber-500),0_6px_10px_-4px_rgb(180_83_9/0.6)] ring-2 ring-amber-400 transition-[left] duration-700 ease-out dark:from-slate-700 dark:to-slate-800"
                style={{ left: `clamp(0.875rem, ${progress}%, 100% - 0.875rem)` }}
              >
                <span className="size-3 rounded-full bg-linear-to-b from-amber-300 to-amber-500 shadow-[inset_0_1px_0_rgb(255_255_255/0.7)] motion-safe:animate-pulse" />
              </span>
            </div>
            <p className="stat-chip-3d pill-3d-amber shrink-0 rounded-full px-3 py-1 text-[11px] font-black text-amber-950 tabular-nums">
              {copy.path.complete(completed.length, nodes.length)}
            </p>
          </div>
        ) : null}
      </header>

      <main className="relative z-10 flex-1 bg-linear-to-b from-sky-100/80 via-sky-50/60 to-cream px-4 pt-6 pb-24 sm:pb-32 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        {teacher ? (
        <div ref={columnRef} className="relative mx-auto w-full max-w-page">
          <div className="relative" style={{ height }}>
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox={`0 0 ${width} ${height}`}
              role="presentation"
            >
              <defs>
                <linearGradient
                  id={TRAIL_GRADIENT_ID}
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  x2="0"
                  y1={points[0]?.y ?? 0}
                  y2={trailEnd >= 0 ? points[trailEnd].y : height}
                >
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#6ee7b7" />
                </linearGradient>
                <pattern id={ISLAND_DOTS_ID} width="22" height="22" patternUnits="userSpaceOnUse">
                  <circle cx="4" cy="4" r="1.6" className="fill-white/70 dark:fill-white/5" />
                </pattern>
              </defs>
              {islands.map((box, unitIndex) => (
                <Island key={unitIndex} box={box} tint={ISLAND_TINTS[unitIndex % ISLAND_TINTS.length]} />
              ))}
              {scenic
                ? islands.map((box, unitIndex) =>
                    box.margin >= SCENERY_MIN_MARGIN ? (
                      <IslandScenery key={unitIndex} box={box} seed={unitIndex} />
                    ) : null,
                  )
                : null}
              <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path
                  d={fullPath}
                  transform="translate(0 16)"
                  strokeWidth={36}
                  className="stroke-slate-900/10 dark:stroke-black/40"
                />
                <path d={fullPath} transform="translate(0 10)" strokeWidth={36} className="stroke-stone-400 dark:stroke-slate-950" />
                <path d={fullPath} transform="translate(0 5)" strokeWidth={36} className="stroke-stone-300 dark:stroke-slate-900" />
                <path d={fullPath} strokeWidth={36} className="stroke-white dark:stroke-slate-600" />
                <path d={fullPath} strokeWidth={26} className="stroke-stone-200 dark:stroke-slate-700" />
                <path
                  d={fullPath}
                  strokeWidth={5}
                  strokeDasharray="0.1 18"
                  className="stroke-stone-400 dark:stroke-slate-500"
                />
                {donePath ? (
                  <>
                    <path d={donePath} transform="translate(0 10)" strokeWidth={36} className="stroke-emerald-800" />
                    <path d={donePath} transform="translate(0 5)" strokeWidth={36} className="stroke-emerald-700" />
                    <path d={donePath} strokeWidth={36} className="stroke-emerald-50 dark:stroke-emerald-200" />
                    <path d={donePath} strokeWidth={26} stroke={`url(#${TRAIL_GRADIENT_ID})`} />
                    <path
                      d={donePath}
                      strokeWidth={5}
                      strokeDasharray="10 14"
                      className="stroke-white motion-safe:animate-trail-flow"
                    />
                  </>
                ) : null}
              </g>
            </svg>

            <ol className="absolute inset-0 list-none" aria-label={copy.path.roadmap}>
              {units.map((unit, unitIndex) => (
                <li
                  key={`${unit.title}-${unitIndex}`}
                  className="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ top: unitChipY(unitIndex + 1, nodes.length, width) }}
                >
                  <p
                    className={`pill-3d ${ISLAND_TINTS[unitIndex % ISLAND_TINTS.length].ribbon} flex items-center gap-2 rounded-full py-1 pr-4 pl-1 text-xs font-black tracking-wide whitespace-nowrap md:text-sm`}
                  >
                    <span className="grid size-6 place-items-center rounded-full bg-white text-amber-600 shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)] md:size-7">
                      <Flag className="size-3.5 fill-current md:size-4" aria-hidden />
                    </span>
                    {copy.path.unit(unitIndex + 1, unit.title)}
                  </p>
                </li>
              ))}
              {nodes.map((node, index) => (
                <LessonNode
                  key={node.id}
                  node={node}
                  point={points[index]}
                  reduce={reduce}
                  tipOpen={lockedTip?.id === node.id}
                  tipId={lockTipId}
                  activeRef={node.status === "current" ? activeRef : undefined}
                  onLocked={(id, rect) => setLockedTip({ id, nonce: Date.now(), ...placeLockTip(rect) })}
                  onOpen={(next) => setSelectedId(next.id)}
                />
              ))}
            </ol>
          </div>
        </div>
        ) : (
          <div className="mx-auto flex w-full max-w-page flex-col items-start gap-4 py-16">
            <h2 className="text-2xl font-bold tracking-tight">{copy.path.pick}</h2>
            <p className="max-w-md text-sm font-medium text-zinc-600 dark:text-zinc-300">
              {copy.path.pickBody}
            </p>
            <Link
              href="/teachers"
              className="group relative inline-flex min-h-11 items-center gap-2 overflow-hidden rounded-xl px-4 text-sm font-bold text-white transition-[translate,box-shadow,overflow] motion-safe:hover:-translate-y-0.5 motion-safe:hover:overflow-visible cta-3d cta-3d-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            >
              <FrostGlass />
              <span className="relative z-10">{copy.seeTeachers}</span>
              <ArrowRight aria-hidden className="relative z-10 size-4" />
            </Link>
          </div>
        )}
      </main>

      <SiteFooter />

      {lockedTip ? (
        <p
          id={lockTipId}
          role="tooltip"
          className="pointer-events-none fixed z-50 w-44 rounded-2xl bg-zinc-900 px-3 py-2 text-center text-xs font-semibold leading-snug text-white shadow-lg"
          style={{
            left: lockedTip.x,
            top: lockedTip.y,
            transform: lockedTip.above ? "translate(-50%, -100%)" : "translate(-50%, 0)",
          }}
        >
          {copy.path.lockedTip}
          <span
            className={
              lockedTip.above
                ? "absolute top-full left-1/2 -translate-x-1/2 border-x-[6px] border-t-[7px] border-x-transparent border-t-zinc-900"
                : "absolute bottom-full left-1/2 -translate-x-1/2 border-x-[6px] border-b-[7px] border-x-transparent border-b-zinc-900"
            }
          />
        </p>
      ) : null}

      <AnimatePresence>
        {selected ? (
          <LessonDialog
            key={selected.id}
            node={selected}
            index={selectedIndex}
            nodes={nodes}
            units={units}
            onClose={() => setSelectedId(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function LessonNode({
  node,
  point,
  reduce,
  tipOpen,
  tipId,
  activeRef,
  onLocked,
  onOpen,
}: {
  node: RoadmapNode;
  point: { x: number; y: number };
  reduce: boolean;
  tipOpen: boolean;
  tipId: string;
  activeRef?: React.RefObject<HTMLLIElement | null>;
  onLocked: (id: string, rect: DOMRect) => void;
  onOpen: (node: RoadmapNode) => void;
}) {
  const copy = useMessages();
  const controls = useAnimation();
  const unlocked = node.status !== "locked";
  const statusLabel =
    node.status === "completed"
      ? copy.path.completed
      : node.status === "current"
        ? copy.path.current
        : copy.path.locked;
  const isBoss = node.kind === "boss";

  useEffect(() => {
    if (node.status !== "current" || reduce) return;
    void controls.start({
      y: [0, -8, 0],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
    });
  }, [controls, node.status, reduce]);

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (!unlocked) {
      onLocked(node.id, event.currentTarget.getBoundingClientRect());
      if (!reduce) {
        await controls.start({
          x: [0, -12, 11, -9, 7, -3, 0],
          transition: { duration: 0.45 },
        });
      }
      return;
    }

    if (isBoss) {
      void burstAt(event.clientX, event.clientY);
    }

    if (node.status === "completed" && !reduce) {
      void controls.start({
        y: [0, 5, -9, 0],
        transition: { duration: 0.4 },
      });
    }

    onOpen(node);
  }

  return (
    <li
      ref={activeRef}
      className="absolute z-20"
      style={{ left: point.x, top: point.y }}
      data-node-id={node.id}
      data-status={node.status}
      data-kind={node.kind}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        {node.status === "current" ? <HereBadge reduce={reduce} /> : null}
        <motion.div animate={controls} className="relative">
          <motion.button
            type="button"
            className={faceClass(node)}
            aria-label={copy.path.nodeName(node.title, statusLabel, node.xp)}
            aria-current={node.status === "current" ? "step" : undefined}
            aria-disabled={!unlocked}
            aria-describedby={tipOpen ? tipId : undefined}
            whileTap={unlocked && !reduce ? { scale: 0.94 } : undefined}
            onClick={handleClick}
          >
            {node.status === "current" && !reduce ? (
              <motion.span
                className="pointer-events-none absolute -inset-3.5 rounded-full border-4 border-amber-300"
                animate={{ scale: [1, 1.12, 1], opacity: [0.9, 0.2, 0.9] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              />
            ) : null}
            <span
              className="pointer-events-none absolute inset-x-[26%] top-[9%] h-[24%] rounded-[50%] bg-linear-to-b from-white/55 to-white/0"
              aria-hidden
            />
            <NodeGlyph node={node} />
            {isBoss ? (
              <span className="absolute -top-2 -right-2 grid size-8 place-items-center rounded-full bg-linear-to-b from-amber-200 to-amber-400 text-amber-950 shadow-[inset_0_1.5px_0_rgba(255,255,255,0.7),0_3px_0_0_#b45309] ring-2 ring-white dark:ring-slate-900">
                <Crown className="size-4" aria-hidden />
              </span>
            ) : null}
          </motion.button>
          <p className="pointer-events-none absolute top-[calc(100%+1.4rem)] left-1/2 z-10 w-max max-w-40 -translate-x-1/2 text-center">
            <span
              className={`inline-block rounded-xl bg-white px-2 py-0.5 text-xs leading-tight font-extrabold shadow-[0_3px_0_0_#d6d3d1,0_6px_10px_-4px_rgba(0,0,0,0.25)] ring-1 ring-zinc-900/5 md:text-sm dark:bg-slate-800 dark:shadow-[0_3px_0_0_#020617] dark:ring-white/10 ${
                node.status === "locked" ? "text-zinc-600 dark:text-zinc-300" : "text-zinc-950 dark:text-zinc-50"
              }`}
            >
              {node.title}
            </span>
            <span className="mx-auto mt-1.5 block w-max rounded-full bg-amber-100 px-2 text-[11px] leading-5 font-black text-amber-800 ring-1 ring-amber-300/70 md:text-xs dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-700/60">
              {node.xp} XP
            </span>
          </p>
        </motion.div>
      </div>
    </li>
  );
}

function LessonDialog({
  node,
  index,
  nodes,
  units,
  onClose,
}: {
  node: RoadmapNode;
  index: number;
  nodes: readonly RoadmapNode[];
  units: readonly PathUnit[];
  onClose: () => void;
}) {
  const copy = useMessages();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const detailId = useId();
  const [started, setStarted] = useState(false);
  const unit = unitAt(index, units);
  const eyebrow =
    node.kind === "boss"
      ? copy.path.bossUnit(unit.number)
      : copy.path.videoUnit(videoNumberAt(nodes, index), unit.number);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusable = [...panelRef.current.querySelectorAll<HTMLElement>("button:not(:disabled)")];
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-950/60" />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={detailId}
        tabIndex={-1}
        className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-5 text-zinc-900 shadow-lg outline-hidden dark:bg-slate-900 dark:text-zinc-50"
        initial={{ y: 48, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 28, opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-bold tracking-[0.14em] text-amber-700 uppercase dark:text-amber-300">
            {eyebrow}
          </p>
          <button
            type="button"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-100"
            aria-label={copy.path.close}
            onClick={onClose}
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <h2 id={titleId} className="mt-3 text-2xl font-bold tracking-tight">
          {node.title}
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{unit?.title}</p>
        <div id={detailId} className="mt-4 grid gap-2">
          <p className="flex items-center gap-2 rounded-2xl bg-sky-50 px-3 py-3 text-sm font-semibold text-sky-950 dark:bg-white/5 dark:text-zinc-100">
            {node.kind === "video" ? (
              <Clock className="size-4 shrink-0" aria-hidden />
            ) : (
              <Swords className="size-4 shrink-0" aria-hidden />
            )}
            {node.kind === "video" ? node.duration : node.gameStatus}
          </p>
          <p className="flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-3 text-sm font-semibold text-amber-950 dark:bg-amber-400/10 dark:text-amber-100">
            <Star className="size-4 shrink-0" aria-hidden />
            {copy.path.xpReward(node.xp)}
          </p>
        </div>
        {started ? (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-3 py-3 text-sm font-semibold text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200">
            {copy.path.started}
          </p>
        ) : null}
        <button
          type="button"
          className="group relative mt-4 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-linear-to-b from-emerald-300 to-emerald-600 text-base font-bold text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.5),0_5px_0_0_#166534] transition-[overflow] motion-safe:hover:overflow-visible active:translate-y-1 active:shadow-[inset_0_2px_0_rgba(255,255,255,0.5),0_1px_0_0_#166534]"
          onClick={() => {
            if (started) onClose();
            else setStarted(true);
          }}
        >
          <FrostGlass />
          <span className="relative z-10">{started ? copy.path.close : copy.path.startLesson}</span>
          <ArrowRight aria-hidden className="relative z-10 size-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}

function HereBadge({ reduce }: { reduce: boolean }) {
  const copy = useMessages();

  return (
    <motion.div
      className="pointer-events-none absolute bottom-[calc(100%+1rem)] left-1/2 z-30 flex w-max -translate-x-1/2 flex-col items-center"
      animate={reduce ? undefined : { y: [0, -6, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="46" height="46" viewBox="0 0 46 46" aria-hidden="true" className="drop-shadow-sm">
        <circle cx="23" cy="23" r="21" fill="#f6c445" stroke="#b45309" strokeWidth="2" />
        <circle cx="23" cy="25" r="13" fill="#fff7d6" />
        <circle cx="17.5" cy="23" r="2.1" fill="#1c1917" />
        <circle cx="28.5" cy="23" r="2.1" fill="#1c1917" />
        <path
          d="M17 29c2.2 2.2 9.8 2.2 12 0"
          fill="none"
          stroke="#92400e"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path d="M14 15.5 23 8l9 7.5" fill="#34d399" stroke="#047857" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <span className="relative -mt-1 rounded-full bg-amber-950 px-2.5 py-1 text-[11px] font-bold tracking-wide whitespace-nowrap text-amber-50 shadow-md">
        {copy.path.youAreHere}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-x-[5px] border-t-[6px] border-x-transparent border-t-amber-950" />
      </span>
    </motion.div>
  );
}

function NodeGlyph({ node }: { node: RoadmapNode }) {
  const className =
    node.kind === "boss" ? "relative z-10 size-10 md:size-12" : "relative z-10 size-8 md:size-9";
  const glyphShadow = "drop-shadow-[0_2px_0_rgba(0,0,0,0.18)]";
  if (node.status === "locked") return <Lock className={className} strokeWidth={2.5} aria-hidden />;
  if (node.status === "completed") {
    return <Check className={`${className} ${glyphShadow}`} strokeWidth={3.5} aria-hidden />;
  }
  if (node.kind === "boss") return <Swords className={`${className} ${glyphShadow}`} aria-hidden />;
  return <Play className={`${className} fill-amber-950`} aria-hidden />;
}

/*
 * 3D coin: gradient face, inner shade, white rim, coloured ring, a lip as thick
 * as the ring (spread matches so it reads as one solid edge), then a ground shadow.
 */
function faceClass(node: RoadmapNode): string {
  const size = node.kind === "boss" ? "size-28 md:size-32" : "size-[4.75rem] md:size-[5.5rem]";
  const base = `${size} relative grid place-items-center rounded-full border-0 touch-manipulation outline-hidden select-none focus-visible:outline-2 focus-visible:outline-offset-[10px] focus-visible:outline-sky-700`;
  if (node.status === "completed") {
    return `${base} cursor-pointer bg-linear-to-b from-emerald-300 via-emerald-400 to-emerald-600 text-white shadow-[inset_0_4px_0_rgba(255,255,255,0.5),inset_0_-7px_0_rgba(6,78,59,0.28),0_0_0_4px_#ffffff,0_0_0_7px_#fbbf24,0_9px_0_7px_#b45309,0_22px_18px_4px_rgba(120,53,15,0.28)]`;
  }
  if (node.status === "current") {
    return `${base} cursor-pointer bg-linear-to-b from-amber-200 via-amber-300 to-amber-500 text-amber-950 shadow-[inset_0_4px_0_rgba(255,255,255,0.75),inset_0_-7px_0_rgba(146,64,14,0.25),0_0_0_4px_#ffffff,0_0_0_7px_#fb923c,0_9px_0_7px_#c2410c,0_22px_18px_4px_rgba(154,52,18,0.3),0_0_36px_14px_rgba(251,191,36,0.45)]`;
  }
  return `${base} cursor-not-allowed bg-linear-to-b from-stone-50 via-stone-200 to-stone-300 text-stone-400 shadow-[inset_0_4px_0_rgba(255,255,255,0.9),inset_0_-7px_0_rgba(68,64,60,0.12),0_0_0_4px_#ffffff,0_0_0_7px_#d6d3d1,0_9px_0_7px_#a8a29e,0_20px_16px_3px_rgba(41,37,36,0.18)] dark:from-slate-500 dark:via-slate-600 dark:to-slate-700 dark:text-slate-300 dark:shadow-[inset_0_4px_0_rgba(255,255,255,0.25),inset_0_-7px_0_rgba(0,0,0,0.2),0_0_0_4px_#475569,0_0_0_7px_#334155,0_9px_0_7px_#1e293b,0_20px_16px_3px_rgba(0,0,0,0.45)]`;
}

function Island({ box, tint }: { box: IslandBox; tint: (typeof ISLAND_TINTS)[number] }) {
  const width = box.right - box.left;
  const height = box.bottom - box.top;
  const radius = Math.min(44, width / 6);
  const face = { x: box.left, width, height, rx: radius };

  return (
    <g aria-hidden>
      <rect {...face} y={box.top + box.depth + 14} className="fill-slate-900/10 dark:fill-black/40" />
      <rect {...face} y={box.top + box.depth} className={tint.base} />
      <rect {...face} y={box.top + box.depth / 2} className={tint.wall} />
      <rect {...face} y={box.top} className={tint.top} />
      <rect {...face} y={box.top} fill={`url(#${ISLAND_DOTS_ID})`} />
      <rect
        x={box.left + 1.5}
        y={box.top + 1.5}
        width={width - 3}
        height={height - 3}
        rx={radius - 1.5}
        fill="none"
        strokeWidth={3}
        className={tint.rim}
      />
      <rect
        x={box.left + radius * 0.7}
        y={box.top + 7}
        width={Math.max(0, width - radius * 1.4)}
        height={6}
        rx={3}
        className="fill-white/70 dark:fill-white/10"
      />
    </g>
  );
}

function IslandScenery({ box, seed }: { box: IslandBox; seed: number }) {
  const height = box.bottom - box.top;
  const leftX = box.left + box.margin / 2;
  const rightX = box.right - box.margin / 2;
  const kind = (offset: number) => SCENERY_KINDS[(seed + offset) % SCENERY_KINDS.length];
  const props: { kind: SceneryKind; x: number; y: number }[] = [
    { kind: kind(0), x: leftX, y: box.top + height * 0.34 },
    { kind: kind(1), x: leftX - 6, y: box.top + height * 0.78 },
    { kind: kind(2), x: rightX, y: box.top + height * 0.3 },
    { kind: kind(0), x: rightX + 6, y: box.top + height * 0.74 },
  ];

  return (
    <g aria-hidden>
      {props.map((prop, index) => (
        <SceneryProp key={index} {...prop} />
      ))}
    </g>
  );
}

function SceneryProp({ kind, x, y }: { kind: SceneryKind; x: number; y: number }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      <ellipse cx={0} cy={4} rx={kind === "tree" ? 26 : 24} ry={7} className="fill-slate-900/12 dark:fill-black/40" />
      {kind === "tree" ? (
        <>
          <rect x={-5} y={-24} width={10} height={29} rx={4} className="fill-amber-700 dark:fill-amber-900" />
          <circle cx={0} cy={-40} r={25} className="fill-emerald-600 dark:fill-emerald-800" />
          <circle cx={-3} cy={-45} r={21} className="fill-emerald-400 dark:fill-emerald-600" />
          <circle cx={-10} cy={-54} r={7} className="fill-white/45 dark:fill-white/15" />
        </>
      ) : null}
      {kind === "bush" ? (
        <>
          <circle cx={-15} cy={-8} r={13} className="fill-emerald-600 dark:fill-emerald-800" />
          <circle cx={13} cy={-8} r={12} className="fill-emerald-600 dark:fill-emerald-800" />
          <circle cx={0} cy={-14} r={17} className="fill-emerald-500 dark:fill-emerald-700" />
          <circle cx={-5} cy={-20} r={6} className="fill-white/40 dark:fill-white/15" />
          <circle cx={9} cy={-12} r={3} className="fill-rose-400" />
          <circle cx={-14} cy={-6} r={2.5} className="fill-amber-300" />
        </>
      ) : null}
      {kind === "rock" ? (
        <>
          <path d="M-22 2 L-16 -16 L-2 -24 L14 -18 L22 2 Z" className="fill-stone-400 dark:fill-slate-600" />
          <path d="M-16 -16 L-2 -24 L14 -18 L6 -8 L-10 -8 Z" className="fill-stone-300 dark:fill-slate-500" />
          <path d="M-9 -15 L-2 -20 L5 -17" fill="none" strokeWidth={2.5} strokeLinecap="round" className="stroke-white/60 dark:stroke-white/20" />
        </>
      ) : null}
    </g>
  );
}

type LockTip = {
  id: string;
  nonce: number;
  x: number;
  y: number;
  above: boolean;
};

function placeLockTip(rect: DOMRect): Pick<LockTip, "x" | "y" | "above"> {
  const tipWidth = 176;
  const tipHeight = 72;
  const margin = 12;
  const center = rect.left + rect.width / 2;
  const x = Math.min(
    window.innerWidth - margin - tipWidth / 2,
    Math.max(margin + tipWidth / 2, center),
  );
  // Header includes the account row and the site nav, so the tip clears a taller bar.
  const above = rect.top > tipHeight + margin + 176;
  return {
    x,
    y: above ? rect.top - margin : rect.bottom + margin,
    above,
  };
}

async function burstAt(x: number, y: number) {
  const { default: confetti } = await import("canvas-confetti");
  const origin = {
    x: x / window.innerWidth,
    y: y / window.innerHeight,
  };
  await confetti({
    particleCount: 120,
    spread: 74,
    startVelocity: 46,
    origin,
    colors: CONFETTI_COLORS,
    disableForReducedMotion: true,
  });
}
