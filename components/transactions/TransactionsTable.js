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
    <>
      <div className="flex flex-col gap-3 md:hidden">
        {items.map((row) => (
          <div
            key={row.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-slate-100">{row.title}</div>
                <div className="mt-0.5 text-xs text-slate-500">{formatDate(row.date)}</div>
              </div>
              <div
                className={`whitespace-nowrap text-right text-base font-semibold ${
                  row.type === "entrada" ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {row.type === "entrada" ? "+" : "-"}
                {formatBRL(row.value)}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                  row.type === "entrada"
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "bg-rose-500/15 text-rose-300"
                }`}
              >
                {row.type === "entrada" ? "Entrada" : "Saída"}
              </span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                {row.category}
              </span>
            </div>
            {row.description ? (
              <p className="mt-2 line-clamp-2 text-xs text-slate-500">{row.description}</p>
            ) : null}
            {readOnly ? null : (
              <div className="mt-3 flex justify-end gap-1 border-t border-slate-800 pt-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
                  aria-label="Editar"
                  onClick={() => onEdit(row)}
                >
                  <FiEdit2 />
                  Editar
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10"
                  aria-label="Excluir"
                  onClick={() => onDelete(row)}
                >
                  <FiTrash2 />
                  Excluir
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 md:block">
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
    </>
  );
}
