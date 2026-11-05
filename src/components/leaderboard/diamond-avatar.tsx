import Image from "next/image";
import type { LeaderboardFrame } from "@/data/leaderboard";

/* The diamond is rotated 45°, so a 2px/2px offset lands as a straight lip below it. */
const FRAME_TONE: Record<LeaderboardFrame, string> = {
  orange:
    "from-orange-300 to-orange-500 shadow-[2.5px_2.5px_0_var(--color-orange-700),5px_5px_10px_-2px_rgb(0_0_0/0.3)]",
  amber:
    "from-amber-200 to-amber-400 shadow-[2.5px_2.5px_0_var(--color-amber-600),5px_5px_10px_-2px_rgb(0_0_0/0.3)]",
  sky: "from-sky-300 to-sky-500 shadow-[2.5px_2.5px_0_var(--color-sky-700),5px_5px_10px_-2px_rgb(0_0_0/0.3)]",
};

export default function DiamondAvatar({
  src,
  frame,
}: {
  src: string;
  frame: LeaderboardFrame;
}) {
  return (
    <span className="relative grid size-12 shrink-0 place-items-center sm:size-14">
      <span
        aria-hidden
        className={`absolute inset-[12%] rotate-45 rounded-lg border-2 border-white bg-linear-to-br dark:border-slate-800 ${FRAME_TONE[frame]}`}
      />
      <span className="relative z-10 size-[66%] overflow-hidden rounded-full bg-amber-50 shadow-[inset_0_2px_3px_rgb(0_0_0/0.2)] ring-2 ring-white dark:ring-slate-800">
        <Image src={src} alt="" fill sizes="40px" className="object-cover" />
      </span>
    </span>
  );
}
