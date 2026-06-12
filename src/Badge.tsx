import type { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant = "neutral" | "muted";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Color preset. Defaults to `neutral`. Pass `className` for ad-hoc colors. */
  variant?: BadgeVariant;
  /** Subtle attention animation (e.g. a pending decision). */
  pulse?: boolean;
  children?: ReactNode;
}

// Small inline label, Tailwind-composed. Kept deliberately simple (2 variants +
// pulse) — dynamic per-case colors are supplied app-side via `className`.
const BASE = "inline-flex items-center rounded px-1.5 py-0.5 text-xs";

const VARIANT: Record<BadgeVariant, string> = {
  neutral: "bg-slate-800 text-slate-300",
  muted: "bg-slate-600/20 text-slate-300",
};

export function Badge({ variant = "neutral", pulse = false, className = "", children, ...rest }: BadgeProps) {
  return (
    <span
      className={`${BASE} ${VARIANT[variant]} ${pulse ? "animate-pulse" : ""} ${className}`.replace(/\s+/g, " ").trim()}
      {...rest}
    >
      {children}
    </span>
  );
}
