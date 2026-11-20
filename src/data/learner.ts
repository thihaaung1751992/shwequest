export type LearnerProfile = {
  displayName: string;
  /** Portrait URL or data URL from a local photo pick. */
  image: string;
  /** Day the purchased plan ends (YYYY-MM-DD). Null when this learner has no plan. */
  planEndsOn: string | null;
  email: string;
  phone: string;
  address: string;
  telegram: string;
  tiktok: string;
  facebook: string;
  linkedin: string;
  twitter: string;
  /** Short intro on the profile page. */
  bio: string;
  /** Teacher catalog ids this learner bought / is studying. */
  enrolledTeacherIds: readonly string[];
};

export const LEARNER_STORAGE_KEY = "shwequest-learner-profile";

/**
 * Stand-in until real sign-in exists.
 * Edits on `/profile` persist in localStorage under LEARNER_STORAGE_KEY.
 */
export const LEARNER: LearnerProfile = {
  displayName: "Learner 1",
  image: "/learner/placeholder.svg",
  planEndsOn: "2027-02-28",
  email: "learner1@example.com",
  phone: "+95 9 000 000 000",
  address: "Yangon, Myanmar",
  telegram: "",
  tiktok: "",
  facebook: "",
  linkedin: "",
  twitter: "",
  bio: "Learning English one path at a time.",
  enrolledTeacherIds: ["teacher-1"],
};

const EDITABLE_KEYS = [
  "displayName",
  "image",
  "email",
  "phone",
  "address",
  "telegram",
  "tiktok",
  "facebook",
  "linkedin",
  "twitter",
  "bio",
] as const satisfies readonly (keyof LearnerProfile)[];

type EditableKey = (typeof EDITABLE_KEYS)[number];

/** Merge stored edits onto the default mock. Plan + enrollments stay from LEARNER until a real account API exists. */
export function parseStoredLearner(raw: string | null): LearnerProfile {
  if (!raw) return LEARNER;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return LEARNER;
    const patch = parsed as Record<string, unknown>;
    const next: LearnerProfile = { ...LEARNER };
    for (const key of EDITABLE_KEYS) {
      const value = patch[key];
      if (typeof value === "string") next[key] = value;
    }
    return next;
  } catch {
    return LEARNER;
  }
}

export function serializeLearnerEdits(profile: LearnerProfile): string {
  const payload: Partial<Record<EditableKey, string>> = {};
  for (const key of EDITABLE_KEYS) {
    payload[key] = profile[key];
  }
  return JSON.stringify(payload);
}

const MS_PER_DAY = 86_400_000;

/** Whole local days from today until `endsOn`. Negative once that day has passed. */
export function planDaysRemaining(endsOn: string, now = new Date()): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(endsOn);
  if (!match) return -1;

  const end = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((end.getTime() - today.getTime()) / MS_PER_DAY);
}

export function isLearnerImageLocal(src: string): boolean {
  return src.startsWith("data:") || src.startsWith("blob:");
}
