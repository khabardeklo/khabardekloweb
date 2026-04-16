import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Role = "admin" | "editor" | "author" | "reporter";

const protectedAdminRoutes = ["/dashboard", "/create-pages", "/categories", "/users", "/reporter-management", "/analytics", "/settings"];
const reporterRoutes = ["/reporter", "/news"];

const decodeRole = (token: string): Role | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const json = atob(padded);
    const parsed = JSON.parse(json) as { role?: Role };

    return parsed.role ?? null;
  } catch {
    return null;
  }
};

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get("accessToken")?.value;
  const role = accessToken ? decodeRole(accessToken) : null;

  if (pathname === "/" || pathname === "/login/super-admin" || pathname === "/login/reporter") {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (role) {
      return NextResponse.redirect(new URL("/reporter", request.url));
    }

    return NextResponse.next();
  }

  if (protectedAdminRoutes.some((route) => pathname.startsWith(route))) {
    if (!role) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/reporter", request.url));
    }
  }

  if (reporterRoutes.some((route) => pathname.startsWith(route))) {
    if (!role) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login/super-admin/:path*",
    "/login/reporter/:path*",
    "/dashboard/:path*",
    "/create-pages/:path*",
    "/reporter/:path*",
    "/news/:path*",
    "/categories/:path*",
    "/users/:path*",
    "/reporter-management/:path*",
    "/analytics/:path*",
    "/settings/:path*",
  ],
};