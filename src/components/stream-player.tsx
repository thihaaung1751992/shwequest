"use client";

import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const FOCUS =
  "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200";

type StreamPlayerProps = {
  src: string | null;
};

function formatClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  const remain = whole % 60;
  return `${minutes}:${remain.toString().padStart(2, "0")}`;
}

export default function StreamPlayer({ src }: StreamPlayerProps) {
  const safeSrc = src && /^\/api\/video\/[1-9]\d*$/.test(src) ? src : null;
  const shellRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [failed, setFailed] = useState(false);
  const [hot, setHot] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [coarse, setCoarse] = useState(false);

  const canSeek = Number.isFinite(duration) && duration > 0 && !failed;
  const showChrome = coarse || !playing || hot || scrubbing || waiting || failed || !safeSrc;

  useEffect(() => {
    const query = window.matchMedia("(hover: none)");
    const apply = () => setCoarse(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    function onChange() {
      setFullscreen(document.fullscreenElement === shellRef.current);
    }
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function togglePlay() {
    const video = videoRef.current;
    if (!video || !safeSrc || failed) return;
    if (video.paused) {
      void video.play().catch(() => setFailed(true));
    } else {
      video.pause();
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  function seekTo(next: number) {
    const video = videoRef.current;
    if (!video || !canSeek) return;
    const clamped = Math.min(Math.max(next, 0), duration);
    video.currentTime = clamped;
    setCurrent(clamped);
  }

  function timeAt(clientX: number): number | null {
    const track = trackRef.current;
    if (!track || !canSeek) return null;
    const rect = track.getBoundingClientRect();
    if (rect.width <= 0) return null;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return ratio * duration;
  }

  async function toggleFullscreen() {
    const shell = shellRef.current;
    if (!shell) return;
    try {
      if (document.fullscreenElement === shell) await document.exitFullscreen();
      else await shell.requestFullscreen();
    } catch {
      setFullscreen(document.fullscreenElement === shell);
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!safeSrc) return;
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
    if ((event.key === " " || event.key === "k") && target instanceof HTMLButtonElement) return;
    if (event.key === " " || event.key === "k") {
      event.preventDefault();
      togglePlay();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      seekTo(current + 5);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      seekTo(current - 5);
    } else if (event.key === "f") {
      event.preventDefault();
      void toggleFullscreen();
    } else if (event.key === "m") {
      event.preventDefault();
      toggleMute();
    }
  }

  const played = canSeek ? Math.min(100, (current / duration) * 100) : 0;
  const bufferedPct = canSeek ? Math.min(100, (buffered / duration) * 100) : 0;

  return (
    <div
      ref={shellRef}
      tabIndex={safeSrc ? 0 : -1}
      onKeyDown={onKeyDown}
      onPointerEnter={() => setHot(true)}
      onPointerLeave={() => {
        if (!scrubbing) setHot(false);
      }}
      onFocus={() => setHot(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHot(false);
      }}
      className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-950 shadow-2xl ring-1 ring-amber-200/50 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
    >
      {safeSrc ? (
        <video
          ref={videoRef}
          src={safeSrc}
          playsInline
          preload="metadata"
          className="h-full w-full object-contain"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
          onDurationChange={(event) => setDuration(event.currentTarget.duration)}
          onProgress={(event) => {
            const video = event.currentTarget;
            const end = video.buffered.length ? video.buffered.end(video.buffered.length - 1) : 0;
            setBuffered(end);
          }}
          onWaiting={() => setWaiting(true)}
          onPlaying={() => {
            setWaiting(false);
            setFailed(false);
          }}
          onError={() => setFailed(true)}
        />
      ) : null}

      {safeSrc && !failed ? (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={togglePlay}
          className="absolute inset-0 z-10 cursor-pointer"
        />
      ) : null}

      {!safeSrc ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 text-amber-100">
          <span className="grid size-16 place-items-center rounded-full border border-amber-200/40 bg-white/10">
            <Play className="size-7 translate-x-0.5 fill-amber-200 text-amber-200" aria-hidden="true" />
          </span>
          <p className="text-sm font-semibold tracking-wide text-amber-50/80">Load a video to start</p>
        </div>
      ) : null}

      {failed ? (
        <p className="absolute inset-0 z-20 grid place-items-center px-6 text-center text-sm font-semibold text-amber-50">
          This video could not play.
        </p>
      ) : null}

      {safeSrc && !failed && waiting ? (
        <span className="pointer-events-none absolute top-1/2 left-1/2 z-20 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/20 border-t-amber-300 motion-safe:animate-spin" />
      ) : null}

      {safeSrc && !failed && !playing && !waiting ? (
        <button
          type="button"
          aria-label="Play"
          onClick={togglePlay}
          className={`absolute top-1/2 left-1/2 z-20 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-amber-400 text-zinc-950 shadow-[0_0_40px_rgba(251,191,36,0.55)] motion-safe:transition-transform motion-safe:hover:scale-105 ${FOCUS}`}
        >
          <Play className="size-9 translate-x-0.5 fill-zinc-950" aria-hidden="true" />
        </button>
      ) : null}

      {safeSrc ? (
      <div
        className={`absolute inset-x-0 bottom-0 z-30 flex items-center gap-2 bg-linear-to-t from-black/80 to-transparent px-3 pt-10 pb-3 motion-safe:transition-opacity sm:gap-3 sm:px-4 ${
          showChrome ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          disabled={!safeSrc || failed}
          onClick={togglePlay}
          className={`grid size-11 shrink-0 place-items-center rounded-full bg-white/15 text-white disabled:opacity-40 ${FOCUS}`}
        >
          {playing ? (
            <Pause className="size-5 fill-white" aria-hidden="true" />
          ) : (
            <Play className="size-5 translate-x-px fill-white" aria-hidden="true" />
          )}
        </button>

        <span className="shrink-0 text-xs font-semibold text-amber-50 tabular-nums">
          {formatClock(current)}
          <span className="text-white/50"> / {canSeek ? formatClock(duration) : "--:--"}</span>
        </span>

        <div
          ref={trackRef}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={canSeek ? Math.round(duration) : 0}
          aria-valuenow={Math.round(current)}
          aria-disabled={!canSeek}
          tabIndex={canSeek ? 0 : -1}
          onPointerDown={(event) => {
            if (!canSeek) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            setScrubbing(true);
            const next = timeAt(event.clientX);
            if (next !== null) seekTo(next);
          }}
          onPointerMove={(event) => {
            if (!scrubbing) return;
            const next = timeAt(event.clientX);
            if (next !== null) seekTo(next);
          }}
          onPointerUp={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
            setScrubbing(false);
            setHot(true);
          }}
          onPointerCancel={() => setScrubbing(false)}
          className={`relative h-11 min-w-0 flex-1 ${canSeek ? "cursor-pointer" : "cursor-not-allowed"} ${FOCUS}`}
        >
          <span className="absolute top-1/2 right-0 left-0 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/20">
            <span
              className="absolute inset-y-0 left-0 bg-white/35"
              style={{ width: `${bufferedPct}%` }}
            />
            <span className="absolute inset-y-0 left-0 bg-amber-400" style={{ width: `${played}%` }} />
          </span>
          <span
            className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.9)]"
            style={{ left: `${played}%` }}
          />
        </div>

        <button
          type="button"
          aria-label={muted ? "Unmute" : "Mute"}
          aria-pressed={muted}
          disabled={!safeSrc}
          onClick={toggleMute}
          className={`grid size-11 shrink-0 place-items-center rounded-full text-white disabled:opacity-40 ${FOCUS}`}
        >
          {muted ? (
            <VolumeX className="size-5" aria-hidden="true" />
          ) : (
            <Volume2 className="size-5" aria-hidden="true" />
          )}
        </button>

        <button
          type="button"
          aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          aria-pressed={fullscreen}
          disabled={!safeSrc}
          onClick={() => void toggleFullscreen()}
          className={`grid size-11 shrink-0 place-items-center rounded-full text-white disabled:opacity-40 ${FOCUS}`}
        >
          {fullscreen ? (
            <Minimize className="size-5" aria-hidden="true" />
          ) : (
            <Maximize className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>
      ) : null}
    </div>
  );
}
