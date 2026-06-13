import type { ReactNode } from "react";
import { useCollapsed } from "./CollapseContext";

export interface NavItemProps {
  /** Leading icon (decorative — the `label` is the accessible name). */
  icon: ReactNode;
  /** Visible text label (hidden when the sidebar is collapsed). */
  label: string;
  /** Highlight as the current route. The app computes this (e.g. via its router). */
  active?: boolean;
  /** Render greyed-out and non-interactive (kept visible for discoverability). */
  disabled?: boolean;
  /** Tooltip shown when disabled — explain why + how to enable. */
  disabledTitle?: string;
  /** Show an amber attention dot (e.g. a queue awaiting the user). */
  badge?: boolean;
  /** Accessible name for the badge dot (only used when `badge`). */
  badgeLabel?: string;
  /** Click handler — the app wires navigation here (router-agnostic lib). */
  onClick?: () => void;
  /** Optional anchor target; when set (and enabled) the item renders as `<a>`. */
  href?: string;
}

/**
 * A single navigation entry. Router-agnostic: the consuming app passes `active`
 * (computed from its own router) and either `onClick` or `href`. With `onClick`
 * and no `href` it renders a `<button>` (NEX Studio's navigate-on-click model);
 * with an `href` it renders an `<a>`. Reads the collapsed state from context.
 */
export function NavItem({
  icon,
  label,
  active,
  disabled,
  disabledTitle,
  badge,
  badgeLabel,
  onClick,
  href,
}: NavItemProps) {
  const collapsed = useCollapsed();

  const base = "flex items-center gap-2.5 py-2 rounded-lg text-sm transition-colors w-full";
  const px = collapsed ? "px-0 justify-center" : "px-3";
  const color = disabled
    ? "text-[var(--color-text-muted)] opacity-40 cursor-not-allowed"
    : active
      ? "bg-primary-600/10 text-[var(--color-accent-primary)]"
      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]";

  const tooltip = disabled ? (disabledTitle ?? label) : collapsed ? label : undefined;
  const className = `${base} ${px} ${color} relative`;

  const inner = (
    <>
      {icon}
      {!collapsed && <span>{label}</span>}
      {badge && (
        <span
          aria-label={badgeLabel}
          className={
            collapsed
              ? "absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--color-status-in-design)]"
              : "ml-auto h-2 w-2 rounded-full bg-[var(--color-status-in-design)]"
          }
        />
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <a className={className} href={href} title={tooltip} onClick={onClick}>
        {inner}
      </a>
    );
  }

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  return (
    <button type="button" className={className} onClick={handleClick} disabled={disabled} title={tooltip}>
      {inner}
    </button>
  );
}
