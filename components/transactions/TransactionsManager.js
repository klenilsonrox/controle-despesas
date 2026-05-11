"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { TransactionFormModal } from "@/components/transactions/TransactionFormModal";
import { ConfirmDialog } from "@/components/transactions/ConfirmDialog";

function buildQuery(values, forcedType) {
  const params = new URLSearchParams();
  if (values.search) {
    params.set("search", values.search);
  }
  if (values.month) {
    params.set("month", values.month);
  }
  if (values.year) {
    params.set("year", values.year);
  }
  if (values.category) {
    params.set("category", values.category);
  }
  const type = forcedType || values.type;
  if (type) {
    params.set("type", type);
  }
  if (values.sort) {
    params.set("sort", values.sort);
  }
  return params.toString();
}

export function TransactionsManager({ title, subtitle, forcedType }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    month: "",
    year: String(new Date().getFullYear()),
    category: "",
    type: "",
    sort: "desc",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, item: null });
  const [deleting, setDeleting] = useState(false);

  const initialModalType = useMemo(() => forcedType || "entrada", [forcedType]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = buildQuery(filters, forcedType);
      const res = await fetch(`/api/transactions?${qs}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erro ao carregar");
        setItems([]);
        return;
      }
      setItems(data.items || []);
    } catch {
      toast.error("Erro de rede");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filters, forcedType]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    setModalOpen(true);
  }

  function openDelete(row) {
    setConfirm({ open: true, item: row });
  }

  async function confirmDelete() {
    if (!confirm.item) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/transactions/${confirm.item.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Não foi possível excluir");
        return;
      }
      toast.success("Movimentação excluída");
      setConfirm({ open: false, item: null });
      load();
    } catch {
      toast.error("Erro de rede");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        </div>
        <Button type="button" onClick={openCreate}>
          Nova movimentação
        </Button>
      </div>

      <TransactionFilters
        values={filters}
        onChange={setFilters}
        onSearch={load}
        forcedType={forcedType}
        showTypeFilter={!forcedType}
      />

      <TransactionsTable items={items} loading={loading} onEdit={openEdit} onDelete={openDelete} />

      <TransactionFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={load}
        initialType={editing?.type || initialModalType}
        transaction={editing}
      />

      <ConfirmDialog
        open={confirm.open}
        title="Excluir movimentação"
        message="Tem certeza que deseja excluir este registro? Essa ação não pode ser desfeita."
        loading={deleting}
        onCancel={() => {
          if (!deleting) {
            setConfirm({ open: false, item: null });
          }
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
