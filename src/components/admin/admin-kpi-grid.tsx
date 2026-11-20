import type { AdminKpi } from "@/data/admin-metrics";
import { BookOpen, Clapperboard, Trophy, Users } from "lucide-react";

const TONE: Record<
  AdminKpi["tone"],
  { chip: string; icon: string; Icon: typeof BookOpen }
> = {
  emerald: {
    chip: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
    icon: "text-emerald-600 dark:text-emerald-400",
    Icon: BookOpen,
  },
  sky: {
    chip: "bg-sky-500/15 text-sky-800 dark:text-sky-300",
    icon: "text-sky-600 dark:text-sky-400",
    Icon: Clapperboard,
  },
  amber: {
    chip: "bg-amber-500/15 text-amber-900 dark:text-amber-300",
    icon: "text-amber-600 dark:text-amber-400",
    Icon: Users,
  },
  orange: {
    chip: "bg-orange-500/15 text-orange-900 dark:text-orange-300",
    icon: "text-orange-600 dark:text-orange-400",
    Icon: Trophy,
  },
};

export default function AdminKpiGrid({ kpis }: { kpis: readonly AdminKpi[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const tone = TONE[kpi.tone];
        const Icon = tone.Icon;
        return (
          <li
            key={kpi.id}
            className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:border-white/10 dark:bg-slate-900/80"
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className={`inline-flex size-9 items-center justify-center rounded-xl ${tone.chip}`}
              >
                <Icon className={`size-4.5 ${tone.icon}`} aria-hidden strokeWidth={2.25} />
              </span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[0.65rem] font-bold tracking-wide text-zinc-500 uppercase dark:bg-white/10 dark:text-zinc-400">
                Demo
              </span>
            </div>
            <p className="mt-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              {kpi.label}
            </p>
            <p className="mt-1 font-mono text-3xl font-black tracking-tight text-zinc-900 tabular-nums dark:text-zinc-50">
              {kpi.value.toLocaleString("en-US")}
            </p>
            <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {kpi.hint}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
