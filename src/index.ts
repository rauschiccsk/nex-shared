export { Button } from "./Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button";

export { AppShell } from "./AppShell";
export type { AppShellProps } from "./AppShell";

export { ShellContext, useShell, useWideScreen, WIDE_SCREEN_QUERY } from "./ShellContext";
export type { ShellState } from "./ShellContext";

export { Sidebar, SIDEBAR_DEFAULT_WIDTH } from "./Sidebar";
export { Page } from "./Page";
export type { PageProps, PageWidth } from "./Page";
export type { SidebarProps } from "./Sidebar";
export {
  SIDEBAR_WIDTH_KEY_PREFIX,
  readRememberedWidth,
  rememberWidth,
  useRememberedSidebarWidth,
} from "./rememberedWidth";

export { ResizeHandle } from "./ResizeHandle";
export type { ResizeHandleProps } from "./ResizeHandle";

export { DensityContext, useDense } from "./DensityContext";

export { SectionDivider } from "./SectionDivider";

export { NavItem } from "./NavItem";
export type { NavItemProps } from "./NavItem";

export { SectionLabel } from "./SectionLabel";
export type { SectionLabelProps } from "./SectionLabel";

export { Header } from "./Header";
export type { HeaderProps } from "./Header";

export { Brand } from "./Brand";
export type { BrandProps } from "./Brand";

export { UserCard } from "./UserCard";
export type { UserCardProps } from "./UserCard";

export { ThemeToggle } from "./ThemeToggle";
export type { ThemeToggleProps } from "./ThemeToggle";

export { NavIcon } from "./NavIcon";
export type { NavIconProps } from "./NavIcon";

export { Input } from "./Input";
export type { InputProps } from "./Input";

export { Select } from "./Select";
export type { SelectProps } from "./Select";

export { Card } from "./Card";
export type { CardProps } from "./Card";

export { Badge } from "./Badge";
export type { BadgeProps, BadgeVariant } from "./Badge";

// ── Unified admin-screen building blocks (CR-NS-082, v0.12.0) ──
export { StatusBadge } from "./StatusBadge";
export type { StatusBadgeProps, StatusBadgeStatus } from "./StatusBadge";

export { IconButton } from "./IconButton";
export type { IconButtonProps } from "./IconButton";

export { DataTable } from "./DataTable";
export type { DataTableProps, DataTableColumn, DataTableAlign } from "./DataTable";

export { FormGrid, FormField, FormActions } from "./FormGrid";
export type { FormGridProps, FormFieldProps, FormActionsProps } from "./FormGrid";

export { ReleaseNotes } from "./ReleaseNotes";
export type { ReleaseNotesProps, ReleaseNote } from "./ReleaseNotes";

export { CodeBlock } from "./CodeBlock";
export type { CodeBlockProps } from "./CodeBlock";

export { createApiClient, ApiError, registerAuthCallback } from "./api-client";
export type {
  ApiClient,
  ApiClientConfig,
  ApiErrorEnvelope,
  RequestOptions,
  HttpMethod,
} from "./api-client";

export { createAuthStore } from "./auth-store";
export type {
  AuthConfig,
  AuthMode,
  AuthModule,
  LoginAuthModule,
  TokenLaunchAuthModule,
  LoginAuthState,
  TokenLaunchAuthState,
} from "./auth-store";

export { ProtectedRoute } from "./ProtectedRoute";
export type { ProtectedRouteProps } from "./ProtectedRoute";

export { LoginForm } from "./LoginForm";
export type { LoginFormProps, LoginCreds } from "./LoginForm";

// ── Unified Settings/Admin kit (CR-NS-078) ──
export { SettingsShell } from "./SettingsShell";
export type { SettingsShellProps } from "./SettingsShell";

export { SystemSettingsPanel } from "./SystemSettingsPanel";
export type { SystemSettingsPanelProps } from "./SystemSettingsPanel";

export { AgentsPanel } from "./AgentsPanel";
export type { AgentsPanelProps, AgentDraft } from "./AgentsPanel";

export { UsersPanel } from "./UsersPanel";
export type { UsersPanelProps } from "./UsersPanel";

export { MyAccountPanel } from "./MyAccountPanel";
export type { MyAccountPanelProps, MyAccountUser } from "./MyAccountPanel";

export { SessionsPanel } from "./SessionsPanel";
export type { SessionsPanelProps } from "./SessionsPanel";

export { UserForm } from "./UserForm";
export type { UserFormProps, UserFormData } from "./UserForm";

export type {
  UserRead,
  UserSessionRead,
  SettingChoice,
  SystemSettingRead,
  SystemSettingValueType,
  SettingsKitConfig,
  SettingsTabId,
  SettingsCategory,
  UserFieldSchema,
} from "./settings-types";

export {
  rememberLaunchWindow,
  fitToScreen,
  LAUNCH_WINDOW_PREFIX,
  LAUNCH_WINDOW_STORAGE_KEY,
  LAUNCH_WINDOW_SAVE_DELAY_MS,
} from "./launchWindow";
export type { WindowPlacement, LaunchWindow, PlacementStorage } from "./launchWindow";
