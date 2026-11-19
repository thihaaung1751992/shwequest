/** Flat YouTube play-mark stickers for `/self-study/videos` backgrounds. */

export function YtMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 20"
      className={className}
      aria-hidden
      focusable="false"
    >
      <rect width="28" height="20" rx="5.5" fill="currentColor" />
      <path d="M11 5.6v8.8L19.2 10z" fill="#fff" />
    </svg>
  );
}

type DecoItem = {
  key: string;
  className: string;
};

const HERO_ITEMS: DecoItem[] = [
  {
    key: "h-yt-1",
    className: "right-[6%] top-[14%] size-14 text-red-500/15 -rotate-12 sm:size-16 dark:text-red-300/15",
  },
  {
    key: "h-yt-2",
    className: "bottom-[10%] left-[40%] size-10 text-red-500/10 rotate-6 hidden sm:block dark:text-red-300/10",
  },
];

const PAGE_ITEMS: DecoItem[] = [
  {
    key: "p-yt-1",
    className: "left-[2%] top-[10%] size-12 text-red-500/10 -rotate-10 sm:size-14 dark:text-red-400/10",
  },
  {
    key: "p-yt-2",
    className: "right-[3%] top-[45%] size-14 text-red-500/10 rotate-6 hidden sm:block dark:text-red-300/10",
  },
  {
    key: "p-yt-3",
    className: "left-[6%] top-[80%] size-10 text-red-500/8 rotate-0 hidden md:block dark:text-red-400/8",
  },
];

function renderItem(item: DecoItem) {
  return (
    <YtMark
      key={item.key}
      className={`pointer-events-none absolute ${item.className}`}
    />
  );
}

/** Stickers inside the videos hero / banner card only. */
export function SelfStudyVideosHeroDeco() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      {HERO_ITEMS.map(renderItem)}
    </div>
  );
}

/** Page-layer stickers only (no wash / film / glow). */
export function SelfStudyVideosPageDeco() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {PAGE_ITEMS.map(renderItem)}
    </div>
  );
}
