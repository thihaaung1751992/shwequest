"use client";

import TeamCard from "@/components/team/team-card";
import { BUILDERS, type TeamPerson } from "@/data/team";
import { TEACHERS } from "@/data/teachers";
import { useMessages } from "@/i18n/locale-context";

const TEACHER_PEOPLE: TeamPerson[] = TEACHERS.map((teacher) => ({
  id: teacher.id,
  label: teacher.label,
  image: teacher.image,
  kind: "teacher",
}));

export default function TeamShowcase() {
  const copy = useMessages();

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">{copy.team.title}</h2>
        <p className="mt-2 max-w-2xl text-sm font-medium text-zinc-600 dark:text-zinc-300">
          {copy.team.body}
        </p>
      </header>

      <section aria-labelledby="team-builders" className="flex flex-col gap-4">
        <div>
          <h3 id="team-builders" className="text-lg font-extrabold tracking-tight">
            {copy.team.builders}
          </h3>
          <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {copy.team.buildersBody}
          </p>
        </div>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BUILDERS.map((person) => (
            <li key={person.id}>
              <TeamCard person={person} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="team-teachers" className="flex flex-col gap-4">
        <div>
          <h3 id="team-teachers" className="text-lg font-extrabold tracking-tight">
            {copy.team.teachers}
          </h3>
          <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {copy.team.teachersBody}
          </p>
        </div>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEACHER_PEOPLE.map((person) => (
            <li key={person.id}>
              <TeamCard person={person} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
