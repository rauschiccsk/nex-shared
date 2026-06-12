// src/Button.tsx
import { jsx } from "react/jsx-runtime";
var BASE = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
var VARIANT = {
  primary: "bg-primary-600 text-white hover:bg-primary-500",
  secondary: "bg-slate-800 text-slate-200 hover:bg-slate-700"
};
var SIZE = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm"
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
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full w-full bg-slate-950", children: [
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
      className: "flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col select-none transition-all duration-200 overflow-x-hidden",
      style: { width: collapsed ? "3.5rem" : "14rem" },
      children: [
        /* @__PURE__ */ jsxs2("div", { className: "px-3 py-3 border-b border-slate-800 flex items-center gap-3 min-h-[56px]", children: [
          !collapsed && logo,
          /* @__PURE__ */ jsx3(
            "button",
            {
              type: "button",
              onClick: onToggleCollapse,
              className: `flex items-center justify-center rounded hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors shrink-0 ${collapsed ? "w-8 h-8" : "w-6 h-6"}`,
              title: collapsed ? expandTitle : collapseTitle,
              children: /* @__PURE__ */ jsx3(IconSidebarToggle, {})
            }
          )
        ] }),
        /* @__PURE__ */ jsx3("nav", { className: "flex-1 p-2 space-y-0.5 overflow-y-auto overflow-x-hidden", children }),
        footer != null && /* @__PURE__ */ jsx3("div", { className: "p-3 border-t border-slate-800", children: footer })
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
  const color = disabled ? "text-slate-600 opacity-40 cursor-not-allowed" : active ? "bg-primary-500/15 text-primary-400" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200";
  const tooltip = disabled ? disabledTitle ?? label : collapsed ? label : void 0;
  const className = `${base} ${px} ${color} relative`;
  const inner = /* @__PURE__ */ jsxs3(Fragment, { children: [
    icon,
    !collapsed && /* @__PURE__ */ jsx4("span", { children: label }),
    badge && /* @__PURE__ */ jsx4(
      "span",
      {
        "aria-label": badgeLabel,
        className: collapsed ? "absolute right-1 top-1 h-2 w-2 rounded-full bg-amber-400" : "ml-auto h-2 w-2 rounded-full bg-amber-400"
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
  return /* @__PURE__ */ jsx5("div", { className: "pt-3 pb-1 px-3 text-[10px] text-slate-700 uppercase tracking-widest font-semibold", children: label });
}

// src/Header.tsx
import { Fragment as Fragment2, jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
function Header({ left, right, children, className = "" }) {
  return /* @__PURE__ */ jsx6(
    "header",
    {
      className: `h-10 flex-shrink-0 bg-slate-900 border-b border-slate-800 flex items-center px-3 gap-3 z-10 select-none ${className}`.trim(),
      children: children ?? /* @__PURE__ */ jsxs4(Fragment2, { children: [
        left,
        right != null && /* @__PURE__ */ jsx6("div", { className: "ml-auto flex items-center gap-3", children: right })
      ] })
    }
  );
}

// src/Input.tsx
import { jsx as jsx7 } from "react/jsx-runtime";
var BASE2 = "w-full bg-slate-800 border rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary-500";
function Input({ invalid, className = "", ...rest }) {
  const border = invalid ? "border-red-500" : "border-slate-700";
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
var BASE3 = "w-full bg-slate-800 border rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary-500";
function Select({ invalid, className = "", children, ...rest }) {
  const border = invalid ? "border-red-500" : "border-slate-700";
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
var BASE4 = "rounded-xl border border-slate-700 bg-slate-900";
function Card({ className = "", children, ...rest }) {
  return /* @__PURE__ */ jsx9("div", { className: `${BASE4} ${className}`.trim(), ...rest, children });
}

// src/Badge.tsx
import { jsx as jsx10 } from "react/jsx-runtime";
var BASE5 = "inline-flex items-center rounded px-1.5 py-0.5 text-xs";
var VARIANT2 = {
  neutral: "bg-slate-800 text-slate-300",
  muted: "bg-slate-600/20 text-slate-300"
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
export {
  ApiError,
  AppShell,
  Badge,
  Button,
  Card,
  Header,
  Input,
  NavItem,
  SectionLabel,
  Select,
  Sidebar,
  createApiClient,
  registerAuthCallback
};
