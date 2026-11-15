/**
 * MyAccountPanel — the shared "Moje konto" self-service account panel for the Settings → `konto` tab
 * (v0.15.1). It IS the Users-tab edit form, self-scoped: the logged-in user edits their OWN safe fields
 * (name, e-mail, Telegram id) and changes their OWN password. Login (username) + access rights (role) are
 * shown READ-ONLY — a user cannot change those about themselves; managing OTHER users (incl. role +
 * activation) stays in the admin-only Users tab.
 *
 * Role-agnostic kit (like UsersPanel): the parent supplies the role label (in the person's language) + the two I/O callbacks
 * (no fetch here — the app maps them to PATCH /me + its change-password API with current-password
 * verification).
 */

import { useEffect, useState } from "react";
import { Input } from "./Input";
import { Card } from "./Card";
import { refusalSentence } from "./api-client";
import { createTranslator, DEFAULT_LANGUAGE, LANGUAGES, useLanguage, useT, type Language, type Translate } from "./i18n";

/** What the panel says when saving the profile was refused — the server's own sentence, or its general one (DEV-309)
 *  in the person's language (DEV-393). */
export function accountRefusal(err: unknown, t: Translate = createTranslator(DEFAULT_LANGUAGE)): string {
  return refusalSentence(err) || t("account.saveFailed");
}

/** What the panel says when changing the password was refused — the server's own sentence („Súčasné heslo je
 *  nesprávne.“, „Nové heslo musí byť iné ako súčasné.“), or a general one that guesses no reason (DEV-309). */
export function passwordRefusal(err: unknown, t: Translate = createTranslator(DEFAULT_LANGUAGE)): string {
  return refusalSentence(err) || t("account.passwordFailed");
}

export interface MyAccountUser {
  username: string;
  /** Opaque per-app role id (the kit never compares against literals — the app passes `roleLabel`). */
  role: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  telegram_chat_id?: string | null;
}

export interface MyAccountPanelProps {
  /** The current (logged-in) user. */
  user: MyAccountUser;
  /** Display label for `user.role`, in the person's language (role-agnostic kit — the app owns role naming). */
  roleLabel: string;
  /** Persist the safe profile fields. The app maps this to PATCH /me. A rejection surfaces as the error — the
   *  server's own sentence when the rejection is an `ApiError` carrying one (v0.32.0), else a general one. */
  onSaveProfile: (data: {
    email: string;
    first_name: string;
    last_name: string;
    telegram_chat_id: string;
  }) => Promise<void>;
  /** Change own password (current-password verification is the app's concern). Rejection → error, with the
   *  server's own sentence when it carries one (v0.32.0). */
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  /** Optional (v0.15.2) — send a TEST Telegram to the saved chat_id + report the outcome, so the user can
   *  confirm notifications actually reach them (a silent fail is otherwise invisible). When supplied, a
   *  "Poslať test" button + a short how-to appear under the Telegram field. */
  onTestTelegram?: () => Promise<{ ok: boolean; detail: string }>;
  /** Minimum new-password length (mirrors the app's backend constraint). Default 5. */
  passwordMinLength?: number;
  /** v0.26.0 (DEV-251) — `false` for an app that sends nothing to Telegram: the field and its test are left out and
   *  `onSaveProfile` passes the stored chat_id back unchanged. Default `true`, as the cockpit has it. */
  telegram?: boolean;
  /** DEV-393 — the languages the app offers; with more than one and `onLanguageChange`, the panel lets the person
   *  choose theirs. */
  languages?: readonly Language[];
  /** The person's language now. */
  language?: Language;
  /** Keep the person's choice (the app stores it with the person and re-renders in it). A rejection surfaces as the
   *  server's own sentence, else a general one. */
  onLanguageChange?: (language: Language) => Promise<void> | void;
}

const LABEL = "block text-xs text-[var(--color-text-muted)] mb-1";
const BTN =
  "px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-500 disabled:opacity-40 rounded-lg transition-colors";

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className={LABEL}>{label}</div>
      <div className="text-sm text-[var(--color-text-secondary)] font-mono">{value || "—"}</div>
    </div>
  );
}

export function MyAccountPanel({
  user,
  roleLabel,
  onSaveProfile,
  onChangePassword,
  onTestTelegram,
  passwordMinLength = 5,
  telegram: showTelegram = true,
  languages = [],
  language,
  onLanguageChange,
}: MyAccountPanelProps) {
  const t = useT();
  const current = useLanguage().language;
  const [languageBusy, setLanguageBusy] = useState(false);
  const [languageError, setLanguageError] = useState("");
  // Profile fields (editable).
  const [firstName, setFirstName] = useState(user.first_name ?? "");
  const [lastName, setLastName] = useState(user.last_name ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [telegram, setTelegram] = useState(user.telegram_chat_id ?? "");
  // v0.33.0 (DEV-311): the fields follow the person — changed elsewhere (Používatelia, another screen), the panel shows
  // the new data, not the copy it took when it first appeared. 05.11.2026 NEX Manager: the e-mail changed in
  // Používatelia, Moje konto kept the old one until the page was reloaded.
  useEffect(() => {
    setFirstName(user.first_name ?? "");
    setLastName(user.last_name ?? "");
    setEmail(user.email ?? "");
    setTelegram(user.telegram_chat_id ?? "");
  }, [user.first_name, user.last_name, user.email, user.telegram_chat_id]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  // Telegram "Poslať test" (v0.15.2).
  const [testBusy, setTestBusy] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; detail: string } | null>(null);

  async function testTelegram() {
    if (!onTestTelegram) return;
    setTestBusy(true);
    setTestResult(null);
    try {
      setTestResult(await onTestTelegram());
    } catch (err) {
      setTestResult({ ok: false, detail: refusalSentence(err) || t("account.telegramTestFailed") });
    } finally {
      setTestBusy(false);
    }
  }

  // Password change.
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwDone, setPwDone] = useState(false);

  async function saveProfile() {
    setProfileError("");
    setProfileSaved(false);
    if (!email.trim()) {
      setProfileError(t("account.emailRequired"));
      return;
    }
    setSavingProfile(true);
    try {
      await onSaveProfile({
        email: email.trim(),
        first_name: firstName,
        last_name: lastName,
        telegram_chat_id: telegram,
      });
      setProfileSaved(true);
    } catch (err) {
      setProfileError(accountRefusal(err, t));
    } finally {
      setSavingProfile(false);
    }
  }

  const pwTooShort = newPw.length > 0 && newPw.length < passwordMinLength;
  const pwMismatch = confirmPw.length > 0 && newPw !== confirmPw;
  const pwDisabled =
    savingPw || !currentPw || !newPw || newPw.length < passwordMinLength || newPw !== confirmPw;

  async function changePassword() {
    setPwError("");
    setPwDone(false);
    if (pwDisabled) return;
    setSavingPw(true);
    try {
      await onChangePassword(currentPw, newPw);
      setPwDone(true);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch (err) {
      setPwError(passwordRefusal(err, t));
    } finally {
      setSavingPw(false);
    }
  }

  async function chooseLanguage(next: Language) {
    if (!onLanguageChange) return;
    setLanguageBusy(true);
    setLanguageError("");
    try {
      await onLanguageChange(next);
    } catch (err) {
      setLanguageError(refusalSentence(err) || t("account.languageFailed"));
    } finally {
      setLanguageBusy(false);
    }
  }

  const offered = LANGUAGES.filter((l) => languages.includes(l.code));

  return (
    <div className="p-4 max-w-3xl">
      {/* ── My details (self-scoped Users edit form) ─────────────────────────── */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">{t("account.details")}</h3>
        {profileError && (
          <div className="mb-3 text-xs text-[var(--color-state-error-fg)] rounded bg-[var(--color-state-error-bg)] px-3 py-2">
            {profileError}
          </div>
        )}
        {profileSaved && !profileError && (
          <div className="mb-3 text-xs text-[var(--color-text-primary)] rounded bg-[var(--color-state-success-bg)] px-3 py-2">
            {t("account.saved")}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label htmlFor="ma-first" className={LABEL}>
              {t("user.firstName")}
            </label>
            <Input id="ma-first" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="ma-last" className={LABEL}>
              {t("user.lastName")}
            </label>
            <Input id="ma-last" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="ma-email" className={LABEL}>
              {t("user.emailRequired")}
            </label>
            <Input id="ma-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {showTelegram && (
            <div>
              <label htmlFor="ma-tg" className={LABEL}>
                {t("user.telegram")}
              </label>
              <Input
                id="ma-tg"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder={t("account.telegramPlaceholder")}
              />
            </div>
          )}
          {/* Login + access rights are NOT self-editable — shown for reference only. */}
          <ReadOnly label={t("user.username")} value={user.username} />
          <ReadOnly label={t("user.role")} value={roleLabel} />
        </div>
        {showTelegram && onTestTelegram && (
          <div className="mb-3 rounded-lg bg-[var(--color-surface-hover)] px-3 py-2 text-xs">
            <p className="text-[var(--color-text-muted)] mb-2">{t("account.telegramHowTo")}</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={testTelegram}
                disabled={testBusy}
                className="px-3 py-1 rounded-lg border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] disabled:opacity-40 transition-colors"
              >
                {testBusy ? t("account.telegramSending") : t("account.telegramTest")}
              </button>
              {testResult && (
                <span
                  className={
                    testResult.ok ? "text-[var(--color-status-success)]" : "text-[var(--color-status-error)]"
                  }
                >
                  {testResult.ok ? "✅ " : "❌ "}
                  {testResult.detail}
                </span>
              )}
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <button type="button" onClick={saveProfile} disabled={savingProfile} className={BTN}>
            {savingProfile ? t("common.saving") : t("common.save")}
          </button>
        </div>
      </Card>

      {/* ── DEV-393: the language the app speaks to this person ──────────────── */}
      {onLanguageChange && offered.length > 1 && (
        <Card className="p-4 mt-4">
          <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-1">{t("account.language")}</h3>
          <p className="mb-3 text-xs text-[var(--color-text-muted)]">{t("account.languageHint")}</p>
          {languageError && (
            <div className="mb-3 text-xs text-[var(--color-state-error-fg)] rounded bg-[var(--color-state-error-bg)] px-3 py-2">
              {languageError}
            </div>
          )}
          <select
            aria-label={t("account.language")}
            value={language ?? current}
            disabled={languageBusy}
            onChange={(e) => void chooseLanguage(e.target.value as Language)}
            className="w-full max-w-xs rounded border border-[var(--color-border-default)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] disabled:opacity-40"
          >
            {offered.map((l) => (
              <option key={l.code} value={l.code} lang={l.code}>
                {l.name}
              </option>
            ))}
          </select>
        </Card>
      )}

      {/* ── Change my password ───────────────────────────────────────────────── */}
      <Card className="p-4 mt-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">{t("account.passwordTitle")}</h3>
        {pwError && (
          <div className="mb-3 text-xs text-[var(--color-state-error-fg)] rounded bg-[var(--color-state-error-bg)] px-3 py-2">
            {pwError}
          </div>
        )}
        {pwDone && !pwError && (
          <div className="mb-3 text-xs text-[var(--color-text-primary)] rounded bg-[var(--color-state-success-bg)] px-3 py-2">
            {t("account.passwordChanged")}
          </div>
        )}
        <div className="grid grid-cols-3 gap-3 mb-2">
          <div>
            <label htmlFor="ma-cur" className={LABEL}>
              {t("account.currentPassword")}
            </label>
            <Input id="ma-cur" type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
          </div>
          <div>
            <label htmlFor="ma-new" className={LABEL}>
              {t("password.new")}
            </label>
            <Input
              id="ma-new"
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              // DEV-296: an app that asks only for a non-empty password names no minimum.
              placeholder={passwordMinLength > 1 ? t("password.minPlaceholder", { count: passwordMinLength }) : undefined}
              invalid={pwTooShort}
            />
          </div>
          <div>
            <label htmlFor="ma-conf" className={LABEL}>
              {t("account.repeatPassword")}
            </label>
            <Input
              id="ma-conf"
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              invalid={pwMismatch}
            />
          </div>
        </div>
        {pwTooShort && (
          <div className="mb-2 text-[10px] text-[var(--color-status-error)]">
            {t("password.tooShort", { count: passwordMinLength })}
          </div>
        )}
        {pwMismatch && <div className="mb-2 text-[10px] text-[var(--color-status-error)]">{t("password.mismatch")}</div>}
        <div className="flex justify-end">
          <button type="button" onClick={changePassword} disabled={pwDisabled} className={BTN}>
            {savingPw ? t("common.saving") : t("account.changePassword")}
          </button>
        </div>
      </Card>
    </div>
  );
}
