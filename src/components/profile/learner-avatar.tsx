import Image from "next/image";
import { isLearnerImageLocal } from "@/data/learner";

const FRAME = {
  hero: "size-36 rounded-[1.75rem] sm:size-44",
  strip: "size-7 rounded-full sm:size-8",
} as const;

const SIZES: Record<keyof typeof FRAME, string> = {
  hero: "176px",
  strip: "32px",
};

/** Portrait that supports static paths and local data URLs from photo pick. */
export default function LearnerAvatar({
  src,
  size,
  className = "",
}: {
  src: string;
  size: keyof typeof FRAME;
  className?: string;
}) {
  const local = isLearnerImageLocal(src);
  const cover =
    size === "strip"
      ? "object-cover"
      : "object-cover object-[center_18%]";
  const ring =
    size === "strip"
      ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-white dark:ring-amber-500 dark:ring-offset-slate-900"
      : "ring-4 ring-white shadow-md dark:ring-slate-900";

  return (
    <span
      className={`relative block shrink-0 overflow-hidden bg-amber-100 dark:bg-slate-800 ${ring} ${FRAME[size]} ${className}`}
    >
      {local ? (
        // eslint-disable-next-line @next/next/no-img-element -- data/blob URLs are client-only picks
        <img src={src} alt="" className={`absolute inset-0 size-full ${cover}`} />
      ) : (
        <Image src={src} alt="" fill sizes={SIZES[size]} className={cover} />
      )}
    </span>
  );
}
