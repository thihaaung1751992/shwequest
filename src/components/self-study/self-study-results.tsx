import SelfStudyLessonCard from "@/components/self-study/self-study-lesson-card";
import SelfStudyLessonRow from "@/components/self-study/self-study-lesson-row";
import type { SelfStudyView } from "@/components/self-study/self-study-view";
import type { FreeLesson } from "@/data/self-study";

const RISE_STAGGER_MS = 80;
const RISE_CLASS = "motion-safe:animate-teacher-rise";

function riseDelay(index: number) {
  return { animationDelay: `${index * RISE_STAGGER_MS}ms` };
}

export default function SelfStudyResults({
  view,
  lessons,
}: {
  view: SelfStudyView;
  lessons: FreeLesson[];
}) {
  if (view === "list") {
    return (
      <ul className="mt-6 grid gap-4">
        {lessons.map((lesson, index) => (
          <li
            key={lesson.id}
            data-lesson-name={lesson.title}
            className={RISE_CLASS}
            style={riseDelay(index)}
          >
            <SelfStudyLessonRow lesson={lesson} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {lessons.map((lesson, index) => (
        <li
          key={lesson.id}
          data-lesson-name={lesson.title}
          className={RISE_CLASS}
          style={riseDelay(index)}
        >
          <SelfStudyLessonCard lesson={lesson} />
        </li>
      ))}
    </ul>
  );
}
