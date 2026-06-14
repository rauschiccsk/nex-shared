export interface BrandProps {
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
export function Brand({ initials, name, version, squareClassName = "bg-primary-600" }: BrandProps) {
  return (
    <>
      <div
        className={`w-8 h-8 rounded-lg ${squareClassName} flex items-center justify-center text-white font-black text-sm shrink-0`}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-[var(--color-text-primary)] leading-tight">{name}</div>
        {version != null && version !== "" && (
          <div className="text-[10px] text-[var(--color-version-text)] font-mono">{version}</div>
        )}
      </div>
    </>
  );
}
