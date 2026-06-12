/**
 * Shared FE auth-store factory (E1 Phase C, CR-NS-052). FE-only — pure Zustand,
 * no backend, no router, no app stores. Mode-discriminated:
 *
 *   - **mode 'login'** (NEX Studio, internal tools): username/password login,
 *     persists {token, user} (Zustand persist), bridges the token to the
 *     api-client's token storage via `setToken`, wires `registerAuthCallback`
 *     so a 401 clears the store.
 *   - **mode 'token-launch'** (Inbox/Ledger, Genesis-launched apps): session
 *     metadata only (no token, no persist); `useSessionProbe` runs `getUser`
 *     on mount; a 401 redirects to `redirectOnUnauthorized` (the api-client
 *     handles the redirect; this store just clears).
 *
 * The backend auth stays per-project — this is only the shared FE plumbing.
 */

import { create, type StoreApi, type UseBoundStore } from "zustand";
import { persist } from "zustand/middleware";
import { registerAuthCallback } from "./api-client";

export type AuthMode = "login" | "token-launch";

/**
 * Configuration for {@link createAuthStore}. `T` is the app's user type; `A` is
 * the login action's argument tuple (e.g. `[string, string]` for username +
 * password) — kept positional so the consuming app's existing `login(u, p)`
 * call sites stay unchanged.
 */
export interface AuthConfig<T, A extends unknown[] = unknown[]> {
  mode: AuthMode;
  /** localStorage key for the Zustand persist (mode 1). Default: `nex-auth`. */
  persistKey?: string;
  /** Probe the current user (`GET /auth/me` or `/session`) — app supplies the call. */
  getUser: () => Promise<T>;
  /** Authenticate (mode 1). Returns the raw token + user; the app maps its own response shape. */
  login?: (...args: A) => Promise<{ token: string; user: T }>;
  /** Invalidate the session on the backend (mode 1 logout). Best-effort. */
  logout?: () => Promise<void>;
  /**
   * Bridge the token to wherever the api-client reads it (mode 1). Called with
   * the token on login and `null` on logout / failed revalidation. Keeps the
   * api-client's `getToken` contract (e.g. localStorage) app-side.
   */
  setToken?: (token: string | null) => void;
  /** Where ProtectedRoute / a 401 sends an unauthenticated user (e.g. `/login`). */
  redirectOnUnauthorized: string;
  /** Side-effect after a successful login (e.g. presence reset) — NOT baked in the lib. */
  onLogin?: (user: T) => void;
  /** Optional post-login gate (e.g. must-change-password) — returns false to block. */
  validateAfterLogin?: (user: T) => boolean;
}

/** Mode-1 store shape (token + user + actions). */
export interface LoginAuthState<T, A extends unknown[]> {
  token: string | null;
  user: T | null;
  login: (...args: A) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

/** Mode-2 store shape (session metadata, no token). */
export interface TokenLaunchAuthState<T> {
  user: T | null;
  ready: boolean;
  probe: () => Promise<void>;
  clear: () => void;
}

/** Mode-1 module: login store + convenience login hook. */
export interface LoginAuthModule<T, A extends unknown[]> {
  /** The bound Zustand hook ({@link LoginAuthState}). */
  useAuthStore: UseBoundStore<StoreApi<LoginAuthState<T, A>>>;
  /** Where an unauthenticated user is redirected (mirrors the config). */
  redirectOnUnauthorized: string;
  /** Convenience login hook with local loading/error. */
  useLogin: () => { login: (...args: A) => Promise<void>; loading: boolean; error: string | null };
}

/** Mode-2 module: session store + probe hook. */
export interface TokenLaunchAuthModule<T> {
  /** The bound Zustand hook ({@link TokenLaunchAuthState}). */
  useAuthStore: UseBoundStore<StoreApi<TokenLaunchAuthState<T>>>;
  redirectOnUnauthorized: string;
  /** Runs `getUser` on mount and tracks `ready`. */
  useSessionProbe: () => { user: T | null; ready: boolean };
}

/** Union of the per-mode modules (the impl return type). */
export type AuthModule<T, A extends unknown[]> = LoginAuthModule<T, A> | TokenLaunchAuthModule<T>;

import { useEffect, useState } from "react";

export function createAuthStore<T, A extends unknown[] = unknown[]>(
  config: AuthConfig<T, A> & { mode: "login" },
): LoginAuthModule<T, A>;
export function createAuthStore<T, A extends unknown[] = unknown[]>(
  config: AuthConfig<T, A> & { mode: "token-launch" },
): TokenLaunchAuthModule<T>;
export function createAuthStore<T, A extends unknown[] = unknown[]>(
  config: AuthConfig<T, A>,
): AuthModule<T, A> {
  if (config.mode === "login") {
    const useAuthStore = create<LoginAuthState<T, A>>()(
      persist(
        (set, get) => ({
          token: null,
          user: null,

          async login(...args: A): Promise<void> {
            const { token, user } = await config.login!(...args);
            // Bridge the raw token to the api-client's storage (app-supplied key).
            config.setToken?.(token);
            set({ token, user });
            config.onLogin?.(user);
          },

          async logout(): Promise<void> {
            try {
              await config.logout?.();
            } catch {
              // Best-effort — clear local state regardless.
            }
            config.setToken?.(null);
            set({ token: null, user: null });
          },

          async fetchMe(): Promise<void> {
            const { token } = get();
            if (!token) return;
            try {
              const user = await config.getUser();
              set({ user });
            } catch {
              // Token expired / invalid — clear state + token.
              config.setToken?.(null);
              set({ token: null, user: null });
            }
          },
        }),
        {
          name: config.persistKey ?? "nex-auth",
          // Only persist token + user; actions are recreated by Zustand.
          partialize: (state) => ({ token: state.token, user: state.user }),
        },
      ),
    );

    // Clear in-memory state when the api-client detects a 401 (circular-dep-safe:
    // the lib never imports the app store).
    registerAuthCallback(() => {
      useAuthStore.setState({ token: null, user: null });
    });

    const useLogin = () => {
      const login = useAuthStore((s) => s.login);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const wrapped = async (...args: A): Promise<void> => {
        setError(null);
        setLoading(true);
        try {
          await login(...args);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Login failed");
          throw e;
        } finally {
          setLoading(false);
        }
      };
      return { login: wrapped, loading, error };
    };

    return { useAuthStore, redirectOnUnauthorized: config.redirectOnUnauthorized, useLogin };
  }

  // mode 'token-launch' — session metadata, no token, no persist.
  const useAuthStore = create<TokenLaunchAuthState<T>>()((set) => ({
    user: null,
    ready: false,
    async probe(): Promise<void> {
      try {
        const user = await config.getUser();
        set({ user, ready: true });
      } catch {
        set({ user: null, ready: true });
      }
    },
    clear(): void {
      set({ user: null });
    },
  }));

  registerAuthCallback(() => {
    useAuthStore.setState({ user: null });
  });

  const useSessionProbe = () => {
    const user = useAuthStore((s) => s.user);
    const ready = useAuthStore((s) => s.ready);
    const probe = useAuthStore((s) => s.probe);
    useEffect(() => {
      void probe();
    }, [probe]);
    return { user, ready };
  };

  return { useAuthStore, redirectOnUnauthorized: config.redirectOnUnauthorized, useSessionProbe };
}
