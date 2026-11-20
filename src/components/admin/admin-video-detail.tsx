import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  MessageSquareText,
  Mic,
  SpellCheck2,
} from "lucide-react";
import { ADMIN_VIDEO_TOPIC_LABEL } from "@/data/admin-videos";
import type { SelfStudyPlaylist } from "@/data/self-study-videos";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

const TOPIC_CHIP = {
  grammar: {
    className:
      "bg-sky-500/15 text-sky-800 dark:bg-sky-400/15 dark:text-sky-300",
    Icon: SpellCheck2,
  },
  speaking: {
    className:
      "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300",
    Icon: Mic,
  },
  vocabulary: {
    className:
      "bg-amber-500/15 text-amber-900 dark:bg-amber-400/15 dark:text-amber-300",
    Icon: MessageSquareText,
  },
} as const;

export default function AdminVideoDetail({
  playlist,
  siteHref,
  listHref,
}: {
  playlist: SelfStudyPlaylist;
  siteHref: string;
  listHref: string;
}) {
  const topic = TOPIC_CHIP[playlist.topic];
  const TopicIcon = topic.Icon;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={listHref}
          className={`inline-flex items-center gap-1.5 rounded-xl border border-zinc-200/80 bg-white px-3 py-2 text-xs font-bold text-zinc-800 dark:border-white/10 dark:bg-slate-900 dark:text-zinc-100 ${FOCUS}`}
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          All playlists
        </Link>
        <div className="flex flex-wrap gap-2">
          <Link
            href={siteHref}
            className={`inline-flex items-center gap-1.5 rounded-xl border border-sky-300/80 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-900 dark:border-sky-500/40 dark:bg-sky-950/40 dark:text-sky-200 ${FOCUS}`}
          >
            Open on site
            <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
          <a
            href={playlist.watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-xl border border-red-300/80 bg-red-50 px-3 py-2 text-xs font-bold text-red-900 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-200 ${FOCUS}`}
          >
            Open on YouTube
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:border-white/10 dark:bg-slate-900/80">
        <div className="p-4 sm:p-5">
          <p className="font-mono text-[0.7rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
            {playlist.id}
          </p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
            {playlist.title}
          </h2>
          <p className="mt-1 text-sm font-bold text-zinc-600 dark:text-zinc-300">
            {playlist.channel}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${topic.className}`}
            >
              <TopicIcon className="size-3.5" aria-hidden strokeWidth={2.25} />
              {ADMIN_VIDEO_TOPIC_LABEL[playlist.topic]}
            </span>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="admin-video-ids-heading"
        className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:border-white/10 dark:bg-slate-900/80"
      >
        <div className="border-b border-zinc-200/80 px-4 py-4 dark:border-white/10 sm:px-5">
          <p className="text-[0.65rem] font-bold tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
            Catalog fields
          </p>
          <h3
            id="admin-video-ids-heading"
            className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            IDs and URLs — no embed
          </h3>
        </div>
        <dl className="divide-y divide-zinc-100 dark:divide-white/5">
          <div className="grid gap-1 px-4 py-3 sm:grid-cols-[8rem_minmax(0,1fr)] sm:px-5">
            <dt className="text-xs font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              List id
            </dt>
            <dd className="break-all font-mono text-sm font-bold text-zinc-800 dark:text-zinc-100">
              {playlist.listId}
            </dd>
          </div>
          <div className="grid gap-1 px-4 py-3 sm:grid-cols-[8rem_minmax(0,1fr)] sm:px-5">
            <dt className="text-xs font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              Watch URL
            </dt>
            <dd className="break-all font-mono text-sm font-medium text-zinc-700 dark:text-zinc-200">
              {playlist.watchUrl}
            </dd>
          </div>
          <div className="grid gap-1 px-4 py-3 sm:grid-cols-[8rem_minmax(0,1fr)] sm:px-5">
            <dt className="text-xs font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              Embed src
            </dt>
            <dd className="break-all font-mono text-sm font-medium text-zinc-700 dark:text-zinc-200">
              {playlist.embedSrc}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
