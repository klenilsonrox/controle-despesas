"use client";

import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { formatBRL, formatDate } from "@/lib/format";

export function TransactionsTable({
  items,
  loading,
  onEdit = () => {},
  onDelete = () => {},
  readOnly,
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-sm text-slate-400">
        Carregando movimentações...
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-10 text-center text-sm text-slate-500">
        Nenhuma movimentação encontrada com os filtros atuais.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3 text-right">Valor</th>
              {readOnly ? null : <th className="px-4 py-3 text-right">Ações</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {items.map((row) => (
              <tr key={row.id} className="hover:bg-slate-800/40">
                <td className="whitespace-nowrap px-4 py-3 text-slate-300">{formatDate(row.date)}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-100">{row.title}</div>
                  {row.description ? (
                    <div className="mt-0.5 line-clamp-1 text-xs text-slate-500">{row.description}</div>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-slate-300">{row.category}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                      row.type === "entrada"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-rose-500/15 text-rose-300"
                    }`}
                  >
                    {row.type === "entrada" ? "Entrada" : "Saída"}
                  </span>
                </td>
                <td
                  className={`whitespace-nowrap px-4 py-3 text-right font-semibold ${
                    row.type === "entrada" ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {row.type === "entrada" ? "+" : "-"}
                  {formatBRL(row.value)}
                </td>
                {readOnly ? null : (
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-slate-300 hover:bg-slate-800"
                        aria-label="Editar"
                        onClick={() => onEdit(row)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg p-2 text-rose-300 hover:bg-rose-500/10"
                        aria-label="Excluir"
                        onClick={() => onDelete(row)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
