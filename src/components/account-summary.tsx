"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import LearnerAvatar from "@/components/profile/learner-avatar";
import { useLearner } from "@/data/learner-context";
import { useMessages } from "@/i18n/locale-context";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

export default function AccountSummary({ xp }: { xp?: number }) {
  const copy = useMessages();
  const { learner } = useLearner();

  return (
    <Link
      href="/profile"
      aria-label={copy.profile.openProfile}
      className={`flex min-w-0 max-w-full items-center gap-2.5 rounded-full bg-transparent py-0.5 pl-1 transition-colors hover:bg-amber-50/80 sm:gap-3 dark:hover:bg-white/5 ${xp !== undefined ? "pr-0.5" : "pr-2.5"} ${FOCUS}`}
    >
      <LearnerAvatar src={learner.image} size="strip" />
      <p className="hidden min-w-0 truncate text-sm font-black tracking-tight text-amber-950 sm:block sm:max-w-28 md:max-w-36 dark:text-amber-50">
        {learner.displayName}
      </p>
      {xp !== undefined ? (
        <>
          <span
            aria-hidden
            className="hidden h-4 w-px shrink-0 bg-amber-300 sm:block dark:bg-white/20"
          />
          <p className="stat-chip-3d pill-3d-amber inline-flex min-h-7 shrink-0 items-center gap-1 rounded-full px-2.5 text-xs font-black text-amber-950 tabular-nums sm:min-h-8 sm:px-3 sm:text-sm">
            <Star
              className="size-3.5 shrink-0 fill-white text-amber-700 sm:size-4"
              strokeWidth={2.25}
              aria-hidden
            />
            {xp} XP
          </p>
        </>
      ) : null}
    </Link>
  );
}
