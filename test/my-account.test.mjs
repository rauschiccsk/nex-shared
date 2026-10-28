// DEV-251 — „Moje konto“ without the Telegram field, for an app that sends nothing to Telegram.
// The template of ICC apps (nex-app-kit) puts this panel into every app's Settings; a field that is saved nowhere
// would tell the user notifications reach them when none ever will.
import assert from "node:assert/strict";
import { test } from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { MyAccountPanel } from "../dist/index.js";

const USER = { username: "jan", role: "user", email: "jan@firma.sk", first_name: "Ján", last_name: "Novák" };

function render(extra) {
  return renderToStaticMarkup(
    createElement(MyAccountPanel, {
      user: USER,
      roleLabel: "Používateľ",
      onSaveProfile: async () => {},
      onChangePassword: async () => {},
      ...extra,
    }),
  );
}

test("the Telegram field is there by default, as the cockpit has it", () => {
  assert.match(render({}), /Telegram chat_id/);
});

test("telegram={false} leaves the field out, test button included", () => {
  const html = render({ telegram: false, onTestTelegram: async () => ({ ok: true, detail: "" }) });

  assert.doesNotMatch(html, /Telegram/);
  assert.match(html, /Priezvisko/);
  assert.match(html, /Email \*/);
});
