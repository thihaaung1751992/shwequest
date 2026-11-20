"use client";

import { Camera, Check, Pencil, X } from "lucide-react";
import { useRef } from "react";
import FrostGlass from "@/components/frost-glass";
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

  return (
    <section className="bento-tile overflow-hidden">
      <div aria-hidden className="profile-cover h-32 sm:h-44">
        <span className="absolute -top-10 left-[12%] size-40 rounded-full bg-amber-300/60 blur-2xl [--drift-x:3rem] [--drift-y:1.5rem] motion-safe:animate-videos-drift dark:bg-amber-500/25" />
        <span className="absolute -right-6 -bottom-12 size-48 rounded-full bg-sky-300/50 blur-2xl [--drift-x:-3rem] [--drift-y:-1rem] motion-safe:animate-videos-drift dark:bg-sky-500/20" />
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
            <span className="block rounded-[2rem] bg-linear-to-br from-amber-300 via-orange-400 to-sky-400 p-1 shadow-[0_14px_28px_-12px_rgb(180_83_9/0.55)] dark:from-amber-400 dark:via-orange-500 dark:to-sky-500">
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
                  className={`absolute -right-2 -bottom-2 inline-flex min-h-10 items-center gap-1.5 rounded-full bg-amber-950 px-3 text-xs font-black text-amber-50 shadow-md ring-4 ring-white dark:bg-amber-300 dark:text-amber-950 dark:ring-slate-900 ${PROFILE_FOCUS}`}
                >
                  <Camera className="size-3.5" aria-hidden />
                  {copy.profile.changePhoto}
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
          </div>

          <div className="flex w-full min-w-0 flex-1 flex-col items-center text-center sm:items-start sm:pb-1 sm:text-left">
            {editingName ? (
              <input
                aria-label={copy.profile.name}
                value={draftValue}
                onChange={(event) => onDraftValueChange(event.target.value)}
                className={`w-full max-w-md rounded-2xl border-2 border-amber-200 bg-white px-4 py-2.5 text-center text-2xl font-black tracking-tight text-zinc-900 outline-hidden sm:text-left sm:text-3xl dark:border-white/15 dark:bg-slate-950 dark:text-zinc-50 ${PROFILE_FOCUS}`}
              />
            ) : (
              <div className="flex max-w-full items-start gap-2">
                <h2 className="text-3xl font-black tracking-tight wrap-break-word sm:text-4xl">
                  {displayName}
                </h2>
                <button
                  type="button"
                  onClick={() => onStartEdit("displayName")}
                  aria-label={`${copy.profile.edit}: ${copy.profile.name}`}
                  className={`mt-1 ${PENCIL_BUTTON}`}
                >
                  <Pencil className="size-3.5" aria-hidden />
                </button>
              </div>
            )}

            {editingBio ? (
              <textarea
                aria-label={copy.profile.bio}
                value={draftValue}
                rows={2}
                onChange={(event) => onDraftValueChange(event.target.value)}
                className={`mt-3 w-full max-w-lg resize-y rounded-2xl border-2 border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 outline-hidden dark:border-white/15 dark:bg-slate-950 dark:text-zinc-200 ${PROFILE_FOCUS}`}
              />
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
                <button
                  type="button"
                  onClick={() => onStartEdit("bio")}
                  aria-label={`${copy.profile.edit}: ${copy.profile.bio}`}
                  className={PENCIL_BUTTON}
                >
                  <Pencil className="size-3.5" aria-hidden />
                </button>
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

        {editingName || editingBio || editingImage ? (
          <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
            <button
              type="button"
              onClick={onSaveEdit}
              disabled={editingName && !draftValue.trim()}
              className={`group relative inline-flex min-h-12 items-center gap-2 overflow-hidden rounded-2xl px-5 font-extrabold text-white transition-[translate,box-shadow,overflow] motion-safe:hover:overflow-visible cta-3d cta-3d-emerald disabled:cursor-not-allowed disabled:opacity-50 ${PROFILE_FOCUS}`}
            >
              <FrostGlass />
              <Check aria-hidden className="relative z-10 size-4" />
              <span className="relative z-10">{copy.profile.save}</span>
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              className={`pill-3d pill-3d-amber inline-flex min-h-12 items-center gap-2 rounded-2xl px-5 font-extrabold text-amber-950 ${PROFILE_FOCUS}`}
            >
              <X aria-hidden className="size-4" />
              {copy.profile.cancel}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
