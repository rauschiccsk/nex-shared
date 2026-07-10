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

// src/Brand.tsx
import { Fragment as Fragment3, jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
function Brand({ initials, name, version, squareClassName = "bg-primary-600" }) {
  return /* @__PURE__ */ jsxs5(Fragment3, { children: [
    /* @__PURE__ */ jsx7(
      "div",
      {
        className: `w-8 h-8 rounded-lg ${squareClassName} flex items-center justify-center text-white font-black text-sm shrink-0`,
        children: initials
      }
    ),
    /* @__PURE__ */ jsxs5("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsx7("div", { className: "text-sm font-bold text-[var(--color-text-primary)] leading-tight", children: name }),
      version != null && version !== "" && // Indigo (brand-tinted) version line — the NEX Studio vzor (primary-400,
      // resolves in both light & dark). All apps converge on this, not Inbox's violet.
      /* @__PURE__ */ jsx7("div", { className: "text-[10px] text-primary-400 font-mono", children: version })
    ] })
  ] });
}

// src/UserCard.tsx
import { Fragment as Fragment4, jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
function UserCard({
  initials,
  name,
  subtitle,
  onLogout,
  logoutTitle = "Odhl\xE1si\u0165 sa"
}) {
  const collapsed = useCollapsed();
  return /* @__PURE__ */ jsxs6("div", { className: `flex items-center gap-2.5 px-2 py-1.5 rounded-lg ${collapsed ? "justify-center" : ""}`, children: [
    /* @__PURE__ */ jsx8("div", { className: "w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold text-white shrink-0", children: initials }),
    !collapsed && /* @__PURE__ */ jsxs6(Fragment4, { children: [
      /* @__PURE__ */ jsxs6("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx8("div", { className: "text-xs font-medium text-[var(--color-text-primary)] truncate", children: name }),
        subtitle != null && subtitle !== "" && /* @__PURE__ */ jsx8("div", { className: "text-[10px] text-[var(--color-text-muted)]", children: subtitle })
      ] }),
      onLogout != null && /* @__PURE__ */ jsx8(
        "button",
        {
          type: "button",
          onClick: onLogout,
          title: logoutTitle,
          className: "shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors",
          children: /* @__PURE__ */ jsxs6(
            "svg",
            {
              className: "w-4 h-4",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              "aria-hidden": "true",
              children: [
                /* @__PURE__ */ jsx8("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
                /* @__PURE__ */ jsx8("polyline", { points: "16 17 21 12 16 7" }),
                /* @__PURE__ */ jsx8("line", { x1: "21", y1: "12", x2: "9", y2: "12" })
              ]
            }
          )
        }
      )
    ] })
  ] });
}

// src/ThemeToggle.tsx
import { jsx as jsx9, jsxs as jsxs7 } from "react/jsx-runtime";
var SunIcon = () => /* @__PURE__ */ jsxs7(
  "svg",
  {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    children: [
      /* @__PURE__ */ jsx9("circle", { cx: "12", cy: "12", r: "4" }),
      /* @__PURE__ */ jsx9("path", { d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" })
    ]
  }
);
var MoonIcon = () => /* @__PURE__ */ jsx9(
  "svg",
  {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    children: /* @__PURE__ */ jsx9("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" })
  }
);
function ThemeToggle({
  theme,
  onToggle,
  toLightLabel = "Prepn\xFA\u0165 na svetl\xFA t\xE9mu",
  toDarkLabel = "Prepn\xFA\u0165 na tmav\xFA t\xE9mu",
  toLightTitle = "Svetl\xE1 t\xE9ma",
  toDarkTitle = "Tmav\xE1 t\xE9ma"
}) {
  const isDark = theme === "dark";
  const label = isDark ? toLightLabel : toDarkLabel;
  const title = isDark ? toLightTitle : toDarkTitle;
  return /* @__PURE__ */ jsx9(
    "button",
    {
      type: "button",
      onClick: onToggle,
      "aria-label": label,
      title,
      className: "p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] transition-colors",
      children: isDark ? /* @__PURE__ */ jsx9(SunIcon, {}) : /* @__PURE__ */ jsx9(MoonIcon, {})
    }
  );
}

// src/NavIcon.tsx
import { jsx as jsx10 } from "react/jsx-runtime";
function NavIcon({ glyph }) {
  return /* @__PURE__ */ jsx10(
    "span",
    {
      "aria-hidden": "true",
      className: "text-base leading-none shrink-0 w-4 inline-flex items-center justify-center",
      children: glyph
    }
  );
}

// src/Input.tsx
import { jsx as jsx11 } from "react/jsx-runtime";
var BASE2 = "w-full bg-[var(--color-surface)] border rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-focus)]";
function Input({ invalid, className = "", ...rest }) {
  const border = invalid ? "border-red-500" : "border-[var(--color-border-default)]";
  return /* @__PURE__ */ jsx11(
    "input",
    {
      className: `${BASE2} ${border} ${className}`.trim(),
      "aria-invalid": invalid || void 0,
      ...rest
    }
  );
}

// src/Select.tsx
import { jsx as jsx12 } from "react/jsx-runtime";
var BASE3 = "w-full bg-[var(--color-surface)] border rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-focus)]";
function Select({ invalid, className = "", children, ...rest }) {
  const border = invalid ? "border-red-500" : "border-[var(--color-border-default)]";
  return /* @__PURE__ */ jsx12(
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
import { jsx as jsx13 } from "react/jsx-runtime";
var BASE4 = "rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)]";
function Card({ className = "", children, ...rest }) {
  return /* @__PURE__ */ jsx13("div", { className: `${BASE4} ${className}`.trim(), ...rest, children });
}

// src/Badge.tsx
import { jsx as jsx14 } from "react/jsx-runtime";
var BASE5 = "inline-flex items-center rounded px-1.5 py-0.5 text-xs";
var VARIANT2 = {
  neutral: "bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]",
  muted: "bg-[var(--color-state-muted-bg)] text-[var(--color-state-muted-fg)]"
};
function Badge({ variant = "neutral", pulse = false, className = "", children, ...rest }) {
  return /* @__PURE__ */ jsx14(
    "span",
    {
      className: `${BASE5} ${VARIANT2[variant]} ${pulse ? "animate-pulse" : ""} ${className}`.replace(/\s+/g, " ").trim(),
      ...rest,
      children
    }
  );
}

// src/StatusBadge.tsx
import { jsx as jsx15 } from "react/jsx-runtime";
var BASE6 = "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium";
var STATUS = {
  success: "bg-[var(--color-state-success-bg)] border-[var(--color-state-success-bg)] text-[var(--color-state-success-fg)]",
  warning: "bg-[var(--color-state-warning-bg)] border-[var(--color-state-warning-bg)] text-[var(--color-state-warning-fg)]",
  error: "bg-[var(--color-state-error-bg)] border-[var(--color-state-error-bg)] text-[var(--color-state-error-fg)]",
  info: "bg-[var(--color-state-info-bg)] border-[var(--color-state-info-bg)] text-[var(--color-state-info-fg)]",
  neutral: "bg-[var(--color-state-muted-bg)] border-[var(--color-state-muted-bg)] text-[var(--color-state-muted-fg)]"
};
function StatusBadge({
  status = "neutral",
  pulse = false,
  className = "",
  children,
  ...rest
}) {
  return /* @__PURE__ */ jsx15(
    "span",
    {
      className: `${BASE6} ${STATUS[status]} ${pulse ? "animate-pulse" : ""} ${className}`.replace(/\s+/g, " ").trim(),
      ...rest,
      children
    }
  );
}

// src/IconButton.tsx
import { jsx as jsx16 } from "react/jsx-runtime";
var BASE7 = "inline-flex items-center justify-center rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
var VARIANT3 = {
  primary: "bg-[var(--color-accent-primary)] text-white hover:bg-[var(--color-accent-primary-hover)]",
  secondary: "bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-active)]",
  danger: "bg-red-600 text-white hover:bg-red-500 active:bg-red-700",
  ghost: "bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]"
};
var SIZE2 = {
  sm: "p-1.5",
  md: "p-2",
  lg: "p-2.5"
};
function IconButton({
  icon,
  variant = "ghost",
  size = "md",
  className = "",
  type = "button",
  ...rest
}) {
  return /* @__PURE__ */ jsx16(
    "button",
    {
      type,
      className: `${BASE7} ${VARIANT3[variant]} ${SIZE2[size]} ${className}`.trim(),
      ...rest,
      children: icon
    }
  );
}

// src/DataTable.tsx
import { jsx as jsx17, jsxs as jsxs8 } from "react/jsx-runtime";
var ALIGN = {
  left: "text-left",
  center: "text-center",
  right: "text-right"
};
function defaultCell(row, key) {
  const value = row[key];
  if (value == null) return null;
  if (typeof value === "string" || typeof value === "number") return value;
  return String(value);
}
function DataTable({
  columns,
  rows,
  getRowKey,
  rowActions,
  rowActionsHeader,
  emptyMessage = "\u017Diadne d\xE1ta",
  className = ""
}) {
  const colCount = columns.length + (rowActions ? 1 : 0);
  return /* @__PURE__ */ jsx17(
    "div",
    {
      className: `rounded-xl border border-[var(--color-border-default)] overflow-hidden ${className}`.trim(),
      children: /* @__PURE__ */ jsxs8("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx17("thead", { className: "bg-[var(--color-surface-hover)]", children: /* @__PURE__ */ jsxs8("tr", { className: "text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]", children: [
          columns.map((col) => /* @__PURE__ */ jsx17(
            "th",
            {
              className: `px-4 py-2.5 font-semibold ${ALIGN[col.align ?? "left"]}`,
              children: col.header
            },
            col.key
          )),
          rowActions && /* @__PURE__ */ jsx17("th", { className: "px-4 py-2.5 font-semibold text-right", children: rowActionsHeader })
        ] }) }),
        /* @__PURE__ */ jsxs8("tbody", { className: "divide-y divide-[var(--color-border-default)]", children: [
          rows.map((row) => /* @__PURE__ */ jsxs8(
            "tr",
            {
              className: "hover:bg-[var(--color-surface-hover)] transition-colors",
              children: [
                columns.map((col) => /* @__PURE__ */ jsx17(
                  "td",
                  {
                    className: `px-4 py-3 text-[var(--color-text-secondary)] ${ALIGN[col.align ?? "left"]} ${col.className ?? ""}`.trim(),
                    children: col.render ? col.render(row) : defaultCell(row, col.key)
                  },
                  col.key
                )),
                rowActions && /* @__PURE__ */ jsx17("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsx17("div", { className: "flex items-center justify-end gap-2", children: rowActions(row) }) })
              ]
            },
            getRowKey(row)
          )),
          rows.length === 0 && /* @__PURE__ */ jsx17("tr", { children: /* @__PURE__ */ jsx17(
            "td",
            {
              colSpan: colCount,
              className: "px-4 py-6 text-center text-xs text-[var(--color-text-muted)]",
              children: emptyMessage
            }
          ) })
        ] })
      ] })
    }
  );
}

// src/FormGrid.tsx
import { Fragment as Fragment5, jsx as jsx18, jsxs as jsxs9 } from "react/jsx-runtime";
var GRID_COLS = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2"
};
function FormGrid({ columns = 2, className = "", children, ...rest }) {
  return /* @__PURE__ */ jsx18("div", { className: `grid ${GRID_COLS[columns]} gap-3 ${className}`.trim(), ...rest, children });
}
function FormField({
  label,
  htmlFor,
  required = false,
  hint,
  error,
  full = false,
  children
}) {
  return /* @__PURE__ */ jsxs9("div", { className: full ? "md:col-span-2" : void 0, children: [
    /* @__PURE__ */ jsxs9("label", { htmlFor, className: "block text-xs text-[var(--color-text-muted)] mb-1", children: [
      label,
      required && /* @__PURE__ */ jsx18("span", { className: "text-[var(--color-status-error)]", children: " *" })
    ] }),
    children,
    error ? /* @__PURE__ */ jsx18("div", { className: "mt-1 text-[10px] text-[var(--color-status-error)]", children: error }) : hint ? /* @__PURE__ */ jsx18("div", { className: "mt-1 text-[10px] text-[var(--color-text-muted)]", children: hint }) : null
  ] });
}
function FormActions({
  children,
  submitLabel,
  onSubmit,
  cancelLabel,
  onCancel,
  submitDisabled = false,
  className = ""
}) {
  return /* @__PURE__ */ jsx18("div", { className: `flex gap-2 justify-end ${className}`.trim(), children: children ?? /* @__PURE__ */ jsxs9(Fragment5, { children: [
    cancelLabel != null && /* @__PURE__ */ jsx18(Button, { variant: "secondary", size: "sm", onClick: onCancel, children: cancelLabel }),
    submitLabel != null && /* @__PURE__ */ jsx18(Button, { variant: "primary", size: "sm", onClick: onSubmit, disabled: submitDisabled, children: submitLabel })
  ] }) });
}

// src/ReleaseNotes.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// src/CodeBlock.tsx
import { useCallback, useState } from "react";
import { Fragment as Fragment6, jsx as jsx19, jsxs as jsxs10 } from "react/jsx-runtime";
var COPY_FEEDBACK_DURATION_MS = 2e3;
function useCopyToClipboard(resetDelay = COPY_FEEDBACK_DURATION_MS) {
  const [isCopied, setIsCopied] = useState(false);
  const copy = useCallback(
    async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), resetDelay);
      } catch {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), resetDelay);
      }
    },
    [resetDelay]
  );
  return [copy, isCopied];
}
function CodeBlock({ children, language }) {
  const [copy, isCopied] = useCopyToClipboard();
  const code = String(children).replace(/\n$/, "");
  return /* @__PURE__ */ jsxs10("div", { className: "relative my-3", children: [
    /* @__PURE__ */ jsxs10("div", { className: "flex items-center justify-between bg-[var(--color-surface)] px-3 py-1.5 rounded-t border border-[var(--color-border-default)] border-b-0", children: [
      /* @__PURE__ */ jsx19("span", { className: "text-xs text-[var(--color-text-secondary)]", children: language || "code" }),
      /* @__PURE__ */ jsx19(
        "button",
        {
          onClick: () => copy(code),
          className: "flex items-center gap-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors",
          children: isCopied ? /* @__PURE__ */ jsxs10(Fragment6, { children: [
            /* @__PURE__ */ jsx19(
              "svg",
              {
                className: "w-3.5 h-3.5 text-[var(--color-status-success)]",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx19(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M5 13l4 4L19 7"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx19("span", { className: "text-[var(--color-status-success)]", children: "Skop\xEDrovan\xE9" })
          ] }) : /* @__PURE__ */ jsxs10(Fragment6, { children: [
            /* @__PURE__ */ jsx19(
              "svg",
              {
                className: "w-3.5 h-3.5",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx19(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx19("span", { children: "Kop\xEDrova\u0165" })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsx19("pre", { className: "bg-[var(--color-canvas)] p-3 rounded-b border border-[var(--color-border-default)] border-t-0 overflow-x-auto m-0", children: /* @__PURE__ */ jsx19("code", { className: `text-sm ${language ? `language-${language}` : ""}`, children: code }) })
  ] });
}

// src/ReleaseNotes.tsx
import { Fragment as Fragment7, jsx as jsx20, jsxs as jsxs11 } from "react/jsx-runtime";
function formatDate(iso) {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(d);
}
function MarkdownBody({ children }) {
  const body = children.replace(/^\s*##\s+\S.*(?:\r?\n)+/, "");
  return /* @__PURE__ */ jsx20(
    "div",
    {
      className: "prose prose-base dark:prose-invert max-w-none\n        prose-headings:font-semibold\n        prose-h3:text-primary-500 prose-h3:text-base prose-h3:mt-5 prose-h3:mb-1\n        prose-p:text-[var(--color-text-secondary)] prose-p:leading-relaxed\n        prose-strong:text-[var(--color-text-primary)]\n        prose-li:text-[var(--color-text-secondary)] prose-li:marker:text-primary-500",
      children: /* @__PURE__ */ jsx20(
        ReactMarkdown,
        {
          remarkPlugins: [remarkGfm],
          components: {
            code({ className, children: children2, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const isInline = !className && typeof children2 === "string" && !children2.includes("\n");
              if (!isInline && match) {
                return /* @__PURE__ */ jsx20(CodeBlock, { language: match[1], children: String(children2) });
              }
              if (!isInline && typeof children2 === "string" && children2.includes("\n")) {
                return /* @__PURE__ */ jsx20(CodeBlock, { children: String(children2) });
              }
              return /* @__PURE__ */ jsx20(
                "code",
                {
                  className: "bg-[var(--color-surface)] px-1.5 py-0.5 rounded text-sm",
                  ...props,
                  children: children2
                }
              );
            },
            pre({ children: children2 }) {
              return /* @__PURE__ */ jsx20(Fragment7, { children: children2 });
            }
          },
          children: body
        }
      )
    }
  );
}
function VersionCard({ note, defaultOpen }) {
  const date = formatDate(note.released_at);
  return /* @__PURE__ */ jsx20(Card, { className: "p-0 overflow-hidden", children: /* @__PURE__ */ jsxs11("details", { open: defaultOpen, className: "group", children: [
    /* @__PURE__ */ jsxs11("summary", { className: "flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none list-none hover:bg-[var(--color-surface-hover)] transition-colors", children: [
      /* @__PURE__ */ jsxs11("span", { className: "flex items-baseline gap-2", children: [
        /* @__PURE__ */ jsx20("span", { className: "text-base font-bold text-primary-500", children: note.version }),
        date && /* @__PURE__ */ jsxs11("span", { className: "text-sm text-[var(--color-text-muted)]", children: [
          "\u2014 ",
          date
        ] })
      ] }),
      /* @__PURE__ */ jsx20(
        "svg",
        {
          className: "w-4 h-4 shrink-0 text-[var(--color-text-muted)] transition-transform group-open:rotate-180",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsx20(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M19 9l-7 7-7-7"
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsx20("div", { className: "px-4 pb-4 pt-1 border-t border-[var(--color-border-default)]", children: /* @__PURE__ */ jsx20(MarkdownBody, { children: note.markdown }) })
  ] }) });
}
function ReleaseNotes({
  notes,
  loading = false,
  error = null,
  onDismissError,
  appName
}) {
  return /* @__PURE__ */ jsxs11("div", { className: "p-6 max-w-5xl mx-auto", children: [
    /* @__PURE__ */ jsxs11("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsxs11("h1", { className: "flex items-center gap-2 text-lg font-semibold text-[var(--color-text-primary)]", children: [
        /* @__PURE__ */ jsx20("span", { "aria-hidden": "true", className: "text-primary-500 leading-none", children: "\u2728" }),
        "Aktualiz\xE1cie"
      ] }),
      /* @__PURE__ */ jsxs11("p", { className: "mt-1 text-sm text-[var(--color-text-secondary)]", children: [
        "\u010Co je nov\xE9 v jednotliv\xFDch verzi\xE1ch",
        appName ? ` ${appName}` : "",
        "."
      ] })
    ] }),
    error && /* @__PURE__ */ jsxs11("div", { className: "mb-4 px-3 py-2 rounded-lg bg-[var(--color-state-error-bg)] text-[var(--color-state-error-fg)] text-sm flex items-center justify-between", children: [
      /* @__PURE__ */ jsx20("span", { className: "truncate", children: error }),
      /* @__PURE__ */ jsx20(
        "button",
        {
          onClick: onDismissError,
          className: "ml-2 hover:opacity-80",
          "aria-label": "Zavrie\u0165",
          children: /* @__PURE__ */ jsx20(
            "svg",
            {
              className: "w-3.5 h-3.5",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              children: /* @__PURE__ */ jsx20(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M6 18L18 6M6 6l12 12"
                }
              )
            }
          )
        }
      )
    ] }),
    loading ? /* @__PURE__ */ jsxs11("div", { className: "flex items-center gap-2 py-10 justify-center text-[var(--color-text-secondary)] text-sm", children: [
      /* @__PURE__ */ jsx20(
        "svg",
        {
          className: "w-4 h-4 animate-spin",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsx20(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            }
          )
        }
      ),
      " ",
      "Na\u010D\xEDtavam\u2026"
    ] }) : notes.length === 0 ? /* @__PURE__ */ jsx20("div", { className: "rounded-xl border border-dashed border-[var(--color-border-default)] p-10 text-center text-sm text-[var(--color-text-muted)]", children: "Zatia\u013E \u017Eiadne aktualiz\xE1cie." }) : /* @__PURE__ */ jsx20("div", { className: "flex flex-col gap-3", children: notes.map((note, i) => /* @__PURE__ */ jsx20(VersionCard, { note, defaultOpen: i === 0 }, note.version)) })
  ] });
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
import { useEffect, useState as useState2 } from "react";
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
      const [loading, setLoading] = useState2(false);
      const [error, setError] = useState2(null);
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
import { useEffect as useEffect2, useState as useState3 } from "react";
import { Fragment as Fragment8, jsx as jsx21 } from "react/jsx-runtime";
function ProtectedRoute({ authed, validate, isAuthed, redirect, children }) {
  const [ready, setReady] = useState3(false);
  useEffect2(() => {
    if (authed && validate) {
      validate().finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [authed]);
  if (!ready) return null;
  const ok = isAuthed ? isAuthed() : authed;
  return ok ? /* @__PURE__ */ jsx21(Fragment8, { children }) : /* @__PURE__ */ jsx21(Fragment8, { children: redirect });
}

// src/LoginForm.tsx
import { useState as useState4 } from "react";
import { Fragment as Fragment9, jsx as jsx22, jsxs as jsxs12 } from "react/jsx-runtime";
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
  const [username, setUsername] = useState4("");
  const [password, setPassword] = useState4("");
  const [showPwd, setShowPwd] = useState4(false);
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
  return /* @__PURE__ */ jsxs12("form", { onSubmit: handleSubmit, noValidate: true, className: "space-y-4", children: [
    /* @__PURE__ */ jsxs12("div", { children: [
      /* @__PURE__ */ jsx22("label", { htmlFor: "login-username", className: LABEL_CLS, children: idLabel }),
      /* @__PURE__ */ jsx22(
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
    /* @__PURE__ */ jsxs12("div", { children: [
      /* @__PURE__ */ jsx22("label", { htmlFor: "login-password", className: LABEL_CLS, children: passwordLabel }),
      /* @__PURE__ */ jsxs12("div", { className: "relative", children: [
        /* @__PURE__ */ jsx22(
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
        showPasswordToggle && /* @__PURE__ */ jsx22(
          "button",
          {
            type: "button",
            tabIndex: -1,
            onClick: () => setShowPwd((s) => !s),
            className: "absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors",
            children: showPwd ? /* @__PURE__ */ jsx22("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx22("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" }) }) : /* @__PURE__ */ jsxs12("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
              /* @__PURE__ */ jsx22("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }),
              /* @__PURE__ */ jsx22("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })
            ] })
          }
        )
      ] })
    ] }),
    error && /* @__PURE__ */ jsx22("div", { className: "rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400", children: error }),
    /* @__PURE__ */ jsx22(Button, { type: "submit", variant: "primary", disabled, className: "w-full mt-2 gap-2", children: loading ? /* @__PURE__ */ jsxs12(Fragment9, { children: [
      /* @__PURE__ */ jsxs12("svg", { className: "w-4 h-4 animate-spin", fill: "none", viewBox: "0 0 24 24", children: [
        /* @__PURE__ */ jsx22("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
        /* @__PURE__ */ jsx22("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
      ] }),
      loadingLabel
    ] }) : submitLabel })
  ] });
}

// src/SettingsShell.tsx
import { useState as useState5 } from "react";
import { jsx as jsx23, jsxs as jsxs13 } from "react/jsx-runtime";
var DEFAULT_TAB_LABELS = {
  system: "Syst\xE9m",
  agents: "Agenti",
  users: "Pou\u017E\xEDvatelia",
  sessions: "Rel\xE1cie"
};
function SettingsShell({
  config,
  currentUserRole,
  panels,
  title = "Nastavenia",
  headerRight
}) {
  const visibleTabs = config.tabs.filter(
    (t) => !config.tabVisibleForRole || config.tabVisibleForRole(t, currentUserRole)
  );
  const [tab, setTab] = useState5(visibleTabs[0]);
  const activeTab = tab && visibleTabs.includes(tab) ? tab : visibleTabs[0];
  return /* @__PURE__ */ jsxs13("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxs13("div", { className: "flex-shrink-0 px-6 py-4 border-b border-[var(--color-border-default)] flex items-center justify-between", children: [
      /* @__PURE__ */ jsx23("h1", { className: "text-base font-bold text-[var(--color-text-primary)]", children: title }),
      headerRight
    ] }),
    /* @__PURE__ */ jsx23("div", { className: "flex-shrink-0 flex gap-0 border-b border-[var(--color-border-default)] px-6", children: visibleTabs.map((t) => /* @__PURE__ */ jsx23(
      "button",
      {
        type: "button",
        onClick: () => setTab(t),
        className: `px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === t ? "border-primary-500 text-primary-400" : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"}`,
        children: config.labels[t] ?? DEFAULT_TAB_LABELS[t]
      },
      t
    )) }),
    /* @__PURE__ */ jsx23("div", { className: "flex-1 overflow-y-auto", children: activeTab != null && panels[activeTab] })
  ] });
}

// src/SystemSettingsPanel.tsx
import { useEffect as useEffect3, useMemo, useState as useState6 } from "react";
import { Fragment as Fragment10, jsx as jsx24, jsxs as jsxs14 } from "react/jsx-runtime";
function inputTypeFor(valueType) {
  if (valueType === "int" || valueType === "float") return "number";
  if (valueType === "bool") return "checkbox";
  return "text";
}
var OTHER_CATEGORY = {
  id: "other",
  label: "Ostatn\xE9",
  description: "",
  prefixes: []
};
function SystemSettingsPanel({
  settings,
  categories,
  canEdit,
  onSave,
  loading = false,
  loadError = ""
}) {
  const [drafts, setDrafts] = useState6({});
  const [savingKey, setSavingKey] = useState6(null);
  const [saveErrors, setSaveErrors] = useState6({});
  const [flashKey, setFlashKey] = useState6(null);
  useEffect3(() => {
    setDrafts((prev) => {
      const next = { ...prev };
      for (const s of settings) if (!(s.key in next)) next[s.key] = s.value;
      return next;
    });
  }, [settings]);
  function classifyKey(key) {
    for (const cat of categories) {
      if (cat.prefixes.some((p) => key.startsWith(p))) return cat.id;
    }
    return OTHER_CATEGORY.id;
  }
  const groupedSettings = useMemo(() => {
    const groups = {};
    for (const s of settings) {
      const catId = classifyKey(s.key);
      (groups[catId] ||= []).push(s);
    }
    for (const list of Object.values(groups)) {
      list.sort((a, b) => a.key.localeCompare(b.key));
    }
    return groups;
  }, [settings, categories]);
  async function handleSaveSetting(key) {
    const draft = (drafts[key] ?? "").toString();
    if (!draft.trim() && draft !== "0" && draft.toLowerCase() !== "false") return;
    setSavingKey(key);
    setSaveErrors((prev) => ({ ...prev, [key]: "" }));
    try {
      const updated = await onSave(key, draft);
      setDrafts((prev) => ({ ...prev, [key]: updated.value }));
      setFlashKey(key);
      setTimeout(() => setFlashKey((k) => k === key ? null : k), 2e3);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Nezn\xE1ma chyba.";
      setSaveErrors((prev) => ({ ...prev, [key]: msg }));
    } finally {
      setSavingKey(null);
    }
  }
  return /* @__PURE__ */ jsxs14("div", { className: "p-6 max-w-3xl", children: [
    /* @__PURE__ */ jsx24("h2", { className: "text-sm font-semibold text-[var(--color-text-secondary)] mb-1", children: "Syst\xE9mov\xE9 nastavenia" }),
    /* @__PURE__ */ jsxs14("p", { className: "text-xs text-[var(--color-text-muted)] mb-4", children: [
      "Runtime-mutable nastavenia. ",
      canEdit ? "Zmeny sa prejavia do 30 s (intern\xE1 cache TTL)." : "Read-only \u2014 ch\xFDba opr\xE1vnenie na \xFApravu."
    ] }),
    loadError && /* @__PURE__ */ jsx24("div", { className: "rounded-lg border border-[var(--color-state-error-bg)] bg-[var(--color-state-error-bg)] px-3 py-2 text-xs text-[var(--color-state-error-fg)] mb-4", children: loadError }),
    loading && !loadError && /* @__PURE__ */ jsx24("div", { className: "text-xs text-[var(--color-text-muted)]", children: "Na\u010D\xEDtavam\u2026" }),
    !loading && !loadError && /* @__PURE__ */ jsxs14("div", { className: "space-y-6", children: [
      [...categories, OTHER_CATEGORY].map((cat) => {
        const rows = groupedSettings[cat.id] ?? [];
        if (rows.length === 0) return null;
        return /* @__PURE__ */ jsxs14("section", { children: [
          /* @__PURE__ */ jsx24("h3", { className: "text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest mb-1", children: cat.label }),
          cat.description && /* @__PURE__ */ jsx24("p", { className: "text-[11px] text-[var(--color-text-muted)] mb-2", children: cat.description }),
          /* @__PURE__ */ jsx24("div", { className: "rounded-lg border border-[var(--color-border-default)] bg-[var(--color-canvas)] divide-y divide-[var(--color-border-default)]", children: rows.map((s) => {
            const draft = drafts[s.key] ?? s.value;
            const dirty = draft !== s.value;
            const inputType = inputTypeFor(s.value_type);
            const saving = savingKey === s.key;
            const err = saveErrors[s.key];
            return /* @__PURE__ */ jsxs14("div", { className: "p-4", children: [
              /* @__PURE__ */ jsxs14("div", { className: "flex items-start justify-between gap-4 mb-1", children: [
                /* @__PURE__ */ jsxs14("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsx24("div", { className: s.label ? "text-sm font-medium text-[var(--color-text-primary)]" : "text-sm font-medium text-[var(--color-text-primary)] font-mono", children: s.label || s.key }),
                  s.label && /* @__PURE__ */ jsx24("div", { className: "text-[10px] text-[var(--color-text-muted)] font-mono mt-0.5", children: s.key }),
                  /* @__PURE__ */ jsx24("div", { className: "text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest mt-0.5", children: s.value_type })
                ] }),
                canEdit && /* @__PURE__ */ jsx24(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleSaveSetting(s.key),
                    disabled: saving || !dirty,
                    className: "shrink-0 px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed rounded transition-colors",
                    children: saving ? "Uklad\xE1m\u2026" : dirty ? "Ulo\u017Ei\u0165" : "Ulo\u017Een\xE9"
                  }
                )
              ] }),
              s.description && /* @__PURE__ */ jsx24("p", { className: "text-xs text-[var(--color-text-muted)] mb-2 leading-relaxed", children: s.description }),
              inputType === "checkbox" ? /* @__PURE__ */ jsxs14("label", { className: "flex items-center gap-2 text-xs text-[var(--color-text-secondary)]", children: [
                /* @__PURE__ */ jsx24(
                  "input",
                  {
                    type: "checkbox",
                    checked: draft.toLowerCase() === "true" || draft === "1",
                    onChange: (e) => setDrafts((prev) => ({ ...prev, [s.key]: e.target.checked ? "true" : "false" })),
                    disabled: !canEdit,
                    className: "rounded border-[var(--color-border-default)] bg-[var(--color-surface)] text-primary-500 focus:ring-primary-500 disabled:opacity-50"
                  }
                ),
                /* @__PURE__ */ jsx24("span", { className: "font-mono", children: draft })
              ] }) : /* @__PURE__ */ jsxs14("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx24(
                  "input",
                  {
                    type: inputType,
                    value: draft,
                    onChange: (e) => setDrafts((prev) => ({ ...prev, [s.key]: e.target.value })),
                    disabled: !canEdit,
                    step: s.value_type === "float" ? "any" : void 0,
                    className: "w-full bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded px-3 py-1.5 text-xs text-[var(--color-text-primary)] font-mono focus:outline-none focus:border-primary-500 disabled:opacity-50"
                  }
                ),
                s.unit && /* @__PURE__ */ jsx24("span", { className: "shrink-0 text-xs text-[var(--color-text-muted)]", children: s.unit })
              ] }),
              /* @__PURE__ */ jsxs14("div", { className: "mt-2 text-[11px] flex items-center gap-2 flex-wrap", children: [
                s.is_default ? /* @__PURE__ */ jsx24("span", { className: "text-[var(--color-text-muted)]", children: "Predvolen\xE1 hodnota." }) : /* @__PURE__ */ jsxs14("span", { className: "text-[var(--color-text-muted)]", children: [
                  "Ulo\u017Een\xFD override",
                  s.updated_by_username && /* @__PURE__ */ jsxs14(Fragment10, { children: [
                    " \u2014 ",
                    /* @__PURE__ */ jsx24("span", { className: "text-[var(--color-text-secondary)] font-medium", children: s.updated_by_username })
                  ] }),
                  s.updated_at && /* @__PURE__ */ jsxs14(Fragment10, { children: [
                    " \xB7 ",
                    new Date(s.updated_at).toLocaleString("sk-SK")
                  ] })
                ] }),
                flashKey === s.key && /* @__PURE__ */ jsx24("span", { className: "text-[var(--color-status-success)]", children: "\u2713 Ulo\u017Een\xE9" }),
                err && /* @__PURE__ */ jsx24("span", { className: "text-[var(--color-status-error)]", children: err })
              ] })
            ] }, s.key);
          }) })
        ] }, cat.id);
      }),
      !canEdit && /* @__PURE__ */ jsx24("p", { className: "text-[11px] text-[var(--color-text-muted)] italic", children: "Read-only \u2014 na \xFApravu ch\xFDba opr\xE1vnenie." })
    ] })
  ] });
}

// src/AgentsPanel.tsx
import { useEffect as useEffect4, useState as useState7 } from "react";
import { jsx as jsx25, jsxs as jsxs15 } from "react/jsx-runtime";
function seedState(roles, drafts) {
  const out = {};
  for (const r of roles) {
    const d = drafts[r.id];
    out[r.id] = { model: d?.model ?? "", effort: d?.effort ?? "", helperModel: d?.helperModel ?? "" };
  }
  return out;
}
function AgentsPanel({
  roles,
  models,
  efforts,
  drafts,
  onSave,
  helperModels,
  helperModelRoleIds = [],
  loading = false,
  loadError = "",
  saveErrors = {}
}) {
  const [edit, setEdit] = useState7(() => seedState(roles, drafts));
  const [savingRole, setSavingRole] = useState7(null);
  const [flashRole, setFlashRole] = useState7(null);
  const showHelperModel = (roleId) => Boolean(helperModels && helperModels.length > 0 && helperModelRoleIds.includes(roleId));
  useEffect4(() => {
    setEdit(seedState(roles, drafts));
  }, [roles, drafts]);
  async function handleSave(roleId) {
    const draft = edit[roleId] ?? { model: "", effort: "", helperModel: "" };
    setSavingRole(roleId);
    try {
      await onSave(roleId, draft);
      setFlashRole(roleId);
      setTimeout(() => setFlashRole((r) => r === roleId ? null : r), 2e3);
    } catch {
    } finally {
      setSavingRole(null);
    }
  }
  return /* @__PURE__ */ jsxs15("div", { className: "p-6 max-w-3xl", children: [
    /* @__PURE__ */ jsx25("h2", { className: "text-sm font-semibold text-[var(--color-text-secondary)] mb-1", children: "Agenti \u2014 model a effort" }),
    /* @__PURE__ */ jsxs15("p", { className: "text-xs text-[var(--color-text-muted)] mb-4", children: [
      "Per-rola konfigur\xE1cia modelu (",
      /* @__PURE__ */ jsx25("code", { children: "--model" }),
      ") a \xFArovne (",
      /* @__PURE__ */ jsx25("code", { children: "--effort" }),
      "). Nenastaven\xE9 pole = predvolen\xE9 spr\xE1vanie (CLI default)."
    ] }),
    loadError && /* @__PURE__ */ jsx25("div", { className: "rounded-lg border border-[var(--color-state-error-bg)] bg-[var(--color-state-error-bg)] px-3 py-2 text-xs text-[var(--color-state-error-fg)] mb-4", children: loadError }),
    loading && !loadError && /* @__PURE__ */ jsx25("div", { className: "text-xs text-[var(--color-text-muted)]", children: "Na\u010D\xEDtavam\u2026" }),
    !loading && !loadError && /* @__PURE__ */ jsx25("div", { className: "rounded-lg border border-[var(--color-border-default)] bg-[var(--color-canvas)] divide-y divide-[var(--color-border-default)]", children: roles.map((r) => {
      const draft = edit[r.id] ?? { model: "", effort: "", helperModel: "" };
      const saving = savingRole === r.id;
      const err = saveErrors[r.id];
      return /* @__PURE__ */ jsxs15("div", { className: "p-4", children: [
        /* @__PURE__ */ jsxs15("div", { className: "flex items-start justify-between gap-4 mb-2", children: [
          /* @__PURE__ */ jsx25("div", { className: "text-sm font-medium text-[var(--color-text-primary)]", children: r.label }),
          /* @__PURE__ */ jsx25(
            "button",
            {
              type: "button",
              onClick: () => handleSave(r.id),
              disabled: saving,
              className: "shrink-0 px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed rounded transition-colors",
              children: saving ? "Uklad\xE1m\u2026" : "Ulo\u017Ei\u0165"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs15("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs15("label", { className: "block", children: [
            /* @__PURE__ */ jsx25("span", { className: "text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest", children: "Model" }),
            /* @__PURE__ */ jsxs15(
              "select",
              {
                value: draft.model,
                onChange: (e) => setEdit((prev) => ({ ...prev, [r.id]: { ...draft, model: e.target.value } })),
                className: "mt-1 w-full bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded px-3 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-primary-500",
                children: [
                  /* @__PURE__ */ jsx25("option", { value: "", children: "\u2014 Predvolen\xFD \u2014" }),
                  models.map((m) => /* @__PURE__ */ jsx25("option", { value: m.id, children: m.label }, m.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs15("label", { className: "block", children: [
            /* @__PURE__ */ jsx25("span", { className: "text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest", children: "\xDArove\u0148" }),
            /* @__PURE__ */ jsxs15(
              "select",
              {
                value: draft.effort,
                onChange: (e) => setEdit((prev) => ({ ...prev, [r.id]: { ...draft, effort: e.target.value } })),
                className: "mt-1 w-full bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded px-3 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-primary-500",
                children: [
                  /* @__PURE__ */ jsx25("option", { value: "", children: "\u2014 Predvolen\xFD \u2014" }),
                  efforts.map((ef) => /* @__PURE__ */ jsx25("option", { value: ef, children: ef }, ef))
                ]
              }
            )
          ] })
        ] }),
        showHelperModel(r.id) && /* @__PURE__ */ jsxs15("label", { className: "block mt-3", children: [
          /* @__PURE__ */ jsx25("span", { className: "text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest", children: "Model pomocn\xEDkov" }),
          /* @__PURE__ */ jsxs15(
            "select",
            {
              value: draft.helperModel ?? "",
              onChange: (e) => setEdit((prev) => ({ ...prev, [r.id]: { ...draft, helperModel: e.target.value } })),
              className: "mt-1 w-full bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded px-3 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-primary-500",
              children: [
                /* @__PURE__ */ jsx25("option", { value: "", children: "\u2014 Predvolen\xFD (lacn\xFD/r\xFDchly) \u2014" }),
                (helperModels ?? []).map((m) => /* @__PURE__ */ jsx25("option", { value: m.id, children: m.label }, m.id))
              ]
            }
          ),
          /* @__PURE__ */ jsx25("span", { className: "mt-1 block text-[10px] text-[var(--color-text-muted)]", children: "Model dynamick\xFDch pomocn\xEDkov pre paraleln\xFA/hromadn\xFA pr\xE1cu. Predvolene lacn\xFD/r\xFDchly; zv\xFD\u0161 na siln\xFD len pre prioritn\xFD build (drah\u0161ie tokeny)." })
        ] }),
        /* @__PURE__ */ jsxs15("div", { className: "mt-2 text-[11px] flex items-center gap-2", children: [
          flashRole === r.id && /* @__PURE__ */ jsx25("span", { className: "text-[var(--color-status-success)]", children: "\u2713 Ulo\u017Een\xE9" }),
          err && /* @__PURE__ */ jsx25("span", { className: "text-[var(--color-status-error)]", children: err })
        ] })
      ] }, r.id);
    }) })
  ] });
}

// src/UsersPanel.tsx
import { useMemo as useMemo2, useState as useState9 } from "react";

// src/UserForm.tsx
import { useState as useState8 } from "react";
import { Fragment as Fragment11, jsx as jsx26, jsxs as jsxs16 } from "react/jsx-runtime";
function initialFromUser(user, roleOptions) {
  return {
    username: user?.username ?? "",
    email: user?.email ?? "",
    password: "",
    role: user?.role ?? roleOptions[0]?.value ?? "",
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    telegram_chat_id: user?.telegram_chat_id ?? "",
    is_active: user?.is_active ?? true
  };
}
function UserForm({
  mode,
  initial,
  roleOptions,
  fieldSchema,
  submitting,
  error,
  onSubmit,
  onCancel
}) {
  const isEdit = mode === "edit";
  const minLen = fieldSchema.passwordMinLength;
  const [data, setData] = useState8(
    () => initialFromUser(initial, roleOptions)
  );
  const passwordTooShort = data.password.length > 0 && data.password.length < minLen;
  const emailShown = fieldSchema.email !== false;
  const usernameRequired = !isEdit && fieldSchema.username;
  const submitDisabled = submitting || emailShown && !data.email || usernameRequired && !data.username || !isEdit && !data.password || passwordTooShort;
  const submitLabel = isEdit ? submitting ? "Uklad\xE1m\u2026" : "Ulo\u017Ei\u0165" : submitting ? "Vytv\xE1ram\u2026" : "Vytvori\u0165";
  function update(key, value) {
    setData((prev) => ({ ...prev, [key]: value }));
  }
  function handleSubmit() {
    if (submitDisabled) return;
    void onSubmit(data);
  }
  return /* @__PURE__ */ jsxs16(Card, { className: "mt-4 p-4", children: [
    /* @__PURE__ */ jsx26("h3", { className: "text-sm font-semibold text-[var(--color-text-secondary)] mb-3", children: isEdit ? /* @__PURE__ */ jsxs16(Fragment11, { children: [
      "Upravi\u0165 pou\u017E\xEDvate\u013Ea \xB7",
      " ",
      /* @__PURE__ */ jsx26("span", { className: "font-mono text-[var(--color-text-secondary)]", children: initial?.username })
    ] }) : "Vytvori\u0165 pou\u017E\xEDvate\u013Ea" }),
    error && /* @__PURE__ */ jsx26("div", { className: "mb-3 text-xs text-[var(--color-state-error-fg)] rounded bg-[var(--color-state-error-bg)] border border-[var(--color-state-error-bg)] px-3 py-2", children: error }),
    /* @__PURE__ */ jsxs16("div", { className: "grid grid-cols-2 gap-3 mb-3", children: [
      fieldSchema.names && /* @__PURE__ */ jsxs16(Fragment11, { children: [
        /* @__PURE__ */ jsxs16("div", { children: [
          /* @__PURE__ */ jsx26("label", { htmlFor: "uf-first-name", className: "block text-xs text-[var(--color-text-muted)] mb-1", children: "Meno" }),
          /* @__PURE__ */ jsx26(
            Input,
            {
              id: "uf-first-name",
              type: "text",
              value: data.first_name,
              onChange: (e) => update("first_name", e.target.value),
              placeholder: "napr. Tibor"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs16("div", { children: [
          /* @__PURE__ */ jsx26("label", { htmlFor: "uf-last-name", className: "block text-xs text-[var(--color-text-muted)] mb-1", children: "Priezvisko" }),
          /* @__PURE__ */ jsx26(
            Input,
            {
              id: "uf-last-name",
              type: "text",
              value: data.last_name,
              onChange: (e) => update("last_name", e.target.value),
              placeholder: "napr. Rausch"
            }
          )
        ] })
      ] }),
      fieldSchema.username && /* @__PURE__ */ jsxs16("div", { children: [
        /* @__PURE__ */ jsxs16("label", { htmlFor: "uf-username", className: "block text-xs text-[var(--color-text-muted)] mb-1", children: [
          "Pou\u017E\xEDvate\u013Esk\xE9 meno ",
          isEdit ? "" : "*"
        ] }),
        /* @__PURE__ */ jsx26(
          "input",
          {
            id: "uf-username",
            type: "text",
            value: data.username,
            onChange: (e) => update("username", e.target.value),
            disabled: isEdit,
            title: isEdit ? "Pou\u017E\xEDvate\u013Esk\xE9 meno sa po vytvoren\xED nemen\xED (zachov\xE1va login stabilitu)." : void 0,
            placeholder: "napr. tibi",
            className: `w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary-500 ${isEdit ? "bg-[var(--color-surface-hover)] border-[var(--color-border-default)] text-[var(--color-text-muted)] cursor-not-allowed" : "bg-[var(--color-surface)] border-[var(--color-border-default)] text-[var(--color-text-primary)]"}`
          }
        )
      ] }),
      emailShown && /* @__PURE__ */ jsxs16("div", { children: [
        /* @__PURE__ */ jsx26("label", { htmlFor: "uf-email", className: "block text-xs text-[var(--color-text-muted)] mb-1", children: "Email *" }),
        /* @__PURE__ */ jsx26(
          Input,
          {
            id: "uf-email",
            type: "email",
            value: data.email,
            onChange: (e) => update("email", e.target.value),
            placeholder: "napr. tibi@isnex.ai"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs16("div", { children: [
        /* @__PURE__ */ jsx26("label", { htmlFor: "uf-password", className: "block text-xs text-[var(--color-text-muted)] mb-1", children: isEdit ? /* @__PURE__ */ jsxs16(Fragment11, { children: [
          "Nov\xE9 heslo",
          " ",
          /* @__PURE__ */ jsx26("span", { className: "text-[var(--color-text-muted)]", children: "(nechaj pr\xE1zdne ak nemeni\u0165)" })
        ] }) : "Heslo *" }),
        /* @__PURE__ */ jsx26(
          Input,
          {
            id: "uf-password",
            type: "password",
            value: data.password,
            onChange: (e) => update("password", e.target.value),
            placeholder: `min. ${minLen} znakov`,
            invalid: passwordTooShort
          }
        ),
        passwordTooShort && /* @__PURE__ */ jsxs16("div", { className: "mt-1 text-[10px] text-[var(--color-status-error)]", children: [
          "Heslo mus\xED ma\u0165 aspo\u0148 ",
          minLen,
          " znakov (",
          data.password.length,
          "/",
          minLen,
          ")."
        ] })
      ] }),
      /* @__PURE__ */ jsxs16("div", { children: [
        /* @__PURE__ */ jsx26("label", { htmlFor: "uf-role", className: "block text-xs text-[var(--color-text-muted)] mb-1", children: "Rola" }),
        /* @__PURE__ */ jsx26(
          Select,
          {
            id: "uf-role",
            value: data.role,
            onChange: (e) => update("role", e.target.value),
            children: roleOptions.map((o) => /* @__PURE__ */ jsx26("option", { value: o.value, children: o.label }, o.value))
          }
        )
      ] }),
      fieldSchema.telegram && /* @__PURE__ */ jsxs16("div", { children: [
        /* @__PURE__ */ jsx26("label", { htmlFor: "uf-telegram", className: "block text-xs text-[var(--color-text-muted)] mb-1", children: "Telegram chat_id" }),
        /* @__PURE__ */ jsx26(
          Input,
          {
            id: "uf-telegram",
            type: "text",
            value: data.telegram_chat_id,
            onChange: (e) => update("telegram_chat_id", e.target.value),
            placeholder: "napr. 123456789 (notifik\xE1cie agenta)"
          }
        )
      ] }),
      isEdit && /* @__PURE__ */ jsx26("div", { className: "flex items-end", children: /* @__PURE__ */ jsxs16("label", { htmlFor: "uf-active", className: "flex items-center gap-2 text-xs text-[var(--color-text-secondary)] cursor-pointer", children: [
        /* @__PURE__ */ jsx26(
          "input",
          {
            id: "uf-active",
            type: "checkbox",
            checked: data.is_active,
            onChange: (e) => update("is_active", e.target.checked),
            className: "rounded bg-[var(--color-surface)] border-[var(--color-border-default)]"
          }
        ),
        "Akt\xEDvny"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs16("div", { className: "flex gap-2 justify-end", children: [
      onCancel && /* @__PURE__ */ jsx26(
        "button",
        {
          type: "button",
          onClick: onCancel,
          className: "px-3 py-1.5 text-xs text-[var(--color-text-secondary)] border border-[var(--color-border-default)] rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors",
          children: "Zru\u0161i\u0165"
        }
      ),
      /* @__PURE__ */ jsx26(
        "button",
        {
          type: "button",
          onClick: handleSubmit,
          disabled: submitDisabled,
          className: "px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-500 disabled:opacity-40 rounded-lg transition-colors",
          children: submitLabel
        }
      )
    ] })
  ] });
}

// src/UsersPanel.tsx
import { jsx as jsx27, jsxs as jsxs17 } from "react/jsx-runtime";
function UsersPanel({
  users,
  roleOptions,
  canManage,
  fieldSchema,
  onCreate,
  onUpdate,
  onDelete,
  onChangePassword,
  onToggleActive,
  roleClass
}) {
  const roleCls = roleClass ?? (() => "");
  const [roleFilter, setRoleFilter] = useState9("");
  const [activeFilter, setActiveFilter] = useState9("");
  const [showNewForm, setShowNewForm] = useState9(false);
  const [editingUser, setEditingUser] = useState9(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState9(null);
  const [creating, setCreating] = useState9(false);
  const [createError, setCreateError] = useState9("");
  const [editing, setEditing] = useState9(false);
  const [editError, setEditError] = useState9("");
  const [deleting, setDeleting] = useState9(false);
  const [deleteError, setDeleteError] = useState9("");
  const filteredUsers = useMemo2(() => {
    return users.filter((u) => {
      if (roleFilter && u.role !== roleFilter) return false;
      if (activeFilter === "active" && !u.is_active) return false;
      if (activeFilter === "inactive" && u.is_active) return false;
      return true;
    });
  }, [users, roleFilter, activeFilter]);
  const showNames = fieldSchema.names;
  const showUsername = fieldSchema.username;
  const colCount = 4 + (showNames ? 1 : 0) + (showUsername ? 1 : 0);
  async function handleCreate(data) {
    setCreating(true);
    setCreateError("");
    try {
      await onCreate(data);
      setShowNewForm(false);
    } catch (e) {
      const msg = e instanceof Error && e.message ? `Nepodarilo sa vytvori\u0165 pou\u017E\xEDvate\u013Ea: ${e.message}` : "Nepodarilo sa vytvori\u0165 pou\u017E\xEDvate\u013Ea.";
      setCreateError(msg);
    } finally {
      setCreating(false);
    }
  }
  async function handleSaveEdit(data) {
    if (!editingUser) return;
    setEditing(true);
    setEditError("");
    try {
      await onUpdate(editingUser.id, data);
      if (data.password) {
        await onChangePassword(editingUser.id, data.password);
      }
      setEditingUser(null);
    } catch (e) {
      const msg = e instanceof Error && e.message ? `Nepodarilo sa ulo\u017Ei\u0165 zmeny: ${e.message}` : "Nepodarilo sa ulo\u017Ei\u0165 zmeny.";
      setEditError(msg);
    } finally {
      setEditing(false);
    }
  }
  async function handleConfirmDelete(id) {
    setDeleting(true);
    setDeleteError("");
    try {
      await onDelete(id);
      setConfirmingDeleteId(null);
    } catch (e) {
      const msg = e instanceof Error && e.message ? `Ned\xE1 sa vymaza\u0165: ${e.message}. Sk\xFAs miesto toho deaktivova\u0165.` : "Ned\xE1 sa vymaza\u0165. Sk\xFAs miesto toho deaktivova\u0165.";
      setDeleteError(msg);
      setConfirmingDeleteId(null);
    } finally {
      setDeleting(false);
    }
  }
  function handleToggle(u) {
    void onToggleActive(u).catch(() => {
    });
  }
  return /* @__PURE__ */ jsxs17("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxs17("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsx27("h2", { className: "text-sm font-semibold text-[var(--color-text-secondary)]", children: "Spr\xE1va pou\u017E\xEDvate\u013Eov" }),
      canManage && /* @__PURE__ */ jsxs17(
        "button",
        {
          type: "button",
          onClick: () => {
            setShowNewForm((v) => !v);
            setEditingUser(null);
            setConfirmingDeleteId(null);
          },
          className: "flex items-center gap-1.5 bg-primary-600 hover:bg-primary-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
          children: [
            /* @__PURE__ */ jsx27("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx27("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }),
            "Nov\xFD pou\u017E\xEDvate\u013E"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs17("div", { className: "flex items-center gap-3 mb-3", children: [
      /* @__PURE__ */ jsxs17(
        "select",
        {
          value: roleFilter,
          onChange: (e) => setRoleFilter(e.target.value),
          className: "bg-[var(--color-surface)] border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary-500",
          children: [
            /* @__PURE__ */ jsx27("option", { value: "", children: "V\u0161etky role" }),
            roleOptions.map((o) => /* @__PURE__ */ jsx27("option", { value: o.value, children: o.label }, o.value))
          ]
        }
      ),
      /* @__PURE__ */ jsxs17(
        "select",
        {
          value: activeFilter,
          onChange: (e) => setActiveFilter(e.target.value),
          className: "bg-[var(--color-surface)] border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary-500",
          children: [
            /* @__PURE__ */ jsx27("option", { value: "", children: "Ak\xFDko\u013Evek stav" }),
            /* @__PURE__ */ jsx27("option", { value: "active", children: "Len akt\xEDvni" }),
            /* @__PURE__ */ jsx27("option", { value: "inactive", children: "Len neakt\xEDvni" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs17("span", { className: "ml-auto text-xs text-[var(--color-text-muted)]", children: [
        filteredUsers.length,
        " pou\u017E\xEDvate\u013Eov"
      ] })
    ] }),
    /* @__PURE__ */ jsx27("div", { className: "rounded-xl border border-[var(--color-border-default)] overflow-hidden", children: /* @__PURE__ */ jsxs17("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx27("thead", { className: "bg-[var(--color-surface-hover)]", children: /* @__PURE__ */ jsxs17("tr", { className: "text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]", children: [
        showNames && /* @__PURE__ */ jsx27("th", { className: "px-4 py-2.5 text-left font-semibold", children: "Meno" }),
        showUsername && /* @__PURE__ */ jsx27("th", { className: "px-4 py-2.5 text-left font-semibold", children: "Pou\u017E\xEDvate\u013Esk\xE9 meno" }),
        /* @__PURE__ */ jsx27("th", { className: "px-4 py-2.5 text-left font-semibold", children: "Email" }),
        /* @__PURE__ */ jsx27("th", { className: "px-4 py-2.5 text-left font-semibold", children: "Rola" }),
        /* @__PURE__ */ jsx27("th", { className: "px-4 py-2.5 text-left font-semibold", children: "Stav" }),
        /* @__PURE__ */ jsx27("th", { className: "px-4 py-2.5 text-right font-semibold", children: "Akcie" })
      ] }) }),
      /* @__PURE__ */ jsxs17("tbody", { className: "divide-y divide-[var(--color-border-default)]", children: [
        filteredUsers.map((u) => {
          const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ");
          return /* @__PURE__ */ jsxs17("tr", { className: "hover:bg-[var(--color-surface-hover)] transition-colors", children: [
            showNames && /* @__PURE__ */ jsx27("td", { className: "px-4 py-3 text-sm text-[var(--color-text-secondary)]", children: fullName || /* @__PURE__ */ jsx27("span", { className: "text-[var(--color-text-muted)]", children: "\u2014" }) }),
            showUsername && /* @__PURE__ */ jsx27("td", { className: "px-4 py-3 text-sm font-medium text-[var(--color-text-primary)] font-mono", children: u.username }),
            /* @__PURE__ */ jsx27("td", { className: "px-4 py-3 text-xs text-[var(--color-text-secondary)]", children: u.email }),
            /* @__PURE__ */ jsx27("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx27("span", { className: `text-[11px] font-mono font-medium ${roleCls(u.role)}`, children: u.role }) }),
            /* @__PURE__ */ jsx27("td", { className: "px-4 py-3", children: u.is_active ? /* @__PURE__ */ jsx27("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-state-success-bg)] border border-[var(--color-state-success-bg)] text-[var(--color-state-success-fg)]", children: "akt\xEDvny" }) : /* @__PURE__ */ jsx27("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-state-warning-bg)] border border-[var(--color-state-warning-bg)] text-[var(--color-state-warning-fg)]", children: "neakt\xEDvny" }) }),
            /* @__PURE__ */ jsx27("td", { className: "px-4 py-3 text-right", children: !canManage ? /* @__PURE__ */ jsx27("span", { className: "text-xs text-[var(--color-text-muted)]", children: "\u2014" }) : confirmingDeleteId === u.id ? /* @__PURE__ */ jsxs17("div", { className: "flex items-center justify-end gap-2 text-xs", children: [
              /* @__PURE__ */ jsx27("span", { className: "text-[var(--color-text-secondary)]", children: "Naozaj vymaza\u0165?" }),
              /* @__PURE__ */ jsx27(
                "button",
                {
                  type: "button",
                  onClick: () => handleConfirmDelete(u.id),
                  disabled: deleting,
                  className: "px-2 py-0.5 text-[var(--color-status-error)] border border-[var(--color-state-error-bg)] rounded hover:bg-[var(--color-state-error-bg)] disabled:opacity-40",
                  children: "\xC1no"
                }
              ),
              /* @__PURE__ */ jsx27(
                "button",
                {
                  type: "button",
                  onClick: () => setConfirmingDeleteId(null),
                  disabled: deleting,
                  className: "px-2 py-0.5 text-[var(--color-text-secondary)] border border-[var(--color-border-default)] rounded hover:bg-[var(--color-surface-hover)]",
                  children: "Nie"
                }
              )
            ] }) : /* @__PURE__ */ jsxs17("div", { className: "flex items-center justify-end gap-3", children: [
              /* @__PURE__ */ jsx27(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setEditingUser(u);
                    setEditError("");
                    setShowNewForm(false);
                    setConfirmingDeleteId(null);
                  },
                  title: "Upravi\u0165",
                  className: "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors",
                  children: /* @__PURE__ */ jsx27("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx27("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) })
                }
              ),
              /* @__PURE__ */ jsx27(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setConfirmingDeleteId(u.id);
                    setDeleteError("");
                  },
                  title: "Vymaza\u0165",
                  className: "text-[var(--color-text-muted)] hover:text-[var(--color-status-error)] transition-colors",
                  children: /* @__PURE__ */ jsx27("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx27("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) })
                }
              ),
              /* @__PURE__ */ jsx27(
                "button",
                {
                  type: "button",
                  onClick: () => handleToggle(u),
                  className: "text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors",
                  children: u.is_active ? "Deaktivova\u0165" : "Aktivova\u0165"
                }
              )
            ] }) })
          ] }, u.id);
        }),
        filteredUsers.length === 0 && /* @__PURE__ */ jsx27("tr", { children: /* @__PURE__ */ jsx27("td", { colSpan: colCount, className: "px-4 py-6 text-center text-xs text-[var(--color-text-muted)]", children: "\u017Diadni pou\u017E\xEDvatelia" }) })
      ] })
    ] }) }),
    deleteError && /* @__PURE__ */ jsxs17("div", { className: "mt-3 text-xs text-[var(--color-state-error-fg)] rounded bg-[var(--color-state-error-bg)] border border-[var(--color-state-error-bg)] px-3 py-2 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx27("span", { children: deleteError }),
      /* @__PURE__ */ jsx27("button", { type: "button", onClick: () => setDeleteError(""), className: "text-[var(--color-state-error-fg)] hover:opacity-80 ml-2", children: "\xD7" })
    ] }),
    canManage && editingUser && /* @__PURE__ */ jsx27(
      UserForm,
      {
        mode: "edit",
        initial: editingUser,
        roleOptions,
        fieldSchema,
        submitting: editing,
        error: editError,
        onSubmit: handleSaveEdit,
        onCancel: () => {
          setEditingUser(null);
          setEditError("");
        }
      },
      `edit-${editingUser.id}`
    ),
    canManage && showNewForm && /* @__PURE__ */ jsx27(
      UserForm,
      {
        mode: "create",
        roleOptions,
        fieldSchema,
        submitting: creating,
        error: createError,
        onSubmit: handleCreate,
        onCancel: () => {
          setShowNewForm(false);
          setCreateError("");
        }
      }
    )
  ] });
}

// src/SessionsPanel.tsx
import { useMemo as useMemo3, useState as useState10 } from "react";
import { jsx as jsx28, jsxs as jsxs18 } from "react/jsx-runtime";
function fmt(ts) {
  if (!ts) return "\u2014";
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? "\u2014" : d.toLocaleString("sk-SK");
}
function SessionsPanel({
  sessions,
  resolveUsername,
  canRevoke,
  onRevoke,
  loading = false,
  loadError = "",
  filterUserId,
  onFilterChange
}) {
  const [confirmingId, setConfirmingId] = useState10(null);
  const [revoking, setRevoking] = useState10(false);
  const [revokeError, setRevokeError] = useState10("");
  const nameOf = (uid) => resolveUsername?.(uid) ?? uid;
  const rows = useMemo3(
    () => filterUserId ? sessions.filter((s) => s.user_id === filterUserId) : sessions,
    [sessions, filterUserId]
  );
  async function handleRevoke(id) {
    setRevoking(true);
    setRevokeError("");
    try {
      await onRevoke(id);
      setConfirmingId(null);
    } catch (e) {
      const msg = e instanceof Error && e.message ? `Nepodarilo sa zru\u0161i\u0165 rel\xE1ciu: ${e.message}` : "Nepodarilo sa zru\u0161i\u0165 rel\xE1ciu.";
      setRevokeError(msg);
      setConfirmingId(null);
    } finally {
      setRevoking(false);
    }
  }
  return /* @__PURE__ */ jsxs18("div", { className: "p-6", children: [
    /* @__PURE__ */ jsx28("h2", { className: "text-sm font-semibold text-[var(--color-text-secondary)] mb-1", children: "Rel\xE1cie pou\u017E\xEDvate\u013Ea" }),
    /* @__PURE__ */ jsx28("p", { className: "text-xs text-[var(--color-text-muted)] mb-4", children: "Kotvy \u017Eivotn\xE9ho cyklu JWT. Zru\u0161enie rel\xE1cie zneplatn\xED v\u0161etky jej zost\xE1vaj\xFAce tokeny." }),
    filterUserId && onFilterChange && /* @__PURE__ */ jsxs18("div", { className: "mb-3 flex items-center gap-2 text-xs", children: [
      /* @__PURE__ */ jsxs18("span", { className: "text-[var(--color-text-muted)]", children: [
        "Filtrovan\xE9 pod\u013Ea pou\u017E\xEDvate\u013Ea:",
        " ",
        /* @__PURE__ */ jsx28("span", { className: "text-[var(--color-text-secondary)] font-medium", children: nameOf(filterUserId) })
      ] }),
      /* @__PURE__ */ jsx28(
        "button",
        {
          type: "button",
          onClick: () => onFilterChange(""),
          className: "px-2 py-0.5 text-[var(--color-text-secondary)] border border-[var(--color-border-default)] rounded hover:bg-[var(--color-surface-hover)]",
          children: "Zru\u0161i\u0165 filter"
        }
      )
    ] }),
    loadError && /* @__PURE__ */ jsx28("div", { className: "rounded-lg border border-[var(--color-state-error-bg)] bg-[var(--color-state-error-bg)] px-3 py-2 text-xs text-[var(--color-state-error-fg)] mb-4", children: loadError }),
    loading && !loadError && /* @__PURE__ */ jsx28("div", { className: "text-xs text-[var(--color-text-muted)]", children: "Na\u010D\xEDtavam\u2026" }),
    !loading && !loadError && /* @__PURE__ */ jsx28("div", { className: "rounded-xl border border-[var(--color-border-default)] overflow-hidden", children: /* @__PURE__ */ jsxs18("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx28("thead", { className: "bg-[var(--color-surface-hover)]", children: /* @__PURE__ */ jsxs18("tr", { className: "text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]", children: [
        /* @__PURE__ */ jsx28("th", { className: "px-4 py-2.5 text-left font-semibold", children: "Pou\u017E\xEDvate\u013E" }),
        /* @__PURE__ */ jsx28("th", { className: "px-4 py-2.5 text-left font-semibold", children: "ID rel\xE1cie" }),
        /* @__PURE__ */ jsx28("th", { className: "px-4 py-2.5 text-right font-semibold", children: "tv" }),
        /* @__PURE__ */ jsx28("th", { className: "px-4 py-2.5 text-left font-semibold", children: "Naposledy viden\xFD" }),
        /* @__PURE__ */ jsx28("th", { className: "px-4 py-2.5 text-left font-semibold", children: "Vytvoren\xE9" }),
        /* @__PURE__ */ jsx28("th", { className: "px-4 py-2.5 text-right font-semibold", children: "Akcie" })
      ] }) }),
      /* @__PURE__ */ jsxs18("tbody", { className: "divide-y divide-[var(--color-border-default)]", children: [
        rows.map((s) => /* @__PURE__ */ jsxs18("tr", { className: "hover:bg-[var(--color-surface-hover)] transition-colors", children: [
          /* @__PURE__ */ jsx28("td", { className: "px-4 py-3 text-sm font-medium text-[var(--color-text-primary)]", children: nameOf(s.user_id) }),
          /* @__PURE__ */ jsx28("td", { className: "px-4 py-3 font-mono text-[10px] text-[var(--color-text-muted)]", children: s.id }),
          /* @__PURE__ */ jsx28("td", { className: "px-4 py-3 text-right font-mono text-xs text-[var(--color-text-secondary)]", children: s.token_version }),
          /* @__PURE__ */ jsx28("td", { className: "px-4 py-3 text-xs text-[var(--color-text-muted)]", children: fmt(s.last_seen_at) }),
          /* @__PURE__ */ jsx28("td", { className: "px-4 py-3 text-xs text-[var(--color-text-muted)]", children: fmt(s.created_at) }),
          /* @__PURE__ */ jsx28("td", { className: "px-4 py-3 text-right", children: !canRevoke ? /* @__PURE__ */ jsx28("span", { className: "text-xs text-[var(--color-text-muted)]", children: "\u2014" }) : confirmingId === s.id ? /* @__PURE__ */ jsxs18("div", { className: "flex items-center justify-end gap-2 text-xs", children: [
            /* @__PURE__ */ jsx28("span", { className: "text-[var(--color-text-secondary)]", children: "Zru\u0161i\u0165 rel\xE1ciu?" }),
            /* @__PURE__ */ jsx28(
              "button",
              {
                type: "button",
                onClick: () => handleRevoke(s.id),
                disabled: revoking,
                className: "px-2 py-0.5 text-[var(--color-status-error)] border border-[var(--color-state-error-bg)] rounded hover:bg-[var(--color-state-error-bg)] disabled:opacity-40",
                children: "\xC1no"
              }
            ),
            /* @__PURE__ */ jsx28(
              "button",
              {
                type: "button",
                onClick: () => setConfirmingId(null),
                disabled: revoking,
                className: "px-2 py-0.5 text-[var(--color-text-secondary)] border border-[var(--color-border-default)] rounded hover:bg-[var(--color-surface-hover)]",
                children: "Nie"
              }
            )
          ] }) : /* @__PURE__ */ jsx28(
            "button",
            {
              type: "button",
              onClick: () => {
                setConfirmingId(s.id);
                setRevokeError("");
              },
              className: "text-xs text-[var(--color-text-muted)] hover:text-[var(--color-status-error)] transition-colors",
              children: "Zru\u0161i\u0165"
            }
          ) })
        ] }, s.id)),
        rows.length === 0 && /* @__PURE__ */ jsx28("tr", { children: /* @__PURE__ */ jsx28("td", { colSpan: 6, className: "px-4 py-6 text-center text-xs text-[var(--color-text-muted)]", children: "\u017Diadne rel\xE1cie" }) })
      ] })
    ] }) }),
    revokeError && /* @__PURE__ */ jsxs18("div", { className: "mt-3 text-xs text-[var(--color-state-error-fg)] rounded bg-[var(--color-state-error-bg)] border border-[var(--color-state-error-bg)] px-3 py-2 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx28("span", { children: revokeError }),
      /* @__PURE__ */ jsx28("button", { type: "button", onClick: () => setRevokeError(""), className: "text-[var(--color-state-error-fg)] hover:opacity-80 ml-2", children: "\xD7" })
    ] })
  ] });
}
export {
  AgentsPanel,
  ApiError,
  AppShell,
  Badge,
  Brand,
  Button,
  Card,
  CodeBlock,
  DataTable,
  FormActions,
  FormField,
  FormGrid,
  Header,
  IconButton,
  Input,
  LoginForm,
  NavIcon,
  NavItem,
  ProtectedRoute,
  ReleaseNotes,
  SectionLabel,
  Select,
  SessionsPanel,
  SettingsShell,
  Sidebar,
  StatusBadge,
  SystemSettingsPanel,
  ThemeToggle,
  UserCard,
  UserForm,
  UsersPanel,
  createApiClient,
  createAuthStore,
  registerAuthCallback
};
