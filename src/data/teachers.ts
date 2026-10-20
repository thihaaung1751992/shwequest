import {
  countLessons,
  demoUnitCatalog,
  earnedXp,
  placeholderCatalog,
  type PathUnit,
  type RoadmapNode,
} from "@/components/roadmap/roadmap-data";

export type TeacherAccent = "amber" | "sky" | "emerald";

export type Teacher = {
  id: string;
  label: string;
  accent: TeacherAccent;
  /** Portrait URL. Swap this for a real photo later. */
  image: string;
  /** This teacher's videos and games. Length is not shared with other teachers. */
  nodes: RoadmapNode[];
  units: PathUnit[];
};

/** Shared stand-in until each teacher has a photo. */
export const TEACHER_PLACEHOLDER_IMAGE = "/teachers/placeholder.svg";

const teacherOne = demoUnitCatalog();
const teacherTwo = placeholderCatalog(8, 2);
const teacherThree = placeholderCatalog(3, 5);

/** Placeholder labels and catalogs until real teacher names and lessons exist. */
export const TEACHERS: Teacher[] = [
  {
    id: "teacher-1",
    label: "Teacher 1",
    accent: "amber",
    image: TEACHER_PLACEHOLDER_IMAGE,
    nodes: teacherOne.nodes,
    units: teacherOne.units,
  },
  {
    id: "teacher-2",
    label: "Teacher 2",
    accent: "sky",
    image: TEACHER_PLACEHOLDER_IMAGE,
    nodes: teacherTwo.nodes,
    units: teacherTwo.units,
  },
  {
    id: "teacher-3",
    label: "Teacher 3",
    accent: "emerald",
    image: TEACHER_PLACEHOLDER_IMAGE,
    nodes: teacherThree.nodes,
    units: teacherThree.units,
  },
];

export function teacherById(id: string): Teacher | undefined {
  return TEACHERS.find((teacher) => teacher.id === id);
}

/** XP already earned across every teacher's catalog. Home and Teachers show this on the account pill. */
export function earnedXpTotal(teachers: readonly Teacher[] = TEACHERS): number {
  return teachers.reduce((sum, teacher) => sum + earnedXp(teacher.nodes), 0);
}

/** Videos and games added across every teacher. */
export function catalogTotals(teachers: readonly Teacher[] = TEACHERS): {
  videos: number;
  games: number;
} {
  return teachers.reduce(
    (sum, teacher) => {
      const counts = countLessons(teacher.nodes);
      return { videos: sum.videos + counts.videos, games: sum.games + counts.games };
    },
    { videos: 0, games: 0 },
  );
}
