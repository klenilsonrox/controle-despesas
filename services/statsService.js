import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import { aggregateTotals, spendingByCategory, incomeByMonth } from "@/services/transactionService";

function monthRange(year, month) {
  const y = Number(year);
  const m = Number(month);
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0, 23, 59, 59, 999);
  return { start, end };
}

export async function getDashboardBundle(userId) {
  await connectDB();
  const totals = await aggregateTotals(userId);
  const byCategory = await spendingByCategory(userId);
  const byMonthIncome = await incomeByMonth(userId, 6);

  return {
    totals,
    spendingByCategory: byCategory.map((c) => ({
      name: c._id,
      value: c.total,
    })),
    incomeByMonth: byMonthIncome,
  };
}

export async function getReportForMonth(userId, year, month) {
  await connectDB();
  const { start, end } = monthRange(year, month);
  const dateFilter = { date: { $gte: start, $lte: end } };

  const totals = await aggregateTotals(userId, dateFilter);

  const daily = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        ...dateFilter,
      },
    },
    {
      $group: {
        _id: { $dayOfMonth: "$date" },
        entradas: {
          $sum: { $cond: [{ $eq: ["$type", "entrada"] }, "$value", 0] },
        },
        saidas: {
          $sum: { $cond: [{ $eq: ["$type", "saida"] }, "$value", 0] },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    totals,
    chartDaily: daily.map((d) => ({
      dia: d._id,
      entradas: d.entradas,
      saidas: d.saidas,
      saldo: d.entradas - d.saidas,
    })),
  };
}
