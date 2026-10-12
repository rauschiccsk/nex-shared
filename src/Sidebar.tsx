import type { ReactNode } from "react";
import { CollapseContext } from "./CollapseContext";
import { useShell } from "./ShellContext";

export interface SidebarProps {
  /** Whether the rail is collapsed. State is OWNED BY THE APP. */
  collapsed: boolean;
  /** Toggle handler for the collapse button. */
  onToggleCollapse: () => void;
  /** Brand/logo block at the top (hidden when collapsed). */
  logo?: ReactNode;
  /** Footer block at the bottom (e.g. user card + presence toggle). */
  footer?: ReactNode;
  /** Nav body — compose shared `<NavItem>` / `<SectionLabel>` (and app extras). */
  children?: ReactNode;
  /** Toggle tooltip when expanded (click collapses). NEX-Slovak default. */
  collapseTitle?: string;
  /** Toggle tooltip when collapsed (click expands). NEX-Slovak default. */
  expandTitle?: string;
  /** Tooltip of the button that closes the sidebar while it is a drawer (narrow screen). NEX-Slovak default. */
  closeMenuTitle?: string;
}

const IconClose = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// The collapse control — a UI toggle (not a nav entry), so it stays an SVG glyph.
const IconSidebarToggle = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.8" />
    <path d="M9 3v18" strokeWidth="1.8" />
  </svg>
);

/**
 * The collapsible sidebar container: a fixed-width rail (3.5rem collapsed /
 * 14rem expanded) with a header (logo + collapse toggle), a scrollable nav body
 * (`children`), and a footer slot. Provides `CollapseContext` so nested
 * `<NavItem>` / `<SectionLabel>` read the collapsed state without prop-threading.
 * Router-agnostic and store-agnostic — all data comes via slots / children.
 *
 * Inside `<AppShell>` on a narrow screen the sidebar is a drawer: always expanded (a drawer of icons would hide
 * the labels and save no room), and the collapse toggle becomes the button that closes the drawer.
 */
export function Sidebar({
  collapsed,
  onToggleCollapse,
  logo,
  footer,
  children,
  collapseTitle = "Zúžiť",
  expandTitle = "Rozšíriť",
  closeMenuTitle = "Zavrieť ponuku",
}: SidebarProps) {
  const { narrow, closeMenu } = useShell();
  const rail = collapsed && !narrow;
  return (
    <CollapseContext.Provider value={rail}>
      <aside
        className="flex-shrink-0 bg-[var(--color-surface)] border-r border-[var(--color-border-default)] flex flex-col select-none transition-all duration-200 overflow-x-hidden"
        style={{ width: rail ? "3.5rem" : "14rem" }}
      >
        {/* Logo + toggle */}
        <div className="px-3 py-3 border-b border-[var(--color-border-default)] flex items-center gap-3 min-h-[56px]">
          {!rail && logo}
          {narrow ? (
            <button
              type="button"
              onClick={closeMenu}
              className="ml-auto flex items-center justify-center rounded text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors shrink-0 w-8 h-8"
              title={closeMenuTitle}
              aria-label={closeMenuTitle}
            >
              <IconClose />
            </button>
          ) : (
            <button
              type="button"
              onClick={onToggleCollapse}
              className={`flex items-center justify-center rounded text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors shrink-0 ${rail ? "w-8 h-8" : "w-6 h-6"}`}
              title={rail ? expandTitle : collapseTitle}
            >
              <IconSidebarToggle />
            </button>
          )}
        </div>

        {/* Navigation body */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto overflow-x-hidden">{children}</nav>

        {/* Footer */}
        {footer != null && <div className="p-3 border-t border-[var(--color-border-default)]">{footer}</div>}
      </aside>
    </CollapseContext.Provider>
  );
}
