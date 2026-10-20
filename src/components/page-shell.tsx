import LearnerStrip from "@/components/learner-strip";
import { SITE_HEADER_CLASS } from "@/components/site-header";
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
  return (
    <div className="relative flex min-h-dvh flex-col bg-white font-sans text-zinc-900 dark:bg-slate-950 dark:text-zinc-50">
      <LearnerStrip />
      <header className={SITE_HEADER_CLASS}>
        <div className="mx-auto flex w-full max-w-page items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {title === "Shwequest" ? (
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
          <SiteNav />
        </div>
      </header>
      <main className="relative z-10 mx-auto w-full max-w-page flex-1 px-4 pt-6 pb-8">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
