import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GATE_COOKIE, verifyGateToken } from "@/lib/site-gate";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const authed = verifyGateToken(request.cookies.get(GATE_COOKIE)?.value);

  if (pathname === "/login" || pathname.startsWith("/login/")) {
    if (authed) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (authed) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const login = new URL("/login", request.url);
  const next = `${pathname}${search}`;
  if (next && next !== "/") {
    login.searchParams.set("next", next);
  }
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
