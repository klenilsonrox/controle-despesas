export const INCOME_CATEGORIES = ["IPTV", "salário", "adiantamento"];

export const EXPENSE_CATEGORIES = [
  "aluguel",
  "água",
  "luz",
  "uber",
  "99",
  "lazer",
  "internet",
  "casa",
  "açougue",
  "mercado",
  "farmácia",
  "cartão de crédito",
  "combustível",
  "delivery",
  "assinatura",
  "manutenção",
  "outros",
];

export function isValidCategory(type, category) {
  const list = type === "entrada" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  return list.includes(category);
}
