/** A message — one text, or its plural forms by the language's plural category (Intl.PluralRules; DEV-393). */
export type Message = string | { one?: string; few?: string; many?: string; other: string };
