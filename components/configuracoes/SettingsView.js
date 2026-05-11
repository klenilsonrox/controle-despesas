"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export function SettingsView() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPass, setSavingPass] = useState(false);

  async function saveProfile(e) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erro ao salvar");
        return;
      }
      setUser((prev) => (prev ? { ...prev, name: data.user.name } : prev));
      setName(data.user.name);
      toast.success("Perfil atualizado");
    } catch {
      toast.error("Erro de rede");
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(e) {
    e.preventDefault();
    setSavingPass(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erro ao alterar senha");
        return;
      }
      toast.success("Senha alterada");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      toast.error("Erro de rede");
    } finally {
      setSavingPass(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Configurações</h1>
        <p className="mt-1 text-sm text-slate-400">Gerencie seus dados de acesso e preferências básicas.</p>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-white">Perfil</h2>
        <p className="mt-1 text-sm text-slate-500">E-mail: {user?.email}</p>
        <form className="mt-4 flex flex-col gap-4" onSubmit={saveProfile}>
          <Input label="Nome" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Button type="submit" disabled={savingProfile}>
            {savingProfile ? "Salvando..." : "Salvar perfil"}
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-white">Alterar senha</h2>
        <p className="mt-1 text-sm text-slate-500">Use uma senha forte com pelo menos 6 caracteres.</p>
        <form className="mt-4 flex flex-col gap-4" onSubmit={savePassword}>
          <Input
            label="Senha atual"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="Nova senha"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
          <Button type="submit" disabled={savingPass}>
            {savingPass ? "Atualizando..." : "Atualizar senha"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
