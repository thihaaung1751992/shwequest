import type { AdminTrendPoint } from "@/data/admin-metrics";

const W = 640;
const H = 220;
const PAD = { t: 16, r: 12, b: 28, l: 36 };

export default function AdminTrendChart({
  points,
}: {
  points: readonly AdminTrendPoint[];
}) {
  const max = Math.max(...points.map((p) => p.value), 1);
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const coords = points.map((point, i) => {
    const x =
      PAD.l + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
    const y = PAD.t + innerH - (point.value / max) * innerH;
    return { ...point, x, y };
  });

  const line = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L ${coords[coords.length - 1].x.toFixed(1)} ${(PAD.t + innerH).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(PAD.t + innerH).toFixed(1)} Z`;

  return (
    <section
      aria-labelledby="admin-trend-heading"
      className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:border-white/10 dark:bg-slate-900/80 sm:p-5"
    >
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[0.65rem] font-bold tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
            Catalog pulse
          </p>
          <h2
            id="admin-trend-heading"
            className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Weekly content weight
          </h2>
        </div>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Scaled from lesson sections + playlists · not live traffic
        </p>
      </div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Weekly content weight trend"
          className="h-auto w-full min-w-[20rem] text-emerald-600 dark:text-emerald-400"
        >
          {[0.25, 0.5, 0.75, 1].map((frac) => {
            const y = PAD.t + innerH * (1 - frac);
            return (
              <line
                key={frac}
                x1={PAD.l}
                x2={W - PAD.r}
                y1={y}
                y2={y}
                className="stroke-zinc-200 dark:stroke-white/10"
                strokeWidth={1}
              />
            );
          })}
          <path d={area} className="fill-emerald-500/15 dark:fill-emerald-400/15" />
          <path
            d={line}
            fill="none"
            className="stroke-current"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {coords.map((c) => (
            <g key={c.label}>
              <circle
                cx={c.x}
                cy={c.y}
                r={4}
                className="fill-white stroke-current dark:fill-slate-900"
                strokeWidth={2}
              />
              <text
                x={c.x}
                y={H - 8}
                textAnchor="middle"
                className="fill-zinc-500 text-[11px] font-semibold dark:fill-zinc-400"
              >
                {c.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
