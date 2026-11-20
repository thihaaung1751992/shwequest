"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  CircleDashed,
  CircleDot,
  ContactRound,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import {
  ADMIN_MEMBER_STATUS_LABEL,
  ADMIN_MEMBER_STATUSES,
  formatPlanLabelRelative,
  type AdminMemberRow,
  type AdminMemberStats,
} from "@/data/admin-members";
import type { MemberStatus } from "@/data/members";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

type Filter = "all" | MemberStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  ...ADMIN_MEMBER_STATUSES.map((status) => ({
    id: status as Filter,
    label: ADMIN_MEMBER_STATUS_LABEL[status],
  })),
];

const STATUS: Record<
  MemberStatus,
  { label: string; className: string; Icon: LucideIcon }
> = {
  active: {
    label: ADMIN_MEMBER_STATUS_LABEL.active,
    className:
      "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300",
    Icon: CircleDot,
  },
  pending: {
    label: ADMIN_MEMBER_STATUS_LABEL.pending,
    className:
      "bg-amber-500/15 text-amber-900 dark:bg-amber-400/15 dark:text-amber-300",
    Icon: CircleDashed,
  },
  suspended: {
    label: ADMIN_MEMBER_STATUS_LABEL.suspended,
    className:
      "bg-orange-500/15 text-orange-900 dark:bg-orange-400/15 dark:text-orange-300",
    Icon: ShieldAlert,
  },
};

export default function AdminMembersCatalog({
  stats,
  rows,
}: {
  stats: AdminMemberStats;
  rows: readonly AdminMemberRow[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const visible = useMemo(() => {
    if (filter === "all") return rows;
    return rows.filter((row) => row.status === filter);
  }, [filter, rows]);

  const planLabelFor = (row: AdminMemberRow) =>
    now ? formatPlanLabelRelative(row.planEndsOn, now) : row.planLabel;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <section className="rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-900/60 sm:p-5">
        <p className="text-[0.65rem] font-bold tracking-wide text-amber-700 uppercase dark:text-amber-400">
          Members catalog
        </p>
        <p className="mt-1 max-w-2xl text-sm font-medium text-zinc-600 dark:text-zinc-300">
          Control demo registered learners inside admin. Counts come from{" "}
          <span className="font-mono text-xs">MEMBERS</span> — not a live
          accounts API. Status is read-only until auth/CRUD exists. Open a row
          for plan and enrollments; “Open on site” goes to the public profile
          stand-in.
        </p>
      </section>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          {
            id: "total",
            label: "Total members",
            value: stats.total,
            hint: "Catalog entries",
            Icon: ContactRound,
            chip: "bg-sky-500/15 text-sky-800 dark:text-sky-300",
            icon: "text-sky-600 dark:text-sky-400",
          },
          {
            id: "active",
            label: "Active",
            value: stats.active,
            hint: "status = active",
            Icon: CircleDot,
            chip: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
            icon: "text-emerald-600 dark:text-emerald-400",
          },
          {
            id: "pending",
            label: "Pending",
            value: stats.pending,
            hint: "Awaiting plan / verify",
            Icon: CircleDashed,
            chip: "bg-amber-500/15 text-amber-900 dark:text-amber-300",
            icon: "text-amber-600 dark:text-amber-400",
          },
          {
            id: "suspended",
            label: "Suspended",
            value: stats.suspended,
            hint: "Access paused",
            Icon: ShieldAlert,
            chip: "bg-orange-500/15 text-orange-900 dark:text-orange-300",
            icon: "text-orange-600 dark:text-orange-400",
          },
          {
            id: "plan",
            label: "With plan",
            value: stats.withPlan,
            hint: "planEndsOn set",
            Icon: BadgeCheck,
            chip: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
            icon: "text-emerald-600 dark:text-emerald-400",
          },
        ].map((kpi) => {
          const Icon = kpi.Icon;
          return (
            <li
              key={kpi.id}
              className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:border-white/10 dark:bg-slate-900/80"
            >
              <span
                className={`inline-flex size-9 items-center justify-center rounded-xl ${kpi.chip}`}
              >
                <Icon
                  className={`size-4.5 ${kpi.icon}`}
                  aria-hidden
                  strokeWidth={2.25}
                />
              </span>
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

      <section
        aria-labelledby="admin-members-heading"
        className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:border-white/10 dark:bg-slate-900/80"
      >
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-zinc-200/80 px-4 py-4 dark:border-white/10 sm:px-5">
          <div>
            <p className="text-[0.65rem] font-bold tracking-wide text-sky-700 uppercase dark:text-sky-400">
              Member index
            </p>
            <h2
              id="admin-members-heading"
              className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              All demo members
            </h2>
          </div>
          <div
            role="group"
            aria-label="Filter by status"
            className="flex flex-wrap gap-1.5"
          >
            {FILTERS.map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(item.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${FOCUS} ${
                    active
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-200 dark:hover:bg-white/15"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200/80 text-[0.7rem] font-bold tracking-wide text-zinc-500 uppercase dark:border-white/10 dark:text-zinc-400">
                <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                  Member
                </th>
                <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                  Plan
                </th>
                <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                  Teachers
                </th>
                <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                  Joined
                </th>
                <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-right font-bold sm:px-5">
                  Manage
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400 sm:px-5"
                  >
                    No members match this filter.
                  </td>
                </tr>
              ) : (
                visible.map((row) => {
                  const status = STATUS[row.status];
                  const StatusIcon = status.Icon;
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-zinc-100 last:border-0 dark:border-white/5"
                    >
                      <td className="max-w-[16rem] px-4 py-3 sm:px-5">
                        <div className="flex items-center gap-3">
                          <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-zinc-100 ring-2 ring-zinc-200/80 dark:bg-white/5 dark:ring-white/10">
                            <Image
                              src={row.image}
                              alt=""
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-zinc-900 dark:text-zinc-50">
                              {row.displayName}
                            </p>
                            <p className="mt-0.5 truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
                              {row.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-[12rem] px-4 py-3 text-zinc-600 dark:text-zinc-300 sm:px-5">
                        <p className="truncate font-mono text-xs font-bold">
                          {planLabelFor(row)}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-mono text-sm font-bold tabular-nums text-zinc-700 dark:text-zinc-200 sm:px-5">
                        {row.enrolledCount}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs font-bold tabular-nums text-zinc-600 dark:text-zinc-300 sm:px-5">
                        {row.joinedOn}
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${status.className}`}
                        >
                          <StatusIcon
                            className="size-3.5"
                            aria-hidden
                            strokeWidth={2.25}
                          />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right sm:px-5">
                        <Link
                          href={row.href}
                          className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-sky-700 transition-colors hover:bg-sky-500/10 dark:text-sky-300 ${FOCUS}`}
                        >
                          Open
                          <ArrowUpRight className="size-3.5" aria-hidden />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <p className="border-t border-zinc-200/80 px-4 py-3 text-xs font-medium text-zinc-500 dark:border-white/10 dark:text-zinc-400 sm:px-5">
          Showing {visible.length} of {rows.length} members
        </p>
      </section>
    </div>
  );
}
