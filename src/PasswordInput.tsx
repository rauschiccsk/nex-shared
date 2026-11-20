/**
 * PasswordInput — a field for a password a person types now (DEV-439).
 *
 * The browser never fills it in by itself (`autoComplete="new-password"`): 20.11.2026 in Orthodox Hermenia the admin
 * renamed themselves in Používatelia, the browser had put their saved password into the empty password field, and the
 * save was refused as a change of their own password they never typed.
 *
 * With `reveal` an eye at the end of the field shows what is being typed and hides it again. It shows only the typed
 * text: a stored password is a one-way hash and cannot be shown — where nothing can be shown, there is no eye.
 */

import { useState } from "react";
import { Input, type InputProps } from "./Input";
import { useT } from "./i18n";

export interface PasswordInputProps extends Omit<InputProps, "type"> {
  /** Offer the eye that shows the typed password. */
  reveal?: boolean;
  /** What the eye's label names („Zobraziť: Nové heslo“); without it the eye says only „Zobraziť heslo“. */
  revealLabel?: string;
}

const EYE = "M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z";
const PUPIL = "M12 15a3 3 0 100-6 3 3 0 000 6z";
const STRIKE = "M3 3l18 18";

export function PasswordInput({ reveal = false, revealLabel, className = "", autoComplete, ...rest }: PasswordInputProps) {
  const t = useT();
  const [shown, setShown] = useState(false);
  const visible = reveal && shown;
  const label = visible
    ? revealLabel
      ? t("password.hideNamed", { label: revealLabel })
      : t("password.hide")
    : revealLabel
      ? t("password.showNamed", { label: revealLabel })
      : t("password.show");
  const field = (
    <Input
      {...rest}
      type={visible ? "text" : "password"}
      autoComplete={autoComplete ?? "new-password"}
      spellCheck={false}
      className={reveal ? `${className} pr-9`.trim() : className}
    />
  );
  if (!reveal) return field;
  return (
    <span className="relative block">
      {field}
      <button
        type="button"
        onClick={() => setShown((v) => !v)}
        disabled={rest.disabled}
        aria-label={label}
        aria-pressed={visible}
        title={label}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] disabled:opacity-40"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d={EYE} />
          <path strokeLinecap="round" strokeLinejoin="round" d={PUPIL} />
          {visible && <path strokeLinecap="round" strokeLinejoin="round" d={STRIKE} />}
        </svg>
      </button>
    </span>
  );
}
