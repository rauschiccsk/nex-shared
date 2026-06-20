import { useCallback, useState } from "react";

export interface CodeBlockProps {
  children: string;
  language?: string;
}

/** Visual feedback duration after a successful copy. */
const COPY_FEEDBACK_DURATION_MS = 2000;

/**
 * Clipboard copy with visual feedback, inlined here so nex-shared keeps ZERO
 * runtime deps. Ported from the NEX Studio vzor (`hooks/useCopyToClipboard.ts`).
 */
function useCopyToClipboard(
  resetDelay = COPY_FEEDBACK_DURATION_MS,
): [(text: string) => Promise<void>, boolean] {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), resetDelay);
      } catch {
        // Fallback for older browsers / Electron
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
    [resetDelay],
  );

  return [copy, isCopied];
}

/**
 * Code block with copy-to-clipboard button. Ported into nex-shared (E1
 * unification) from the NEX Studio vzor `components/markdown/CodeBlock.tsx`.
 * Icons are inline SVG (no lucide) per the nex-shared zero-dep / emoji+SVG rule.
 */
export function CodeBlock({ children, language }: CodeBlockProps) {
  const [copy, isCopied] = useCopyToClipboard();
  const code = String(children).replace(/\n$/, "");

  return (
    <div className="relative my-3">
      <div className="flex items-center justify-between bg-[var(--color-surface)] px-3 py-1.5 rounded-t border border-[var(--color-border-default)] border-b-0">
        <span className="text-xs text-[var(--color-text-secondary)]">
          {language || "code"}
        </span>
        <button
          onClick={() => copy(code)}
          className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          {isCopied ? (
            <>
              <svg
                className="w-3.5 h-3.5 text-[var(--color-status-success)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-[var(--color-status-success)]">
                Skopírované
              </span>
            </>
          ) : (
            <>
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
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Kopírovať</span>
            </>
          )}
        </button>
      </div>
      <pre className="bg-[var(--color-canvas)] p-3 rounded-b border border-[var(--color-border-default)] border-t-0 overflow-x-auto m-0">
        <code className={`text-sm ${language ? `language-${language}` : ""}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
