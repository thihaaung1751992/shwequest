import LearnerStrip from "@/components/learner-strip";
import { HOME_HEADER_CLASS, SITE_HEADER_CLASS } from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import SiteLogo from "@/components/site-logo";
import SiteNav from "@/components/site-nav";

export default function PageShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const isHome = title === "Shwequest";

  return (
    <div
      className={
        isHome
          ? "relative flex min-h-dvh flex-col bg-cream font-sans text-zinc-900 dark:bg-slate-950 dark:text-zinc-50"
          : "relative flex min-h-dvh flex-col bg-white font-sans text-zinc-900 dark:bg-slate-950 dark:text-zinc-50"
      }
    >
      <LearnerStrip tone={isHome ? "cream" : "paper"} />
      <header className={isHome ? HOME_HEADER_CLASS : SITE_HEADER_CLASS}>
        <div className="mx-auto flex w-full max-w-page flex-wrap items-center gap-x-3 gap-y-2">
          <div className="flex min-w-0 items-center gap-3">
            {isHome ? (
              <h1>
                <SiteLogo />
              </h1>
            ) : (
              <>
                <SiteLogo />
                <h1 className="min-w-0 truncate text-lg font-bold tracking-tight">{title}</h1>
              </>
            )}
          </div>
          <SiteNav layout="bar" />
        </div>
      </header>
      <main
        className={
          isHome
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
