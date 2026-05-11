"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/Card";

const COLORS = [
  "#34d399",
  "#22d3ee",
  "#a78bfa",
  "#fb7185",
  "#fbbf24",
  "#38bdf8",
  "#4ade80",
  "#f472b6",
];

export function SpendingByCategoryChart({ data }) {
  const chartData = Array.isArray(data) ? data : [];

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-white">Gastos por categoria</h3>
          <p className="text-sm text-slate-400">Distribuição das saídas</p>
        </div>
      </div>
      <div className="h-72 w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Sem dados de saída ainda
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" tickFormatter={(v) => `R$ ${v}`} />
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                stroke="#94a3b8"
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(15,23,42,0.35)" }}
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                }}
                formatter={(value) => [
                  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                    value
                  ),
                  "Total",
                ]}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
