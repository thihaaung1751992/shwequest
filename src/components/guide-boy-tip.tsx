"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import type { MouseEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  notifyGuideBoySpoken,
  resetGuideBoySpoken,
} from "@/components/guide-tip-sync";
import { messages } from "@/i18n/messages";

const APPEAR_DELAY_MS = 3000;
const RISE_MS = 900;
const TYPE_MS = 28;
const BUBBLE_OUT_MS = 280;
const EXIT_MS = 900;

/** Guide tip stays Myanmar-only regardless of UI locale. */
const copy = messages.my.guideBoy;

type Phase =
  | "waiting"
  | "rising"
  | "typing"
  | "done"
  | "hiding-bubble"
  | "exiting"
  | "dismissed";

function graphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    return [
      ...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(
        text,
      ),
    ].map((part) => part.segment);
  }
  return Array.from(text);
}

function Cursor() {
  return (
    <span
      aria-hidden
      className="ml-0.5 inline-block w-[0.55ch] animate-pulse"
    >
      |
    </span>
  );
}

function scrollToPlans(event: MouseEvent<HTMLAnchorElement>, onHome: boolean) {
  if (!onHome) return;
  event.preventDefault();
  const el = document.getElementById("plans");
  if (!el) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({
    block: "start",
    behavior: reduceMotion ? "auto" : "smooth",
  });
  window.history.pushState(null, "", "#plans");
}

export default function GuideBoyTip() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [phase, setPhase] = useState<Phase>("waiting");
  const [typedCount, setTypedCount] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const spokenSent = useRef(false);

  const line1Chars = useMemo(() => graphemes(copy.line1), []);
  const line2Chars = useMemo(() => graphemes(copy.line2), []);
  const totalChars = line1Chars.length + line2Chars.length;

  function markSpoken() {
    if (spokenSent.current) return;
    spokenSent.current = true;
    notifyGuideBoySpoken();
  }

  useEffect(() => {
    resetGuideBoySpoken();
    spokenSent.current = false;
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (phase !== "done") return;
    markSpoken();
  }, [phase]);

  useEffect(() => {
    if (phase !== "waiting") return;
    if (reducedMotion) {
      setPhase("done");
      setTypedCount(totalChars);
      return;
    }
    const timer = window.setTimeout(() => setPhase("rising"), APPEAR_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [phase, reducedMotion, totalChars]);

  useEffect(() => {
    if (phase !== "rising") return;
    const timer = window.setTimeout(() => setPhase("typing"), RISE_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "typing") return;
    if (typedCount >= totalChars) {
      setPhase("done");
      return;
    }
    const timer = window.setTimeout(
      () => setTypedCount((n) => n + 1),
      TYPE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [phase, typedCount, totalChars]);

  useEffect(() => {
    if (phase !== "hiding-bubble") return;
    const timer = window.setTimeout(() => setPhase("exiting"), BUBBLE_OUT_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "exiting") return;
    const timer = window.setTimeout(() => setPhase("dismissed"), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (phase === "waiting" || phase === "dismissed") return null;

  const typing = phase === "typing";
  const line1Visible = line1Chars
    .slice(0, Math.min(typedCount, line1Chars.length))
    .join("");
  const line2Typed = Math.max(0, typedCount - line1Chars.length);
  const line2Visible = line2Chars.slice(0, line2Typed).join("");
  const showLine2 = typedCount > line1Chars.length || phase === "done";
  const risen = phase !== "rising";
  const bubbleVisible =
    risen && phase !== "exiting" && phase !== "hiding-bubble";
  const bubbleLeaving = phase === "hiding-bubble";
  const leaving = phase === "hiding-bubble" || phase === "exiting";

  function dismiss() {
    if (leaving) return;
    markSpoken();
    if (reducedMotion) {
      setPhase("dismissed");
      return;
    }
    setPhase("hiding-bubble");
  }

  const bodyMotion =
    phase === "rising"
      ? "motion-safe:animate-guide-boy-rise"
      : phase === "exiting"
        ? "motion-safe:animate-guide-boy-exit"
        : "";

  return (
    <aside
      className="pointer-events-none fixed bottom-0 left-0 z-40 pl-4 sm:pl-7"
      lang="my"
      aria-label={copy.label}
      aria-hidden={leaving || undefined}
    >
      {/* Motion lives on the body stack so exit can slide under the fold (clipped). */}
      <div className={`flex items-end ${bodyMotion}`}>
        <div className="relative -mb-3 sm:-mb-4">
          <Image
            src="/self-study/boy-with-hand.webp"
            alt=""
            width={467}
            height={1024}
            className="block h-[min(54vh,20.5rem)] w-auto select-none drop-shadow-[0_8px_18px_rgb(0_0_0/0.28)] sm:h-[min(58vh,23.5rem)]"
            sizes="(max-width: 640px) 36vw, 190px"
            priority={false}
          />

          {bubbleVisible || bubbleLeaving ? (
            <div
              className={`pointer-events-auto absolute top-[2%] left-[78%] w-[min(19.5rem,calc(100vw-6rem))] sm:top-[1%] sm:left-[84%] sm:w-[21rem] ${
                bubbleLeaving
                  ? "motion-safe:animate-guide-bubble-out"
                  : "opacity-100 motion-safe:animate-guide-bubble-in"
              }`}
            >
              <div
                className="speech-bubble speech-bubble-left relative px-3.5 py-3 text-sm leading-snug font-semibold text-zinc-900 sm:px-4 sm:py-3.5 sm:text-[0.9375rem] dark:text-zinc-50 [--bubble-bg:var(--color-amber-50)] [--bubble-tail-top:2.35rem] dark:[--bubble-bg:var(--color-slate-900)] sm:[--bubble-tail-top:2.6rem]"
                aria-live="polite"
              >
                <button
                  type="button"
                  onClick={dismiss}
                  aria-label={copy.dismiss}
                  disabled={leaving}
                  className="absolute -top-2 -right-2 flex size-7 cursor-pointer items-center justify-center rounded-full border-2 border-zinc-900 bg-white text-zinc-800 shadow-[2px_2px_0_var(--color-zinc-900)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:pointer-events-none dark:border-zinc-100 dark:bg-slate-800 dark:text-zinc-100 dark:shadow-[2px_2px_0_rgb(255_255_255/0.35)]"
                >
                  <X aria-hidden className="size-3.5" strokeWidth={2.75} />
                </button>

                <div className="flex flex-col gap-1">
                  <p>
                    {line1Visible}
                    {typing && typedCount <= line1Chars.length ? (
                      <Cursor />
                    ) : null}
                  </p>
                  {showLine2 ? (
                    <p>
                      {line2Visible}
                      {typing && typedCount > line1Chars.length ? (
                        <Cursor />
                      ) : null}
                    </p>
                  ) : null}
                </div>

                {phase === "done" ? (
                  <div className="mt-2.5 flex flex-col gap-1.5">
                    <Link
                      href="/teachers"
                      className="inline-block text-sm font-bold text-amber-800 underline underline-offset-2 hover:text-amber-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:text-amber-200 dark:hover:text-amber-100"
                    >
                      {copy.teachersLinkLabel}
                    </Link>
                    <Link
                      href="/#plans"
                      onClick={(event) => scrollToPlans(event, onHome)}
                      className="inline-block text-sm font-bold text-amber-800 underline underline-offset-2 hover:text-amber-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:text-amber-200 dark:hover:text-amber-100"
                    >
                      {copy.pricesLinkLabel}
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
