"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  CircleDashed,
  CircleDot,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import {
  ADMIN_MEMBER_STATUS_LABEL,
  formatPlanLabelRelative,
} from "@/data/admin-members";
import { planDaysRemaining } from "@/data/learner";
import type { Member, MemberStatus } from "@/data/members";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

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

export default function AdminMembersDetail({
  member,
  planLabel: planLabelFallback,
  teachers,
  siteHref,
  listHref,
}: {
  member: Member;
  /** Prerender-safe fallback; upgraded to relative after hydrate. */
  planLabel: string;
  teachers: readonly { id: string; label: string }[];
  siteHref: string;
  listHref: string;
}) {
  const statusMeta = STATUS[member.status];
  const StatusIcon = statusMeta.Icon;
  const [planLabel, setPlanLabel] = useState(planLabelFallback);
  const [planDays, setPlanDays] = useState<number | null>(null);

  useEffect(() => {
    if (!member.planEndsOn) {
      setPlanLabel("No plan");
      setPlanDays(null);
      return;
    }
    const now = new Date();
    setPlanLabel(formatPlanLabelRelative(member.planEndsOn, now));
    setPlanDays(planDaysRemaining(member.planEndsOn, now));
  }, [member.planEndsOn]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={listHref}
          className={`inline-flex items-center gap-1.5 rounded-xl border border-zinc-200/80 bg-white px-3 py-2 text-xs font-bold text-zinc-800 dark:border-white/10 dark:bg-slate-900 dark:text-zinc-100 ${FOCUS}`}
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          All members
        </Link>
        <Link
          href={siteHref}
          className={`inline-flex items-center gap-1.5 rounded-xl border border-sky-300/80 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-900 dark:border-sky-500/40 dark:bg-sky-950/40 dark:text-sky-200 ${FOCUS}`}
        >
          Open on site
          <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </div>

      <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:border-white/10 dark:bg-slate-900/80">
        <div className="grid gap-5 p-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:p-5">
          <div className="relative mx-auto aspect-square w-full max-w-44 overflow-hidden rounded-xl bg-zinc-100 dark:bg-white/5 sm:mx-0">
            <Image
              src={member.image}
              alt=""
              fill
              sizes="176px"
              className="object-cover object-[center_18%]"
            />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[0.7rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              {member.id}
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
              {member.displayName}
            </h2>
            <p className="mt-1 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
              {member.bio}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${statusMeta.className}`}
              >
                <StatusIcon className="size-3.5" aria-hidden strokeWidth={2.25} />
                {statusMeta.label}
              </span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                Joined {member.joinedOn}
              </span>
            </div>
            <dl className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[0.65rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                  Email
                </dt>
                <dd className="truncate font-medium text-zinc-800 dark:text-zinc-200">
                  {member.email}
                </dd>
              </div>
              <div>
                <dt className="text-[0.65rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                  Phone
                </dt>
                <dd className="font-mono font-bold text-zinc-900 dark:text-zinc-50">
                  {member.phone}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[0.65rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                  Address
                </dt>
                <dd className="font-medium text-zinc-800 dark:text-zinc-200">
                  {member.address}
                </dd>
              </div>
              <div>
                <dt className="text-[0.65rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                  Plan
                </dt>
                <dd className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  {planLabel}
                </dd>
              </div>
              <div>
                <dt className="text-[0.65rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                  Days left
                </dt>
                <dd className="font-mono font-black tabular-nums text-zinc-900 dark:text-zinc-50">
                  {planDays === null ? "—" : planDays}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {[
          {
            id: "plan",
            label: "Plan end",
            value: member.planEndsOn ?? "None",
            hint: planLabel,
            Icon: BadgeCheck,
            chip: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
            icon: "text-emerald-600 dark:text-emerald-400",
            mono: true,
          },
          {
            id: "teachers",
            label: "Enrolled teachers",
            value: String(teachers.length),
            hint:
              teachers.length === 0
                ? "No enrollments"
                : teachers.map((t) => t.label).join(" · "),
            Icon: BookOpen,
            chip: "bg-sky-500/15 text-sky-800 dark:text-sky-300",
            icon: "text-sky-600 dark:text-sky-400",
            mono: true,
          },
          {
            id: "status",
            label: "Control status",
            value: statusMeta.label,
            hint: "Read-only demo field",
            Icon: StatusIcon,
            chip: statusMeta.className,
            icon: "",
            mono: false,
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
              <p
                className={`mt-1 text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 ${
                  kpi.mono ? "font-mono tabular-nums" : ""
                }`}
              >
                {kpi.value}
              </p>
              <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {kpi.hint}
              </p>
            </li>
          );
        })}
      </ul>

      {teachers.length > 0 ? (
        <section
          aria-labelledby="admin-member-teachers"
          className="rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:border-white/10 dark:bg-slate-900/80 sm:p-5"
        >
          <p className="text-[0.65rem] font-bold tracking-wide text-sky-700 uppercase dark:text-sky-400">
            Enrollments
          </p>
          <h3
            id="admin-member-teachers"
            className="mt-1 text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Teachers on this account
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {teachers.map((teacher) => (
              <li key={teacher.id}>
                <Link
                  href={`/admin/teachers/${teacher.id}`}
                  className={`inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-800 transition-colors hover:bg-emerald-50 hover:text-emerald-900 dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-200 ${FOCUS}`}
                >
                  {teacher.label}
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-900/60 sm:p-5">
        <p className="text-[0.65rem] font-bold tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
          Demo data only
        </p>
        <p className="mt-1 max-w-2xl text-sm font-medium text-zinc-600 dark:text-zinc-300">
          Status and plan fields are stand-ins until a real accounts API
          exists. There is no admin AuthZ or mutate action on this screen.
          Public “Open on site” uses the single{" "}
          <span className="font-mono text-xs">/profile</span> learner stand-in.
          Source: <span className="font-mono text-xs">MEMBERS</span>.
        </p>
      </section>
    </div>
  );
}
