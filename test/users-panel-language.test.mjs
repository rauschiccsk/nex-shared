// DEV-415 — the admin sees and changes each person's language in Používatelia. Until v0.39.0 the list knew the language
// (the template's server returns it) but showed it nowhere and the form could not change it; NEX Manager 1.7.0 planned
// a button, two server routes and a store of its own for it.
import assert from "node:assert/strict";
import { test } from "node:test";

import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { I18nProvider, languageToReport, personLanguage, UserForm, UsersPanel } from "../dist/index.js";

const PEOPLE = [
  { id: "u1", username: "anna", email: "a@firma.sk", role: "admin", is_active: true, language: "en", created_at: "x", updated_at: "x" },
  { id: "u2", username: "bela", email: "b@firma.sk", role: "user", is_active: true, language: null, created_at: "x", updated_at: "x" },
  { id: "u3", username: "cyril", email: "c@firma.sk", role: "user", is_active: true, language: "de", created_at: "x", updated_at: "x" },
];
const ROLES = [
  { value: "admin", label: "Správca" },
  { value: "user", label: "Používateľ" },
];
const noop = async () => {};

function panel({ languages, defaultLanguage, language = "sk" }) {
  return renderToStaticMarkup(
    h(
      I18nProvider,
      { language },
      h(UsersPanel, {
        users: PEOPLE,
        roleOptions: ROLES,
        canManage: true,
        fieldSchema: { username: true, names: false, passwordMinLength: 8 },
        onCreate: noop,
        onUpdate: noop,
        onDelete: noop,
        onChangePassword: noop,
        onToggleActive: noop,
        languages,
        defaultLanguage,
      }),
    ),
  );
}

const headers = (html) => [...html.matchAll(/<th[^>]*>([^<]*)<\/th>/g)].map((m) => m[1]);
const languageCells = (html) => [...html.matchAll(/<td class="px-4 py-3 text-xs text-\[var\(--color-text-secondary\)\]" lang="(\w+)">([^<]*)<\/td>/g)].map((m) => `${m[1]}:${m[2]}`);

test("with more than one language every person's language stands in the list, by its own name", () => {
  const html = panel({ languages: ["sk", "hu", "en"], defaultLanguage: "hu" });

  assert.deepEqual(headers(html), ["Používateľské meno", "Email", "Rola", "Jazyk", "Stav", "Akcie"]);
  // own choice; none → the installation's; one the app does not speak → the installation's too
  assert.deepEqual(languageCells(html), ["en:English", "hu:Magyar", "hu:Magyar"]);
});

test("without the installation's language a person who chose none has the app's first", () => {
  // „en“ and „de“ are not the app's languages either
  assert.deepEqual(languageCells(panel({ languages: ["hu", "sk"] })), ["hu:Magyar", "hu:Magyar", "hu:Magyar"]);
});

test("the column is said in the admin's language", () => {
  assert.ok(headers(panel({ languages: ["sk", "hu", "en"], language: "hu" })).includes("Nyelv"));
  assert.ok(headers(panel({ languages: ["sk", "hu", "en"], language: "en" })).includes("Language"));
});

test("an app with one language shows no language column", () => {
  for (const languages of [undefined, ["sk"], ["hu"]]) {
    const html = panel({ languages });
    assert.equal(headers(html).includes("Jazyk"), false);
    assert.deepEqual(languageCells(html), []);
  }
});

function form({ initial, languages, defaultLanguage, mode = "edit" }) {
  return renderToStaticMarkup(
    h(
      I18nProvider,
      { language: "sk" },
      h(UserForm, {
        mode,
        initial,
        roleOptions: ROLES,
        fieldSchema: { username: true, names: false, passwordMinLength: 8 },
        submitting: false,
        error: "",
        onSubmit: noop,
        languages,
        defaultLanguage,
      }),
    ),
  );
}

const languageSelect = (html) => {
  const m = html.match(/<select[^>]*id="uf-language"[^>]*>(.*?)<\/select>/);
  if (!m) return null;
  return [...m[1].matchAll(/<option value="(\w+)" lang="\w+"( selected="")?>([^<]*)<\/option>/g)].map(
    (o) => `${o[1]}:${o[3]}${o[2] ? "*" : ""}`,
  );
};

test("the form offers the app's languages by their own names, the person's own chosen", () => {
  assert.match(form({ initial: PEOPLE[0], languages: ["sk", "hu", "en"] }), /<label for="uf-language"[^>]*>Jazyk<\/label>/);
  assert.deepEqual(languageSelect(form({ initial: PEOPLE[0], languages: ["sk", "hu", "en"] })), ["sk:Slovenčina", "hu:Magyar", "en:English*"]);
  assert.deepEqual(languageSelect(form({ initial: PEOPLE[1], languages: ["sk", "hu", "en"], defaultLanguage: "hu" })), ["sk:Slovenčina", "hu:Magyar*", "en:English"]);
  assert.deepEqual(languageSelect(form({ mode: "create", languages: ["sk", "en"], defaultLanguage: "en" })), ["sk:Slovenčina", "en:English*"]);
});

test("an app with one language offers no language in the form", () => {
  assert.equal(languageSelect(form({ initial: PEOPLE[0], languages: ["sk"] })), null);
  assert.equal(languageSelect(form({ initial: PEOPLE[0] })), null);
});

test("the person's language: own choice, else the installation's, else the app's first", () => {
  assert.equal(personLanguage({ language: "en" }, ["sk", "hu", "en"], "hu"), "en");
  assert.equal(personLanguage({ language: null }, ["sk", "hu", "en"], "hu"), "hu");
  assert.equal(personLanguage({ language: "de" }, ["sk", "hu", "en"], "hu"), "hu");
  assert.equal(personLanguage({ language: "" }, ["hu", "sk"]), "hu");
  assert.equal(personLanguage(undefined, ["sk", "hu"], "en"), "sk", "an installation language the app does not speak");
  assert.equal(personLanguage(undefined, []), "sk");
});

test("the form reports a language only when the admin changed it — a person who chose none keeps following the installation", () => {
  assert.equal(languageToReport("hu", "hu"), undefined);
  assert.equal(languageToReport("hu", "en"), "en");
});
