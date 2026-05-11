export function Select({ label, id, children, className = "", ...rest }) {
  const selectId = id || rest.name;
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      {label ? <span className="font-medium text-slate-300">{label}</span> : null}
      <select
        id={selectId}
        className={`rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${className}`}
        {...rest}
      >
        {children}
      </select>
    </label>
  );
}
