import {
  TEACHER_PLACEHOLDER_IMAGE,
  TEACHERS,
  teacherComingSoon,
  type Teacher,
  type TeacherAccent,
} from "@/data/teachers";
import { THIHA_AUNG_PROFILE, type BuilderProfile } from "@/data/builder-profiles";

export type TeamKind = "builder" | "teacher";

/** Showcase fields only. Lesson catalogs stay on `Teacher`. */
export type TeamPerson = {
  id: string;
  label: string;
  image: string;
  kind: TeamKind;
  accent: TeacherAccent;
  profile?: BuilderProfile;
  /** Shown as a Coming Soon card with no detail page. */
  comingSoon?: boolean;
};

/** Builder 2 stays a Coming Soon placeholder until a real profile exists. */
export const BUILDERS: readonly TeamPerson[] = [
  {
    id: "builder-1",
    label: "Thiha Aung",
    image: "/team/thiha-aung.webp",
    kind: "builder",
    accent: "sky",
    profile: THIHA_AUNG_PROFILE,
  },
  {
    id: "builder-2",
    label: "Builder 2",
    image: TEACHER_PLACEHOLDER_IMAGE,
    kind: "builder",
    accent: "emerald",
  },
];

function teacherToPerson(teacher: Teacher): TeamPerson {
  return {
    id: teacher.id,
    label: teacher.label,
    image: teacher.image,
    kind: "teacher",
    accent: teacher.accent,
    comingSoon: teacherComingSoon(teacher.id),
  };
}

export const TEAM_TEACHERS: readonly TeamPerson[] = TEACHERS.map(teacherToPerson);

export function teamPersonById(id: string): TeamPerson | undefined {
  const matches = (person: TeamPerson) => person.id === id;
  return BUILDERS.find(matches) ?? TEAM_TEACHERS.find(matches);
}

export function teamStaticParams(): { id: string }[] {
  const readyBuilders = BUILDERS.filter((person) => person.profile);
  const readyTeachers = TEAM_TEACHERS.filter((person) => !person.comingSoon);
  return [...readyBuilders, ...readyTeachers].map((person) => ({ id: person.id }));
}
