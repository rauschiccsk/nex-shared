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
import { useCallback, useEffect as useEffect2, useMemo, useRef, useState as useState2 } from "react";

// src/ShellContext.ts
import { createContext, useContext, useEffect, useState } from "react";
var WIDE_SCREEN_QUERY = "(min-width: 1024px)";
var ShellContext = createContext({ narrow: false, menuOpen: false, closeMenu: () => {
} });
var useShell = () => useContext(ShellContext);
function useWideScreen() {
  const supported = typeof window !== "undefined" && typeof window.matchMedia === "function";
  const [wide, setWide] = useState(() => !supported || window.matchMedia(WIDE_SCREEN_QUERY).matches);
  useEffect(() => {
    if (!supported) return;
    const query = window.matchMedia(WIDE_SCREEN_QUERY);
    const update = () => setWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [supported]);
  return wide;
}

// src/AppShell.tsx
import { Fragment, jsx as jsx2, jsxs } from "react/jsx-runtime";
var IconMenu = () => /* @__PURE__ */ jsx2("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsx2("path", { d: "M4 6h16M4 12h16M4 18h16", strokeWidth: "1.8", strokeLinecap: "round" }) });
function AppShell({
  sidebar,
  header,
  topBanner,
  children,
  menuLabel = "Ponuka"
}) {
  const narrow = !useWideScreen();
  const [menuOpen, setMenuOpen] = useState2(false);
  const menuButton = useRef(null);
  const drawer = useRef(null);
  const wasOpen = useRef(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useEffect2(() => {
    if (!narrow) setMenuOpen(false);
  }, [narrow]);
  useEffect2(() => {
    if (!menuOpen) return;
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);
  useEffect2(() => {
    if (menuOpen) {
      drawer.current?.querySelector("button, a[href]")?.focus();
    } else if (wasOpen.current) {
      menuButton.current?.focus();
    }
    wasOpen.current = menuOpen;
  }, [menuOpen]);
  const shell = useMemo(() => ({ narrow, menuOpen: narrow && menuOpen, closeMenu }), [narrow, menuOpen, closeMenu]);
  return /* @__PURE__ */ jsx2(ShellContext.Provider, { value: shell, children: /* @__PURE__ */ jsxs("div", { className: "flex h-full w-full bg-[var(--color-canvas)]", children: [
    narrow ? /* @__PURE__ */ jsxs(Fragment, { children: [
      menuOpen && // A tap beside the drawer closes it; the keyboard and screen readers use Escape or its close button.
      /* @__PURE__ */ jsx2("div", { className: "fixed inset-0 z-40 bg-black/50", "aria-hidden": "true", onClick: closeMenu }),
      /* @__PURE__ */ jsx2(
        "div",
        {
          ref: drawer,
          className: `fixed inset-y-0 left-0 z-50 flex max-w-[85vw] shadow-[var(--shadow-lg)] transition-[transform,visibility] duration-200 ${menuOpen ? "translate-x-0" : "invisible -translate-x-full"}`,
          inert: !menuOpen,
          children: sidebar
        }
      )
    ] }) : sidebar,
    /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col overflow-hidden", children: [
      topBanner,
      narrow ? /* @__PURE__ */ jsxs("div", { className: "flex flex-shrink-0 items-stretch", children: [
        /* @__PURE__ */ jsx2(
          "button",
          {
            ref: menuButton,
            type: "button",
            "aria-label": menuLabel,
            "aria-expanded": menuOpen,
            title: menuLabel,
            onClick: () => setMenuOpen(true),
            className: "flex w-11 flex-shrink-0 items-center justify-center border-b border-r border-[var(--color-border-default)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
            children: /* @__PURE__ */ jsx2(IconMenu, {})
          }
        ),
        /* @__PURE__ */ jsx2("div", { className: "min-w-0 flex-1", children: header })
      ] }) : header,
      /* @__PURE__ */ jsx2("main", { className: "relative flex-1 overflow-y-auto", children })
    ] })
  ] }) });
}

// src/Sidebar.tsx
import { useState as useState4 } from "react";

// src/CollapseContext.ts
import { createContext as createContext2, useContext as useContext2 } from "react";
var CollapseContext = createContext2(false);
var useCollapsed = () => useContext2(CollapseContext);

// src/DensityContext.ts
import { createContext as createContext3, useContext as useContext3 } from "react";
var DensityContext = createContext3(false);
var useDense = () => useContext3(DensityContext);
var CompactRowsContext = createContext3(false);
var useCompactRows = () => useContext3(CompactRowsContext);

// src/ResizeHandle.tsx
import { useRef as useRef2 } from "react";

// src/i18n.tsx
import { createContext as createContext4, useContext as useContext4, useMemo as useMemo2 } from "react";

// src/locales/en.ts
var en = {
  "common.actions": "Actions",
  "common.cancel": "Cancel",
  "common.close": "Close",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.loading": "Loading\u2026",
  "common.no": "No",
  "common.save": "Save",
  "common.saved": "Saved",
  "common.saving": "Saving\u2026",
  "common.yes": "Yes",
  "account.changePassword": "Change password",
  "account.currentPassword": "Current password",
  "account.details": "My details",
  "account.emailRequired": "E-mail is required.",
  "account.language": "Language",
  "account.languageFailed": "The language could not be changed. Try again.",
  "account.languageHint": "The language the app shows its texts to you in.",
  "account.passwordChanged": "The password has been changed.",
  "account.passwordFailed": "Changing the password failed. Try again.",
  "account.passwordTitle": "Change password",
  "account.repeatPassword": "Repeat the new password",
  "account.saved": "Your details have been saved.",
  "account.saveFailed": "Saving failed. Try again.",
  "account.telegramHowTo": "To start receiving notifications on Telegram: send /start to our bot, find your chat ID (e.g. via @userinfobot), enter it above, save and click \u201CSend test\u201D.",
  "account.telegramPlaceholder": "e.g. 123456789 (notifications)",
  "account.telegramSending": "Sending\u2026",
  "account.telegramTest": "Send test",
  "account.telegramTestFailed": "The test failed (connection error).",
  "agents.default": "\u2014 Default \u2014",
  "agents.description": "For each role, choose which AI model it uses and how thoroughly it should reason (a higher level is more thorough, but slower and more expensive). A field left empty keeps the default setting.",
  "agents.effort": "Level",
  "agents.effort.low": "Low",
  "agents.effort.medium": "Medium",
  "agents.effort.high": "High",
  "agents.effort.xhigh": "Very high",
  "agents.effort.max": "Maximum",
  "agents.helperDefault": "\u2014 Default (cheap/fast) \u2014",
  "agents.helperHint": "The model of the dynamic helpers for parallel/bulk work. Cheap/fast by default; raise it to a strong one only for a priority build (more expensive tokens).",
  "agents.helperModel": "Helpers' model",
  "agents.model": "Model",
  "agents.title": "Agents \u2014 model and reasoning level",
  "api.requestFailed": "The request failed ({status}).",
  "code.copied": "Copied",
  "code.copy": "Copy",
  "login.email": "E-mail",
  "login.failed": "Signing in failed.",
  "login.loading": "Signing in\u2026",
  "login.password": "Password",
  "login.submit": "Sign in",
  "login.username": "Username",
  "password.minPlaceholder": { one: "min. {count} character", other: "min. {count} characters" },
  "password.mismatch": "The passwords do not match.",
  "password.new": "New password",
  "password.tooShort": {
    one: "The password must have at least {count} character.",
    other: "The password must have at least {count} characters."
  },
  "password.tooShortCount": {
    one: "The password must have at least {count} character ({length}/{count}).",
    other: "The password must have at least {count} characters ({length}/{count})."
  },
  "resize.hint": "{label} \u2014 drag, use the arrow keys, double-click restores the default",
  "sessions.clearFilter": "Clear filter",
  "sessions.col.created": "Created",
  "sessions.col.id": "Session ID",
  "sessions.col.lastSeen": "Last seen",
  "sessions.col.tokenVersion": "tv",
  "sessions.col.user": "User",
  "sessions.confirmRevoke": "Revoke the session?",
  "sessions.description": "Who is signed in and since when.",
  "sessions.filteredBy": "Filtered by user:",
  "sessions.none": "No sessions",
  "sessions.revoke": "Revoke",
  "sessions.revokeFailed": "The session could not be revoked.",
  "sessions.revokeFailedBecause": "The session could not be revoked: {reason}",
  "sessions.title": "User sessions",
  "settings.tab.account": "My account",
  "settings.tab.agents": "Agents",
  "settings.tab.sessions": "Sessions",
  "settings.tab.system": "System",
  "settings.tab.users": "Users",
  "settings.title": "Settings",
  "sidebar.closeMenu": "Close menu",
  "sidebar.collapse": "Collapse",
  "sidebar.expand": "Expand",
  "sidebar.width": "Side panel width",
  "system.appliesSoon": "The change applies within 30 seconds at most.",
  "system.changed": "Changed",
  "system.choicesUnavailable": "The choices cannot be loaded now \u2014 the setting cannot be changed for the moment.",
  "system.defaultValue": "Default value.",
  "system.description": "Settings that change while the app runs.",
  "system.noPermission": "Read-only \u2014 you lack the permission to change it.",
  "system.notChosen": "\u2014 not chosen \u2014",
  "system.notOffered": "{value} (not among the choices)",
  "system.otherCategory": "Other",
  "system.readOnlyHint": "Read-only \u2014 an administrator can change them.",
  "system.title": "System settings",
  "system.unknownError": "Unknown error.",
  "table.empty": "No data",
  "theme.dark": "Dark theme",
  "theme.light": "Light theme",
  "theme.toDark": "Switch to the dark theme",
  "theme.toLight": "Switch to the light theme",
  "updates.none": "No updates yet.",
  "updates.subtitle": "What is new in each version.",
  "updates.subtitleFor": "What is new in each version of {app}.",
  "updates.title": "Updates",
  "user.active": "Active",
  "user.email": "E-mail",
  "user.emailRequired": "E-mail *",
  "user.firstName": "First name",
  "user.lastName": "Last name",
  "user.logout": "Sign out",
  "user.role": "Role",
  "user.telegram": "Telegram chat_id",
  "user.username": "Username",
  "userForm.create": "Create",
  "userForm.createTitle": "Create user",
  "userForm.creating": "Creating\u2026",
  "userForm.editTitle": "Edit user",
  "userForm.emailPlaceholder": "e.g. jane@example.com",
  "userForm.firstNamePlaceholder": "e.g. Jane",
  "userForm.lastNamePlaceholder": "e.g. Smith",
  "userForm.passwordKeep": "(leave empty to keep it)",
  "userForm.passwordRequired": "Password *",
  "userForm.telegramPlaceholder": "e.g. 123456789 (agent notifications)",
  "userForm.usernameFixed": "The username does not change after it is created (it keeps sign-in stable).",
  "userForm.usernamePlaceholder": "e.g. jane",
  "users.activate": "Activate",
  "users.active": "active",
  "users.allRoles": "All roles",
  "users.anyState": "Any state",
  "users.col.language": "Language",
  "users.col.name": "Name",
  "users.col.state": "State",
  "users.confirmDelete": "Really delete?",
  "users.count": { one: "{count} user", other: "{count} users" },
  "users.createFailed": "The user could not be created.",
  "users.createFailedBecause": "The user could not be created: {reason}",
  "users.deactivate": "Deactivate",
  "users.deleteFailed": "It cannot be deleted. Try deactivating it instead.",
  "users.deleteFailedBecause": "It cannot be deleted: {reason}. Try deactivating it instead.",
  "users.inactive": "inactive",
  "users.new": "New user",
  "users.none": "No users",
  "users.onlyActive": "Active only",
  "users.onlyInactive": "Inactive only",
  "users.saveFailed": "The changes could not be saved.",
  "users.saveFailedBecause": "The changes could not be saved: {reason}",
  "users.title": "User management"
};

// src/locales/hu.ts
var hu = {
  "common.actions": "M\u0171veletek",
  "common.cancel": "M\xE9gse",
  "common.close": "Bez\xE1r\xE1s",
  "common.delete": "T\xF6rl\xE9s",
  "common.edit": "Szerkeszt\xE9s",
  "common.loading": "Bet\xF6lt\xE9s\u2026",
  "common.no": "Nem",
  "common.save": "Ment\xE9s",
  "common.saved": "Mentve",
  "common.saving": "Ment\xE9s\u2026",
  "common.yes": "Igen",
  "account.changePassword": "Jelsz\xF3 m\xF3dos\xEDt\xE1sa",
  "account.currentPassword": "Jelenlegi jelsz\xF3",
  "account.details": "Saj\xE1t adataim",
  "account.emailRequired": "Az e-mail-c\xEDm megad\xE1sa k\xF6telez\u0151.",
  "account.language": "Nyelv",
  "account.languageFailed": "A nyelvet nem siker\xFClt m\xF3dos\xEDtani. Pr\xF3b\xE1ld \xFAjra.",
  "account.languageHint": "Az a nyelv, amelyen az alkalmaz\xE1s a sz\xF6vegeket megjelen\xEDti neked.",
  "account.passwordChanged": "A jelsz\xF3 m\xF3dos\xEDtva.",
  "account.passwordFailed": "A jelsz\xF3 m\xF3dos\xEDt\xE1sa nem siker\xFClt. Pr\xF3b\xE1ld \xFAjra.",
  "account.passwordTitle": "Jelsz\xF3 m\xF3dos\xEDt\xE1sa",
  "account.repeatPassword": "\xDAj jelsz\xF3 m\xE9g egyszer",
  "account.saved": "Az adatok mentve.",
  "account.saveFailed": "A ment\xE9s nem siker\xFClt. Pr\xF3b\xE1ld \xFAjra.",
  "account.telegramHowTo": "\xCDgy kaphatsz \xE9rtes\xEDt\xE9seket a Telegramon: \xEDrd meg botunknak: /start, der\xEDtsd ki a chat ID-dat (pl. a @userinfobot seg\xEDts\xE9g\xE9vel), \xEDrd be fent, mentsd el, \xE9s kattints a \u201ETeszt k\xFCld\xE9se\u201D gombra.",
  "account.telegramPlaceholder": "pl. 123456789 (\xE9rtes\xEDt\xE9sek)",
  "account.telegramSending": "K\xFCld\xE9s\u2026",
  "account.telegramTest": "Teszt k\xFCld\xE9se",
  "account.telegramTestFailed": "A teszt nem siker\xFClt (kapcsolati hiba).",
  "agents.default": "\u2014 Alap\xE9rtelmezett \u2014",
  "agents.description": "Minden szerepk\xF6rh\xF6z v\xE1laszd ki, melyik AI-modellt haszn\xE1lja, \xE9s milyen alaposan gondolkodjon (magasabb szint = alaposabb, de lassabb \xE9s dr\xE1g\xE1bb). \xDCresen hagyott mez\u0151 = marad az alap\xE9rtelmezett be\xE1ll\xEDt\xE1s.",
  "agents.effort": "Szint",
  "agents.effort.low": "Alacsony",
  "agents.effort.medium": "K\xF6zepes",
  "agents.effort.high": "Magas",
  "agents.effort.xhigh": "Nagyon magas",
  "agents.effort.max": "Maxim\xE1lis",
  "agents.helperDefault": "\u2014 Alap\xE9rtelmezett (olcs\xF3/gyors) \u2014",
  "agents.helperHint": "A p\xE1rhuzamos/t\xF6meges munk\xE1t v\xE9gz\u0151 dinamikus seg\xE9dek modellje. Alap\xE9rtelmezetten olcs\xF3/gyors; er\u0151sre csak kiemelt buildn\xE9l \xE1ll\xEDtsd (dr\xE1g\xE1bb tokenek).",
  "agents.helperModel": "Seg\xE9dek modellje",
  "agents.model": "Modell",
  "agents.title": "\xDCgyn\xF6k\xF6k \u2014 modell \xE9s gondolkod\xE1si szint",
  "api.requestFailed": "A k\xE9r\xE9s nem siker\xFClt ({status}).",
  "code.copied": "M\xE1solva",
  "code.copy": "M\xE1sol\xE1s",
  "login.email": "E-mail",
  "login.failed": "A bejelentkez\xE9s nem siker\xFClt.",
  "login.loading": "Bejelentkez\xE9s\u2026",
  "login.password": "Jelsz\xF3",
  "login.submit": "Bejelentkez\xE9s",
  "login.username": "Felhaszn\xE1l\xF3n\xE9v",
  "password.minPlaceholder": "legal\xE1bb {count} karakter",
  "password.mismatch": "A jelszavak nem egyeznek.",
  "password.new": "\xDAj jelsz\xF3",
  "password.tooShort": "A jelsz\xF3nak legal\xE1bb {count} karakterb\u0151l kell \xE1llnia.",
  "password.tooShortCount": "A jelsz\xF3nak legal\xE1bb {count} karakterb\u0151l kell \xE1llnia ({length}/{count}).",
  "resize.hint": "{label} \u2014 h\xFAzd el vagy haszn\xE1ld a nyilakat; dupla kattint\xE1s vissza\xE1ll\xEDtja az alap\xE9rtelmezettet",
  "sessions.clearFilter": "Sz\u0171r\u0151 t\xF6rl\xE9se",
  "sessions.col.created": "L\xE9trehozva",
  "sessions.col.id": "Munkamenet-azonos\xEDt\xF3",
  "sessions.col.lastSeen": "Utolj\xE1ra l\xE1tva",
  "sessions.col.tokenVersion": "tv",
  "sessions.col.user": "Felhaszn\xE1l\xF3",
  "sessions.confirmRevoke": "Megsz\xFCnteted a munkamenetet?",
  "sessions.description": "Ki van bejelentkezve, \xE9s mi\xF3ta.",
  "sessions.filteredBy": "Sz\u0171rve felhaszn\xE1l\xF3ra:",
  "sessions.none": "Nincs munkamenet",
  "sessions.revoke": "Megsz\xFCntet\xE9s",
  "sessions.revokeFailed": "A munkamenetet nem siker\xFClt megsz\xFCntetni.",
  "sessions.revokeFailedBecause": "A munkamenetet nem siker\xFClt megsz\xFCntetni: {reason}",
  "sessions.title": "Felhaszn\xE1l\xF3i munkamenetek",
  "settings.tab.account": "Saj\xE1t fi\xF3k",
  "settings.tab.agents": "\xDCgyn\xF6k\xF6k",
  "settings.tab.sessions": "Munkamenetek",
  "settings.tab.system": "Rendszer",
  "settings.tab.users": "Felhaszn\xE1l\xF3k",
  "settings.title": "Be\xE1ll\xEDt\xE1sok",
  "sidebar.closeMenu": "Men\xFC bez\xE1r\xE1sa",
  "sidebar.collapse": "\xD6sszecsuk\xE1s",
  "sidebar.expand": "Kibont\xE1s",
  "sidebar.width": "Oldals\xE1v sz\xE9less\xE9ge",
  "system.appliesSoon": "A m\xF3dos\xEDt\xE1s legk\xE9s\u0151bb 30 m\xE1sodpercen bel\xFCl \xE9rv\xE9nybe l\xE9p.",
  "system.changed": "M\xF3dos\xEDtva",
  "system.choicesUnavailable": "A v\xE1laszt\xE9k most nem t\xF6lthet\u0151 be \u2014 a be\xE1ll\xEDt\xE1s egyel\u0151re nem m\xF3dos\xEDthat\xF3.",
  "system.defaultValue": "Alap\xE9rtelmezett \xE9rt\xE9k.",
  "system.description": "Az alkalmaz\xE1s fut\xE1sa k\xF6zben m\xF3dos\xEDthat\xF3 be\xE1ll\xEDt\xE1sok.",
  "system.noPermission": "Csak olvashat\xF3 \u2014 a m\xF3dos\xEDt\xE1shoz nincs jogosults\xE1g.",
  "system.notChosen": "\u2014 nincs kiv\xE1lasztva \u2014",
  "system.notOffered": "{value} (nincs a v\xE1laszt\xE9kban)",
  "system.otherCategory": "Egy\xE9b",
  "system.readOnlyHint": "Csak olvashat\xF3 \u2014 m\xF3dos\xEDtani a rendszergazda tudja.",
  "system.title": "Rendszerbe\xE1ll\xEDt\xE1sok",
  "system.unknownError": "Ismeretlen hiba.",
  "table.empty": "Nincs adat",
  "theme.dark": "S\xF6t\xE9t t\xE9ma",
  "theme.light": "Vil\xE1gos t\xE9ma",
  "theme.toDark": "V\xE1lt\xE1s s\xF6t\xE9t t\xE9m\xE1ra",
  "theme.toLight": "V\xE1lt\xE1s vil\xE1gos t\xE9m\xE1ra",
  "updates.none": "M\xE9g nincsenek friss\xEDt\xE9sek.",
  "updates.subtitle": "Az egyes verzi\xF3k \xFAjdons\xE1gai.",
  "updates.subtitleFor": "{app}: az egyes verzi\xF3k \xFAjdons\xE1gai.",
  "updates.title": "Friss\xEDt\xE9sek",
  "user.active": "Akt\xEDv",
  "user.email": "E-mail",
  "user.emailRequired": "E-mail *",
  "user.firstName": "Keresztn\xE9v",
  "user.lastName": "Vezet\xE9kn\xE9v",
  "user.logout": "Kijelentkez\xE9s",
  "user.role": "Szerepk\xF6r",
  "user.telegram": "Telegram chat_id",
  "user.username": "Felhaszn\xE1l\xF3n\xE9v",
  "userForm.create": "L\xE9trehoz\xE1s",
  "userForm.createTitle": "Felhaszn\xE1l\xF3 l\xE9trehoz\xE1sa",
  "userForm.creating": "L\xE9trehoz\xE1s\u2026",
  "userForm.editTitle": "Felhaszn\xE1l\xF3 szerkeszt\xE9se",
  "userForm.emailPlaceholder": "pl. tibi@isnex.ai",
  "userForm.firstNamePlaceholder": "pl. Tibor",
  "userForm.lastNamePlaceholder": "pl. Rausch",
  "userForm.passwordKeep": "(hagyd \xFCresen, ha nem v\xE1ltozik)",
  "userForm.passwordRequired": "Jelsz\xF3 *",
  "userForm.telegramPlaceholder": "pl. 123456789 (\xFCgyn\xF6k \xE9rtes\xEDt\xE9sei)",
  "userForm.usernameFixed": "A felhaszn\xE1l\xF3n\xE9v l\xE9trehoz\xE1s ut\xE1n nem v\xE1ltozik (a bejelentkez\xE9s stabilit\xE1sa \xE9rdek\xE9ben).",
  "userForm.usernamePlaceholder": "pl. tibi",
  "users.activate": "Aktiv\xE1l\xE1s",
  "users.active": "akt\xEDv",
  "users.allRoles": "Minden szerepk\xF6r",
  "users.anyState": "B\xE1rmely \xE1llapot",
  "users.col.language": "Nyelv",
  "users.col.name": "N\xE9v",
  "users.col.state": "\xC1llapot",
  "users.confirmDelete": "Biztosan t\xF6rl\xF6d?",
  "users.count": "{count} felhaszn\xE1l\xF3",
  "users.createFailed": "A felhaszn\xE1l\xF3t nem siker\xFClt l\xE9trehozni.",
  "users.createFailedBecause": "A felhaszn\xE1l\xF3t nem siker\xFClt l\xE9trehozni: {reason}",
  "users.deactivate": "Inaktiv\xE1l\xE1s",
  "users.deleteFailed": "Nem t\xF6r\xF6lhet\u0151. Pr\xF3b\xE1ld ink\xE1bb inaktiv\xE1lni.",
  "users.deleteFailedBecause": "Nem t\xF6r\xF6lhet\u0151: {reason}. Pr\xF3b\xE1ld ink\xE1bb inaktiv\xE1lni.",
  "users.inactive": "inakt\xEDv",
  "users.new": "\xDAj felhaszn\xE1l\xF3",
  "users.none": "Nincsenek felhaszn\xE1l\xF3k",
  "users.onlyActive": "Csak akt\xEDvak",
  "users.onlyInactive": "Csak inakt\xEDvak",
  "users.saveFailed": "A m\xF3dos\xEDt\xE1sokat nem siker\xFClt menteni.",
  "users.saveFailedBecause": "A m\xF3dos\xEDt\xE1sokat nem siker\xFClt menteni: {reason}",
  "users.title": "Felhaszn\xE1l\xF3k kezel\xE9se"
};

// src/locales/sk.ts
var sk = {
  "common.actions": "Akcie",
  "common.cancel": "Zru\u0161i\u0165",
  "common.close": "Zavrie\u0165",
  "common.delete": "Vymaza\u0165",
  "common.edit": "Upravi\u0165",
  "common.loading": "Na\u010D\xEDtavam\u2026",
  "common.no": "Nie",
  "common.save": "Ulo\u017Ei\u0165",
  "common.saved": "Ulo\u017Een\xE9",
  "common.saving": "Uklad\xE1m\u2026",
  "common.yes": "\xC1no",
  "account.changePassword": "Zmeni\u0165 heslo",
  "account.currentPassword": "S\xFA\u010Dasn\xE9 heslo",
  "account.details": "Moje \xFAdaje",
  "account.emailRequired": "E-mail je povinn\xFD.",
  "account.language": "Jazyk",
  "account.languageFailed": "Jazyk sa nepodarilo zmeni\u0165. Sk\xFAs to znova.",
  "account.languageHint": "Jazyk, v ktorom ti aplik\xE1cia zobrazuje texty.",
  "account.passwordChanged": "Heslo bolo zmenen\xE9.",
  "account.passwordFailed": "Zmena hesla zlyhala. Sk\xFAs to znova.",
  "account.passwordTitle": "Zmena hesla",
  "account.repeatPassword": "Zopakuj nov\xE9 heslo",
  "account.saved": "\xDAdaje boli ulo\u017Een\xE9.",
  "account.saveFailed": "Ulo\u017Eenie zlyhalo. Sk\xFAs to znova.",
  "account.telegramHowTo": 'Ako za\u010Da\u0165 dost\xE1va\u0165 upozornenia na Telegram: nap\xED\u0161 n\xE1\u0161mu botovi /start, zisti svoje chat ID (napr. cez @userinfobot), vlo\u017E ho vy\u0161\u0161ie, ulo\u017E a klikni \u201EPosla\u0165 test".',
  "account.telegramPlaceholder": "napr. 123456789 (notifik\xE1cie)",
  "account.telegramSending": "Posielam\u2026",
  "account.telegramTest": "Posla\u0165 test",
  "account.telegramTestFailed": "Test zlyhal (chyba spojenia).",
  "agents.default": "\u2014 Predvolen\xFD \u2014",
  "agents.description": "Pre ka\u017Ed\xFA rolu vyber, ktor\xFD AI model pou\u017Eije a ako d\xF4kladne m\xE1 uva\u017Eova\u0165 (vy\u0161\u0161ia \xFArove\u0148 = d\xF4kladnej\u0161ie, ale pomal\u0161ie a drah\u0161ie). Nevyplnen\xE9 pole = ponech\xE1 sa predvolen\xE9 nastavenie.",
  "agents.effort": "\xDArove\u0148",
  "agents.effort.low": "N\xEDzka",
  "agents.effort.medium": "Stredn\xE1",
  "agents.effort.high": "Vysok\xE1",
  "agents.effort.xhigh": "Ve\u013Emi vysok\xE1",
  "agents.effort.max": "Maxim\xE1lna",
  "agents.helperDefault": "\u2014 Predvolen\xFD (lacn\xFD/r\xFDchly) \u2014",
  "agents.helperHint": "Model dynamick\xFDch pomocn\xEDkov pre paraleln\xFA/hromadn\xFA pr\xE1cu. Predvolene lacn\xFD/r\xFDchly; zv\xFD\u0161 na siln\xFD len pre prioritn\xFD build (drah\u0161ie tokeny).",
  "agents.helperModel": "Model pomocn\xEDkov",
  "agents.model": "Model",
  "agents.title": "Agenti \u2014 model a \xFArove\u0148 uva\u017Eovania",
  "api.requestFailed": "Po\u017Eiadavka zlyhala ({status}).",
  "code.copied": "Skop\xEDrovan\xE9",
  "code.copy": "Kop\xEDrova\u0165",
  "login.email": "Email",
  "login.failed": "Prihl\xE1senie zlyhalo.",
  "login.loading": "Prihlasovanie\u2026",
  "login.password": "Heslo",
  "login.submit": "Prihl\xE1si\u0165 sa",
  "login.username": "Pou\u017E\xEDvate\u013Esk\xE9 meno",
  "password.minPlaceholder": { one: "min. {count} znak", few: "min. {count} znaky", other: "min. {count} znakov" },
  "password.mismatch": "Hesl\xE1 sa nezhoduj\xFA.",
  "password.new": "Nov\xE9 heslo",
  "password.tooShort": {
    one: "Heslo mus\xED ma\u0165 aspo\u0148 {count} znak.",
    few: "Heslo mus\xED ma\u0165 aspo\u0148 {count} znaky.",
    other: "Heslo mus\xED ma\u0165 aspo\u0148 {count} znakov."
  },
  "password.tooShortCount": {
    one: "Heslo mus\xED ma\u0165 aspo\u0148 {count} znak ({length}/{count}).",
    few: "Heslo mus\xED ma\u0165 aspo\u0148 {count} znaky ({length}/{count}).",
    other: "Heslo mus\xED ma\u0165 aspo\u0148 {count} znakov ({length}/{count})."
  },
  "resize.hint": "{label} \u2014 potiahni, \u0161\xEDpkami, dvojklik vr\xE1ti predvolen\xFA",
  "sessions.clearFilter": "Zru\u0161i\u0165 filter",
  "sessions.col.created": "Vytvoren\xE9",
  "sessions.col.id": "ID rel\xE1cie",
  "sessions.col.lastSeen": "Naposledy viden\xFD",
  "sessions.col.tokenVersion": "tv",
  "sessions.col.user": "Pou\u017E\xEDvate\u013E",
  "sessions.confirmRevoke": "Zru\u0161i\u0165 rel\xE1ciu?",
  "sessions.description": "Kto je prihl\xE1sen\xFD a odkedy.",
  "sessions.filteredBy": "Filtrovan\xE9 pod\u013Ea pou\u017E\xEDvate\u013Ea:",
  "sessions.none": "\u017Diadne rel\xE1cie",
  "sessions.revoke": "Zru\u0161i\u0165",
  "sessions.revokeFailed": "Nepodarilo sa zru\u0161i\u0165 rel\xE1ciu.",
  "sessions.revokeFailedBecause": "Nepodarilo sa zru\u0161i\u0165 rel\xE1ciu: {reason}",
  "sessions.title": "Rel\xE1cie pou\u017E\xEDvate\u013Ea",
  "settings.tab.account": "Moje konto",
  "settings.tab.agents": "Agenti",
  "settings.tab.sessions": "Rel\xE1cie",
  "settings.tab.system": "Syst\xE9m",
  "settings.tab.users": "Pou\u017E\xEDvatelia",
  "settings.title": "Nastavenia",
  "sidebar.closeMenu": "Zavrie\u0165 ponuku",
  "sidebar.collapse": "Z\xFA\u017Ei\u0165",
  "sidebar.expand": "Roz\u0161\xEDri\u0165",
  "sidebar.width": "\u0160\xEDrka bo\u010Dn\xE9ho panela",
  "system.appliesSoon": "Zmena plat\xED najnesk\xF4r do 30 sek\xFAnd.",
  "system.changed": "Zmenen\xE9",
  "system.choicesUnavailable": "Ponuka sa teraz ned\xE1 na\u010D\xEDta\u0165 \u2014 nastavenie sa zatia\u013E ned\xE1 zmeni\u0165.",
  "system.defaultValue": "Predvolen\xE1 hodnota.",
  "system.description": "Nastavenia, ktor\xE9 sa menia za behu aplik\xE1cie.",
  "system.noPermission": "Read-only \u2014 na \xFApravu ch\xFDba opr\xE1vnenie.",
  "system.notChosen": "\u2014 nevybrat\xE9 \u2014",
  "system.notOffered": "{value} (nie je v ponuke)",
  "system.otherCategory": "Ostatn\xE9",
  "system.readOnlyHint": "Len na \u010D\xEDtanie \u2014 meni\u0165 ich m\xF4\u017Ee spr\xE1vca.",
  "system.title": "Syst\xE9mov\xE9 nastavenia",
  "system.unknownError": "Nezn\xE1ma chyba.",
  "table.empty": "\u017Diadne d\xE1ta",
  "theme.dark": "Tmav\xE1 t\xE9ma",
  "theme.light": "Svetl\xE1 t\xE9ma",
  "theme.toDark": "Prepn\xFA\u0165 na tmav\xFA t\xE9mu",
  "theme.toLight": "Prepn\xFA\u0165 na svetl\xFA t\xE9mu",
  "updates.none": "Zatia\u013E \u017Eiadne aktualiz\xE1cie.",
  "updates.subtitle": "\u010Co je nov\xE9 v jednotliv\xFDch verzi\xE1ch.",
  "updates.subtitleFor": "\u010Co je nov\xE9 v jednotliv\xFDch verzi\xE1ch {app}.",
  "updates.title": "Aktualiz\xE1cie",
  "user.active": "Akt\xEDvny",
  "user.email": "Email",
  "user.emailRequired": "Email *",
  "user.firstName": "Meno",
  "user.lastName": "Priezvisko",
  "user.logout": "Odhl\xE1si\u0165 sa",
  "user.role": "Rola",
  "user.telegram": "Telegram chat_id",
  "user.username": "Pou\u017E\xEDvate\u013Esk\xE9 meno",
  "userForm.create": "Vytvori\u0165",
  "userForm.createTitle": "Vytvori\u0165 pou\u017E\xEDvate\u013Ea",
  "userForm.creating": "Vytv\xE1ram\u2026",
  "userForm.editTitle": "Upravi\u0165 pou\u017E\xEDvate\u013Ea",
  "userForm.emailPlaceholder": "napr. tibi@isnex.ai",
  "userForm.firstNamePlaceholder": "napr. Tibor",
  "userForm.lastNamePlaceholder": "napr. Rausch",
  "userForm.passwordKeep": "(nechaj pr\xE1zdne ak nemeni\u0165)",
  "userForm.passwordRequired": "Heslo *",
  "userForm.telegramPlaceholder": "napr. 123456789 (notifik\xE1cie agenta)",
  "userForm.usernameFixed": "Pou\u017E\xEDvate\u013Esk\xE9 meno sa po vytvoren\xED nemen\xED (zachov\xE1va login stabilitu).",
  "userForm.usernamePlaceholder": "napr. tibi",
  "users.activate": "Aktivova\u0165",
  "users.active": "akt\xEDvny",
  "users.allRoles": "V\u0161etky role",
  "users.anyState": "Ak\xFDko\u013Evek stav",
  "users.col.language": "Jazyk",
  "users.col.name": "Meno",
  "users.col.state": "Stav",
  "users.confirmDelete": "Naozaj vymaza\u0165?",
  "users.count": { one: "{count} pou\u017E\xEDvate\u013E", few: "{count} pou\u017E\xEDvatelia", other: "{count} pou\u017E\xEDvate\u013Eov" },
  "users.createFailed": "Nepodarilo sa vytvori\u0165 pou\u017E\xEDvate\u013Ea.",
  "users.createFailedBecause": "Nepodarilo sa vytvori\u0165 pou\u017E\xEDvate\u013Ea: {reason}",
  "users.deactivate": "Deaktivova\u0165",
  "users.deleteFailed": "Ned\xE1 sa vymaza\u0165. Sk\xFAs miesto toho deaktivova\u0165.",
  "users.deleteFailedBecause": "Ned\xE1 sa vymaza\u0165: {reason}. Sk\xFAs miesto toho deaktivova\u0165.",
  "users.inactive": "neakt\xEDvny",
  "users.new": "Nov\xFD pou\u017E\xEDvate\u013E",
  "users.none": "\u017Diadni pou\u017E\xEDvatelia",
  "users.onlyActive": "Len akt\xEDvni",
  "users.onlyInactive": "Len neakt\xEDvni",
  "users.saveFailed": "Nepodarilo sa ulo\u017Ei\u0165 zmeny.",
  "users.saveFailedBecause": "Nepodarilo sa ulo\u017Ei\u0165 zmeny: {reason}",
  "users.title": "Spr\xE1va pou\u017E\xEDvate\u013Eov"
};

// src/i18n.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var LANGUAGES = [
  { code: "sk", name: "Sloven\u010Dina", locale: "sk-SK" },
  { code: "hu", name: "Magyar", locale: "hu-HU" },
  // DEV-397: English as Europe writes it — day before month, a 24-hour clock.
  { code: "en", name: "English", locale: "en-GB" }
];
var DEFAULT_LANGUAGE = "sk";
var CATALOGS = { sk, hu, en };
function isLanguage(value) {
  return LANGUAGES.some((l) => l.code === value);
}
function localeOf(language) {
  return LANGUAGES.find((l) => l.code === language)?.locale ?? "sk-SK";
}
function fill(text, params) {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (whole, name) => name in params ? String(params[name]) : whole);
}
function createTranslator(language, messages = {}) {
  const locale = localeOf(language);
  const plural = new Intl.PluralRules(locale);
  const lookup = (key) => messages[language]?.[key] ?? CATALOGS[language][key] ?? messages[DEFAULT_LANGUAGE]?.[key] ?? CATALOGS[DEFAULT_LANGUAGE][key];
  return (key, params) => {
    const found = lookup(key);
    if (found === void 0) return key;
    if (typeof found === "string") return fill(found, params);
    const count = Number(params?.count ?? 0);
    const category = plural.select(count);
    return fill(found[category] ?? found.other, params);
  };
}
var DEFAULT_STATE = {
  language: DEFAULT_LANGUAGE,
  locale: localeOf(DEFAULT_LANGUAGE),
  t: createTranslator(DEFAULT_LANGUAGE)
};
var I18nContext = createContext4(DEFAULT_STATE);
var lastLanguage = DEFAULT_LANGUAGE;
var lastTranslator = DEFAULT_STATE.t;
function currentTranslator() {
  return lastTranslator;
}
function currentLanguage() {
  return lastLanguage;
}
function I18nProvider({ language, messages, children }) {
  const code = isLanguage(language) ? language : DEFAULT_LANGUAGE;
  const state = useMemo2(() => {
    const t = createTranslator(code, messages);
    lastLanguage = code;
    lastTranslator = t;
    return { language: code, locale: localeOf(code), t };
  }, [code, messages]);
  return /* @__PURE__ */ jsx3(I18nContext.Provider, { value: state, children });
}
function useT() {
  return useContext4(I18nContext).t;
}
function useLanguage() {
  const { language, locale } = useContext4(I18nContext);
  return { language, locale };
}
function formatDateTime(value, locale) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "\u2014" : date.toLocaleString(locale);
}

// src/ResizeHandle.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
var KEY_STEP = 16;
var clamp = (value, min, max) => Math.min(max, Math.max(min, Math.round(value)));
function ResizeHandle({
  value,
  min,
  max,
  defaultValue,
  panel,
  onResize,
  onResizeEnd,
  label,
  className = ""
}) {
  const t = useT();
  const drag = useRef2(null);
  const direction = panel === "left" ? 1 : -1;
  const finish = (width) => {
    onResize(width);
    onResizeEnd(width);
  };
  const onPointerDown = (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { startX: event.clientX, startWidth: value, width: value, moved: false };
  };
  const onPointerMove = (event) => {
    const d = drag.current;
    if (!d) return;
    d.width = clamp(d.startWidth + (event.clientX - d.startX) * direction, min, max);
    d.moved = true;
    onResize(d.width);
  };
  const onPointerUp = (event) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (d.moved) onResizeEnd(d.width);
  };
  const onKeyDown = (event) => {
    const keys = {
      ArrowRight: value + KEY_STEP * direction,
      ArrowLeft: value - KEY_STEP * direction,
      Home: min,
      End: max
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const width = clamp(keys[event.key], min, max);
    if (width !== value) finish(width);
  };
  return /* @__PURE__ */ jsx4(
    "div",
    {
      role: "separator",
      "aria-orientation": "vertical",
      "aria-label": label,
      "aria-valuenow": value,
      "aria-valuemin": min,
      "aria-valuemax": max,
      title: t("resize.hint", { label }),
      tabIndex: 0,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onKeyDown,
      onDoubleClick: () => value !== defaultValue && finish(clamp(defaultValue, min, max)),
      className: `z-20 w-1.5 cursor-col-resize touch-none select-none transition-colors hover:bg-[var(--color-accent-primary)]/40 focus-visible:bg-[var(--color-accent-primary)]/60 focus-visible:outline-none ${className}`.trim()
    }
  );
}

// src/rememberedWidth.ts
import { useCallback as useCallback2, useEffect as useEffect3, useState as useState3 } from "react";
var SIDEBAR_WIDTH_KEY_PREFIX = "nex-shared:sidebar-width:";
function storage() {
  return typeof window === "undefined" ? null : window.localStorage;
}
function readRememberedWidth(user, min, max) {
  if (!user) return void 0;
  try {
    const raw = storage()?.getItem(SIDEBAR_WIDTH_KEY_PREFIX + user);
    if (raw == null) return void 0;
    const width = Number(raw);
    return Number.isFinite(width) ? Math.min(max, Math.max(min, Math.round(width))) : void 0;
  } catch {
    return void 0;
  }
}
function rememberWidth(user, width, defaultWidth) {
  if (!user) return;
  try {
    const store = storage();
    if (width === defaultWidth) store?.removeItem(SIDEBAR_WIDTH_KEY_PREFIX + user);
    else store?.setItem(SIDEBAR_WIDTH_KEY_PREFIX + user, String(width));
  } catch {
  }
}
function useRememberedSidebarWidth(user, { min, max, defaultWidth }) {
  const [width, setWidth] = useState3(() => readRememberedWidth(user, min, max));
  useEffect3(() => {
    setWidth(readRememberedWidth(user, min, max));
  }, [user, min, max]);
  const onWidthChange = useCallback2(
    (next) => {
      rememberWidth(user, next, defaultWidth);
      setWidth(next === defaultWidth ? void 0 : next);
    },
    [user, defaultWidth]
  );
  return { width, onWidthChange: user ? onWidthChange : void 0 };
}

// src/Sidebar.tsx
import { jsx as jsx5, jsxs as jsxs2 } from "react/jsx-runtime";
var SIDEBAR_DEFAULT_WIDTH = 224;
var IconClose = () => /* @__PURE__ */ jsx5("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsx5("path", { d: "M6 6l12 12M18 6L6 18", strokeWidth: "1.8", strokeLinecap: "round" }) });
var IconSidebarToggle = () => /* @__PURE__ */ jsxs2("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
  /* @__PURE__ */ jsx5("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", strokeWidth: "1.8" }),
  /* @__PURE__ */ jsx5("path", { d: "M9 3v18", strokeWidth: "1.8" })
] });
function Sidebar({
  collapsed,
  onToggleCollapse,
  logo,
  footer,
  children,
  collapseTitle,
  expandTitle,
  closeMenuTitle,
  dense = false,
  compactRows = false,
  width,
  onWidthChange,
  minWidth = 180,
  maxWidth = 360,
  defaultWidth = SIDEBAR_DEFAULT_WIDTH,
  resizeLabel,
  rememberWidthFor
}) {
  const t = useT();
  const { narrow, closeMenu } = useShell();
  const rail = collapsed && !narrow;
  const [dragged, setDragged] = useState4(null);
  const remembered = useRememberedSidebarWidth(onWidthChange == null ? rememberWidthFor : null, {
    min: minWidth,
    max: maxWidth,
    defaultWidth
  });
  const ownWidth = onWidthChange != null ? width : remembered.width;
  const changeWidth = onWidthChange ?? remembered.onWidthChange;
  const expanded = dragged ?? ownWidth ?? defaultWidth;
  const resizable = changeWidth != null && !narrow && !rail;
  const shown = rail ? "3.5rem" : dragged != null || ownWidth != null ? `${expanded}px` : "14rem";
  return /* @__PURE__ */ jsx5(CollapseContext.Provider, { value: rail, children: /* @__PURE__ */ jsx5(DensityContext.Provider, { value: dense, children: /* @__PURE__ */ jsx5(CompactRowsContext.Provider, { value: dense && compactRows, children: /* @__PURE__ */ jsxs2(
    "aside",
    {
      className: `relative flex-shrink-0 bg-[var(--color-surface)] border-r border-[var(--color-border-default)] flex flex-col select-none overflow-x-hidden ${dragged == null ? "transition-all duration-200" : ""}`,
      style: { width: shown },
      children: [
        /* @__PURE__ */ jsxs2(
          "div",
          {
            className: `border-b border-[var(--color-border-default)] flex items-center ${dense ? "px-3 py-2 gap-2 min-h-[48px]" : "px-3 py-3 gap-3 min-h-[56px]"}`,
            children: [
              !rail && logo,
              narrow ? /* @__PURE__ */ jsx5(
                "button",
                {
                  type: "button",
                  onClick: closeMenu,
                  className: "ml-auto flex items-center justify-center rounded text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors shrink-0 w-8 h-8",
                  title: closeMenuTitle ?? t("sidebar.closeMenu"),
                  "aria-label": closeMenuTitle ?? t("sidebar.closeMenu"),
                  children: /* @__PURE__ */ jsx5(IconClose, {})
                }
              ) : /* @__PURE__ */ jsx5(
                "button",
                {
                  type: "button",
                  onClick: onToggleCollapse,
                  className: `flex items-center justify-center rounded text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors shrink-0 ${rail ? "w-8 h-8" : "w-6 h-6"}`,
                  title: rail ? expandTitle ?? t("sidebar.expand") : collapseTitle ?? t("sidebar.collapse"),
                  children: /* @__PURE__ */ jsx5(IconSidebarToggle, {})
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx5("nav", { className: "flex-1 p-2 space-y-0.5 overflow-y-auto overflow-x-hidden", children }),
        footer != null && /* @__PURE__ */ jsx5("div", { className: `border-t border-[var(--color-border-default)] ${dense ? "px-2 py-1.5" : "p-3"}`, children: footer }),
        resizable && /* @__PURE__ */ jsx5(
          ResizeHandle,
          {
            value: expanded,
            min: minWidth,
            max: maxWidth,
            defaultValue: defaultWidth,
            panel: "left",
            onResize: setDragged,
            onResizeEnd: (w) => {
              setDragged(null);
              if (w !== (ownWidth ?? defaultWidth)) changeWidth?.(w);
            },
            label: resizeLabel ?? t("sidebar.width"),
            className: "absolute inset-y-0 right-0"
          }
        )
      ]
    }
  ) }) }) });
}

// src/Page.tsx
import { jsx as jsx6, jsxs as jsxs3 } from "react/jsx-runtime";
var WIDTH = {
  full: "w-full",
  narrow: "w-full max-w-3xl"
};
function Page({ title, subtitle, actions, width = "full", className = "", children, ...rest }) {
  return /* @__PURE__ */ jsxs3("div", { className: `${WIDTH[width]} ${className}`.trim(), ...rest, children: [
    (title != null || actions != null) && /* @__PURE__ */ jsxs3("div", { className: "mb-5 flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs3("div", { className: "min-w-0", children: [
        title != null && /* @__PURE__ */ jsx6("h1", { className: "text-xl font-bold text-[var(--color-text-primary)]", children: title }),
        subtitle != null && /* @__PURE__ */ jsx6("p", { className: "mt-1 text-sm text-[var(--color-text-secondary)]", children: subtitle })
      ] }),
      actions != null && /* @__PURE__ */ jsx6("div", { className: "flex flex-wrap items-center gap-2", children: actions })
    ] }),
    children
  ] });
}

// src/SectionDivider.tsx
import { jsx as jsx7 } from "react/jsx-runtime";
function SectionDivider() {
  return /* @__PURE__ */ jsx7("hr", { className: "mx-2 my-1.5 border-0 border-t border-[var(--color-border-default)]" });
}

// src/NavItem.tsx
import { Fragment as Fragment2, jsx as jsx8, jsxs as jsxs4 } from "react/jsx-runtime";
function NavItem({
  icon,
  label,
  active,
  disabled,
  disabledTitle,
  badge,
  badgeLabel,
  badgeTone = "attention",
  count,
  onClick,
  href
}) {
  const collapsed = useCollapsed();
  const dense = useDense();
  const compact = useCompactRows();
  const { closeMenu } = useShell();
  const choose = () => {
    onClick?.();
    closeMenu();
  };
  const height = dense ? compact ? "h-[26px]" : "h-7" : "h-[35px]";
  const base = `flex items-center gap-2.5 ${height} rounded-lg text-sm transition-colors w-full`;
  const px = collapsed ? "px-0 justify-center" : "px-3";
  const color = disabled ? "text-[var(--color-text-muted)] opacity-40 cursor-not-allowed" : active ? "bg-primary-600/10 text-[var(--color-accent-primary)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]";
  const tooltip = disabled ? disabledTitle ?? label : collapsed ? label : void 0;
  const className = `${base} ${px} ${color} relative`;
  const inner = /* @__PURE__ */ jsxs4(Fragment2, { children: [
    icon,
    !collapsed && /* @__PURE__ */ jsx8("span", { className: "min-w-0 truncate", title: disabled ? void 0 : label, children: label }),
    !collapsed && count != null && count > 0 && /* @__PURE__ */ jsxs4("span", { className: "shrink-0 tabular-nums", children: [
      "(",
      count,
      ")"
    ] }),
    badge && /* @__PURE__ */ jsx8(
      "span",
      {
        "aria-label": badgeLabel,
        "data-tone": badgeTone,
        className: `${collapsed ? "absolute right-1 top-1" : "ml-auto"} h-2 w-2 rounded-full ${badgeTone === "danger" ? "bg-[var(--color-status-error)]" : "bg-[var(--color-status-in-design)]"}`
      }
    )
  ] });
  if (href && !disabled) {
    return /* @__PURE__ */ jsx8("a", { className, href, title: tooltip, onClick: choose, children: inner });
  }
  const handleClick = () => {
    if (disabled) return;
    choose();
  };
  return /* @__PURE__ */ jsx8("button", { type: "button", className, onClick: handleClick, disabled, title: tooltip, children: inner });
}

// src/SectionLabel.tsx
import { jsx as jsx9 } from "react/jsx-runtime";
function SectionLabel({ label }) {
  const collapsed = useCollapsed();
  if (collapsed) return /* @__PURE__ */ jsx9("div", { className: "h-3" });
  return /* @__PURE__ */ jsx9("div", { className: "pt-3 pb-1 px-3 text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-semibold", children: label });
}

// src/Header.tsx
import { Fragment as Fragment3, jsx as jsx10, jsxs as jsxs5 } from "react/jsx-runtime";
function Header({ left, right, children, className = "" }) {
  return /* @__PURE__ */ jsx10(
    "header",
    {
      className: `min-h-10 flex-shrink-0 bg-[var(--color-surface)] border-b border-[var(--color-border-default)] flex items-center px-3 gap-3 z-10 select-none ${className}`.trim(),
      children: children ?? /* @__PURE__ */ jsxs5(Fragment3, { children: [
        left,
        right != null && /* @__PURE__ */ jsx10("div", { className: "ml-auto flex items-center gap-3", children: right })
      ] })
    }
  );
}

// src/Brand.tsx
import { Fragment as Fragment4, jsx as jsx11, jsxs as jsxs6 } from "react/jsx-runtime";
function Brand({ initials, name, version, squareClassName = "bg-primary-600" }) {
  const dense = useDense();
  return /* @__PURE__ */ jsxs6(Fragment4, { children: [
    /* @__PURE__ */ jsx11(
      "div",
      {
        className: `${dense ? "w-7 h-7 text-xs" : "w-8 h-8 text-sm"} rounded-lg ${squareClassName} flex items-center justify-center text-white font-black shrink-0`,
        children: initials
      }
    ),
    /* @__PURE__ */ jsxs6("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsx11(
        "div",
        {
          className: `text-[14px] font-bold text-[var(--color-text-primary)] leading-tight ${dense ? "truncate" : ""}`,
          title: dense ? name : void 0,
          children: name
        }
      ),
      version != null && version !== "" && // Indigo (brand-tinted) version line — the NEX Studio vzor (primary-400,
      // resolves in both light & dark). All apps converge on this, not Inbox's violet.
      /* @__PURE__ */ jsx11("div", { className: `text-[10px] text-primary-400 font-mono ${dense ? "truncate" : ""}`, title: dense ? version : void 0, children: version })
    ] })
  ] });
}

// src/UserCard.tsx
import { Fragment as Fragment5, jsx as jsx12, jsxs as jsxs7 } from "react/jsx-runtime";
function UserCard({
  initials,
  name,
  subtitle,
  onLogout,
  logoutTitle,
  actions
}) {
  const t = useT();
  const collapsed = useCollapsed();
  const dense = useDense();
  return /* @__PURE__ */ jsxs7("div", { className: `flex items-center gap-2.5 px-2 py-1.5 rounded-lg ${collapsed ? "flex-col justify-center" : ""}`, children: [
    /* @__PURE__ */ jsx12("div", { className: "w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold text-white shrink-0", children: initials }),
    collapsed && actions,
    !collapsed && /* @__PURE__ */ jsxs7(Fragment5, { children: [
      /* @__PURE__ */ jsxs7("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx12("div", { className: "text-xs font-medium text-[var(--color-text-primary)] truncate", children: name }),
        subtitle != null && subtitle !== "" && /* @__PURE__ */ jsx12(
          "div",
          {
            className: `text-[10px] text-[var(--color-text-muted)] ${dense ? "truncate" : ""}`,
            title: dense ? subtitle : void 0,
            children: subtitle
          }
        )
      ] }),
      actions,
      onLogout != null && /* @__PURE__ */ jsx12(
        "button",
        {
          type: "button",
          onClick: onLogout,
          title: logoutTitle ?? t("user.logout"),
          className: "shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors",
          children: /* @__PURE__ */ jsxs7(
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
                /* @__PURE__ */ jsx12("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
                /* @__PURE__ */ jsx12("polyline", { points: "16 17 21 12 16 7" }),
                /* @__PURE__ */ jsx12("line", { x1: "21", y1: "12", x2: "9", y2: "12" })
              ]
            }
          )
        }
      )
    ] })
  ] });
}

// src/ThemeToggle.tsx
import { jsx as jsx13, jsxs as jsxs8 } from "react/jsx-runtime";
var SunIcon = () => /* @__PURE__ */ jsxs8(
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
      /* @__PURE__ */ jsx13("circle", { cx: "12", cy: "12", r: "4" }),
      /* @__PURE__ */ jsx13("path", { d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" })
    ]
  }
);
var MoonIcon = () => /* @__PURE__ */ jsx13(
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
    children: /* @__PURE__ */ jsx13("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" })
  }
);
function ThemeToggle({
  theme,
  onToggle,
  toLightLabel,
  toDarkLabel,
  toLightTitle,
  toDarkTitle
}) {
  const t = useT();
  const isDark = theme === "dark";
  const label = isDark ? toLightLabel ?? t("theme.toLight") : toDarkLabel ?? t("theme.toDark");
  const title = isDark ? toLightTitle ?? t("theme.light") : toDarkTitle ?? t("theme.dark");
  return /* @__PURE__ */ jsx13(
    "button",
    {
      type: "button",
      onClick: onToggle,
      "aria-label": label,
      title,
      className: "p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] transition-colors",
      children: isDark ? /* @__PURE__ */ jsx13(SunIcon, {}) : /* @__PURE__ */ jsx13(MoonIcon, {})
    }
  );
}

// src/NavIcon.tsx
import { jsx as jsx14 } from "react/jsx-runtime";
function NavIcon({ glyph }) {
  return /* @__PURE__ */ jsx14(
    "span",
    {
      "aria-hidden": "true",
      className: "text-base leading-none shrink-0 w-4 h-4 overflow-hidden inline-flex items-center justify-center",
      children: glyph
    }
  );
}

// src/Input.tsx
import { jsx as jsx15 } from "react/jsx-runtime";
var BASE2 = "w-full bg-[var(--color-surface)] border rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-focus)]";
function Input({ invalid, className = "", ...rest }) {
  const border = invalid ? "border-red-500" : "border-[var(--color-border-default)]";
  return /* @__PURE__ */ jsx15(
    "input",
    {
      className: `${BASE2} ${border} ${className}`.trim(),
      "aria-invalid": invalid || void 0,
      ...rest
    }
  );
}

// src/Select.tsx
import { jsx as jsx16 } from "react/jsx-runtime";
var BASE3 = "w-full bg-[var(--color-surface)] border rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-focus)]";
function Select({ invalid, className = "", children, ...rest }) {
  const border = invalid ? "border-red-500" : "border-[var(--color-border-default)]";
  return /* @__PURE__ */ jsx16(
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
import { jsx as jsx17 } from "react/jsx-runtime";
var BASE4 = "rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-sm)]";
var DEFAULT_PADDING = "p-5";
var HAS_PADDING = /(^|\s)p-\S+/;
function Card({ className = "", children, ...rest }) {
  const padding = HAS_PADDING.test(className) ? "" : DEFAULT_PADDING;
  return /* @__PURE__ */ jsx17("div", { className: [BASE4, padding, className].filter(Boolean).join(" "), ...rest, children });
}

// src/Badge.tsx
import { jsx as jsx18 } from "react/jsx-runtime";
var BASE5 = "inline-flex items-center whitespace-nowrap rounded px-1.5 py-0.5 text-xs";
var VARIANT2 = {
  neutral: "bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]",
  muted: "bg-[var(--color-state-muted-bg)] text-[var(--color-state-muted-fg)]"
};
function Badge({ variant = "neutral", pulse = false, className = "", children, ...rest }) {
  return /* @__PURE__ */ jsx18(
    "span",
    {
      className: `${BASE5} ${VARIANT2[variant]} ${pulse ? "animate-pulse" : ""} ${className}`.replace(/\s+/g, " ").trim(),
      ...rest,
      children
    }
  );
}

// src/StatusBadge.tsx
import { jsx as jsx19 } from "react/jsx-runtime";
var BASE6 = "inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-medium";
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
  return /* @__PURE__ */ jsx19(
    "span",
    {
      className: `${BASE6} ${STATUS[status]} ${pulse ? "animate-pulse" : ""} ${className}`.replace(/\s+/g, " ").trim(),
      ...rest,
      children
    }
  );
}

// src/IconButton.tsx
import { jsx as jsx20 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx20(
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
import { jsx as jsx21, jsxs as jsxs9 } from "react/jsx-runtime";
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
  emptyMessage,
  className = ""
}) {
  const t = useT();
  const colCount = columns.length + (rowActions ? 1 : 0);
  return /* @__PURE__ */ jsx21(
    "div",
    {
      "data-scroll-x": true,
      className: `rounded-xl border border-[var(--color-border-default)] overflow-x-auto ${className}`.trim(),
      children: /* @__PURE__ */ jsxs9("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx21("thead", { className: "bg-[var(--color-surface-hover)]", children: /* @__PURE__ */ jsxs9("tr", { className: "text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]", children: [
          columns.map((col) => /* @__PURE__ */ jsx21(
            "th",
            {
              className: `whitespace-nowrap px-4 py-2.5 font-semibold ${ALIGN[col.align ?? "left"]}`,
              children: col.header
            },
            col.key
          )),
          rowActions && /* @__PURE__ */ jsx21("th", { className: "whitespace-nowrap px-4 py-2.5 font-semibold text-right", children: rowActionsHeader })
        ] }) }),
        /* @__PURE__ */ jsxs9("tbody", { className: "divide-y divide-[var(--color-border-default)]", children: [
          rows.map((row) => /* @__PURE__ */ jsxs9(
            "tr",
            {
              className: "hover:bg-[var(--color-surface-hover)] transition-colors",
              children: [
                columns.map((col) => /* @__PURE__ */ jsx21(
                  "td",
                  {
                    className: `${col.wrap ? "" : "whitespace-nowrap "}px-4 py-3 text-[var(--color-text-secondary)] ${ALIGN[col.align ?? "left"]} ${col.className ?? ""}`.trim(),
                    children: col.render ? col.render(row) : defaultCell(row, col.key)
                  },
                  col.key
                )),
                rowActions && /* @__PURE__ */ jsx21("td", { className: "whitespace-nowrap px-4 py-3 text-right", children: /* @__PURE__ */ jsx21("div", { className: "flex items-center justify-end gap-2", children: rowActions(row) }) })
              ]
            },
            getRowKey(row)
          )),
          rows.length === 0 && /* @__PURE__ */ jsx21("tr", { children: /* @__PURE__ */ jsx21(
            "td",
            {
              colSpan: colCount,
              className: "px-4 py-6 text-center text-xs text-[var(--color-text-muted)]",
              children: emptyMessage ?? t("table.empty")
            }
          ) })
        ] })
      ] })
    }
  );
}

// src/FormGrid.tsx
import { Fragment as Fragment6, jsx as jsx22, jsxs as jsxs10 } from "react/jsx-runtime";
var GRID_COLS = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2"
};
function FormGrid({ columns = 2, className = "", children, ...rest }) {
  return /* @__PURE__ */ jsx22("div", { className: `grid ${GRID_COLS[columns]} gap-3 ${className}`.trim(), ...rest, children });
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
  return /* @__PURE__ */ jsxs10("div", { className: full ? "md:col-span-2" : void 0, children: [
    /* @__PURE__ */ jsxs10("label", { htmlFor, className: "block text-xs text-[var(--color-text-muted)] mb-1", children: [
      label,
      required && /* @__PURE__ */ jsx22("span", { className: "text-[var(--color-status-error)]", children: " *" })
    ] }),
    children,
    error ? /* @__PURE__ */ jsx22("div", { className: "mt-1 text-[10px] text-[var(--color-status-error)]", children: error }) : hint ? /* @__PURE__ */ jsx22("div", { className: "mt-1 text-[10px] text-[var(--color-text-muted)]", children: hint }) : null
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
  return /* @__PURE__ */ jsx22("div", { className: `flex gap-2 justify-end ${className}`.trim(), children: children ?? /* @__PURE__ */ jsxs10(Fragment6, { children: [
    cancelLabel != null && /* @__PURE__ */ jsx22(Button, { variant: "secondary", size: "sm", onClick: onCancel, children: cancelLabel }),
    submitLabel != null && /* @__PURE__ */ jsx22(Button, { variant: "primary", size: "sm", onClick: onSubmit, disabled: submitDisabled, children: submitLabel })
  ] }) });
}

// src/ReleaseNotes.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// src/CodeBlock.tsx
import { useCallback as useCallback3, useState as useState5 } from "react";
import { Fragment as Fragment7, jsx as jsx23, jsxs as jsxs11 } from "react/jsx-runtime";
var COPY_FEEDBACK_DURATION_MS = 2e3;
function useCopyToClipboard(resetDelay = COPY_FEEDBACK_DURATION_MS) {
  const [isCopied, setIsCopied] = useState5(false);
  const copy = useCallback3(
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
  const t = useT();
  const [copy, isCopied] = useCopyToClipboard();
  const code = String(children).replace(/\n$/, "");
  return /* @__PURE__ */ jsxs11("div", { className: "relative my-3", children: [
    /* @__PURE__ */ jsxs11("div", { className: "flex items-center justify-between bg-[var(--color-surface)] px-3 py-1.5 rounded-t border border-[var(--color-border-default)] border-b-0", children: [
      /* @__PURE__ */ jsx23("span", { className: "text-xs text-[var(--color-text-secondary)]", children: language || "code" }),
      /* @__PURE__ */ jsx23(
        "button",
        {
          onClick: () => copy(code),
          className: "flex items-center gap-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors",
          children: isCopied ? /* @__PURE__ */ jsxs11(Fragment7, { children: [
            /* @__PURE__ */ jsx23(
              "svg",
              {
                className: "w-3.5 h-3.5 text-[var(--color-status-success)]",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx23(
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
            /* @__PURE__ */ jsx23("span", { className: "text-[var(--color-status-success)]", children: t("code.copied") })
          ] }) : /* @__PURE__ */ jsxs11(Fragment7, { children: [
            /* @__PURE__ */ jsx23(
              "svg",
              {
                className: "w-3.5 h-3.5",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx23(
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
            /* @__PURE__ */ jsx23("span", { children: t("code.copy") })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsx23("pre", { className: "bg-[var(--color-canvas)] p-3 rounded-b border border-[var(--color-border-default)] border-t-0 overflow-x-auto m-0", children: /* @__PURE__ */ jsx23("code", { className: `text-sm ${language ? `language-${language}` : ""}`, children: code }) })
  ] });
}

// src/ReleaseNotes.tsx
import { Fragment as Fragment8, jsx as jsx24, jsxs as jsxs12 } from "react/jsx-runtime";
function formatDate(iso, locale) {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(d);
}
function MarkdownBody({ children }) {
  const body = children.replace(/^\s*##\s+\S.*(?:\r?\n)+/, "");
  return /* @__PURE__ */ jsx24(
    "div",
    {
      className: "prose prose-base dark:prose-invert max-w-none\n        prose-headings:font-semibold\n        prose-h3:text-primary-500 prose-h3:text-base prose-h3:mt-5 prose-h3:mb-1\n        prose-p:text-[var(--color-text-secondary)] prose-p:leading-relaxed\n        prose-strong:text-[var(--color-text-primary)]\n        prose-li:text-[var(--color-text-secondary)] prose-li:marker:text-primary-500",
      children: /* @__PURE__ */ jsx24(
        ReactMarkdown,
        {
          remarkPlugins: [remarkGfm],
          components: {
            code({ className, children: children2, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const isInline = !className && typeof children2 === "string" && !children2.includes("\n");
              if (!isInline && match) {
                return /* @__PURE__ */ jsx24(CodeBlock, { language: match[1], children: String(children2) });
              }
              if (!isInline && typeof children2 === "string" && children2.includes("\n")) {
                return /* @__PURE__ */ jsx24(CodeBlock, { children: String(children2) });
              }
              return /* @__PURE__ */ jsx24(
                "code",
                {
                  className: "bg-[var(--color-surface)] px-1.5 py-0.5 rounded text-sm",
                  ...props,
                  children: children2
                }
              );
            },
            pre({ children: children2 }) {
              return /* @__PURE__ */ jsx24(Fragment8, { children: children2 });
            }
          },
          children: body
        }
      )
    }
  );
}
function VersionCard({ note, defaultOpen }) {
  const { locale } = useLanguage();
  const date = formatDate(note.released_at, locale);
  return /* @__PURE__ */ jsx24(Card, { className: "p-0 overflow-hidden", children: /* @__PURE__ */ jsxs12("details", { open: defaultOpen, className: "group", children: [
    /* @__PURE__ */ jsxs12("summary", { className: "flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none list-none hover:bg-[var(--color-surface-hover)] transition-colors", children: [
      /* @__PURE__ */ jsxs12("span", { className: "flex items-baseline gap-2", children: [
        /* @__PURE__ */ jsx24("span", { className: "text-base font-bold text-primary-500", children: note.version }),
        date && /* @__PURE__ */ jsxs12("span", { className: "text-sm text-[var(--color-text-muted)]", children: [
          "\u2014 ",
          date
        ] })
      ] }),
      /* @__PURE__ */ jsx24(
        "svg",
        {
          className: "w-4 h-4 shrink-0 text-[var(--color-text-muted)] transition-transform group-open:rotate-180",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsx24(
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
    /* @__PURE__ */ jsx24("div", { className: "px-4 pb-4 pt-1 border-t border-[var(--color-border-default)]", children: /* @__PURE__ */ jsx24(MarkdownBody, { children: note.markdown }) })
  ] }) });
}
function ReleaseNotes({
  notes,
  loading = false,
  error = null,
  onDismissError,
  appName,
  width = "narrow"
}) {
  const t = useT();
  return (
    // DEV-251: at the left like every other page (DEV-244), narrow — text to read; DEV-332: full when the app asks.
    /* @__PURE__ */ jsxs12("div", { className: width === "full" ? "p-6" : "p-6 max-w-3xl", children: [
      /* @__PURE__ */ jsxs12("div", { className: "mb-5", children: [
        /* @__PURE__ */ jsxs12("h1", { className: "flex items-center gap-2 text-lg font-semibold text-[var(--color-text-primary)]", children: [
          /* @__PURE__ */ jsx24("span", { "aria-hidden": "true", className: "text-primary-500 leading-none", children: "\u2728" }),
          t("updates.title")
        ] }),
        /* @__PURE__ */ jsx24("p", { className: "mt-1 text-sm text-[var(--color-text-secondary)]", children: appName ? t("updates.subtitleFor", { app: appName }) : t("updates.subtitle") })
      ] }),
      error && /* @__PURE__ */ jsxs12("div", { className: "mb-4 px-3 py-2 rounded-lg bg-[var(--color-state-error-bg)] text-[var(--color-state-error-fg)] text-sm flex items-center justify-between", children: [
        /* @__PURE__ */ jsx24("span", { className: "truncate", children: error }),
        /* @__PURE__ */ jsx24(
          "button",
          {
            onClick: onDismissError,
            className: "ml-2 hover:opacity-80",
            "aria-label": t("common.close"),
            children: /* @__PURE__ */ jsx24(
              "svg",
              {
                className: "w-3.5 h-3.5",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx24(
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
      loading ? /* @__PURE__ */ jsxs12("div", { className: "flex items-center gap-2 py-10 justify-center text-[var(--color-text-secondary)] text-sm", children: [
        /* @__PURE__ */ jsx24(
          "svg",
          {
            className: "w-4 h-4 animate-spin",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /* @__PURE__ */ jsx24(
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
        t("common.loading")
      ] }) : notes.length === 0 ? /* @__PURE__ */ jsx24("div", { className: "rounded-xl border border-dashed border-[var(--color-border-default)] p-10 text-center text-sm text-[var(--color-text-muted)]", children: t("updates.none") }) : /* @__PURE__ */ jsx24("div", { className: "flex flex-col gap-3", children: notes.map((note, i) => /* @__PURE__ */ jsx24(VersionCard, { note, defaultOpen: i === 0 }, note.version)) })
    ] })
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
function refusalSentence(err) {
  if (!(err instanceof ApiError)) {
    return "";
  }
  const data = err.data;
  const detail = data && typeof data === "object" ? data.detail : void 0;
  if (typeof detail === "string") {
    return detail.trim();
  }
  if (detail && typeof detail === "object") {
    const inner = detail.detail;
    if (typeof inner === "string") {
      return inner.trim();
    }
  }
  return "";
}
var _authCb = null;
function registerAuthCallback(cb) {
  _authCb = cb;
}
var _changeListeners = /* @__PURE__ */ new Set();
function onServerChange(listener) {
  _changeListeners.add(listener);
  return () => {
    _changeListeners.delete(listener);
  };
}
function announceChange(change) {
  for (const listener of [..._changeListeners]) {
    try {
      listener(change);
    } catch {
    }
  }
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
      // DEV-393: the server answers in the person's language — also before it knows who asks (a failed sign-in).
      "Accept-Language": currentLanguage(),
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
        const message = errorParser(response.status, parsed) || currentTranslator()("api.requestFailed", { status: response.status });
        throw new ApiError(response.status, message, parsed);
      }
      if (method !== "GET") {
        const bare = path.startsWith("/") ? path : `/${path}`;
        announceChange({ method, path: bare.startsWith(apiPrefix) ? bare.slice(apiPrefix.length) || "/" : bare });
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
import { useEffect as useEffect4, useState as useState6 } from "react";
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
      const t = useT();
      const login = useAuthStore2((s) => s.login);
      const [loading, setLoading] = useState6(false);
      const [error, setError] = useState6(null);
      const wrapped = async (...args) => {
        setError(null);
        setLoading(true);
        try {
          await login(...args);
        } catch (e) {
          setError(e instanceof Error ? e.message : t("login.failed"));
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
    useEffect4(() => {
      void probe();
    }, [probe]);
    return { user, ready };
  };
  return { useAuthStore, redirectOnUnauthorized: config.redirectOnUnauthorized, useSessionProbe };
}

// src/ProtectedRoute.tsx
import { useEffect as useEffect5, useState as useState7 } from "react";
import { Fragment as Fragment9, jsx as jsx25 } from "react/jsx-runtime";
function ProtectedRoute({ authed, validate, isAuthed, redirect, children }) {
  const [ready, setReady] = useState7(false);
  useEffect5(() => {
    if (authed && validate) {
      validate().finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [authed]);
  if (!ready) return null;
  const ok = isAuthed ? isAuthed() : authed;
  return ok ? /* @__PURE__ */ jsx25(Fragment9, { children }) : /* @__PURE__ */ jsx25(Fragment9, { children: redirect });
}

// src/LoginForm.tsx
import { useState as useState8 } from "react";
import { Fragment as Fragment10, jsx as jsx26, jsxs as jsxs13 } from "react/jsx-runtime";
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
  passwordLabel,
  submitLabel,
  loadingLabel,
  identityPlaceholder,
  passwordPlaceholder = "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
}) {
  const t = useT();
  const [username, setUsername] = useState8("");
  const [password, setPassword] = useState8("");
  const [showPwd, setShowPwd] = useState8(false);
  const isEmail = fieldLabel === "email";
  const idLabel = identityLabel ?? (isEmail ? t("login.email") : t("login.username"));
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
  return /* @__PURE__ */ jsxs13("form", { onSubmit: handleSubmit, noValidate: true, className: "space-y-4", children: [
    /* @__PURE__ */ jsxs13("div", { children: [
      /* @__PURE__ */ jsx26("label", { htmlFor: "login-username", className: LABEL_CLS, children: idLabel }),
      /* @__PURE__ */ jsx26(
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
    /* @__PURE__ */ jsxs13("div", { children: [
      /* @__PURE__ */ jsx26("label", { htmlFor: "login-password", className: LABEL_CLS, children: passwordLabel ?? t("login.password") }),
      /* @__PURE__ */ jsxs13("div", { className: "relative", children: [
        /* @__PURE__ */ jsx26(
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
        showPasswordToggle && /* @__PURE__ */ jsx26(
          "button",
          {
            type: "button",
            tabIndex: -1,
            onClick: () => setShowPwd((s) => !s),
            className: "absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors",
            children: showPwd ? /* @__PURE__ */ jsx26("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx26("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" }) }) : /* @__PURE__ */ jsxs13("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
              /* @__PURE__ */ jsx26("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }),
              /* @__PURE__ */ jsx26("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })
            ] })
          }
        )
      ] })
    ] }),
    error && /* @__PURE__ */ jsx26("div", { className: "rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400", children: error }),
    /* @__PURE__ */ jsx26(Button, { type: "submit", variant: "primary", disabled, className: "w-full mt-2 gap-2", children: loading ? /* @__PURE__ */ jsxs13(Fragment10, { children: [
      /* @__PURE__ */ jsxs13("svg", { className: "w-4 h-4 animate-spin", fill: "none", viewBox: "0 0 24 24", children: [
        /* @__PURE__ */ jsx26("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
        /* @__PURE__ */ jsx26("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
      ] }),
      loadingLabel ?? t("login.loading")
    ] }) : submitLabel ?? t("login.submit") })
  ] });
}

// src/SettingsShell.tsx
import { useState as useState9 } from "react";
import { jsx as jsx27, jsxs as jsxs14 } from "react/jsx-runtime";
var TAB_KEYS = {
  system: "settings.tab.system",
  agents: "settings.tab.agents",
  users: "settings.tab.users",
  sessions: "settings.tab.sessions",
  konto: "settings.tab.account"
};
function SettingsShell({
  config,
  currentUserRole,
  panels,
  title: titleProp,
  headerRight
}) {
  const t = useT();
  const title = titleProp ?? t("settings.title");
  const visibleTabs = config.tabs.filter(
    (id) => !config.tabVisibleForRole || config.tabVisibleForRole(id, currentUserRole)
  );
  const [tab, setTab] = useState9(visibleTabs[0]);
  const activeTab = tab && visibleTabs.includes(tab) ? tab : visibleTabs[0];
  return /* @__PURE__ */ jsxs14("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxs14("div", { className: "flex-shrink-0 px-6 py-4 border-b border-[var(--color-border-default)] flex items-center justify-between", children: [
      /* @__PURE__ */ jsx27("h1", { className: "text-base font-bold text-[var(--color-text-primary)]", children: title }),
      headerRight
    ] }),
    /* @__PURE__ */ jsx27(
      "div",
      {
        role: "tablist",
        "aria-label": title,
        "data-scroll-x": true,
        className: "flex-shrink-0 flex gap-0 overflow-x-auto border-b border-[var(--color-border-default)] px-6",
        children: visibleTabs.map((id) => /* @__PURE__ */ jsx27(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": activeTab === id,
            onClick: () => setTab(id),
            className: `shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === id ? "border-primary-500 text-primary-400" : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"}`,
            children: config.labels[id] ?? t(TAB_KEYS[id])
          },
          id
        ))
      }
    ),
    /* @__PURE__ */ jsx27("div", { className: "flex-1 overflow-y-auto", children: activeTab != null && panels[activeTab] })
  ] });
}

// src/SystemSettingsPanel.tsx
import { useEffect as useEffect6, useMemo as useMemo3, useState as useState10 } from "react";
import { Fragment as Fragment11, jsx as jsx28, jsxs as jsxs15 } from "react/jsx-runtime";
function inputTypeFor(valueType) {
  if (valueType === "int" || valueType === "float") return "number";
  if (valueType === "bool") return "checkbox";
  return "text";
}
var OTHER_CATEGORY = {
  id: "other",
  label: "",
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
  const t = useT();
  const { locale } = useLanguage();
  const [drafts, setDrafts] = useState10({});
  const [savingKey, setSavingKey] = useState10(null);
  const [saveErrors, setSaveErrors] = useState10({});
  const [flashKey, setFlashKey] = useState10(null);
  useEffect6(() => {
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
  const groupedSettings = useMemo3(() => {
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
      const msg = e instanceof Error ? e.message : t("system.unknownError");
      setSaveErrors((prev) => ({ ...prev, [key]: msg }));
    } finally {
      setSavingKey(null);
    }
  }
  return /* @__PURE__ */ jsxs15("div", { className: "p-6 max-w-3xl", children: [
    /* @__PURE__ */ jsx28("h2", { className: "text-sm font-semibold text-[var(--color-text-secondary)] mb-1", children: t("system.title") }),
    /* @__PURE__ */ jsxs15("p", { className: "text-xs text-[var(--color-text-muted)] mb-4", children: [
      t("system.description"),
      " ",
      canEdit ? t("system.appliesSoon") : t("system.readOnlyHint")
    ] }),
    loadError && /* @__PURE__ */ jsx28("div", { className: "rounded-lg border border-[var(--color-state-error-bg)] bg-[var(--color-state-error-bg)] px-3 py-2 text-xs text-[var(--color-state-error-fg)] mb-4", children: loadError }),
    loading && !loadError && /* @__PURE__ */ jsx28("div", { className: "text-xs text-[var(--color-text-muted)]", children: t("common.loading") }),
    !loading && !loadError && /* @__PURE__ */ jsxs15("div", { className: "space-y-6", children: [
      [...categories, OTHER_CATEGORY].map((cat) => {
        const rows = groupedSettings[cat.id] ?? [];
        if (rows.length === 0) return null;
        return /* @__PURE__ */ jsxs15("section", { children: [
          /* @__PURE__ */ jsx28("h3", { className: "text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest mb-1", children: cat.id === OTHER_CATEGORY.id ? t("system.otherCategory") : cat.label }),
          cat.description && /* @__PURE__ */ jsx28("p", { className: "text-[11px] text-[var(--color-text-muted)] mb-2", children: cat.description }),
          /* @__PURE__ */ jsx28("div", { className: "rounded-lg border border-[var(--color-border-default)] bg-[var(--color-canvas)] divide-y divide-[var(--color-border-default)]", children: rows.map((s) => {
            const draft = drafts[s.key] ?? s.value;
            const dirty = draft !== s.value;
            const inputType = inputTypeFor(s.value_type);
            const saving = savingKey === s.key;
            const err = saveErrors[s.key];
            return /* @__PURE__ */ jsxs15("div", { className: "p-4", children: [
              /* @__PURE__ */ jsxs15("div", { className: "flex items-start justify-between gap-4 mb-1", children: [
                /* @__PURE__ */ jsxs15("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsx28("div", { className: s.label ? "text-sm font-medium text-[var(--color-text-primary)]" : "text-sm font-medium text-[var(--color-text-primary)] font-mono", children: s.label || s.key }),
                  s.label && /* @__PURE__ */ jsx28("div", { className: "text-[10px] text-[var(--color-text-muted)] font-mono mt-0.5", children: s.key }),
                  /* @__PURE__ */ jsx28("div", { className: "text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest mt-0.5", children: s.value_type })
                ] }),
                canEdit && /* @__PURE__ */ jsx28(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleSaveSetting(s.key),
                    disabled: saving || !dirty || s.choices?.length === 0,
                    className: "shrink-0 px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed rounded transition-colors",
                    children: saving ? t("common.saving") : dirty ? t("common.save") : t("common.saved")
                  }
                )
              ] }),
              s.description && /* @__PURE__ */ jsx28("p", { className: "text-xs text-[var(--color-text-muted)] mb-2 leading-relaxed", children: s.description }),
              s.choices && s.choices.length === 0 && /* @__PURE__ */ jsx28("p", { className: "text-xs text-[var(--color-status-warning)] mb-2", children: t("system.choicesUnavailable") }),
              s.choices ? (
                // DEV-257: a value chosen from the app's own offer. A stored value the offer no longer
                // holds is still shown — as itself, never silently swapped for the first choice.
                /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxs15(
                    "select",
                    {
                      value: draft,
                      onChange: (e) => setDrafts((prev) => ({ ...prev, [s.key]: e.target.value })),
                      disabled: !canEdit || s.choices.length === 0,
                      className: "w-full bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded px-3 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-primary-500 disabled:opacity-50",
                      children: [
                        !s.choices.some((c) => c.value === draft) && /* @__PURE__ */ jsx28("option", { value: draft, children: draft ? t("system.notOffered", { value: draft }) : t("system.notChosen") }),
                        s.choices.map((c) => /* @__PURE__ */ jsx28("option", { value: c.value, children: c.label }, c.value))
                      ]
                    }
                  ),
                  s.unit && /* @__PURE__ */ jsx28("span", { className: "shrink-0 text-xs text-[var(--color-text-muted)]", children: s.unit })
                ] })
              ) : inputType === "checkbox" ? /* @__PURE__ */ jsxs15("label", { className: "flex items-center gap-2 text-xs text-[var(--color-text-secondary)]", children: [
                /* @__PURE__ */ jsx28(
                  "input",
                  {
                    type: "checkbox",
                    checked: draft.toLowerCase() === "true" || draft === "1",
                    onChange: (e) => setDrafts((prev) => ({ ...prev, [s.key]: e.target.checked ? "true" : "false" })),
                    disabled: !canEdit,
                    className: "rounded border-[var(--color-border-default)] bg-[var(--color-surface)] text-primary-500 focus:ring-primary-500 disabled:opacity-50"
                  }
                ),
                /* @__PURE__ */ jsx28("span", { className: "font-mono", children: draft })
              ] }) : /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx28(
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
                s.unit && /* @__PURE__ */ jsx28("span", { className: "shrink-0 text-xs text-[var(--color-text-muted)]", children: s.unit })
              ] }),
              /* @__PURE__ */ jsxs15("div", { className: "mt-2 text-[11px] flex items-center gap-2 flex-wrap", children: [
                s.is_default ? /* @__PURE__ */ jsx28("span", { className: "text-[var(--color-text-muted)]", children: t("system.defaultValue") }) : /* @__PURE__ */ jsxs15("span", { className: "text-[var(--color-text-muted)]", children: [
                  t("system.changed"),
                  s.updated_by_username && /* @__PURE__ */ jsxs15(Fragment11, { children: [
                    " \u2014 ",
                    /* @__PURE__ */ jsx28("span", { className: "text-[var(--color-text-secondary)] font-medium", children: s.updated_by_username })
                  ] }),
                  s.updated_at && /* @__PURE__ */ jsxs15(Fragment11, { children: [
                    " \xB7 ",
                    formatDateTime(s.updated_at, locale)
                  ] })
                ] }),
                flashKey === s.key && /* @__PURE__ */ jsxs15("span", { className: "text-[var(--color-status-success)]", children: [
                  "\u2713 ",
                  t("common.saved")
                ] }),
                err && /* @__PURE__ */ jsx28("span", { className: "text-[var(--color-status-error)]", children: err })
              ] })
            ] }, s.key);
          }) })
        ] }, cat.id);
      }),
      !canEdit && /* @__PURE__ */ jsx28("p", { className: "text-[11px] text-[var(--color-text-muted)] italic", children: t("system.noPermission") })
    ] })
  ] });
}

// src/AgentsPanel.tsx
import { useEffect as useEffect7, useState as useState11 } from "react";
import { jsx as jsx29, jsxs as jsxs16 } from "react/jsx-runtime";
var EFFORT_KEYS = {
  low: "agents.effort.low",
  medium: "agents.effort.medium",
  high: "agents.effort.high",
  xhigh: "agents.effort.xhigh",
  max: "agents.effort.max"
};
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
  const t = useT();
  const [edit, setEdit] = useState11(() => seedState(roles, drafts));
  const [savingRole, setSavingRole] = useState11(null);
  const [flashRole, setFlashRole] = useState11(null);
  const showHelperModel = (roleId) => Boolean(helperModels && helperModels.length > 0 && helperModelRoleIds.includes(roleId));
  useEffect7(() => {
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
  return /* @__PURE__ */ jsxs16("div", { className: "p-6 max-w-3xl", children: [
    /* @__PURE__ */ jsx29("h2", { className: "text-sm font-semibold text-[var(--color-text-secondary)] mb-1", children: t("agents.title") }),
    /* @__PURE__ */ jsx29("p", { className: "text-xs text-[var(--color-text-muted)] mb-4", children: t("agents.description") }),
    loadError && /* @__PURE__ */ jsx29("div", { className: "rounded-lg border border-[var(--color-state-error-bg)] bg-[var(--color-state-error-bg)] px-3 py-2 text-xs text-[var(--color-state-error-fg)] mb-4", children: loadError }),
    loading && !loadError && /* @__PURE__ */ jsx29("div", { className: "text-xs text-[var(--color-text-muted)]", children: t("common.loading") }),
    !loading && !loadError && /* @__PURE__ */ jsx29("div", { className: "rounded-lg border border-[var(--color-border-default)] bg-[var(--color-canvas)] divide-y divide-[var(--color-border-default)]", children: roles.map((r) => {
      const draft = edit[r.id] ?? { model: "", effort: "", helperModel: "" };
      const saving = savingRole === r.id;
      const err = saveErrors[r.id];
      return /* @__PURE__ */ jsxs16("div", { className: "p-4", children: [
        /* @__PURE__ */ jsxs16("div", { className: "flex items-start justify-between gap-4 mb-2", children: [
          /* @__PURE__ */ jsx29("div", { className: "text-sm font-medium text-[var(--color-text-primary)]", children: r.label }),
          /* @__PURE__ */ jsx29(
            "button",
            {
              type: "button",
              onClick: () => handleSave(r.id),
              disabled: saving,
              className: "shrink-0 px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed rounded transition-colors",
              children: saving ? t("common.saving") : t("common.save")
            }
          )
        ] }),
        /* @__PURE__ */ jsxs16("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs16("label", { className: "block", children: [
            /* @__PURE__ */ jsx29("span", { className: "text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest", children: t("agents.model") }),
            /* @__PURE__ */ jsxs16(
              "select",
              {
                value: draft.model,
                onChange: (e) => setEdit((prev) => ({ ...prev, [r.id]: { ...draft, model: e.target.value } })),
                className: "mt-1 w-full bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded px-3 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-primary-500",
                children: [
                  /* @__PURE__ */ jsx29("option", { value: "", children: t("agents.default") }),
                  models.map((m) => /* @__PURE__ */ jsx29("option", { value: m.id, children: m.label }, m.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs16("label", { className: "block", children: [
            /* @__PURE__ */ jsx29("span", { className: "text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest", children: t("agents.effort") }),
            /* @__PURE__ */ jsxs16(
              "select",
              {
                value: draft.effort,
                onChange: (e) => setEdit((prev) => ({ ...prev, [r.id]: { ...draft, effort: e.target.value } })),
                className: "mt-1 w-full bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded px-3 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-primary-500",
                children: [
                  /* @__PURE__ */ jsx29("option", { value: "", children: t("agents.default") }),
                  efforts.map((ef) => /* @__PURE__ */ jsx29("option", { value: ef, children: EFFORT_KEYS[ef] ? t(EFFORT_KEYS[ef]) : ef }, ef))
                ]
              }
            )
          ] })
        ] }),
        showHelperModel(r.id) && /* @__PURE__ */ jsxs16("label", { className: "block mt-3", children: [
          /* @__PURE__ */ jsx29("span", { className: "text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest", children: t("agents.helperModel") }),
          /* @__PURE__ */ jsxs16(
            "select",
            {
              value: draft.helperModel ?? "",
              onChange: (e) => setEdit((prev) => ({ ...prev, [r.id]: { ...draft, helperModel: e.target.value } })),
              className: "mt-1 w-full bg-[var(--color-surface)] border border-[var(--color-border-default)] rounded px-3 py-1.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-primary-500",
              children: [
                /* @__PURE__ */ jsx29("option", { value: "", children: t("agents.helperDefault") }),
                (helperModels ?? []).map((m) => /* @__PURE__ */ jsx29("option", { value: m.id, children: m.label }, m.id))
              ]
            }
          ),
          /* @__PURE__ */ jsx29("span", { className: "mt-1 block text-[10px] text-[var(--color-text-muted)]", children: t("agents.helperHint") })
        ] }),
        /* @__PURE__ */ jsxs16("div", { className: "mt-2 text-[11px] flex items-center gap-2", children: [
          flashRole === r.id && /* @__PURE__ */ jsxs16("span", { className: "text-[var(--color-status-success)]", children: [
            "\u2713 ",
            t("common.saved")
          ] }),
          err && /* @__PURE__ */ jsx29("span", { className: "text-[var(--color-status-error)]", children: err })
        ] })
      ] }, r.id);
    }) })
  ] });
}

// src/UsersPanel.tsx
import { useMemo as useMemo4, useState as useState13 } from "react";

// src/UserForm.tsx
import { useState as useState12 } from "react";
import { Fragment as Fragment12, jsx as jsx30, jsxs as jsxs17 } from "react/jsx-runtime";
function personLanguage(user, languages, defaultLanguage) {
  const own = user?.language;
  if (own && languages.includes(own)) return own;
  if (defaultLanguage && languages.includes(defaultLanguage)) return defaultLanguage;
  return languages[0] ?? DEFAULT_LANGUAGE;
}
function languageToReport(start, chosen) {
  return chosen === start ? void 0 : chosen;
}
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
  onCancel,
  languages = [],
  defaultLanguage
}) {
  const t = useT();
  const isEdit = mode === "edit";
  const minLen = fieldSchema.passwordMinLength;
  const [data, setData] = useState12(
    () => initialFromUser(initial, roleOptions)
  );
  const startLanguage = personLanguage(initial, languages, defaultLanguage);
  const [language, setLanguage] = useState12(startLanguage);
  const offeredLanguages = LANGUAGES.filter((l) => languages.includes(l.code));
  const passwordTooShort = data.password.length > 0 && data.password.length < minLen;
  const emailShown = fieldSchema.email !== false;
  const usernameRequired = !isEdit && fieldSchema.username;
  const submitDisabled = submitting || emailShown && !data.email || usernameRequired && !data.username || !isEdit && !data.password || passwordTooShort;
  const submitLabel = isEdit ? submitting ? t("common.saving") : t("common.save") : submitting ? t("userForm.creating") : t("userForm.create");
  function update(key, value) {
    setData((prev) => ({ ...prev, [key]: value }));
  }
  function handleSubmit() {
    if (submitDisabled) return;
    const chosen = offeredLanguages.length > 1 ? languageToReport(startLanguage, language) : void 0;
    void onSubmit(chosen ? { ...data, language: chosen } : data);
  }
  return /* @__PURE__ */ jsxs17(Card, { className: "mt-4 p-4", children: [
    /* @__PURE__ */ jsx30("h3", { className: "text-sm font-semibold text-[var(--color-text-secondary)] mb-3", children: isEdit ? /* @__PURE__ */ jsxs17(Fragment12, { children: [
      t("userForm.editTitle"),
      " \xB7",
      " ",
      /* @__PURE__ */ jsx30("span", { className: "font-mono text-[var(--color-text-secondary)]", children: initial?.username })
    ] }) : t("userForm.createTitle") }),
    error && /* @__PURE__ */ jsx30("div", { className: "mb-3 text-xs text-[var(--color-state-error-fg)] rounded bg-[var(--color-state-error-bg)] border border-[var(--color-state-error-bg)] px-3 py-2", children: error }),
    /* @__PURE__ */ jsxs17("div", { className: "grid grid-cols-2 gap-3 mb-3", children: [
      fieldSchema.names && /* @__PURE__ */ jsxs17(Fragment12, { children: [
        /* @__PURE__ */ jsxs17("div", { children: [
          /* @__PURE__ */ jsx30("label", { htmlFor: "uf-first-name", className: "block text-xs text-[var(--color-text-muted)] mb-1", children: t("user.firstName") }),
          /* @__PURE__ */ jsx30(
            Input,
            {
              id: "uf-first-name",
              type: "text",
              value: data.first_name,
              onChange: (e) => update("first_name", e.target.value),
              placeholder: t("userForm.firstNamePlaceholder")
            }
          )
        ] }),
        /* @__PURE__ */ jsxs17("div", { children: [
          /* @__PURE__ */ jsx30("label", { htmlFor: "uf-last-name", className: "block text-xs text-[var(--color-text-muted)] mb-1", children: t("user.lastName") }),
          /* @__PURE__ */ jsx30(
            Input,
            {
              id: "uf-last-name",
              type: "text",
              value: data.last_name,
              onChange: (e) => update("last_name", e.target.value),
              placeholder: t("userForm.lastNamePlaceholder")
            }
          )
        ] })
      ] }),
      fieldSchema.username && /* @__PURE__ */ jsxs17("div", { children: [
        /* @__PURE__ */ jsxs17("label", { htmlFor: "uf-username", className: "block text-xs text-[var(--color-text-muted)] mb-1", children: [
          t("user.username"),
          " ",
          isEdit ? "" : "*"
        ] }),
        /* @__PURE__ */ jsx30(
          "input",
          {
            id: "uf-username",
            type: "text",
            value: data.username,
            onChange: (e) => update("username", e.target.value),
            disabled: isEdit,
            title: isEdit ? t("userForm.usernameFixed") : void 0,
            placeholder: t("userForm.usernamePlaceholder"),
            className: `w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary-500 ${isEdit ? "bg-[var(--color-surface-hover)] border-[var(--color-border-default)] text-[var(--color-text-muted)] cursor-not-allowed" : "bg-[var(--color-surface)] border-[var(--color-border-default)] text-[var(--color-text-primary)]"}`
          }
        )
      ] }),
      emailShown && /* @__PURE__ */ jsxs17("div", { children: [
        /* @__PURE__ */ jsx30("label", { htmlFor: "uf-email", className: "block text-xs text-[var(--color-text-muted)] mb-1", children: t("user.emailRequired") }),
        /* @__PURE__ */ jsx30(
          Input,
          {
            id: "uf-email",
            type: "email",
            value: data.email,
            onChange: (e) => update("email", e.target.value),
            placeholder: t("userForm.emailPlaceholder")
          }
        )
      ] }),
      /* @__PURE__ */ jsxs17("div", { children: [
        /* @__PURE__ */ jsx30("label", { htmlFor: "uf-password", className: "block text-xs text-[var(--color-text-muted)] mb-1", children: isEdit ? /* @__PURE__ */ jsxs17(Fragment12, { children: [
          t("password.new"),
          " ",
          /* @__PURE__ */ jsx30("span", { className: "text-[var(--color-text-muted)]", children: t("userForm.passwordKeep") })
        ] }) : t("userForm.passwordRequired") }),
        /* @__PURE__ */ jsx30(
          Input,
          {
            id: "uf-password",
            type: "password",
            value: data.password,
            onChange: (e) => update("password", e.target.value),
            placeholder: minLen > 1 ? t("password.minPlaceholder", { count: minLen }) : void 0,
            invalid: passwordTooShort
          }
        ),
        passwordTooShort && /* @__PURE__ */ jsx30("div", { className: "mt-1 text-[10px] text-[var(--color-status-error)]", children: t("password.tooShortCount", { count: minLen, length: data.password.length }) })
      ] }),
      /* @__PURE__ */ jsxs17("div", { children: [
        /* @__PURE__ */ jsx30("label", { htmlFor: "uf-role", className: "block text-xs text-[var(--color-text-muted)] mb-1", children: t("user.role") }),
        /* @__PURE__ */ jsx30(
          Select,
          {
            id: "uf-role",
            value: data.role,
            onChange: (e) => update("role", e.target.value),
            children: roleOptions.map((o) => /* @__PURE__ */ jsx30("option", { value: o.value, children: o.label }, o.value))
          }
        )
      ] }),
      offeredLanguages.length > 1 && /* @__PURE__ */ jsxs17("div", { children: [
        /* @__PURE__ */ jsx30("label", { htmlFor: "uf-language", className: "block text-xs text-[var(--color-text-muted)] mb-1", children: t("account.language") }),
        /* @__PURE__ */ jsx30(Select, { id: "uf-language", value: language, onChange: (e) => setLanguage(e.target.value), children: offeredLanguages.map((l) => /* @__PURE__ */ jsx30("option", { value: l.code, lang: l.code, children: l.name }, l.code)) })
      ] }),
      fieldSchema.telegram && /* @__PURE__ */ jsxs17("div", { children: [
        /* @__PURE__ */ jsx30("label", { htmlFor: "uf-telegram", className: "block text-xs text-[var(--color-text-muted)] mb-1", children: t("user.telegram") }),
        /* @__PURE__ */ jsx30(
          Input,
          {
            id: "uf-telegram",
            type: "text",
            value: data.telegram_chat_id,
            onChange: (e) => update("telegram_chat_id", e.target.value),
            placeholder: t("userForm.telegramPlaceholder")
          }
        )
      ] }),
      isEdit && /* @__PURE__ */ jsx30("div", { className: "flex items-end", children: /* @__PURE__ */ jsxs17("label", { htmlFor: "uf-active", className: "flex items-center gap-2 text-xs text-[var(--color-text-secondary)] cursor-pointer", children: [
        /* @__PURE__ */ jsx30(
          "input",
          {
            id: "uf-active",
            type: "checkbox",
            checked: data.is_active,
            onChange: (e) => update("is_active", e.target.checked),
            className: "rounded bg-[var(--color-surface)] border-[var(--color-border-default)]"
          }
        ),
        t("user.active")
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs17("div", { className: "flex gap-2 justify-end", children: [
      onCancel && /* @__PURE__ */ jsx30(
        "button",
        {
          type: "button",
          onClick: onCancel,
          className: "px-3 py-1.5 text-xs text-[var(--color-text-secondary)] border border-[var(--color-border-default)] rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors",
          children: t("common.cancel")
        }
      ),
      /* @__PURE__ */ jsx30(
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
import { jsx as jsx31, jsxs as jsxs18 } from "react/jsx-runtime";
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
  roleClass,
  rowActions,
  languages = [],
  defaultLanguage
}) {
  const t = useT();
  const roleCls = roleClass ?? (() => "");
  const roleName = (role) => roleOptions.find((o) => o.value === role)?.label ?? role;
  const [roleFilter, setRoleFilter] = useState13("");
  const [activeFilter, setActiveFilter] = useState13("");
  const [showNewForm, setShowNewForm] = useState13(false);
  const [editingUser, setEditingUser] = useState13(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState13(null);
  const [creating, setCreating] = useState13(false);
  const [createError, setCreateError] = useState13("");
  const [editing, setEditing] = useState13(false);
  const [editError, setEditError] = useState13("");
  const [deleting, setDeleting] = useState13(false);
  const [deleteError, setDeleteError] = useState13("");
  const filteredUsers = useMemo4(() => {
    return users.filter((u) => {
      if (roleFilter && u.role !== roleFilter) return false;
      if (activeFilter === "active" && !u.is_active) return false;
      if (activeFilter === "inactive" && u.is_active) return false;
      return true;
    });
  }, [users, roleFilter, activeFilter]);
  const showNames = fieldSchema.names;
  const showUsername = fieldSchema.username;
  const showLanguage = LANGUAGES.filter((l) => languages.includes(l.code)).length > 1;
  const languageName = (u) => {
    const code = personLanguage(u, languages, defaultLanguage);
    return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
  };
  const colCount = 4 + (showNames ? 1 : 0) + (showUsername ? 1 : 0) + (showLanguage ? 1 : 0);
  async function handleCreate(data) {
    setCreating(true);
    setCreateError("");
    try {
      await onCreate(data);
      setShowNewForm(false);
    } catch (e) {
      const msg = e instanceof Error && e.message ? t("users.createFailedBecause", { reason: e.message }) : t("users.createFailed");
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
      const msg = e instanceof Error && e.message ? t("users.saveFailedBecause", { reason: e.message }) : t("users.saveFailed");
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
      const msg = e instanceof Error && e.message ? t("users.deleteFailedBecause", { reason: e.message }) : t("users.deleteFailed");
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
  return /* @__PURE__ */ jsxs18("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxs18("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsx31("h2", { className: "text-sm font-semibold text-[var(--color-text-secondary)]", children: t("users.title") }),
      canManage && /* @__PURE__ */ jsxs18(
        "button",
        {
          type: "button",
          "aria-expanded": showNewForm,
          onClick: () => {
            setShowNewForm((v) => !v);
            setEditingUser(null);
            setConfirmingDeleteId(null);
          },
          className: "flex items-center gap-1.5 bg-primary-600 hover:bg-primary-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
          children: [
            /* @__PURE__ */ jsx31("svg", { className: "w-3.5 h-3.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx31("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }),
            t("users.new")
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs18("div", { className: "flex flex-wrap items-center gap-3 mb-3", children: [
      /* @__PURE__ */ jsxs18(
        "select",
        {
          value: roleFilter,
          onChange: (e) => setRoleFilter(e.target.value),
          className: "bg-[var(--color-surface)] border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary-500",
          children: [
            /* @__PURE__ */ jsx31("option", { value: "", children: t("users.allRoles") }),
            roleOptions.map((o) => /* @__PURE__ */ jsx31("option", { value: o.value, children: o.label }, o.value))
          ]
        }
      ),
      /* @__PURE__ */ jsxs18(
        "select",
        {
          value: activeFilter,
          onChange: (e) => setActiveFilter(e.target.value),
          className: "bg-[var(--color-surface)] border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary-500",
          children: [
            /* @__PURE__ */ jsx31("option", { value: "", children: t("users.anyState") }),
            /* @__PURE__ */ jsx31("option", { value: "active", children: t("users.onlyActive") }),
            /* @__PURE__ */ jsx31("option", { value: "inactive", children: t("users.onlyInactive") })
          ]
        }
      ),
      /* @__PURE__ */ jsx31("span", { className: "ml-auto text-xs text-[var(--color-text-muted)]", children: t("users.count", { count: filteredUsers.length }) })
    ] }),
    /* @__PURE__ */ jsx31("div", { className: "rounded-xl border border-[var(--color-border-default)] overflow-x-auto", "data-scroll-x": true, children: /* @__PURE__ */ jsxs18("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx31("thead", { className: "bg-[var(--color-surface-hover)]", children: /* @__PURE__ */ jsxs18("tr", { className: "text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]", children: [
        showNames && /* @__PURE__ */ jsx31("th", { className: "px-4 py-2.5 text-left font-semibold", children: t("users.col.name") }),
        showUsername && /* @__PURE__ */ jsx31("th", { className: "px-4 py-2.5 text-left font-semibold", children: t("user.username") }),
        /* @__PURE__ */ jsx31("th", { className: "px-4 py-2.5 text-left font-semibold", children: t("user.email") }),
        /* @__PURE__ */ jsx31("th", { className: "px-4 py-2.5 text-left font-semibold", children: t("user.role") }),
        showLanguage && /* @__PURE__ */ jsx31("th", { className: "px-4 py-2.5 text-left font-semibold", children: t("users.col.language") }),
        /* @__PURE__ */ jsx31("th", { className: "px-4 py-2.5 text-left font-semibold", children: t("users.col.state") }),
        /* @__PURE__ */ jsx31("th", { className: "px-4 py-2.5 text-right font-semibold", children: t("common.actions") })
      ] }) }),
      /* @__PURE__ */ jsxs18("tbody", { className: "divide-y divide-[var(--color-border-default)]", children: [
        filteredUsers.map((u) => {
          const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ");
          const ownActions = rowActions?.(u) ?? null;
          return /* @__PURE__ */ jsxs18("tr", { className: "hover:bg-[var(--color-surface-hover)] transition-colors", children: [
            showNames && /* @__PURE__ */ jsx31("td", { className: "px-4 py-3 text-sm text-[var(--color-text-secondary)]", children: fullName || /* @__PURE__ */ jsx31("span", { className: "text-[var(--color-text-muted)]", children: "\u2014" }) }),
            showUsername && /* @__PURE__ */ jsx31("td", { className: "px-4 py-3 text-sm font-medium text-[var(--color-text-primary)] font-mono", children: u.username }),
            /* @__PURE__ */ jsx31("td", { className: "px-4 py-3 text-xs text-[var(--color-text-secondary)]", children: u.email }),
            /* @__PURE__ */ jsx31("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx31("span", { className: `text-xs font-medium ${roleCls(u.role)}`, children: roleName(u.role) }) }),
            showLanguage && /* @__PURE__ */ jsx31("td", { className: "px-4 py-3 text-xs text-[var(--color-text-secondary)]", lang: languageName(u).code, children: languageName(u).name }),
            /* @__PURE__ */ jsx31("td", { className: "px-4 py-3", children: u.is_active ? /* @__PURE__ */ jsx31("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-state-success-bg)] border border-[var(--color-state-success-bg)] text-[var(--color-state-success-fg)]", children: t("users.active") }) : /* @__PURE__ */ jsx31("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-state-warning-bg)] border border-[var(--color-state-warning-bg)] text-[var(--color-state-warning-fg)]", children: t("users.inactive") }) }),
            /* @__PURE__ */ jsx31("td", { className: "px-4 py-3 text-right", children: !canManage ? ownActions !== null ? /* @__PURE__ */ jsx31("div", { className: "flex items-center justify-end gap-3", children: ownActions }) : /* @__PURE__ */ jsx31("span", { className: "text-xs text-[var(--color-text-muted)]", children: "\u2014" }) : confirmingDeleteId === u.id ? /* @__PURE__ */ jsxs18("div", { className: "flex items-center justify-end gap-2 text-xs", children: [
              /* @__PURE__ */ jsx31("span", { className: "text-[var(--color-text-secondary)]", children: t("users.confirmDelete") }),
              /* @__PURE__ */ jsx31(
                "button",
                {
                  type: "button",
                  onClick: () => handleConfirmDelete(u.id),
                  disabled: deleting,
                  className: "px-2 py-0.5 text-[var(--color-status-error)] border border-[var(--color-state-error-bg)] rounded hover:bg-[var(--color-state-error-bg)] disabled:opacity-40",
                  children: t("common.yes")
                }
              ),
              /* @__PURE__ */ jsx31(
                "button",
                {
                  type: "button",
                  onClick: () => setConfirmingDeleteId(null),
                  disabled: deleting,
                  className: "px-2 py-0.5 text-[var(--color-text-secondary)] border border-[var(--color-border-default)] rounded hover:bg-[var(--color-surface-hover)]",
                  children: t("common.no")
                }
              )
            ] }) : /* @__PURE__ */ jsxs18("div", { className: "flex items-center justify-end gap-3", children: [
              ownActions,
              /* @__PURE__ */ jsx31(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setEditingUser(u);
                    setEditError("");
                    setShowNewForm(false);
                    setConfirmingDeleteId(null);
                  },
                  title: t("common.edit"),
                  className: "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors",
                  children: /* @__PURE__ */ jsx31("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx31("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) })
                }
              ),
              /* @__PURE__ */ jsx31(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setConfirmingDeleteId(u.id);
                    setDeleteError("");
                  },
                  title: t("common.delete"),
                  className: "text-[var(--color-text-muted)] hover:text-[var(--color-status-error)] transition-colors",
                  children: /* @__PURE__ */ jsx31("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx31("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) })
                }
              ),
              /* @__PURE__ */ jsx31(
                "button",
                {
                  type: "button",
                  onClick: () => handleToggle(u),
                  className: "text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors",
                  children: u.is_active ? t("users.deactivate") : t("users.activate")
                }
              )
            ] }) })
          ] }, u.id);
        }),
        filteredUsers.length === 0 && /* @__PURE__ */ jsx31("tr", { children: /* @__PURE__ */ jsx31("td", { colSpan: colCount, className: "px-4 py-6 text-center text-xs text-[var(--color-text-muted)]", children: t("users.none") }) })
      ] })
    ] }) }),
    deleteError && /* @__PURE__ */ jsxs18("div", { className: "mt-3 text-xs text-[var(--color-state-error-fg)] rounded bg-[var(--color-state-error-bg)] border border-[var(--color-state-error-bg)] px-3 py-2 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx31("span", { children: deleteError }),
      /* @__PURE__ */ jsx31("button", { type: "button", onClick: () => setDeleteError(""), className: "text-[var(--color-state-error-fg)] hover:opacity-80 ml-2", children: "\xD7" })
    ] }),
    canManage && editingUser && /* @__PURE__ */ jsx31(
      UserForm,
      {
        mode: "edit",
        initial: editingUser,
        roleOptions,
        fieldSchema,
        languages,
        defaultLanguage,
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
    canManage && showNewForm && /* @__PURE__ */ jsx31(
      UserForm,
      {
        mode: "create",
        roleOptions,
        fieldSchema,
        languages,
        defaultLanguage,
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

// src/MyAccountPanel.tsx
import { useEffect as useEffect8, useState as useState14 } from "react";
import { jsx as jsx32, jsxs as jsxs19 } from "react/jsx-runtime";
function accountRefusal(err, t = createTranslator(DEFAULT_LANGUAGE)) {
  return refusalSentence(err) || t("account.saveFailed");
}
function passwordRefusal(err, t = createTranslator(DEFAULT_LANGUAGE)) {
  return refusalSentence(err) || t("account.passwordFailed");
}
var LABEL = "block text-xs text-[var(--color-text-muted)] mb-1";
var BTN = "px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-500 disabled:opacity-40 rounded-lg transition-colors";
function ReadOnly({ label, value }) {
  return /* @__PURE__ */ jsxs19("div", { children: [
    /* @__PURE__ */ jsx32("div", { className: LABEL, children: label }),
    /* @__PURE__ */ jsx32("div", { className: "text-sm text-[var(--color-text-secondary)] font-mono", children: value || "\u2014" })
  ] });
}
function MyAccountPanel({
  user,
  roleLabel,
  onSaveProfile,
  onChangePassword,
  onTestTelegram,
  passwordMinLength = 5,
  telegram: showTelegram = true,
  languages = [],
  language,
  onLanguageChange
}) {
  const t = useT();
  const current = useLanguage().language;
  const [languageBusy, setLanguageBusy] = useState14(false);
  const [languageError, setLanguageError] = useState14("");
  const [firstName, setFirstName] = useState14(user.first_name ?? "");
  const [lastName, setLastName] = useState14(user.last_name ?? "");
  const [email, setEmail] = useState14(user.email ?? "");
  const [telegram, setTelegram] = useState14(user.telegram_chat_id ?? "");
  useEffect8(() => {
    setFirstName(user.first_name ?? "");
    setLastName(user.last_name ?? "");
    setEmail(user.email ?? "");
    setTelegram(user.telegram_chat_id ?? "");
  }, [user.first_name, user.last_name, user.email, user.telegram_chat_id]);
  const [savingProfile, setSavingProfile] = useState14(false);
  const [profileError, setProfileError] = useState14("");
  const [profileSaved, setProfileSaved] = useState14(false);
  const [testBusy, setTestBusy] = useState14(false);
  const [testResult, setTestResult] = useState14(null);
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
  const [currentPw, setCurrentPw] = useState14("");
  const [newPw, setNewPw] = useState14("");
  const [confirmPw, setConfirmPw] = useState14("");
  const [savingPw, setSavingPw] = useState14(false);
  const [pwError, setPwError] = useState14("");
  const [pwDone, setPwDone] = useState14(false);
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
        telegram_chat_id: telegram
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
  const pwDisabled = savingPw || !currentPw || !newPw || newPw.length < passwordMinLength || newPw !== confirmPw;
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
  async function chooseLanguage(next) {
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
  return /* @__PURE__ */ jsxs19("div", { className: "p-4 max-w-3xl", children: [
    /* @__PURE__ */ jsxs19(Card, { className: "p-4", children: [
      /* @__PURE__ */ jsx32("h3", { className: "text-sm font-semibold text-[var(--color-text-secondary)] mb-3", children: t("account.details") }),
      profileError && /* @__PURE__ */ jsx32("div", { className: "mb-3 text-xs text-[var(--color-state-error-fg)] rounded bg-[var(--color-state-error-bg)] px-3 py-2", children: profileError }),
      profileSaved && !profileError && /* @__PURE__ */ jsx32("div", { className: "mb-3 text-xs text-[var(--color-text-primary)] rounded bg-[var(--color-state-success-bg)] px-3 py-2", children: t("account.saved") }),
      /* @__PURE__ */ jsxs19("div", { className: "grid grid-cols-2 gap-3 mb-3", children: [
        /* @__PURE__ */ jsxs19("div", { children: [
          /* @__PURE__ */ jsx32("label", { htmlFor: "ma-first", className: LABEL, children: t("user.firstName") }),
          /* @__PURE__ */ jsx32(Input, { id: "ma-first", value: firstName, onChange: (e) => setFirstName(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs19("div", { children: [
          /* @__PURE__ */ jsx32("label", { htmlFor: "ma-last", className: LABEL, children: t("user.lastName") }),
          /* @__PURE__ */ jsx32(Input, { id: "ma-last", value: lastName, onChange: (e) => setLastName(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs19("div", { children: [
          /* @__PURE__ */ jsx32("label", { htmlFor: "ma-email", className: LABEL, children: t("user.emailRequired") }),
          /* @__PURE__ */ jsx32(Input, { id: "ma-email", type: "email", value: email, onChange: (e) => setEmail(e.target.value) })
        ] }),
        showTelegram && /* @__PURE__ */ jsxs19("div", { children: [
          /* @__PURE__ */ jsx32("label", { htmlFor: "ma-tg", className: LABEL, children: t("user.telegram") }),
          /* @__PURE__ */ jsx32(
            Input,
            {
              id: "ma-tg",
              value: telegram,
              onChange: (e) => setTelegram(e.target.value),
              placeholder: t("account.telegramPlaceholder")
            }
          )
        ] }),
        /* @__PURE__ */ jsx32(ReadOnly, { label: t("user.username"), value: user.username }),
        /* @__PURE__ */ jsx32(ReadOnly, { label: t("user.role"), value: roleLabel })
      ] }),
      showTelegram && onTestTelegram && /* @__PURE__ */ jsxs19("div", { className: "mb-3 rounded-lg bg-[var(--color-surface-hover)] px-3 py-2 text-xs", children: [
        /* @__PURE__ */ jsx32("p", { className: "text-[var(--color-text-muted)] mb-2", children: t("account.telegramHowTo") }),
        /* @__PURE__ */ jsxs19("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx32(
            "button",
            {
              type: "button",
              onClick: testTelegram,
              disabled: testBusy,
              className: "px-3 py-1 rounded-lg border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] disabled:opacity-40 transition-colors",
              children: testBusy ? t("account.telegramSending") : t("account.telegramTest")
            }
          ),
          testResult && /* @__PURE__ */ jsxs19(
            "span",
            {
              className: testResult.ok ? "text-[var(--color-status-success)]" : "text-[var(--color-status-error)]",
              children: [
                testResult.ok ? "\u2705 " : "\u274C ",
                testResult.detail
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx32("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx32("button", { type: "button", onClick: saveProfile, disabled: savingProfile, className: BTN, children: savingProfile ? t("common.saving") : t("common.save") }) })
    ] }),
    onLanguageChange && offered.length > 1 && /* @__PURE__ */ jsxs19(Card, { className: "p-4 mt-4", children: [
      /* @__PURE__ */ jsx32("h3", { className: "text-sm font-semibold text-[var(--color-text-secondary)] mb-1", children: t("account.language") }),
      /* @__PURE__ */ jsx32("p", { className: "mb-3 text-xs text-[var(--color-text-muted)]", children: t("account.languageHint") }),
      languageError && /* @__PURE__ */ jsx32("div", { className: "mb-3 text-xs text-[var(--color-state-error-fg)] rounded bg-[var(--color-state-error-bg)] px-3 py-2", children: languageError }),
      /* @__PURE__ */ jsx32(
        "select",
        {
          "aria-label": t("account.language"),
          value: language ?? current,
          disabled: languageBusy,
          onChange: (e) => void chooseLanguage(e.target.value),
          className: "w-full max-w-xs rounded border border-[var(--color-border-default)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] disabled:opacity-40",
          children: offered.map((l) => /* @__PURE__ */ jsx32("option", { value: l.code, lang: l.code, children: l.name }, l.code))
        }
      )
    ] }),
    /* @__PURE__ */ jsxs19(Card, { className: "p-4 mt-4", children: [
      /* @__PURE__ */ jsx32("h3", { className: "text-sm font-semibold text-[var(--color-text-secondary)] mb-3", children: t("account.passwordTitle") }),
      pwError && /* @__PURE__ */ jsx32("div", { className: "mb-3 text-xs text-[var(--color-state-error-fg)] rounded bg-[var(--color-state-error-bg)] px-3 py-2", children: pwError }),
      pwDone && !pwError && /* @__PURE__ */ jsx32("div", { className: "mb-3 text-xs text-[var(--color-text-primary)] rounded bg-[var(--color-state-success-bg)] px-3 py-2", children: t("account.passwordChanged") }),
      /* @__PURE__ */ jsxs19("div", { className: "grid grid-cols-3 gap-3 mb-2", children: [
        /* @__PURE__ */ jsxs19("div", { children: [
          /* @__PURE__ */ jsx32("label", { htmlFor: "ma-cur", className: LABEL, children: t("account.currentPassword") }),
          /* @__PURE__ */ jsx32(Input, { id: "ma-cur", type: "password", value: currentPw, onChange: (e) => setCurrentPw(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs19("div", { children: [
          /* @__PURE__ */ jsx32("label", { htmlFor: "ma-new", className: LABEL, children: t("password.new") }),
          /* @__PURE__ */ jsx32(
            Input,
            {
              id: "ma-new",
              type: "password",
              value: newPw,
              onChange: (e) => setNewPw(e.target.value),
              placeholder: passwordMinLength > 1 ? t("password.minPlaceholder", { count: passwordMinLength }) : void 0,
              invalid: pwTooShort
            }
          )
        ] }),
        /* @__PURE__ */ jsxs19("div", { children: [
          /* @__PURE__ */ jsx32("label", { htmlFor: "ma-conf", className: LABEL, children: t("account.repeatPassword") }),
          /* @__PURE__ */ jsx32(
            Input,
            {
              id: "ma-conf",
              type: "password",
              value: confirmPw,
              onChange: (e) => setConfirmPw(e.target.value),
              invalid: pwMismatch
            }
          )
        ] })
      ] }),
      pwTooShort && /* @__PURE__ */ jsx32("div", { className: "mb-2 text-[10px] text-[var(--color-status-error)]", children: t("password.tooShort", { count: passwordMinLength }) }),
      pwMismatch && /* @__PURE__ */ jsx32("div", { className: "mb-2 text-[10px] text-[var(--color-status-error)]", children: t("password.mismatch") }),
      /* @__PURE__ */ jsx32("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx32("button", { type: "button", onClick: changePassword, disabled: pwDisabled, className: BTN, children: savingPw ? t("common.saving") : t("account.changePassword") }) })
    ] })
  ] });
}

// src/SessionsPanel.tsx
import { useMemo as useMemo5, useState as useState15 } from "react";
import { jsx as jsx33, jsxs as jsxs20 } from "react/jsx-runtime";
function fmt(ts, locale) {
  return ts ? formatDateTime(ts, locale) : "\u2014";
}
function SessionsPanel({
  sessions,
  resolveUsername,
  canRevoke,
  onRevoke,
  loading = false,
  loadError = "",
  filterUserId,
  onFilterChange,
  description
}) {
  const t = useT();
  const { locale } = useLanguage();
  const [confirmingId, setConfirmingId] = useState15(null);
  const [revoking, setRevoking] = useState15(false);
  const [revokeError, setRevokeError] = useState15("");
  const nameOf = (uid) => resolveUsername?.(uid) ?? uid;
  const showTv = sessions.some((s) => s.token_version != null);
  const rows = useMemo5(
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
      const msg = e instanceof Error && e.message ? t("sessions.revokeFailedBecause", { reason: e.message }) : t("sessions.revokeFailed");
      setRevokeError(msg);
      setConfirmingId(null);
    } finally {
      setRevoking(false);
    }
  }
  return /* @__PURE__ */ jsxs20("div", { className: "p-6", children: [
    /* @__PURE__ */ jsx33("h2", { className: "text-sm font-semibold text-[var(--color-text-secondary)] mb-1", children: t("sessions.title") }),
    /* @__PURE__ */ jsx33("p", { className: "text-xs text-[var(--color-text-muted)] mb-4", children: description ?? t("sessions.description") }),
    filterUserId && onFilterChange && /* @__PURE__ */ jsxs20("div", { className: "mb-3 flex items-center gap-2 text-xs", children: [
      /* @__PURE__ */ jsxs20("span", { className: "text-[var(--color-text-muted)]", children: [
        t("sessions.filteredBy"),
        " ",
        /* @__PURE__ */ jsx33("span", { className: "text-[var(--color-text-secondary)] font-medium", children: nameOf(filterUserId) })
      ] }),
      /* @__PURE__ */ jsx33(
        "button",
        {
          type: "button",
          onClick: () => onFilterChange(""),
          className: "px-2 py-0.5 text-[var(--color-text-secondary)] border border-[var(--color-border-default)] rounded hover:bg-[var(--color-surface-hover)]",
          children: t("sessions.clearFilter")
        }
      )
    ] }),
    loadError && /* @__PURE__ */ jsx33("div", { className: "rounded-lg border border-[var(--color-state-error-bg)] bg-[var(--color-state-error-bg)] px-3 py-2 text-xs text-[var(--color-state-error-fg)] mb-4", children: loadError }),
    loading && !loadError && /* @__PURE__ */ jsx33("div", { className: "text-xs text-[var(--color-text-muted)]", children: t("common.loading") }),
    !loading && !loadError && /* @__PURE__ */ jsx33("div", { className: "rounded-xl border border-[var(--color-border-default)] overflow-x-auto", "data-scroll-x": true, children: /* @__PURE__ */ jsxs20("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx33("thead", { className: "bg-[var(--color-surface-hover)]", children: /* @__PURE__ */ jsxs20("tr", { className: "text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]", children: [
        /* @__PURE__ */ jsx33("th", { className: "px-4 py-2.5 text-left font-semibold", children: t("sessions.col.user") }),
        /* @__PURE__ */ jsx33("th", { className: "px-4 py-2.5 text-left font-semibold", children: t("sessions.col.id") }),
        showTv && /* @__PURE__ */ jsx33("th", { className: "px-4 py-2.5 text-right font-semibold", children: t("sessions.col.tokenVersion") }),
        /* @__PURE__ */ jsx33("th", { className: "px-4 py-2.5 text-left font-semibold", children: t("sessions.col.lastSeen") }),
        /* @__PURE__ */ jsx33("th", { className: "px-4 py-2.5 text-left font-semibold", children: t("sessions.col.created") }),
        /* @__PURE__ */ jsx33("th", { className: "px-4 py-2.5 text-right font-semibold", children: t("common.actions") })
      ] }) }),
      /* @__PURE__ */ jsxs20("tbody", { className: "divide-y divide-[var(--color-border-default)]", children: [
        rows.map((s) => /* @__PURE__ */ jsxs20("tr", { className: "hover:bg-[var(--color-surface-hover)] transition-colors", children: [
          /* @__PURE__ */ jsx33("td", { className: "px-4 py-3 text-sm font-medium text-[var(--color-text-primary)]", children: nameOf(s.user_id) }),
          /* @__PURE__ */ jsx33("td", { className: "px-4 py-3 font-mono text-[10px] text-[var(--color-text-muted)]", children: s.id }),
          showTv && /* @__PURE__ */ jsx33("td", { className: "px-4 py-3 text-right font-mono text-xs text-[var(--color-text-secondary)]", children: s.token_version }),
          /* @__PURE__ */ jsx33("td", { className: "px-4 py-3 whitespace-nowrap text-xs text-[var(--color-text-muted)]", children: fmt(s.last_seen_at, locale) }),
          /* @__PURE__ */ jsx33("td", { className: "px-4 py-3 whitespace-nowrap text-xs text-[var(--color-text-muted)]", children: fmt(s.created_at, locale) }),
          /* @__PURE__ */ jsx33("td", { className: "px-4 py-3 text-right", children: !canRevoke ? /* @__PURE__ */ jsx33("span", { className: "text-xs text-[var(--color-text-muted)]", children: "\u2014" }) : confirmingId === s.id ? /* @__PURE__ */ jsxs20("div", { className: "flex items-center justify-end gap-2 text-xs", children: [
            /* @__PURE__ */ jsx33("span", { className: "text-[var(--color-text-secondary)]", children: t("sessions.confirmRevoke") }),
            /* @__PURE__ */ jsx33(
              "button",
              {
                type: "button",
                onClick: () => handleRevoke(s.id),
                disabled: revoking,
                className: "px-2 py-0.5 text-[var(--color-status-error)] border border-[var(--color-state-error-bg)] rounded hover:bg-[var(--color-state-error-bg)] disabled:opacity-40",
                children: t("common.yes")
              }
            ),
            /* @__PURE__ */ jsx33(
              "button",
              {
                type: "button",
                onClick: () => setConfirmingId(null),
                disabled: revoking,
                className: "px-2 py-0.5 text-[var(--color-text-secondary)] border border-[var(--color-border-default)] rounded hover:bg-[var(--color-surface-hover)]",
                children: t("common.no")
              }
            )
          ] }) : /* @__PURE__ */ jsx33(
            "button",
            {
              type: "button",
              onClick: () => {
                setConfirmingId(s.id);
                setRevokeError("");
              },
              className: "text-xs text-[var(--color-text-muted)] hover:text-[var(--color-status-error)] transition-colors",
              children: t("sessions.revoke")
            }
          ) })
        ] }, s.id)),
        rows.length === 0 && /* @__PURE__ */ jsx33("tr", { children: /* @__PURE__ */ jsx33("td", { colSpan: 6, className: "px-4 py-6 text-center text-xs text-[var(--color-text-muted)]", children: t("sessions.none") }) })
      ] })
    ] }) }),
    revokeError && /* @__PURE__ */ jsxs20("div", { className: "mt-3 text-xs text-[var(--color-state-error-fg)] rounded bg-[var(--color-state-error-bg)] border border-[var(--color-state-error-bg)] px-3 py-2 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx33("span", { children: revokeError }),
      /* @__PURE__ */ jsx33("button", { type: "button", onClick: () => setRevokeError(""), className: "text-[var(--color-state-error-fg)] hover:opacity-80 ml-2", children: "\xD7" })
    ] })
  ] });
}

// src/launchWindow.ts
var LAUNCH_WINDOW_PREFIX = "nexlaunch_";
var LAUNCH_WINDOW_STORAGE_KEY = "nex-shared:launch-window";
var LAUNCH_WINDOW_SAVE_DELAY_MS = 500;
function rememberLaunchWindow(win = window, storage2 = browserStorage()) {
  if (!win.name.startsWith(LAUNCH_WINDOW_PREFIX) || storage2 === null) return () => {
  };
  const stored = readPlacement(storage2);
  if (stored) {
    const placement = fitToScreen(stored, win.screen);
    try {
      win.moveTo(placement.left, placement.top);
      win.resizeTo(placement.width, placement.height);
    } catch {
    }
  }
  let pending;
  const save = () => {
    win.clearTimeout(pending);
    pending = void 0;
    try {
      storage2.setItem(
        LAUNCH_WINDOW_STORAGE_KEY,
        JSON.stringify({ left: win.screenX, top: win.screenY, width: win.outerWidth, height: win.outerHeight })
      );
    } catch {
    }
  };
  const saveLater = () => {
    win.clearTimeout(pending);
    pending = win.setTimeout(save, LAUNCH_WINDOW_SAVE_DELAY_MS);
  };
  win.addEventListener("resize", saveLater);
  win.addEventListener("pagehide", save);
  return () => {
    win.clearTimeout(pending);
    win.removeEventListener("resize", saveLater);
    win.removeEventListener("pagehide", save);
  };
}
function fitToScreen(placement, screen) {
  const minLeft = screen.availLeft ?? 0;
  const minTop = screen.availTop ?? 0;
  const width = Math.min(placement.width, screen.availWidth);
  const height = Math.min(placement.height, screen.availHeight);
  return {
    width,
    height,
    left: Math.min(Math.max(placement.left, minLeft), minLeft + screen.availWidth - width),
    top: Math.min(Math.max(placement.top, minTop), minTop + screen.availHeight - height)
  };
}
function readPlacement(storage2) {
  try {
    const value = JSON.parse(storage2.getItem(LAUNCH_WINDOW_STORAGE_KEY) ?? "null");
    if (!value) return null;
    const { left, top, width, height } = value;
    const numbers = [left, top, width, height].every((n) => typeof n === "number" && Number.isFinite(n));
    return numbers && width > 0 && height > 0 ? { left, top, width, height } : null;
  } catch {
    return null;
  }
}
function browserStorage() {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
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
  CompactRowsContext,
  DEFAULT_LANGUAGE,
  DataTable,
  DensityContext,
  FormActions,
  FormField,
  FormGrid,
  Header,
  I18nProvider,
  IconButton,
  Input,
  LANGUAGES,
  LAUNCH_WINDOW_PREFIX,
  LAUNCH_WINDOW_SAVE_DELAY_MS,
  LAUNCH_WINDOW_STORAGE_KEY,
  LoginForm,
  MyAccountPanel,
  NavIcon,
  NavItem,
  Page,
  ProtectedRoute,
  ReleaseNotes,
  ResizeHandle,
  SIDEBAR_DEFAULT_WIDTH,
  SIDEBAR_WIDTH_KEY_PREFIX,
  SectionDivider,
  SectionLabel,
  Select,
  SessionsPanel,
  SettingsShell,
  ShellContext,
  Sidebar,
  StatusBadge,
  SystemSettingsPanel,
  ThemeToggle,
  UserCard,
  UserForm,
  UsersPanel,
  WIDE_SCREEN_QUERY,
  accountRefusal,
  createApiClient,
  createAuthStore,
  createTranslator,
  currentLanguage,
  currentTranslator,
  fitToScreen,
  formatDateTime,
  isLanguage,
  languageToReport,
  localeOf,
  onServerChange,
  passwordRefusal,
  personLanguage,
  readRememberedWidth,
  refusalSentence,
  registerAuthCallback,
  rememberLaunchWindow,
  rememberWidth,
  useCompactRows,
  useDense,
  useLanguage,
  useRememberedSidebarWidth,
  useShell,
  useT,
  useWideScreen
};
