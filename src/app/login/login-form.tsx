"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/login/actions";

const INITIAL: LoginState = { error: null };

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginAction, INITIAL);

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <input type="hidden" name="next" value={next} />

      <label className="flex flex-col gap-1.5 text-sm font-bold text-zinc-800 dark:text-zinc-100">
        Username
        <input
          name="username"
          type="text"
          autoComplete="username"
          required
          autoFocus
          className="rounded-xl border-2 border-amber-200 bg-white px-3 py-2.5 text-base font-semibold text-zinc-900 outline-hidden focus-visible:border-amber-400 focus-visible:ring-2 focus-visible:ring-sky-700 dark:border-white/15 dark:bg-slate-900 dark:text-zinc-50"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-bold text-zinc-800 dark:text-zinc-100">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-xl border-2 border-amber-200 bg-white px-3 py-2.5 text-base font-semibold text-zinc-900 outline-hidden focus-visible:border-amber-400 focus-visible:ring-2 focus-visible:ring-sky-700 dark:border-white/15 dark:bg-slate-900 dark:text-zinc-50"
        />
      </label>

      {state.error ? (
        <p
          role="alert"
          className="rounded-xl border-2 border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-800 dark:border-rose-500/40 dark:bg-rose-950/50 dark:text-rose-200"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="cta-3d cta-3d-orange mt-1 cursor-pointer px-5 py-3 text-base font-black disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
