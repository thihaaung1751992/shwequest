import Link from "next/link";
import AdminActivityTable from "@/components/admin/admin-activity-table";
import AdminKpiGrid from "@/components/admin/admin-kpi-grid";
import AdminTrendChart from "@/components/admin/admin-trend-chart";
import { getAdminMetrics } from "@/data/admin-metrics";
import { BUILDERS } from "@/data/team";

export default function AdminPage() {
  const metrics = getAdminMetrics();
  const liveBuilders = BUILDERS.filter((b) => Boolean(b.profile)).length;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <section className="rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-900/60 sm:p-5">
        <p className="text-[0.65rem] font-bold tracking-wide text-amber-700 uppercase dark:text-amber-400">
          Demo catalog
        </p>
        <p className="mt-1 max-w-2xl text-sm font-medium text-zinc-600 dark:text-zinc-300">
          Shwequest ops snapshot from static lesson, video, teacher, and team
          data. Numbers are catalog counts — not live analytics. Site gate
          protects the app; this screen has no separate admin role yet.
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-zinc-50 px-3 py-2 dark:bg-white/5">
            <dt className="text-[0.65rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              Path videos
            </dt>
            <dd className="font-mono text-lg font-black tabular-nums text-zinc-900 dark:text-zinc-50">
              {metrics.catalog.videos}
            </dd>
          </div>
          <div className="rounded-xl bg-zinc-50 px-3 py-2 dark:bg-white/5">
            <dt className="text-[0.65rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              Path games
            </dt>
            <dd className="font-mono text-lg font-black tabular-nums text-zinc-900 dark:text-zinc-50">
              {metrics.catalog.games}
            </dd>
          </div>
          <div className="rounded-xl bg-zinc-50 px-3 py-2 dark:bg-white/5">
            <dt className="text-[0.65rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              Builders live
            </dt>
            <dd className="font-mono text-lg font-black tabular-nums text-zinc-900 dark:text-zinc-50">
              {liveBuilders}
            </dd>
          </div>
        </dl>
      </section>

      <AdminKpiGrid kpis={metrics.kpis} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <AdminTrendChart points={metrics.trend} />
        <aside className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:border-white/10 dark:bg-slate-900/80 sm:p-5">
          <p className="text-[0.65rem] font-bold tracking-wide text-orange-700 uppercase dark:text-orange-400">
            Quick links
          </p>
          <h2 className="mt-1 text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Jump into the product
          </h2>
          <ul className="mt-4 flex flex-col gap-2">
            {[
              { href: "/admin/site", label: "Manage site ops" },
              { href: "/admin/lessons", label: "Manage free lessons" },
              { href: "/admin/videos", label: "Manage video playlists" },
              { href: "/admin/teachers", label: "Manage teachers" },
              { href: "/admin/team", label: "Manage team builders" },
              { href: "/admin/members", label: "Manage members" },
              { href: "/admin/leaderboard", label: "Manage leaderboard" },
              { href: "/map", label: "Learner roadmap" },
              { href: "/profile", label: "Learner profile" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between rounded-xl border border-zinc-200/80 bg-cream/60 px-3 py-2.5 text-sm font-bold text-zinc-800 transition-colors hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:border-white/10 dark:bg-slate-950/50 dark:text-zinc-100 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-950/30"
                >
                  {item.label}
                  <span aria-hidden className="text-emerald-600 dark:text-emerald-400">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <AdminActivityTable rows={metrics.activity} />
    </div>
  );
}
