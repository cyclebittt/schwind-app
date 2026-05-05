"use client";

import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variants = {
  primary:   "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] border-transparent shadow-sm",
  secondary: "bg-white text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] shadow-sm",
  danger:    "bg-[var(--color-accent-2)] text-white hover:bg-red-700 border-transparent shadow-sm",
  ghost:     "bg-transparent text-[var(--color-muted)] border-transparent hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]",
};

const sizes = {
  sm: "px-4 py-2.5 text-sm min-h-[42px]",
  md: "px-5 py-3 text-base min-h-[48px]",
  lg: "px-7 py-3.5 text-lg min-h-[54px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, className = "", children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg border font-semibold",
        "transition-all duration-150 cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant], sizes[size], className,
      ].join(" ")}
      {...props}
    >
      {loading && <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  )
);

Button.displayName = "Button";
