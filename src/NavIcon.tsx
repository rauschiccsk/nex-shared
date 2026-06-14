export interface NavIconProps {
  /** A full-Unicode emoji glyph (e.g. "🏠"). The system color-emoji font renders
      it fully colored — no CSS needed (Director directive 2026-05-15). */
  glyph: string;
}

/**
 * A colored nav icon: wraps an emoji glyph in the canonical sizing box used by
 * the NEX Studio vzor (E1 unification, CR-NS-066). Pass to <NavItem icon=...>:
 * `<NavItem icon={<NavIcon glyph="🏠" />} ... />`. Decorative (aria-hidden) —
 * the NavItem `label` is the accessible name.
 */
export function NavIcon({ glyph }: NavIconProps) {
  return (
    <span
      aria-hidden="true"
      className="text-base leading-none shrink-0 w-4 inline-flex items-center justify-center"
    >
      {glyph}
    </span>
  );
}
