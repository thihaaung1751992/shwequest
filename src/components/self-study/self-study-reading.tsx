"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { BookMarked, Play, Sparkles, Square, Volume2 } from "lucide-react";
import type {
  FreeLessonReading,
  FreeLessonReadingExample,
  FreeLessonReadingLevel,
  FreeLessonReadingLevelId,
} from "@/data/any-reading";
import { useMessages } from "@/i18n/locale-context";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

const ANY_WORD = /\bany(?:one|body|thing|where|time)?\b/gi;

const NOVELTY_VOICE =
  /bad news|bahh|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|zarvox|bells|pipe|albert|wobble|princess|ralph|junior|hysterical|compact/i;
const QUALITY_VOICE =
  /google|microsoft.*(natural|online|neural)|enhanced|premium|neural|natural|siri/i;
const CLEAR_KNOWN =
  /\b(samantha|daniel|karen|moira|alex|victoria|fiona|tessa|zoe|susan|david|zira|oliver|google us english|google uk english)\b/i;

const SPEAK_RATE = 0.88;
const SPEAK_GAP_MS = 320;

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

function voiceQualityScore(voice: SpeechSynthesisVoice): number {
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
  return score;
}

function pickReadingVoice(): SpeechSynthesisVoice | null {
  const voices = englishVoices();
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;
  for (const voice of voices) {
    const score = voiceQualityScore(voice);
    if (score > bestScore) {
      best = voice;
      bestScore = score;
    }
  }
  return best;
}

function pause(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function speakEnglish(
  text: string,
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
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  });
}

function SpeakDisc({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`relative grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border-2 border-zinc-900 shadow-[2px_2px_0_var(--color-zinc-900)] transition-[translate,box-shadow,background-color] hover:-translate-px hover:shadow-[3px_3px_0_var(--color-zinc-900)] active:translate-px active:shadow-none dark:border-zinc-100 dark:shadow-[2px_2px_0_var(--color-zinc-100)] dark:hover:shadow-[3px_3px_0_var(--color-zinc-100)] ${FOCUS} ${
        active
          ? "bg-orange-500 text-white"
          : "bg-white text-zinc-900 hover:bg-amber-100 dark:bg-slate-800 dark:text-zinc-100 dark:hover:bg-slate-700"
      }`}
    >
      {active ? (
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
  );
}

function ExampleList({ items }: { items: FreeLessonReadingExample[] }) {
  return (
    <ul className="mt-3 flex min-w-0 flex-col gap-2.5">
      {items.map((ex) => (
        <li
          key={ex.en}
          className="min-w-0 rounded-2xl border-2 border-zinc-900 bg-lime-100 px-3.5 py-3 shadow-[3px_3px_0_var(--color-zinc-900)] dark:border-zinc-100 dark:bg-emerald-950 dark:shadow-[3px_3px_0_var(--color-zinc-100)]"
        >
          <p className="text-base leading-snug font-bold text-zinc-950 sm:text-lg dark:text-zinc-50">
            {highlightAnyWords(ex.en)}
          </p>
          {ex.my ? (
            <p
              lang="my"
              className="mt-2 border-t-2 border-dashed border-zinc-900/20 pt-2 text-sm leading-snug font-medium text-zinc-700 dark:border-zinc-100/20 dark:text-zinc-300"
            >
              {ex.my}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function LevelBody({ level }: { level: FreeLessonReadingLevel }) {
  const copy = useMessages();
  const [supported, setSupported] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [playingAll, setPlayingAll] = useState(false);
  const runIdRef = useRef(0);

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
  }, [supported, level.id]);

  if (level.empty || !level.title || !level.paragraphs?.length) {
    return (
      <div className="rounded-[1.35rem] border-2 border-dashed border-zinc-900/20 bg-white/70 px-5 py-10 text-center dark:border-white/20 dark:bg-slate-950/40">
        <p className="text-lg font-black tracking-tight text-zinc-950 dark:text-white">
          Coming soon
        </p>
        <p
          lang="my"
          className="mt-2 text-sm font-medium text-zinc-600 dark:text-zinc-300"
        >
          {level.label} reading မကြာမီ ထပ်ထည့်ပါမယ်။
        </p>
      </div>
    );
  }

  const { anyFocus, vocabulary, comprehension, practiceHeading } = level;
  const paragraphs = level.paragraphs;
  const focusGroups = anyFocus
    ? [
        anyFocus.questions,
        anyFocus.negatives,
        anyFocus.affirmative,
        ...(anyFocus.groups ?? []),
      ].filter(
        (group): group is NonNullable<typeof group> => group != null,
      )
    : [];

  const stopSpeak = () => {
    runIdRef.current += 1;
    window.speechSynthesis?.cancel();
    setPlayingAll(false);
    setActiveKey(null);
  };

  const playText = async (key: string, text: string) => {
    if (!supported) return;
    if (activeKey === key) {
      stopSpeak();
      return;
    }
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    window.speechSynthesis.cancel();
    setPlayingAll(false);
    setActiveKey(key);
    const voice = pickReadingVoice();
    await speakEnglish(text, voice);
    if (runIdRef.current !== runId) return;
    setActiveKey(null);
  };

  const playAllParagraphs = async () => {
    if (!supported || !paragraphs.length) return;
    if (playingAll) {
      stopSpeak();
      return;
    }
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    window.speechSynthesis.cancel();
    setPlayingAll(true);
    const voice = pickReadingVoice();
    for (let index = 0; index < paragraphs.length; index += 1) {
      if (runIdRef.current !== runId) return;
      setActiveKey(`para-${index}`);
      await speakEnglish(paragraphs[index]!, voice);
      if (runIdRef.current !== runId) return;
      if (index < paragraphs.length - 1) {
        await pause(SPEAK_GAP_MS);
      }
    }
    if (runIdRef.current !== runId) return;
    setPlayingAll(false);
    setActiveKey(null);
  };

  return (
    <div className="flex min-w-0 flex-col gap-7 sm:gap-8">
      <header className="min-w-0">
        <p className="text-[0.7rem] font-black tracking-wider text-orange-600 uppercase dark:text-orange-400">
          {level.bandLabel ?? `${level.label} Level Reading`}
        </p>
        <h4 className="mt-2 text-2xl leading-snug font-black tracking-tight text-zinc-950 sm:text-3xl dark:text-white">
          {level.title}
          {level.titleMy ? (
            <span
              lang="my"
              className="mt-1 block text-base font-bold text-zinc-600 sm:mt-0 sm:ms-2 sm:inline dark:text-zinc-300"
            >
              ({level.titleMy})
            </span>
          ) : null}
        </h4>
      </header>

      <div className="flex min-w-0 flex-col gap-4">
        {supported ? (
          <button
            type="button"
            onClick={() => void playAllParagraphs()}
            aria-pressed={playingAll}
            className={`inline-flex min-h-11 w-fit cursor-pointer items-center gap-2.5 rounded-full bg-zinc-950 py-1.5 pr-5 pl-1.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800 active:scale-[0.98] dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 ${FOCUS}`}
          >
            <span
              aria-hidden
              className={`grid size-8 place-items-center rounded-full text-white transition-colors ${
                playingAll ? "bg-orange-500" : "bg-emerald-500"
              }`}
            >
              {playingAll ? (
                <Square className="size-3.5 fill-current" />
              ) : (
                <Play className="size-3.5 translate-x-px fill-current" />
              )}
            </span>
            {playingAll ? copy.selfStudy.stopReading : copy.selfStudy.playReading}
          </button>
        ) : null}

        {paragraphs.map((para, index) => {
          const key = `para-${index}`;
          const isActive = activeKey === key;
          return (
            <div
              key={para.slice(0, 48)}
              className="flex min-w-0 items-start gap-2.5 sm:gap-3"
            >
              {supported ? (
                <SpeakDisc
                  active={isActive}
                  label={
                    isActive
                      ? copy.selfStudy.stopParagraph
                      : copy.selfStudy.playParagraph
                  }
                  onClick={() => void playText(key, para)}
                />
              ) : null}
              <p
                className={`min-w-0 max-w-prose flex-1 text-base leading-relaxed font-medium text-zinc-800 sm:text-lg dark:text-zinc-100 ${
                  isActive
                    ? "rounded-xl bg-orange-100/70 px-2 py-1 dark:bg-orange-400/15"
                    : ""
                }`}
              >
                {highlightAnyWords(para)}
              </p>
            </div>
          );
        })}
      </div>

      {practiceHeading ? (
        <h5 className="text-lg font-black tracking-tight text-zinc-950 sm:text-xl dark:text-white">
          {practiceHeading}
        </h5>
      ) : null}

      {vocabulary?.items.length ? (
        <section
          aria-labelledby={`reading-vocab-${level.id}`}
          className="min-w-0 rounded-[1.35rem] border-2 border-zinc-900/12 bg-white/80 p-4 sm:p-5 dark:border-white/12 dark:bg-slate-950/45"
        >
          <h5
            id={`reading-vocab-${level.id}`}
            className="text-lg font-black text-zinc-950 sm:text-xl dark:text-white"
          >
            {vocabulary.heading}
            {vocabulary.headingMy ? (
              <span
                lang="my"
                className="mt-1 block text-sm font-bold text-orange-600 sm:mt-0 sm:ms-2 sm:inline dark:text-orange-400"
              >
                ({vocabulary.headingMy})
              </span>
            ) : null}
          </h5>
          <ul className="mt-4 flex min-w-0 flex-col gap-2.5">
            {vocabulary.items.map((item) => {
              const key = `vocab-${item.term}`;
              const isActive = activeKey === key;
              return (
                <li
                  key={item.term}
                  className="flex min-w-0 items-start gap-2.5 rounded-xl border-2 border-sky-600/20 bg-sky-50/90 px-3.5 py-3 sm:items-center dark:border-sky-400/25 dark:bg-sky-950/40"
                >
                  {supported ? (
                    <SpeakDisc
                      active={isActive}
                      label={
                        isActive
                          ? copy.selfStudy.stopVocab
                          : copy.selfStudy.playVocab
                      }
                      onClick={() => void playText(key, item.term)}
                    />
                  ) : null}
                  <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                    <span className="w-fit shrink-0 rounded-lg border-2 border-zinc-900 bg-sky-300 px-2 py-0.5 text-sm font-black text-zinc-950 shadow-[2px_2px_0_var(--color-zinc-900)] dark:border-zinc-100 dark:shadow-[2px_2px_0_var(--color-zinc-100)]">
                      {item.term}
                    </span>
                    <span
                      lang="my"
                      className="min-w-0 text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      {item.meaning}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {comprehension?.items.length ? (
        <section
          aria-labelledby={`reading-comprehension-${level.id}`}
          className="min-w-0 rounded-[1.35rem] border-2 border-zinc-900/12 bg-white/80 p-4 sm:p-5 dark:border-white/12 dark:bg-slate-950/45"
        >
          <h5
            id={`reading-comprehension-${level.id}`}
            className="text-lg font-black text-zinc-950 sm:text-xl dark:text-white"
          >
            {comprehension.heading}
            {comprehension.headingMy ? (
              <span
                lang="my"
                className="mt-1 block text-sm font-bold text-orange-600 sm:mt-0 sm:ms-2 sm:inline dark:text-orange-400"
              >
                ({comprehension.headingMy})
              </span>
            ) : null}
          </h5>
          <ol className="mt-4 flex min-w-0 list-decimal flex-col gap-2.5 ps-5">
            {comprehension.items.map((item) => (
              <li
                key={item}
                className="min-w-0 ps-1 text-base leading-snug font-bold text-zinc-900 sm:text-lg dark:text-zinc-50"
              >
                {item}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {anyFocus ? (
        <section
          aria-labelledby={`reading-any-focus-${level.id}`}
          className="flex min-w-0 flex-col gap-5"
        >
          <div className="min-w-0">
            <h5
              id={`reading-any-focus-${level.id}`}
              className="text-lg font-black text-zinc-950 sm:text-xl dark:text-white"
            >
              {anyFocus.heading}
              {anyFocus.headingMy ? (
                <span
                  lang="my"
                  className="mt-1 block text-sm font-bold text-orange-600 sm:mt-0 sm:ms-2 sm:inline dark:text-orange-400"
                >
                  ({anyFocus.headingMy})
                </span>
              ) : null}
            </h5>
            {anyFocus.introMy ? (
              <p
                lang="my"
                className="mt-2 max-w-prose text-sm leading-relaxed font-medium text-zinc-700 sm:text-base dark:text-zinc-300"
              >
                {anyFocus.introMy}
              </p>
            ) : null}
          </div>

          {focusGroups.map((group) => (
            <div
              key={group.title}
              className="min-w-0 rounded-[1.35rem] border-2 border-zinc-900/12 bg-white/80 p-4 sm:p-5 dark:border-white/12 dark:bg-slate-950/45"
            >
              <h6
                lang="my"
                className="text-base leading-snug font-black text-zinc-950 sm:text-lg dark:text-white"
              >
                {group.titleMy}
                <span className="mt-1 block text-sm font-bold tracking-wide text-orange-600 sm:mt-0 sm:ms-2 sm:inline dark:text-orange-400">
                  ({group.title})
                </span>
              </h6>
              <ExampleList items={group.items} />
            </div>
          ))}
        </section>
      ) : null}
    </div>
  );
}

export default function SectionReading({
  reading,
}: {
  reading: FreeLessonReading;
}) {
  const baseId = useId();
  const levels = reading.levels;
  const [activeId, setActiveId] = useState<FreeLessonReadingLevelId>(
    () => levels[0]?.id ?? "a1-a2",
  );
  const tabRefs = useRef<Partial<Record<FreeLessonReadingLevelId, HTMLButtonElement | null>>>(
    {},
  );

  const active =
    levels.find((level) => level.id === activeId) ?? levels[0] ?? null;

  const selectLevel = (id: FreeLessonReadingLevelId) => {
    if (id === activeId) return;
    setActiveId(id);
  };

  const onTabListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const index = levels.findIndex((level) => level.id === activeId);
    if (index < 0 || levels.length === 0) return;
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const next =
      levels[(index + delta + levels.length) % levels.length]!;
    selectLevel(next.id);
    tabRefs.current[next.id]?.focus();
  };

  if (!active) return null;

  return (
    <section
      aria-labelledby={`${baseId}-title`}
      className="min-w-0"
    >
      <div className="relative overflow-hidden rounded-[1.75rem] border-[3px] border-zinc-900 bg-linear-to-br from-emerald-50 via-white to-amber-50 shadow-[5px_5px_0_var(--color-zinc-900)] dark:border-zinc-100 dark:from-emerald-950/40 dark:via-slate-900 dark:to-amber-950/40 dark:shadow-[5px_5px_0_var(--color-zinc-100)]">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,var(--color-emerald-500)_1.15px,transparent_1.5px)] bg-size-[14px_14px] opacity-[0.16] dark:opacity-10"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-10 size-44 rounded-full bg-lime-400/25 blur-2xl dark:bg-lime-400/15"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-12 size-48 rounded-full bg-amber-400/20 blur-2xl dark:bg-amber-400/10"
        />

        <div className="relative flex min-w-0 flex-col gap-6 p-5 sm:gap-7 sm:p-7">
          <header className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-zinc-900 bg-emerald-400 px-3 py-1 text-[0.7rem] font-black tracking-wider text-zinc-950 uppercase shadow-[2px_2px_0_var(--color-zinc-900)] dark:border-zinc-100 dark:shadow-[2px_2px_0_var(--color-zinc-100)]">
                <BookMarked aria-hidden className="size-3.5" strokeWidth={2.5} />
                {reading.kicker}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border-2 border-dashed border-zinc-900/25 bg-white/70 px-2.5 py-1 text-[0.65rem] font-bold tracking-wide text-zinc-600 dark:border-white/20 dark:bg-white/5 dark:text-zinc-300">
                <Sparkles aria-hidden className="size-3" />
                Any
              </span>
            </div>
            <h3
              id={`${baseId}-title`}
              className="sr-only"
            >
              Level reading
            </h3>

            <div
              role="tablist"
              aria-label="Reading level"
              onKeyDown={onTabListKeyDown}
              className="mt-5 inline-flex max-w-full flex-wrap gap-1 rounded-full border-2 border-zinc-900 bg-white/80 p-1 shadow-[3px_3px_0_var(--color-zinc-900)] dark:border-zinc-100 dark:bg-slate-950/50 dark:shadow-[3px_3px_0_var(--color-zinc-100)]"
            >
              {levels.map((level) => {
                const selected = level.id === active.id;
                const tabId = `${baseId}-tab-${level.id}`;
                const panelId = `${baseId}-panel-${level.id}`;
                return (
                  <button
                    key={level.id}
                    ref={(node) => {
                      tabRefs.current[level.id] = node;
                    }}
                    type="button"
                    role="tab"
                    id={tabId}
                    aria-selected={selected}
                    aria-controls={panelId}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => selectLevel(level.id)}
                    className={`inline-flex min-h-10 min-w-14 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-black transition-[transform,background-color,color,box-shadow] motion-safe:hover:-translate-y-0.5 active:translate-y-0 ${
                      selected
                        ? "bg-zinc-950 text-white shadow-[2px_2px_0_var(--color-orange-400)] dark:bg-white dark:text-zinc-950 dark:shadow-[2px_2px_0_var(--color-orange-400)]"
                        : "text-zinc-700 hover:bg-emerald-100/80 dark:text-zinc-200 dark:hover:bg-white/10"
                    } ${FOCUS}`}
                  >
                    {level.label}
                  </button>
                );
              })}
            </div>
          </header>

          <div
            role="tabpanel"
            id={`${baseId}-panel-${active.id}`}
            aria-labelledby={`${baseId}-tab-${active.id}`}
            className="min-w-0"
          >
            <LevelBody key={active.id} level={active} />
          </div>
        </div>
      </div>
    </section>
  );
}
