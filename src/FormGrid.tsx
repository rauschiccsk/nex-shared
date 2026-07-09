import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "./Button";

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

export interface FormGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Column count on desktop (md+). Mobile is always a single column. Defaults to 2. */
  columns?: 1 | 2;
  children?: ReactNode;
}

const GRID_COLS: Record<1 | 2, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
};

export function FormGrid({ columns = 2, className = "", children, ...rest }: FormGridProps) {
  return (
    <div className={`grid ${GRID_COLS[columns]} gap-3 ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}

export interface FormFieldProps {
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

// One labelled field: label (+ optional required marker), the control, then an
// optional hint or error line. Matches the label styling used across the NEX forms.
export function FormField({
  label,
  htmlFor,
  required = false,
  hint,
  error,
  full = false,
  children,
}: FormFieldProps) {
  return (
    <div className={full ? "md:col-span-2" : undefined}>
      <label htmlFor={htmlFor} className="block text-xs text-[var(--color-text-muted)] mb-1">
        {label}
        {required && <span className="text-[var(--color-status-error)]"> *</span>}
      </label>
      {children}
      {error ? (
        <div className="mt-1 text-[10px] text-[var(--color-status-error)]">{error}</div>
      ) : hint ? (
        <div className="mt-1 text-[10px] text-[var(--color-text-muted)]">{hint}</div>
      ) : null}
    </div>
  );
}

export interface FormActionsProps {
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

// Consistent form action row (right-aligned). Either drop in your own nodes via `children`,
// or use the primary/secondary convenience props (labels are always consumer-supplied).
export function FormActions({
  children,
  submitLabel,
  onSubmit,
  cancelLabel,
  onCancel,
  submitDisabled = false,
  className = "",
}: FormActionsProps) {
  return (
    <div className={`flex gap-2 justify-end ${className}`.trim()}>
      {children ?? (
        <>
          {cancelLabel != null && (
            <Button variant="secondary" size="sm" onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}
          {submitLabel != null && (
            <Button variant="primary" size="sm" onClick={onSubmit} disabled={submitDisabled}>
              {submitLabel}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
