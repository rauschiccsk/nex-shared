import type { ReactNode } from "react";

export interface AppShellProps {
  /** The (composed) sidebar rail rendered on the left. */
  sidebar: ReactNode;
  /** Top header bar of the main column (e.g. a `<Header>`). Optional. */
  header?: ReactNode;
  /** Optional banner pinned above the header (announcements, env badges). */
  topBanner?: ReactNode;
  /** Page content rendered in the scrollable main region. */
  children?: ReactNode;
}

/**
 * The outer application frame: a full-height flex row with the sidebar on the
 * left and a flex-column main area (optional top banner + header, then the
 * scrollable content) on the right.
 *
 * The main region is `relative` on purpose so consumers can absolutely-position
 * overlays inside it (NEX Studio renders its PersistentTerminalsLayer there).
 */
export function AppShell({ sidebar, header, topBanner, children }: AppShellProps) {
  return (
    <div className="flex h-full w-full bg-[var(--color-canvas)]">
      {sidebar}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {topBanner}
        {header}
        <main className="relative flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
