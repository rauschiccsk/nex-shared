import { useState, type ReactNode } from "react";
import { CollapseContext } from "./CollapseContext";
import { DensityContext } from "./DensityContext";
import { ResizeHandle } from "./ResizeHandle";
import { useShell } from "./ShellContext";

/** The expanded width when the app sets none — the sidebar's width before v0.21.0 (14rem). */
export const SIDEBAR_DEFAULT_WIDTH = 224;

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
  /** v0.21.0 — 28 px rows, a lower brand block and footer (see `DensityContext`). Off by default. */
  dense?: boolean;
  /** v0.21.0 — the expanded width in px; omitted = {@link SIDEBAR_DEFAULT_WIDTH}. */
  width?: number;
  /** v0.21.0 — with it the right edge becomes a handle that changes the width on a wide screen (not in the drawer,
      not collapsed); called once per finished change, so the app keeps the width where it wants. */
  onWidthChange?: (width: number) => void;
  minWidth?: number;
  maxWidth?: number;
  /** What a double click on the handle returns to. */
  defaultWidth?: number;
  /** The handle's accessible name. NEX-Slovak default. */
  resizeLabel?: string;
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
  dense = false,
  width,
  onWidthChange,
  minWidth = 180,
  maxWidth = 360,
  defaultWidth = SIDEBAR_DEFAULT_WIDTH,
  resizeLabel = "Šírka bočného panela",
}: SidebarProps) {
  const { narrow, closeMenu } = useShell();
  const rail = collapsed && !narrow;
  // While the edge is dragged the width follows the pointer here; the app hears it once, at the end.
  const [dragged, setDragged] = useState<number | null>(null);
  const expanded = dragged ?? width ?? defaultWidth;
  const resizable = onWidthChange != null && !narrow && !rail;
  // An app that sets no width keeps the width it always had, in rem (it follows the app's root font size).
  const shown = rail ? "3.5rem" : dragged != null || width != null ? `${expanded}px` : "14rem";
  return (
    <CollapseContext.Provider value={rail}>
      <DensityContext.Provider value={dense}>
        <aside
          className={`relative flex-shrink-0 bg-[var(--color-surface)] border-r border-[var(--color-border-default)] flex flex-col select-none overflow-x-hidden ${
            dragged == null ? "transition-all duration-200" : ""
          }`}
          style={{ width: shown }}
        >
          {/* Logo + toggle */}
          <div
            className={`border-b border-[var(--color-border-default)] flex items-center ${
              dense ? "px-3 py-2 gap-2 min-h-[48px]" : "px-3 py-3 gap-3 min-h-[56px]"
            }`}
          >
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
          {footer != null && (
            <div className={`border-t border-[var(--color-border-default)] ${dense ? "px-2 py-1.5" : "p-3"}`}>{footer}</div>
          )}

          {resizable && (
            <ResizeHandle
              value={expanded}
              min={minWidth}
              max={maxWidth}
              defaultValue={defaultWidth}
              panel="left"
              onResize={setDragged}
              onResizeEnd={(w) => {
                setDragged(null);
                if (w !== (width ?? defaultWidth)) onWidthChange(w);
              }}
              label={resizeLabel}
              className="absolute inset-y-0 right-0"
            />
          )}
        </aside>
      </DensityContext.Provider>
    </CollapseContext.Provider>
  );
}
