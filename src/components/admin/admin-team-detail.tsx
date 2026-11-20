import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  CircleDashed,
  CircleDot,
  FolderCode,
  GraduationCap,
  Languages,
  Sparkles,
} from "lucide-react";
import type {
  AdminTeamProfileSummary,
  AdminTeamStatus,
} from "@/data/admin-team";
import type { TeamPerson } from "@/data/team";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

const STATUS: Record<
  AdminTeamStatus,
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
};

export default function AdminTeamDetail({
  person,
  status,
  summary,
  siteHref,
  listHref,
}: {
  person: TeamPerson;
  status: AdminTeamStatus;
  summary: AdminTeamProfileSummary | null;
  siteHref: string;
  listHref: string;
}) {
  const statusMeta = STATUS[status];
  const StatusIcon = statusMeta.Icon;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={listHref}
          className={`inline-flex items-center gap-1.5 rounded-xl border border-zinc-200/80 bg-white px-3 py-2 text-xs font-bold text-zinc-800 dark:border-white/10 dark:bg-slate-900 dark:text-zinc-100 ${FOCUS}`}
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          All builders
        </Link>
        {status === "live" ? (
          <Link
            href={siteHref}
            className={`inline-flex items-center gap-1.5 rounded-xl border border-sky-300/80 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-900 dark:border-sky-500/40 dark:bg-sky-950/40 dark:text-sky-200 ${FOCUS}`}
          >
            Open on site
            <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200/80 bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
            Not live on site yet
          </span>
        )}
      </div>

      <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 shadow-[0_1px_0_rgb(0_0_0/0.04)] dark:border-white/10 dark:bg-slate-900/80">
        <div className="grid gap-5 p-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:p-5">
          <div className="relative mx-auto aspect-square w-full max-w-44 overflow-hidden rounded-xl bg-zinc-100 dark:bg-white/5 sm:mx-0">
            <Image
              src={person.image}
              alt=""
              fill
              sizes="176px"
              className="object-cover object-[center_18%]"
            />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[0.7rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              {person.id}
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
              {person.label}
            </h2>
            {summary ? (
              <p className="mt-1 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                {summary.headline}
                {summary.location ? ` · ${summary.location}` : ""}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${statusMeta.className}`}
              >
                <StatusIcon className="size-3.5" aria-hidden strokeWidth={2.25} />
                {statusMeta.label}
              </span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold capitalize text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                {person.accent}
              </span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold capitalize text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                {person.kind}
              </span>
            </div>
            {summary ? (
              <dl className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[0.65rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                    Years
                  </dt>
                  <dd className="font-mono font-bold text-zinc-900 dark:text-zinc-50">
                    {summary.yearsExperience}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.65rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                    Email
                  </dt>
                  <dd className="truncate font-medium text-zinc-800 dark:text-zinc-200">
                    {summary.email}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[0.65rem] font-bold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                    GitHub
                  </dt>
                  <dd>
                    <a
                      href={summary.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 truncate text-sm font-bold text-sky-700 dark:text-sky-300 ${FOCUS}`}
                    >
                      {summary.github.replace(/^https?:\/\//, "")}
                      <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
                    </a>
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="mt-5 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                No CV yet — Coming Soon placeholder on the public Team page.
              </p>
            )}
          </div>
        </div>
      </section>

      {summary ? (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              id: "skills",
              label: "Skill groups",
              value: summary.skillGroups,
              hint: `${summary.skillItems} items`,
              Icon: Sparkles,
              chip: "bg-sky-500/15 text-sky-800 dark:text-sky-300",
              icon: "text-sky-600 dark:text-sky-400",
            },
            {
              id: "roles",
              label: "Roles",
              value: summary.roles,
              hint: "Experience entries",
              Icon: BriefcaseBusiness,
              chip: "bg-amber-500/15 text-amber-900 dark:text-amber-300",
              icon: "text-amber-600 dark:text-amber-400",
            },
            {
              id: "projects",
              label: "Project links",
              value: summary.projectLinks,
              hint: "External work",
              Icon: FolderCode,
              chip: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
              icon: "text-emerald-600 dark:text-emerald-400",
            },
            {
              id: "edu-lang",
              label: "Edu · langs",
              value: summary.education,
              hint: `${summary.languages} languages`,
              Icon: summary.education > 0 ? GraduationCap : Languages,
              chip: "bg-orange-500/15 text-orange-900 dark:text-orange-300",
              icon: "text-orange-600 dark:text-orange-400",
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
      ) : null}

      <section className="rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-900/60 sm:p-5">
        <p className="text-[0.65rem] font-bold tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
          Summary only
        </p>
        <p className="mt-1 max-w-2xl text-sm font-medium text-zinc-600 dark:text-zinc-300">
          Full resume sections are not mirrored here — open the public Team
          profile when the builder is live. Catalog is static demo data from{" "}
          <span className="font-mono text-xs">BUILDERS</span>.
        </p>
      </section>
    </div>
  );
}
