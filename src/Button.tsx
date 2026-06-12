import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "sm" | "md";

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
const BASE =
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

const VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-primary-600 text-white hover:bg-primary-500",
  secondary: "bg-slate-800 text-slate-200 hover:bg-slate-700",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
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
