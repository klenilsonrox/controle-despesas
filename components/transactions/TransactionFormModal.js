"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/lib/categories";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { toInputDateValue } from "@/lib/format";

function todayInput() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function TransactionFormModal({
  open,
  onClose,
  onSaved,
  initialType = "entrada",
  transaction,
}) {
  const isEdit = Boolean(transaction);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState(initialType);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(todayInput());
  const [saving, setSaving] = useState(false);

  const categories = useMemo(
    () => (type === "entrada" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES),
    [type]
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    if (transaction) {
      setTitle(transaction.title || "");
      setValue(String(transaction.value ?? ""));
      setType(transaction.type);
      setCategory(transaction.category || "");
      setDescription(transaction.description || "");
      setDate(toInputDateValue(transaction.date) || todayInput());
    } else {
      setTitle("");
      setValue("");
      setType(initialType);
      setCategory("");
      setDescription("");
      setDate(todayInput());
    }
  }, [open, transaction, initialType]);

  useEffect(() => {
    if (!open) {
      return;
    }
    if (!transaction && categories.length && !category) {
      setCategory(categories[0]);
    }
  }, [open, transaction, categories, category]);

  useEffect(() => {
    if (!categories.includes(category)) {
      setCategory(categories[0] || "");
    }
  }, [type, categories, category]);

  if (!open) {
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title,
        value: Number(value),
        type,
        category,
        description,
        date,
      };

      const url = isEdit ? `/api/transactions/${transaction.id}` : "/api/transactions";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Não foi possível salvar");
        return;
      }

      toast.success(isEdit ? "Movimentação atualizada" : "Movimentação criada");
      onSaved?.();
      onClose();
    } catch {
      toast.error("Erro de rede");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Fechar"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white">
          {isEdit ? "Editar movimentação" : "Nova movimentação"}
        </h3>
        <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input label="Título" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input
            label="Valor (R$)"
            name="value"
            type="number"
            min="0"
            step="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
          <Select label="Tipo" name="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </Select>
          <Select
            label="Categoria"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Input
            label="Descrição"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input label="Data" name="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
