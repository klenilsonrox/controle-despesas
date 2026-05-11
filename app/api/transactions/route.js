import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import { listTransactions, createTransaction } from "@/services/transactionService";

export async function GET(request) {
  try {
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = {
      month: searchParams.get("month") || undefined,
      year: searchParams.get("year") || undefined,
      category: searchParams.get("category") || undefined,
      type: searchParams.get("type") || undefined,
      search: searchParams.get("search") || undefined,
      sort: searchParams.get("sort") || "desc",
    };

    const items = await listTransactions(userId, query);
    return NextResponse.json({ items });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao listar" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const result = await createTransaction(userId, body);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ transaction: result.transaction }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao criar" }, { status: 500 });
  }
}
