export function Input({ label, id, className = "", ...rest }) {
  const inputId = id || rest.name;
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      {label ? <span className="font-medium text-slate-300">{label}</span> : null}
      <input
        id={inputId}
        className={`rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${className}`}
        {...rest}
      />
    </label>
  );
}
