"use client";

import { useEffect, useState } from "react";
import StreamPlayer from "@/components/stream-player";
import { videoStreamSrc } from "@/lib/video-stream-src";

const TITLE_MAX = 120;

type ListedVideo = {
  id: number;
  title: string;
  durationSec: number | null;
  size: number;
  mime: string;
};

function isListedVideo(value: unknown): value is ListedVideo {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === "number" &&
    Number.isSafeInteger(row.id) &&
    row.id > 0 &&
    typeof row.title === "string" &&
    row.title.length <= TITLE_MAX &&
    (row.durationSec === null ||
      (typeof row.durationSec === "number" && Number.isFinite(row.durationSec) && row.durationSec >= 0)) &&
    typeof row.size === "number" &&
    Number.isFinite(row.size) &&
    row.size >= 0 &&
    typeof row.mime === "string" &&
    row.mime.startsWith("video/")
  );
}

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(seconds: number): string {
  const whole = Math.round(seconds);
  const minutes = Math.floor(whole / 60);
  const rest = whole % 60;
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

type TestVideoScreenProps = {
  cdnUrl: string;
};

export default function TestVideoScreen({ cdnUrl }: TestVideoScreenProps) {
  const [messageId, setMessageId] = useState("3");
  const [src, setSrc] = useState<string | null>(null);
  const [videos, setVideos] = useState<ListedVideo[]>([]);
  const [truncated, setTruncated] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const trimmed = messageId.trim();
  const idReady = /^[1-9]\d*$/.test(trimmed);

  useEffect(() => {
    const controller = new AbortController();

    async function loadVideos() {
      try {
        const response = await fetch("/api/videos", { signal: controller.signal });
        const body: unknown = await response.json();
        if (!response.ok) {
          const message =
            body &&
            typeof body === "object" &&
            "error" in body &&
            typeof body.error === "string"
              ? body.error
              : "Could not load videos.";
          setListError(message);
          return;
        }
        if (
          !body ||
          typeof body !== "object" ||
          !("videos" in body) ||
          !Array.isArray(body.videos) ||
          !body.videos.every(isListedVideo) ||
          !("truncated" in body) ||
          typeof body.truncated !== "boolean"
        ) {
          setListError("Could not load videos.");
          return;
        }
        setVideos(body.videos);
        setTruncated(body.truncated);
      } catch {
        if (controller.signal.aborted) return;
        setListError("Could not load videos.");
      } finally {
        if (!controller.signal.aborted) setListLoading(false);
      }
    }

    void loadVideos();
    return () => controller.abort();
  }, []);

  function playMessage(id: number) {
    setMessageId(String(id));
    setSrc(videoStreamSrc(id, cdnUrl));
  }

  return (
    <main className="mx-auto flex w-full max-w-page flex-col gap-6 bg-cream px-4 py-10">
      <h1 className="text-2xl font-bold text-zinc-950">Test video</h1>
      <form
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          if (!idReady) return;
          setSrc(videoStreamSrc(trimmed, cdnUrl));
        }}
      >
        <label className="flex flex-col gap-1 text-sm font-semibold text-zinc-800">
          Message ID
          <input
            value={messageId}
            onChange={(event) => setMessageId(event.target.value)}
            inputMode="numeric"
            autoComplete="off"
            className="w-40 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          />
        </label>
        <button
          type="submit"
          disabled={!idReady}
          className="cursor-pointer rounded-full bg-zinc-950 px-5 py-2 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Load Video
        </button>
      </form>
      <StreamPlayer key={src ?? "empty"} src={src} />
      <p className="max-w-3xl text-sm text-zinc-600">
        This streams directly from the Telegram private channel via GramJS chunks. The
        server does not download the whole file first.
      </p>
      <section className="flex flex-col gap-3" aria-busy={listLoading}>
        <h2 className="text-lg font-bold text-zinc-950">Channel videos</h2>
        {listLoading ? <p className="text-sm text-zinc-600">Loading videos…</p> : null}
        {listError ? (
          <p className="text-sm text-red-800" role="alert">
            {listError}
          </p>
        ) : null}
        {!listLoading && !listError && videos.length === 0 ? (
          <p className="text-sm text-zinc-600">No videos in this channel.</p>
        ) : null}
        {truncated ? (
          <p className="text-sm text-zinc-600">Showing the latest 200 videos.</p>
        ) : null}
        <ul className="flex flex-col gap-2">
          {videos.map((video) => {
            const playing = src === videoStreamSrc(video.id, cdnUrl);
            const label = video.title || `Message ${video.id}`;
            const duration = video.durationSec === null ? "" : formatDuration(video.durationSec);
            return (
              <li key={video.id}>
                <button
                  type="button"
                  onClick={() => playMessage(video.id)}
                  aria-current={playing ? "true" : undefined}
                  className={`flex min-h-11 w-full cursor-pointer flex-col items-start gap-1 rounded-xl border bg-white px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${playing ? "border-zinc-950" : "border-zinc-300"}`}
                >
                  <span className="font-semibold text-zinc-950">{label}</span>
                  <span className="text-sm text-zinc-600">
                    #{video.id}
                    {duration ? ` · ${duration}` : ""}
                    {` · ${formatBytes(video.size)}`}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
