import type { HTMLAttributes, ReactNode } from "react";

export type StatusBadgeStatus = "success" | "warning" | "error" | "info" | "neutral";

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Semantic state → color pair from tokens.css. Defaults to `neutral`. */
  status?: StatusBadgeStatus;
  /** Subtle attention animation (e.g. a pending state). */
  pulse?: boolean;
  children?: ReactNode;
}

// A colored status pill (rounded-full) — the reference NEX Studio Users screen shows a
// status as a green "aktívny" badge instead of a plain-text "Áno". Each state reads the
// semantic --color-state-<x>-bg/-fg token pair (light + dark both resolved in tokens.css),
// so no colors are hardcoded here. Sibling of <Badge> (the generic 2-variant label); this
// one is the semantic-status specialisation.
const BASE = "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium";

const STATUS: Record<StatusBadgeStatus, string> = {
  success:
    "bg-[var(--color-state-success-bg)] border-[var(--color-state-success-bg)] text-[var(--color-state-success-fg)]",
  warning:
    "bg-[var(--color-state-warning-bg)] border-[var(--color-state-warning-bg)] text-[var(--color-state-warning-fg)]",
  error:
    "bg-[var(--color-state-error-bg)] border-[var(--color-state-error-bg)] text-[var(--color-state-error-fg)]",
  info: "bg-[var(--color-state-info-bg)] border-[var(--color-state-info-bg)] text-[var(--color-state-info-fg)]",
  neutral:
    "bg-[var(--color-state-muted-bg)] border-[var(--color-state-muted-bg)] text-[var(--color-state-muted-fg)]",
};

export function StatusBadge({
  status = "neutral",
  pulse = false,
  className = "",
  children,
  ...rest
}: StatusBadgeProps) {
  return (
    <span
      className={`${BASE} ${STATUS[status]} ${pulse ? "animate-pulse" : ""} ${className}`
        .replace(/\s+/g, " ")
        .trim()}
      {...rest}
    >
      {children}
    </span>
  );
}
