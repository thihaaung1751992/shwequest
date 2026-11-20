"use client";

import type { ComponentType, ReactNode } from "react";
import {
  BriefcaseBusiness,
  ExternalLink,
  FolderCode,
  GraduationCap,
  Languages,
  Quote,
  Sparkles,
  UserRound,
} from "lucide-react";
import { ACCENT_STYLES } from "@/components/teachers/teacher-accent";
import { useMessages } from "@/i18n/locale-context";
import type { BuilderProfile, SkillTone } from "@/data/builder-profiles";
import type { TeacherAccent } from "@/data/teachers";

const CARD =
  "relative isolate overflow-hidden rounded-[2rem] border-2 border-(--card-border) bg-white p-5 shadow-[inset_0_2px_0_rgb(255_255_255/0.9),0_6px_0_var(--card-edge),0_22px_36px_-18px_var(--card-edge)] sm:p-7 dark:border-white/10 dark:bg-slate-900 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_6px_0_rgb(255_255_255/0.08)]";

const PILL: Record<SkillTone, string> = {
  sky: "pill-3d-sky text-sky-950",
  amber: "pill-3d-amber text-amber-950",
  emerald: "pill-3d-emerald text-white",
  orange: "pill-3d-orange text-orange-950",
};

const TONE: Record<SkillTone, string> = {
  sky: "teacher-tone-sky",
  amber: "teacher-tone-amber",
  emerald: "teacher-tone-emerald",
  orange: "teacher-tone-amber",
};

const LINK_FOCUS =
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

function hostOf(href: string) {
  return new URL(href).hostname.replace(/^www\./, "");
}

function Section({
  icon: Icon,
  title,
  tone,
  className = "",
  children,
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  tone: SkillTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`${CARD} ${TONE[tone]} ${className}`}>
      <span
        aria-hidden
        className="price-card-face pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
      />
      <h3 className="mb-5 flex items-center gap-3 text-xl font-black tracking-tight sm:text-2xl">
        <span
          className={`stat-chip-3d grid size-10 shrink-0 place-items-center rounded-2xl ${PILL[tone]}`}
        >
          <Icon aria-hidden className="size-5" />
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}

export function ResumeStats({
  profile,
  accent,
}: {
  profile: BuilderProfile;
  accent: TeacherAccent;
}) {
  const copy = useMessages().team.resume;
  const style = ACCENT_STYLES[accent];
  const projectCount = profile.projects.reduce((sum, group) => sum + group.links.length, 0);
  const stats = [
    { value: profile.yearsExperience, label: copy.years },
    { value: String(profile.experience.length), label: copy.roles },
    { value: `${projectCount}+`, label: copy.projects },
  ];

  return (
    <dl className="grid w-full max-w-lg grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border-2 border-(--card-border) bg-white/80 px-2 py-3 shadow-[0_4px_0_var(--card-edge)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_4px_0_rgb(255_255_255/0.08)]"
        >
          <dt className="text-[0.7rem] font-bold tracking-wide text-slate-500 uppercase dark:text-slate-400">
            {stat.label}
          </dt>
          <dd
            className={`mt-0.5 bg-linear-to-b ${style.bar} bg-clip-text text-3xl font-black text-transparent sm:text-4xl`}
          >
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function BuilderResume({ profile }: { profile: BuilderProfile }) {
  const copy = useMessages().team.resume;

  return (
    <div className="flex flex-col gap-6">
      <Section icon={UserRound} title={copy.about} tone="sky">
        <div className="relative">
          <Quote
            aria-hidden
            className="absolute -top-2 -left-1 size-10 text-sky-200 dark:text-sky-900"
          />
          <p className="relative pl-10 text-base leading-relaxed text-pretty text-slate-700 sm:text-lg dark:text-slate-300">
            {profile.about}
          </p>
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Section icon={BriefcaseBusiness} title={copy.experience} tone="amber">
          <ol className="relative flex flex-col gap-7 before:absolute before:top-2 before:bottom-2 before:left-[0.6875rem] before:w-1 before:rounded-full before:bg-linear-to-b before:from-amber-300 before:via-sky-300 before:to-emerald-300 dark:before:opacity-50">
            {profile.experience.map((job) => (
              <li key={`${job.company}-${job.period}`} className="relative pl-10">
                <span
                  aria-hidden
                  className={`absolute top-1 left-0 grid size-6 place-items-center rounded-full border-4 border-white shadow-[0_3px_0_var(--card-edge)] dark:border-slate-900 ${job.current ? "bg-emerald-500" : "bg-amber-400"}`}
                >
                  {job.current ? (
                    <span className="absolute inset-0 rounded-full bg-emerald-400 motion-safe:animate-ping" />
                  ) : null}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`stat-chip-3d inline-flex rounded-full px-2.5 py-0.5 text-xs font-black ${job.current ? PILL.emerald : PILL.amber}`}
                  >
                    {job.period}
                  </span>
                  {job.current ? (
                    <span className="text-xs font-black tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
                      {copy.now}
                    </span>
                  ) : null}
                </div>
                <h4 className="mt-2 text-lg font-black tracking-tight">{job.role}</h4>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  {job.company} · {job.city}
                </p>
                <ul className="mt-3 flex flex-col gap-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {job.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span
                        aria-hidden
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-400"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Section>

        <div className="flex flex-col gap-6">
          <Section icon={Sparkles} title={copy.skills} tone="sky">
            <div className="flex flex-col gap-5">
              {profile.skills.map((group) => (
                <div key={group.title}>
                  <p className="mb-2.5 text-xs font-black tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    {group.title}
                  </p>
                  <ul className="flex flex-wrap gap-2 text-sm font-bold">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className={`stat-chip-3d rounded-full px-3 py-1 ${PILL[group.tone]}`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section icon={GraduationCap} title={copy.education} tone="emerald">
            <ul className="flex flex-col gap-3">
              {profile.education.map((item) => (
                <li key={item.school}>
                  <span
                    className={`stat-chip-3d inline-flex rounded-full px-2.5 py-0.5 text-xs font-black ${PILL.emerald}`}
                  >
                    {item.period}
                  </span>
                  <p className="mt-2 text-lg font-black">{item.degree}</p>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    {item.school}
                  </p>
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={Languages} title={copy.languages} tone="amber">
            <ul className="flex flex-col gap-4">
              {profile.languages.map((language) => (
                <li key={language.name}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-black">{language.name}</span>
                    <span className="text-right text-xs font-bold text-slate-500 dark:text-slate-400">
                      {language.level}
                    </span>
                  </div>
                  <span
                    aria-hidden
                    className="mt-2 block h-3 overflow-hidden rounded-full bg-amber-100 shadow-[inset_0_2px_0_rgb(0_0_0/0.08)] dark:bg-white/10"
                  >
                    <span
                      className="block h-full rounded-full bg-linear-to-r from-amber-300 to-orange-500 shadow-[inset_0_1.5px_0_rgb(255_255_255/0.5)]"
                      style={{ width: `${language.percent}%` }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>

      <Section icon={FolderCode} title={copy.work} tone="emerald">
        <div className="grid gap-5 sm:grid-cols-2">
          {profile.projects.map((group) => (
            <div
              key={group.title}
              className="rounded-3xl border-2 border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/5"
            >
              <p className="mb-3 flex items-center justify-between gap-2">
                <span
                  className={`stat-chip-3d inline-flex rounded-full px-3 py-1 text-sm font-black ${PILL[group.tone]}`}
                >
                  {group.title}
                </span>
                <span className="text-xs font-black text-slate-400">{group.links.length}</span>
              </p>
              <ul className="flex flex-col gap-1.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group/link flex min-h-11 items-center gap-3 rounded-2xl bg-white px-3 py-2 ring-1 ring-slate-200 transition-[translate,box-shadow] motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-[0_6px_14px_-8px_rgb(15_23_42/0.35)] dark:bg-slate-900 dark:ring-white/10 ${LINK_FOCUS}`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-extrabold">
                          {link.label}
                        </span>
                        <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                          {hostOf(link.href)}
                        </span>
                      </span>
                      <ExternalLink
                        aria-hidden
                        className="size-4 shrink-0 text-slate-400 transition-transform motion-safe:group-hover/link:translate-x-0.5 motion-safe:group-hover/link:-translate-y-0.5"
                      />
                      <span className="sr-only">({copy.opensNewTab})</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
