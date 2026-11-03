"use client";

import {
  Maximize,
  Minimize,
  Pause,
  PictureInPicture2,
  Play,
  Repeat,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const FOCUS =
  "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200";

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

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
  const rateRef = useRef<HTMLDivElement>(null);
  const volumeBeforeMute = useRef(1);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ended, setEnded] = useState(false);
  const [hot, setHot] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const [rate, setRate] = useState(1);
  const [rateOpen, setRateOpen] = useState(false);
  const [looping, setLooping] = useState(false);
  const [pip, setPip] = useState(false);
  const pipOk = useSyncExternalStore(
    () => () => {},
    () =>
      document.pictureInPictureEnabled === true &&
      typeof HTMLVideoElement !== "undefined" &&
      "requestPictureInPicture" in HTMLVideoElement.prototype,
    () => false,
  );

  const canSeek = Number.isFinite(duration) && duration > 0 && !failed;
  const showChrome = coarse || !playing || hot || scrubbing || waiting || failed || rateOpen || !safeSrc;

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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    function onEnter() {
      setPip(true);
    }
    function onLeave() {
      setPip(false);
    }
    video.addEventListener("enterpictureinpicture", onEnter);
    video.addEventListener("leavepictureinpicture", onLeave);
    return () => {
      video.removeEventListener("enterpictureinpicture", onEnter);
      video.removeEventListener("leavepictureinpicture", onLeave);
    };
  }, [safeSrc]);

  useEffect(() => {
    if (!rateOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (!rateRef.current?.contains(event.target as Node | null)) setRateOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [rateOpen]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video || !safeSrc || failed) return;
    if (ended || video.ended) {
      video.currentTime = 0;
      setCurrent(0);
      setEnded(false);
      void video.play().catch(() => setFailed(true));
      return;
    }
    if (video.paused) {
      void video.play().catch(() => setFailed(true));
    } else {
      video.pause();
    }
  }

  function applyVolume(next: number) {
    const video = videoRef.current;
    const clamped = Math.min(1, Math.max(0, next));
    if (clamped > 0) volumeBeforeMute.current = clamped;
    if (video) {
      video.volume = clamped;
      video.muted = clamped === 0;
    }
    setVolume(clamped);
    setMuted(clamped === 0);
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    if (muted || video.muted || volume === 0) {
      const restore = volumeBeforeMute.current > 0 ? volumeBeforeMute.current : 1;
      video.volume = restore;
      video.muted = false;
      setVolume(restore);
      setMuted(false);
    } else {
      volumeBeforeMute.current = volume > 0 ? volume : 1;
      video.muted = true;
      setMuted(true);
    }
  }

  function seekTo(next: number) {
    const video = videoRef.current;
    if (!video || !canSeek) return;
    const clamped = Math.min(Math.max(next, 0), duration);
    video.currentTime = clamped;
    setCurrent(clamped);
    setEnded(false);
  }

  function timeAt(clientX: number): number | null {
    const track = trackRef.current;
    if (!track || !canSeek) return null;
    const rect = track.getBoundingClientRect();
    if (rect.width <= 0) return null;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return ratio * duration;
  }

  function chooseRate(next: number) {
    const video = videoRef.current;
    if (video) video.playbackRate = next;
    setRate(next);
    setRateOpen(false);
  }

  function toggleLoop() {
    const video = videoRef.current;
    if (!video) return;
    video.loop = !video.loop;
    setLooping(video.loop);
  }

  async function togglePip() {
    const video = videoRef.current;
    if (!video || !pipOk) return;
    try {
      if (document.pictureInPictureElement === video) await document.exitPictureInPicture();
      else await video.requestPictureInPicture();
    } catch {
      setPip(document.pictureInPictureElement === video);
    }
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
    if (event.key === "Escape" && rateOpen) {
      event.preventDefault();
      setRateOpen(false);
      return;
    }
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
  const iconBtn = `grid size-11 shrink-0 place-items-center rounded-full text-white disabled:opacity-40 ${FOCUS}`;
  const volumeShown = muted ? 0 : volume;

  return (
    <div
      ref={shellRef}
      tabIndex={safeSrc ? 0 : -1}
      onKeyDown={onKeyDown}
      onPointerEnter={() => setHot(true)}
      onPointerLeave={() => {
        if (!scrubbing && !rateOpen) setHot(false);
      }}
      onFocus={() => setHot(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHot(false);
      }}
      className="group relative w-full overflow-hidden rounded-2xl bg-zinc-950 shadow-2xl ring-1 ring-amber-200/50 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 sm:aspect-video"
    >
      <div className="relative aspect-video">
      {safeSrc ? (
        <video
          ref={videoRef}
          src={safeSrc}
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-contain"
          onPlay={() => {
            setPlaying(true);
            setEnded(false);
          }}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setEnded(true);
            setPlaying(false);
          }}
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
          aria-label={ended ? "Replay" : "Play"}
          onClick={togglePlay}
          className={`absolute top-1/2 left-1/2 z-20 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-amber-400 text-zinc-950 shadow-[0_0_40px_rgba(251,191,36,0.55)] motion-safe:transition-transform motion-safe:hover:scale-105 ${FOCUS}`}
        >
          {ended ? (
            <RotateCcw className="size-8" aria-hidden="true" />
          ) : (
            <Play className="size-9 translate-x-0.5 fill-zinc-950" aria-hidden="true" />
          )}
        </button>
      ) : null}
      </div>

      {safeSrc ? (
        <div
          className={`relative z-30 bg-zinc-950 px-3 pt-2 pb-3 motion-safe:transition-opacity sm:absolute sm:inset-x-0 sm:bottom-0 sm:bg-transparent sm:bg-linear-to-t sm:from-black/80 sm:to-transparent sm:px-4 sm:pt-10 ${
            showChrome ? "opacity-100" : "pointer-events-none opacity-0 max-sm:hidden"
          }`}
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
              <button
                type="button"
                aria-label={playing ? "Pause" : ended ? "Replay" : "Play"}
                disabled={failed}
                onClick={togglePlay}
                className={`grid size-11 shrink-0 place-items-center rounded-full bg-white/15 text-white disabled:opacity-40 ${FOCUS}`}
              >
                {playing ? (
                  <Pause className="size-5 fill-white" aria-hidden="true" />
                ) : ended ? (
                  <RotateCcw className="size-5" aria-hidden="true" />
                ) : (
                  <Play className="size-5 translate-x-px fill-white" aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                aria-label="Back 10 seconds"
                disabled={!canSeek}
                onClick={() => seekTo(current - 10)}
                className={iconBtn}
              >
                <SkipBack className="size-5 fill-white" aria-hidden="true" />
              </button>

              <button
                type="button"
                aria-label="Forward 10 seconds"
                disabled={!canSeek}
                onClick={() => seekTo(current + 10)}
                className={iconBtn}
              >
                <SkipForward className="size-5 fill-white" aria-hidden="true" />
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
                  <span className="absolute inset-y-0 left-0 bg-white/35" style={{ width: `${bufferedPct}%` }} />
                  <span className="absolute inset-y-0 left-0 bg-amber-400" style={{ width: `${played}%` }} />
                </span>
                <span
                  className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.9)]"
                  style={{ left: `${played}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                aria-label={muted ? "Unmute" : "Mute"}
                aria-pressed={muted}
                onClick={toggleMute}
                className={iconBtn}
              >
                {muted || volumeShown === 0 ? (
                  <VolumeX className="size-5" aria-hidden="true" />
                ) : volumeShown < 0.5 ? (
                  <Volume1 className="size-5" aria-hidden="true" />
                ) : (
                  <Volume2 className="size-5" aria-hidden="true" />
                )}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volumeShown}
                aria-label="Volume"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(volumeShown * 100)}
                aria-valuetext={`${Math.round(volumeShown * 100)} percent`}
                onChange={(event) => applyVolume(Number(event.target.value))}
                className="h-1.5 w-16 shrink-0 cursor-pointer accent-amber-400 sm:w-20"
              />

              <div ref={rateRef} className="relative">
                <button
                  type="button"
                  aria-label="Playback speed"
                  aria-expanded={rateOpen}
                  aria-haspopup="menu"
                  onClick={() => setRateOpen((open) => !open)}
                  className={`h-11 min-w-11 shrink-0 rounded-full px-2 text-xs font-bold text-white tabular-nums ${FOCUS}`}
                >
                  {rate}×
                </button>
                {rateOpen ? (
                  <div
                    role="menu"
                    aria-label="Playback speed"
                    className="absolute bottom-12 left-1/2 z-40 flex -translate-x-1/2 flex-col gap-1 rounded-xl bg-zinc-950/95 p-1 ring-1 ring-white/20"
                  >
                    {RATES.map((value) => (
                      <button
                        key={value}
                        type="button"
                        role="menuitemradio"
                        aria-checked={rate === value}
                        onClick={() => chooseRate(value)}
                        className={`rounded-lg px-3 py-2 text-left text-xs font-bold tabular-nums ${
                          rate === value ? "bg-amber-400 text-zinc-950" : "text-white"
                        } ${FOCUS}`}
                      >
                        {value}×
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                aria-label="Loop"
                aria-pressed={looping}
                onClick={toggleLoop}
                className={`${iconBtn} ${looping ? "bg-white/15" : ""}`}
              >
                <Repeat className="size-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                aria-label={pip ? "Exit picture in picture" : "Picture in picture"}
                aria-pressed={pip}
                disabled={!pipOk}
                onClick={() => void togglePip()}
                className={iconBtn}
              >
                <PictureInPicture2 className="size-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                aria-label="Replay"
                disabled={!canSeek || !ended}
                onClick={togglePlay}
                className={iconBtn}
              >
                <RotateCcw className="size-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                aria-pressed={fullscreen}
                onClick={() => void toggleFullscreen()}
                className={iconBtn}
              >
                {fullscreen ? (
                  <Minimize className="size-5" aria-hidden="true" />
                ) : (
                  <Maximize className="size-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
