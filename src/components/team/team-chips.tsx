"use client";

import { CirclePlay, Gamepad2, Sparkles } from "lucide-react";
import { useMessages } from "@/i18n/locale-context";
import { countLessons } from "@/components/roadmap/roadmap-data";
import { ACCENT_STYLES } from "@/components/teachers/teacher-accent";
import { teacherById } from "@/data/teachers";
import type { TeamPerson } from "@/data/team";

/** Teacher: video + game counts. Builder: one tagline chip. */
export default function TeamChips({
  person,
  className = "",
}: {
  person: TeamPerson;
  className?: string;
}) {
  const copy = useMessages();
  const accent = ACCENT_STYLES[person.accent];
  const chip = `stat-chip-3d inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${accent.pill} ${accent.pillText}`;
  const teacher = person.kind === "teacher" ? teacherById(person.id) : undefined;

  if (!teacher) {
    return (
      <ul className={`flex flex-wrap gap-2 text-sm font-bold ${className}`}>
        <li className={chip}>
          <Sparkles aria-hidden className="size-4" />
          {copy.team.builderTagline}
        </li>
      </ul>
    );
  }

  const { videos, games } = countLessons(teacher.nodes);
  return (
    <ul className={`flex flex-wrap gap-2 text-sm font-bold ${className}`}>
      <li className={chip}>
        <CirclePlay aria-hidden className="size-4" />
        {copy.teachers.videos(videos)}
      </li>
      <li className={chip}>
        <Gamepad2 aria-hidden className="size-4" />
        {copy.teachers.games(games)}
      </li>
    </ul>
  );
}
