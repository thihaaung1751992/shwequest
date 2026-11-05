import {
  TEACHER_PLACEHOLDER_IMAGE,
  TEACHERS,
  type Teacher,
  type TeacherAccent,
} from "@/data/teachers";

export type TeamKind = "builder" | "teacher";

/** Showcase fields only. Lesson catalogs stay on `Teacher`. */
export type TeamPerson = {
  id: string;
  label: string;
  image: string;
  kind: TeamKind;
  accent: TeacherAccent;
};

/** Placeholder IT names until real builder names exist. */
export const BUILDERS: readonly TeamPerson[] = [
  {
    id: "builder-1",
    label: "Builder 1",
    image: TEACHER_PLACEHOLDER_IMAGE,
    kind: "builder",
    accent: "sky",
  },
  {
    id: "builder-2",
    label: "Builder 2",
    image: TEACHER_PLACEHOLDER_IMAGE,
    kind: "builder",
    accent: "emerald",
  },
  {
    id: "builder-3",
    label: "Builder 3",
    image: TEACHER_PLACEHOLDER_IMAGE,
    kind: "builder",
    accent: "amber",
  },
];

function teacherToPerson(teacher: Teacher): TeamPerson {
  return {
    id: teacher.id,
    label: teacher.label,
    image: teacher.image,
    kind: "teacher",
    accent: teacher.accent,
  };
}

export const TEAM_TEACHERS: readonly TeamPerson[] = TEACHERS.map(teacherToPerson);

export function teamPersonById(id: string): TeamPerson | undefined {
  const matches = (person: TeamPerson) => person.id === id;
  return BUILDERS.find(matches) ?? TEAM_TEACHERS.find(matches);
}

export function teamStaticParams(): { id: string }[] {
  return [...BUILDERS, ...TEAM_TEACHERS].map((person) => ({ id: person.id }));
}
