import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import { updateUserPassword } from "@/services/userService";

export async function PATCH(request) {
  try {
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Preencha as senhas" }, { status: 400 });
    }
    if (String(newPassword).length < 6) {
      return NextResponse.json(
        { error: "A nova senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    const result = await updateUserPassword(userId, currentPassword, newPassword);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao alterar senha" }, { status: 500 });
  }
}
