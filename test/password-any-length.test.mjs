// DEV-296 — a password of any length. The Director's rule: „Dĺžku, zložitosť ani tvar hesla neobmedzujem a nenavrhujem —
// o hesle rozhoduje Director; nástroj odmietne nanajvýš prázdne heslo.“ An app that asks only for a non-empty password
// (passwordMinLength 1) must not show „min. 1 znakov“; an app that keeps its own minimum still shows it.
import assert from "node:assert/strict";
import { test } from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { MyAccountPanel, UserForm } from "../dist/index.js";

const USER = { username: "jan", role: "user", email: "jan@firma.sk", first_name: "Ján", last_name: "Novák" };

function account(passwordMinLength) {
  return renderToStaticMarkup(
    createElement(MyAccountPanel, {
      user: USER,
      roleLabel: "Používateľ",
      onSaveProfile: async () => {},
      onChangePassword: async () => {},
      telegram: false,
      passwordMinLength,
    }),
  );
}

function userForm(passwordMinLength) {
  return renderToStaticMarkup(
    createElement(UserForm, {
      mode: "create",
      roleOptions: [{ value: "user", label: "Používateľ" }],
      fieldSchema: { username: true, names: true, telegram: false, passwordMinLength },
      onSubmit: async () => {},
      onCancel: () => {},
    }),
  );
}

test("Moje konto: only non-empty — no minimum is named", () => {
  assert.doesNotMatch(account(1), /min\. \d+ znakov|aspoň \d+ znakov/);
});

test("Moje konto: an app's own minimum is still named", () => {
  assert.match(account(8), /min\. 8 znakov/);
});

test("user form: only non-empty — no minimum is named", () => {
  assert.doesNotMatch(userForm(1), /min\. \d+ znakov|aspoň \d+ znakov/);
});

test("user form: an app's own minimum is still named", () => {
  assert.match(userForm(8), /min\. 8 znakov/);
});
