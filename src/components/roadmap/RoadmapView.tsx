"use client";

import { Suspense, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import LearnerStrip from "@/components/learner-strip";
import { SITE_HEADER_CLASS } from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import SiteLogo from "@/components/site-logo";
import SiteNav from "@/components/site-nav";
import { teacherById } from "@/data/teachers";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useReducedMotion,
} from "framer-motion";
import { Check, Clock, Crown, Lock, Play, Star, Swords, X } from "lucide-react";
import {
  NODES_PER_UNIT,
  ROADMAP_NODES,
  UNITS,
  type RoadmapNode,
  earnedXp,
  nodePoint,
  roadmapHeight,
  smoothPath,
  unitChipY,
  unitIndexFor,
  videoOrdinal,
} from "@/components/roadmap/roadmap-data";

const CONFETTI_COLORS = ["#f6c445", "#22c55e", "#fb923c", "#fef9c3", "#4ade80"];

function LessonLine({ text }: { text: string }) {
  return (
    <p className="truncate text-xs font-medium text-amber-800 dark:text-amber-200">{text}</p>
  );
}

function TeacherQuery({ lesson }: { lesson: string }) {
  const teacherId = useSearchParams().get("teacher");
  const teacher = teacherId ? teacherById(teacherId) : undefined;
  return <LessonLine text={teacher ? `${teacher.label} · ${lesson}` : lesson} />;
}

function PathSubtitle({ lesson }: { lesson: string }) {
  return (
    <Suspense fallback={<LessonLine text={lesson} />}>
      <TeacherQuery lesson={lesson} />
    </Suspense>
  );
}

type RoadmapViewProps = {
  nodes?: RoadmapNode[];
};

export default function RoadmapView({ nodes = ROADMAP_NODES }: RoadmapViewProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLLIElement>(null);
  const scrolledRef = useRef(false);
  const [width, setWidth] = useState(320);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const lockTipId = useId();
  const [lockedTip, setLockedTip] = useState<LockTip | null>(null);
  const reduce = useReducedMotion() === true;

  const completed = nodes.filter((node) => node.status === "completed");
  const xpEarned = earnedXp(nodes);
  const current = nodes.find((node) => node.status === "current");
  const progress = nodes.length === 0 ? 0 : Math.round((completed.length / nodes.length) * 100);
  const height = roadmapHeight(nodes.length);
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
    <div className="relative flex min-h-dvh flex-col bg-white font-sans text-zinc-900 dark:bg-slate-950 dark:text-zinc-50">
      <LearnerStrip xp={xpEarned} tone="paper" />
      <header className={SITE_HEADER_CLASS}>
        <div className="mx-auto flex w-full max-w-page flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="order-1 shrink-0">
            <SiteLogo />
          </h1>
          <div className="order-3 min-w-0 basis-full sm:order-2 sm:flex-1 sm:basis-auto">
            <PathSubtitle lesson={current ? `Now: ${current.title}` : "Learning path"} />
          </div>
          <div className="order-2 w-full sm:order-3 sm:ml-0 sm:w-auto">
            <SiteNav layout="cluster" />
          </div>
        </div>
        <div className="mx-auto mt-3 w-full max-w-page">
          <div
            className="h-2.5 overflow-hidden rounded-full bg-amber-100 ring-1 ring-amber-200 dark:bg-white/10 dark:ring-white/10"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={nodes.length}
            aria-valuenow={completed.length}
            aria-label="Lessons completed"
          >
            <div
              className="h-full rounded-full bg-linear-to-r from-emerald-400 to-amber-400"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-right text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
            {completed.length}/{nodes.length} complete
          </p>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-4 pt-6 pb-10">
        <div ref={columnRef} className="relative mx-auto w-full max-w-page">
          <div className="relative" style={{ height }}>
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox={`0 0 ${width} ${height}`}
              role="presentation"
            >
              <path
                d={fullPath}
                fill="none"
                strokeWidth={22}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-white dark:stroke-slate-950"
              />
              <path
                d={fullPath}
                fill="none"
                strokeWidth={14}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-stone-300 dark:stroke-slate-700"
              />
              <path
                d={donePath}
                fill="none"
                strokeWidth={14}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-emerald-500"
              />
              <path
                d={donePath}
                fill="none"
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-emerald-200"
              />
            </svg>

            <ol className="absolute inset-0 list-none" aria-label="Learning roadmap">
              {UNITS.slice(0, Math.ceil(nodes.length / NODES_PER_UNIT)).map((unit, unitIndex) => (
                <li
                  key={unit.title}
                  className="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ top: unitChipY(unitIndex + 1, nodes.length) }}
                >
                  <p className="rounded-full border border-amber-200 bg-white/90 px-3 py-1 text-center text-xs font-bold tracking-wide text-amber-800 shadow-md dark:border-white/10 dark:bg-slate-900/90 dark:text-amber-200">
                    Unit {unitIndex + 1} · {unit.title}
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
          Complete previous lessons to unlock!
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
  const controls = useAnimation();
  const unlocked = node.status !== "locked";
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
            aria-label={accessibleName(node)}
            aria-current={node.status === "current" ? "step" : undefined}
            aria-disabled={!unlocked}
            aria-describedby={tipOpen ? tipId : undefined}
            whileTap={unlocked && !reduce ? { scale: 0.94 } : undefined}
            onClick={handleClick}
          >
            {node.status === "current" && !reduce ? (
              <motion.span
                className="pointer-events-none absolute -inset-1.5 rounded-full border-4 border-amber-300"
                animate={{ scale: [1, 1.14, 1], opacity: [0.9, 0.25, 0.9] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              />
            ) : null}
            <NodeGlyph node={node} />
            {isBoss ? (
              <span className="absolute -top-1 -right-1 grid size-7 place-items-center rounded-full bg-amber-300 text-amber-950 shadow-md ring-2 ring-white dark:ring-slate-900">
                <Crown className="size-3.5" aria-hidden />
              </span>
            ) : null}
          </motion.button>
          <p className="pointer-events-none absolute top-[calc(100%+0.45rem)] left-1/2 z-10 w-max max-w-40 -translate-x-1/2 text-center">
            <span
              className={
                node.status === "locked"
                  ? "inline-block rounded-lg bg-white px-1.5 py-0.5 text-xs leading-tight font-bold text-zinc-800 ring-1 ring-zinc-900/10"
                  : "inline-block rounded-lg bg-white px-1.5 py-0.5 text-xs leading-tight font-bold text-zinc-950 ring-1 ring-zinc-900/10"
              }
            >
              {node.title}
            </span>
            <span className="mt-0.5 block text-[11px] font-bold text-amber-700 dark:text-amber-300">
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
  onClose,
}: {
  node: RoadmapNode;
  index: number;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const detailId = useId();
  const [started, setStarted] = useState(false);
  const unitNumber = unitIndexFor(index);
  const unit = UNITS[unitNumber];
  const eyebrow =
    node.kind === "boss"
      ? `Boss battle · Unit ${unitNumber + 1}`
      : `Video ${videoOrdinal(index)} · Unit ${unitNumber + 1}`;

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
            aria-label="Close"
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
            {node.xp} XP reward
          </p>
        </div>
        {started ? (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-3 py-3 text-sm font-semibold text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200">
            Lesson started. Your place on the path is saved.
          </p>
        ) : null}
        <button
          type="button"
          className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-linear-to-b from-emerald-300 to-emerald-600 text-base font-bold text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.5),0_5px_0_0_#166534] active:translate-y-1 active:shadow-[inset_0_2px_0_rgba(255,255,255,0.5),0_1px_0_0_#166534]"
          onClick={() => {
            if (started) onClose();
            else setStarted(true);
          }}
        >
          {started ? "Close" : "Start Lesson"}
        </button>
      </motion.div>
    </motion.div>
  );
}

function HereBadge({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute bottom-[calc(100%+0.4rem)] left-1/2 z-30 flex w-max -translate-x-1/2 flex-col items-center"
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
        You are here!
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-x-[5px] border-t-[6px] border-x-transparent border-t-amber-950" />
      </span>
    </motion.div>
  );
}

function NodeGlyph({ node }: { node: RoadmapNode }) {
  const className = node.kind === "boss" ? "relative z-10 size-10" : "relative z-10 size-8";
  if (node.status === "locked") return <Lock className={className} aria-hidden />;
  if (node.status === "completed") return <Check className={className} strokeWidth={3} aria-hidden />;
  if (node.kind === "boss") return <Swords className={className} aria-hidden />;
  return <Play className={`${className} fill-amber-950`} aria-hidden />;
}

function faceClass(node: RoadmapNode): string {
  const size = node.kind === "boss" ? "size-28" : "size-[4.75rem]";
  const base = `${size} relative grid place-items-center rounded-full border-0 touch-manipulation outline-hidden select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700`;
  if (node.status === "completed") {
    return `${base} cursor-pointer bg-linear-to-b from-emerald-300 to-emerald-600 text-white shadow-[inset_0_3px_0_rgba(255,255,255,0.55),0_7px_0_0_#166534,0_0_0_4px_#f6c445]`;
  }
  if (node.status === "current") {
    return `${base} cursor-pointer bg-linear-to-b from-amber-200 to-amber-500 text-amber-950 shadow-[inset_0_3px_0_rgba(255,255,255,0.75),0_7px_0_0_#b45309,0_0_0_4px_#fbbf24,0_0_22px_4px_rgba(251,191,36,0.55)]`;
  }
  return `${base} cursor-not-allowed bg-linear-to-b from-white/75 to-zinc-400/90 text-zinc-500 grayscale shadow-[inset_0_3px_0_rgba(255,255,255,0.9),0_6px_0_0_#9ca3af] backdrop-blur-sm`;
}

function accessibleName(node: RoadmapNode): string {
  const status =
    node.status === "completed" ? "Completed" : node.status === "current" ? "Current lesson" : "Locked";
  return `${node.title}. ${status}. ${node.xp} XP.`;
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
