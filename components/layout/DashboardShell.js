"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBarChart2,
  FiHome,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiTrendingDown,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: FiHome },
  { href: "/entradas", label: "Entradas", icon: FiTrendingUp },
  { href: "/saidas", label: "Saídas", icon: FiTrendingDown },
  { href: "/relatorios", label: "Relatórios", icon: FiBarChart2 },
  { href: "/configuracoes", label: "Configurações", icon: FiSettings },
];

export function DashboardShell({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col border-r border-slate-800 bg-slate-900/95 backdrop-blur transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-4">
          <Link href="/dashboard" className="text-lg font-bold tracking-tight text-emerald-400">
            Minhas Despesas
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            <FiX size={22} />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon className="shrink-0 opacity-90" size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="shrink-0 border-t border-slate-800 p-3">
          <div className="mb-2 truncate rounded-lg bg-slate-800/60 px-3 py-2 text-xs text-slate-400">
            <div className="truncate font-semibold text-slate-200">{user?.name}</div>
            <div className="truncate">{user?.email}</div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-300 transition hover:bg-rose-500/10"
          >
            <FiLogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          aria-label="Fechar overlay"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/80 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-200 hover:bg-slate-800"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
          >
            <FiMenu size={22} />
          </button>
          <span className="text-sm font-semibold text-emerald-400">Painel</span>
          <span className="w-9" />
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
