import { useState, type FormEvent } from "react";
import { Input } from "./Input";
import { Button } from "./Button";

/** Credentials collected by the form. `username` carries the identity value
 *  (a username or, in `email` mode, the email string). */
export interface LoginCreds {
  username: string;
  password: string;
}

export interface LoginFormProps {
  /** Which identity field — changes the label/type/autocomplete. Default `username`. */
  fieldLabel?: "username" | "email";
  /** Called with trimmed creds when the form is submitted (both fields non-empty). */
  onSubmit: (creds: LoginCreds) => void | Promise<void>;
  /** Disables inputs + submit; the submit shows the loading label. */
  loading?: boolean;
  /** Error message shown above the submit button. */
  error?: string | null;
  /** Fired on any field edit (e.g. to clear an externally-owned error). */
  onChange?: () => void;
  /** Focus the identity field on mount. */
  autoFocus?: boolean;
  /** Show the password visibility toggle. Default `true`. */
  showPasswordToggle?: boolean;
  // Text (NEX-Slovak defaults; all overridable for other languages):
  identityLabel?: string;
  passwordLabel?: string;
  submitLabel?: string;
  loadingLabel?: string;
  identityPlaceholder?: string;
  passwordPlaceholder?: string;
}

const LABEL_CLS = "block text-sm font-medium text-slate-300 mb-1";

export function LoginForm({
  fieldLabel = "username",
  onSubmit,
  loading = false,
  error = null,
  onChange,
  autoFocus = false,
  showPasswordToggle = true,
  identityLabel,
  passwordLabel = "Heslo",
  submitLabel = "Prihlásiť sa",
  loadingLabel = "Prihlasovanie…",
  identityPlaceholder,
  passwordPlaceholder = "••••••••",
}: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const isEmail = fieldLabel === "email";
  const idLabel = identityLabel ?? (isEmail ? "Email" : "Používateľské meno");
  const disabled = loading || !username.trim() || !password.trim();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    void onSubmit({ username: username.trim(), password });
  };

  const edit = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    onChange?.();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Identity */}
      <div>
        <label htmlFor="login-username" className={LABEL_CLS}>
          {idLabel}
        </label>
        <Input
          id="login-username"
          type={isEmail ? "email" : "text"}
          autoComplete={isEmail ? "email" : "username"}
          placeholder={identityPlaceholder}
          value={username}
          onChange={edit(setUsername)}
          disabled={loading}
          autoFocus={autoFocus}
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="login-password" className={LABEL_CLS}>
          {passwordLabel}
        </label>
        <div className="relative">
          <Input
            id="login-password"
            type={showPwd ? "text" : "password"}
            autoComplete="current-password"
            placeholder={passwordPlaceholder}
            value={password}
            onChange={edit(setPassword)}
            disabled={loading}
            className={showPasswordToggle ? "pr-10" : ""}
          />
          {showPasswordToggle && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPwd((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
            >
              {showPwd ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Submit */}
      <Button type="submit" variant="primary" disabled={disabled} className="w-full mt-2 gap-2">
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {loadingLabel}
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
