export function formatBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value) || 0);
}

/** Converte "YYYY-MM-DD" (input date) em Date no fuso local, sem deslocar o dia. */
export function parseLocalDateInput(value) {
  if (value == null || value === "") {
    return null;
  }
  if (value instanceof Date) {
    return value;
  }
  const str = String(value).trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(str);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  }
  const d = new Date(str);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return "";
  }
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function toInputDateValue(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return "";
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
