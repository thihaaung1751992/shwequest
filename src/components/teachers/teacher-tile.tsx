"use client";

import Link from "next/link";
import { useMessages } from "@/i18n/locale-context";
import SelfStudyComingSoon from "@/components/self-study/self-study-coming-soon";
import { teacherComingSoon, type Teacher } from "@/data/teachers";
import { ACCENT_STYLES } from "@/components/teachers/teacher-accent";
import TeacherPortrait from "@/components/teachers/teacher-portrait";
import TeacherProgress from "@/components/teachers/teacher-progress";
import { resetTilt, tiltCard } from "@/components/teachers/teacher-tilt";

export default function TeacherTile({ teacher }: { teacher: Teacher }) {
  const copy = useMessages();
  const accent = ACCENT_STYLES[teacher.accent];
  const available = !teacherComingSoon(teacher.id);
  const shellClass = `teacher-card-3d teacher-stage group relative flex aspect-square flex-col items-center justify-center gap-2.5 overflow-hidden rounded-3xl p-3 text-center focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-700 ${accent.tone}${available ? "" : " cursor-not-allowed"}`;

  const body = (
    <>
      <span
        className={
          available
            ? "transition-transform duration-300 motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:scale-105"
            : "opacity-80"
        }
      >
        <TeacherPortrait src={teacher.image} size="tile" />
      </span>
      <span className="w-full truncate text-sm font-black sm:text-base">{teacher.label}</span>
      <span className="block w-3/4">
        <TeacherProgress teacher={teacher} variant="bar" />
      </span>
      {available ? null : <SelfStudyComingSoon label={copy.teachers.comingSoon} />}
    </>
  );

  if (available) {
    return (
      <Link
        href={`/map?teacher=${teacher.id}`}
        onPointerMove={tiltCard}
        onPointerLeave={resetTilt}
        className={shellClass}
      >
        {body}
      </Link>
    );
  }

  return (
    <div
      className={shellClass}
      aria-disabled="true"
      aria-label={`${teacher.label} — ${copy.teachers.comingSoon}`}
    >
      {body}
    </div>
  );
}
