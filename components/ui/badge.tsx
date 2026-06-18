type BadgeProps = {
  variant?: "primary" | "secondary" | "danger";
  children: React.ReactNode;
};

const base =
  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";

const variants = {
  primary: "bg-indigo-50 text-indigo-700",
  secondary: "bg-green-50 text-green-700",
  danger: "bg-amber-50 text-amber-700",
};

export function Badge({ variant = "primary", children }: BadgeProps) {
  return <span className={`${base} ${variants[variant]}`}>{children}</span>;
}
