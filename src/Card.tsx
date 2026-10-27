import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

// The React form of the `.card` token (tokens.css) — a surface container that keeps its content off its border with
// one consistent inner spacing (DEV-240: left to every call site, it was forgotten in 52 of 54 cards of one app).
// `className` appends layout (mt-4, max-w-lg, …). An explicit padding there (p-4, p-[18px], p-0 for a card that wraps
// a table edge to edge) REPLACES the default rather than joining it: Tailwind orders utilities by property, not by
// their order in className, so "p-5 p-0" would not mean "no padding".
const BASE =
  "rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)]";
const DEFAULT_PADDING = "p-5";
const HAS_PADDING = /(^|\s)p-\S+/;

export function Card({ className = "", children, ...rest }: CardProps) {
  const padding = HAS_PADDING.test(className) ? "" : DEFAULT_PADDING;
  return (
    <div className={[BASE, padding, className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
}
