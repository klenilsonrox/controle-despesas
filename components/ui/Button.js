export function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  disabled,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary:
      "bg-emerald-500 text-slate-950 hover:bg-emerald-400 focus-visible:outline-emerald-400",
    secondary:
      "border border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700 focus-visible:outline-slate-500",
    danger:
      "bg-rose-600 text-white hover:bg-rose-500 focus-visible:outline-rose-400",
    ghost: "bg-transparent text-slate-200 hover:bg-slate-800 focus-visible:outline-slate-500",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
