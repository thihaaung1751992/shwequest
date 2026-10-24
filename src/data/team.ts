import { TEACHER_PLACEHOLDER_IMAGE, TEACHERS } from "@/data/teachers";

export type TeamKind = "builder" | "teacher";

/** Showcase fields only. Lesson catalogs stay on `Teacher`. */
export type TeamPerson = {
  id: string;
  label: string;
  image: string;
  kind: TeamKind;
};

/** Placeholder IT names until real builder names exist. */
export const BUILDERS: readonly TeamPerson[] = [
  {
    id: "builder-1",
    label: "Builder 1",
    image: TEACHER_PLACEHOLDER_IMAGE,
    kind: "builder",
  },
  {
    id: "builder-2",
    label: "Builder 2",
    image: TEACHER_PLACEHOLDER_IMAGE,
    kind: "builder",
  },
  {
    id: "builder-3",
    label: "Builder 3",
    image: TEACHER_PLACEHOLDER_IMAGE,
    kind: "builder",
  },
];

export function teamPersonById(id: string): TeamPerson | undefined {
  const builder = BUILDERS.find((person) => person.id === id);
  if (builder) return builder;

  const teacher = TEACHERS.find((person) => person.id === id);
  if (!teacher) return undefined;

  return {
    id: teacher.id,
    label: teacher.label,
    image: teacher.image,
    kind: "teacher",
  };
}

export function teamStaticParams(): { id: string }[] {
  return [
    ...BUILDERS.map((person) => ({ id: person.id })),
    ...TEACHERS.map((teacher) => ({ id: teacher.id })),
  ];
}
