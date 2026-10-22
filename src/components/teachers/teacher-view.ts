export type TeacherView = "card" | "tile" | "list";

export const TEACHER_VIEWS: TeacherView[] = ["card", "tile", "list"];

export function teacherViewFromParam(value: string | null): TeacherView {
  return TEACHER_VIEWS.find((view) => view === value) ?? "card";
}
