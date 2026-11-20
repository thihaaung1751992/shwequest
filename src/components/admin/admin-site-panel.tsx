"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  CircleDashed,
  CircleDot,
  KeyRound,
  Lock,
  Shield,
  ShieldOff,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import {
  ADMIN_SITE_ROLE_LABEL,
  ADMIN_SITE_STATUS_LABEL,
  ADMIN_SITE_STATUSES,
  type AdminSiteControl,
  type AdminSiteGateFlags,
  type AdminSiteOperatorRow,
  type AdminSiteStats,
} from "@/data/admin-site";
import type { SiteAdminStatus } from "@/data/site-admins";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

type Filter = "all" | SiteAdminStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  ...ADMIN_SITE_STATUSES.map((status) => ({
    id: status as Filter,
    label: ADMIN_SITE_STATUS_LABEL[status],
  })),
];

const STATUS: Record<
  SiteAdminStatus,
  { label: string; className: string; Icon: LucideIcon }
> = {
  active: {
    label: ADMIN_SITE_STATUS_LABEL.active,
    className:
      "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300",
    Icon: CircleDot,
  },
  invited: {
    label: ADMIN_SITE_STATUS_LABEL.invited,
    className:
      "bg-amber-500/15 text-amber-900 dark:bg-amber-400/15 dark:text-amber-300",
    Icon: CircleDashed,
  },
  disabled: {
    label: ADMIN_SITE_STATUS_LABEL.disabled,
    className:
      "bg-orange-500/15 text-orange-900 dark:bg-orange-400/15 dark:text-orange-300",
    Icon: ShieldOff,
  },
};

function GateChip({
  ok,
  label,
}: {
  ok: boolean;
  label: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
        ok
          ? "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300"
          : "bg-amber-500/15 text-amber-900 dark:bg-amber-400/15 dark:text-amber-300"
      }`}
    >
      {ok ? (
        <Lock className="size-3.5" aria-hidden strokeWidth={2.25} />
      ) : (
        <KeyRound className="size-3.5" aria-hidden strokeWidth={2.25} />
      )}
      {label}: {ok ? "set" : "missing"}
    </span>
  );
}

export default function AdminSitePanel({
  stats,
  gate,
  controls,
  rows,
}: {
  stats: AdminSiteStats;
  gate: AdminSiteGateFlags;
  controls: readonly AdminSiteControl[];
  rows: readonly AdminSiteOperatorRow[];
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(() => {
    if (filter === "all") return rows;
    return rows.filter((row) => row.status === filter);
  }, [filter, rows]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <section className="rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-900/60 sm:p-5">
        <p className="text-[0.65rem] font-bold tracking-wide text-amber-700 uppercase dark:text-amber-400">
          Site ops
        </p>
        <p className="mt-1 max-w-2xl text-sm font-medium text-zinc-600 dark:text-zinc-300">
          Control surface for future site admins. Gate status is env presence
          only — credentials never appear here. Toggles stay disabled until real
          AuthZ exists. Operator roster is demo static data.
        </p>
      </section>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          {
            id: "operators",
            label: "Operators",
            value: stats.operators,
            hint: "Demo SITE_ADMINS",
            Icon: UserCog,
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
            id: "invited",
            label: "Invited",
            value: stats.invited,
            hint: "Awaiting accept",
            Icon: CircleDashed,
            chip: "bg-amber-500/15 text-amber-900 dark:text-amber-300",
            icon: "text-amber-600 dark:text-amber-400",
          },
          {
            id: "disabled",
            label: "Disabled",
            value: stats.disabled,
            hint: "Access paused",
            Icon: ShieldOff,
            chip: "bg-orange-500/15 text-orange-900 dark:text-orange-300",
            icon: "text-orange-600 dark:text-orange-400",
          },
          {
            id: "gate",
            label: "Site gate",
            value: stats.gateReady ? 1 : 0,
            hint: stats.gateReady ? "USER+PASS+SECRET set" : "Env incomplete",
            Icon: Shield,
            chip: stats.gateReady
              ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
              : "bg-amber-500/15 text-amber-900 dark:text-amber-300",
            icon: stats.gateReady
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-amber-600 dark:text-amber-400",
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
                {kpi.id === "gate"
                  ? stats.gateReady
                    ? "Ready"
                    : "Gap"
                  : kpi.value.toLocaleString("en-US")}
              </p>
              <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {kpi.hint}
              </p>
            </li>
          );
        })}
      </ul>

      <section
        aria-labelledby="admin-site-gate-heading"
        className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:border-white/10 dark:bg-slate-900/80 sm:p-5"
      >
        <p className="text-[0.65rem] font-bold tracking-wide text-sky-700 uppercase dark:text-sky-400">
          Access gate
        </p>
        <h2
          id="admin-site-gate-heading"
          className="mt-1 text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          Env configuration snapshot
        </h2>
        <p className="mt-1 max-w-2xl text-sm font-medium text-zinc-600 dark:text-zinc-300">
          Shows whether each{" "}
          <span className="font-mono text-xs">SITE_GATE_*</span> variable is
          present. Values stay in the secret store only.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <GateChip ok={gate.userConfigured} label="USER" />
          <GateChip ok={gate.passwordConfigured} label="PASSWORD" />
          <GateChip ok={gate.secretConfigured} label="SECRET" />
        </div>
      </section>

      <section
        aria-labelledby="admin-site-controls-heading"
        className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:border-white/10 dark:bg-slate-900/80 sm:p-5"
      >
        <p className="text-[0.65rem] font-bold tracking-wide text-orange-700 uppercase dark:text-orange-400">
          Site controls
        </p>
        <h2
          id="admin-site-controls-heading"
          className="mt-1 text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          Coming with AuthZ
        </h2>
        <ul className="mt-4 flex flex-col gap-2">
          {controls.map((control) => (
            <li
              key={control.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200/80 bg-cream/60 px-3 py-3 dark:border-white/10 dark:bg-slate-950/50"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                  {control.label}
                </p>
                <p className="mt-0.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {control.hint}
                </p>
              </div>
              <button
                type="button"
                disabled
                aria-pressed={control.enabled}
                title="Disabled until admin AuthZ exists"
                className={`rounded-full px-3 py-1.5 text-xs font-bold opacity-60 ${FOCUS} ${
                  control.enabled
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-200 text-zinc-600 dark:bg-white/10 dark:text-zinc-300"
                }`}
              >
                {control.enabled ? "On" : "Off"}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="admin-site-operators-heading"
        className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:border-white/10 dark:bg-slate-900/80"
      >
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-zinc-200/80 px-4 py-4 dark:border-white/10 sm:px-5">
          <div>
            <p className="text-[0.65rem] font-bold tracking-wide text-sky-700 uppercase dark:text-sky-400">
              Operators
            </p>
            <h2
              id="admin-site-operators-heading"
              className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              Demo site admins
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
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200/80 text-[0.7rem] font-bold tracking-wide text-zinc-500 uppercase dark:border-white/10 dark:text-zinc-400">
                <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                  Operator
                </th>
                <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                  Role
                </th>
                <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                  Joined
                </th>
                <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400 sm:px-5"
                  >
                    No operators match this filter.
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
                      <td className="px-4 py-3 font-mono text-xs font-bold text-zinc-700 dark:text-zinc-200 sm:px-5">
                        {ADMIN_SITE_ROLE_LABEL[row.role]}
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
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <p className="border-t border-zinc-200/80 px-4 py-3 text-xs font-medium text-zinc-500 dark:border-white/10 dark:text-zinc-400 sm:px-5">
          Showing {visible.length} of {rows.length} operators · read-only until
          AuthZ
        </p>
      </section>
    </div>
  );
}
