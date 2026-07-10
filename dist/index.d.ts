import * as react from 'react';
import { ButtonHTMLAttributes, ReactNode, InputHTMLAttributes, SelectHTMLAttributes, HTMLAttributes } from 'react';
import { UseBoundStore, StoreApi } from 'zustand';

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Visual style. Defaults to `primary`. */
    variant?: ButtonVariant;
    /** Padding/text scale. Defaults to `md`. */
    size?: ButtonSize;
    children?: ReactNode;
}
declare function Button({ variant, size, className, children, type, ...rest }: ButtonProps): react.JSX.Element;

interface AppShellProps {
    /** The (composed) sidebar rail rendered on the left. */
    sidebar: ReactNode;
    /** Top header bar of the main column (e.g. a `<Header>`). Optional. */
    header?: ReactNode;
    /** Optional banner pinned above the header (announcements, env badges). */
    topBanner?: ReactNode;
    /** Page content rendered in the scrollable main region. */
    children?: ReactNode;
}
/**
 * The outer application frame: a full-height flex row with the sidebar on the
 * left and a flex-column main area (optional top banner + header, then the
 * scrollable content) on the right.
 *
 * The main region is `relative` on purpose so consumers can absolutely-position
 * overlays inside it (NEX Studio renders its PersistentTerminalsLayer there).
 */
declare function AppShell({ sidebar, header, topBanner, children }: AppShellProps): react.JSX.Element;

interface SidebarProps {
    /** Whether the rail is collapsed. State is OWNED BY THE APP. */
    collapsed: boolean;
    /** Toggle handler for the collapse button. */
    onToggleCollapse: () => void;
    /** Brand/logo block at the top (hidden when collapsed). */
    logo?: ReactNode;
    /** Footer block at the bottom (e.g. user card + presence toggle). */
    footer?: ReactNode;
    /** Nav body — compose shared `<NavItem>` / `<SectionLabel>` (and app extras). */
    children?: ReactNode;
    /** Toggle tooltip when expanded (click collapses). NEX-Slovak default. */
    collapseTitle?: string;
    /** Toggle tooltip when collapsed (click expands). NEX-Slovak default. */
    expandTitle?: string;
}
/**
 * The collapsible sidebar container: a fixed-width rail (3.5rem collapsed /
 * 14rem expanded) with a header (logo + collapse toggle), a scrollable nav body
 * (`children`), and a footer slot. Provides `CollapseContext` so nested
 * `<NavItem>` / `<SectionLabel>` read the collapsed state without prop-threading.
 * Router-agnostic and store-agnostic — all data comes via slots / children.
 */
declare function Sidebar({ collapsed, onToggleCollapse, logo, footer, children, collapseTitle, expandTitle, }: SidebarProps): react.JSX.Element;

interface NavItemProps {
    /** Leading icon (decorative — the `label` is the accessible name). */
    icon: ReactNode;
    /** Visible text label (hidden when the sidebar is collapsed). */
    label: string;
    /** Highlight as the current route. The app computes this (e.g. via its router). */
    active?: boolean;
    /** Render greyed-out and non-interactive (kept visible for discoverability). */
    disabled?: boolean;
    /** Tooltip shown when disabled — explain why + how to enable. */
    disabledTitle?: string;
    /** Show an amber attention dot (e.g. a queue awaiting the user). */
    badge?: boolean;
    /** Accessible name for the badge dot (only used when `badge`). */
    badgeLabel?: string;
    /** Click handler — the app wires navigation here (router-agnostic lib). */
    onClick?: () => void;
    /** Optional anchor target; when set (and enabled) the item renders as `<a>`. */
    href?: string;
}
/**
 * A single navigation entry. Router-agnostic: the consuming app passes `active`
 * (computed from its own router) and either `onClick` or `href`. With `onClick`
 * and no `href` it renders a `<button>` (NEX Studio's navigate-on-click model);
 * with an `href` it renders an `<a>`. Reads the collapsed state from context.
 */
declare function NavItem({ icon, label, active, disabled, disabledTitle, badge, badgeLabel, onClick, href, }: NavItemProps): react.JSX.Element;

interface SectionLabelProps {
    /** Section heading text (rendered uppercase). */
    label: string;
}
/**
 * A small uppercase section heading inside the sidebar nav. Collapses to a thin
 * spacer when the rail is collapsed (reads the state from `CollapseContext`).
 */
declare function SectionLabel({ label }: SectionLabelProps): react.JSX.Element;

interface HeaderProps {
    /** Left-aligned slot content. */
    left?: ReactNode;
    /** Right-aligned slot content (pushed to the far end). */
    right?: ReactNode;
    /** Full custom content — overrides the left/right slots when provided. */
    children?: ReactNode;
    /** Extra classes appended to the header chrome. */
    className?: string;
}
/**
 * The top header bar chrome: a fixed-height dark row. Provide either `children`
 * (full control) or the `left` / `right` slots. Store- and router-agnostic — the
 * consuming app supplies its own breadcrumb / status content.
 */
declare function Header({ left, right, children, className }: HeaderProps): react.JSX.Element;

interface BrandProps {
    /** 1–2 letter app initials shown in the colored square (e.g. "NS", "NI"). */
    initials: string;
    /** App name shown next to the square (e.g. "NEX Studio"). */
    name: string;
    /** Optional version line under the name — the app passes its own string
        (build-time VITE_APP_VERSION for Studio, runtime /session for Inbox). */
    version?: string;
    /** Square background (Tailwind class). Defaults to the NEX indigo brand. */
    squareClassName?: string;
}
/**
 * The sidebar brand block: a colored rounded square with the app initials, the
 * app name, and an optional version line beneath it. Promoted from the NEX
 * Studio vzor (E1 unification, CR-NS-066) so every app's logo slot renders
 * identically — pass `logo={<Brand initials="NI" name="NEX Inbox" version={v} />}`.
 * Theme-aware via --color-* tokens (name + version resolve in light & dark). The
 * shared <Sidebar> hides the whole logo slot when collapsed, so this need not be
 * collapse-aware.
 */
declare function Brand({ initials, name, version, squareClassName }: BrandProps): react.JSX.Element;

interface UserCardProps {
    /** Avatar initials (e.g. first letter of the username, uppercased). */
    initials: string;
    /** Primary line — the logged-in user / session label. */
    name: string;
    /** Optional secondary line (e.g. "Director · Ri"). */
    subtitle?: string;
    /** Optional logout handler. When omitted the logout button is NOT rendered
        (e.g. NEX Inbox's re-launch model has no logout — CR-002). */
    onLogout?: () => void;
    /** Tooltip for the logout button. NEX-Slovak default. */
    logoutTitle?: string;
}
/**
 * The sidebar-footer user card: a round avatar with initials, the user name, an
 * optional role subtitle, and an optional logout button. Promoted from the NEX
 * Studio vzor (E1 unification, CR-NS-066) — pass `footer={<UserCard .../>}`.
 * Collapse-aware (avatar-only when the rail is collapsed) and theme-aware.
 */
declare function UserCard({ initials, name, subtitle, onLogout, logoutTitle, }: UserCardProps): react.JSX.Element;

interface ThemeToggleProps {
    /** Current theme. State is OWNED BY THE APP (Studio ThemeContext / Inbox uiStore). */
    theme: "light" | "dark";
    /** Toggle handler. */
    onToggle: () => void;
    /** aria-label (full action description) when currently dark (click → light). */
    toLightLabel?: string;
    /** aria-label (full action description) when currently light (click → dark). */
    toDarkLabel?: string;
    /** Short hover tooltip (target theme name) when currently dark. */
    toLightTitle?: string;
    /** Short hover tooltip (target theme name) when currently light. */
    toDarkTitle?: string;
}
/**
 * The top-bar theme toggle (Sun ↔ Moon) — promoted from the NEX Inbox vzor
 * (E1 unification, CR-NS-066; Inbox's top-right placement is the vzor for this
 * element). Presentational + theme-state-agnostic: the app passes its current
 * `theme` and an `onToggle`. Render it in the shared <Header> `right` slot.
 */
declare function ThemeToggle({ theme, onToggle, toLightLabel, toDarkLabel, toLightTitle, toDarkTitle, }: ThemeToggleProps): react.JSX.Element;

interface NavIconProps {
    /** A full-Unicode emoji glyph (e.g. "🏠"). The system color-emoji font renders
        it fully colored — no CSS needed (Director directive 2026-05-15). */
    glyph: string;
}
/**
 * A colored nav icon: wraps an emoji glyph in the canonical sizing box used by
 * the NEX Studio vzor (E1 unification, CR-NS-066). Pass to <NavItem icon=...>:
 * `<NavItem icon={<NavIcon glyph="🏠" />} ... />`. Decorative (aria-hidden) —
 * the NavItem `label` is the accessible name.
 */
declare function NavIcon({ glyph }: NavIconProps): react.JSX.Element;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    /** Mark the field invalid → red border + `aria-invalid`. */
    invalid?: boolean;
}
declare function Input({ invalid, className, ...rest }: InputProps): react.JSX.Element;

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    /** Mark the field invalid → red border + `aria-invalid`. */
    invalid?: boolean;
    /** `<option>` children. */
    children?: ReactNode;
}
declare function Select({ invalid, className, children, ...rest }: SelectProps): react.JSX.Element;

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
declare function Card({ className, children, ...rest }: CardProps): react.JSX.Element;

type BadgeVariant = "neutral" | "muted";
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    /** Color preset. Defaults to `neutral`. Pass `className` for ad-hoc colors. */
    variant?: BadgeVariant;
    /** Subtle attention animation (e.g. a pending decision). */
    pulse?: boolean;
    children?: ReactNode;
}
declare function Badge({ variant, pulse, className, children, ...rest }: BadgeProps): react.JSX.Element;

type StatusBadgeStatus = "success" | "warning" | "error" | "info" | "neutral";
interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
    /** Semantic state → color pair from tokens.css. Defaults to `neutral`. */
    status?: StatusBadgeStatus;
    /** Subtle attention animation (e.g. a pending state). */
    pulse?: boolean;
    children?: ReactNode;
}
declare function StatusBadge({ status, pulse, className, children, ...rest }: StatusBadgeProps): react.JSX.Element;

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    /** The icon element. Consumer-supplied — nex-shared ships no icon library, so the
     *  app passes its own icon node (e.g. a lucide element or an inline <svg>). */
    icon: ReactNode;
    /** REQUIRED accessible name — an icon-only button has no visible text label. */
    "aria-label": string;
    /** Visual style (shared vocabulary with <Button>). Defaults to `ghost` — the
     *  quiet look used for table row actions (edit / deactivate). */
    variant?: ButtonVariant;
    /** Square padding scale. Defaults to `md`. */
    size?: ButtonSize;
}
declare function IconButton({ icon, variant, size, className, type, ...rest }: IconButtonProps): react.JSX.Element;

type DataTableAlign = "left" | "center" | "right";
interface DataTableColumn<Row> {
    /** Stable column id (React key). Also the property read from the row when
     *  `render` is omitted. */
    key: string;
    /** Header cell content. */
    header: ReactNode;
    /** Custom cell renderer. When omitted, `row[key]` is shown as text. */
    render?: (row: Row) => ReactNode;
    /** Horizontal alignment of the header + body cells. Defaults to `left`. */
    align?: DataTableAlign;
    /** Extra classes appended to each body cell in this column. */
    className?: string;
}
interface DataTableProps<Row> {
    /** Column config (in display order). Generic over the row type. */
    columns: DataTableColumn<Row>[];
    /** Row data. */
    rows: Row[];
    /** Stable React key per row. */
    getRowKey: (row: Row) => string | number;
    /** Optional trailing actions column (e.g. <IconButton> edit / deactivate). */
    rowActions?: (row: Row) => ReactNode;
    /** Header label for the trailing actions column. Defaults to empty. */
    rowActionsHeader?: ReactNode;
    /** Shown (spanning all columns) when `rows` is empty. */
    emptyMessage?: ReactNode;
    /** Appended to the outer wrapper. */
    className?: string;
}
declare function DataTable<Row>({ columns, rows, getRowKey, rowActions, rowActionsHeader, emptyMessage, className, }: DataTableProps<Row>): react.JSX.Element;

/**
 * Structured create/edit form layout kit — the canonical NEX admin form look
 * (see the NEX Studio Users create/edit form): a responsive grid of labelled
 * fields plus a consistent right-aligned action row. All labels are props/children,
 * so nothing is hardcoded Slovak — the consumer supplies "Uložiť" / "Zrušiť" etc.
 *
 *   <FormGrid>
 *     <FormField label="Email" htmlFor="email" required>
 *       <Input id="email" … />
 *     </FormField>
 *     <FormField label="Rola" htmlFor="role">
 *       <Select id="role" …>…</Select>
 *     </FormField>
 *   </FormGrid>
 *   <FormActions submitLabel="Uložiť" onSubmit={…} cancelLabel="Zrušiť" onCancel={…} />
 */
interface FormGridProps extends HTMLAttributes<HTMLDivElement> {
    /** Column count on desktop (md+). Mobile is always a single column. Defaults to 2. */
    columns?: 1 | 2;
    children?: ReactNode;
}
declare function FormGrid({ columns, className, children, ...rest }: FormGridProps): react.JSX.Element;
interface FormFieldProps {
    /** Field label text. */
    label: ReactNode;
    /** `id` of the control — wires `<label htmlFor>` for a11y. */
    htmlFor?: string;
    /** Appends a `*` marker to the label. */
    required?: boolean;
    /** Helper text under the control (hidden when `error` is set). */
    hint?: ReactNode;
    /** Error text under the control (replaces `hint`, error-colored). */
    error?: ReactNode;
    /** Span both columns of a 2-column FormGrid. */
    full?: boolean;
    /** The control (Input / Select / …). */
    children?: ReactNode;
}
declare function FormField({ label, htmlFor, required, hint, error, full, children, }: FormFieldProps): react.JSX.Element;
interface FormActionsProps {
    /** Custom action content. When supplied, the built-in buttons are NOT rendered —
     *  the row becomes a plain right-aligned flex container for the consumer's nodes. */
    children?: ReactNode;
    /** Primary button label (consumer-supplied, e.g. "Uložiť"). Renders a primary
     *  button when set. */
    submitLabel?: ReactNode;
    /** Primary button click handler. */
    onSubmit?: () => void;
    /** Secondary button label (e.g. "Zrušiť"). Renders a secondary button when set. */
    cancelLabel?: ReactNode;
    /** Secondary button click handler. */
    onCancel?: () => void;
    /** Disables the primary button (in-flight call or invalid form). */
    submitDisabled?: boolean;
    /** Appended to the row wrapper. */
    className?: string;
}
declare function FormActions({ children, submitLabel, onSubmit, cancelLabel, onCancel, submitDisabled, className, }: FormActionsProps): react.JSX.Element;

/**
 * ReleaseNotes — the unified, user-facing changelog renderer ("Čo je nové")
 * for ALL ICC apps (E1 unification; the changelog look lives in nex-shared like
 * the chrome, Director-approved). Ported 1:1 from the NEX Studio vzor
 * (`pages/UpdatesPage.tsx`) as a pure presentation component: the consumer
 * fetches its own release notes and feeds them in via props.
 *
 * Markdown is rendered with react-markdown + remark-gfm + the local CodeBlock
 * override. Both react-markdown and remark-gfm are peerDependencies (provided
 * by the consuming app at runtime) and are NOT bundled into dist.
 */
interface ReleaseNote {
    version: string;
    released_at: string | null;
    markdown: string;
}
interface ReleaseNotesProps {
    notes: ReleaseNote[];
    loading?: boolean;
    error?: string | null;
    onDismissError?: () => void;
    /** Appended to the subtitle, e.g. "… v jednotlivých verziách NEX Studio." */
    appName?: string;
}
/**
 * Full "Aktualizácie" page content: title + subtitle, error banner, loading /
 * empty states, and the expandable per-version card list (newest default-open).
 */
declare function ReleaseNotes({ notes, loading, error, onDismissError, appName, }: ReleaseNotesProps): react.JSX.Element;

interface CodeBlockProps {
    children: string;
    language?: string;
}
/**
 * Code block with copy-to-clipboard button. Ported into nex-shared (E1
 * unification) from the NEX Studio vzor `components/markdown/CodeBlock.tsx`.
 * Icons are inline SVG (no lucide) per the nex-shared zero-dep / emoji+SVG rule.
 */
declare function CodeBlock({ children, language }: CodeBlockProps): react.JSX.Element;

/**
 * Generic, configurable HTTP-client factory (E1 Phase B4, CR-NS-051).
 *
 * Extracted verbatim from NEX Studio's `services/api.ts` machinery — the moving
 * parts (base URL, token storage, error envelope, 401 behavior) become config so
 * NEX Studio / Inbox / Ledger share ONE client. Pure TS: NO Tailwind, NO
 * react-router, NO stores, NO app imports. Uses the platform `fetch`.
 */
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
/** Optional per-request overrides. */
interface RequestOptions {
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
interface ApiErrorEnvelope {
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
declare class ApiError extends Error {
    readonly status: number;
    readonly data: unknown;
    readonly code?: string;
    readonly symbol?: string;
    readonly resolution?: string;
    constructor(status: number, message: string, data?: unknown, extra?: ApiErrorEnvelope);
}
/** Configuration for {@link createApiClient}. */
interface ApiClientConfig {
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
interface ApiClient {
    request<T>(method: HttpMethod, path: string, body?: unknown, options?: RequestOptions): Promise<T>;
    get<T>(path: string, options?: RequestOptions): Promise<T>;
    post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
    put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
    patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
    delete<T>(path: string, options?: RequestOptions): Promise<T>;
}
/**
 * Register a callback invoked on every 401 (before `config.onUnauthorized`).
 * Intended to be called once by the app's auth store to clear in-memory state
 * without performing its own redirect.
 */
declare function registerAuthCallback(cb: () => void): void;
/**
 * Create a configured HTTP client. The returned object exposes `get/post/put/
 * patch/delete` plus the low-level `request<T>`.
 */
declare function createApiClient(config: ApiClientConfig): ApiClient;

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

type AuthMode = "login" | "token-launch";
/**
 * Configuration for {@link createAuthStore}. `T` is the app's user type; `A` is
 * the login action's argument tuple (e.g. `[string, string]` for username +
 * password) — kept positional so the consuming app's existing `login(u, p)`
 * call sites stay unchanged.
 */
interface AuthConfig<T, A extends unknown[] = unknown[]> {
    mode: AuthMode;
    /** localStorage key for the Zustand persist (mode 1). Default: `nex-auth`. */
    persistKey?: string;
    /** Probe the current user (`GET /auth/me` or `/session`) — app supplies the call. */
    getUser: () => Promise<T>;
    /** Authenticate (mode 1). Returns the raw token + user; the app maps its own response shape. */
    login?: (...args: A) => Promise<{
        token: string;
        user: T;
    }>;
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
interface LoginAuthState<T, A extends unknown[]> {
    token: string | null;
    user: T | null;
    login: (...args: A) => Promise<void>;
    logout: () => Promise<void>;
    fetchMe: () => Promise<void>;
}
/** Mode-2 store shape (session metadata, no token). */
interface TokenLaunchAuthState<T> {
    user: T | null;
    ready: boolean;
    probe: () => Promise<void>;
    clear: () => void;
}
/** Mode-1 module: login store + convenience login hook. */
interface LoginAuthModule<T, A extends unknown[]> {
    /** The bound Zustand hook ({@link LoginAuthState}). */
    useAuthStore: UseBoundStore<StoreApi<LoginAuthState<T, A>>>;
    /** Where an unauthenticated user is redirected (mirrors the config). */
    redirectOnUnauthorized: string;
    /** Convenience login hook with local loading/error. */
    useLogin: () => {
        login: (...args: A) => Promise<void>;
        loading: boolean;
        error: string | null;
    };
}
/** Mode-2 module: session store + probe hook. */
interface TokenLaunchAuthModule<T> {
    /** The bound Zustand hook ({@link TokenLaunchAuthState}). */
    useAuthStore: UseBoundStore<StoreApi<TokenLaunchAuthState<T>>>;
    redirectOnUnauthorized: string;
    /** Runs `getUser` on mount and tracks `ready`. */
    useSessionProbe: () => {
        user: T | null;
        ready: boolean;
    };
}
/** Union of the per-mode modules (the impl return type). */
type AuthModule<T, A extends unknown[]> = LoginAuthModule<T, A> | TokenLaunchAuthModule<T>;
declare function createAuthStore<T, A extends unknown[] = unknown[]>(config: AuthConfig<T, A> & {
    mode: "login";
}): LoginAuthModule<T, A>;
declare function createAuthStore<T, A extends unknown[] = unknown[]>(config: AuthConfig<T, A> & {
    mode: "token-launch";
}): TokenLaunchAuthModule<T>;

interface ProtectedRouteProps {
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
declare function ProtectedRoute({ authed, validate, isAuthed, redirect, children }: ProtectedRouteProps): react.JSX.Element | null;

/** Credentials collected by the form. `username` carries the identity value
 *  (a username or, in `email` mode, the email string). */
interface LoginCreds {
    username: string;
    password: string;
}
interface LoginFormProps {
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
    identityLabel?: string;
    passwordLabel?: string;
    submitLabel?: string;
    loadingLabel?: string;
    identityPlaceholder?: string;
    passwordPlaceholder?: string;
}
declare function LoginForm({ fieldLabel, onSubmit, loading, error, onChange, autoFocus, showPasswordToggle, identityLabel, passwordLabel, submitLabel, loadingLabel, identityPlaceholder, passwordPlaceholder, }: LoginFormProps): react.JSX.Element;

/**
 * Shared TS contracts for the unified Settings/Admin kit (CR-NS-078).
 *
 * Domain shapes mirror each ICC app's settings/user/session serializers at the
 * canonical boundary the Director approved: user-active is canonical `is_active`,
 * roles stay per-app (the kit receives `roleOptions` + capability booleans /
 * predicates, NEVER role-string literals). Apps map their own serializer field
 * names onto these on the way in.
 */
/** The four canonical settings tabs. An app enables a subset via `SettingsKitConfig.tabs`. */
type SettingsTabId = "system" | "agents" | "users" | "sessions";
/**
 * Serialised user row. `role` is an opaque string (role-agnostic kit) — the app
 * supplies `roleOptions` + a `roleClass` predicate for display, never a literal.
 * Canonical active flag is `is_active`.
 */
interface UserRead {
    id: string;
    username: string;
    email: string;
    /** Opaque per-app role identifier (kit never compares against literals). */
    role: string;
    /** Canonical soft-disable flag (Director-approved canonical field). */
    is_active: boolean;
    /** Given name (nullable — legacy users / apps without names may omit it). */
    first_name?: string | null;
    /** Family name (nullable). */
    last_name?: string | null;
    /** Telegram chat_id for agent notifications (nullable; apps without it omit). */
    telegram_chat_id?: string | null;
    /** ISO-8601 timestamp. */
    created_at: string;
    /** ISO-8601 timestamp. */
    updated_at: string;
}
/**
 * Serialised user-session row — a per-user JWT lifecycle anchor. `token_version`
 * is bumped on logout/password-change to invalidate outstanding JWTs.
 */
interface UserSessionRead {
    id: string;
    user_id: string;
    token_version: number;
    /** ISO-8601 timestamp. */
    last_seen_at: string;
    /** ISO-8601 timestamp. */
    created_at: string;
    /** ISO-8601 timestamp. */
    updated_at: string;
}
/** Runtime type of a system-setting `value` — drives the input widget. */
type SystemSettingValueType = "string" | "int" | "float" | "bool";
/** Serialised system-setting row. A stored override sets `is_default` to false. */
interface SystemSettingRead {
    key: string;
    value: string;
    value_type: SystemSettingValueType;
    description: string | null;
    /** Human display name (the card title); the raw `key` drops to small info. Optional — when absent the
     *  `key` is the title (backward-compatible for apps that don't supply a label). */
    label?: string | null;
    /** Unit shown after the editor (e.g. "sekúnd", "€ / hod"). Optional; empty/absent → no suffix. */
    unit?: string | null;
    /** ISO-8601 timestamp of last edit; `null` when the value is a default. */
    updated_at: string | null;
    /** UUID of the user who last edited; `null` for defaults. */
    updated_by: string | null;
    /** Username of the last editor; `null` for defaults or a deleted editor. */
    updated_by_username: string | null;
    /** `true` when the value comes from the service-layer default. */
    is_default: boolean;
}
/**
 * A system-settings category. Every setting whose `key` starts with one of
 * `prefixes` is grouped under it; keys matching no category fall into a trailing
 * "Ostatné" bucket so forward-compat additions stay visible.
 */
interface SettingsCategory {
    id: string;
    label: string;
    description: string;
    prefixes: string[];
}
/**
 * Which user fields a given app's `UserForm` renders. Apps differ (e.g. NEX
 * Ledger has no username/names/telegram), so the field set is injected.
 */
interface UserFieldSchema {
    /** Show the username field (disabled in edit mode for login stability). */
    username: boolean;
    /** Show the first-name + last-name fields. */
    names: boolean;
    /** Show the Telegram chat_id field. */
    telegram: boolean;
    /** Minimum password length (mirrors the app's backend constraint). */
    passwordMinLength: number;
}
/**
 * Top-level kit config for `SettingsShell`. The app declares which tabs exist,
 * their (Slovak, overridable) labels, and an optional per-role visibility
 * predicate. A tab renders only when it is in `tabs` AND `tabVisibleForRole`
 * (when supplied) returns true.
 */
interface SettingsKitConfig {
    /** Enabled tabs, in display order (subset of the four canonical ids). */
    tabs: SettingsTabId[];
    /** Slovak tab labels (app-overridable). */
    labels: Record<SettingsTabId, string>;
    /** Optional capability predicate — hide a tab from a role entirely. */
    tabVisibleForRole?: (tab: SettingsTabId, role: string) => boolean;
}

interface SettingsShellProps {
    /** Tabs, labels + per-role visibility predicate. */
    config: SettingsKitConfig;
    /** The current user's (opaque) role — passed to `tabVisibleForRole`. */
    currentUserRole: string;
    /** Panel body for each enabled tab. */
    panels: Partial<Record<SettingsTabId, ReactNode>>;
    /** Page title in the header. Defaults to "Nastavenia". */
    title?: string;
    /** Optional right-aligned header slot (e.g. the app's "logged in as" badge —
     *  role coloring is an app concern, kept out of the role-agnostic kit). */
    headerRight?: ReactNode;
}
declare function SettingsShell({ config, currentUserRole, panels, title, headerRight, }: SettingsShellProps): react.JSX.Element;

interface SystemSettingsPanelProps {
    settings: SystemSettingRead[];
    /** Display categories; keys matching none fall into a trailing "Ostatné" bucket. */
    categories: SettingsCategory[];
    /** Whether the current user may edit (else the panel is read-only). */
    canEdit: boolean;
    /** Persist one setting. Resolves with the updated row; rejects with an Error
     *  whose message is surfaced inline. */
    onSave: (key: string, value: string) => Promise<SystemSettingRead>;
    /** Initial load in flight. */
    loading?: boolean;
    /** Load error message (empty/undefined = none). */
    loadError?: string;
}
declare function SystemSettingsPanel({ settings, categories, canEdit, onSave, loading, loadError, }: SystemSettingsPanelProps): react.JSX.Element;

/**
 * AgentsPanel — per-role model + effort grid (NEX Studio CR-NS-040 behaviour),
 * rendered only where the app has agents. Role-agnostic: the roles, models and
 * effort levels are all injected, never hardcoded.
 *
 * `drafts` is the app-loaded baseline (a row per role id); the panel seeds its
 * editable grid from it and persists a row via `onSave(roleId, { model, effort })`
 * (resolve → ✓ flash; reject → the app surfaces the message via `saveErrors`).
 */
/** One role's draft selection. Empty string = "use the default". ``helperModel`` (optional) is the model
 * a role's dynamically-spawned helper agents run on — only meaningful for roles in
 * ``helperModelRoleIds`` (the doer that spawns helpers); absent/"" = the dispatch default. */
interface AgentDraft {
    model: string;
    effort: string;
    helperModel?: string;
}
interface AgentsPanelProps {
    roles: {
        id: string;
        label: string;
    }[];
    models: {
        id: string;
        label: string;
    }[];
    efforts: string[];
    /** App-loaded baseline per role id (stable after load). */
    drafts: Record<string, AgentDraft>;
    /** Persist one role's config. Resolve → flash; reject → app sets `saveErrors`. */
    onSave: (roleId: string, value: AgentDraft) => Promise<void>;
    /** Options for the optional per-role "helper model" selector (model IDs the spawned helpers may run on).
     * Omitted/empty → no helper-model selector is shown for any role. */
    helperModels?: {
        id: string;
        label: string;
    }[];
    /** Role ids that spawn dynamic helpers → show the helper-model selector (e.g. ["ai_agent"]). Other roles
     * never render it (the verifier does not spawn helpers). No-op unless ``helperModels`` is also given. */
    helperModelRoleIds?: string[];
    /** Initial load in flight. */
    loading?: boolean;
    /** Load error message (empty/undefined = none). */
    loadError?: string;
    /** Per-role save error messages, keyed by role id. */
    saveErrors?: Record<string, string>;
}
declare function AgentsPanel({ roles, models, efforts, drafts, onSave, helperModels, helperModelRoleIds, loading, loadError, saveErrors, }: AgentsPanelProps): react.JSX.Element;

/** Collected form values handed to the parent on submit. */
interface UserFormData {
    username: string;
    email: string;
    /** Create: required. Edit: empty string = keep current. */
    password: string;
    /** Opaque per-app role identifier (one of `roleOptions[].value`). */
    role: string;
    first_name: string;
    last_name: string;
    /** Telegram chat_id for agent notifications. */
    telegram_chat_id: string;
    is_active: boolean;
}
interface UserFormProps {
    mode: "create" | "edit";
    /** Required in edit mode — values pre-fill the form. */
    initial?: UserRead;
    /** Role options for the role `<select>` (app-supplied; no role literals here). */
    roleOptions: {
        value: string;
        label: string;
    }[];
    /** Which fields to render + the password min length (app-specific). */
    fieldSchema: UserFieldSchema;
    /** Disables all inputs + submit button. Driven by the parent's in-flight call. */
    submitting: boolean;
    /** Backend error message to display below the title. Empty = hidden. */
    error: string;
    /** Called with the collected form data on submit. The parent maps it to the
     *  right API calls (create vs patch + change-password). */
    onSubmit: (data: UserFormData) => Promise<void> | void;
    /** Optional cancel handler — when supplied a "Zrušiť" button is rendered. */
    onCancel?: () => void;
}
declare function UserForm({ mode, initial, roleOptions, fieldSchema, submitting, error, onSubmit, onCancel, }: UserFormProps): react.JSX.Element;

interface UsersPanelProps {
    users: UserRead[];
    /** Role options for the filter + the create/edit form (no role literals here). */
    roleOptions: {
        value: string;
        label: string;
    }[];
    /** Whether the current user may create/edit/delete/toggle (else read-only). */
    canManage: boolean;
    /** Field set + password rule for the embedded UserForm. */
    fieldSchema: UserFieldSchema;
    /** Create a user. Reject with an Error to surface the message inline. */
    onCreate: (data: UserFormData) => Promise<void>;
    /** Patch profile fields (password is handled via `onChangePassword`). */
    onUpdate: (id: string, data: UserFormData) => Promise<void>;
    /** Delete a user. Reject (e.g. 409 FK conflict) surfaces a "deaktivovať" hint. */
    onDelete: (id: string) => Promise<void>;
    /** Rotate a user's password (called after `onUpdate` when a new one was typed). */
    onChangePassword: (id: string, password: string) => Promise<void>;
    /** Flip `is_active`. */
    onToggleActive: (user: UserRead) => Promise<void>;
    /** Optional role→className for the role cell (app supplies the palette). */
    roleClass?: (role: string) => string;
}
declare function UsersPanel({ users, roleOptions, canManage, fieldSchema, onCreate, onUpdate, onDelete, onChangePassword, onToggleActive, roleClass, }: UsersPanelProps): react.JSX.Element;

interface SessionsPanelProps {
    sessions: UserSessionRead[];
    /** Resolve a user id to a display name (falls back to the id). */
    resolveUsername?: (userId: string) => string;
    /** Whether the current user may revoke sessions. */
    canRevoke: boolean;
    /** Revoke (delete) a session. Reject with an Error to surface the message. */
    onRevoke: (id: string) => Promise<void>;
    /** Initial load in flight. */
    loading?: boolean;
    /** Load error message (empty/undefined = none). */
    loadError?: string;
    /** App-controlled user filter; the panel also filters rows by it. */
    filterUserId?: string;
    /** Clear/change the user filter. */
    onFilterChange?: (userId: string) => void;
}
declare function SessionsPanel({ sessions, resolveUsername, canRevoke, onRevoke, loading, loadError, filterUserId, onFilterChange, }: SessionsPanelProps): react.JSX.Element;

export { type AgentDraft, AgentsPanel, type AgentsPanelProps, type ApiClient, type ApiClientConfig, ApiError, type ApiErrorEnvelope, AppShell, type AppShellProps, type AuthConfig, type AuthMode, type AuthModule, Badge, type BadgeProps, type BadgeVariant, Brand, type BrandProps, Button, type ButtonProps, type ButtonSize, type ButtonVariant, Card, type CardProps, CodeBlock, type CodeBlockProps, DataTable, type DataTableAlign, type DataTableColumn, type DataTableProps, FormActions, type FormActionsProps, FormField, type FormFieldProps, FormGrid, type FormGridProps, Header, type HeaderProps, type HttpMethod, IconButton, type IconButtonProps, Input, type InputProps, type LoginAuthModule, type LoginAuthState, type LoginCreds, LoginForm, type LoginFormProps, NavIcon, type NavIconProps, NavItem, type NavItemProps, ProtectedRoute, type ProtectedRouteProps, type ReleaseNote, ReleaseNotes, type ReleaseNotesProps, type RequestOptions, SectionLabel, type SectionLabelProps, Select, type SelectProps, SessionsPanel, type SessionsPanelProps, type SettingsCategory, type SettingsKitConfig, SettingsShell, type SettingsShellProps, type SettingsTabId, Sidebar, type SidebarProps, StatusBadge, type StatusBadgeProps, type StatusBadgeStatus, type SystemSettingRead, type SystemSettingValueType, SystemSettingsPanel, type SystemSettingsPanelProps, ThemeToggle, type ThemeToggleProps, type TokenLaunchAuthModule, type TokenLaunchAuthState, UserCard, type UserCardProps, type UserFieldSchema, UserForm, type UserFormData, type UserFormProps, type UserRead, type UserSessionRead, UsersPanel, type UsersPanelProps, createApiClient, createAuthStore, registerAuthCallback };
