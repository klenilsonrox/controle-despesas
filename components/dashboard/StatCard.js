import { Card } from "@/components/ui/Card";

export function StatCard({ title, value, hint, accent = "emerald" }) {
  const accents = {
    emerald: "from-emerald-500/25 to-emerald-500/0",
    rose: "from-rose-500/25 to-rose-500/0",
    sky: "from-sky-500/25 to-sky-500/0",
  };

  return (
    <Card className="relative overflow-hidden">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 ${accents[accent]}`}
      />
      <div className="relative">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">{value}</p>
        {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      </div>
    </Card>
  );
}
