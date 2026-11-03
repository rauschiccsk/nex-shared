// DEV-293 — the app's own action for one person in the Users list (NEX Manager: „Prístupy“ — groups, apps and the
// history of one person). Without it NEX Manager 1.5.0 on the app template put people on a second screen of its own.
import assert from "node:assert/strict";
import { test } from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { UsersPanel } from "../dist/index.js";

const PEOPLE = [
  { id: "u1", username: "admin", email: "a@firma.sk", role: "admin", is_active: true, created_at: "x", updated_at: "x" },
  { id: "u2", username: "eva", email: "e@firma.sk", role: "user", is_active: false, created_at: "x", updated_at: "x" },
];

function actionCells({ canManage, rowActions }) {
  const html = renderToStaticMarkup(
    createElement(UsersPanel, {
      users: PEOPLE,
      roleOptions: [
        { value: "admin", label: "Správca" },
        { value: "user", label: "Používateľ" },
      ],
      canManage,
      fieldSchema: { fields: [], passwordMinLength: 8 },
      onCreate: async () => {},
      onUpdate: async () => {},
      onDelete: async () => {},
      onChangePassword: async () => {},
      onToggleActive: async () => {},
      rowActions,
    }),
  );
  // The last cell of every body row is Akcie; its text in order, tags dropped.
  return [...html.matchAll(/<tr[^>]*>(?:(?!<\/tr>).)*?<td class="px-4 py-3 text-right">((?:(?!<\/td>).)*)<\/td><\/tr>/g)].map((m) =>
    m[1].replace(/<title>[^<]*<\/title>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
  );
}

const access = (user) => createElement("button", { type: "button" }, `Prístupy ${user.username}`);

test("the app's action stands first in every person's row", () => {
  assert.deepEqual(actionCells({ canManage: true, rowActions: access }), ["Prístupy admin Deaktivovať", "Prístupy eva Aktivovať"]);
});

test("a viewer who may not manage people sees the app's action, not a dash", () => {
  assert.deepEqual(actionCells({ canManage: false, rowActions: access }), ["Prístupy admin", "Prístupy eva"]);
});

test("an app that gives nothing for a person leaves the row as it was", () => {
  assert.deepEqual(actionCells({ canManage: false, rowActions: () => null }), ["—", "—"]);
});

test("without the app's actions the panel is as before", () => {
  assert.deepEqual(actionCells({ canManage: true }), ["Deaktivovať", "Aktivovať"]);
  assert.deepEqual(actionCells({ canManage: false }), ["—", "—"]);
});
