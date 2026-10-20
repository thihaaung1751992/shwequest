type LearnerProfile = {
  displayName: string;
  /** Portrait URL. Swap this for the signed-in learner's photo later. */
  image: string;
  /** Day the purchased plan ends (YYYY-MM-DD). Null when this learner has no plan. */
  planEndsOn: string | null;
};

/** Stand-in until sign-in exists. The top account strip shows this label and icon. */
export const LEARNER: LearnerProfile = {
  displayName: "Learner 1",
  image: "/learner/placeholder.svg",
  planEndsOn: "2026-11-19",
};

const MS_PER_DAY = 86_400_000;

/** Whole local days from today until `endsOn`. Negative once that day has passed. */
export function planDaysRemaining(endsOn: string, now = new Date()): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(endsOn);
  if (!match) return -1;

  const end = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((end.getTime() - today.getTime()) / MS_PER_DAY);
}
