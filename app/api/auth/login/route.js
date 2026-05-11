import { NextResponse } from "next/server";
import { validateCredentials } from "@/services/userService";
import { signToken } from "@/lib/jwt";
import { AUTH_COOKIE_NAME, getAuthCookieOptions } from "@/lib/cookie-options";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "E-mail e senha são obrigatórios" }, { status: 400 });
    }

    const user = await validateCredentials(email, password);
    if (!user) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    const token = signToken({ userId: user._id.toString(), email: user.email });

    const res = NextResponse.json({
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
    res.cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao entrar" }, { status: 500 });
  }
}
