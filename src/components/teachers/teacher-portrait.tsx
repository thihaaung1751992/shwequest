import Image from "next/image";

const FRAME = {
  hero: "size-56 rounded-[2rem] sm:size-64",
  feature: "size-44 rounded-[1.75rem] sm:size-48",
  card: "size-32 rounded-[1.4rem]",
  tile: "size-20 rounded-2xl sm:size-24",
  list: "size-14 rounded-xl",
} as const;

const SIZES: Record<keyof typeof FRAME, string> = {
  hero: "256px",
  feature: "192px",
  card: "128px",
  tile: "96px",
  list: "56px",
};

/** Prefer upper body/face when a full-height photo is cropped to a square. */
const COVER = "object-cover object-[center_18%]";

export default function TeacherPortrait({
  src,
  size,
}: {
  src: string;
  size: keyof typeof FRAME;
}) {
  return (
    <span
      className={`relative block shrink-0 overflow-hidden bg-stone-100 shadow-md ring-4 ring-white dark:bg-stone-800 dark:ring-slate-900 ${FRAME[size]}`}
    >
      <Image src={src} alt="" fill sizes={SIZES[size]} className={COVER} />
    </span>
  );
}
