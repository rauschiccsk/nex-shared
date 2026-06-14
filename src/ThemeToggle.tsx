export interface ThemeToggleProps {
  /** Current theme. State is OWNED BY THE APP (Studio ThemeContext / Inbox uiStore). */
  theme: "light" | "dark";
  /** Toggle handler. */
  onToggle: () => void;
  /** aria-label (full action description) when currently dark (click → light). */
  toLightLabel?: string;
  /** aria-label (full action description) when currently light (click → dark). */
  toDarkLabel?: string;
  /** Short hover tooltip (target theme name) when currently dark. */
  toLightTitle?: string;
  /** Short hover tooltip (target theme name) when currently light. */
  toDarkTitle?: string;
}

// Inline SVGs (zero icon-lib dependency — matches the shell's control glyphs;
// stroke=currentColor so the token text color drives them).
const SunIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

/**
 * The top-bar theme toggle (Sun ↔ Moon) — promoted from the NEX Inbox vzor
 * (E1 unification, CR-NS-066; Inbox's top-right placement is the vzor for this
 * element). Presentational + theme-state-agnostic: the app passes its current
 * `theme` and an `onToggle`. Render it in the shared <Header> `right` slot.
 */
export function ThemeToggle({
  theme,
  onToggle,
  toLightLabel = "Prepnúť na svetlú tému",
  toDarkLabel = "Prepnúť na tmavú tému",
  toLightTitle = "Svetlá téma",
  toDarkTitle = "Tmavá téma",
}: ThemeToggleProps) {
  const isDark = theme === "dark";
  const label = isDark ? toLightLabel : toDarkLabel;
  const title = isDark ? toLightTitle : toDarkTitle;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={title}
      className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] transition-colors"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
