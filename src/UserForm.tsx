/**
 * UserForm — shared create/edit user form for the Settings → Users tab.
 * Lifted + parameterized from the NEX Studio vzor (CR-NS-078): the field set is
 * now driven by `fieldSchema` (apps differ — NEX Ledger has no username/names/
 * telegram) and the role `<select>` is driven by injected `roleOptions` instead
 * of hardcoded ri/ha/shu literals (role-agnostic kit).
 *
 * Mode-specific differences:
 *   - mode="create": username editable (when shown), password required, no Active
 *     checkbox (always defaults to is_active=true on create).
 *   - mode="edit":   username disabled (login stability), password optional
 *     (empty = keep current), Active checkbox shown.
 *
 * The component owns its internal form state. The parent receives the collected
 * `UserFormData` via `onSubmit` and decides which API calls to issue (the kit is
 * pure props-in — no app imports, no fetch).
 */

import { useState } from "react";
import { Input } from "./Input";
import { Select } from "./Select";
import { Card } from "./Card";
import type { UserRead, UserFieldSchema } from "./settings-types";

/** Collected form values handed to the parent on submit. */
export interface UserFormData {
  username: string;
  email: string;
  /** Create: required. Edit: empty string = keep current. */
  password: string;
  /** Opaque per-app role identifier (one of `roleOptions[].value`). */
  role: string;
  first_name: string;
  last_name: string;
  /** Telegram chat_id for agent notifications. */
  telegram_chat_id: string;
  is_active: boolean;
}

export interface UserFormProps {
  mode: "create" | "edit";
  /** Required in edit mode — values pre-fill the form. */
  initial?: UserRead;
  /** Role options for the role `<select>` (app-supplied; no role literals here). */
  roleOptions: { value: string; label: string }[];
  /** Which fields to render + the password min length (app-specific). */
  fieldSchema: UserFieldSchema;
  /** Disables all inputs + submit button. Driven by the parent's in-flight call. */
  submitting: boolean;
  /** Backend error message to display below the title. Empty = hidden. */
  error: string;
  /** Called with the collected form data on submit. The parent maps it to the
   *  right API calls (create vs patch + change-password). */
  onSubmit: (data: UserFormData) => Promise<void> | void;
  /** Optional cancel handler — when supplied a "Zrušiť" button is rendered. */
  onCancel?: () => void;
}

function initialFromUser(
  user: UserRead | undefined,
  roleOptions: { value: string; label: string }[],
): UserFormData {
  return {
    username: user?.username ?? "",
    email: user?.email ?? "",
    password: "",
    role: user?.role ?? roleOptions[0]?.value ?? "",
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    telegram_chat_id: user?.telegram_chat_id ?? "",
    is_active: user?.is_active ?? true,
  };
}

export function UserForm({
  mode,
  initial,
  roleOptions,
  fieldSchema,
  submitting,
  error,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const isEdit = mode === "edit";
  const minLen = fieldSchema.passwordMinLength;
  const [data, setData] = useState<UserFormData>(() =>
    initialFromUser(initial, roleOptions),
  );

  const passwordTooShort = data.password.length > 0 && data.password.length < minLen;

  // Submit is disabled when:
  //   - currently submitting (in-flight call)
  //   - email empty (always required)
  //   - create mode: username (when shown) or password empty (both required)
  //   - any mode: password filled but below min length
  const usernameRequired = !isEdit && fieldSchema.username;
  const submitDisabled =
    submitting ||
    !data.email ||
    (usernameRequired && !data.username) ||
    (!isEdit && !data.password) ||
    passwordTooShort;

  const submitLabel = isEdit
    ? submitting
      ? "Ukladám…"
      : "Uložiť"
    : submitting
      ? "Vytváram…"
      : "Vytvoriť";

  function update<K extends keyof UserFormData>(key: K, value: UserFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    if (submitDisabled) return;
    void onSubmit(data);
  }

  return (
    <Card className="mt-4 p-4">
      <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">
        {isEdit ? (
          <>
            Upraviť používateľa ·{" "}
            <span className="font-mono text-[var(--color-text-secondary)]">{initial?.username}</span>
          </>
        ) : (
          "Vytvoriť používateľa"
        )}
      </h3>

      {error && (
        <div className="mb-3 text-xs text-[var(--color-state-error-fg)] rounded bg-[var(--color-state-error-bg)] border border-[var(--color-state-error-bg)] px-3 py-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-3">
        {fieldSchema.names && (
          <>
            <div>
              <label htmlFor="uf-first-name" className="block text-xs text-[var(--color-text-muted)] mb-1">Meno</label>
              <Input
                id="uf-first-name"
                type="text"
                value={data.first_name}
                onChange={(e) => update("first_name", e.target.value)}
                placeholder="napr. Tibor"
              />
            </div>

            <div>
              <label htmlFor="uf-last-name" className="block text-xs text-[var(--color-text-muted)] mb-1">Priezvisko</label>
              <Input
                id="uf-last-name"
                type="text"
                value={data.last_name}
                onChange={(e) => update("last_name", e.target.value)}
                placeholder="napr. Rausch"
              />
            </div>
          </>
        )}

        {fieldSchema.username && (
          <div>
            <label htmlFor="uf-username" className="block text-xs text-[var(--color-text-muted)] mb-1">
              Používateľské meno {isEdit ? "" : "*"}
            </label>
            <input
              id="uf-username"
              type="text"
              value={data.username}
              onChange={(e) => update("username", e.target.value)}
              disabled={isEdit}
              title={isEdit ? "Používateľské meno sa po vytvorení nemení (zachováva login stabilitu)." : undefined}
              placeholder="napr. tibi"
              className={`w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary-500 ${
                isEdit
                  ? "bg-[var(--color-surface-hover)] border-[var(--color-border-default)] text-[var(--color-text-muted)] cursor-not-allowed"
                  : "bg-[var(--color-surface)] border-[var(--color-border-default)] text-[var(--color-text-primary)]"
              }`}
            />
          </div>
        )}

        <div>
          <label htmlFor="uf-email" className="block text-xs text-[var(--color-text-muted)] mb-1">Email *</label>
          <Input
            id="uf-email"
            type="email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="napr. tibi@isnex.ai"
          />
        </div>

        <div>
          <label htmlFor="uf-password" className="block text-xs text-[var(--color-text-muted)] mb-1">
            {isEdit ? (
              <>
                Nové heslo{" "}
                <span className="text-[var(--color-text-muted)]">(nechaj prázdne ak nemeniť)</span>
              </>
            ) : (
              "Heslo *"
            )}
          </label>
          <Input
            id="uf-password"
            type="password"
            value={data.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder={`min. ${minLen} znakov`}
            invalid={passwordTooShort}
          />
          {passwordTooShort && (
            <div className="mt-1 text-[10px] text-[var(--color-status-error)]">
              Heslo musí mať aspoň {minLen} znakov ({data.password.length}/{minLen}).
            </div>
          )}
        </div>

        <div>
          <label htmlFor="uf-role" className="block text-xs text-[var(--color-text-muted)] mb-1">Rola</label>
          <Select
            id="uf-role"
            value={data.role}
            onChange={(e) => update("role", e.target.value)}
          >
            {roleOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>

        {fieldSchema.telegram && (
          <div>
            <label htmlFor="uf-telegram" className="block text-xs text-[var(--color-text-muted)] mb-1">
              Telegram chat_id
            </label>
            <Input
              id="uf-telegram"
              type="text"
              value={data.telegram_chat_id}
              onChange={(e) => update("telegram_chat_id", e.target.value)}
              placeholder="napr. 123456789 (notifikácie agenta)"
            />
          </div>
        )}

        {isEdit && (
          <div className="flex items-end">
            <label htmlFor="uf-active" className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] cursor-pointer">
              <input
                id="uf-active"
                type="checkbox"
                checked={data.is_active}
                onChange={(e) => update("is_active", e.target.checked)}
                className="rounded bg-[var(--color-surface)] border-[var(--color-border-default)]"
              />
              Aktívny
            </label>
          </div>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs text-[var(--color-text-secondary)] border border-[var(--color-border-default)] rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            Zrušiť
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitDisabled}
          className="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-500 disabled:opacity-40 rounded-lg transition-colors"
        >
          {submitLabel}
        </button>
      </div>
    </Card>
  );
}
