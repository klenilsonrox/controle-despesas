import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import { isValidCategory } from "@/lib/categories";

function buildFilter(userId, { month, year, category, type, search }) {
  const filter = { user: new mongoose.Types.ObjectId(userId) };

  if (type === "entrada" || type === "saida") {
    filter.type = type;
  }

  if (category) {
    filter.category = category;
  }

  if (search && String(search).trim()) {
    filter.title = { $regex: String(search).trim(), $options: "i" };
  }

  if (month && year) {
    const m = Number(month);
    const y = Number(year);
    if (m >= 1 && m <= 12 && y > 2000) {
      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 0, 23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }
  } else if (year) {
    const y = Number(year);
    if (y > 2000) {
      const start = new Date(y, 0, 1);
      const end = new Date(y, 11, 31, 23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }
  }

  return filter;
}

export async function listTransactions(userId, query) {
  await connectDB();
  const { month, year, category, type, search, sort = "desc" } = query;
  const filter = buildFilter(userId, { month, year, category, type, search });
  const sortOrder = sort === "asc" ? 1 : -1;
  const items = await Transaction.find(filter).sort({ date: sortOrder }).lean();
  return items.map((t) => ({
    id: t._id.toString(),
    title: t.title,
    value: t.value,
    type: t.type,
    category: t.category,
    description: t.description,
    date: t.date,
  }));
}

export async function getTransactionById(userId, id) {
  await connectDB();
  const doc = await Transaction.findOne({
    _id: id,
    user: userId,
  }).lean();
  if (!doc) {
    return null;
  }
  return {
    id: doc._id.toString(),
    title: doc.title,
    value: doc.value,
    type: doc.type,
    category: doc.category,
    description: doc.description,
    date: doc.date,
  };
}

export async function createTransaction(userId, body) {
  const { title, value, type, category, description, date } = body;
  if (!title || value == null || !type || !category || !date) {
    return { error: "Campos obrigatórios ausentes" };
  }
  if (type !== "entrada" && type !== "saida") {
    return { error: "Tipo inválido" };
  }
  if (!isValidCategory(type, category)) {
    return { error: "Categoria inválida para o tipo" };
  }
  const num = Number(value);
  if (Number.isNaN(num) || num < 0) {
    return { error: "Valor inválido" };
  }

  await connectDB();
  const doc = await Transaction.create({
    title: String(title).trim(),
    value: num,
    type,
    category,
    description: description != null ? String(description) : "",
    date: new Date(date),
    user: userId,
  });

  return {
    transaction: {
      id: doc._id.toString(),
      title: doc.title,
      value: doc.value,
      type: doc.type,
      category: doc.category,
      description: doc.description,
      date: doc.date,
    },
  };
}

export async function updateTransaction(userId, id, body) {
  const existing = await getTransactionById(userId, id);
  if (!existing) {
    return { error: "Movimentação não encontrada" };
  }

  const { title, value, type, category, description, date } = body;
  const nextType = type != null ? type : existing.type;
  const nextCategory = category != null ? category : existing.category;

  if (nextType !== "entrada" && nextType !== "saida") {
    return { error: "Tipo inválido" };
  }
  if (!isValidCategory(nextType, nextCategory)) {
    return { error: "Categoria inválida para o tipo" };
  }

  const num = value != null ? Number(value) : existing.value;
  if (Number.isNaN(num) || num < 0) {
    return { error: "Valor inválido" };
  }

  await connectDB();
  const doc = await Transaction.findOneAndUpdate(
    { _id: id, user: userId },
    {
      title: title != null ? String(title).trim() : existing.title,
      value: num,
      type: nextType,
      category: nextCategory,
      description: description != null ? String(description) : existing.description,
      date: date != null ? new Date(date) : existing.date,
    },
    { new: true }
  ).lean();

  return {
    transaction: {
      id: doc._id.toString(),
      title: doc.title,
      value: doc.value,
      type: doc.type,
      category: doc.category,
      description: doc.description,
      date: doc.date,
    },
  };
}

export async function deleteTransaction(userId, id) {
  await connectDB();
  const res = await Transaction.deleteOne({ _id: id, user: userId });
  return res.deletedCount === 1;
}

export async function aggregateTotals(userId, extraFilter = {}) {
  await connectDB();
  const match = { user: new mongoose.Types.ObjectId(userId), ...extraFilter };
  const agg = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$value" },
      },
    },
  ]);

  let entradas = 0;
  let saidas = 0;
  for (const row of agg) {
    if (row._id === "entrada") {
      entradas = row.total;
    }
    if (row._id === "saida") {
      saidas = row.total;
    }
  }

  return {
    entradas,
    saidas,
    saldo: entradas - saidas,
  };
}

export async function spendingByCategory(userId, extraFilter = {}) {
  await connectDB();
  const match = {
    user: new mongoose.Types.ObjectId(userId),
    type: "saida",
    ...extraFilter,
  };
  return Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$value" },
      },
    },
    { $sort: { total: -1 } },
  ]);
}

export async function incomeByMonth(userId, monthsBack = 6) {
  await connectDB();
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1);

  const rows = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        type: "entrada",
        date: { $gte: start },
      },
    },
    {
      $group: {
        _id: {
          y: { $year: "$date" },
          m: { $month: "$date" },
        },
        total: { $sum: "$value" },
      },
    },
    { $sort: { "_id.y": 1, "_id.m": 1 } },
  ]);

  return rows.map((r) => ({
    key: `${r._id.y}-${String(r._id.m).padStart(2, "0")}`,
    label: `${String(r._id.m).padStart(2, "0")}/${r._id.y}`,
    total: r.total,
  }));
}
