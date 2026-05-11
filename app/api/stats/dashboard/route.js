import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import { getDashboardBundle } from "@/services/statsService";

export async function GET() {
  try {
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const data = await getDashboardBundle(userId);
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao carregar estatísticas" }, { status: 500 });
  }
}
