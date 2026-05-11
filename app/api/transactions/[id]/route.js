import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import {
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "@/services/transactionService";

export async function GET(request, context) {
  try {
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await context.params;
    const item = await getTransactionById(userId, id);
    if (!item) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ transaction: item });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao buscar" }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const result = await updateTransaction(userId, id, body);
    if (result.error) {
      const status = result.error === "Movimentação não encontrada" ? 404 : 400;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json({ transaction: result.transaction });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await context.params;
    const ok = await deleteTransaction(userId, id);
    if (!ok) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao excluir" }, { status: 500 });
  }
}
