// DEV-393 — every text of the library in the person's language.
//
// 15.11.2026 the Director wanted Orthodox Hermenia in Hungarian; the frame of every ICC app was Slovak by hard. On the
// direction — each person chooses their language, the texts live in catalogs per language: „Súhlasím“.
import assert from "node:assert/strict";
import { test } from "node:test";

import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  AgentsPanel,
  createTranslator,
  I18nProvider,
  LANGUAGES,
  LoginForm,
  MyAccountPanel,
  ReleaseNotes,
  SessionsPanel,
  SystemSettingsPanel,
  UserForm,
  UsersPanel,
} from "../dist/index.js";

const SLOVAK_ONLY = /[äčďĺľňôŕšťž]/i;
const noop = async () => {};
const USER = { id: "1", username: "jan", role: "user", email: "jan@firma.sk", first_name: "Ian", last_name: "Novak", is_active: true };
const ROLES = [{ value: "user", label: "User" }];
const SCHEMA = { names: true, username: true, telegram: true, passwordMinLength: 5 };

/** Every screen of the library with data that carries no Slovak letter of its own. */
const SCREENS = {
  MyAccountPanel: () =>
    h(MyAccountPanel, { user: USER, roleLabel: "User", onSaveProfile: noop, onChangePassword: noop, onTestTelegram: async () => ({ ok: true, detail: "" }) }),
  UsersPanel: () =>
    h(UsersPanel, {
      users: [USER],
      roleOptions: ROLES,
      fieldSchema: SCHEMA,
      canManage: true,
      onCreate: noop,
      onUpdate: noop,
      onDelete: noop,
      onChangePassword: noop,
      onToggleActive: noop,
    }),
  UserForm: () => h(UserForm, { mode: "create", roleOptions: ROLES, fieldSchema: SCHEMA, submitting: false, error: "", onSubmit: noop, onCancel: () => {} }),
  SessionsPanel: () =>
    h(SessionsPanel, {
      sessions: [{ id: "s1", user_id: "1", last_seen_at: "2026-11-15T10:00:00Z", created_at: "2026-11-15T09:00:00Z" }],
      canRevoke: true,
      onRevoke: noop,
    }),
  SystemSettingsPanel: () =>
    h(SystemSettingsPanel, {
      settings: [{ key: "x", value: "1", value_type: "int", description: "", is_default: true }],
      categories: [],
      canEdit: true,
      onSave: noop,
    }),
  AgentsPanel: () =>
    h(AgentsPanel, { roles: [{ id: "ai", label: "AI" }], models: [{ id: "opus", label: "Opus" }], efforts: ["low", "max"], drafts: {}, onSave: noop }),
  ReleaseNotes: () => h(ReleaseNotes, { notes: [], loading: false, error: null }),
  LoginForm: () => h(LoginForm, { onSubmit: noop }),
};

const inLanguage = (language, screen) => renderToStaticMarkup(h(I18nProvider, { language }, screen()));
const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ");

// DEV-397: every language but Slovak — the library's own list, so a language added there is guarded here too.
const OTHER_LANGUAGES = LANGUAGES.map((l) => l.code).filter((code) => code !== "sk");

test("the library speaks Slovak, Hungarian and English", () => {
  assert.deepEqual(LANGUAGES.map((l) => [l.code, l.name, l.locale]), [
    ["sk", "Slovenčina", "sk-SK"],
    ["hu", "Magyar", "hu-HU"],
    ["en", "English", "en-GB"],
  ]);
});

for (const language of OTHER_LANGUAGES) {
  for (const [name, screen] of Object.entries(SCREENS)) {
    test(`${name} speaks ${language} to a person who chose it — no Slovak word left`, () => {
      const said = text(inLanguage(language, screen)) + " " + [...inLanguage(language, screen).matchAll(/(?:placeholder|title|aria-label)="([^"]*)"/g)].map((m) => m[1]).join(" ");
      assert.doesNotMatch(said, SLOVAK_ONLY, `${name}: ${said.match(new RegExp(".{0,30}" + SLOVAK_ONLY.source + ".{0,30}", "i"))?.[0]}`);
      assert.notEqual(text(inLanguage(language, screen)), text(inLanguage("sk", screen)), `${name} said the same in both`);
      assert.ok(text(inLanguage(language, screen)).trim().length > 10, `${name} drew nothing`);
    });
  }
}

test("without a provider, and in Slovak, every screen says what it always said", () => {
  for (const screen of Object.values(SCREENS)) {
    assert.equal(inLanguage("sk", screen), renderToStaticMarkup(screen()));
  }
  assert.match(renderToStaticMarkup(SCREENS.UsersPanel()), /Správa používateľov/);
});

test("the Hungarian screens say it in Hungarian", () => {
  assert.match(inLanguage("hu", SCREENS.UsersPanel), /Felhasználók kezelése/);
  assert.match(inLanguage("hu", SCREENS.MyAccountPanel), /Saját adataim/);
  assert.match(inLanguage("hu", SCREENS.LoginForm), /Bejelentkezés/);
  assert.match(inLanguage("hu", SCREENS.ReleaseNotes), /Frissítések/);
});

test("the English screens say it in English", () => {
  assert.match(inLanguage("en", SCREENS.UsersPanel), /User management/);
  assert.match(inLanguage("en", SCREENS.MyAccountPanel), /My details/);
  assert.match(inLanguage("en", SCREENS.LoginForm), /Sign in/);
  assert.match(inLanguage("en", SCREENS.ReleaseNotes), /Updates/);
});

test("every catalog carries the keys of the Slovak one, none of them empty", async () => {
  const sk = createTranslator("sk");
  const { readFileSync } = await import("node:fs");
  const keys = [...readFileSync(new URL("../src/locales/sk.ts", import.meta.url), "utf8").matchAll(/^\s+"([a-zA-Z.]+)":/gm)].map((m) => m[1]);
  assert.ok(keys.length > 100, `only ${keys.length} keys read`);
  for (const language of OTHER_LANGUAGES) {
    const t = createTranslator(language);
    for (const key of keys) {
      assert.notEqual(t(key, { count: 2 }), key, `${language} misses ${key}`);
      assert.ok(t(key, { count: 2 }).trim() && sk(key, { count: 2 }).trim(), key);
    }
  }
});

test("a count takes the plural form of the language", () => {
  const sk = createTranslator("sk");
  assert.deepEqual([1, 2, 5].map((count) => sk("users.count", { count })), ["1 používateľ", "2 používatelia", "5 používateľov"]);
  assert.equal(createTranslator("hu")("users.count", { count: 5 }), "5 felhasználó");
  assert.deepEqual([1, 5].map((count) => createTranslator("en")("users.count", { count })), ["1 user", "5 users"]);
  assert.equal(sk("password.tooShort", { count: 5 }), "Heslo musí mať aspoň 5 znakov.");
});

test("dates are written as the person's language writes them", () => {
  const huHtml = inLanguage("hu", SCREENS.SessionsPanel);
  const skHtml = inLanguage("sk", SCREENS.SessionsPanel);
  const sample = new Date("2026-11-15T10:00:00Z");
  assert.ok(huHtml.includes(sample.toLocaleString("hu-HU")), "hu-HU date");
  assert.ok(skHtml.includes(sample.toLocaleString("sk-SK")), "sk-SK date");
  assert.notEqual(sample.toLocaleString("hu-HU"), sample.toLocaleString("sk-SK"));
  assert.ok(inLanguage("en", SCREENS.SessionsPanel).includes(sample.toLocaleString("en-GB")), "en-GB date");
});

test("an app's own texts join the catalogs; an unknown key or language does not break a screen", () => {
  const t = createTranslator("hu", { hu: { "app.title": "Fordítás" }, sk: { "app.title": "Preklad", "app.only": "Len po slovensky" } });
  assert.equal(t("app.title"), "Fordítás");
  assert.equal(t("app.only"), "Len po slovensky"); // a text the app did not translate falls back to Slovak
  assert.equal(t("app.missing"), "app.missing");
  assert.equal(inLanguage("xx", SCREENS.LoginForm), inLanguage("sk", SCREENS.LoginForm));
});

test("Moje konto lets a person choose a language only among the ones the app offers", () => {
  const offer = (languages, onLanguageChange) =>
    inLanguage("hu", () => h(MyAccountPanel, { user: USER, roleLabel: "User", onSaveProfile: noop, onChangePassword: noop, languages, language: "hu", onLanguageChange }));
  const html = offer(["sk", "hu"], noop);
  assert.match(html, /<select aria-label="Nyelv"/);
  assert.deepEqual([...html.matchAll(/<option value="(\w+)" lang="\w+"[^>]*>([^<]+)</g)].map((m) => [m[1], m[2]]), [["sk", "Slovenčina"], ["hu", "Magyar"]]);
  assert.match(html, /<option value="hu" lang="hu" selected="">/);
  assert.doesNotMatch(offer(["hu"], noop), /aria-label="Nyelv"/); // one language — nothing to choose
  assert.doesNotMatch(offer(["sk", "hu"], undefined), /aria-label="Nyelv"/); // the app keeps no choice
  // DEV-397: the library knows more languages than this app offers — the panel offers only the app's two.
  assert.equal(LANGUAGES.length, 3);
});

test("every request tells the server the person's language, so its sentences come in it", async () => {
  const { createApiClient } = await import("../dist/index.js");
  const realFetch = globalThis.fetch;
  const asked = [];
  globalThis.fetch = async (_url, init) => {
    asked.push(init.headers["Accept-Language"]);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } });
  };
  try {
    const client = createApiClient({ baseUrl: "http://app.test", getToken: () => null });
    renderToStaticMarkup(h(I18nProvider, { language: "hu" }, null));
    await client.get("/auth/me");
    renderToStaticMarkup(h(I18nProvider, { language: "sk" }, null));
    await client.post("/auth/login", { username: "jan", password: "x" });
  } finally {
    globalThis.fetch = realFetch;
  }
  assert.deepEqual(asked, ["hu", "sk"]);
});
