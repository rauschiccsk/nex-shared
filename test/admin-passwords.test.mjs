// DEV-439 — passwords and the admin in the app template. 20.11.2026 in Orthodox Hermenia the admin renamed themselves in
// Používatelia: the browser had filled their saved password into the empty password field and the save was refused as
// a change of their own password. The Director: the admin sets anyone's password, their own too; their own account has
// an eye at the password, another's has none; Moje konto asks no current password and has the eye for everyone; the
// admin is never offered for deletion. An eye shows only what is typed — where nothing can be shown, there is none.
import assert from "node:assert/strict";
import { test } from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { MyAccountPanel, PasswordInput, UserForm, UsersPanel } from "../dist/index.js";

const PEOPLE = [
  { id: "u1", username: "admin", email: "a@firma.sk", role: "admin", is_active: true, created_at: "x", updated_at: "x" },
  { id: "u2", username: "eva", email: "e@firma.sk", role: "user", is_active: true, created_at: "x", updated_at: "x" },
  { id: "u3", username: "jan", email: "j@firma.sk", role: "admin", is_active: true, created_at: "x", updated_at: "x" },
];
const ROLES = [
  { value: "admin", label: "Správca" },
  { value: "user", label: "Používateľ" },
];
const SCHEMA = { fields: [], passwordMinLength: 1 };

/** Per row: [username, offers delete, offers (de)activation]. */
function rows(extra) {
  const html = renderToStaticMarkup(
    createElement(UsersPanel, {
      users: PEOPLE,
      roleOptions: ROLES,
      canManage: true,
      fieldSchema: SCHEMA,
      onCreate: async () => {},
      onUpdate: async () => {},
      onDelete: async () => {},
      onChangePassword: async () => {},
      onToggleActive: async () => {},
      ...extra,
    }),
  );
  const cells = [...html.matchAll(/<td class="px-4 py-3 text-right">((?:(?!<\/td>).)*)<\/td><\/tr>/g)].map((m) => m[1]);
  return cells.map((cell, i) => [PEOPLE[i].username, cell.includes('title="Vymazať"'), /Deaktivovať|Aktivovať/.test(cell)]);
}

test("one's own row offers neither delete nor deactivation", () => {
  assert.deepEqual(rows({ currentUserId: "u1" }), [
    ["admin", false, false],
    ["eva", true, true],
    ["jan", true, true],
  ]);
});

test("whom the app keeps is never offered for deletion, yet stays editable and can be switched off", () => {
  const html = (u) => u.role !== "admin";
  assert.deepEqual(rows({ currentUserId: "u2", mayDelete: html }), [
    ["admin", false, true],
    ["eva", false, false],
    ["jan", false, true],
  ]);
});

test("an app that says nothing keeps the panel as it was", () => {
  assert.deepEqual(rows({}), [
    ["admin", true, true],
    ["eva", true, true],
    ["jan", true, true],
  ]);
});

function editForm(revealPassword) {
  return renderToStaticMarkup(
    createElement(UserForm, {
      mode: "edit",
      initial: PEOPLE[0],
      roleOptions: ROLES,
      fieldSchema: SCHEMA,
      submitting: false,
      error: "",
      onSubmit: () => {},
      revealPassword,
    }),
  );
}

const passwordField = (html, id) => html.match(new RegExp(`<input[^>]*id="${id}"[^>]*>`))?.[0] ?? "";

test("the browser never fills the password field of a person by itself", () => {
  assert.match(passwordField(editForm(false), "uf-password"), /autocomplete="new-password"/i);
  assert.match(passwordField(editForm(false), "uf-password"), /type="password"/);
});

test("the admin's own account has the eye at the password, another's has none", () => {
  assert.match(editForm(true), /aria-label="Zobraziť: Nové heslo"/);
  assert.doesNotMatch(editForm(false), /aria-label="Zobraziť/);
});

function account(extra) {
  return renderToStaticMarkup(
    createElement(MyAccountPanel, {
      user: { username: "jan", role: "user", email: "jan@firma.sk" },
      roleLabel: "Používateľ",
      onSaveProfile: async () => {},
      onChangePassword: async () => {},
      ...extra,
    }),
  );
}

test("Moje konto without the current password: no such field, the new one and its repetition with an eye", () => {
  const html = account({ askCurrentPassword: false });
  assert.equal(passwordField(html, "ma-cur"), "");
  assert.doesNotMatch(html, /Súčasné heslo/);
  assert.match(html, /aria-label="Zobraziť: Nové heslo"/);
  assert.match(html, /aria-label="Zobraziť: Zopakuj nové heslo"/);
  assert.match(passwordField(html, "ma-new"), /autocomplete="new-password"/i);
});

test("an app that asks for the current password keeps the field, the browser may offer the saved one there", () => {
  const html = account({});
  assert.match(passwordField(html, "ma-cur"), /autocomplete="current-password"/i);
  assert.match(html, /aria-label="Zobraziť: Nové heslo"/);
});

test("a password field without the eye is a plain field — nothing to show, nothing offered", () => {
  const html = renderToStaticMarkup(createElement(PasswordInput, { id: "p", value: "", onChange: () => {} }));
  assert.equal(html.match(/<button/g), null);
  assert.match(html, /type="password"/);
});
