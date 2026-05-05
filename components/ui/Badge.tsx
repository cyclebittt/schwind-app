interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "gold" | "silver" | "bronze";
  size?: "sm" | "md";
}

const variants = {
  default: "bg-[var(--color-surface-2)] text-[var(--color-muted)] border-[var(--color-border)]",
  success: "bg-green-50 text-green-800 border-green-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  danger:  "bg-red-50 text-red-800 border-red-200",
  gold:    "bg-amber-50 text-amber-700 border-amber-300",
  silver:  "bg-slate-100 text-slate-600 border-slate-300",
  bronze:  "bg-orange-50 text-orange-700 border-orange-200",
};

const sizes = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
};

export function Badge({ children, variant = "default", size = "md" }: BadgeProps) {
  return (
    <span className={["inline-flex items-center border rounded-md font-medium", variants[variant], sizes[size]].join(" ")}>
      {children}
    </span>
  );
}
