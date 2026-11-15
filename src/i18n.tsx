// DEV-393 — the language of a person, in every text of the library.
//
// 15.11.2026 the Director wanted Orthodox Hermenia in Hungarian, and the Staviteľ found the frame of every ICC app
// Slovak by hard: the texts of this library sat in its components. Director: „v NEX Genesis máme urobené tak, že
// každý užívateľ môže nastaviť pre seba jazyk aplikácie … tá istá aplikácia sa dá používať súčasne vo viacerých
// jazykoch“; on the direction: „Súhlasím“.
//
// Every text has a key and, per language, its catalog entry (locales/sk.ts is the source of keys; every other catalog
// is typed against it, so a missing translation does not compile). The app tells the library the person's language
// with <I18nProvider>; without one the library speaks Slovak, as it always did. An app adds its own texts to the same
// catalogs (`messages`), so one mechanism serves the frame and the app's screens.

import { createContext, useContext, useMemo, type ReactNode } from "react";

import { en } from "./locales/en";
import { hu } from "./locales/hu";
import { sk, type MessageKey } from "./locales/sk";
import type { Message } from "./locales/types";

export type { MessageKey } from "./locales/sk";
export type { Message } from "./locales/types";

/** A language a catalog exists for. */
export type Language = "sk" | "hu" | "en";

/** Every language the library speaks: its code, its own name (as its speakers write it) and its locale. */
export const LANGUAGES: readonly { code: Language; name: string; locale: string }[] = [
  { code: "sk", name: "Slovenčina", locale: "sk-SK" },
  { code: "hu", name: "Magyar", locale: "hu-HU" },
  // DEV-397: English as Europe writes it — day before month, a 24-hour clock.
  { code: "en", name: "English", locale: "en-GB" },
];

/** The language of a person who has not chosen one, and of an app that says nothing. */
export const DEFAULT_LANGUAGE: Language = "sk";

const CATALOGS: Record<Language, Record<MessageKey, Message>> = { sk, hu, en };

/** An app's own texts, per language — merged over the library's (the app's key wins). */
export type AppMessages = Partial<Record<Language, Record<string, Message>>>;

/** Parameters a message fills in: ``{name}`` in the text; ``count`` also picks a plural form. */
export type MessageParams = Record<string, string | number>;

/** Translate a key — the library's ``MessageKey`` or an app's own key. */
export type Translate = (key: MessageKey | (string & {}), params?: MessageParams) => string;

interface I18nState {
  language: Language;
  locale: string;
  t: Translate;
}

/** Whether ``value`` names a language the library speaks. */
export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.some((l) => l.code === value);
}

/** The locale of a language (for Intl dates and numbers). */
export function localeOf(language: Language): string {
  return LANGUAGES.find((l) => l.code === language)?.locale ?? "sk-SK";
}

function fill(text: string, params?: MessageParams): string {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (whole, name: string) => (name in params ? String(params[name]) : whole));
}

/** A translator for one language — the app's messages over the library's, then Slovak, then the key itself. */
export function createTranslator(language: Language, messages: AppMessages = {}): Translate {
  const locale = localeOf(language);
  const plural = new Intl.PluralRules(locale);
  const lookup = (key: string): Message | undefined =>
    messages[language]?.[key] ??
    (CATALOGS[language] as Record<string, Message>)[key] ??
    messages[DEFAULT_LANGUAGE]?.[key] ??
    (CATALOGS[DEFAULT_LANGUAGE] as Record<string, Message>)[key];
  return (key, params) => {
    const found = lookup(key);
    if (found === undefined) return key;
    if (typeof found === "string") return fill(found, params);
    const count = Number(params?.count ?? 0);
    const category = plural.select(count) as keyof Exclude<Message, string>;
    return fill(found[category] ?? found.other, params);
  };
}

const DEFAULT_STATE: I18nState = {
  language: DEFAULT_LANGUAGE,
  locale: localeOf(DEFAULT_LANGUAGE),
  t: createTranslator(DEFAULT_LANGUAGE),
};

const I18nContext = createContext<I18nState>(DEFAULT_STATE);

/** The language a provider last rendered, and its translator — for code outside React (the API client), which has
 *  no context to read. One person uses one browser tab in one language at a time. */
let lastLanguage: Language = DEFAULT_LANGUAGE;
let lastTranslator: Translate = DEFAULT_STATE.t;

/** The translator of the language the app last told the library (Slovak before any provider rendered). */
export function currentTranslator(): Translate {
  return lastTranslator;
}

/** The language the app last told the library — what the API client tells the server (Accept-Language). */
export function currentLanguage(): Language {
  return lastLanguage;
}

export interface I18nProviderProps {
  /** The person's language; an unknown value falls back to Slovak. */
  language: Language | string | null | undefined;
  /** The app's own texts, per language. */
  messages?: AppMessages;
  children: ReactNode;
}

/** Tell every component under it the person's language (and the app's own texts). */
export function I18nProvider({ language, messages, children }: I18nProviderProps) {
  const code = isLanguage(language) ? language : DEFAULT_LANGUAGE;
  const state = useMemo<I18nState>(() => {
    const t = createTranslator(code, messages);
    lastLanguage = code;
    lastTranslator = t;
    return { language: code, locale: localeOf(code), t };
  }, [code, messages]);
  return <I18nContext.Provider value={state}>{children}</I18nContext.Provider>;
}

/** The translator of the current language. */
export function useT(): Translate {
  return useContext(I18nContext).t;
}

/** The current language and its locale. */
export function useLanguage(): { language: Language; locale: string } {
  const { language, locale } = useContext(I18nContext);
  return { language, locale };
}

/** A date with its time, as the language writes it. */
export function formatDateTime(value: Date | string | number, locale: string): string {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString(locale);
}
