import Link from "next/link";
import type { AdminActivityRow, AdminActivityStatus } from "@/data/admin-metrics";
import { ArrowUpRight, CircleDashed, CircleDot, Sparkles } from "lucide-react";

const STATUS: Record<
  AdminActivityStatus,
  { label: string; className: string; Icon: typeof CircleDot }
> = {
  live: {
    label: "Live",
    className:
      "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300",
    Icon: CircleDot,
  },
  soon: {
    label: "Soon",
    className:
      "bg-amber-500/15 text-amber-900 dark:bg-amber-400/15 dark:text-amber-300",
    Icon: CircleDashed,
  },
  demo: {
    label: "Demo",
    className:
      "bg-sky-500/15 text-sky-900 dark:bg-sky-400/15 dark:text-sky-300",
    Icon: Sparkles,
  },
};

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

export default function AdminActivityTable({
  rows,
}: {
  rows: readonly AdminActivityRow[];
}) {
  return (
    <section
      aria-labelledby="admin-activity-heading"
      className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:border-white/10 dark:bg-slate-900/80"
    >
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-zinc-200/80 px-4 py-4 dark:border-white/10 sm:px-5">
        <div>
          <p className="text-[0.65rem] font-bold tracking-wide text-sky-700 uppercase dark:text-sky-400">
            Catalog index
          </p>
          <h2
            id="admin-activity-heading"
            className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Content &amp; people
          </h2>
        </div>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {rows.length} rows · admin or public links
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200/80 text-[0.7rem] font-bold tracking-wide text-zinc-500 uppercase dark:border-white/10 dark:text-zinc-400">
              <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                Name
              </th>
              <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                Kind
              </th>
              <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-right font-bold sm:px-5">
                Open
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const status = STATUS[row.status];
              const StatusIcon = status.Icon;
              return (
                <tr
                  key={row.id}
                  className="border-b border-zinc-100 last:border-0 dark:border-white/5"
                >
                  <td className="max-w-[16rem] truncate px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-50 sm:px-5">
                    {row.label}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300 sm:px-5">
                    {row.kind}
                  </td>
                  <td className="px-4 py-3 sm:px-5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${status.className}`}
                    >
                      <StatusIcon className="size-3.5" aria-hidden strokeWidth={2.25} />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right sm:px-5">
                    <Link
                      href={row.href}
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-sky-700 transition-colors hover:bg-sky-500/10 dark:text-sky-300 ${FOCUS}`}
                    >
                      View
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
