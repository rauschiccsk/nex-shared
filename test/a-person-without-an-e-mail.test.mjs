// DEV-422 — the admin changes a person who has no e-mail without having to give one. Until v0.39.0 „Uložiť“ stayed grey
// for such a person (e-mail empty) and the template's server refused the change too; NEX Manager 1.7.0's Verifikácia noted
// that the admin could not change such a person's language. A person who has an e-mail keeps it required, a new person
// needs one as ever.
import assert from "node:assert/strict";
import { test } from "node:test";

import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { I18nProvider, UserForm } from "../dist/index.js";

const ROLES = [{ value: "user", label: "Používateľ" }];
const SCHEMA = { username: true, names: true, passwordMinLength: 8 };
const noop = async () => {};

function form(mode, initial) {
  return renderToStaticMarkup(
    h(
      I18nProvider,
      { language: "sk" },
      h(UserForm, { mode, initial, roleOptions: ROLES, fieldSchema: SCHEMA, submitting: false, error: null, onSubmit: noop, onCancel: noop }),
    ),
  );
}

const person = (email) => ({ id: "u1", username: "jana", email, role: "user", is_active: true, created_at: "x", updated_at: "x" });
/** Whether the form's own button (Uložiť / Vytvoriť) is greyed out — by its text and its ``disabled`` attribute. */
function saveDisabled(html) {
  const button = [...html.matchAll(/<button([^>]*)>([^<]*)<\/button>/g)].find((m) => ["Uložiť", "Vytvoriť"].includes(m[2]));
  assert.ok(button, "the form has its button");
  return / disabled=""/.test(button[1]);
}
const emailLabel = (html) => html.match(/<label for="uf-email"[^>]*>([^<]*)<\/label>/)?.[1].trim();

test("a person without an e-mail is saved without one, and the field does not say it is required", () => {
  const html = form("edit", person(null));

  assert.equal(saveDisabled(html), false);
  assert.equal(emailLabel(html), "Email");
});

test("a person who has an e-mail keeps it required", () => {
  const html = form("edit", person("jana@firma.sk"));

  assert.equal(emailLabel(html), "Email *");
});

test("a new person needs an e-mail as ever", () => {
  const html = form("create", undefined);

  assert.equal(saveDisabled(html), true);
  assert.equal(emailLabel(html), "Email *");
});
