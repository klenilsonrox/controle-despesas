import { TransactionsManager } from "@/components/transactions/TransactionsManager";

export const metadata = {
  title: "Saídas | Minhas Despesas",
};

export default function SaidasPage() {
  return (
    <TransactionsManager
      title="Saídas"
      subtitle="Acompanhe e categorize seus gastos com precisão."
      forcedType="saida"
    />
  );
}
