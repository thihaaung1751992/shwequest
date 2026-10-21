/**
 * Full-cover shards with low-poly tone shifts (reference cracked glass).
 * Pieces separate on parent `.group` hover.
 */
const GLASS_SHARDS: {
  clip: string;
  tone: string;
  fly: string;
  delay: string;
}[] = [
  {
    clip: "polygon(0% 0%, 38% 0%, 34% 48%, 0% 52%)",
    tone: "bg-white/28",
    fly: "motion-safe:group-hover:-translate-x-[28%] motion-safe:group-hover:translate-y-[170%] motion-safe:group-hover:-rotate-[38deg]",
    delay: "0ms",
  },
  {
    clip: "polygon(38% 0%, 72% 0%, 68% 42%, 34% 48%)",
    tone: "bg-white/16",
    fly: "motion-safe:group-hover:-translate-x-[8%] motion-safe:group-hover:translate-y-[155%] motion-safe:group-hover:rotate-[18deg]",
    delay: "35ms",
  },
  {
    clip: "polygon(72% 0%, 100% 0%, 100% 46%, 68% 42%)",
    tone: "bg-white/26",
    fly: "motion-safe:group-hover:translate-x-[12%] motion-safe:group-hover:translate-y-[165%] motion-safe:group-hover:rotate-[32deg]",
    delay: "55ms",
  },
  {
    clip: "polygon(0% 52%, 34% 48%, 28% 100%, 0% 100%)",
    tone: "bg-white/14",
    fly: "motion-safe:group-hover:translate-x-[4%] motion-safe:group-hover:translate-y-[185%] motion-safe:group-hover:-rotate-[12deg]",
    delay: "20ms",
  },
  {
    clip: "polygon(34% 48%, 68% 42%, 74% 100%, 28% 100%)",
    tone: "bg-white/22",
    fly: "motion-safe:group-hover:translate-x-[32%] motion-safe:group-hover:translate-y-[160%] motion-safe:group-hover:rotate-[42deg]",
    delay: "70ms",
  },
  {
    clip: "polygon(68% 42%, 100% 46%, 100% 100%, 74% 100%)",
    tone: "bg-white/20",
    fly: "motion-safe:group-hover:-translate-x-[18%] motion-safe:group-hover:translate-y-[200%] motion-safe:group-hover:rotate-[8deg]",
    delay: "45ms",
  },
];

const CRACK_MAIN =
  "M0 20 L14 14 L22 8 L34 16 L38 26 L50 12 L62 18 L74 8 L92 22 L104 12 L120 18";
const CRACK_BRANCH =
  "M22 8 L28 0 M38 26 L30 40 M62 18 L70 0 M74 8 L80 0 M92 22 L100 40 M50 12 L54 28";

/**
 * Reference look: frost + low-poly shards under label; white cracks (thin dark rim)
 * over the label. Parent must be `group relative overflow-hidden` (any radius —
 * frost uses rounded-[inherit]). Shards fall on `.group` hover.
 */
export default function FrostGlass() {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-[inherit] group-hover:overflow-visible"
      >
        <span className="absolute inset-0 rounded-[inherit] border border-white/55 bg-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.65)] backdrop-blur-[3px] transition duration-300 delay-300 ease-out group-hover:border-transparent group-hover:bg-transparent group-hover:opacity-0 group-hover:shadow-none group-hover:backdrop-blur-none group-hover:delay-0 group-hover:duration-200 motion-reduce:transition-none" />
        {GLASS_SHARDS.map((shard) => (
          <span
            key={shard.clip}
            className={`absolute inset-0 origin-center will-change-transform transition duration-500 ease-out motion-safe:group-hover:opacity-0 motion-safe:group-hover:ease-in motion-reduce:transition-none ${shard.tone} ${shard.fly}`}
            style={{ clipPath: shard.clip, transitionDelay: shard.delay }}
          />
        ))}
      </span>
      {/*
        Cracks: vanish fast on shatter; wait for shards to settle before
        fading back in (delay only on the reverse of group-hover).
      */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[11] size-full transition-opacity duration-250 delay-[380ms] ease-out group-hover:opacity-0 group-hover:delay-0 group-hover:duration-150 motion-reduce:transition-none"
        viewBox="0 0 120 44"
        preserveAspectRatio="none"
      >
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            d={CRACK_MAIN}
            stroke="rgba(15,23,42,0.4)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={CRACK_MAIN}
            stroke="white"
            strokeWidth="1.05"
            opacity="0.95"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={CRACK_BRANCH}
            stroke="rgba(15,23,42,0.32)"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={CRACK_BRANCH}
            stroke="white"
            strokeWidth="0.85"
            opacity="0.9"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </>
  );
}
