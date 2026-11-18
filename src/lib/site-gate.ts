import { createHmac, timingSafeEqual } from "node:crypto";

export const GATE_COOKIE = "sq_gate";
const GATE_PAYLOAD = "shwequest-gate-v1";
const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 30;

function gateSecret(): string | null {
  const secret = process.env.SITE_GATE_SECRET;
  return secret && secret.length > 0 ? secret : null;
}

/** Constant-time string compare via equal-length digests. */
export function safeEqual(a: string, b: string): boolean {
  const left = createHmac("sha256", "sq-cmp").update(a).digest();
  const right = createHmac("sha256", "sq-cmp").update(b).digest();
  return timingSafeEqual(left, right);
}

export function createGateToken(): string {
  const secret = gateSecret();
  if (!secret) {
    throw new Error("SITE_GATE_SECRET is not configured");
  }
  return createHmac("sha256", secret).update(GATE_PAYLOAD).digest("hex");
}

export function verifyGateToken(token: string | undefined): boolean {
  if (!token || !gateSecret()) return false;
  let expected: string;
  try {
    expected = createGateToken();
  } catch {
    return false;
  }
  try {
    const left = Buffer.from(token);
    const right = Buffer.from(expected);
    if (left.length !== right.length) return false;
    return timingSafeEqual(left, right);
  } catch {
    return false;
  }
}

export function credentialsMatch(username: string, password: string): boolean {
  const expectedUser = process.env.SITE_GATE_USER ?? "";
  const expectedPass = process.env.SITE_GATE_PASSWORD ?? "";
  if (!expectedUser || !expectedPass || !gateSecret()) return false;
  return safeEqual(username, expectedUser) && safeEqual(password, expectedPass);
}

export function gateCookieOptions(): {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: "/";
  maxAge: number;
} {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SEC,
  };
}

/** Only same-origin relative paths; blocks open redirects. */
export function safeNextPath(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("://")) {
    return "/";
  }
  return raw;
}
