/**
 * Generic, configurable HTTP-client factory (E1 Phase B4, CR-NS-051).
 *
 * Extracted verbatim from NEX Studio's `services/api.ts` machinery — the moving
 * parts (base URL, token storage, error envelope, 401 behavior) become config so
 * NEX Studio / Inbox / Ledger share ONE client. Pure TS: NO Tailwind, NO
 * react-router, NO stores, NO app imports. Uses the platform `fetch`.
 */

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** Optional per-request overrides. */
export interface RequestOptions {
  /** Extra headers merged after the defaults — callers can override them. */
  headers?: Record<string, string>;
  /** Passed straight to `fetch` for cancellation support. */
  signal?: AbortSignal;
  /** When true, do not attach the Authorization header. */
  skipAuth?: boolean;
  /** When true, do not run the 401 handler (callback + onUnauthorized). */
  skipAuthRedirect?: boolean;
  /** Extra query string parameters, serialized with `URLSearchParams`. */
  params?: Record<string, string | number | boolean | undefined | null>;
}

/** Richer error envelope fields (inbox/ledger style) — all optional. */
export interface ApiErrorEnvelope {
  code?: string;
  symbol?: string;
  resolution?: string;
}

/**
 * Error raised whenever a request does not complete with a 2xx status. The
 * parsed body (if any) is preserved on `data` so feature code can surface
 * backend validation messages. Optional `code`/`symbol`/`resolution` carry the
 * richer inbox/ledger envelopes when present.
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly data: unknown;
  public readonly code?: string;
  public readonly symbol?: string;
  public readonly resolution?: string;

  constructor(status: number, message: string, data: unknown = null, extra?: ApiErrorEnvelope) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.code = extra?.code;
    this.symbol = extra?.symbol;
    this.resolution = extra?.resolution;
  }
}

/** Configuration for {@link createApiClient}. */
export interface ApiClientConfig {
  /** Absolute origin or "" for same-origin (the app resolves this). */
  baseUrl: string;
  /** REST version prefix prepended to every path. Defaults to `/api/v1`. */
  apiPrefix?: string;
  /** Returns the current bearer token (or null). Called per request. */
  getToken: () => string | null;
  /** Invoked on a 401 (unless `skipAuthRedirect`) AFTER the registered auth callback. */
  onUnauthorized?: () => void;
  /** Build an error message from a failed response. Defaults to the FastAPI `{detail}` shape. */
  errorParser?: (status: number, body: unknown) => string;
  /** Optional per-request timeout in ms (aborts the fetch). */
  timeout?: number;
  /** When set, a request-id header with this name is added to every request. */
  requestIdHeader?: string;
  /** Generates the request-id value (used only when `requestIdHeader` is set). */
  requestIdGenerator?: () => string;
}

/** The configured client surface. */
export interface ApiClient {
  request<T>(method: HttpMethod, path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  get<T>(path: string, options?: RequestOptions): Promise<T>;
  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  delete<T>(path: string, options?: RequestOptions): Promise<T>;
}

// ---------------------------------------------------------------------------
// Auth callback — breaks the circular dependency between the client and an
// app's auth store (the store wires its in-memory clear here WITHOUT the lib
// importing the store). Module-level: one app bundle = one client in practice.
// ---------------------------------------------------------------------------

let _authCb: (() => void) | null = null;

/**
 * Register a callback invoked on every 401 (before `config.onUnauthorized`).
 * Intended to be called once by the app's auth store to clear in-memory state
 * without performing its own redirect.
 */
export function registerAuthCallback(cb: () => void): void {
  _authCb = cb;
}

/** Default FastAPI error parser: `{detail: string | [{msg}]}` → message ("" if none). */
function defaultErrorParser(_status: number, body: unknown): string {
  if (body && typeof body === "object" && "detail" in body) {
    const detail = (body as { detail: unknown }).detail;
    if (typeof detail === "string") {
      return detail;
    }
    if (Array.isArray(detail) && detail.length > 0) {
      const first = detail[0] as { msg?: unknown };
      if (first && typeof first.msg === "string") {
        return first.msg;
      }
    }
  }
  return "";
}

/** Append serialized query params to a path (skipping undefined/null). */
function buildQueryString(params: RequestOptions["params"] | undefined): string {
  if (!params) {
    return "";
  }
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }
    search.append(key, String(value));
  }
  const serialized = search.toString();
  return serialized.length > 0 ? `?${serialized}` : "";
}

/**
 * Parse the response body into JSON when possible, otherwise the raw text
 * (so callers can still read 204/empty responses).
 */
async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const text = await response.text();
    return text.length > 0 ? (JSON.parse(text) as unknown) : null;
  }
  const text = await response.text();
  return text.length > 0 ? text : null;
}

/**
 * Create a configured HTTP client. The returned object exposes `get/post/put/
 * patch/delete` plus the low-level `request<T>`.
 */
export function createApiClient(config: ApiClientConfig): ApiClient {
  const apiPrefix = config.apiPrefix ?? "/api/v1";
  const errorParser = config.errorParser ?? defaultErrorParser;

  function buildUrl(path: string, params?: RequestOptions["params"]): string {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    const withPrefix = normalized.startsWith(apiPrefix) ? normalized : `${apiPrefix}${normalized}`;
    return `${config.baseUrl}${withPrefix}${buildQueryString(params)}`;
  }

  async function request<T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...options.headers,
    };

    // Only attach Content-Type when we actually send a JSON body — otherwise
    // FormData / multipart uploads would be corrupted by a fixed header.
    let serializedBody: BodyInit | undefined;
    if (body !== undefined && body !== null) {
      if (body instanceof FormData || body instanceof URLSearchParams) {
        serializedBody = body;
      } else {
        headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
        serializedBody = JSON.stringify(body);
      }
    }

    if (!options.skipAuth) {
      const token = config.getToken();
      if (token && !headers.Authorization) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    if (config.requestIdHeader && !headers[config.requestIdHeader]) {
      const gen = config.requestIdGenerator;
      if (gen) {
        headers[config.requestIdHeader] = gen();
      }
    }

    // Optional timeout: abort the fetch after `config.timeout` ms while still
    // honoring a caller-supplied signal. No timeout → use the caller's signal
    // verbatim (behavior unchanged for consumers that don't set one).
    let signal = options.signal;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    if (config.timeout && config.timeout > 0) {
      controller = new AbortController();
      timeoutId = setTimeout(() => controller!.abort(), config.timeout);
      if (options.signal) {
        if (options.signal.aborted) {
          controller.abort();
        } else {
          options.signal.addEventListener("abort", () => controller!.abort(), { once: true });
        }
      }
      signal = controller.signal;
    }

    try {
      const response = await fetch(buildUrl(path, options.params), {
        method,
        headers,
        body: serializedBody,
        signal,
        // Same-origin credentials keep any future cookie auth working without
        // leaking tokens to third-party hosts.
        credentials: "same-origin",
      });

      if (response.status === 401 && !options.skipAuthRedirect) {
        if (_authCb) {
          try {
            _authCb();
          } catch {
            // Best-effort — continue with the configured handler regardless.
          }
        }
        config.onUnauthorized?.();
      }

      const parsed = await parseBody(response);

      if (!response.ok) {
        const message = errorParser(response.status, parsed) || response.statusText || "Request failed";
        throw new ApiError(response.status, message, parsed);
      }

      return parsed as T;
    } finally {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    }
  }

  return {
    request,
    get<T>(path: string, options?: RequestOptions): Promise<T> {
      return request<T>("GET", path, undefined, options);
    },
    post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
      return request<T>("POST", path, body, options);
    },
    put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
      return request<T>("PUT", path, body, options);
    },
    patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
      return request<T>("PATCH", path, body, options);
    },
    delete<T>(path: string, options?: RequestOptions): Promise<T> {
      return request<T>("DELETE", path, undefined, options);
    },
  };
}
