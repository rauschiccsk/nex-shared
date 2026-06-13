import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

// The React form of the `.card` token (tokens.css) — a simple surface container.
// `className` appends layout/spacing (mt-4, p-4, max-w-lg, …) at the call site.
const BASE =
  "rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)]";

export function Card({ className = "", children, ...rest }: CardProps) {
  return (
    <div className={`${BASE} ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
