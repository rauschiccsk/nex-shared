/**
 * A window NEX Manager launched opens where the user left it last time (DEV-142).
 *
 * NEX Manager opens every app in a window of its own, always 1400×900, and cannot see the window afterwards: it lives
 * on the app's address and NEX Manager deliberately drops the link to it (`opener = null`). On 19.10.2026 the Director
 * maximised NEX Inbox and found it small again on every launch. So the app remembers its own window — position and
 * size, in its own browser storage — and puts the window back there when it starts.
 *
 * Only in a window NEX Manager opened: its name starts with `nexlaunch_` (NEX Manager names it so it can bring it to
 * the front). A tab, or a window opened from NEX Genesis, is never moved. "Maximised" itself cannot be set by a web
 * page; a window left maximised comes back filling the whole available screen.
 */

/** The name NEX Manager gives the windows it launches: `nexlaunch_<slug>`. */
export const LAUNCH_WINDOW_PREFIX = "nexlaunch_";
/** Where the app keeps its window — one entry per app, since browser storage is per address. */
export const LAUNCH_WINDOW_STORAGE_KEY = "nex-shared:launch-window";
/** How long the window must stay still before its new size is written down. */
export const LAUNCH_WINDOW_SAVE_DELAY_MS = 500;

export interface WindowPlacement {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** What of the browser window this needs — a plain object in tests. */
export interface LaunchWindow {
  name: string;
  screenX: number;
  screenY: number;
  outerWidth: number;
  outerHeight: number;
  screen: { availWidth: number; availHeight: number; availLeft?: number; availTop?: number };
  moveTo(x: number, y: number): void;
  resizeTo(width: number, height: number): void;
  addEventListener(type: "resize" | "pagehide", listener: () => void): void;
  removeEventListener(type: "resize" | "pagehide", listener: () => void): void;
  setTimeout(handler: () => void, timeout: number): number;
  clearTimeout(id: number | undefined): void;
}

/** What of the browser storage this needs. */
export interface PlacementStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/**
 * Put a window NEX Manager launched where it was left, and from now on remember where it is left.
 * Returns the function that stops remembering. Never throws: a browser that refuses to move the window, or storage
 * that cannot be read (a private window), only means the window stays as NEX Manager opened it.
 */
export function rememberLaunchWindow(
  win: LaunchWindow = window as unknown as LaunchWindow,
  storage: PlacementStorage | null = browserStorage(),
): () => void {
  if (!win.name.startsWith(LAUNCH_WINDOW_PREFIX) || storage === null) return () => {};

  const stored = readPlacement(storage);
  if (stored) {
    const placement = fitToScreen(stored, win.screen);
    try {
      win.moveTo(placement.left, placement.top);
      win.resizeTo(placement.width, placement.height);
    } catch {
      // The browser said no — the window stays where NEX Manager opened it.
    }
  }

  let pending: number | undefined;
  const save = () => {
    win.clearTimeout(pending);
    pending = undefined;
    try {
      storage.setItem(
        LAUNCH_WINDOW_STORAGE_KEY,
        JSON.stringify({ left: win.screenX, top: win.screenY, width: win.outerWidth, height: win.outerHeight }),
      );
    } catch {
      // Storage full or forbidden — next time the window opens as NEX Manager opens it.
    }
  };
  const saveLater = () => {
    win.clearTimeout(pending);
    pending = win.setTimeout(save, LAUNCH_WINDOW_SAVE_DELAY_MS);
  };
  // Browsers report no "moved" event: a move without a resize is written when the window is closed.
  win.addEventListener("resize", saveLater);
  win.addEventListener("pagehide", save);
  return () => {
    win.clearTimeout(pending);
    win.removeEventListener("resize", saveLater);
    win.removeEventListener("pagehide", save);
  };
}

/** A placement that fits on the screen the window is on now — a screen may be smaller than the one it was left on. */
export function fitToScreen(placement: WindowPlacement, screen: LaunchWindow["screen"]): WindowPlacement {
  const minLeft = screen.availLeft ?? 0;
  const minTop = screen.availTop ?? 0;
  const width = Math.min(placement.width, screen.availWidth);
  const height = Math.min(placement.height, screen.availHeight);
  return {
    width,
    height,
    left: Math.min(Math.max(placement.left, minLeft), minLeft + screen.availWidth - width),
    top: Math.min(Math.max(placement.top, minTop), minTop + screen.availHeight - height),
  };
}

function readPlacement(storage: PlacementStorage): WindowPlacement | null {
  try {
    const value = JSON.parse(storage.getItem(LAUNCH_WINDOW_STORAGE_KEY) ?? "null") as Partial<WindowPlacement> | null;
    if (!value) return null;
    const { left, top, width, height } = value;
    const numbers = [left, top, width, height].every((n) => typeof n === "number" && Number.isFinite(n));
    return numbers && (width as number) > 0 && (height as number) > 0
      ? { left: left as number, top: top as number, width: width as number, height: height as number }
      : null;
  } catch {
    return null;
  }
}

function browserStorage(): PlacementStorage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}
