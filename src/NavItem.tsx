import type { ReactNode } from "react";
import { useCollapsed } from "./CollapseContext";
import { useDense } from "./DensityContext";
import { useShell } from "./ShellContext";

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
  /** Show a dot beside the label (e.g. a queue awaiting the user). */
  badge?: boolean;
  /** Accessible name for the badge dot (only used when `badge`). */
  badgeLabel?: string;
  /**
   * The dot's colour: `attention` (amber, the default) when something waits for the user, `danger` (red) when
   * something is broken — e.g. failed checks.
   */
  badgeTone?: "attention" | "danger";
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
  badgeTone = "attention",
  onClick,
  href,
}: NavItemProps) {
  const collapsed = useCollapsed();
  const dense = useDense();
  // In the drawer of a narrow screen, choosing an entry also closes the drawer — the chosen page is underneath it.
  const { closeMenu } = useShell();
  const choose = () => {
    onClick?.();
    closeMenu();
  };

  // A FIXED 35px row (Director, 2026-07-27), not vertical padding. Padding gave an unpredictable
  // height: the emoji nav glyph renders taller than its `leading-none` line box, so the flex row grew
  // to ~47px at py-2 and ~40px at py-1.5 — never the value the padding implied. An explicit height
  // with `items-center` pins the row regardless of glyph metrics, and apps keep gaining nav entries,
  // so the rail must stop scrolling. v0.21.0: 28px in a dense sidebar (on a touch screen still at least 44px).
  const base = `flex items-center gap-2.5 ${dense ? "h-7" : "h-[35px]"} rounded-lg text-sm transition-colors w-full`;
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
          data-tone={badgeTone}
          className={`${collapsed ? "absolute right-1 top-1" : "ml-auto"} h-2 w-2 rounded-full ${
            badgeTone === "danger" ? "bg-[var(--color-status-error)]" : "bg-[var(--color-status-in-design)]"
          }`}
        />
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <a className={className} href={href} title={tooltip} onClick={choose}>
        {inner}
      </a>
    );
  }

  const handleClick = () => {
    if (disabled) return;
    choose();
  };

  return (
    <button type="button" className={className} onClick={handleClick} disabled={disabled} title={tooltip}>
      {inner}
    </button>
  );
}
