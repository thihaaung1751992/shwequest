"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

const DURATION_MS = 1300;
/** Share of the scope that must be visible before the count starts. */
const START_THRESHOLD = 0.35;

/** Eased 0–1. Starts at 1 so server HTML and no-JS show the real numbers. */
const ProgressContext = createContext(1);

type Phase = "idle" | "run" | "done";

/**
 * Counts every <CountUp> inside from 0 each time the scope scrolls into view,
 * and resets when it leaves. Exposes `data-count="idle|run|done"` for CSS.
 * Reduced motion keeps the final values.
 */
export function CountUpScope({
  delayMs = 0,
  className,
  children,
}: {
  delayMs?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(1);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let timer = 0;
    const stop = () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        stop();
        setProgress(0);
        if (!entry.isIntersecting) {
          setPhase("idle");
          return;
        }
        setPhase("run");
        timer = window.setTimeout(() => {
          let start = 0;
          const tick = (now: number) => {
            start ||= now;
            const t = Math.min(1, (now - start) / DURATION_MS);
            setProgress(1 - (1 - t) ** 3);
            if (t < 1) raf = requestAnimationFrame(tick);
            else setPhase("done");
          };
          raf = requestAnimationFrame(tick);
        }, delayMs);
      },
      { threshold: START_THRESHOLD },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, [delayMs]);

  return (
    <div ref={ref} data-count={phase} className={className}>
      <ProgressContext.Provider value={progress}>{children}</ProgressContext.Provider>
    </div>
  );
}

/** Screen readers get the final value once, not every frame. */
export function CountUp({
  value,
  format = String,
}: {
  value: number;
  format?: (n: number) => string;
}) {
  const progress = useContext(ProgressContext);
  return (
    <>
      <span aria-hidden>{format(Math.round(value * progress))}</span>
      <span className="sr-only">{format(value)}</span>
    </>
  );
}
