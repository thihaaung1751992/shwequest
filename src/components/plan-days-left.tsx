"use client";

import { useEffect, useState } from "react";
import { useMessages } from "@/i18n/locale-context";
import type { Messages } from "@/i18n/messages";
import { planDaysRemaining } from "@/data/learner";

function daysLeftLabel(days: number, copy: Messages): { short: string; full: string } {
  return { short: copy.daysShort(days), full: copy.daysFull(days) };
}

/** Days left on a purchased plan. Counted in the browser so prerender stays stable. */
export default function PlanDaysLeft({ endsOn }: { endsOn: string | null }) {
  const copy = useMessages();
  const [labels, setLabels] = useState<{ short: string; full: string } | null>(
    null,
  );

  useEffect(() => {
    if (endsOn === null) {
      setLabels(null);
      return;
    }
    const days = planDaysRemaining(endsOn);
    setLabels(days >= 0 ? daysLeftLabel(days, copy) : null);
  }, [endsOn, copy]);

  if (labels === null) return null;

  return (
    <p
      title={labels.full}
      className="inline-flex min-h-7 shrink-0 items-center rounded-full bg-emerald-100 px-2 text-xs font-extrabold tracking-tight text-emerald-900 sm:min-h-8 sm:px-3 sm:text-sm dark:bg-emerald-500/15 dark:text-emerald-100"
    >
      <span className="sm:hidden">{labels.short}</span>
      <span className="hidden sm:inline">{labels.full}</span>
    </p>
  );
}
