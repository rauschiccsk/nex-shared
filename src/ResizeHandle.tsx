import { useRef, type KeyboardEvent, type PointerEvent } from "react";

export interface ResizeHandleProps {
  /** The panel's width in px as it is now. */
  value: number;
  min: number;
  max: number;
  /** The width a double click returns to. */
  defaultValue: number;
  /** Which side of the handle the panel lies on — dragging away from the panel widens it. */
  panel: "left" | "right";
  /** Called while the width changes (drag, key) — the app shows it at once. */
  onResize: (width: number) => void;
  /** Called once when a change is finished (drag released, key pressed, double click) — the app keeps it. A drag
      that ends where it began still ends: the app learns that the dragging is over. */
  onResizeEnd: (width: number) => void;
  /** The accessible name, e.g. „Šírka bočného panela“. */
  label: string;
  /** Extra classes — the app positions the handle (e.g. `absolute inset-y-0 -right-1`). */
  className?: string;
}

/** How far one arrow key moves the edge. */
const KEY_STEP = 16;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(value)));

/**
 * A draggable edge between a panel and the content (v0.21.0). Drag it with a mouse or a finger, move it with the arrow
 * keys (Home / End = narrowest / widest) or double-click it to return to the default width. It never leaves the
 * bounds. A `separator` with `aria-valuenow`, so a screen reader says the width. Store-agnostic: the app keeps the
 * width wherever it wants (`onResizeEnd`).
 */
export function ResizeHandle({
  value,
  min,
  max,
  defaultValue,
  panel,
  onResize,
  onResizeEnd,
  label,
  className = "",
}: ResizeHandleProps) {
  const drag = useRef<{ startX: number; startWidth: number; width: number; moved: boolean } | null>(null);
  const direction = panel === "left" ? 1 : -1;

  const finish = (width: number) => {
    onResize(width);
    onResizeEnd(width);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { startX: event.clientX, startWidth: value, width: value, moved: false };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    d.width = clamp(d.startWidth + (event.clientX - d.startX) * direction, min, max);
    d.moved = true;
    onResize(d.width);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (d.moved) onResizeEnd(d.width);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: value + KEY_STEP * direction,
      ArrowLeft: value - KEY_STEP * direction,
      Home: min,
      End: max,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const width = clamp(keys[event.key]!, min, max);
    if (width !== value) finish(width);
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      title={`${label} — potiahni, šípkami, dvojklik vráti predvolenú`}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      onDoubleClick={() => value !== defaultValue && finish(clamp(defaultValue, min, max))}
      className={`z-20 w-1.5 cursor-col-resize touch-none select-none transition-colors hover:bg-[var(--color-accent-primary)]/40 focus-visible:bg-[var(--color-accent-primary)]/60 focus-visible:outline-none ${className}`.trim()}
    />
  );
}
