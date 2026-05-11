import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import { getReportForMonth } from "@/services/statsService";
import { listTransactions } from "@/services/transactionService";

export async function GET(request) {
  try {
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const now = new Date();
    const month = Number(searchParams.get("month")) || now.getMonth() + 1;
    const year = Number(searchParams.get("year")) || now.getFullYear();

    const report = await getReportForMonth(userId, year, month);
    const items = await listTransactions(userId, {
      month: String(month),
      year: String(year),
      sort: "desc",
    });

    return NextResponse.json({
      month,
      year,
      ...report,
      items,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao gerar relatório" }, { status: 500 });
  }
}
