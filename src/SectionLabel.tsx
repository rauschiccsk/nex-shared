import { useCollapsed } from "./CollapseContext";

export interface SectionLabelProps {
  /** Section heading text (rendered uppercase). */
  label: string;
}

/**
 * A small uppercase section heading inside the sidebar nav. Collapses to a thin
 * spacer when the rail is collapsed (reads the state from `CollapseContext`).
 */
export function SectionLabel({ label }: SectionLabelProps) {
  const collapsed = useCollapsed();
  if (collapsed) return <div className="h-3" />;
  return (
    <div className="pt-3 pb-1 px-3 text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-semibold">
      {label}
    </div>
  );
}
