import { NextRequest, NextResponse } from "next/server";

const ROLE_PREFIXES: Record<string, string> = {
  "/admin": "admin",
  "/agent": "agent",
  "/client": "client",
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const matchedPrefix = Object.keys(ROLE_PREFIXES).find((p) =>
    pathname.startsWith(p)
  );

  if (!matchedPrefix) return NextResponse.next();

  const sessionCookie = req.cookies.get("cm_session")?.value;

  if (!sessionCookie) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const session = JSON.parse(sessionCookie);
    const requiredRole = ROLE_PREFIXES[matchedPrefix];
    if (session.role !== requiredRole) {
      const redirectUrl = new URL(`/${session.role}`, req.url);
      return NextResponse.redirect(redirectUrl);
    }
  } catch {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/agent/:path*", "/client/:path*"],
};
