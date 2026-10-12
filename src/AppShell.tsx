import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ShellContext, useWideScreen } from "./ShellContext";

export interface AppShellProps {
  /** The (composed) sidebar rail rendered on the left. */
  sidebar: ReactNode;
  /** Top header bar of the main column (e.g. a `<Header>`). Optional. */
  header?: ReactNode;
  /** Optional banner pinned above the header (announcements, env badges). */
  topBanner?: ReactNode;
  /** Page content rendered in the scrollable main region. */
  children?: ReactNode;
  /** Accessible name of the menu button that opens the sidebar on a narrow screen. NEX-Slovak default. */
  menuLabel?: string;
}

const IconMenu = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * The outer application frame: a full-height flex row with the sidebar on the left and a flex-column main area
 * (optional top banner + header, then the scrollable content) on the right.
 *
 * On a narrow screen (below `WIDE_SCREEN_QUERY` — a phone, a tablet held upright) the content takes the whole
 * width: the sidebar hides behind a menu button at the start of the header and slides over the content when
 * opened. It closes on Escape, on a tap beside it and when a `<NavItem>` is chosen; while closed it is hidden and
 * inert, so neither a finger nor the keyboard lands on it. On a wide screen nothing changes.
 *
 * The main region is `relative` on purpose so consumers can absolutely-position overlays inside it (NEX Studio
 * renders its PersistentTerminalsLayer there).
 */
export function AppShell({
  sidebar,
  header,
  topBanner,
  children,
  menuLabel = "Ponuka",
}: AppShellProps) {
  const narrow = !useWideScreen();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Turning a tablet to landscape leaves no drawer to be open.
  useEffect(() => {
    if (!narrow) setMenuOpen(false);
  }, [narrow]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Focus moves into the opened drawer and back to the menu button when it closes.
  useEffect(() => {
    if (menuOpen) {
      drawer.current?.querySelector<HTMLElement>("button, a[href]")?.focus();
    } else if (wasOpen.current) {
      menuButton.current?.focus();
    }
    wasOpen.current = menuOpen;
  }, [menuOpen]);

  const shell = useMemo(() => ({ narrow, menuOpen: narrow && menuOpen, closeMenu }), [narrow, menuOpen, closeMenu]);

  return (
    <ShellContext.Provider value={shell}>
      <div className="flex h-full w-full bg-[var(--color-canvas)]">
        {narrow ? (
          <>
            {menuOpen && (
              // A tap beside the drawer closes it; the keyboard and screen readers use Escape or its close button.
              <div className="fixed inset-0 z-40 bg-black/50" aria-hidden="true" onClick={closeMenu} />
            )}
            <div
              ref={drawer}
              className={`fixed inset-y-0 left-0 z-50 flex max-w-[85vw] shadow-[var(--shadow-lg)] transition-[transform,visibility] duration-200 ${
                menuOpen ? "translate-x-0" : "invisible -translate-x-full"
              }`}
              inert={!menuOpen}
            >
              {sidebar}
            </div>
          </>
        ) : (
          sidebar
        )}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {topBanner}
          {narrow ? (
            <div className="flex flex-shrink-0 items-stretch">
              <button
                ref={menuButton}
                type="button"
                aria-label={menuLabel}
                aria-expanded={menuOpen}
                title={menuLabel}
                onClick={() => setMenuOpen(true)}
                className="flex w-11 flex-shrink-0 items-center justify-center border-b border-r border-[var(--color-border-default)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                <IconMenu />
              </button>
              <div className="min-w-0 flex-1">{header}</div>
            </div>
          ) : (
            header
          )}
          <main className="relative flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ShellContext.Provider>
  );
}
