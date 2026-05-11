"use client";

import Link from "next/link";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { FiArrowRight } from "react-icons/fi";
import { StatCard } from "@/components/dashboard/StatCard";
import { SpendingByCategoryChart } from "@/components/dashboard/SpendingByCategoryChart";
import { IncomeByMonthChart } from "@/components/dashboard/IncomeByMonthChart";
import { formatBRL } from "@/lib/format";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const linkBtn =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-slate-700";

export function DashboardView() {
  const { data, loading, error, reload } = useDashboardStats();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-800" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-800" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-2xl bg-slate-800" />
          <div className="h-80 animate-pulse rounded-2xl bg-slate-800" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
        <p className="text-slate-300">Não foi possível carregar o dashboard.</p>
        <button
          type="button"
          className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
          onClick={() => reload()}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const { totals, spendingByCategory, incomeByMonth } = data;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Visão geral das suas finanças em tempo real.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/entradas" className={linkBtn}>
            Ver entradas <FiArrowRight />
          </Link>
          <Link href="/saidas" className={linkBtn}>
            Ver saídas <FiArrowRight />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total de entradas"
          value={formatBRL(totals.entradas)}
          hint="Todas as receitas registradas"
          accent="emerald"
        />
        <StatCard
          title="Total de saídas"
          value={formatBRL(totals.saidas)}
          hint="Todos os gastos registrados"
          accent="rose"
        />
        <StatCard
          title="Saldo atual"
          value={formatBRL(totals.saldo)}
          hint="Entradas menos saídas"
          accent="sky"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SpendingByCategoryChart data={spendingByCategory} />
        <IncomeByMonthChart data={incomeByMonth} />
      </div>
    </div>
  );
}
