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

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Card } from "./Card";
import { CodeBlock } from "./CodeBlock";

export interface ReleaseNote {
  version: string;
  released_at: string | null;
  markdown: string;
}

export interface ReleaseNotesProps {
  notes: ReleaseNote[];
  loading?: boolean;
  error?: string | null;
  onDismissError?: () => void;
  /** Appended to the subtitle, e.g. "… v jednotlivých verziách NEX Studio." */
  appName?: string;
}

/** Format an ISO ``YYYY-MM-DD`` date as Slovak long form (e.g. ``20. jún 2026``).
 *  Parsed component-wise to avoid a UTC-midnight off-by-one in the local tz. */
function formatDate(iso: string | null): string {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Markdown body — richer typography + coloured section headings for the changelog. */
function MarkdownBody({ children }: { children: string }) {
  // Strip a leading version H2 (e.g. "## v0.9.0") — the card header already shows it.
  const body = children.replace(/^\s*##\s+\S.*(?:\r?\n)+/, "");
  return (
    <div
      className="prose prose-base dark:prose-invert max-w-none
        prose-headings:font-semibold
        prose-h3:text-primary-500 prose-h3:text-base prose-h3:mt-5 prose-h3:mb-1
        prose-p:text-[var(--color-text-secondary)] prose-p:leading-relaxed
        prose-strong:text-[var(--color-text-primary)]
        prose-li:text-[var(--color-text-secondary)] prose-li:marker:text-primary-500"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline =
              !className && typeof children === "string" && !children.includes("\n");
            if (!isInline && match) {
              return <CodeBlock language={match[1]}>{String(children)}</CodeBlock>;
            }
            if (!isInline && typeof children === "string" && children.includes("\n")) {
              return <CodeBlock>{String(children)}</CodeBlock>;
            }
            return (
              <code
                className="bg-[var(--color-surface)] px-1.5 py-0.5 rounded text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre({ children }) {
            return <>{children}</>;
          },
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}

interface VersionCardProps {
  note: ReleaseNote;
  defaultOpen: boolean;
}

function VersionCard({ note, defaultOpen }: VersionCardProps) {
  const date = formatDate(note.released_at);
  return (
    <Card className="p-0 overflow-hidden">
      <details open={defaultOpen} className="group">
        <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none list-none hover:bg-[var(--color-surface-hover)] transition-colors">
          <span className="flex items-baseline gap-2">
            <span className="text-base font-bold text-primary-500">
              {note.version}
            </span>
            {date && (
              <span className="text-sm text-[var(--color-text-muted)]">— {date}</span>
            )}
          </span>
          <svg
            className="w-4 h-4 shrink-0 text-[var(--color-text-muted)] transition-transform group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </summary>
        <div className="px-4 pb-4 pt-1 border-t border-[var(--color-border-default)]">
          <MarkdownBody>{note.markdown}</MarkdownBody>
        </div>
      </details>
    </Card>
  );
}

/**
 * Full "Aktualizácie" page content: title + subtitle, error banner, loading /
 * empty states, and the expandable per-version card list (newest default-open).
 */
export function ReleaseNotes({
  notes,
  loading = false,
  error = null,
  onDismissError,
  appName,
}: ReleaseNotesProps) {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-5">
        <h1 className="flex items-center gap-2 text-lg font-semibold text-[var(--color-text-primary)]">
          <span aria-hidden="true" className="text-primary-500 leading-none">
            ✨
          </span>
          Aktualizácie
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Čo je nové v jednotlivých verziách{appName ? ` ${appName}` : ""}.
        </p>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-[var(--color-state-error-bg)] text-[var(--color-state-error-fg)] text-sm flex items-center justify-between">
          <span className="truncate">{error}</span>
          <button
            onClick={onDismissError}
            className="ml-2 hover:opacity-80"
            aria-label="Zavrieť"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-10 justify-center text-[var(--color-text-secondary)] text-sm">
          <svg
            className="w-4 h-4 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>{" "}
          Načítavam…
        </div>
      ) : notes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-border-default)] p-10 text-center text-sm text-[var(--color-text-muted)]">
          Zatiaľ žiadne aktualizácie.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notes.map((note, i) => (
            <VersionCard key={note.version} note={note} defaultOpen={i === 0} />
          ))}
        </div>
      )}
    </div>
  );
}
