import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { ButtonVariant, ButtonSize } from "./Button";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** The icon element. Consumer-supplied — nex-shared ships no icon library, so the
   *  app passes its own icon node (e.g. a lucide element or an inline <svg>). */
  icon: ReactNode;
  /** REQUIRED accessible name — an icon-only button has no visible text label. */
  "aria-label": string;
  /** Visual style (shared vocabulary with <Button>). Defaults to `ghost` — the
   *  quiet look used for table row actions (edit / deactivate). */
  variant?: ButtonVariant;
  /** Square padding scale. Defaults to `md`. */
  size?: ButtonSize;
}

// Icon-only counterpart of <Button>: same variant vocabulary + token colors, but square
// padding (no horizontal label space) so it reads as a compact action button. The icon is
// passed as a ReactNode by the consumer, keeping nex-shared free of any icon dependency.
const BASE =
  "inline-flex items-center justify-center rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

const VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-[var(--color-accent-primary)] text-white hover:bg-[var(--color-accent-primary-hover)]",
  secondary:
    "bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-active)]",
  danger: "bg-red-600 text-white hover:bg-red-500 active:bg-red-700",
  ghost:
    "bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "p-1.5",
  md: "p-2",
  lg: "p-2.5",
};

export function IconButton({
  icon,
  variant = "ghost",
  size = "md",
  className = "",
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={`${BASE} ${VARIANT[variant]} ${SIZE[size]} ${className}`.trim()}
      {...rest}
    >
      {icon}
    </button>
  );
}
