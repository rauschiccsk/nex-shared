import type { ReactNode, SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Mark the field invalid → red border + `aria-invalid`. */
  invalid?: boolean;
  /** `<option>` children. */
  children?: ReactNode;
}

// Same field styling as <Input> (the NEX form pattern), native <select>.
const BASE =
  "w-full bg-slate-800 border rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary-500";

export function Select({ invalid, className = "", children, ...rest }: SelectProps) {
  const border = invalid ? "border-red-500" : "border-slate-700";
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
