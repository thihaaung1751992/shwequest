import type { TeacherAccent } from "@/data/teachers";

export type FreeLesson = {
  id: string;
  title: string;
  image: string;
  duration: string;
  accent: TeacherAccent;
};

/** Shared cover until each free lesson has its own art. */
export const FREE_LESSON_PLACEHOLDER_IMAGE = "/self-study/placeholder.svg";

/** Placeholder free lessons for the self-study listing. */
export const FREE_LESSONS: FreeLesson[] = [
  {
    id: "free-1",
    title: "Alphabet Sounds",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "4:20",
    accent: "emerald",
  },
  {
    id: "free-2",
    title: "Greetings at the Market",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "5:45",
    accent: "amber",
  },
  {
    id: "free-3",
    title: "Numbers 1 to 20",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "6:10",
    accent: "sky",
  },
  {
    id: "free-4",
    title: "Simple Questions",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "7:02",
    accent: "emerald",
  },
  {
    id: "free-5",
    title: "Daily Routines",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "5:30",
    accent: "amber",
  },
  {
    id: "free-6",
    title: "Food Words",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "6:48",
    accent: "sky",
  },
  {
    id: "free-7",
    title: "Polite Phrases",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "4:55",
    accent: "emerald",
  },
  {
    id: "free-8",
    title: "Listening Warm-up",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "8:15",
    accent: "amber",
  },
  {
    id: "free-9",
    title: "Colors & Shapes",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "5:12",
    accent: "sky",
  },
  {
    id: "free-10",
    title: "Family Words",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "6:05",
    accent: "emerald",
  },
  {
    id: "free-11",
    title: "Weather Talk",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "4:40",
    accent: "amber",
  },
  {
    id: "free-12",
    title: "Time of Day",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "5:55",
    accent: "sky",
  },
  {
    id: "free-13",
    title: "At the Cafe",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "7:20",
    accent: "emerald",
  },
  {
    id: "free-14",
    title: "Body Parts",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "6:30",
    accent: "amber",
  },
  {
    id: "free-15",
    title: "Weekend Plans",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "5:18",
    accent: "sky",
  },
];
