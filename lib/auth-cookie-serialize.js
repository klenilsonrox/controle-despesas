import { serialize } from "cookie";
import { AUTH_COOKIE_NAME, clearAuthCookieOptions, getAuthCookieOptions } from "@/lib/cookie-options";

/**
 * Serialização do cookie JWT (pacote `cookie`), útil para testes ou integrações
 * fora do helper `NextResponse.cookies` do Next.js.
 */
export function serializeAuthCookie(token) {
  const o = getAuthCookieOptions();
  return serialize(AUTH_COOKIE_NAME, token, {
    httpOnly: o.httpOnly,
    secure: o.secure,
    sameSite: o.sameSite,
    path: o.path,
    maxAge: o.maxAge,
  });
}

export function serializeClearAuthCookie() {
  const o = clearAuthCookieOptions();
  return serialize(AUTH_COOKIE_NAME, "", {
    httpOnly: o.httpOnly,
    secure: o.secure,
    sameSite: o.sameSite,
    path: o.path,
    maxAge: o.maxAge,
  });
}
