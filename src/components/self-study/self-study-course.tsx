"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  Languages,
  Play,
  Search,
  Square,
  Volume2,
  X,
} from "lucide-react";
import SectionGrammar from "@/components/self-study/self-study-grammar";
import SectionReading from "@/components/self-study/self-study-reading";
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

/** Sidebar: full list is scrollable; viewport shows ~10. Down-arrow scrolls +5 rows. */
const SECTION_SCROLL_STEP = 5;

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
            className={`inline-flex min-h-11 w-fit cursor-pointer items-center gap-2.5 rounded-full bg-zinc-950 py-1.5 pr-5 pl-1.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800 active:scale-[0.98] dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 ${FOCUS}`}
          >
            <span
              aria-hidden
              className={`grid size-8 place-items-center rounded-full text-white transition-colors ${
                playing ? "bg-orange-500" : "bg-emerald-500"
              }`}
            >
              {playing ? (
                <Square className="size-3.5 fill-current" />
              ) : (
                <Play className="size-3.5 translate-x-px fill-current" />
              )}
            </span>
            {playing ? copy.selfStudy.stopDialog : copy.selfStudy.playDialog}
          </button>
        ) : null}
        {hasMy ? (
          <button
            type="button"
            onClick={() => setShowMy((open) => !open)}
            aria-pressed={showMy}
            className={`inline-flex min-h-11 w-fit cursor-pointer items-center gap-2 rounded-full border-2 px-4 text-sm font-bold transition-colors active:scale-[0.98] ${FOCUS} ${
              showMy
                ? "border-amber-500 bg-amber-100 text-amber-950 dark:border-amber-400 dark:bg-amber-400/15 dark:text-amber-100"
                : "border-zinc-900/15 bg-white/70 text-zinc-800 hover:border-zinc-900/30 hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-zinc-100 dark:hover:border-white/30"
            }`}
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
                isMike ? "justify-start sm:pe-12" : "justify-end sm:ps-12"
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
              <div className="relative mt-2 flex min-w-0 max-w-[min(100%,26rem)] flex-col gap-2 sm:mt-3 sm:block sm:max-w-xl sm:gap-0">
                <div
                  className={`speech-bubble px-4 py-3.5 text-zinc-900 sm:px-6 sm:py-4 dark:text-zinc-50 ${
                    isMike
                      ? "speech-bubble-left [--bubble-bg:var(--color-lime-100)] dark:[--bubble-bg:var(--color-emerald-950)]"
                      : "speech-bubble-right [--bubble-bg:var(--color-sky-100)] dark:[--bubble-bg:var(--color-sky-950)]"
                  } ${isActive ? "speech-bubble-active" : ""}`}
                >
                  <p className="min-w-0 text-lg leading-snug font-bold wrap-break-word sm:text-2xl sm:leading-snug lg:text-3xl">
                    {highlightAnyWords(turn.text)}
                  </p>
                  {showMy && turn.textMy ? (
                    <p
                      className="mt-3 border-t-2 border-dashed border-zinc-900/25 pt-3 text-base leading-snug font-medium wrap-break-word text-zinc-700 sm:text-lg sm:leading-snug dark:border-zinc-100/25 dark:text-zinc-300"
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
                    className={`relative grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border-2 border-zinc-900 shadow-[2px_2px_0_var(--color-zinc-900)] transition-[translate,box-shadow,background-color] hover:-translate-px hover:shadow-[3px_3px_0_var(--color-zinc-900)] active:translate-px active:shadow-none dark:border-zinc-100 dark:shadow-[2px_2px_0_var(--color-zinc-100)] dark:hover:shadow-[3px_3px_0_var(--color-zinc-100)] sm:absolute sm:top-1 ${
                      isMike
                        ? "self-end sm:self-auto sm:-end-11"
                        : "self-start sm:self-auto sm:-start-11"
                    } ${FOCUS} ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "bg-white text-zinc-900 hover:bg-amber-100 dark:bg-slate-800 dark:text-zinc-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {isActive ? (
                      <>
                        <span
                          aria-hidden
                          className="absolute inset-0 animate-ping rounded-full bg-orange-400/60 motion-reduce:hidden"
                        />
                        <Square aria-hidden className="relative size-3 fill-current" />
                      </>
                    ) : (
                      <Volume2 aria-hidden className="size-4" strokeWidth={2.5} />
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
  const [sectionMenuOpen, setSectionMenuOpen] = useState(false);
  const [sectionQuery, setSectionQuery] = useState("");
  /** True while the nav can scroll further down (manual or via ChevronDown). */
  const [canScrollMore, setCanScrollMore] = useState(
    () => lesson.sections.length > SECTION_SCROLL_STEP,
  );
  const navRef = useRef<HTMLElement>(null);
  const sectionMenuRef = useRef<HTMLDivElement>(null);
  const sectionListRef = useRef<HTMLUListElement>(null);
  const sectionSearchRef = useRef<HTMLInputElement>(null);
  const sectionMenuId = useId();
  const sectionSearchId = useId();
  const activeIndex = lesson.sections.findIndex((section) => section.id === activeId);
  const activeSection =
    activeIndex >= 0 ? lesson.sections[activeIndex] : lesson.sections[0];
  const activeNumber = activeIndex >= 0 ? activeIndex + 1 : 1;

  const filteredSections = useMemo(() => {
    const q = sectionQuery.trim().toLowerCase();
    const indexed = lesson.sections.map((section, index) => ({ section, index }));
    if (!q) return indexed;
    return indexed.filter(({ section }) => {
      const title = section.title.toLowerCase();
      const bodyMy = section.bodyMy?.toLowerCase() ?? "";
      return title.includes(q) || bodyMy.includes(q);
    });
  }, [lesson.sections, sectionQuery]);

  const sectionSearching = sectionQuery.trim().length > 0;

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const syncCanScroll = () => {
      setCanScrollMore(nav.scrollTop + nav.clientHeight < nav.scrollHeight - 2);
    };

    syncCanScroll();
    nav.addEventListener("scroll", syncCanScroll, { passive: true });
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(syncCanScroll)
        : null;
    ro?.observe(nav);
    return () => {
      nav.removeEventListener("scroll", syncCanScroll);
      ro?.disconnect();
    };
  }, [filteredSections.length]);

  useEffect(() => {
    if (!sectionMenuOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const root = sectionMenuRef.current;
      if (
        !root ||
        !(event.target instanceof Node) ||
        root.contains(event.target)
      ) {
        return;
      }
      setSectionMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSectionMenuOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    const frame = window.requestAnimationFrame(() => {
      sectionListRef.current
        ?.querySelector<HTMLElement>('[aria-current="true"]')
        ?.scrollIntoView({ block: "nearest" });
    });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.cancelAnimationFrame(frame);
    };
  }, [sectionMenuOpen]);

  function scrollNextBatch() {
    const nav = navRef.current;
    if (!nav) return;
    const rows = [
      ...nav.querySelectorAll<HTMLElement>("[data-section-index]"),
    ];
    if (rows.length === 0) return;

    const navTop = nav.getBoundingClientRect().top;
    let topIndex = 0;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row) continue;
      if (row.getBoundingClientRect().top - navTop >= -2) {
        topIndex = i;
        break;
      }
      topIndex = i;
    }

    const targetIndex = Math.min(
      topIndex + SECTION_SCROLL_STEP,
      rows.length - 1,
    );
    const row = rows[targetIndex];
    if (!row) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const top =
      nav.scrollTop +
      (row.getBoundingClientRect().top - nav.getBoundingClientRect().top);
    nav.scrollTo({
      top,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

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
          className={`teacher-card-3d teacher-card-static relative z-10 flex flex-col overflow-visible rounded-[1.75rem] p-4 sm:p-5 lg:sticky lg:top-6 lg:z-auto lg:max-h-[calc(100vh-10rem)] lg:overflow-hidden ${accent.tone}`}
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
          <div ref={sectionMenuRef} className="mt-4 shrink-0">
            <form
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                sectionSearchRef.current?.blur();
              }}
            >
              <label htmlFor={sectionSearchId} className="sr-only">
                {copy.selfStudy.sectionSearchLabel}
              </label>
              <div className="group/search flex min-h-11 items-center gap-2 rounded-2xl border-2 border-zinc-900/10 bg-white py-1.5 pe-1.5 ps-3 shadow-[0_6px_14px_-10px_rgba(15,23,42,0.35)] transition-[border-color,box-shadow] focus-within:border-zinc-900 focus-within:shadow-[3px_3px_0_var(--color-zinc-900)] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-sky-700 dark:border-white/10 dark:bg-slate-800 dark:focus-within:border-zinc-100 dark:focus-within:shadow-[3px_3px_0_var(--color-zinc-100)]">
                <Search
                  aria-hidden
                  className="size-4 shrink-0 text-zinc-400 transition-colors group-focus-within/search:text-zinc-900 dark:text-zinc-400 dark:group-focus-within/search:text-zinc-100"
                  strokeWidth={2.5}
                />
                <input
                  ref={sectionSearchRef}
                  id={sectionSearchId}
                  type="search"
                  inputMode="search"
                  value={sectionQuery}
                  maxLength={80}
                  placeholder={copy.selfStudy.sectionSearchPlaceholder}
                  autoComplete="off"
                  aria-controls={`${sectionMenuId} section-nav-list`}
                  aria-describedby="section-search-status"
                  onChange={(event) => {
                    const next = event.target.value;
                    setSectionQuery(next);
                    if (next.trim()) setSectionMenuOpen(true);
                  }}
                  className="min-w-0 flex-1 bg-transparent py-1.5 text-sm font-semibold text-zinc-950 outline-hidden placeholder:font-medium placeholder:text-zinc-400 dark:text-white dark:placeholder:text-zinc-500 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
                />
                {sectionQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSectionQuery("");
                      sectionSearchRef.current?.focus();
                    }}
                    aria-label={copy.selfStudy.clear}
                    className={`grid size-9 shrink-0 place-items-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-300 dark:hover:bg-white/10 ${FOCUS}`}
                  >
                    <X aria-hidden className="size-4" strokeWidth={2.75} />
                  </button>
                ) : null}
              </div>
            </form>
            <p id="section-search-status" className="sr-only" aria-live="polite">
              {sectionSearching
                ? copy.selfStudy.sectionMatches(filteredSections.length)
                : ""}
            </p>
            <div className="relative mt-3 lg:hidden">
              <button
                type="button"
                id={`${sectionMenuId}-trigger`}
                aria-expanded={sectionMenuOpen}
                aria-controls={sectionMenuId}
                aria-haspopup="listbox"
                aria-label={copy.selfStudy.sections}
                onClick={() => setSectionMenuOpen((open) => !open)}
                className={`flex w-full min-h-11 cursor-pointer items-center gap-3 rounded-2xl border-2 border-zinc-900/10 bg-white py-2.5 pe-3 ps-3 text-left text-sm font-bold tracking-tight text-zinc-950 shadow-[0_6px_14px_-10px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-800 dark:text-white ${FOCUS}`}
              >
                <span
                  aria-hidden
                  className={`grid h-7 min-w-7 shrink-0 place-items-center rounded-full px-1 text-xs font-black tabular-nums ${accent.badge}`}
                >
                  {activeNumber}
                </span>
                <span className="min-w-0 flex-1 wrap-break-word leading-snug">
                  {activeSection?.title ?? copy.selfStudy.sections}
                </span>
                <ChevronDown
                  aria-hidden
                  className={`size-5 shrink-0 text-zinc-500 transition-transform dark:text-zinc-300 ${
                    sectionMenuOpen ? "rotate-180" : ""
                  }`}
                  strokeWidth={2.5}
                />
              </button>
              {sectionMenuOpen ? (
                <ul
                  ref={sectionListRef}
                  id={sectionMenuId}
                  role="listbox"
                  aria-labelledby={`${sectionMenuId}-trigger`}
                  className="absolute inset-x-0 top-[calc(100%+0.4rem)] z-30 flex max-h-[min(20rem,55dvh)] min-w-0 flex-col gap-1 overflow-x-hidden overflow-y-auto overscroll-contain rounded-2xl border-2 border-zinc-900/10 bg-white p-1.5 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.55)] dark:border-white/10 dark:bg-slate-900"
                >
                  {filteredSections.length > 0 ? (
                    filteredSections.map(({ section, index }) => {
                      const current = section.id === activeId;
                      return (
                        <li key={section.id} className="min-w-0" role="none">
                          <button
                            type="button"
                            role="option"
                            aria-selected={current}
                            aria-current={current ? "true" : undefined}
                            onClick={() => {
                              setActiveId(section.id);
                              setSectionMenuOpen(false);
                            }}
                            className={`flex w-full min-h-11 min-w-0 cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold tracking-tight transition-colors ${FOCUS} ${
                              current
                                ? "bg-zinc-100 text-zinc-950 dark:bg-slate-800 dark:text-white"
                                : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-white/10"
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
                    })
                  ) : (
                    <li
                      role="option"
                      aria-disabled="true"
                      className="px-3 py-4 text-center text-sm font-bold text-zinc-500 dark:text-zinc-400"
                    >
                      {copy.selfStudy.sectionEmptyLead}
                      {sectionQuery.trim()}
                      {copy.selfStudy.sectionEmptyTail}
                    </li>
                  )}
                </ul>
              ) : null}
            </div>
          </div>
          <div
            aria-hidden
            className="mt-5 hidden shrink-0 items-center gap-2 px-1 lg:flex"
          >
            <span className="text-[0.7rem] font-black tracking-wider text-zinc-600 uppercase dark:text-zinc-300">
              {copy.selfStudy.sections}
            </span>
            <span className="h-px min-w-0 flex-1 border-t-2 border-dashed border-zinc-900/15 dark:border-white/15" />
            <span className="rounded-full border-2 border-zinc-900 bg-white px-2 py-px text-[0.7rem] font-black text-zinc-900 tabular-nums dark:border-zinc-100 dark:bg-slate-800 dark:text-zinc-100">
              {sectionSearching
                ? `${filteredSections.length} / ${lesson.sections.length}`
                : lesson.sections.length}
            </span>
          </div>
          <nav
            ref={navRef}
            aria-label={copy.selfStudy.sections}
            className={`relative z-0 mt-3 hidden min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain py-1 ps-0.5 pe-2 lg:block ${
              canScrollMore ? "mask-b-from-80%" : ""
            }`}
          >
            {filteredSections.length > 0 ? (
              <ul
                id="section-nav-list"
                className="flex min-w-0 flex-col gap-1.5"
              >
                {filteredSections.map(({ section, index }) => {
                  const current = section.id === activeId;
                  return (
                    <li
                      key={section.id}
                      data-section-index={index}
                      className="min-w-0"
                    >
                      <button
                        type="button"
                        aria-current={current ? "true" : undefined}
                        onClick={() => setActiveId(section.id)}
                        className={`group/row flex w-full min-h-11 min-w-0 cursor-pointer items-center gap-3 rounded-2xl border-2 px-3 py-2 text-left text-sm font-bold tracking-tight transition-[background-color,border-color,box-shadow,translate] ${FOCUS} ${
                          current
                            ? "border-zinc-900 bg-white text-zinc-950 shadow-[3px_3px_0_var(--color-zinc-900)] dark:border-zinc-100 dark:bg-slate-800 dark:text-white dark:shadow-[3px_3px_0_var(--color-zinc-100)]"
                            : "border-transparent text-zinc-700 hover:border-zinc-900/10 hover:bg-white/70 motion-safe:hover:translate-x-0.5 dark:text-zinc-200 dark:hover:border-white/10 dark:hover:bg-white/10"
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`grid h-7 min-w-7 shrink-0 place-items-center rounded-full border-2 px-1 text-xs font-black tabular-nums transition-colors ${
                            current
                              ? `border-zinc-900 dark:border-zinc-100 ${accent.badge}`
                              : "border-zinc-900/10 bg-white/70 text-zinc-600 group-hover/row:border-zinc-900/25 group-hover/row:text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:group-hover/row:text-white"
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
            ) : (
              <p
                id="section-nav-list"
                className="rounded-2xl border-2 border-dashed border-zinc-900/15 px-3 py-6 text-center text-sm font-bold text-zinc-600 dark:border-white/15 dark:text-zinc-300"
              >
                {copy.selfStudy.sectionEmptyLead}
                {sectionQuery.trim()}
                {copy.selfStudy.sectionEmptyTail}
              </p>
            )}
          </nav>
          {canScrollMore ? (
            <div className="relative z-20 -mt-3 hidden shrink-0 justify-center pt-1 lg:flex">
              <button
                type="button"
                aria-label={copy.selfStudy.showMoreSections}
                onClick={scrollNextBatch}
                className={`relative z-20 grid size-10 cursor-pointer place-items-center rounded-full border-2 border-zinc-900 bg-white text-zinc-900 shadow-[2px_2px_0_var(--color-zinc-900)] transition-[translate,box-shadow,background-color] pointer-events-auto hover:-translate-px hover:bg-amber-100 hover:shadow-[3px_3px_0_var(--color-zinc-900)] active:translate-px active:shadow-none dark:border-zinc-100 dark:bg-slate-800 dark:text-zinc-100 dark:shadow-[2px_2px_0_var(--color-zinc-100)] dark:hover:bg-slate-700 dark:hover:shadow-[3px_3px_0_var(--color-zinc-100)] ${FOCUS}`}
              >
                <ChevronDown aria-hidden className="size-5" strokeWidth={2.5} />
              </button>
            </div>
          ) : null}
        </aside>

        <div className="flex min-w-0 flex-col gap-5 sm:gap-6">
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
                <header className="min-w-0 border-b-2 border-dashed border-zinc-900/15 pb-6 sm:pb-8 dark:border-white/15">
                  <div className="flex min-w-0 items-center gap-3">
                    <p className="shrink-0 text-xs font-black tracking-wider text-zinc-600 tabular-nums dark:text-zinc-300">
                      <span className="text-zinc-950 dark:text-white">
                        {activeNumber}
                      </span>{" "}
                      / {lesson.sections.length}
                    </p>
                    <div
                      aria-hidden
                      className="relative h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-zinc-900/10 dark:bg-white/10"
                    >
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full bg-linear-to-r transition-[width] duration-300 ${accent.bar}`}
                        style={{
                          width: `max(0.375rem, ${(activeNumber / lesson.sections.length) * 100}%)`,
                        }}
                      />
                    </div>
                  </div>
                  <h3 className="mt-5 text-4xl leading-none font-black tracking-tight text-balance text-zinc-950 sm:mt-6 sm:text-5xl lg:text-6xl dark:text-white">
                    {activeSection.title}
                  </h3>
                  {activeSection.bodyMy ? (
                    <p className="mt-4 flex min-w-0 items-baseline gap-2.5">
                      <span
                        className={`shrink-0 rounded-md px-1.5 py-0.5 text-[0.65rem] font-black tracking-wider ${accent.badge}`}
                      >
                        MY
                      </span>
                      <span
                        lang="my"
                        className="min-w-0 text-lg leading-relaxed font-semibold wrap-break-word text-zinc-700 sm:text-xl dark:text-zinc-200"
                      >
                        {activeSection.bodyMy}
                      </span>
                    </p>
                  ) : null}
                </header>
                {activeSection.dialog?.length ? (
                  <SectionDialog turns={activeSection.dialog} />
                ) : null}
              </div>
            ) : null}
          </section>
          {activeSection?.grammar ? (
            <SectionGrammar grammar={activeSection.grammar} />
          ) : null}
          {activeSection?.reading ? (
            <SectionReading
              key={activeSection.id}
              reading={activeSection.reading}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
