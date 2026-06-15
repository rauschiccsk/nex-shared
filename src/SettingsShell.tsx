/**
 * SettingsShell — the tabbed Nastavenia container (CR-NS-078). Owns ONLY the
 * active-tab state; every panel is injected via `panels` so the app keeps all
 * data + IO + state (the kit is pure props-in, like the chrome kit).
 *
 * A tab renders only when it is in `config.tabs` AND `config.tabVisibleForRole`
 * (when supplied) returns true for `currentUserRole` — so an app/role lacking a
 * tab never sees it.
 */

import { useState, type ReactNode } from "react";
import type { SettingsKitConfig, SettingsTabId } from "./settings-types";

/** Built-in Slovak fallbacks; `config.labels` overrides per-app. */
const DEFAULT_TAB_LABELS: Record<SettingsTabId, string> = {
  system: "Systém",
  agents: "Agenti",
  users: "Používatelia",
  sessions: "Relácie",
};

export interface SettingsShellProps {
  /** Tabs, labels + per-role visibility predicate. */
  config: SettingsKitConfig;
  /** The current user's (opaque) role — passed to `tabVisibleForRole`. */
  currentUserRole: string;
  /** Panel body for each enabled tab. */
  panels: Partial<Record<SettingsTabId, ReactNode>>;
  /** Page title in the header. Defaults to "Nastavenia". */
  title?: string;
  /** Optional right-aligned header slot (e.g. the app's "logged in as" badge —
   *  role coloring is an app concern, kept out of the role-agnostic kit). */
  headerRight?: ReactNode;
}

export function SettingsShell({
  config,
  currentUserRole,
  panels,
  title = "Nastavenia",
  headerRight,
}: SettingsShellProps) {
  const visibleTabs = config.tabs.filter(
    (t) => !config.tabVisibleForRole || config.tabVisibleForRole(t, currentUserRole),
  );

  const [tab, setTab] = useState<SettingsTabId | undefined>(visibleTabs[0]);

  // Guard against an active tab that was filtered out (e.g. role change).
  const activeTab = tab && visibleTabs.includes(tab) ? tab : visibleTabs[0];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-[var(--color-border-default)] flex items-center justify-between">
        <h1 className="text-base font-bold text-[var(--color-text-primary)]">{title}</h1>
        {headerRight}
      </div>

      {/* Tab bar */}
      <div className="flex-shrink-0 flex gap-0 border-b border-[var(--color-border-default)] px-6">
        {visibleTabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === t
                ? "border-primary-500 text-primary-400"
                : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
            }`}
          >
            {config.labels[t] ?? DEFAULT_TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Active panel */}
      <div className="flex-1 overflow-y-auto">
        {activeTab != null && panels[activeTab]}
      </div>
    </div>
  );
}
