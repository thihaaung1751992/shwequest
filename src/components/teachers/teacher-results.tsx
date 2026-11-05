import TeacherCard from "@/components/teachers/teacher-card";
import TeacherListRow from "@/components/teachers/teacher-list-row";
import TeacherTile from "@/components/teachers/teacher-tile";
import type { TeacherView } from "@/components/teachers/teacher-view";
import type { Teacher } from "@/data/teachers";

const RISE_STAGGER_MS = 80;
const RISE_CLASS = "motion-safe:animate-teacher-rise";

function riseDelay(index: number) {
  return { animationDelay: `${index * RISE_STAGGER_MS}ms` };
}

export default function TeacherResults({
  view,
  teachers,
}: {
  view: TeacherView;
  teachers: Teacher[];
}) {
  if (view === "tile") {
    return (
      <ul className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {teachers.map((teacher, index) => (
          <li
            key={teacher.id}
            data-teacher-name={teacher.label}
            className={RISE_CLASS}
            style={riseDelay(index)}
          >
            <TeacherTile teacher={teacher} />
          </li>
        ))}
      </ul>
    );
  }

  if (view === "list") {
    return (
      <ul className="mt-6 grid gap-4">
        {teachers.map((teacher, index) => (
          <li
            key={teacher.id}
            data-teacher-name={teacher.label}
            className={RISE_CLASS}
            style={riseDelay(index)}
          >
            <TeacherListRow teacher={teacher} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {teachers.map((teacher, index) => (
        <li
          key={teacher.id}
          data-teacher-name={teacher.label}
          className={RISE_CLASS}
          style={riseDelay(index)}
        >
          <TeacherCard teacher={teacher} />
        </li>
      ))}
    </ul>
  );
}
