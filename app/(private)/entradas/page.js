import { TransactionsManager } from "@/components/transactions/TransactionsManager";

export const metadata = {
  title: "Entradas | Minhas Despesas",
};

export default function EntradasPage() {
  return (
    <TransactionsManager
      title="Entradas"
      subtitle="Registre e filtre todas as suas receitas."
      forcedType="entrada"
    />
  );
}
