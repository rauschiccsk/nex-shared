import { useCallback, useEffect, useState } from "react";

// DEV-243 — the width a user gives the sidebar is remembered for that user, in this app's own browser storage.
// Director 27.10.2026: „možnosť šírku nastavovať a následne zapamätať, pre každého užívateľa osobitne“. NEX Studio keeps
// it on its server; an app built by NEX Studio would need a server part of its own in every project for that, so the
// kit keeps it in the browser — one entry per user; on another computer the sidebar starts at its default width.

/** Where a remembered width is kept: this prefix + whatever names the signed-in user (an id, an e-mail). */
export const SIDEBAR_WIDTH_KEY_PREFIX = "nex-shared:sidebar-width:";

// Read inside the callers' try: blocked storage (a private window, a policy) throws already on access — nothing is
// remembered then, and nothing breaks.
function storage(): Storage | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

/** The width remembered for `user`, kept within `min`–`max`; `undefined` when none (or it cannot be read). */
export function readRememberedWidth(user: string | null | undefined, min: number, max: number): number | undefined {
  if (!user) return undefined;
  try {
    const raw = storage()?.getItem(SIDEBAR_WIDTH_KEY_PREFIX + user);
    if (raw == null) return undefined;
    const width = Number(raw);
    return Number.isFinite(width) ? Math.min(max, Math.max(min, Math.round(width))) : undefined;
  } catch {
    return undefined;
  }
}

/** Remember `width` for `user`; the default width is not kept — the entry goes, so a new default applies later. */
export function rememberWidth(user: string | null | undefined, width: number, defaultWidth: number): void {
  if (!user) return;
  try {
    const store = storage();
    if (width === defaultWidth) store?.removeItem(SIDEBAR_WIDTH_KEY_PREFIX + user);
    else store?.setItem(SIDEBAR_WIDTH_KEY_PREFIX + user, String(width));
  } catch {
    // full or blocked storage — the width still holds until the page is left
  }
}

/**
 * The sidebar width of the signed-in `user`, and the handler that changes and remembers it. Without a user nothing is
 * remembered and `onWidthChange` is `undefined` (the sidebar then keeps its fixed width). When another user signs in,
 * their own width is read.
 */
export function useRememberedSidebarWidth(
  user: string | null | undefined,
  { min, max, defaultWidth }: { min: number; max: number; defaultWidth: number },
): { width: number | undefined; onWidthChange: ((width: number) => void) | undefined } {
  const [width, setWidth] = useState<number | undefined>(() => readRememberedWidth(user, min, max));
  useEffect(() => {
    setWidth(readRememberedWidth(user, min, max));
  }, [user, min, max]);
  const onWidthChange = useCallback(
    (next: number) => {
      rememberWidth(user, next, defaultWidth);
      setWidth(next === defaultWidth ? undefined : next);
    },
    [user, defaultWidth],
  );
  return { width, onWidthChange: user ? onWidthChange : undefined };
}
