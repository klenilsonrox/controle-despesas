import { NextResponse } from "next/server";
import { createUser } from "@/services/userService";
import { signToken } from "@/lib/jwt";
import { AUTH_COOKIE_NAME, getAuthCookieOptions } from "@/lib/cookie-options";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Preencha todos os campos" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    const result = await createUser({ name, email, password });
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const user = result.user;
    const token = signToken({ userId: user._id.toString(), email: user.email });

    const res = NextResponse.json({
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
    res.cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao cadastrar" }, { status: 500 });
  }
}
