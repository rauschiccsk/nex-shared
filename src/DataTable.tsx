import type { ReactNode } from "react";

export type DataTableAlign = "left" | "center" | "right";

export interface DataTableColumn<Row> {
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

export interface DataTableProps<Row> {
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

const ALIGN: Record<DataTableAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

// Default cell when a column has no `render`: read row[key] and show it as text.
// Non-primitive values are stringified — rich content should supply `render`.
function defaultCell<Row>(row: Row, key: string): ReactNode {
  const value = (row as Record<string, unknown>)[key];
  if (value == null) return null;
  if (typeof value === "string" || typeof value === "number") return value;
  return String(value);
}

// Generic, typed data table matching the reference NEX Studio admin look: rounded bordered
// surface, uppercase muted header row on a hover-surface background, divided rows with a hover
// tint, per-column alignment, and an optional right-aligned actions column. App owns the data
// + the action nodes; the table owns only the consistent chrome.
export function DataTable<Row>({
  columns,
  rows,
  getRowKey,
  rowActions,
  rowActionsHeader,
  emptyMessage = "Žiadne dáta",
  className = "",
}: DataTableProps<Row>) {
  const colCount = columns.length + (rowActions ? 1 : 0);
  return (
    <div
      className={`rounded-xl border border-[var(--color-border-default)] overflow-hidden ${className}`.trim()}
    >
      <table className="w-full text-sm">
        <thead className="bg-[var(--color-surface-hover)]">
          <tr className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-2.5 font-semibold ${ALIGN[col.align ?? "left"]}`}
              >
                {col.header}
              </th>
            ))}
            {rowActions && (
              <th className="px-4 py-2.5 font-semibold text-right">{rowActionsHeader}</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border-default)]">
          {rows.map((row) => (
            <tr
              key={getRowKey(row)}
              className="hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-[var(--color-text-secondary)] ${ALIGN[col.align ?? "left"]} ${col.className ?? ""}`.trim()}
                >
                  {col.render ? col.render(row) : defaultCell(row, col.key)}
                </td>
              ))}
              {rowActions && (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">{rowActions(row)}</div>
                </td>
              )}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={colCount}
                className="px-4 py-6 text-center text-xs text-[var(--color-text-muted)]"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
