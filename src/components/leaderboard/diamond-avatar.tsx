import Image from "next/image";
import type { LeaderboardFrame } from "@/data/leaderboard";

const FRAME_TONE: Record<LeaderboardFrame, string> = {
  orange: "border-orange-500 bg-orange-200",
  amber: "border-amber-500 bg-amber-200",
  sky: "border-sky-600 bg-sky-200",
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
        className={`absolute inset-[12%] rotate-45 rounded-md border-2 shadow-sm ${FRAME_TONE[frame]}`}
      />
      <span className="relative z-10 size-[72%] overflow-hidden rounded-full bg-stone-100 ring-2 ring-white">
        <Image src={src} alt="" fill sizes="72px" className="object-cover" />
      </span>
    </span>
  );
}
