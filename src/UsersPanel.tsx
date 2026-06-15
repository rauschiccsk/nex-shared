/**
 * UsersPanel — users table + filters (role, active) + create/edit (via UserForm)
 * + toggle-active + delete, with self-action + FK-conflict guards surfaced from
 * the backend's error messages (CR-NS-078). Role-agnostic: roles come as
 * `roleOptions`, role coloring via the optional `roleClass` predicate — no role
 * literals. The canonical active field is `is_active`.
 *
 * The app owns the data + IO: it supplies `users` and the persistence callbacks.
 * The panel owns only the local UI flow (filters, which form is open, in-flight +
 * error state). Filtering is client-side over the supplied `users`.
 */

import { useMemo, useState } from "react";
import { UserForm, type UserFormData } from "./UserForm";
import type { UserFieldSchema, UserRead } from "./settings-types";

export interface UsersPanelProps {
  users: UserRead[];
  /** Role options for the filter + the create/edit form (no role literals here). */
  roleOptions: { value: string; label: string }[];
  /** Whether the current user may create/edit/delete/toggle (else read-only). */
  canManage: boolean;
  /** Field set + password rule for the embedded UserForm. */
  fieldSchema: UserFieldSchema;
  /** Create a user. Reject with an Error to surface the message inline. */
  onCreate: (data: UserFormData) => Promise<void>;
  /** Patch profile fields (password is handled via `onChangePassword`). */
  onUpdate: (id: string, data: UserFormData) => Promise<void>;
  /** Delete a user. Reject (e.g. 409 FK conflict) surfaces a "deaktivovať" hint. */
  onDelete: (id: string) => Promise<void>;
  /** Rotate a user's password (called after `onUpdate` when a new one was typed). */
  onChangePassword: (id: string, password: string) => Promise<void>;
  /** Flip `is_active`. */
  onToggleActive: (user: UserRead) => Promise<void>;
  /** Optional role→className for the role cell (app supplies the palette). */
  roleClass?: (role: string) => string;
}

export function UsersPanel({
  users,
  roleOptions,
  canManage,
  fieldSchema,
  onCreate,
  onUpdate,
  onDelete,
  onChangePassword,
  onToggleActive,
  roleClass,
}: UsersPanelProps) {
  const roleCls = roleClass ?? (() => "");

  // Filters (client-side over the supplied users).
  const [roleFilter, setRoleFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  // Which flow is open.
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRead | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  // In-flight + error state per flow.
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter && u.role !== roleFilter) return false;
      if (activeFilter === "active" && !u.is_active) return false;
      if (activeFilter === "inactive" && u.is_active) return false;
      return true;
    });
  }, [users, roleFilter, activeFilter]);

  const showNames = fieldSchema.names;
  const showUsername = fieldSchema.username;
  const colCount = 4 + (showNames ? 1 : 0) + (showUsername ? 1 : 0);

  async function handleCreate(data: UserFormData) {
    setCreating(true);
    setCreateError("");
    try {
      await onCreate(data);
      setShowNewForm(false);
    } catch (e) {
      const msg =
        e instanceof Error && e.message
          ? `Nepodarilo sa vytvoriť používateľa: ${e.message}`
          : "Nepodarilo sa vytvoriť používateľa.";
      setCreateError(msg);
    } finally {
      setCreating(false);
    }
  }

  async function handleSaveEdit(data: UserFormData) {
    if (!editingUser) return;
    setEditing(true);
    setEditError("");
    try {
      // PATCH profile first, then (optionally) rotate the password — so a failing
      // PATCH never leaves a rotated password against stale profile fields.
      await onUpdate(editingUser.id, data);
      if (data.password) {
        await onChangePassword(editingUser.id, data.password);
      }
      setEditingUser(null);
    } catch (e) {
      const msg =
        e instanceof Error && e.message
          ? `Nepodarilo sa uložiť zmeny: ${e.message}`
          : "Nepodarilo sa uložiť zmeny.";
      setEditError(msg);
    } finally {
      setEditing(false);
    }
  }

  async function handleConfirmDelete(id: string) {
    setDeleting(true);
    setDeleteError("");
    try {
      await onDelete(id);
      setConfirmingDeleteId(null);
    } catch (e) {
      // Common case: backend 409 when the user is FK-referenced. Surface the
      // message + the soft-disable hint.
      const msg =
        e instanceof Error && e.message
          ? `Nedá sa vymazať: ${e.message}. Skús miesto toho deaktivovať.`
          : "Nedá sa vymazať. Skús miesto toho deaktivovať.";
      setDeleteError(msg);
      setConfirmingDeleteId(null);
    } finally {
      setDeleting(false);
    }
  }

  function handleToggle(u: UserRead) {
    void onToggleActive(u).catch(() => {
      /* app owns the refresh; backend guard message (e.g. self-deactivate) is
         surfaced by the app if it chooses. */
    });
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Správa používateľov</h2>
        {canManage && (
          <button
            type="button"
            onClick={() => { setShowNewForm((v) => !v); setEditingUser(null); setConfirmingDeleteId(null); }}
            className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nový používateľ
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-3">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-[var(--color-surface)] border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary-500"
        >
          <option value="">Všetky role</option>
          {roleOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          className="bg-[var(--color-surface)] border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary-500"
        >
          <option value="">Akýkoľvek stav</option>
          <option value="active">Len aktívni</option>
          <option value="inactive">Len neaktívni</option>
        </select>
        <span className="ml-auto text-xs text-[var(--color-text-muted)]">
          {filteredUsers.length} používateľov
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[var(--color-border-default)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-hover)]">
            <tr className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
              {showNames && <th className="px-4 py-2.5 text-left font-semibold">Meno</th>}
              {showUsername && <th className="px-4 py-2.5 text-left font-semibold">Používateľské meno</th>}
              <th className="px-4 py-2.5 text-left font-semibold">Email</th>
              <th className="px-4 py-2.5 text-left font-semibold">Rola</th>
              <th className="px-4 py-2.5 text-left font-semibold">Stav</th>
              <th className="px-4 py-2.5 text-right font-semibold">Akcie</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-default)]">
            {filteredUsers.map((u) => {
              const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ");
              return (
                <tr key={u.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                  {showNames && (
                    <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                      {fullName || <span className="text-[var(--color-text-muted)]">—</span>}
                    </td>
                  )}
                  {showUsername && (
                    <td className="px-4 py-3 text-sm font-medium text-[var(--color-text-primary)] font-mono">{u.username}</td>
                  )}
                  <td className="px-4 py-3 text-xs text-[var(--color-text-secondary)]">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-mono font-medium ${roleCls(u.role)}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    {u.is_active ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-state-success-bg)] border border-[var(--color-state-success-bg)] text-[var(--color-state-success-fg)]">aktívny</span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-state-warning-bg)] border border-[var(--color-state-warning-bg)] text-[var(--color-state-warning-fg)]">neaktívny</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!canManage ? (
                      <span className="text-xs text-[var(--color-text-muted)]">—</span>
                    ) : confirmingDeleteId === u.id ? (
                      <div className="flex items-center justify-end gap-2 text-xs">
                        <span className="text-[var(--color-text-secondary)]">Naozaj vymazať?</span>
                        <button
                          type="button"
                          onClick={() => handleConfirmDelete(u.id)}
                          disabled={deleting}
                          className="px-2 py-0.5 text-[var(--color-status-error)] border border-[var(--color-state-error-bg)] rounded hover:bg-[var(--color-state-error-bg)] disabled:opacity-40"
                        >
                          Áno
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingDeleteId(null)}
                          disabled={deleting}
                          className="px-2 py-0.5 text-[var(--color-text-secondary)] border border-[var(--color-border-default)] rounded hover:bg-[var(--color-surface-hover)]"
                        >
                          Nie
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-3">
                        {/* Edit (pencil) */}
                        <button
                          type="button"
                          onClick={() => { setEditingUser(u); setEditError(""); setShowNewForm(false); setConfirmingDeleteId(null); }}
                          title="Upraviť"
                          className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {/* Delete (trash) */}
                        <button
                          type="button"
                          onClick={() => { setConfirmingDeleteId(u.id); setDeleteError(""); }}
                          title="Vymazať"
                          className="text-[var(--color-text-muted)] hover:text-[var(--color-status-error)] transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        {/* Toggle active */}
                        <button
                          type="button"
                          onClick={() => handleToggle(u)}
                          className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
                        >
                          {u.is_active ? "Deaktivovať" : "Aktivovať"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={colCount} className="px-4 py-6 text-center text-xs text-[var(--color-text-muted)]">Žiadni používatelia</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete error banner (e.g. 409 FK conflict). */}
      {deleteError && (
        <div className="mt-3 text-xs text-[var(--color-state-error-fg)] rounded bg-[var(--color-state-error-bg)] border border-[var(--color-state-error-bg)] px-3 py-2 flex items-center justify-between">
          <span>{deleteError}</span>
          <button type="button" onClick={() => setDeleteError("")} className="text-[var(--color-state-error-fg)] hover:opacity-80 ml-2">×</button>
        </div>
      )}

      {/* Edit form — same UserForm as create, mode-driven. */}
      {canManage && editingUser && (
        <UserForm
          key={`edit-${editingUser.id}`}
          mode="edit"
          initial={editingUser}
          roleOptions={roleOptions}
          fieldSchema={fieldSchema}
          submitting={editing}
          error={editError}
          onSubmit={handleSaveEdit}
          onCancel={() => { setEditingUser(null); setEditError(""); }}
        />
      )}

      {/* New user form */}
      {canManage && showNewForm && (
        <UserForm
          mode="create"
          roleOptions={roleOptions}
          fieldSchema={fieldSchema}
          submitting={creating}
          error={createError}
          onSubmit={handleCreate}
          onCancel={() => { setShowNewForm(false); setCreateError(""); }}
        />
      )}
    </div>
  );
}
