import type { ReactNode } from "react";
import { useCollapsed } from "./CollapseContext";
import { useDense } from "./DensityContext";

export interface UserCardProps {
  /** Avatar initials (e.g. first letter of the username, uppercased). */
  initials: string;
  /** Primary line — the logged-in user / session label. */
  name: string;
  /** Optional secondary line (e.g. "Director · Ri"). */
  subtitle?: string;
  /** Optional logout handler. When omitted the logout button is NOT rendered
      (e.g. NEX Inbox's re-launch model has no logout — CR-002). */
  onLogout?: () => void;
  /** Tooltip for the logout button. NEX-Slovak default. */
  logoutTitle?: string;
  /** v0.21.0 — the app's own small controls beside the logout button (e.g. a presence toggle), so the footer
      stays one line. Shown also when the sidebar is collapsed. */
  actions?: ReactNode;
}

/**
 * The sidebar-footer user card: a round avatar with initials, the user name, an
 * optional role subtitle, and an optional logout button. Promoted from the NEX
 * Studio vzor (E1 unification, CR-NS-066) — pass `footer={<UserCard .../>}`.
 * Collapse-aware (avatar-only when the rail is collapsed) and theme-aware.
 */
export function UserCard({
  initials,
  name,
  subtitle,
  onLogout,
  logoutTitle = "Odhlásiť sa",
  actions,
}: UserCardProps) {
  const collapsed = useCollapsed();
  // v0.21.0: in a dense sidebar the subtitle stays on one line too (the whole text on hover).
  const dense = useDense();
  return (
    <div className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg ${collapsed ? "flex-col justify-center" : ""}`}>
      <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
        {initials}
      </div>
      {collapsed && actions}
      {!collapsed && (
        <>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-[var(--color-text-primary)] truncate">{name}</div>
            {subtitle != null && subtitle !== "" && (
              <div
                className={`text-[10px] text-[var(--color-text-muted)] ${dense ? "truncate" : ""}`}
                title={dense ? subtitle : undefined}
              >
                {subtitle}
              </div>
            )}
          </div>
          {actions}
          {onLogout != null && (
            <button
              type="button"
              onClick={onLogout}
              title={logoutTitle}
              className="shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          )}
        </>
      )}
    </div>
  );
}
