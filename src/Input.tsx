import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Mark the field invalid → red border + `aria-invalid`. */
  invalid?: boolean;
}

// Tailwind utility composition (like Button.tsx) — the canonical NEX field style.
// Border color is a separate token so `invalid` overrides it cleanly (no class-order
// conflict with a base border color).
const BASE =
  "w-full bg-[var(--color-surface)] border rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-focus)]";

export function Input({ invalid, className = "", ...rest }: InputProps) {
  const border = invalid ? "border-red-500" : "border-[var(--color-border-default)]";
  return (
    <input
      className={`${BASE} ${border} ${className}`.trim()}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}
