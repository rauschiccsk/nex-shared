import * as react from 'react';
import { ButtonHTMLAttributes, ReactNode, InputHTMLAttributes, SelectHTMLAttributes, HTMLAttributes } from 'react';

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md";
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

export { AppShell, type AppShellProps, Badge, type BadgeProps, type BadgeVariant, Button, type ButtonProps, type ButtonSize, type ButtonVariant, Card, type CardProps, Header, type HeaderProps, Input, type InputProps, NavItem, type NavItemProps, SectionLabel, type SectionLabelProps, Select, type SelectProps, Sidebar, type SidebarProps };
