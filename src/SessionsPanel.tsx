/**
 * SessionsPanel — user-session table (user, id, token_version, last_seen_at,
 * created_at) + revoke, with an optional user filter (CR-NS-078). A session is a
 * per-user session; what revoking does depends on the app, so the app says it in `description`.
 *
 * The app owns data + IO: it supplies `sessions`, resolves user ids to names via
 * `resolveUsername`, gates revoke via `canRevoke`, and persists through
 * `onRevoke(id)`. `filterUserId`/`onFilterChange` are app-controlled; the panel
 * also filters the supplied rows by `filterUserId` so it works either way.
 */

import { useMemo, useState } from "react";
import type { UserSessionRead } from "./settings-types";
import { formatDateTime, useLanguage, useT } from "./i18n";

export interface SessionsPanelProps {
  sessions: UserSessionRead[];
  /** Resolve a user id to a display name (falls back to the id). */
  resolveUsername?: (userId: string) => string;
  /** Whether the current user may revoke sessions. */
  canRevoke: boolean;
  /** Revoke (delete) a session. Reject with an Error to surface the message. */
  onRevoke: (id: string) => Promise<void>;
  /** Initial load in flight. */
  loading?: boolean;
  /** Load error message (empty/undefined = none). */
  loadError?: string;
  /** App-controlled user filter; the panel also filters rows by it. */
  filterUserId?: string;
  /** Clear/change the user filter. */
  onFilterChange?: (userId: string) => void;
  /** v0.28.0 (DEV-252) — the sentence under the heading; the app says what ending a session does there. */
  description?: string;
}

function fmt(ts: string | null | undefined, locale: string): string {
  return ts ? formatDateTime(ts, locale) : "—";
}

export function SessionsPanel({
  sessions,
  resolveUsername,
  canRevoke,
  onRevoke,
  loading = false,
  loadError = "",
  filterUserId,
  onFilterChange,
  description,
}: SessionsPanelProps) {
  const t = useT();
  const { locale } = useLanguage();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [revoking, setRevoking] = useState(false);
  const [revokeError, setRevokeError] = useState("");

  const nameOf = (uid: string) => resolveUsername?.(uid) ?? uid;

  // DEV-252: the token version is the cockpit's — a column only when the sessions carry one.
  const showTv = sessions.some((s) => s.token_version != null);
  const rows = useMemo(
    () => (filterUserId ? sessions.filter((s) => s.user_id === filterUserId) : sessions),
    [sessions, filterUserId],
  );

  async function handleRevoke(id: string) {
    setRevoking(true);
    setRevokeError("");
    try {
      await onRevoke(id);
      setConfirmingId(null);
    } catch (e) {
      const msg =
        e instanceof Error && e.message
          ? t("sessions.revokeFailedBecause", { reason: e.message })
          : t("sessions.revokeFailed");
      setRevokeError(msg);
      setConfirmingId(null);
    } finally {
      setRevoking(false);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-1">{t("sessions.title")}</h2>
      <p className="text-xs text-[var(--color-text-muted)] mb-4">{description ?? t("sessions.description")}</p>

      {filterUserId && onFilterChange && (
        <div className="mb-3 flex items-center gap-2 text-xs">
          <span className="text-[var(--color-text-muted)]">
            {t("sessions.filteredBy")}{" "}
            <span className="text-[var(--color-text-secondary)] font-medium">{nameOf(filterUserId)}</span>
          </span>
          <button
            type="button"
            onClick={() => onFilterChange("")}
            className="px-2 py-0.5 text-[var(--color-text-secondary)] border border-[var(--color-border-default)] rounded hover:bg-[var(--color-surface-hover)]"
          >
            {t("sessions.clearFilter")}
          </button>
        </div>
      )}

      {loadError && (
        <div className="rounded-lg border border-[var(--color-state-error-bg)] bg-[var(--color-state-error-bg)] px-3 py-2 text-xs text-[var(--color-state-error-fg)] mb-4">
          {loadError}
        </div>
      )}
      {loading && !loadError && (
        <div className="text-xs text-[var(--color-text-muted)]">{t("common.loading")}</div>
      )}

      {!loading && !loadError && (
        <div className="rounded-xl border border-[var(--color-border-default)] overflow-x-auto" data-scroll-x>
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-hover)]">
              <tr className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
                <th className="px-4 py-2.5 text-left font-semibold">{t("sessions.col.user")}</th>
                <th className="px-4 py-2.5 text-left font-semibold">{t("sessions.col.id")}</th>
                {showTv && <th className="px-4 py-2.5 text-right font-semibold">{t("sessions.col.tokenVersion")}</th>}
                <th className="px-4 py-2.5 text-left font-semibold">{t("sessions.col.lastSeen")}</th>
                <th className="px-4 py-2.5 text-left font-semibold">{t("sessions.col.created")}</th>
                <th className="px-4 py-2.5 text-right font-semibold">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-default)]">
              {rows.map((s) => (
                <tr key={s.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-[var(--color-text-primary)]">{nameOf(s.user_id)}</td>
                  <td className="px-4 py-3 font-mono text-[10px] text-[var(--color-text-muted)]">{s.id}</td>
                  {showTv && (
                    <td className="px-4 py-3 text-right font-mono text-xs text-[var(--color-text-secondary)]">{s.token_version}</td>
                  )}
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-[var(--color-text-muted)]">{fmt(s.last_seen_at, locale)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-[var(--color-text-muted)]">{fmt(s.created_at, locale)}</td>
                  <td className="px-4 py-3 text-right">
                    {!canRevoke ? (
                      <span className="text-xs text-[var(--color-text-muted)]">—</span>
                    ) : confirmingId === s.id ? (
                      <div className="flex items-center justify-end gap-2 text-xs">
                        <span className="text-[var(--color-text-secondary)]">{t("sessions.confirmRevoke")}</span>
                        <button
                          type="button"
                          onClick={() => handleRevoke(s.id)}
                          disabled={revoking}
                          className="px-2 py-0.5 text-[var(--color-status-error)] border border-[var(--color-state-error-bg)] rounded hover:bg-[var(--color-state-error-bg)] disabled:opacity-40"
                        >
                          {t("common.yes")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingId(null)}
                          disabled={revoking}
                          className="px-2 py-0.5 text-[var(--color-text-secondary)] border border-[var(--color-border-default)] rounded hover:bg-[var(--color-surface-hover)]"
                        >
                          {t("common.no")}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setConfirmingId(s.id); setRevokeError(""); }}
                        className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-status-error)] transition-colors"
                      >
                        {t("sessions.revoke")}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-xs text-[var(--color-text-muted)]">{t("sessions.none")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {revokeError && (
        <div className="mt-3 text-xs text-[var(--color-state-error-fg)] rounded bg-[var(--color-state-error-bg)] border border-[var(--color-state-error-bg)] px-3 py-2 flex items-center justify-between">
          <span>{revokeError}</span>
          <button type="button" onClick={() => setRevokeError("")} className="text-[var(--color-state-error-fg)] hover:opacity-80 ml-2">×</button>
        </div>
      )}
    </div>
  );
}
