"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Calculator, Delete, X } from "lucide-react";
import { useMessages } from "@/i18n/locale-context";

export type CalcPlanMonths = 3 | 6 | 12;

type Op = "+" | "-" | "×" | "÷";

const ACCENT: Record<
  CalcPlanMonths,
  {
    eyebrow: string;
    row: string;
    keyOp: string;
    keyEq: string;
    icon: string;
  }
> = {
  3: {
    eyebrow: "text-amber-800",
    row: "bg-white/90 text-zinc-800 ring-1 ring-amber-100",
    keyOp: "bg-amber-100 text-amber-900 hover:bg-amber-200",
    keyEq: "bg-amber-700 text-white hover:bg-amber-800",
    icon: "bg-amber-700 text-white",
  },
  6: {
    eyebrow: "text-orange-800",
    row: "bg-white/90 text-zinc-800 ring-1 ring-orange-100",
    keyOp: "bg-orange-100 text-orange-900 hover:bg-orange-200",
    keyEq: "bg-orange-700 text-white hover:bg-orange-800",
    icon: "bg-orange-700 text-white",
  },
  12: {
    eyebrow: "text-emerald-800",
    row: "bg-white/90 text-zinc-800 ring-1 ring-emerald-100",
    keyOp: "bg-emerald-100 text-emerald-900 hover:bg-emerald-200",
    keyEq: "bg-emerald-700 text-white hover:bg-emerald-800",
    icon: "bg-emerald-700 text-white",
  },
};

const KEY =
  "grid min-h-10 cursor-pointer place-items-center rounded-xl text-sm font-bold transition-[transform,background-color] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

function applyOp(left: number, right: number, op: Op): number {
  switch (op) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "×":
      return left * right;
    case "÷":
      return right === 0 ? NaN : left / right;
  }
}

function formatPad(value: string): string {
  if (value === "Error") return value;
  if (value === "" || value === "-") return value || "0";
  const neg = value.startsWith("-");
  const raw = neg ? value.slice(1) : value;
  const [whole = "0", frac] = raw.split(".");
  const grouped = Number(whole).toLocaleString("en-US");
  const body = frac !== undefined ? `${grouped}.${frac}` : grouped;
  return neg ? `-${body}` : body;
}

type PlanCalculatorProps = {
  months: CalcPlanMonths;
  shellClassName: string;
  active: boolean;
  onClose: () => void;
};

/** Pad UI for the back face of a pricing card (no modal). Click or keyboard. */
export default function PlanCalculator({
  months,
  shellClassName,
  active,
  onClose,
}: PlanCalculatorProps) {
  const copy = useMessages();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const hintId = useId();
  const accent = ACCENT[months];
  const lengthLabel = copy.pricing.months(months);

  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [op, setOp] = useState<Op | null>(null);
  const [fresh, setFresh] = useState(true);

  const calcRef = useRef({ display, stored, op, fresh });
  calcRef.current = { display, stored, op, fresh };

  const clearAll = useCallback(() => {
    calcRef.current = { display: "0", stored: null, op: null, fresh: true };
    setDisplay("0");
    setStored(null);
    setOp(null);
    setFresh(true);
  }, []);

  const inputDigit = useCallback((digit: string) => {
    const { display: prev, fresh: isFresh, stored, op: curOp } = calcRef.current;
    const next =
      prev === "Error" || isFresh || prev === "0"
        ? digit
        : prev.replace("-", "").replace(".", "").length >= 12
          ? prev
          : prev + digit;
    calcRef.current = { display: next, stored, op: curOp, fresh: false };
    setDisplay(next);
    setFresh(false);
  }, []);

  const inputDot = useCallback(() => {
    const { display: prev, fresh: isFresh, stored, op: curOp } = calcRef.current;
    const next =
      prev === "Error" || isFresh ? "0." : prev.includes(".") ? prev : `${prev}.`;
    calcRef.current = { display: next, stored, op: curOp, fresh: false };
    setDisplay(next);
    setFresh(false);
  }, []);

  const backspace = useCallback(() => {
    const { display: prev, fresh: isFresh, stored, op: curOp } = calcRef.current;
    if (prev === "Error" || isFresh) {
      calcRef.current = { display: "0", stored, op: curOp, fresh: true };
      setDisplay("0");
      setFresh(true);
      return;
    }
    if (prev.length <= 1 || (prev.length === 2 && prev.startsWith("-"))) {
      calcRef.current = { display: "0", stored, op: curOp, fresh: true };
      setDisplay("0");
      setFresh(true);
      return;
    }
    const next = prev.slice(0, -1);
    calcRef.current = { display: next, stored, op: curOp, fresh: false };
    setDisplay(next);
  }, []);

  const chooseOp = useCallback(
    (next: Op) => {
      const { display: currentDisplay, stored: prevStored, op: prevOp, fresh: wasFresh } =
        calcRef.current;
      const current = Number(currentDisplay);
      if (currentDisplay === "Error" || Number.isNaN(current)) {
        clearAll();
        return;
      }
      if (prevStored !== null && prevOp && !wasFresh) {
        const result = applyOp(prevStored, current, prevOp);
        if (!Number.isFinite(result)) {
          calcRef.current = { display: "Error", stored: null, op: null, fresh: true };
          setDisplay("Error");
          setStored(null);
          setOp(null);
          setFresh(true);
          return;
        }
        const text = String(Number(result.toPrecision(12)));
        calcRef.current = { display: text, stored: result, op: next, fresh: true };
        setDisplay(text);
        setStored(result);
        setOp(next);
        setFresh(true);
        return;
      }
      calcRef.current = {
        display: currentDisplay,
        stored: current,
        op: next,
        fresh: true,
      };
      setStored(current);
      setOp(next);
      setFresh(true);
    },
    [clearAll],
  );

  const equals = useCallback(() => {
    const { display: currentDisplay, stored: prevStored, op: prevOp } = calcRef.current;
    if (prevStored === null || !prevOp || currentDisplay === "Error") return;
    const current = Number(currentDisplay);
    if (Number.isNaN(current)) {
      calcRef.current = { display: "Error", stored: null, op: null, fresh: true };
      setDisplay("Error");
      setStored(null);
      setOp(null);
      setFresh(true);
      return;
    }
    const result = applyOp(prevStored, current, prevOp);
    if (!Number.isFinite(result)) {
      calcRef.current = { display: "Error", stored: null, op: null, fresh: true };
      setDisplay("Error");
      setStored(null);
      setOp(null);
      setFresh(true);
      return;
    }
    const text = String(Number(result.toPrecision(12)));
    calcRef.current = { display: text, stored: null, op: null, fresh: true };
    setDisplay(text);
    setStored(null);
    setOp(null);
    setFresh(true);
  }, []);

  useEffect(() => {
    if (!active) return;
    panelRef.current?.focus();

    function handleKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const { key } = event;

      if (key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (key >= "0" && key <= "9") {
        event.preventDefault();
        inputDigit(key);
        return;
      }
      if (key === "." || key === ",") {
        event.preventDefault();
        inputDot();
        return;
      }
      if (key === "Backspace") {
        event.preventDefault();
        backspace();
        return;
      }
      if (key === "Delete" || key === "c" || key === "C") {
        event.preventDefault();
        clearAll();
        return;
      }
      if (key === "Enter" || key === "=") {
        event.preventDefault();
        equals();
        return;
      }
      if (key === "+") {
        event.preventDefault();
        chooseOp("+");
        return;
      }
      if (key === "-") {
        event.preventDefault();
        chooseOp("-");
        return;
      }
      if (key === "*" || key === "x" || key === "X") {
        event.preventDefault();
        chooseOp("×");
        return;
      }
      if (key === "/") {
        event.preventDefault();
        chooseOp("÷");
        return;
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active, onClose, inputDigit, inputDot, backspace, clearAll, chooseOp, equals]);

  return (
    <div
      ref={panelRef}
      role="region"
      aria-labelledby={titleId}
      aria-describedby={hintId}
      tabIndex={-1}
      className={`flex h-full flex-col overflow-y-auto rounded-[1.75rem] border-2 border-b-8 px-4 pt-4 pb-5 outline-hidden ${shellClassName}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p
            className={`flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] uppercase ${accent.eyebrow}`}
          >
            <span
              className={`grid size-7 place-items-center rounded-full ${accent.icon}`}
              aria-hidden
            >
              <Calculator className="size-3.5" />
            </span>
            {copy.calc.title}
          </p>
          <h2
            id={titleId}
            className="mt-2 text-lg leading-none font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50"
          >
            {lengthLabel}
          </h2>
        </div>
        <button
          type="button"
          className={`grid size-9 shrink-0 cursor-pointer place-items-center rounded-full bg-white text-zinc-600 shadow-md ring-1 ring-black/5 ${FOCUS}`}
          aria-label={copy.calc.flipBack}
          onClick={onClose}
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>

      <div className="mt-3 grid flex-1 content-start gap-2.5">
        <div className={`rounded-2xl px-3 py-3 ${accent.row}`}>
          <p className="min-h-4 text-[10px] font-bold tracking-[0.12em] text-zinc-400 uppercase">
            {op && stored !== null ? `${formatPad(String(stored))} ${op}` : copy.calc.ready}
          </p>
          <p
            className="mt-1 truncate text-right text-2xl leading-none font-extrabold tracking-tight text-zinc-950 tabular-nums dark:text-zinc-50"
            aria-live="polite"
          >
            {formatPad(display)}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          <button
            type="button"
            className={`${KEY} bg-zinc-200 text-zinc-800 hover:bg-zinc-300`}
            onClick={clearAll}
          >
            C
          </button>
          <button
            type="button"
            className={`${KEY} bg-zinc-200 text-zinc-800 hover:bg-zinc-300`}
            aria-label={copy.calc.backspace}
            onClick={backspace}
          >
            <Delete className="size-3.5" aria-hidden />
          </button>
          <button type="button" className={`${KEY} ${accent.keyOp}`} onClick={() => chooseOp("÷")}>
            ÷
          </button>
          <button type="button" className={`${KEY} ${accent.keyOp}`} onClick={() => chooseOp("×")}>
            ×
          </button>

          {(["7", "8", "9"] as const).map((d) => (
            <button
              key={d}
              type="button"
              className={`${KEY} bg-white text-zinc-900 ring-1 ring-black/5 hover:bg-white/80`}
              onClick={() => inputDigit(d)}
            >
              {d}
            </button>
          ))}
          <button type="button" className={`${KEY} ${accent.keyOp}`} onClick={() => chooseOp("-")}>
            −
          </button>

          {(["4", "5", "6"] as const).map((d) => (
            <button
              key={d}
              type="button"
              className={`${KEY} bg-white text-zinc-900 ring-1 ring-black/5 hover:bg-white/80`}
              onClick={() => inputDigit(d)}
            >
              {d}
            </button>
          ))}
          <button type="button" className={`${KEY} ${accent.keyOp}`} onClick={() => chooseOp("+")}>
            +
          </button>

          {(["1", "2", "3"] as const).map((d) => (
            <button
              key={d}
              type="button"
              className={`${KEY} bg-white text-zinc-900 ring-1 ring-black/5 hover:bg-white/80`}
              onClick={() => inputDigit(d)}
            >
              {d}
            </button>
          ))}
          <button type="button" className={`${KEY} row-span-2 ${accent.keyEq}`} onClick={equals}>
            =
          </button>

          <button
            type="button"
            className={`${KEY} col-span-2 bg-white text-zinc-900 ring-1 ring-black/5 hover:bg-white/80`}
            onClick={() => inputDigit("0")}
          >
            0
          </button>
          <button
            type="button"
            className={`${KEY} bg-white text-zinc-900 ring-1 ring-black/5 hover:bg-white/80`}
            onClick={inputDot}
          >
            .
          </button>
        </div>
        <p id={hintId} className="text-center text-[10px] leading-snug font-medium text-zinc-500">
          Keyboard: 0–9 · + − * / · Enter · Backspace · Esc
        </p>
      </div>
    </div>
  );
}
