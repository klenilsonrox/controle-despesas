import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { FiTrendingUp } from "react-icons/fi";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
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
          <h1 className="text-2xl font-bold tracking-tight">Criar conta</h1>
          <p className="mt-2 text-sm text-slate-400">Cadastro rápido para começar a organizar suas finanças.</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/40 backdrop-blur">
          <h2 className="text-lg font-semibold text-white">Registrar</h2>
          <RegisterForm />
        </div>
        <p className="mt-8 text-center text-xs text-slate-600">
          Já possui acesso?{" "}
          <Link className="text-emerald-500 hover:text-emerald-400" href="/login">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
