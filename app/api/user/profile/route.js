import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import { updateUserProfile } from "@/services/userService";

export async function PATCH(request) {
  try {
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;
    if (!name || !String(name).trim()) {
      return NextResponse.json({ error: "Nome inválido" }, { status: 400 });
    }

    const user = await updateUserProfile(userId, { name: String(name).trim() });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}
