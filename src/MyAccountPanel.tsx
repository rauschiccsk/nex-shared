/**
 * MyAccountPanel — the shared "Moje konto" self-service account panel for the Settings → `konto` tab
 * (v0.15.1). It IS the Users-tab edit form, self-scoped: the logged-in user edits their OWN safe fields
 * (name, e-mail, Telegram id) and changes their OWN password. Login (username) + access rights (role) are
 * shown READ-ONLY — a user cannot change those about themselves; managing OTHER users (incl. role +
 * activation) stays in the admin-only Users tab.
 *
 * Role-agnostic kit (like UsersPanel): the parent supplies the Slovak role label + the two I/O callbacks
 * (no fetch here — the app maps them to PATCH /me + its change-password API with current-password
 * verification).
 */

import { useState } from "react";
import { Input } from "./Input";
import { Card } from "./Card";

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
  /** Slovak display label for `user.role` (role-agnostic kit — the app owns role naming). */
  roleLabel: string;
  /** Persist the safe profile fields. The app maps this to PATCH /me. A rejection surfaces as the error. */
  onSaveProfile: (data: {
    email: string;
    first_name: string;
    last_name: string;
    telegram_chat_id: string;
  }) => Promise<void>;
  /** Change own password (current-password verification is the app's concern). Rejection → error. */
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  /** Minimum new-password length (mirrors the app's backend constraint). Default 5. */
  passwordMinLength?: number;
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
  passwordMinLength = 5,
}: MyAccountPanelProps) {
  // Profile fields (editable).
  const [firstName, setFirstName] = useState(user.first_name ?? "");
  const [lastName, setLastName] = useState(user.last_name ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [telegram, setTelegram] = useState(user.telegram_chat_id ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

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
      setProfileError("E-mail je povinný.");
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
    } catch {
      setProfileError("Uloženie zlyhalo. Skús to znova.");
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
    } catch {
      setPwError("Zmena hesla zlyhala — skontroluj súčasné heslo.");
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <div className="p-4 max-w-3xl">
      {/* ── My details (self-scoped Users edit form) ─────────────────────────── */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">Moje údaje</h3>
        {profileError && (
          <div className="mb-3 text-xs text-[var(--color-state-error-fg)] rounded bg-[var(--color-state-error-bg)] px-3 py-2">
            {profileError}
          </div>
        )}
        {profileSaved && !profileError && (
          <div className="mb-3 text-xs text-[var(--color-text-primary)] rounded bg-[var(--color-state-success-bg)] px-3 py-2">
            Údaje boli uložené.
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label htmlFor="ma-first" className={LABEL}>
              Meno
            </label>
            <Input id="ma-first" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="ma-last" className={LABEL}>
              Priezvisko
            </label>
            <Input id="ma-last" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="ma-email" className={LABEL}>
              Email *
            </label>
            <Input id="ma-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="ma-tg" className={LABEL}>
              Telegram chat_id
            </label>
            <Input
              id="ma-tg"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="napr. 123456789 (notifikácie)"
            />
          </div>
          {/* Login + access rights are NOT self-editable — shown for reference only. */}
          <ReadOnly label="Používateľské meno" value={user.username} />
          <ReadOnly label="Rola" value={roleLabel} />
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={saveProfile} disabled={savingProfile} className={BTN}>
            {savingProfile ? "Ukladám…" : "Uložiť"}
          </button>
        </div>
      </Card>

      {/* ── Change my password ───────────────────────────────────────────────── */}
      <Card className="p-4 mt-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">Zmena hesla</h3>
        {pwError && (
          <div className="mb-3 text-xs text-[var(--color-state-error-fg)] rounded bg-[var(--color-state-error-bg)] px-3 py-2">
            {pwError}
          </div>
        )}
        {pwDone && !pwError && (
          <div className="mb-3 text-xs text-[var(--color-text-primary)] rounded bg-[var(--color-state-success-bg)] px-3 py-2">
            Heslo bolo zmenené.
          </div>
        )}
        <div className="grid grid-cols-3 gap-3 mb-2">
          <div>
            <label htmlFor="ma-cur" className={LABEL}>
              Súčasné heslo
            </label>
            <Input id="ma-cur" type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
          </div>
          <div>
            <label htmlFor="ma-new" className={LABEL}>
              Nové heslo
            </label>
            <Input
              id="ma-new"
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder={`min. ${passwordMinLength} znakov`}
              invalid={pwTooShort}
            />
          </div>
          <div>
            <label htmlFor="ma-conf" className={LABEL}>
              Zopakuj nové heslo
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
            Heslo musí mať aspoň {passwordMinLength} znakov.
          </div>
        )}
        {pwMismatch && <div className="mb-2 text-[10px] text-[var(--color-status-error)]">Heslá sa nezhodujú.</div>}
        <div className="flex justify-end">
          <button type="button" onClick={changePassword} disabled={pwDisabled} className={BTN}>
            {savingPw ? "Ukladám…" : "Zmeniť heslo"}
          </button>
        </div>
      </Card>
    </div>
  );
}
