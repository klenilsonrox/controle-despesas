"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { StatCard } from "@/components/dashboard/StatCard";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { formatBRL } from "@/lib/format";

const months = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: new Date(2000, i, 1).toLocaleString("pt-BR", { month: "long" }),
}));

export function RelatorioView() {
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState(null);

  const years = Array.from({ length: 6 }, (_, i) => now.getFullYear() - i);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ month, year });
      const res = await fetch(`/api/stats/report?${params}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erro ao carregar relatório");
        return;
      }
      setPayload(data);
    } catch {
      toast.error("Erro de rede");
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    load();
  }, [load]);

  const chartData = payload?.chartDaily || [];
  const totals = payload?.totals || { entradas: 0, saidas: 0, saldo: 0 };
  const items = payload?.items || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Relatórios</h1>
        <p className="mt-1 text-sm text-slate-400">
          Filtre por mês para analisar receitas, despesas e movimentações detalhadas.
        </p>
      </div>

      <Card>
        <div className="grid gap-4 sm:grid-cols-2 lg:max-w-xl">
          <Select label="Mês" value={month} onChange={(e) => setMonth(e.target.value)}>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Select>
          <Select label="Ano" value={year} onChange={(e) => setYear(e.target.value)}>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {loading ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-800" />
            ))}
          </div>
          <div className="h-72 animate-pulse rounded-2xl bg-slate-800" />
          <div className="h-40 animate-pulse rounded-2xl bg-slate-800" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard title="Total recebido no mês" value={formatBRL(totals.entradas)} accent="emerald" />
            <StatCard title="Total gasto no mês" value={formatBRL(totals.saidas)} accent="rose" />
            <StatCard title="Saldo mensal" value={formatBRL(totals.saldo)} accent="sky" />
          </div>

          <Card>
            <h3 className="text-lg font-semibold text-white">Fluxo diário no mês</h3>
            <p className="text-sm text-slate-400">Entradas, saídas e saldo por dia</p>
            <div className="mt-4 h-80 w-full">
              {chartData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  Sem movimentações neste mês
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ left: 0, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="dia" stroke="#64748b" tickFormatter={(v) => `Dia ${v}`} />
                    <YAxis stroke="#64748b" tickFormatter={(v) => `R$ ${v}`} />
                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: "12px",
                      }}
                      formatter={(value) =>
                        new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                          value
                        )
                      }
                    />
                    <Legend />
                    <Line type="monotone" dataKey="entradas" name="Entradas" stroke="#34d399" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="saidas" name="Saídas" stroke="#fb7185" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="saldo" name="Saldo dia" stroke="#38bdf8" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-white">Movimentações do mês</h3>
            <TransactionsTable items={items} loading={false} readOnly />
          </div>
        </>
      )}
    </div>
  );
}
