import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import LoginForm from "@/app/login/login-form";
import { safeNextPath } from "@/lib/site-gate";

export const metadata: Metadata = {
  title: "Sign in · Shwequest",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function firstParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

async function LoginFormFromUrl({ searchParams }: { searchParams: SearchParams }) {
  const next = safeNextPath(firstParam((await searchParams).next));
  return <LoginForm next={next} />;
}

export default function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center bg-cream px-4 py-12 font-sans text-zinc-900 dark:bg-slate-950 dark:text-zinc-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgb(251_191_36_/_0.22),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgb(56_189_248_/_0.12),_transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,_rgb(245_158_11_/_0.15),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgb(14_165_233_/_0.1),_transparent_50%)]"
      />
      <div className="relative w-full max-w-sm rounded-[1.75rem] border-2 border-amber-200/80 bg-white/90 p-6 shadow-[0_12px_0_rgb(251_191_36_/_0.35)] dark:border-white/10 dark:bg-slate-900/90 dark:shadow-[0_12px_0_rgb(15_23_42)] sm:p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Image
            src="/shwequest-logo.jpg"
            alt=""
            width={560}
            height={486}
            className="h-16 w-auto rounded-xl shadow-md ring-2 ring-amber-200 sm:h-20"
            priority
          />
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Shwequest
          </h1>
          <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
            Sign in to continue. The site is locked for now.
          </p>
        </div>
        <Suspense fallback={<LoginForm next="/" />}>
          <LoginFormFromUrl searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
