import {
  EVERYDAY_BASIC_ENGLISH_PHRASES,
  type EverydayBasicEnglishPhrase,
} from "@/data/everyday-basic-english";
import type { TeacherAccent } from "@/data/teachers";

export type FreeLessonDialogSpeaker = "mike" | "sarah";

export type FreeLessonDialogTurn = {
  speaker: FreeLessonDialogSpeaker;
  text: string;
};

export type FreeLessonSection = {
  id: string;
  title: string;
  /** Myanmar gloss for the right content pane (optional). */
  bodyMy?: string;
  /** EN speaking turns for the white pane under the title stage (optional). */
  dialog?: FreeLessonDialogTurn[];
};

/** EN-only dialog for free-1 section "Any" (no Myanmar lines). */
const FREE_1_ANY_DIALOG: FreeLessonDialogTurn[] = [
  { speaker: "mike", text: "Do we need any snacks for the trip?" },
  {
    speaker: "sarah",
    text: "Yes, but we don't have any chips left at home.",
  },
  { speaker: "mike", text: "Should I buy potato chips or corn chips?" },
  {
    speaker: "sarah",
    text: "Any kind is fine with me. Just get some water too.",
  },
  { speaker: "mike", text: "Is there anyone else coming with us?" },
  {
    speaker: "sarah",
    text: "No, I didn't invite anyone. We can go anywhere we want.",
  },
  { speaker: "mike", text: "Great! What time should I pick you up?" },
  { speaker: "sarah", text: "Any time after 9 AM is perfect." },
];

function withFree1AnyDialog(sections: FreeLessonSection[]): FreeLessonSection[] {
  return sections.map((section) =>
    section.id === "free-1-s1"
      ? { ...section, dialog: FREE_1_ANY_DIALOG }
      : section,
  );
}

export type FreeLesson = {
  id: string;
  title: string;
  image: string;
  duration: string;
  accent: TeacherAccent;
  /** When true, listing links to the course. Omit/false → Coming Soon (not clickable). */
  available?: boolean;
  /** Sidebar titles for the course detail shell (content pane later). */
  sections: FreeLessonSection[];
};

/** Shared cover until each free lesson has its own art. */
export const FREE_LESSON_PLACEHOLDER_IMAGE = "/self-study/placeholder.svg";

function sections(courseId: string, titles: string[]): FreeLessonSection[] {
  return titles.map((title, index) => ({
    id: `${courseId}-s${index + 1}`,
    title,
  }));
}

function sectionsFromPhrases(
  courseId: string,
  phrases: EverydayBasicEnglishPhrase[],
): FreeLessonSection[] {
  return phrases.map((phrase, index) => ({
    id: `${courseId}-s${index + 1}`,
    title: phrase.title,
    ...(phrase.bodyMy ? { bodyMy: phrase.bodyMy } : {}),
  }));
}

/** Placeholder free lessons for the self-study listing. */
export const FREE_LESSONS: FreeLesson[] = [
  {
    id: "free-1",
    title: "Everyday Basic English Speaking",
    image: "/self-study/everyday-basic-english-speaking.webp",
    duration: "891",
    accent: "emerald",
    available: true,
    sections: withFree1AnyDialog(
      sectionsFromPhrases("free-1", EVERYDAY_BASIC_ENGLISH_PHRASES),
    ),
  },
  {
    id: "free-2",
    title: "Greetings at the Market",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "5:45",
    accent: "amber",
    sections: sections("free-2", [
      "Hello & goodbye",
      "Asking the price",
      "Polite thanks",
      "Market role-play",
    ]),
  },
  {
    id: "free-3",
    title: "Numbers 1 to 20",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "6:10",
    accent: "sky",
    sections: sections("free-3", [
      "Count 1–10",
      "Count 11–20",
      "How many?",
      "Quick quiz",
    ]),
  },
  {
    id: "free-4",
    title: "Simple Questions",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "7:02",
    accent: "emerald",
    sections: sections("free-4", [
      "What / Where",
      "Who / When",
      "Yes–no questions",
      "Practice pairs",
    ]),
  },
  {
    id: "free-5",
    title: "Daily Routines",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "5:30",
    accent: "amber",
    sections: sections("free-5", [
      "Morning steps",
      "At school",
      "Evening wind-down",
      "Tell your day",
    ]),
  },
  {
    id: "free-6",
    title: "Food Words",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "6:48",
    accent: "sky",
    sections: sections("free-6", [
      "Fruit & veg",
      "Meals",
      "I like / I don't like",
      "Order aloud",
    ]),
  },
  {
    id: "free-7",
    title: "Polite Phrases",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "4:55",
    accent: "emerald",
    sections: sections("free-7", [
      "Please & thank you",
      "Excuse me",
      "Sorry & it's okay",
      "Soften a request",
    ]),
  },
  {
    id: "free-8",
    title: "Listening Warm-up",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "8:15",
    accent: "amber",
    sections: sections("free-8", [
      "Sound check",
      "Short clip A",
      "Short clip B",
      "What did you hear?",
    ]),
  },
  {
    id: "free-9",
    title: "Colors & Shapes",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "5:12",
    accent: "sky",
    sections: sections("free-9", [
      "Basic colors",
      "Shapes around us",
      "Describe an object",
      "Find & say",
    ]),
  },
  {
    id: "free-10",
    title: "Family Words",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "6:05",
    accent: "emerald",
    sections: sections("free-10", [
      "Parents & siblings",
      "Grandparents",
      "This is my…",
      "Family tree talk",
    ]),
  },
  {
    id: "free-11",
    title: "Weather Talk",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "4:40",
    accent: "amber",
    sections: sections("free-11", [
      "Sunny / rainy",
      "Hot & cold",
      "What's it like today?",
      "Pack for the weather",
    ]),
  },
  {
    id: "free-12",
    title: "Time of Day",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "5:55",
    accent: "sky",
    sections: sections("free-12", [
      "Morning / afternoon",
      "Evening / night",
      "What time is it?",
      "Plan your hours",
    ]),
  },
  {
    id: "free-13",
    title: "At the Cafe",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "7:20",
    accent: "emerald",
    sections: sections("free-13", [
      "Menu words",
      "Ordering drinks",
      "Paying politely",
      "Cafe dialogue",
    ]),
  },
  {
    id: "free-14",
    title: "Body Parts",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "6:30",
    accent: "amber",
    sections: sections("free-14", [
      "Head & face",
      "Arms & hands",
      "Legs & feet",
      "Point & name",
    ]),
  },
  {
    id: "free-15",
    title: "Weekend Plans",
    image: FREE_LESSON_PLACEHOLDER_IMAGE,
    duration: "5:18",
    accent: "sky",
    sections: sections("free-15", [
      "Fun activities",
      "I'm going to…",
      "Invite a friend",
      "Share your plan",
    ]),
  },
];

export function freeLessonById(id: string): FreeLesson | undefined {
  return FREE_LESSONS.find((lesson) => lesson.id === id);
}

export function freeLessonStaticParams(): { id: string }[] {
  return FREE_LESSONS.map((lesson) => ({ id: lesson.id }));
}

export function freeLessonHref(id: string): string {
  return `/self-study/${id}`;
}
