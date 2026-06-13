// src/Button.tsx
import { jsx } from "react/jsx-runtime";
var BASE = "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
var VARIANT = {
  primary: "bg-[var(--color-accent-primary)] text-white hover:bg-[var(--color-accent-primary-hover)]",
  secondary: "bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-active)]",
  danger: "bg-red-600 text-white hover:bg-red-500 active:bg-red-700",
  ghost: "bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]"
};
var SIZE = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base"
};
function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  type = "button",
  ...rest
}) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      type,
      className: `${BASE} ${VARIANT[variant]} ${SIZE[size]} ${className}`.trim(),
      ...rest,
      children
    }
  );
}

// src/AppShell.tsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function AppShell({ sidebar, header, topBanner, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full w-full bg-[var(--color-canvas)]", children: [
    sidebar,
    /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col overflow-hidden", children: [
      topBanner,
      header,
      /* @__PURE__ */ jsx2("main", { className: "relative flex-1 overflow-y-auto", children })
    ] })
  ] });
}

// src/CollapseContext.ts
import { createContext, useContext } from "react";
var CollapseContext = createContext(false);
var useCollapsed = () => useContext(CollapseContext);

// src/Sidebar.tsx
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var IconSidebarToggle = () => /* @__PURE__ */ jsxs2("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
  /* @__PURE__ */ jsx3("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", strokeWidth: "1.8" }),
  /* @__PURE__ */ jsx3("path", { d: "M9 3v18", strokeWidth: "1.8" })
] });
function Sidebar({
  collapsed,
  onToggleCollapse,
  logo,
  footer,
  children,
  collapseTitle = "Z\xFA\u017Ei\u0165",
  expandTitle = "Roz\u0161\xEDri\u0165"
}) {
  return /* @__PURE__ */ jsx3(CollapseContext.Provider, { value: collapsed, children: /* @__PURE__ */ jsxs2(
    "aside",
    {
      className: "flex-shrink-0 bg-[var(--color-surface)] border-r border-[var(--color-border-default)] flex flex-col select-none transition-all duration-200 overflow-x-hidden",
      style: { width: collapsed ? "3.5rem" : "14rem" },
      children: [
        /* @__PURE__ */ jsxs2("div", { className: "px-3 py-3 border-b border-[var(--color-border-default)] flex items-center gap-3 min-h-[56px]", children: [
          !collapsed && logo,
          /* @__PURE__ */ jsx3(
            "button",
            {
              type: "button",
              onClick: onToggleCollapse,
              className: `flex items-center justify-center rounded text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors shrink-0 ${collapsed ? "w-8 h-8" : "w-6 h-6"}`,
              title: collapsed ? expandTitle : collapseTitle,
              children: /* @__PURE__ */ jsx3(IconSidebarToggle, {})
            }
          )
        ] }),
        /* @__PURE__ */ jsx3("nav", { className: "flex-1 p-2 space-y-0.5 overflow-y-auto overflow-x-hidden", children }),
        footer != null && /* @__PURE__ */ jsx3("div", { className: "p-3 border-t border-[var(--color-border-default)]", children: footer })
      ]
    }
  ) });
}

// src/NavItem.tsx
import { Fragment, jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function NavItem({
  icon,
  label,
  active,
  disabled,
  disabledTitle,
  badge,
  badgeLabel,
  onClick,
  href
}) {
  const collapsed = useCollapsed();
  const base = "flex items-center gap-2.5 py-2 rounded-lg text-sm transition-colors w-full";
  const px = collapsed ? "px-0 justify-center" : "px-3";
  const color = disabled ? "text-[var(--color-text-muted)] opacity-40 cursor-not-allowed" : active ? "bg-primary-600/10 text-[var(--color-accent-primary)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]";
  const tooltip = disabled ? disabledTitle ?? label : collapsed ? label : void 0;
  const className = `${base} ${px} ${color} relative`;
  const inner = /* @__PURE__ */ jsxs3(Fragment, { children: [
    icon,
    !collapsed && /* @__PURE__ */ jsx4("span", { children: label }),
    badge && /* @__PURE__ */ jsx4(
      "span",
      {
        "aria-label": badgeLabel,
        className: collapsed ? "absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--color-status-in-design)]" : "ml-auto h-2 w-2 rounded-full bg-[var(--color-status-in-design)]"
      }
    )
  ] });
  if (href && !disabled) {
    return /* @__PURE__ */ jsx4("a", { className, href, title: tooltip, onClick, children: inner });
  }
  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };
  return /* @__PURE__ */ jsx4("button", { type: "button", className, onClick: handleClick, disabled, title: tooltip, children: inner });
}

// src/SectionLabel.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
function SectionLabel({ label }) {
  const collapsed = useCollapsed();
  if (collapsed) return /* @__PURE__ */ jsx5("div", { className: "h-3" });
  return /* @__PURE__ */ jsx5("div", { className: "pt-3 pb-1 px-3 text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-semibold", children: label });
}

// src/Header.tsx
import { Fragment as Fragment2, jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
function Header({ left, right, children, className = "" }) {
  return /* @__PURE__ */ jsx6(
    "header",
    {
      className: `h-10 flex-shrink-0 bg-[var(--color-surface)] border-b border-[var(--color-border-default)] flex items-center px-3 gap-3 z-10 select-none ${className}`.trim(),
      children: children ?? /* @__PURE__ */ jsxs4(Fragment2, { children: [
        left,
        right != null && /* @__PURE__ */ jsx6("div", { className: "ml-auto flex items-center gap-3", children: right })
      ] })
    }
  );
}

// src/Input.tsx
import { jsx as jsx7 } from "react/jsx-runtime";
var BASE2 = "w-full bg-[var(--color-surface)] border rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-focus)]";
function Input({ invalid, className = "", ...rest }) {
  const border = invalid ? "border-red-500" : "border-[var(--color-border-default)]";
  return /* @__PURE__ */ jsx7(
    "input",
    {
      className: `${BASE2} ${border} ${className}`.trim(),
      "aria-invalid": invalid || void 0,
      ...rest
    }
  );
}

// src/Select.tsx
import { jsx as jsx8 } from "react/jsx-runtime";
var BASE3 = "w-full bg-[var(--color-surface)] border rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-focus)]";
function Select({ invalid, className = "", children, ...rest }) {
  const border = invalid ? "border-red-500" : "border-[var(--color-border-default)]";
  return /* @__PURE__ */ jsx8(
    "select",
    {
      className: `${BASE3} ${border} ${className}`.trim(),
      "aria-invalid": invalid || void 0,
      ...rest,
      children
    }
  );
}

// src/Card.tsx
import { jsx as jsx9 } from "react/jsx-runtime";
var BASE4 = "rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)]";
function Card({ className = "", children, ...rest }) {
  return /* @__PURE__ */ jsx9("div", { className: `${BASE4} ${className}`.trim(), ...rest, children });
}

// src/Badge.tsx
import { jsx as jsx10 } from "react/jsx-runtime";
var BASE5 = "inline-flex items-center rounded px-1.5 py-0.5 text-xs";
var VARIANT2 = {
  neutral: "bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]",
  muted: "bg-[var(--color-state-muted-bg)] text-[var(--color-state-muted-fg)]"
};
function Badge({ variant = "neutral", pulse = false, className = "", children, ...rest }) {
  return /* @__PURE__ */ jsx10(
    "span",
    {
      className: `${BASE5} ${VARIANT2[variant]} ${pulse ? "animate-pulse" : ""} ${className}`.replace(/\s+/g, " ").trim(),
      ...rest,
      children
    }
  );
}

// src/api-client.ts
var ApiError = class extends Error {
  status;
  data;
  code;
  symbol;
  resolution;
  constructor(status, message, data = null, extra) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.code = extra?.code;
    this.symbol = extra?.symbol;
    this.resolution = extra?.resolution;
  }
};
var _authCb = null;
function registerAuthCallback(cb) {
  _authCb = cb;
}
function defaultErrorParser(_status, body) {
  if (body && typeof body === "object" && "detail" in body) {
    const detail = body.detail;
    if (typeof detail === "string") {
      return detail;
    }
    if (Array.isArray(detail) && detail.length > 0) {
      const first = detail[0];
      if (first && typeof first.msg === "string") {
        return first.msg;
      }
    }
  }
  return "";
}
function buildQueryString(params) {
  if (!params) {
    return "";
  }
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === void 0 || value === null) {
      continue;
    }
    search.append(key, String(value));
  }
  const serialized = search.toString();
  return serialized.length > 0 ? `?${serialized}` : "";
}
async function parseBody(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const text2 = await response.text();
    return text2.length > 0 ? JSON.parse(text2) : null;
  }
  const text = await response.text();
  return text.length > 0 ? text : null;
}
function createApiClient(config) {
  const apiPrefix = config.apiPrefix ?? "/api/v1";
  const errorParser = config.errorParser ?? defaultErrorParser;
  function buildUrl(path, params) {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    const withPrefix = normalized.startsWith(apiPrefix) ? normalized : `${apiPrefix}${normalized}`;
    return `${config.baseUrl}${withPrefix}${buildQueryString(params)}`;
  }
  async function request(method, path, body, options = {}) {
    const headers = {
      Accept: "application/json",
      ...options.headers
    };
    let serializedBody;
    if (body !== void 0 && body !== null) {
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
    let signal = options.signal;
    let timeoutId;
    let controller;
    if (config.timeout && config.timeout > 0) {
      controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), config.timeout);
      if (options.signal) {
        if (options.signal.aborted) {
          controller.abort();
        } else {
          options.signal.addEventListener("abort", () => controller.abort(), { once: true });
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
        credentials: "same-origin"
      });
      if (response.status === 401 && !options.skipAuthRedirect) {
        if (_authCb) {
          try {
            _authCb();
          } catch {
          }
        }
        config.onUnauthorized?.();
      }
      const parsed = await parseBody(response);
      if (!response.ok) {
        const message = errorParser(response.status, parsed) || response.statusText || "Request failed";
        throw new ApiError(response.status, message, parsed);
      }
      return parsed;
    } finally {
      if (timeoutId !== void 0) {
        clearTimeout(timeoutId);
      }
    }
  }
  return {
    request,
    get(path, options) {
      return request("GET", path, void 0, options);
    },
    post(path, body, options) {
      return request("POST", path, body, options);
    },
    put(path, body, options) {
      return request("PUT", path, body, options);
    },
    patch(path, body, options) {
      return request("PATCH", path, body, options);
    },
    delete(path, options) {
      return request("DELETE", path, void 0, options);
    }
  };
}

// src/auth-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
function createAuthStore(config) {
  if (config.mode === "login") {
    const useAuthStore2 = create()(
      persist(
        (set, get) => ({
          token: null,
          user: null,
          async login(...args) {
            const { token, user } = await config.login(...args);
            config.setToken?.(token);
            set({ token, user });
            config.onLogin?.(user);
          },
          async logout() {
            try {
              await config.logout?.();
            } catch {
            }
            config.setToken?.(null);
            set({ token: null, user: null });
          },
          async fetchMe() {
            const { token } = get();
            if (!token) return;
            try {
              const user = await config.getUser();
              set({ user });
            } catch {
              config.setToken?.(null);
              set({ token: null, user: null });
            }
          }
        }),
        {
          name: config.persistKey ?? "nex-auth",
          // Only persist token + user; actions are recreated by Zustand.
          partialize: (state) => ({ token: state.token, user: state.user })
        }
      )
    );
    registerAuthCallback(() => {
      config.setToken?.(null);
      useAuthStore2.setState({ token: null, user: null });
    });
    const useLogin = () => {
      const login = useAuthStore2((s) => s.login);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const wrapped = async (...args) => {
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
    return { useAuthStore: useAuthStore2, redirectOnUnauthorized: config.redirectOnUnauthorized, useLogin };
  }
  const useAuthStore = create()((set) => ({
    user: null,
    ready: false,
    async probe() {
      try {
        const user = await config.getUser();
        set({ user, ready: true });
      } catch {
        set({ user: null, ready: true });
      }
    },
    clear() {
      set({ user: null });
    }
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

// src/ProtectedRoute.tsx
import { useEffect as useEffect2, useState as useState2 } from "react";
import { Fragment as Fragment3, jsx as jsx11 } from "react/jsx-runtime";
function ProtectedRoute({ authed, validate, isAuthed, redirect, children }) {
  const [ready, setReady] = useState2(false);
  useEffect2(() => {
    if (authed && validate) {
      validate().finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [authed]);
  if (!ready) return null;
  const ok = isAuthed ? isAuthed() : authed;
  return ok ? /* @__PURE__ */ jsx11(Fragment3, { children }) : /* @__PURE__ */ jsx11(Fragment3, { children: redirect });
}

// src/LoginForm.tsx
import { useState as useState3 } from "react";
import { Fragment as Fragment4, jsx as jsx12, jsxs as jsxs5 } from "react/jsx-runtime";
var LABEL_CLS = "block text-sm font-medium text-[var(--color-text-secondary)] mb-1";
function LoginForm({
  fieldLabel = "username",
  onSubmit,
  loading = false,
  error = null,
  onChange,
  autoFocus = false,
  showPasswordToggle = true,
  identityLabel,
  passwordLabel = "Heslo",
  submitLabel = "Prihl\xE1si\u0165 sa",
  loadingLabel = "Prihlasovanie\u2026",
  identityPlaceholder,
  passwordPlaceholder = "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
}) {
  const [username, setUsername] = useState3("");
  const [password, setPassword] = useState3("");
  const [showPwd, setShowPwd] = useState3(false);
  const isEmail = fieldLabel === "email";
  const idLabel = identityLabel ?? (isEmail ? "Email" : "Pou\u017E\xEDvate\u013Esk\xE9 meno");
  const disabled = loading || !username.trim() || !password.trim();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;
    void onSubmit({ username: username.trim(), password });
  };
  const edit = (setter) => (e) => {
    setter(e.target.value);
    onChange?.();
  };
  return /* @__PURE__ */ jsxs5("form", { onSubmit: handleSubmit, noValidate: true, className: "space-y-4", children: [
    /* @__PURE__ */ jsxs5("div", { children: [
      /* @__PURE__ */ jsx12("label", { htmlFor: "login-username", className: LABEL_CLS, children: idLabel }),
      /* @__PURE__ */ jsx12(
        Input,
        {
          id: "login-username",
          type: isEmail ? "email" : "text",
          autoComplete: isEmail ? "email" : "username",
          placeholder: identityPlaceholder,
          value: username,
          onChange: edit(setUsername),
          disabled: loading,
          autoFocus
        }
      )
    ] }),
    /* @__PURE__ */ jsxs5("div", { children: [
      /* @__PURE__ */ jsx12("label", { htmlFor: "login-password", className: LABEL_CLS, children: passwordLabel }),
      /* @__PURE__ */ jsxs5("div", { className: "relative", children: [
        /* @__PURE__ */ jsx12(
          Input,
          {
            id: "login-password",
            type: showPwd ? "text" : "password",
            autoComplete: "current-password",
            placeholder: passwordPlaceholder,
            value: password,
            onChange: edit(setPassword),
            disabled: loading,
            className: showPasswordToggle ? "pr-10" : ""
          }
        ),
        showPasswordToggle && /* @__PURE__ */ jsx12(
          "button",
          {
            type: "button",
            tabIndex: -1,
            onClick: () => setShowPwd((s) => !s),
            className: "absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors",
            children: showPwd ? /* @__PURE__ */ jsx12("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx12("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" }) }) : /* @__PURE__ */ jsxs5("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
              /* @__PURE__ */ jsx12("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }),
              /* @__PURE__ */ jsx12("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })
            ] })
          }
        )
      ] })
    ] }),
    error && /* @__PURE__ */ jsx12("div", { className: "rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400", children: error }),
    /* @__PURE__ */ jsx12(Button, { type: "submit", variant: "primary", disabled, className: "w-full mt-2 gap-2", children: loading ? /* @__PURE__ */ jsxs5(Fragment4, { children: [
      /* @__PURE__ */ jsxs5("svg", { className: "w-4 h-4 animate-spin", fill: "none", viewBox: "0 0 24 24", children: [
        /* @__PURE__ */ jsx12("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
        /* @__PURE__ */ jsx12("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
      ] }),
      loadingLabel
    ] }) : submitLabel })
  ] });
}
export {
  ApiError,
  AppShell,
  Badge,
  Button,
  Card,
  Header,
  Input,
  LoginForm,
  NavItem,
  ProtectedRoute,
  SectionLabel,
  Select,
  Sidebar,
  createApiClient,
  createAuthStore,
  registerAuthCallback
};
