"use client";

import { Camera, Check, Pencil, Sparkle, X } from "lucide-react";
import { useRef } from "react";
import LearnerAvatar from "@/components/profile/learner-avatar";
import {
  PHOTO_MAX_BYTES,
  type ProfileDraft,
} from "@/components/profile/profile-draft";
import { PROFILE_FOCUS } from "@/components/profile/profile-focus";
import { useMessages } from "@/i18n/locale-context";

type HeroKey = "displayName" | "bio" | "image";

type ProfileHeroCardProps = {
  editingKey: keyof ProfileDraft | null;
  draftValue: string;
  displayName: string;
  bio: string;
  image: string;
  photoError: string | null;
  savedFlash: boolean;
  onDraftValueChange: (next: string) => void;
  onPhotoError: (message: string | null) => void;
  onStartEdit: (key: HeroKey) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
};

const PENCIL_BUTTON = `inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-amber-800 hover:bg-amber-100 dark:text-amber-200 dark:hover:bg-white/10 ${PROFILE_FOCUS}`;

/** Always English — same candy glyphs as the home hero orbit letters. */
const COVER_LINES = [
  { text: "CHECK YOUR", size: "text-xl sm:text-3xl lg:text-4xl" },
  { text: "PROFILE", size: "text-5xl sm:text-7xl lg:text-8xl" },
] as const;
const COVER_TONES = [
  "hero-glyph-orange",
  "hero-glyph-emerald",
  "hero-glyph-amber",
  "hero-glyph-sky",
] as const;
const COVER_TILTS = [
  "-rotate-6",
  "rotate-3",
  "-rotate-2",
  "rotate-5",
  "-rotate-4",
  "rotate-2",
  "rotate-4",
  "-rotate-3",
] as const;

/** Per line, each char's running letter index across lines (-1 for spaces). */
const COVER_GLYPH_INDEX = (() => {
  let next = 0;
  return COVER_LINES.map((line) =>
    line.text.split("").map((char) => (char === " " ? -1 : next++)),
  );
})();

function ProfileCoverLetters() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-2 flex h-[62%] flex-col items-center justify-center gap-1 px-3 sm:h-[88%] sm:items-end sm:gap-2 sm:pr-8 sm:pl-[22%] lg:pr-12">
      {COVER_LINES.map((line, lineIndex) => (
        <p
          key={line.text}
          className={`cover-sticker flex items-center gap-x-[0.06em] leading-none font-black tracking-tight ${line.size}`}
        >
          {line.text.split("").map((char, index) => {
            const glyphIndex = COVER_GLYPH_INDEX[lineIndex]![index]!;
            if (glyphIndex < 0) {
              return (
                <span
                  key={`space-${index}`}
                  className="inline-block w-[0.35em]"
                  aria-hidden
                />
              );
            }
            const tone = COVER_TONES[glyphIndex % COVER_TONES.length]!;
            const tilt = COVER_TILTS[glyphIndex % COVER_TILTS.length]!;
            const delay = `${glyphIndex * -0.22}s`;
            return (
              <span
                key={`${char}-${index}`}
                data-glyph={char}
                style={{ animationDelay: delay }}
                className={`hero-glyph puzzle-glyph ${tone} ${tilt} motion-safe:animate-cover-bob motion-reduce:rotate-none`}
              >
                {char}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}

export default function ProfileHeroCard({
  editingKey,
  draftValue,
  displayName,
  bio,
  image,
  photoError,
  savedFlash,
  onDraftValueChange,
  onPhotoError,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
}: ProfileHeroCardProps) {
  const copy = useMessages();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editingImage = editingKey === "image";
  const editingName = editingKey === "displayName";
  const editingBio = editingKey === "bio";
  const shownImage = editingImage ? draftValue : image;

  function onPickPhoto(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      onPhotoError(copy.profile.photoTypeError);
      return;
    }
    if (file.size > PHOTO_MAX_BYTES) {
      onPhotoError(copy.profile.photoSizeError);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      onDraftValueChange(reader.result);
      onPhotoError(null);
    };
    reader.readAsDataURL(file);
  }

  const heroEditing = editingName || editingBio || editingImage;

  const editActions = (
    <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
      <button
        type="button"
        onClick={onSaveEdit}
        disabled={editingName && !draftValue.trim()}
        className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-emerald-600 px-3 text-xs font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 ${PROFILE_FOCUS}`}
      >
        <Check className="size-3.5" aria-hidden />
        {copy.profile.save}
      </button>
      <button
        type="button"
        onClick={onCancelEdit}
        className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl border-2 border-amber-200 bg-white px-3 text-xs font-extrabold text-amber-950 dark:border-white/15 dark:bg-white/5 dark:text-amber-50 ${PROFILE_FOCUS}`}
      >
        <X className="size-3.5" aria-hidden />
        {copy.profile.cancel}
      </button>
    </div>
  );

  return (
    <section className="bento-tile overflow-hidden">
      <div aria-hidden className="profile-cover h-44 rounded-t-[1.75rem] sm:h-56">
        <span className="absolute -top-10 left-[12%] size-40 rounded-full bg-amber-300/60 blur-2xl [--drift-x:3rem] [--drift-y:1.5rem] motion-safe:animate-videos-drift dark:bg-amber-500/25" />
        <span className="absolute -right-6 -bottom-12 size-48 rounded-full bg-sky-300/50 blur-2xl [--drift-x:-3rem] [--drift-y:-1rem] motion-safe:animate-videos-drift dark:bg-sky-500/20" />
        <span className="absolute top-6 left-[30%] hidden size-20 rounded-full border-[6px] border-white/45 sm:block dark:border-white/10" />
        <Sparkle className="absolute top-4 left-[6%] size-7 fill-white text-white drop-shadow-[0_2px_4px_rgb(180_83_9/0.35)] motion-safe:animate-videos-float dark:fill-amber-200 dark:text-amber-200" />
        <Sparkle className="absolute top-[38%] left-[18%] hidden size-4 fill-amber-400 text-amber-400 [animation-delay:-2s] motion-safe:animate-videos-float sm:block" />
        <Sparkle className="absolute right-[4%] bottom-5 size-5 fill-sky-400 text-sky-400 [animation-delay:-4s] motion-safe:animate-videos-float" />
        <ProfileCoverLetters />
      </div>

      <div className="relative px-5 pb-6 sm:px-8 sm:pb-8">
        {savedFlash ? (
          <p
            className="stat-chip-3d pill-3d-emerald-deep absolute -top-12 right-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold text-white sm:right-6"
            role="status"
          >
            <Check className="size-4" aria-hidden />
            {copy.profile.saved}
          </p>
        ) : null}

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
          <div className="relative -mt-16 shrink-0 sm:-mt-20">
            <span
              className={`block rounded-[2rem] bg-linear-to-br from-amber-300 via-orange-400 to-sky-400 p-1 shadow-[0_14px_28px_-12px_rgb(180_83_9/0.55)] dark:from-amber-400 dark:via-orange-500 dark:to-sky-500 ${
                editingImage ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900" : ""
              }`}
            >
              <LearnerAvatar src={shownImage} size="hero" />
            </span>
            {editingImage ? (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => onPickPhoto(event.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`absolute -right-2 -bottom-2 inline-flex size-10 items-center justify-center rounded-full bg-amber-950 text-amber-50 shadow-md ring-4 ring-white dark:bg-amber-300 dark:text-amber-950 dark:ring-slate-900 ${PROFILE_FOCUS}`}
                  aria-label={copy.profile.changePhoto}
                >
                  <Camera className="size-4" aria-hidden />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => onStartEdit("image")}
                aria-label={`${copy.profile.edit}: ${copy.profile.changePhoto}`}
                className={`absolute -right-2 -bottom-2 inline-flex size-10 items-center justify-center rounded-full bg-amber-950 text-amber-50 shadow-md ring-4 ring-white dark:bg-amber-300 dark:text-amber-950 dark:ring-slate-900 ${PROFILE_FOCUS}`}
              >
                <Camera className="size-4" aria-hidden />
              </button>
            )}
            {editingImage ? (
              <div className="mt-3 flex justify-center sm:justify-start">{editActions}</div>
            ) : null}
          </div>

          <div className="flex w-full min-w-0 flex-1 flex-col items-center text-center sm:items-start sm:pb-1 sm:text-left">
            {editingName ? (
              <div className="w-full max-w-md rounded-2xl bg-amber-50 p-2 ring-2 ring-amber-300 dark:bg-white/5 dark:ring-amber-400/40">
                <input
                  aria-label={copy.profile.name}
                  value={draftValue}
                  onChange={(event) => onDraftValueChange(event.target.value)}
                  className={`w-full min-w-0 rounded-xl border-2 border-amber-200 bg-white px-3 py-2 text-center text-2xl font-black tracking-tight text-zinc-900 outline-hidden sm:text-left sm:text-3xl dark:border-white/15 dark:bg-slate-950 dark:text-zinc-50 ${PROFILE_FOCUS}`}
                />
                {editActions}
              </div>
            ) : (
              <div className="flex max-w-full items-start gap-2">
                <h2 className="text-3xl font-black tracking-tight wrap-break-word sm:text-4xl">
                  {displayName}
                </h2>
                {!heroEditing ? (
                  <button
                    type="button"
                    onClick={() => onStartEdit("displayName")}
                    aria-label={`${copy.profile.edit}: ${copy.profile.name}`}
                    className={`mt-1 ${PENCIL_BUTTON}`}
                  >
                    <Pencil className="size-3.5" aria-hidden />
                  </button>
                ) : null}
              </div>
            )}

            {editingBio ? (
              <div className="mt-2 w-full max-w-lg rounded-2xl bg-amber-50 p-2 ring-2 ring-amber-300 dark:bg-white/5 dark:ring-amber-400/40">
                <textarea
                  aria-label={copy.profile.bio}
                  value={draftValue}
                  rows={2}
                  onChange={(event) => onDraftValueChange(event.target.value)}
                  className={`w-full min-w-0 resize-y rounded-xl border-2 border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 outline-hidden dark:border-white/15 dark:bg-slate-950 dark:text-zinc-200 ${PROFILE_FOCUS}`}
                />
                {editActions}
              </div>
            ) : (
              <div className="mt-1.5 flex max-w-xl items-start gap-2">
                <p
                  className={`text-sm font-semibold sm:text-base ${
                    bio.trim()
                      ? "text-zinc-600 dark:text-zinc-300"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  {bio.trim() || "—"}
                </p>
                {!heroEditing ? (
                  <button
                    type="button"
                    onClick={() => onStartEdit("bio")}
                    aria-label={`${copy.profile.edit}: ${copy.profile.bio}`}
                    className={PENCIL_BUTTON}
                  >
                    <Pencil className="size-3.5" aria-hidden />
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {photoError ? (
          <p
            className="mt-4 text-center text-sm font-bold text-rose-700 sm:text-left dark:text-rose-300"
            role="alert"
          >
            {photoError}
          </p>
        ) : null}
      </div>
    </section>
  );
}
