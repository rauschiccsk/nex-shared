/**
 * SystemSettingsPanel — runtime-mutable system settings grouped into injected
 * categories, with per-row draft/save/flash/error state OWNED BY THE PANEL
 * (CR-NS-078). The value_type→input mapping (string|int|float|bool) lives here.
 *
 * The app owns data + IO: it loads `settings`, gates editing via `canEdit`, and
 * persists through `onSave(key, value)` which resolves with the updated row (the
 * app should also merge that row back into its `settings` list so the row's
 * "Uložené" baseline + override metadata stay current).
 */

import { useEffect, useMemo, useState } from "react";
import type { SettingsCategory, SystemSettingRead, SystemSettingValueType } from "./settings-types";

export interface SystemSettingsPanelProps {
  settings: SystemSettingRead[];
  /** Display categories; keys matching none fall into a trailing "Ostatné" bucket. */
  categories: SettingsCategory[];
  /** Whether the current user may edit (else the panel is read-only). */
  canEdit: boolean;
  /** Persist one setting. Resolves with the updated row; rejects with an Error
   *  whose message is surfaced inline. */
  onSave: (key: string, value: string) => Promise<SystemSettingRead>;
  /** Initial load in flight. */
  loading?: boolean;
  /** Load error message (empty/undefined = none). */
  loadError?: string;
}

function inputTypeFor(valueType: SystemSettingValueType): "number" | "checkbox" | "text" {
  if (valueType === "int" || valueType === "float") return "number";
  if (valueType === "bool") return "checkbox";
  return "text";
}

const OTHER_CATEGORY: SettingsCategory = {
  id: "other",
  label: "Ostatné",
  description: "",
  prefixes: [],
};

export function SystemSettingsPanel({
  settings,
  categories,
  canEdit,
  onSave,
  loading = false,
  loadError = "",
}: SystemSettingsPanelProps) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({});
  const [flashKey, setFlashKey] = useState<string | null>(null);

  // Seed a draft for every key we haven't seen yet — without clobbering an
  // in-progress edit on another row when `settings` updates after a save.
  useEffect(() => {
    setDrafts((prev) => {
      const next = { ...prev };
      for (const s of settings) if (!(s.key in next)) next[s.key] = s.value;
      return next;
    });
  }, [settings]);

  function classifyKey(key: string): string {
    for (const cat of categories) {
      if (cat.prefixes.some((p) => key.startsWith(p))) return cat.id;
    }
    return OTHER_CATEGORY.id;
  }

  const groupedSettings = useMemo(() => {
    const groups: Record<string, SystemSettingRead[]> = {};
    for (const s of settings) {
      const catId = classifyKey(s.key);
      (groups[catId] ||= []).push(s);
    }
    for (const list of Object.values(groups)) {
      list.sort((a, b) => a.key.localeCompare(b.key));
    }
    return groups;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, categories]);

  async function handleSaveSetting(key: string) {
    const draft = (drafts[key] ?? "").toString();
    // Block saving an empty value (but allow the literals "0" / "false").
    if (!draft.trim() && draft !== "0" && draft.toLowerCase() !== "false") return;
    setSavingKey(key);
    setSaveErrors((prev) => ({ ...prev, [key]: "" }));
    try {
      const updated = await onSave(key, draft);
      setDrafts((prev) => ({ ...prev, [key]: updated.value }));
      setFlashKey(key);
      setTimeout(() => setFlashKey((k) => (k === key ? null : k)), 2000);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Neznáma chyba.";
      setSaveErrors((prev) => ({ ...prev, [key]: msg }));
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-1">Systémové nastavenia</h2>
      <p className="text-xs text-[var(--color-text-muted)] mb-4">
        Runtime-mutable nastavenia. {canEdit ? "Zmeny sa prejavia do 30 s (interná cache TTL)." : "Read-only — chýba oprávnenie na úpravu."}
      </p>

      {loadError && (
        <div className="rounded-lg border border-[var(--color-state-error-bg)] bg-[var(--color-state-error-bg)] px-3 py-2 text-xs text-[var(--color-state-error-fg)] mb-4">
          {loadError}
        </div>
      )}
      {loading && !loadError && (
        <div className="text-xs text-[var(--color-text-muted)]">Načítavam…</div>
      )}

      {!loading && !loadError && (
        <div className="space-y-6">
          {[...categories, OTHER_CATEGORY].map((cat) => {
            const rows = groupedSettings[cat.id] ?? [];
            if (rows.length === 0) return null;
            return (
              <section key={cat.id}>
                <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest mb-1">{cat.label}</h3>
                {cat.description && (
                  <p className="text-[11px] text-[var(--color-text-muted)] mb-2">{cat.description}</p>
                )}
                <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-canvas)] divide-y divide-[var(--color-border-default)]">
                  {rows.map((s) => {
                    const draft = drafts[s.key] ?? s.value;
                    const dirty = draft !== s.value;
                    const inputType = inputTypeFor(s.value_type);
                    const saving = savingKey === s.key;
                    const err = saveErrors[s.key];
                    return (
                      <div key={s.key} className="p-4">
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <div className="min-w-0">
                            {/* Human label is the title (prose, not mono); the raw key drops to a small mono
                                info line. No label → the key IS the title (backward-compatible). */}
                            <div className={s.label ? "text-sm font-medium text-[var(--color-text-primary)]" : "text-sm font-medium text-[var(--color-text-primary)] font-mono"}>{s.label || s.key}</div>
                            {s.label && (
                              <div className="text-[10px] text-[var(--color-text-muted)] font-mono mt-0.5">{s.key}</div>
                            )}
                            <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest mt-0.5">{s.value_type}</div>
                          </div>
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => handleSaveSetting(s.key)}
                              disabled={saving || !dirty}
                              className="shrink-0 px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed rounded transition-colors"
                            >
                              {saving ? "Ukladám…" : dirty ? "Uložiť" : "Uložené"}
                            </button>
                          )}
                        </div>
                        {s.description && (
                          <p className="text-xs text-[var(--color-text-muted)] mb-2 leading-relaxed">{s.description}</p>
                        )}
                        {inputType === "checkbox" ? (
                          <label className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                            <input
                              type="checkbox"
                              checked={draft.toLowerCase() === "true" || draft === "1"}
                              onChange={(e) =>
                                setDrafts((prev) => ({ ...prev, [s.key]: e.target.checked ? "true" : "false" }))
                              }
                              disabled={!canEdit}
                              className="rounded border-[var(--color-border-default)] bg-[var(--color-surface)] text-primary-500 focus:ring-primary-500 disabled:opacity-50"
                            />
                            <span className="font-mono">{draft}</span>
                          </label>
                        ) : (
                          <div className="flex items-center gap-2">
                            <input
                              type={inputType}
                              value={draft}
                              onChange={(e) => setDrafts((prev) => ({ ...prev, [s.key]: e.target.value }))}
                              disabled={!canEdit}
                              step={s.value_type === "float" ? "any" : undefined}
                              className="w-full bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded px-3 py-1.5 text-xs text-[var(--color-text-primary)] font-mono focus:outline-none focus:border-primary-500 disabled:opacity-50"
                            />
                            {/* passive unit hint after the editor — "sekúnd", "€ / hod", … */}
                            {s.unit && <span className="shrink-0 text-xs text-[var(--color-text-muted)]">{s.unit}</span>}
                          </div>
                        )}
                        <div className="mt-2 text-[11px] flex items-center gap-2 flex-wrap">
                          {s.is_default ? (
                            <span className="text-[var(--color-text-muted)]">Predvolená hodnota.</span>
                          ) : (
                            <span className="text-[var(--color-text-muted)]">
                              Uložený override
                              {s.updated_by_username && (
                                <> — <span className="text-[var(--color-text-secondary)] font-medium">{s.updated_by_username}</span></>
                              )}
                              {s.updated_at && (
                                <> · {new Date(s.updated_at).toLocaleString("sk-SK")}</>
                              )}
                            </span>
                          )}
                          {flashKey === s.key && <span className="text-[var(--color-status-success)]">✓ Uložené</span>}
                          {err && <span className="text-[var(--color-status-error)]">{err}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
          {!canEdit && (
            <p className="text-[11px] text-[var(--color-text-muted)] italic">
              Read-only — na úpravu chýba oprávnenie.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
