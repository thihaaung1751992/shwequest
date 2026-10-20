export type TeacherAccent = "amber" | "sky" | "emerald";

export type Teacher = {
  id: string;
  label: string;
  accent: TeacherAccent;
  /** Portrait URL. Swap this for a real photo later. */
  image: string;
};

/** Shared stand-in until each teacher has a photo. */
export const TEACHER_PLACEHOLDER_IMAGE = "/teachers/placeholder.svg";

/** Placeholder labels until real teacher names exist. */
export const TEACHERS: Teacher[] = [
  { id: "teacher-1", label: "Teacher 1", accent: "amber", image: TEACHER_PLACEHOLDER_IMAGE },
  { id: "teacher-2", label: "Teacher 2", accent: "sky", image: TEACHER_PLACEHOLDER_IMAGE },
  { id: "teacher-3", label: "Teacher 3", accent: "emerald", image: TEACHER_PLACEHOLDER_IMAGE },
];

export function teacherById(id: string): Teacher | undefined {
  return TEACHERS.find((teacher) => teacher.id === id);
}
