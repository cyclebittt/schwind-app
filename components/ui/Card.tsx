interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = "", hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        "bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl card-shadow",
        hover ? "transition-all duration-150 hover:border-[var(--color-accent)] hover:shadow-md cursor-pointer" : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
