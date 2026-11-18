"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Languages, Play, Square, Volume2 } from "lucide-react";
import { ACCENT_STYLES } from "@/components/teachers/teacher-accent";
import { useMessages } from "@/i18n/locale-context";
import type {
  FreeLesson,
  FreeLessonDialogSpeaker,
  FreeLessonDialogTurn,
} from "@/data/self-study";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

const DIALOG_AVATAR = {
  mike: {
    src: "/self-study/boy-see-right.webp",
  },
  sarah: {
    src: "/self-study/girl-see-left.webp",
  },
} as const;

const MALE_VOICE =
  /\b(male|david|daniel|mark|alex|fred|tom|guy|james|george|ravi|aaron|arthur|oliver|thomas|gordon)\b|google uk english male|microsoft.*(david|mark|guy|andrew|brian|christopher)/i;
const FEMALE_VOICE =
  /\b(female|zira|susan|samantha|karen|victoria|moira|fiona|tessa|veena|siri|hazel|kate|martha|kathy|allison|ava|emma|jenny|aria|sonia)\b|google uk english female|microsoft.*(zira|susan|aria|jenny|sara|michelle)/i;
const NOVELTY_VOICE =
  /bad news|bahh|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|zarvox|bells|pipe|albert|wobble|princess|ralph|junior|hysterical|compact/i;
const QUALITY_VOICE =
  /google|microsoft.*(natural|online|neural)|enhanced|premium|neural|natural|siri/i;
/** Familiar system voices that usually read clearer than obscure defaults. */
const CLEAR_KNOWN =
  /\b(samantha|daniel|karen|moira|alex|victoria|fiona|tessa|zoe|susan|david|zira|oliver|google us english|google uk english)\b/i;

/** Slower + steadier reads clearer than default browser TTS. */
const SPEAK_RATE = 0.88;
const SPEAK_GAP_MS = 320;
/** Fallback wait when `scrollend` is missing — keep short so speech isn’t delayed long. */
const SCROLL_SETTLE_MS = 420;

/** Highlight teaching word any / anyone / anywhere / anytime in dialog lines. */
const ANY_WORD = /\bany(?:one|where|time)?\b/gi;

function highlightAnyWords(text: string) {
  const parts: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  ANY_WORD.lastIndex = 0;
  while ((match = ANY_WORD.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    parts.push(
      <strong
        key={`${match.index}-${match[0]}`}
        className="font-black text-orange-600 dark:text-orange-400"
      >
        {match[0]}
      </strong>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    parts.push(text.slice(last));
  }
  return parts.length > 0 ? parts : text;
}

function englishVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  return window.speechSynthesis
    .getVoices()
    .filter(
      (voice) =>
        /^en([-_]|$)/i.test(voice.lang) && !NOVELTY_VOICE.test(voice.name),
    );
}

function voiceQualityScore(
  voice: SpeechSynthesisVoice,
  gender: "male" | "female",
): number {
  const name = voice.name;
  let score = 0;
  if (QUALITY_VOICE.test(name)) score += 50;
  if (CLEAR_KNOWN.test(name)) score += 22;
  if (!voice.localService && /google/i.test(name)) score += 20;
  if (voice.localService && /enhanced|premium|neural|natural/i.test(name)) {
    score += 25;
  }
  if (/^en-US/i.test(voice.lang)) score += 6;
  else if (/^en-GB/i.test(voice.lang)) score += 5;
  else if (/^en-AU/i.test(voice.lang)) score += 4;
  if (gender === "male" && MALE_VOICE.test(name)) score += 30;
  if (gender === "female" && FEMALE_VOICE.test(name)) score += 30;
  if (gender === "male" && FEMALE_VOICE.test(name)) score -= 40;
  if (gender === "female" && MALE_VOICE.test(name)) score -= 40;
  return score;
}

function bestVoice(
  voices: SpeechSynthesisVoice[],
  gender: "male" | "female",
  exclude: SpeechSynthesisVoice | null,
): SpeechSynthesisVoice | null {
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;
  for (const voice of voices) {
    if (voice === exclude) continue;
    const score = voiceQualityScore(voice, gender);
    if (score > bestScore) {
      best = voice;
      bestScore = score;
    }
  }
  return best;
}

function pickDialogVoices(): Record<
  FreeLessonDialogSpeaker,
  SpeechSynthesisVoice | null
> {
  const voices = englishVoices();
  const mike = bestVoice(voices, "male", null);
  const sarah = bestVoice(voices, "female", mike);
  return { mike, sarah };
}

function pause(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/** Scroll a turn to viewport center and wait until motion settles before TTS. */
function scrollTurnToCenter(el: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({
      block: "center",
      inline: "nearest",
      behavior: reduceMotion ? "auto" : "smooth",
    });
    if (reduceMotion) {
      resolve();
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.removeEventListener("scrollend", finish);
      window.clearTimeout(fallback);
      resolve();
    };
    const fallback = window.setTimeout(finish, SCROLL_SETTLE_MS);
    window.addEventListener("scrollend", finish, { once: true });
  });
}

function speakTurn(
  text: string,
  speaker: FreeLessonDialogSpeaker,
  voice: SpeechSynthesisVoice | null,
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voice?.lang ?? "en-US";
    if (voice) utterance.voice = voice;
    utterance.rate = SPEAK_RATE;
    // Keep pitch near natural — big shifts make browser TTS muddier.
    utterance.pitch = speaker === "mike" ? 0.96 : 1.04;
    utterance.volume = 1;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
    // Some Chrome builds stall mid-queue; nudge if paused.
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  });
}

function SectionDialog({ turns }: { turns: FreeLessonDialogTurn[] }) {
  const copy = useMessages();
  const [playing, setPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [supported, setSupported] = useState(false);
  const [showMy, setShowMy] = useState(false);
  const runIdRef = useRef(0);
  const turnRefs = useRef<(HTMLLIElement | null)[]>([]);
  const hasMy = turns.some((turn) => Boolean(turn.textMy));

  useEffect(() => {
    setSupported("speechSynthesis" in window);
  }, []);

  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    const warm = () => {
      void synth.getVoices();
    };
    warm();
    synth.addEventListener("voiceschanged", warm);
    return () => {
      synth.removeEventListener("voiceschanged", warm);
      runIdRef.current += 1;
      synth.cancel();
    };
  }, [supported, turns]);

  const stopDialog = () => {
    runIdRef.current += 1;
    window.speechSynthesis?.cancel();
    setPlaying(false);
    setActiveIndex(null);
  };

  const prepareTurn = async (index: number, runId: number) => {
    setActiveIndex(index);
    const el = turnRefs.current[index];
    if (el) await scrollTurnToCenter(el);
    return runIdRef.current === runId;
  };

  const playDialog = async () => {
    if (!supported || playing) return;
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    window.speechSynthesis.cancel();
    setPlaying(true);
    const voices = pickDialogVoices();
    for (let index = 0; index < turns.length; index += 1) {
      if (runIdRef.current !== runId) return;
      const turn = turns[index];
      if (!(await prepareTurn(index, runId))) return;
      await speakTurn(turn.text, turn.speaker, voices[turn.speaker]);
      if (runIdRef.current !== runId) return;
      if (index < turns.length - 1) {
        await pause(SPEAK_GAP_MS);
      }
    }
    if (runIdRef.current !== runId) return;
    setPlaying(false);
    setActiveIndex(null);
  };

  const playTurnAt = async (index: number) => {
    if (!supported) return;
    if (activeIndex === index) {
      stopDialog();
      return;
    }
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    window.speechSynthesis.cancel();
    setPlaying(false);
    if (!(await prepareTurn(index, runId))) return;
    const voices = pickDialogVoices();
    const turn = turns[index];
    await speakTurn(turn.text, turn.speaker, voices[turn.speaker]);
    if (runIdRef.current !== runId) return;
    setActiveIndex(null);
  };

  return (
    <div className="mt-6 flex min-w-0 flex-col gap-5 sm:mt-8 sm:gap-6">
      <div className="flex min-w-0 flex-wrap items-center gap-2.5 sm:gap-3">
        {supported ? (
          <button
            type="button"
            onClick={playing ? stopDialog : () => void playDialog()}
            aria-pressed={playing}
            className={`cta-3d cta-3d-emerald inline-flex min-h-11 w-fit cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-bold text-white transition-[translate,box-shadow] ${FOCUS}`}
          >
            {playing ? (
              <Square aria-hidden className="size-4 fill-current" />
            ) : (
              <Play aria-hidden className="size-4 fill-current" />
            )}
            {playing ? copy.selfStudy.stopDialog : copy.selfStudy.playDialog}
          </button>
        ) : null}
        {hasMy ? (
          <button
            type="button"
            onClick={() => setShowMy((open) => !open)}
            aria-pressed={showMy}
            className={`cta-3d cta-3d-amber inline-flex min-h-11 w-fit cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-bold text-white transition-[translate,box-shadow] ${FOCUS}`}
          >
            <Languages aria-hidden className="size-4" />
            {showMy
              ? copy.selfStudy.hideTranslation
              : copy.selfStudy.showTranslation}
          </button>
        ) : null}
      </div>
      <ul className="flex min-w-0 flex-col gap-5 sm:gap-6">
        {turns.map((turn, index) => {
          const speaker = DIALOG_AVATAR[turn.speaker];
          const isMike = turn.speaker === "mike";
          const isActive = activeIndex === index;
          return (
            <li
              key={`${turn.speaker}-${index}`}
              ref={(node) => {
                turnRefs.current[index] = node;
              }}
              aria-current={isActive ? "true" : undefined}
              className={`flex min-w-0 items-start gap-3 sm:gap-4 ${
                isMike ? "justify-start pe-9 sm:pe-10" : "justify-end ps-9 sm:ps-10"
              }`}
            >
              {isMike ? (
                <span className="relative h-44 w-24 shrink-0 sm:h-56 sm:w-32">
                  <Image
                    src={speaker.src}
                    alt=""
                    fill
                    sizes="128px"
                    className="object-contain object-bottom"
                  />
                </span>
              ) : null}
              <div className="relative mt-2 min-w-0 max-w-[min(100%,26rem)] sm:mt-3 sm:max-w-xl">
                <div
                  className={`rounded-2xl px-4 py-3.5 transition-[box-shadow,ring-color] sm:rounded-3xl sm:px-5 sm:py-4 ${
                    isMike
                      ? "rounded-tl-md bg-emerald-50 text-zinc-900 dark:bg-emerald-950/50 dark:text-zinc-50"
                      : "rounded-tr-md bg-sky-50 text-zinc-900 dark:bg-sky-950/45 dark:text-zinc-50"
                  } ${
                    isActive
                      ? "ring-2 ring-orange-500 ring-offset-2 ring-offset-white dark:ring-orange-400 dark:ring-offset-slate-900"
                      : ""
                  }`}
                >
                  <p className="min-w-0 text-lg leading-snug font-semibold wrap-break-word sm:text-2xl sm:leading-snug lg:text-3xl">
                    {highlightAnyWords(turn.text)}
                  </p>
                  {showMy && turn.textMy ? (
                    <p
                      className={`mt-3 border-t pt-3 text-base leading-snug font-medium wrap-break-word text-zinc-600 sm:text-lg sm:leading-snug dark:text-zinc-300 ${
                        isMike
                          ? "border-emerald-200/80 dark:border-emerald-800/60"
                          : "border-sky-200/80 dark:border-sky-800/60"
                      }`}
                    >
                      {turn.textMy}
                    </p>
                  ) : null}
                </div>
                {supported ? (
                  <button
                    type="button"
                    onClick={() => void playTurnAt(index)}
                    aria-label={
                      isActive ? copy.selfStudy.stopTurn : copy.selfStudy.playTurn
                    }
                    aria-pressed={isActive}
                    className={`absolute top-1 grid size-7 cursor-pointer place-items-center rounded-full text-zinc-500 transition-colors hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white ${
                      isMike ? "-end-8" : "-start-8"
                    } ${FOCUS} ${
                      isActive
                        ? "bg-orange-500/15 text-orange-700 dark:bg-orange-400/20 dark:text-orange-300"
                        : ""
                    }`}
                  >
                    {isActive ? (
                      <Square aria-hidden className="size-3 fill-current" />
                    ) : (
                      <Volume2 aria-hidden className="size-3.5" />
                    )}
                  </button>
                ) : null}
              </div>
              {!isMike ? (
                <span className="relative h-44 w-24 shrink-0 sm:h-56 sm:w-32">
                  <Image
                    src={speaker.src}
                    alt=""
                    fill
                    sizes="128px"
                    className="object-contain object-bottom"
                  />
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function SelfStudyCourse({ lesson }: { lesson: FreeLesson }) {
  const copy = useMessages();
  const accent = ACCENT_STYLES[lesson.accent];
  const firstSectionId = lesson.sections[0]?.id ?? "";
  const [activeId, setActiveId] = useState(firstSectionId);
  const activeIndex = lesson.sections.findIndex((section) => section.id === activeId);
  const activeSection =
    activeIndex >= 0 ? lesson.sections[activeIndex] : lesson.sections[0];
  const activeNumber = activeIndex >= 0 ? activeIndex + 1 : 1;

  return (
    <div className="mb-16 flex flex-col gap-5 sm:mb-24">
      <Link
        href="/self-study"
        className={`pill-3d pill-3d-amber inline-flex min-h-11 w-fit items-center gap-2 rounded-full px-4 text-sm font-bold text-amber-950 ${FOCUS}`}
      >
        <ArrowLeft aria-hidden className="size-4" />
        {copy.selfStudy.back}
      </Link>

      <div className="grid gap-5 lg:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)] lg:items-start">
        <aside
          aria-label={copy.selfStudy.sections}
          className={`teacher-card-3d teacher-card-static relative flex max-h-[min(70vh,42rem)] flex-col overflow-hidden rounded-[1.75rem] p-4 sm:p-5 lg:max-h-[calc(100vh-10rem)] ${accent.tone}`}
        >
          <span
            aria-hidden
            className="price-card-face pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
          />
          <p
            className={`stat-chip-3d inline-flex w-fit rounded-full px-2.5 py-0.5 text-[0.7rem] font-black tracking-wider uppercase ${accent.pill} ${accent.pillText}`}
          >
            {copy.selfStudy.free}
          </p>
          <h2 className="mt-3 shrink-0 text-xl font-black tracking-tight sm:text-2xl">
            {lesson.title}
          </h2>
          <nav
            aria-label={copy.selfStudy.sections}
            className="mt-5 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain pe-1"
          >
            <ul className="flex min-w-0 flex-col gap-1.5">
              {lesson.sections.map((section, index) => {
                const current = section.id === activeId;
                return (
                  <li key={section.id} className="min-w-0">
                    <button
                      type="button"
                      aria-current={current ? "true" : undefined}
                      onClick={() => setActiveId(section.id)}
                      className={`flex w-full min-h-11 min-w-0 cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-bold tracking-tight transition-colors ${FOCUS} ${
                        current
                          ? "bg-white text-zinc-950 shadow-[0_6px_14px_-10px_rgba(15,23,42,0.35)] dark:bg-slate-800 dark:text-white"
                          : "text-zinc-700 hover:bg-white/70 dark:text-zinc-200 dark:hover:bg-white/10"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`grid h-7 min-w-7 shrink-0 place-items-center rounded-full px-1 text-xs font-black tabular-nums ${
                          current
                            ? accent.badge
                            : "bg-zinc-200/80 text-zinc-600 dark:bg-white/10 dark:text-zinc-300"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1 wrap-break-word leading-snug">
                        {section.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <section
          aria-label={copy.selfStudy.content}
          aria-live="polite"
          className={`teacher-card-3d teacher-card-static relative flex min-h-[18rem] flex-col overflow-hidden rounded-[1.75rem] p-5 sm:min-h-[24rem] sm:p-7 ${accent.tone}`}
        >
          <span
            aria-hidden
            className="price-card-face pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
          />
          {activeSection ? (
            <div className="flex min-w-0 flex-col">
              <div className="teacher-stage relative min-w-0 overflow-hidden rounded-[1.35rem] px-5 py-6 sm:px-7 sm:py-8">
                <p
                  className={`stat-chip-3d inline-flex rounded-full px-2.5 py-0.5 text-[0.7rem] font-black tracking-wider tabular-nums ${accent.pill} ${accent.pillText}`}
                >
                  {activeNumber} / {lesson.sections.length}
                </p>
                <h3 className="mt-4 text-3xl font-black tracking-tight text-balance text-zinc-950 sm:text-4xl lg:text-5xl dark:text-white">
                  {activeSection.title}
                </h3>
                {activeSection.bodyMy ? (
                  <p className="mt-3 min-w-0 text-lg leading-snug font-bold wrap-break-word text-balance text-zinc-700 sm:text-xl sm:leading-snug dark:text-zinc-200">
                    ({activeSection.bodyMy})
                  </p>
                ) : null}
              </div>
              {activeSection.dialog?.length ? (
                <SectionDialog turns={activeSection.dialog} />
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
