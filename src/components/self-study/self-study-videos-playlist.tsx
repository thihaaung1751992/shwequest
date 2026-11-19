"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, ExternalLink, RotateCcw } from "lucide-react";
import SelfStudySearch from "@/components/self-study/self-study-search";
import { YtMark } from "@/components/self-study/self-study-videos-deco";
import SelfStudyViewToggle from "@/components/self-study/self-study-view-toggle";
import {
  selfStudyVideosHref,
  type SelfStudyView,
} from "@/components/self-study/self-study-view";
import {
  SELF_STUDY_PLAYLISTS,
  SELF_STUDY_PLAYLIST_TOPICS,
  type SelfStudyPlaylistTopic,
} from "@/data/self-study-videos";
import { useMessages } from "@/i18n/locale-context";

const RESULTS_ID = "self-study-videos-results";
const ALL_CHANNELS = "";
const ALL_TOPICS = "";
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";
const RISE_STAGGER_MS = 70;
const RISE_CLASS = "motion-safe:animate-teacher-rise";

type FilterOption = { value: string; label: string };

function riseDelay(index: number) {
  return { animationDelay: `${index * RISE_STAGGER_MS}ms` };
}

function FilterMenu({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  className?: string;
}) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);

  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? options[0]?.label;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const root = rootRef.current;
      if (
        !root ||
        !(event.target instanceof Node) ||
        root.contains(event.target)
      ) {
        return;
      }
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    const frame = window.requestAnimationFrame(() => {
      listRef.current
        ?.querySelector<HTMLElement>('[aria-selected="true"]')
        ?.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.cancelAnimationFrame(frame);
    };
  }, [open]);

  function select(next: string) {
    onChange(next);
    setOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <div ref={rootRef} className={`relative z-20 w-full min-w-0 ${className ?? ""}`}>
      <div className="nav-track-3d relative flex w-full min-w-0 items-center rounded-full py-1.5 pe-1.5 ps-1.5">
        <button
          ref={buttonRef}
          type="button"
          id={`${menuId}-trigger`}
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          aria-haspopup="listbox"
          aria-label={label}
          onClick={() => setOpen((wasOpen) => !wasOpen)}
          className={`flex min-h-10 w-full min-w-0 cursor-pointer items-center gap-2 rounded-full px-3.5 py-1.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 ${FOCUS}`}
        >
          <span className="min-w-0 flex-1 truncate">{selectedLabel}</span>
          <ChevronDown
            aria-hidden
            className={`size-4 shrink-0 text-zinc-500 transition-transform dark:text-zinc-300 ${
              open ? "rotate-180" : ""
            }`}
            strokeWidth={2.75}
          />
        </button>
      </div>
      {open ? (
        <ul
          ref={listRef}
          id={menuId}
          role="listbox"
          aria-labelledby={`${menuId}-trigger`}
          className="absolute inset-x-0 top-[calc(100%+0.4rem)] z-30 flex max-h-[min(16rem,50dvh)] min-w-0 flex-col gap-0.5 overflow-x-hidden overflow-y-auto overscroll-contain rounded-2xl border-2 border-zinc-900/10 bg-white p-1.5 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.55)] dark:border-white/10 dark:bg-slate-900"
        >
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <li key={option.value || "all"} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => select(option.value)}
                  className={`flex w-full min-h-11 min-w-0 cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold tracking-tight transition-colors ${FOCUS} ${
                    selected
                      ? "bg-amber-100 text-amber-950 dark:bg-amber-400/15 dark:text-amber-100"
                      : "text-zinc-800 hover:bg-amber-50 dark:text-zinc-100 dark:hover:bg-white/10"
                  }`}
                >
                  <span
                    className="grid size-4 shrink-0 place-items-center"
                    aria-hidden
                  >
                    {selected ? (
                      <Check className="size-4" strokeWidth={2.75} />
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export default function SelfStudyVideosPlaylist({
  view,
}: {
  view: SelfStudyView;
}) {
  const copy = useMessages();
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState(ALL_CHANNELS);
  const [topic, setTopic] = useState(ALL_TOPICS);

  const channels = useMemo(() => {
    const names = new Set<string>();
    for (const playlist of SELF_STUDY_PLAYLISTS) {
      names.add(playlist.channel);
    }
    return [...names].sort((a, b) => a.localeCompare(b));
  }, []);

  const channelOptions = useMemo(
    () => [
      { value: ALL_CHANNELS, label: copy.selfStudy.videosChannelAll },
      ...channels.map((name) => ({ value: name, label: name })),
    ],
    [channels, copy.selfStudy.videosChannelAll],
  );

  const topicLabels: Record<SelfStudyPlaylistTopic, string> = useMemo(
    () => ({
      grammar: copy.selfStudy.videosTopicGrammar,
      speaking: copy.selfStudy.videosTopicSpeaking,
      vocabulary: copy.selfStudy.videosTopicVocabulary,
    }),
    [
      copy.selfStudy.videosTopicGrammar,
      copy.selfStudy.videosTopicSpeaking,
      copy.selfStudy.videosTopicVocabulary,
    ],
  );

  const topicOptions = useMemo(
    () => [
      { value: ALL_TOPICS, label: copy.selfStudy.videosTopicAll },
      ...SELF_STUDY_PLAYLIST_TOPICS.map((name) => ({
        value: name,
        label: topicLabels[name],
      })),
    ],
    [copy.selfStudy.videosTopicAll, topicLabels],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SELF_STUDY_PLAYLISTS.filter((playlist) => {
      if (channel && playlist.channel !== channel) return false;
      if (topic && playlist.topic !== topic) return false;
      if (!q) return true;
      const title = playlist.title.toLowerCase();
      const playlistChannel = playlist.channel.toLowerCase();
      return title.includes(q) || playlistChannel.includes(q);
    });
  }, [query, channel, topic]);

  if (SELF_STUDY_PLAYLISTS.length === 0) return null;

  const q = query.trim();
  const searching = q.length > 0;
  const filtering =
    searching || channel !== ALL_CHANNELS || topic !== ALL_TOPICS;
  const topicLabel =
    topicOptions.find((option) => option.value === topic)?.label ??
    copy.selfStudy.videosTopicAll;

  function resetFilters() {
    setQuery("");
    setChannel(ALL_CHANNELS);
    setTopic(ALL_TOPICS);
  }

  return (
    <div className="mb-16 sm:mb-24">
      <div className="mt-7 flex flex-col gap-3">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
          <SelfStudySearch
            value={query}
            onChange={setQuery}
            label={copy.selfStudy.videosSearchLabel}
            placeholder={copy.selfStudy.videosSearchPlaceholder}
            resultsId={RESULTS_ID}
            ctaClass="cta-3d-red"
          />
          <FilterMenu
            label={copy.selfStudy.videosTopicLabel}
            value={topic}
            options={topicOptions}
            onChange={setTopic}
            className="sm:max-w-[11rem]"
          />
          <FilterMenu
            label={copy.selfStudy.videosChannelLabel}
            value={channel}
            options={channelOptions}
            onChange={setChannel}
            className="sm:max-w-xs"
          />
          {filtering ? (
            <div className="nav-track-3d relative flex w-full shrink-0 items-center rounded-full py-1.5 pe-1.5 ps-1.5 sm:w-auto">
              <button
                type="button"
                onClick={resetFilters}
                className={`flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:w-auto ${FOCUS}`}
              >
                <RotateCcw
                  aria-hidden
                  className="size-4 shrink-0 text-amber-700 dark:text-amber-300"
                  strokeWidth={2.75}
                />
                <span>{copy.selfStudy.videosResetFilters}</span>
              </button>
            </div>
          ) : null}
        </div>
        <div className="flex shrink-0 justify-start">
          <SelfStudyViewToggle current={view} hrefFor={selfStudyVideosHref} />
        </div>
      </div>

      <p id="self-study-videos-search-status" className="sr-only" aria-live="polite">
        {filtering ? copy.selfStudy.videosMatches(filtered.length) : ""}
      </p>

      <div id={RESULTS_ID}>
        {filtered.length > 0 ? (
          view === "list" ? (
            <ul className="mt-6 grid gap-4">
              {filtered.map((playlist, index) => {
                const titleId = `self-study-playlist-title-${playlist.id}`;
                return (
                  <li
                    key={playlist.id}
                    className={RISE_CLASS}
                    style={riseDelay(index)}
                  >
                    <article
                      className="teacher-card-3d teacher-tone-zinc group relative flex min-h-24 items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 dark:border-white/10 sm:gap-4 sm:px-4"
                      aria-labelledby={titleId}
                    >
                      <div className="teacher-stage relative h-20 w-36 shrink-0 overflow-hidden rounded-[0.9rem] bg-zinc-950 sm:h-24 sm:w-44">
                        <iframe
                          title={copy.selfStudy.videosPlaylistAria(playlist.title)}
                          src={playlist.embedSrc}
                          className="absolute inset-0 h-full w-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3
                          id={titleId}
                          className="truncate text-base font-black tracking-tight sm:text-lg"
                        >
                          {playlist.title}
                        </h3>
                        <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-sm font-bold text-zinc-600 dark:text-zinc-300">
                          <YtMark className="h-3.5 w-5 shrink-0 text-red-600 dark:text-red-500" />
                          <span className="truncate">{playlist.channel}</span>
                        </p>
                      </div>

                      <a
                        href={playlist.watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cta-3d cta-3d-ink relative inline-flex min-h-10 shrink-0 items-center gap-1.5 overflow-hidden rounded-xl px-3 text-sm font-extrabold text-white dark:text-zinc-950"
                      >
                        <span className="relative z-10 hidden sm:inline">
                          {copy.selfStudy.videosOpenOnYouTube}
                        </span>
                        <ExternalLink aria-hidden className="relative z-10 size-4" />
                      </a>
                    </article>
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((playlist, index) => {
                const titleId = `self-study-playlist-title-${playlist.id}`;
                return (
                  <li
                    key={playlist.id}
                    className={`h-full ${RISE_CLASS}`}
                    style={riseDelay(index)}
                  >
                    <article
                      className="teacher-card-3d teacher-tone-zinc group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] dark:border-white/10"
                      aria-labelledby={titleId}
                    >
                      <div className="teacher-stage relative aspect-video w-full overflow-hidden bg-zinc-950">
                        <iframe
                          title={copy.selfStudy.videosPlaylistAria(playlist.title)}
                          src={playlist.embedSrc}
                          className="absolute inset-0 h-full w-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                      </div>

                      <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
                        <h3
                          id={titleId}
                          className="line-clamp-2 text-xl font-black tracking-tight sm:text-2xl"
                        >
                          {playlist.title}
                        </h3>
                        <p className="mt-1.5 flex min-w-0 items-center gap-1.5 text-sm font-bold text-zinc-600 dark:text-zinc-300">
                          <YtMark className="h-3.5 w-5 shrink-0 text-red-600 dark:text-red-500" />
                          <span className="line-clamp-2">{playlist.channel}</span>
                        </p>

                        <div className="min-h-5 flex-1" aria-hidden />

                        <a
                          href={playlist.watchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cta-3d cta-3d-ink relative inline-flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-4 font-extrabold text-white dark:text-zinc-950"
                        >
                          <span className="relative z-10">
                            {copy.selfStudy.videosOpenOnYouTube}
                          </span>
                          <ExternalLink
                            aria-hidden
                            className="relative z-10 size-4"
                          />
                        </a>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          )
        ) : null}

        {filtering && filtered.length === 0 ? (
          <p className="mt-4 rounded-2xl border-2 border-dashed border-zinc-200 bg-white/80 px-4 py-10 text-center text-sm font-bold text-zinc-600 dark:border-white/10 dark:bg-slate-950/70 dark:text-zinc-300">
            {searching ? (
              <>
                {copy.selfStudy.videosEmptyLead}
                {q}
                {copy.selfStudy.videosEmptyTail}
              </>
            ) : channel !== ALL_CHANNELS ? (
              copy.selfStudy.videosEmptyChannel(channel)
            ) : (
              copy.selfStudy.videosEmptyTopic(topicLabel)
            )}
          </p>
        ) : null}
      </div>
    </div>
  );
}
