import type { ReactNode, SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Mark the field invalid → red border + `aria-invalid`. */
  invalid?: boolean;
  /** `<option>` children. */
  children?: ReactNode;
}

// Same field styling as <Input> (the NEX form pattern), native <select>.
const BASE =
  "w-full bg-[var(--color-surface)] border rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-focus)]";

export function Select({ invalid, className = "", children, ...rest }: SelectProps) {
  const border = invalid ? "border-red-500" : "border-[var(--color-border-default)]";
  return (
    <select
      className={`${BASE} ${border} ${className}`.trim()}
      aria-invalid={invalid || undefined}
      {...rest}
    >
      {children}
    </select>
  );
}
