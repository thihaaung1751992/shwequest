import TeacherCard from "@/components/teachers/teacher-card";
import TeacherListRow from "@/components/teachers/teacher-list-row";
import TeacherTile from "@/components/teachers/teacher-tile";
import type { TeacherView } from "@/components/teachers/teacher-view-toggle";
import type { Teacher } from "@/data/teachers";

export default function TeacherResults({
  view,
  teachers,
  videoCount,
  gameCount,
}: {
  view: TeacherView;
  teachers: Teacher[];
  videoCount: number;
  gameCount: number;
}) {
  if (view === "tile") {
    return (
      <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {teachers.map((teacher) => (
          <li key={teacher.id} data-teacher-name={teacher.label}>
            <TeacherTile teacher={teacher} />
          </li>
        ))}
      </ul>
    );
  }

  if (view === "list") {
    return (
      <ul className="mt-4 grid gap-3">
        {teachers.map((teacher) => (
          <li key={teacher.id} data-teacher-name={teacher.label}>
            <TeacherListRow teacher={teacher} videoCount={videoCount} gameCount={gameCount} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {teachers.map((teacher) => (
        <li key={teacher.id} data-teacher-name={teacher.label}>
          <TeacherCard teacher={teacher} videoCount={videoCount} gameCount={gameCount} />
        </li>
      ))}
    </ul>
  );
}
