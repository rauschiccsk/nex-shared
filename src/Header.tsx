import type { ReactNode } from "react";

export interface HeaderProps {
  /** Left-aligned slot content. */
  left?: ReactNode;
  /** Right-aligned slot content (pushed to the far end). */
  right?: ReactNode;
  /** Full custom content — overrides the left/right slots when provided. */
  children?: ReactNode;
  /** Extra classes appended to the header chrome. */
  className?: string;
}

/**
 * The top header bar chrome: a fixed-height dark row. Provide either `children`
 * (full control) or the `left` / `right` slots. Store- and router-agnostic — the
 * consuming app supplies its own breadcrumb / status content.
 */
export function Header({ left, right, children, className = "" }: HeaderProps) {
  return (
    <header
      className={`h-10 flex-shrink-0 bg-[var(--color-surface)] border-b border-[var(--color-border-default)] flex items-center px-3 gap-3 z-10 select-none ${className}`.trim()}
    >
      {children ?? (
        <>
          {left}
          {right != null && <div className="ml-auto flex items-center gap-3">{right}</div>}
        </>
      )}
    </header>
  );
}
