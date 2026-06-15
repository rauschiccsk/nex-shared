/**
 * SessionsPanel — user-session table (user, id, token_version, last_seen_at,
 * created_at) + revoke, with an optional user filter (CR-NS-078). A session is a
 * per-user JWT lifecycle anchor; revoking invalidates its outstanding tokens.
 *
 * The app owns data + IO: it supplies `sessions`, resolves user ids to names via
 * `resolveUsername`, gates revoke via `canRevoke`, and persists through
 * `onRevoke(id)`. `filterUserId`/`onFilterChange` are app-controlled; the panel
 * also filters the supplied rows by `filterUserId` so it works either way.
 */

import { useMemo, useState } from "react";
import type { UserSessionRead } from "./settings-types";

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
}

function fmt(ts: string | null | undefined): string {
  if (!ts) return "—";
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("sk-SK");
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
}: SessionsPanelProps) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [revoking, setRevoking] = useState(false);
  const [revokeError, setRevokeError] = useState("");

  const nameOf = (uid: string) => resolveUsername?.(uid) ?? uid;

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
          ? `Nepodarilo sa zrušiť reláciu: ${e.message}`
          : "Nepodarilo sa zrušiť reláciu.";
      setRevokeError(msg);
      setConfirmingId(null);
    } finally {
      setRevoking(false);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-1">Relácie používateľa</h2>
      <p className="text-xs text-[var(--color-text-muted)] mb-4">
        Kotvy životného cyklu JWT. Zrušenie relácie zneplatní všetky jej zostávajúce tokeny.
      </p>

      {filterUserId && onFilterChange && (
        <div className="mb-3 flex items-center gap-2 text-xs">
          <span className="text-[var(--color-text-muted)]">
            Filtrované podľa používateľa:{" "}
            <span className="text-[var(--color-text-secondary)] font-medium">{nameOf(filterUserId)}</span>
          </span>
          <button
            type="button"
            onClick={() => onFilterChange("")}
            className="px-2 py-0.5 text-[var(--color-text-secondary)] border border-[var(--color-border-default)] rounded hover:bg-[var(--color-surface-hover)]"
          >
            Zrušiť filter
          </button>
        </div>
      )}

      {loadError && (
        <div className="rounded-lg border border-[var(--color-state-error-bg)] bg-[var(--color-state-error-bg)] px-3 py-2 text-xs text-[var(--color-state-error-fg)] mb-4">
          {loadError}
        </div>
      )}
      {loading && !loadError && (
        <div className="text-xs text-[var(--color-text-muted)]">Načítavam…</div>
      )}

      {!loading && !loadError && (
        <div className="rounded-xl border border-[var(--color-border-default)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-hover)]">
              <tr className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
                <th className="px-4 py-2.5 text-left font-semibold">Používateľ</th>
                <th className="px-4 py-2.5 text-left font-semibold">ID relácie</th>
                <th className="px-4 py-2.5 text-right font-semibold">tv</th>
                <th className="px-4 py-2.5 text-left font-semibold">Naposledy videný</th>
                <th className="px-4 py-2.5 text-left font-semibold">Vytvorené</th>
                <th className="px-4 py-2.5 text-right font-semibold">Akcie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-default)]">
              {rows.map((s) => (
                <tr key={s.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-[var(--color-text-primary)]">{nameOf(s.user_id)}</td>
                  <td className="px-4 py-3 font-mono text-[10px] text-[var(--color-text-muted)]">{s.id}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-[var(--color-text-secondary)]">{s.token_version}</td>
                  <td className="px-4 py-3 text-xs text-[var(--color-text-muted)]">{fmt(s.last_seen_at)}</td>
                  <td className="px-4 py-3 text-xs text-[var(--color-text-muted)]">{fmt(s.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    {!canRevoke ? (
                      <span className="text-xs text-[var(--color-text-muted)]">—</span>
                    ) : confirmingId === s.id ? (
                      <div className="flex items-center justify-end gap-2 text-xs">
                        <span className="text-[var(--color-text-secondary)]">Zrušiť reláciu?</span>
                        <button
                          type="button"
                          onClick={() => handleRevoke(s.id)}
                          disabled={revoking}
                          className="px-2 py-0.5 text-[var(--color-status-error)] border border-[var(--color-state-error-bg)] rounded hover:bg-[var(--color-state-error-bg)] disabled:opacity-40"
                        >
                          Áno
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingId(null)}
                          disabled={revoking}
                          className="px-2 py-0.5 text-[var(--color-text-secondary)] border border-[var(--color-border-default)] rounded hover:bg-[var(--color-surface-hover)]"
                        >
                          Nie
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setConfirmingId(s.id); setRevokeError(""); }}
                        className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-status-error)] transition-colors"
                      >
                        Zrušiť
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-xs text-[var(--color-text-muted)]">Žiadne relácie</td>
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
