/**
 * AgentsPanel — per-role model + effort grid (NEX Studio CR-NS-040 behaviour),
 * rendered only where the app has agents. Role-agnostic: the roles, models and
 * effort levels are all injected, never hardcoded.
 *
 * `drafts` is the app-loaded baseline (a row per role id); the panel seeds its
 * editable grid from it and persists a row via `onSave(roleId, { model, effort })`
 * (resolve → ✓ flash; reject → the app surfaces the message via `saveErrors`).
 */

import { useEffect, useState } from "react";

/** One role's draft selection. Empty string = "use the default". ``helperModel`` (optional) is the model
 * a role's dynamically-spawned helper agents run on — only meaningful for roles in
 * ``helperModelRoleIds`` (the doer that spawns helpers); absent/"" = the dispatch default. */
export interface AgentDraft {
  model: string;
  effort: string;
  helperModel?: string;
}

export interface AgentsPanelProps {
  roles: { id: string; label: string }[];
  models: { id: string; label: string }[];
  efforts: string[];
  /** App-loaded baseline per role id (stable after load). */
  drafts: Record<string, AgentDraft>;
  /** Persist one role's config. Resolve → flash; reject → app sets `saveErrors`. */
  onSave: (roleId: string, value: AgentDraft) => Promise<void>;
  /** Options for the optional per-role "helper model" selector (model IDs the spawned helpers may run on).
   * Omitted/empty → no helper-model selector is shown for any role. */
  helperModels?: { id: string; label: string }[];
  /** Role ids that spawn dynamic helpers → show the helper-model selector (e.g. ["ai_agent"]). Other roles
   * never render it (the verifier does not spawn helpers). No-op unless ``helperModels`` is also given. */
  helperModelRoleIds?: string[];
  /** Initial load in flight. */
  loading?: boolean;
  /** Load error message (empty/undefined = none). */
  loadError?: string;
  /** Per-role save error messages, keyed by role id. */
  saveErrors?: Record<string, string>;
}

function seedState(
  roles: { id: string; label: string }[],
  drafts: Record<string, AgentDraft>,
): Record<string, AgentDraft> {
  const out: Record<string, AgentDraft> = {};
  for (const r of roles) {
    const d = drafts[r.id];
    out[r.id] = { model: d?.model ?? "", effort: d?.effort ?? "", helperModel: d?.helperModel ?? "" };
  }
  return out;
}

export function AgentsPanel({
  roles,
  models,
  efforts,
  drafts,
  onSave,
  helperModels,
  helperModelRoleIds = [],
  loading = false,
  loadError = "",
  saveErrors = {},
}: AgentsPanelProps) {
  const [edit, setEdit] = useState<Record<string, AgentDraft>>(() => seedState(roles, drafts));
  const [savingRole, setSavingRole] = useState<string | null>(null);
  const [flashRole, setFlashRole] = useState<string | null>(null);
  const showHelperModel = (roleId: string) =>
    Boolean(helperModels && helperModels.length > 0 && helperModelRoleIds.includes(roleId));

  // Re-seed when the app finishes loading (drafts/roles become available).
  useEffect(() => {
    setEdit(seedState(roles, drafts));
  }, [roles, drafts]);

  async function handleSave(roleId: string) {
    const draft = edit[roleId] ?? { model: "", effort: "", helperModel: "" };
    setSavingRole(roleId);
    try {
      await onSave(roleId, draft);
      setFlashRole(roleId);
      setTimeout(() => setFlashRole((r) => (r === roleId ? null : r)), 2000);
    } catch {
      // The app surfaces the message via the `saveErrors` prop.
    } finally {
      setSavingRole(null);
    }
  }

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-1">Agenti — model a effort</h2>
      <p className="text-xs text-[var(--color-text-muted)] mb-4">
        Per-rola konfigurácia modelu (<code>--model</code>) a úrovne (<code>--effort</code>).
        Nenastavené pole = predvolené správanie (CLI default).
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
        <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-canvas)] divide-y divide-[var(--color-border-default)]">
          {roles.map((r) => {
            const draft = edit[r.id] ?? { model: "", effort: "", helperModel: "" };
            const saving = savingRole === r.id;
            const err = saveErrors[r.id];
            return (
              <div key={r.id} className="p-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="text-sm font-medium text-[var(--color-text-primary)]">{r.label}</div>
                  <button
                    type="button"
                    onClick={() => handleSave(r.id)}
                    disabled={saving}
                    className="shrink-0 px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed rounded transition-colors"
                  >
                    {saving ? "Ukladám…" : "Uložiť"}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">Model</span>
                    <select
                      value={draft.model}
                      onChange={(e) =>
                        setEdit((prev) => ({ ...prev, [r.id]: { ...draft, model: e.target.value } }))
                      }
                      className="mt-1 w-full bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded px-3 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-primary-500"
                    >
                      <option value="">— Predvolený —</option>
                      {models.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">Úroveň</span>
                    <select
                      value={draft.effort}
                      onChange={(e) =>
                        setEdit((prev) => ({ ...prev, [r.id]: { ...draft, effort: e.target.value } }))
                      }
                      className="mt-1 w-full bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded px-3 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-primary-500"
                    >
                      <option value="">— Predvolený —</option>
                      {efforts.map((ef) => (
                        <option key={ef} value={ef}>
                          {ef}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                {showHelperModel(r.id) && (
                  <label className="block mt-3">
                    <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">
                      Model pomocníkov
                    </span>
                    <select
                      value={draft.helperModel ?? ""}
                      onChange={(e) =>
                        setEdit((prev) => ({ ...prev, [r.id]: { ...draft, helperModel: e.target.value } }))
                      }
                      className="mt-1 w-full bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded px-3 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-primary-500"
                    >
                      <option value="">— Predvolený (lacný/rýchly) —</option>
                      {(helperModels ?? []).map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                    <span className="mt-1 block text-[10px] text-[var(--color-text-muted)]">
                      Model dynamických pomocníkov pre paralelnú/hromadnú prácu. Predvolene lacný/rýchly;
                      zvýš na silný len pre prioritný build (drahšie tokeny).
                    </span>
                  </label>
                )}
                <div className="mt-2 text-[11px] flex items-center gap-2">
                  {flashRole === r.id && <span className="text-[var(--color-status-success)]">✓ Uložené</span>}
                  {err && <span className="text-[var(--color-status-error)]">{err}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
