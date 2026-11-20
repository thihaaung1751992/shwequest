"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, ExternalLink, RotateCcw } from "lucide-react";
import SelfStudyPagination from "@/components/self-study/self-study-pagination";
import SelfStudySearch from "@/components/self-study/self-study-search";
import { YtMark } from "@/components/self-study/self-study-videos-deco";
import SelfStudyViewToggle from "@/components/self-study/self-study-view-toggle";
import {
  SELF_STUDY_PAGE_SIZE,
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

function PlaylistEmbed({
  title,
  src,
  className,
}: {
  title: string;
  src: string;
  className?: string;
}) {
  // Track which src finished loading — avoids useEffect reset races, and
  // stays false automatically when `src` changes until onLoad for the new URL.
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const ready = loadedSrc === src;

  // Safety: YouTube embeds occasionally skip onLoad after filter remounts.
  useEffect(() => {
    if (ready) return;
    const timer = window.setTimeout(() => setLoadedSrc(src), 10_000);
    return () => window.clearTimeout(timer);
  }, [ready, src]);

  return (
    <div
      className={`teacher-stage relative overflow-hidden bg-zinc-950 ${className ?? ""}`}
      aria-busy={!ready}
    >
      {!ready ? (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          aria-hidden
        >
          <div className="absolute inset-0 bg-linear-to-br from-zinc-800 via-zinc-950 to-red-950/50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255_255_255/0.08),transparent_65%)]" />
          <div className="absolute inset-x-[12%] top-[28%] h-[12%] rounded-full bg-white/8 motion-safe:animate-pulse" />
          <div className="absolute inset-x-[22%] top-[48%] h-[8%] rounded-full bg-white/5 motion-safe:animate-pulse [animation-delay:180ms]" />
          <div className="absolute inset-x-[30%] top-[64%] h-[6%] rounded-full bg-white/4 motion-safe:animate-pulse [animation-delay:320ms]" />
          <span className="relative grid size-14 place-items-center sm:size-16">
            <span className="absolute inset-0 rounded-full border-2 border-white/15 border-t-red-500 motion-safe:animate-spin" />
            <span className="absolute inset-1.5 rounded-full border border-white/10" />
            <YtMark className="relative h-5 w-7 text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.45)] sm:h-6 sm:w-8" />
          </span>
        </div>
      ) : null}
      <iframe
        title={title}
        src={src}
        onLoad={() => setLoadedSrc(src)}
        className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-500 ease-out ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
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
  page,
  topic = ALL_TOPICS,
  channel = ALL_CHANNELS,
}: {
  view: SelfStudyView;
  page: number;
  topic?: string;
  channel?: string;
}) {
  const copy = useMessages();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filters = useMemo(
    () => ({
      ...(topic ? { topic } : {}),
      ...(channel ? { channel } : {}),
    }),
    [topic, channel],
  );

  const hrefForPage = useMemo(
    () => (nextView: SelfStudyView, nextPage: number) =>
      selfStudyVideosHref(nextView, nextPage, filters),
    [filters],
  );

  const hrefForView = useMemo(
    () => (nextView: SelfStudyView) =>
      selfStudyVideosHref(nextView, 1, filters),
    [filters],
  );

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

  const pageCount = Math.max(
    1,
    Math.ceil(filtered.length / SELF_STUDY_PAGE_SIZE),
  );
  const current = Math.min(Math.max(1, page), pageCount);

  useEffect(() => {
    if (page === current) return;
    router.replace(selfStudyVideosHref(view, current, filters), {
      scroll: false,
    });
  }, [page, current, view, filters, router]);

  function replaceFilters(next: {
    topic?: string;
    channel?: string;
    page?: number;
  }) {
    router.replace(
      selfStudyVideosHref(view, next.page ?? 1, {
        topic: next.topic,
        channel: next.channel,
      }),
      { scroll: false },
    );
  }

  function goToPageOne() {
    if (page !== 1) {
      router.replace(selfStudyVideosHref(view, 1, filters), { scroll: false });
    }
  }

  function onQueryChange(next: string) {
    setQuery(next);
    goToPageOne();
  }

  function onChannelChange(next: string) {
    replaceFilters({
      topic: topic || undefined,
      channel: next || undefined,
      page: 1,
    });
  }

  function onTopicChange(next: string) {
    replaceFilters({
      topic: next || undefined,
      channel: channel || undefined,
      page: 1,
    });
  }

  if (SELF_STUDY_PLAYLISTS.length === 0) return null;

  const slice = filtered.slice(
    (current - 1) * SELF_STUDY_PAGE_SIZE,
    current * SELF_STUDY_PAGE_SIZE,
  );
  const q = query.trim();
  const searching = q.length > 0;
  const filtering =
    searching || channel !== ALL_CHANNELS || topic !== ALL_TOPICS;
  const topicLabel =
    topicOptions.find((option) => option.value === topic)?.label ??
    copy.selfStudy.videosTopicAll;

  function resetFilters() {
    setQuery("");
    replaceFilters({ page: 1 });
  }

  return (
    <div className="mb-16 sm:mb-24">
      <div className="mt-7 flex flex-col gap-3">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
          <SelfStudySearch
            value={query}
            onChange={onQueryChange}
            label={copy.selfStudy.videosSearchLabel}
            placeholder={copy.selfStudy.videosSearchPlaceholder}
            resultsId={RESULTS_ID}
            ctaClass="cta-3d-red"
          />
          <FilterMenu
            label={copy.selfStudy.videosTopicLabel}
            value={topic}
            options={topicOptions}
            onChange={onTopicChange}
            className="sm:max-w-[11rem]"
          />
          <FilterMenu
            label={copy.selfStudy.videosChannelLabel}
            value={channel}
            options={channelOptions}
            onChange={onChannelChange}
            className="sm:max-w-xs"
          />
          {filtering ? (
            <button
              type="button"
              onClick={resetFilters}
              className={`cta-3d cta-3d-sky flex min-h-14 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-white sm:w-auto ${FOCUS}`}
            >
              <RotateCcw
                aria-hidden
                className="size-4 shrink-0"
                strokeWidth={2.75}
              />
              <span>{copy.selfStudy.videosResetFilters}</span>
            </button>
          ) : null}
        </div>
        <div className="flex shrink-0 justify-start">
          <SelfStudyViewToggle current={view} hrefFor={hrefForView} />
        </div>
      </div>

      <p id="self-study-videos-search-status" className="sr-only" aria-live="polite">
        {filtering ? copy.selfStudy.videosMatches(filtered.length) : ""}
      </p>

      <div id={RESULTS_ID}>
        {filtered.length > 0 ? (
          <>
            {view === "list" ? (
              <ul className="mt-6 grid gap-4">
                {slice.map((playlist, index) => {
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
                        <PlaylistEmbed
                          title={copy.selfStudy.videosPlaylistAria(
                            playlist.title,
                          )}
                          src={playlist.embedSrc}
                          className="h-20 w-36 shrink-0 rounded-[0.9rem] sm:h-24 sm:w-44"
                        />

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
                          <ExternalLink
                            aria-hidden
                            className="relative z-10 size-4"
                          />
                        </a>
                      </article>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {slice.map((playlist, index) => {
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
                        <PlaylistEmbed
                          title={copy.selfStudy.videosPlaylistAria(
                            playlist.title,
                          )}
                          src={playlist.embedSrc}
                          className="aspect-video w-full"
                        />

                        <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
                          <h3
                            id={titleId}
                            className="line-clamp-2 text-xl font-black tracking-tight sm:text-2xl"
                          >
                            {playlist.title}
                          </h3>
                          <p className="mt-1.5 flex min-w-0 items-center gap-1.5 text-sm font-bold text-zinc-600 dark:text-zinc-300">
                            <YtMark className="h-3.5 w-5 shrink-0 text-red-600 dark:text-red-500" />
                            <span className="line-clamp-2">
                              {playlist.channel}
                            </span>
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
            )}
            <SelfStudyPagination
              view={view}
              page={current}
              pageCount={pageCount}
              hrefFor={hrefForPage}
            />
          </>
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
