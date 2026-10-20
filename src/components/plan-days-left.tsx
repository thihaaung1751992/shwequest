"use client";

import { useEffect, useState } from "react";
import { planDaysRemaining } from "@/data/learner";

function daysLeftLabel(days: number): string {
  if (days === 0) return "Ends today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

/** Days left on a purchased plan. Counted in the browser so prerender stays stable. */
export default function PlanDaysLeft({ endsOn }: { endsOn: string | null }) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (endsOn === null) {
      setLabel(null);
      return;
    }
    const days = planDaysRemaining(endsOn);
    setLabel(days >= 0 ? daysLeftLabel(days) : null);
  }, [endsOn]);

  if (label === null) return null;

  return (
    <p className="mr-auto inline-flex min-h-8 items-center rounded-full bg-emerald-100 px-3 text-sm font-extrabold tracking-tight text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-100">
      {label}
    </p>
  );
}
