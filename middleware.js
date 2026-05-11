import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/cookie-options";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/entradas",
  "/saidas",
  "/relatorios",
  "/configuracoes",
];

function isProtectedPath(pathname) {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    const login = new URL("/login", request.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/entradas/:path*",
    "/saidas/:path*",
    "/relatorios/:path*",
    "/configuracoes/:path*",
  ],
};
