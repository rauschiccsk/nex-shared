/**
 * Shared TS contracts for the unified Settings/Admin kit (CR-NS-078).
 *
 * Domain shapes mirror each ICC app's settings/user/session serializers at the
 * canonical boundary the Director approved: user-active is canonical `is_active`,
 * roles stay per-app (the kit receives `roleOptions` + capability booleans /
 * predicates, NEVER role-string literals). Apps map their own serializer field
 * names onto these on the way in.
 */

/** The four canonical settings tabs. An app enables a subset via `SettingsKitConfig.tabs`. */
export type SettingsTabId = "system" | "agents" | "users" | "sessions";

/**
 * Serialised user row. `role` is an opaque string (role-agnostic kit) — the app
 * supplies `roleOptions` + a `roleClass` predicate for display, never a literal.
 * Canonical active flag is `is_active`.
 */
export interface UserRead {
  id: string;
  username: string;
  email: string;
  /** Opaque per-app role identifier (kit never compares against literals). */
  role: string;
  /** Canonical soft-disable flag (Director-approved canonical field). */
  is_active: boolean;
  /** Given name (nullable — legacy users / apps without names may omit it). */
  first_name?: string | null;
  /** Family name (nullable). */
  last_name?: string | null;
  /** Telegram chat_id for agent notifications (nullable; apps without it omit). */
  telegram_chat_id?: string | null;
  /** ISO-8601 timestamp. */
  created_at: string;
  /** ISO-8601 timestamp. */
  updated_at: string;
}

/**
 * Serialised user-session row — a per-user JWT lifecycle anchor. `token_version`
 * is bumped on logout/password-change to invalidate outstanding JWTs.
 */
export interface UserSessionRead {
  id: string;
  user_id: string;
  token_version: number;
  /** ISO-8601 timestamp. */
  last_seen_at: string;
  /** ISO-8601 timestamp. */
  created_at: string;
  /** ISO-8601 timestamp. */
  updated_at: string;
}

/** Runtime type of a system-setting `value` — drives the input widget. */
export type SystemSettingValueType = "string" | "int" | "float" | "bool";

/** Serialised system-setting row. A stored override sets `is_default` to false. */
export interface SystemSettingRead {
  key: string;
  value: string;
  value_type: SystemSettingValueType;
  description: string | null;
  /** Human display name (the card title); the raw `key` drops to small info. Optional — when absent the
   *  `key` is the title (backward-compatible for apps that don't supply a label). */
  label?: string | null;
  /** Unit shown after the editor (e.g. "sekúnd", "€ / hod"). Optional; empty/absent → no suffix. */
  unit?: string | null;
  /** ISO-8601 timestamp of last edit; `null` when the value is a default. */
  updated_at: string | null;
  /** UUID of the user who last edited; `null` for defaults. */
  updated_by: string | null;
  /** Username of the last editor; `null` for defaults or a deleted editor. */
  updated_by_username: string | null;
  /** `true` when the value comes from the service-layer default. */
  is_default: boolean;
}

/**
 * A system-settings category. Every setting whose `key` starts with one of
 * `prefixes` is grouped under it; keys matching no category fall into a trailing
 * "Ostatné" bucket so forward-compat additions stay visible.
 */
export interface SettingsCategory {
  id: string;
  label: string;
  description: string;
  prefixes: string[];
}

/**
 * Which user fields a given app's `UserForm` renders. Apps differ (e.g. NEX
 * Ledger has no username/names/telegram), so the field set is injected.
 */
export interface UserFieldSchema {
  /** Show the username field (disabled in edit mode for login stability). */
  username: boolean;
  /** Show the first-name + last-name fields. */
  names: boolean;
  /** Show the Telegram chat_id field. */
  telegram: boolean;
  /** Minimum password length (mirrors the app's backend constraint). */
  passwordMinLength: number;
}

/**
 * Top-level kit config for `SettingsShell`. The app declares which tabs exist,
 * their (Slovak, overridable) labels, and an optional per-role visibility
 * predicate. A tab renders only when it is in `tabs` AND `tabVisibleForRole`
 * (when supplied) returns true.
 */
export interface SettingsKitConfig {
  /** Enabled tabs, in display order (subset of the four canonical ids). */
  tabs: SettingsTabId[];
  /** Slovak tab labels (app-overridable). */
  labels: Record<SettingsTabId, string>;
  /** Optional capability predicate — hide a tab from a role entirely. */
  tabVisibleForRole?: (tab: SettingsTabId, role: string) => boolean;
}
