"use client";

import LearnerStrip from "@/components/learner-strip";
import { SITE_HEADER_CLASS } from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import SiteLogo from "@/components/site-logo";
import SiteNav from "@/components/site-nav";
import { useMessages } from "@/i18n/locale-context";
import { earnedXpTotal } from "@/data/teachers";

export default function PageShell({
  title,
  children,
  bleed = false,
}: {
  title: string;
  children: React.ReactNode;
  /** Full-width main (no max-w-page padding). Home is always bleed. */
  bleed?: boolean;
}) {
  const copy = useMessages();
  const isHome = title === "Shwequest";
  const heading =
    title === "Teachers"
      ? copy.nav.teachers
      : title === "Leaderboard"
        ? copy.nav.leaderboard
        : title;
  const fullMain = isHome || bleed;

  return (
    <div className="relative flex min-h-dvh flex-col bg-cream font-sans text-zinc-900 dark:bg-slate-950 dark:text-zinc-50">
      <LearnerStrip xp={earnedXpTotal()} tone="cream" />
      <header className={SITE_HEADER_CLASS}>
        <div className="mx-auto flex w-full max-w-page items-center gap-x-2 sm:gap-x-3">
          <div className="flex min-w-0 shrink-0 items-center gap-3">
            {isHome ? (
              <h1>
                <SiteLogo />
              </h1>
            ) : (
              <>
                <SiteLogo />
                <h1 className="sr-only">{heading}</h1>
              </>
            )}
          </div>
          <SiteNav layout="bar" />
        </div>
      </header>
      <main
        className={
          fullMain
            ? "relative z-10 w-full flex-1"
            : "relative z-10 mx-auto w-full max-w-page flex-1 px-4 pt-6 pb-8"
        }
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
