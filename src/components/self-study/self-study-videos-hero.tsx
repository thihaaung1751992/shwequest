"use client";

import { Clapperboard, ListVideo, Sparkles, Tv } from "lucide-react";
import {
  SelfStudyVideosHeroDeco,
  YtMark,
} from "@/components/self-study/self-study-videos-deco";
import { SELF_STUDY_PLAYLISTS } from "@/data/self-study-videos";
import { useMessages } from "@/i18n/locale-context";

const PLAYLIST_COUNT = SELF_STUDY_PLAYLISTS.length;
const CHANNEL_COUNT = new Set(SELF_STUDY_PLAYLISTS.map((p) => p.channel)).size;

export default function SelfStudyVideosHero() {
  const copy = useMessages();

  return (
    <section
      aria-labelledby="self-study-videos-title"
      className="teacher-stage teacher-tone-red relative overflow-hidden rounded-[2rem] border-2 border-red-300 px-5 py-7 shadow-[inset_0_2px_0_rgb(255_255_255/0.9),0_5px_0_var(--color-red-300),0_20px_36px_-18px_rgb(185_28_28/0.4)] sm:px-8 sm:py-9 dark:border-white/10 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_5px_0_rgb(255_255_255/0.08)]"
    >
      <SelfStudyVideosHeroDeco />
      <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="pill-3d pill-3d-red inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-sm font-bold text-white">
            <Clapperboard aria-hidden className="size-4" />
            {copy.selfStudy.videosKicker}
          </p>
          <h2
            id="self-study-videos-title"
            className="mt-4 flex items-center gap-3 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl dark:text-white"
          >
            <YtMark className="size-9 shrink-0 text-red-600 drop-shadow-[0_3px_0_var(--color-red-800)] sm:size-11 dark:text-red-500" />
            {copy.selfStudy.videosTitle}
          </h2>
          <p className="mt-2 max-w-prose text-sm font-medium text-zinc-700 sm:text-base dark:text-zinc-300">
            {copy.selfStudy.videosBody}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            <li className="stat-chip-3d pill-3d-red inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-black text-white">
              <ListVideo aria-hidden className="size-4" strokeWidth={2.75} />
              {copy.selfStudy.videosPlaylistCount(PLAYLIST_COUNT)}
            </li>
            <li className="stat-chip-3d pill-3d-amber inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-black text-amber-950">
              <Tv aria-hidden className="size-4" strokeWidth={2.75} />
              {copy.selfStudy.videosChannelCount(CHANNEL_COUNT)}
            </li>
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[16rem] shrink-0 sm:mx-0 sm:max-w-[18rem]">
          <div
            className="stat-chip-3d pill-3d-red-deep relative rounded-[1.75rem] px-6 pt-5 pb-6 text-center text-white"
            aria-label={`${copy.selfStudy.priceLabel}: ${copy.selfStudy.free}`}
          >
            <Sparkles
              aria-hidden
              className="absolute top-3 right-3 size-5 text-red-100 opacity-90"
            />
            <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-red-100">
              {copy.selfStudy.priceLabel}
            </p>
            <p className="mt-2 text-5xl leading-none font-black tracking-tight sm:text-6xl">
              {copy.selfStudy.free}
            </p>
            <p className="mt-3 text-sm font-bold text-red-100/90">
              {copy.selfStudy.priceHint}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
