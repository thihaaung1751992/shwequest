"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  GATE_COOKIE,
  credentialsMatch,
  createGateToken,
  gateCookieOptions,
  safeNextPath,
} from "@/lib/site-gate";

export type LoginState = {
  error: string | null;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(String(formData.get("next") ?? "/"));

  if (!credentialsMatch(username, password)) {
    return { error: "Invalid username or password." };
  }

  const store = await cookies();
  store.set(GATE_COOKIE, createGateToken(), gateCookieOptions());
  redirect(next);
}
