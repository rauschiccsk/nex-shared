import { createContext, useContext, useEffect, useState } from "react";

/**
 * From this width up the sidebar stands beside the content (a computer, a tablet held landscape); below it the
 * sidebar hides behind the menu button in the header and slides over the content (a phone, a tablet held upright).
 */
export const WIDE_SCREEN_QUERY = "(min-width: 1024px)";

export interface ShellState {
  /** The screen is narrower than {@link WIDE_SCREEN_QUERY}: the sidebar is a drawer, always shown expanded. */
  narrow: boolean;
  /** The drawer is open (only ever `true` while `narrow`). */
  menuOpen: boolean;
  /** Close the drawer — a no-op on a wide screen. */
  closeMenu: () => void;
}

/** Provided by `<AppShell>`; outside of it the screen counts as wide and nothing is a drawer. */
export const ShellContext = createContext<ShellState>({ narrow: false, menuOpen: false, closeMenu: () => {} });

/**
 * Read the shell's layout state — e.g. an app's own sidebar content shows its labels whenever `narrow`, because
 * the drawer is never collapsed to icons.
 */
export const useShell = (): ShellState => useContext(ShellContext);

/**
 * Whether {@link WIDE_SCREEN_QUERY} matches, following the window as it is resized or turned. Where the browser
 * cannot answer (a test environment without `matchMedia`), the screen counts as wide — the layout it always had.
 */
export function useWideScreen(): boolean {
  const supported = typeof window !== "undefined" && typeof window.matchMedia === "function";
  const [wide, setWide] = useState(() => !supported || window.matchMedia(WIDE_SCREEN_QUERY).matches);
  useEffect(() => {
    if (!supported) return;
    const query = window.matchMedia(WIDE_SCREEN_QUERY);
    const update = () => setWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [supported]);
  return wide;
}
