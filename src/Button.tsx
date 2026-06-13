import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Defaults to `primary`. */
  variant?: ButtonVariant;
  /** Padding/text scale. Defaults to `md`. */
  size?: ButtonSize;
  children?: ReactNode;
}

// Tailwind UTILITY classes inlined directly (NOT the `.btn` component class) — this is deliberate:
// it forces the consumer's Tailwind v4 to detect these classes from the lib's built output via `@source`
// (the cross-package class-detection mechanism this slice de-risks). Visuals match `.btn-primary` etc.
// Tailwind UTILITY classes inlined (NOT the `.btn` class) so the consumer's Tailwind v4 detects them from the
// lib dist via `@source`. Theme-aware (CR-NS-058): primary/secondary/ghost read the semantic accent/surface
// tokens (one indigo source); danger stays an inline red (a destructive action is mode-independent). `gap-2`
// in BASE spaces an icon+label (Inbox embeds lucide icons in buttons).
const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

const VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-[var(--color-accent-primary)] text-white hover:bg-[var(--color-accent-primary-hover)]",
  secondary:
    "bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-active)]",
  danger: "bg-red-600 text-white hover:bg-red-500 active:bg-red-700",
  ghost: "bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${BASE} ${VARIANT[variant]} ${SIZE[size]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
