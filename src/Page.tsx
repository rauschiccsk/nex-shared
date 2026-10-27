import type { HTMLAttributes, ReactNode } from "react";

// DEV-244 — the frame of a page: its title row and how wide it is. Each app capped every page itself
// (`mx-auto max-w-6xl`): NEX Knowledge 0.1.0 at 1920 px left about 270 px empty on each side of a table whose dates
// and states broke into two lines for want of room. Director 27.10.2026: „Poprosím efektívnejšie využiť priestor
// obrazovky … Toto chcem využiť“ — 1920 px being the smallest common screen. A page now uses the whole width unless
// it is a form or text to read, whose lines would be too long across a wide screen.

/** `full` — a list, a table, an overview: the whole width. `narrow` — a form or text to read. */
export type PageWidth = "full" | "narrow";

export interface PageProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** The page's heading. */
  title?: ReactNode;
  /** One line under the heading — what the page is for. */
  subtitle?: ReactNode;
  /** Buttons on the right of the title row. */
  actions?: ReactNode;
  /** Defaults to `full`. */
  width?: PageWidth;
  children?: ReactNode;
}

const WIDTH: Record<PageWidth, string> = {
  full: "w-full",
  narrow: "w-full max-w-3xl",
};

export function Page({ title, subtitle, actions, width = "full", className = "", children, ...rest }: PageProps) {
  return (
    <div className={`${WIDTH[width]} ${className}`.trim()} {...rest}>
      {(title != null || actions != null) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {title != null && <h1 className="text-xl font-bold text-[var(--color-text-primary)]">{title}</h1>}
            {subtitle != null && <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{subtitle}</p>}
          </div>
          {actions != null && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
