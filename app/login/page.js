import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { LoginForm } from "@/components/auth/LoginForm";
import { FiTrendingUp } from "react-icons/fi";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/40">
            <FiTrendingUp size={26} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Minhas Despesas</h1>
          <p className="mt-2 text-sm text-slate-400">Entre para acompanhar seu dinheiro com clareza.</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/40 backdrop-blur">
          <h2 className="text-lg font-semibold text-white">Login</h2>
          <Suspense
            fallback={<div className="mt-8 text-center text-sm text-slate-500">Carregando formulário...</div>}
          >
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-8 text-center text-xs text-slate-600">
          Ao continuar você concorda em usar o app apenas para fins pessoais.{" "}
          <Link className="text-emerald-500 hover:text-emerald-400" href="/register">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
