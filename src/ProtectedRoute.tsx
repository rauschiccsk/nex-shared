import { useEffect, useState, type ReactNode } from "react";

export interface ProtectedRouteProps {
  /** Whether a token / session currently exists (the app reads its store). */
  authed: boolean;
  /** Revalidate on mount (e.g. fetchMe / session probe). Runs only when `authed`. */
  validate?: () => Promise<void>;
  /**
   * Re-check auth AFTER `validate` resolves (the token may have been cleared by
   * an expired-session revalidation). Defaults to the initial `authed`.
   */
  isAuthed?: () => boolean;
  /** Rendered when unauthenticated — the app supplies its router redirect (e.g. `<Navigate>`). */
  redirect: ReactNode;
  children: ReactNode;
}

/**
 * Config-driven auth guard. Router-agnostic: the consuming app reads its own
 * store (`authed` / `isAuthed`), supplies the revalidation (`validate`) and the
 * redirect element (`redirect`). Shows nothing until `validate` settles so there
 * is no flash of protected content or a premature redirect.
 */
export function ProtectedRoute({ authed, validate, isAuthed, redirect, children }: ProtectedRouteProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (authed && validate) {
      validate().finally(() => setReady(true));
    } else {
      setReady(true);
    }
    // Run once on mount (or when authed flips null → token), mirroring the
    // app's historical `[token]` dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  if (!ready) return null;

  const ok = isAuthed ? isAuthed() : authed;
  return ok ? <>{children}</> : <>{redirect}</>;
}
