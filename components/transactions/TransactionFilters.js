"use client";

import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/lib/categories";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const months = [
  { value: "", label: "Todos os meses" },
  ...Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: new Date(2000, i, 1).toLocaleString("pt-BR", { month: "long" }),
  })),
];

export function TransactionFilters({
  values,
  onChange,
  onSearch,
  forcedType,
  showTypeFilter = true,
}) {
  const year = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => year - i);

  const categoryOptions =
    forcedType === "entrada"
      ? INCOME_CATEGORIES
      : forcedType === "saida"
        ? EXPENSE_CATEGORIES
        : [...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Input
          label="Pesquisar título"
          name="search"
          placeholder="Ex.: mercado, aluguel..."
          value={values.search}
          onChange={(e) => onChange({ ...values, search: e.target.value })}
        />
        <Select
          label="Mês"
          name="month"
          value={values.month}
          onChange={(e) => onChange({ ...values, month: e.target.value })}
        >
          {months.map((m) => (
            <option key={m.value || "all"} value={m.value}>
              {m.label}
            </option>
          ))}
        </Select>
        <Select
          label="Ano"
          name="year"
          value={values.year}
          onChange={(e) => onChange({ ...values, year: e.target.value })}
        >
          <option value="">Todos os anos</option>
          {years.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </Select>
        <Select
          label="Categoria"
          name="category"
          value={values.category}
          onChange={(e) => onChange({ ...values, category: e.target.value })}
        >
          <option value="">Todas</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        {showTypeFilter && !forcedType ? (
          <Select
            label="Tipo"
            name="type"
            value={values.type}
            onChange={(e) => onChange({ ...values, type: e.target.value })}
          >
            <option value="">Todos</option>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </Select>
        ) : null}
        <Select
          label="Ordenar por data"
          name="sort"
          value={values.sort}
          onChange={(e) => onChange({ ...values, sort: e.target.value })}
        >
          <option value="desc">Mais recentes</option>
          <option value="asc">Mais antigas</option>
        </Select>
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => onSearch()}
          className="w-full sm:w-auto"
        >
          Aplicar filtros
        </Button>
      </div>
    </div>
  );
}
