"use client";

import { Code2, GraduationCap, Users, type LucideIcon } from "lucide-react";
import TeamCard from "@/components/team/team-card";
import TeacherPortrait from "@/components/teachers/teacher-portrait";
import { BUILDERS, TEAM_TEACHERS, type TeamPerson } from "@/data/team";
import { useMessages } from "@/i18n/locale-context";

const EVERYONE = [...BUILDERS, ...TEAM_TEACHERS];

/** Fixed fan for the decorative portrait stack (index order). */
const FAN = [
  "-rotate-6",
  "rotate-3 -translate-y-2",
  "-rotate-2 translate-y-1",
  "rotate-6 -translate-y-1",
  "-rotate-3",
  "rotate-2 -translate-y-2",
] as const;
const BOB_DELAY_MS = 250;
const RISE_STAGGER_MS = 80;

/** A lone last card in the 2-col range sits centred at one column wide. */
const LONE_LAST =
  "sm:max-lg:last:odd:col-span-2 sm:max-lg:last:odd:mx-auto sm:max-lg:last:odd:w-[calc(50%-0.75rem)]";

function TeamHero() {
  const copy = useMessages();
  const chip = "stat-chip-3d inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold";

  return (
    <section
      aria-labelledby="team-title"
      className="teacher-stage teacher-tone-amber relative overflow-hidden rounded-[2rem] border-2 border-amber-300 px-5 py-7 shadow-[inset_0_2px_0_rgb(255_255_255/0.9),0_5px_0_var(--color-amber-300),0_20px_36px_-18px_rgb(180_83_9/0.45)] sm:px-8 sm:py-9 dark:border-white/10 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_5px_0_rgb(255_255_255/0.08)]"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="pill-3d pill-3d-orange inline-flex -rotate-2 items-center gap-1.5 rounded-full px-3.5 py-1 text-sm font-bold text-orange-950 motion-reduce:rotate-none">
            <Users aria-hidden className="size-4" />
            {copy.team.kicker}
          </p>
          <h2
            id="team-title"
            className="mt-4 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl dark:text-white"
          >
            {copy.team.title}
          </h2>
          <p className="mt-2 max-w-prose text-sm font-medium text-zinc-700 sm:text-base dark:text-zinc-300">
            {copy.team.body}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            <li className={`${chip} pill-3d-sky text-sky-950`}>
              <Code2 aria-hidden className="size-4" />
              {copy.team.builders} · {copy.team.memberCount(BUILDERS.length)}
            </li>
            <li className={`${chip} pill-3d-emerald text-white`}>
              <GraduationCap aria-hidden className="size-4" />
              {copy.team.teachers} · {copy.team.memberCount(TEAM_TEACHERS.length)}
            </li>
          </ul>
        </div>

        <div aria-hidden className="hidden shrink-0 items-center pr-2 md:flex">
          {EVERYONE.slice(0, FAN.length).map((person, index) => (
            <span key={person.id} className={`-ml-6 first:ml-0 ${FAN[index]}`}>
              <span
                className="block motion-safe:animate-hero-bob"
                style={{ animationDelay: `${index * BOB_DELAY_MS}ms` }}
              >
                <TeacherPortrait src={person.image} size="tile" />
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection({
  id,
  title,
  body,
  people,
  icon: Icon,
  badge,
  riseOffset,
}: {
  id: string;
  title: string;
  body: string;
  people: readonly TeamPerson[];
  icon: LucideIcon;
  /** pill-3d-* helper + text colour for the heading badge. */
  badge: string;
  riseOffset: number;
}) {
  const copy = useMessages();

  return (
    <section aria-labelledby={id} className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <span
          aria-hidden
          className={`stat-chip-3d grid size-12 shrink-0 place-items-center rounded-2xl ${badge}`}
        >
          <Icon aria-hidden className="size-6" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 id={id} className="text-2xl font-black tracking-tight">
              {title}
            </h3>
            <span className="stat-chip-3d pill-3d-amber rounded-full px-2.5 py-0.5 text-xs font-black text-amber-950 tabular-nums">
              {copy.team.memberCount(people.length)}
            </span>
          </div>
          <p className="mt-0.5 text-sm font-medium text-zinc-600 dark:text-zinc-300">{body}</p>
        </div>
      </div>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((person, index) => (
          <li
            key={person.id}
            className={`motion-safe:animate-teacher-rise ${LONE_LAST}`}
            style={{ animationDelay: `${(riseOffset + index) * RISE_STAGGER_MS}ms` }}
          >
            <TeamCard person={person} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function TeamShowcase() {
  const copy = useMessages();

  return (
    <div className="flex flex-col gap-12 pb-12 sm:pb-20">
      <TeamHero />
      <TeamSection
        id="team-builders"
        title={copy.team.builders}
        body={copy.team.buildersBody}
        people={BUILDERS}
        icon={Code2}
        badge="pill-3d-sky text-sky-950"
        riseOffset={0}
      />
      <TeamSection
        id="team-teachers"
        title={copy.team.teachers}
        body={copy.team.teachersBody}
        people={TEAM_TEACHERS}
        icon={GraduationCap}
        badge="pill-3d-emerald text-white"
        riseOffset={BUILDERS.length}
      />
    </div>
  );
}
