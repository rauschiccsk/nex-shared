// DEV-251 — the shared Settings and Aktualizácie read in plain words and sit where every other page sits.
// Found on the demo app of the app template (nex-app-kit): the users table showed the role as its code („admin“),
// Systém opened with „Runtime-mutable nastavenia … (interná cache TTL)“, and Aktualizácie stood in the middle of the
// screen while every other page starts at the left (DEV-244).
import assert from "node:assert/strict";
import { test } from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ReleaseNotes, SessionsPanel, SystemSettingsPanel, UsersPanel } from "../dist/index.js";

const user = (role) => ({
  id: role,
  username: `u-${role}`,
  email: `${role}@firma.sk`,
  role,
  is_active: true,
  first_name: "",
  last_name: "",
  created_at: "2026-10-28T10:00:00Z",
  updated_at: "2026-10-28T10:00:00Z",
});

function usersTable(users) {
  return renderToStaticMarkup(
    createElement(UsersPanel, {
      users,
      roleOptions: [{ value: "admin", label: "Správca" }],
      canManage: false,
      fieldSchema: { username: true, names: true, telegram: false, passwordMinLength: 8 },
      onCreate: async () => {},
      onUpdate: async () => {},
      onDelete: async () => {},
      onChangePassword: async () => {},
      onToggleActive: async () => {},
    }),
  );
}

/** The role cell — the one right after the e-mail. */
function roleCell(html, email) {
  const m = html.match(new RegExp(`>${email}</td><td class="px-4 py-3"><span class="([^"]*)">([^<]*)</span></td>`));
  assert.ok(m, `no role cell after ${email}`);
  return { classes: m[1], text: m[2] };
}

test("the users table names the role, not its code", () => {
  const cell = roleCell(usersTable([user("admin")]), "admin@firma.sk");

  assert.equal(cell.text, "Správca");
  assert.doesNotMatch(cell.classes, /font-mono/);
});

test("a role the app did not name stays as it is", () => {
  assert.equal(roleCell(usersTable([user("auditor")]), "auditor@firma.sk").text, "auditor");
});

function systemIntro(canEdit) {
  const html = renderToStaticMarkup(
    createElement(SystemSettingsPanel, { settings: [], categories: [], canEdit, onSave: async () => ({}) }),
  );
  return html.match(/Systémové nastavenia<\/h2><p[^>]*>([^<]*)<\/p>/)[1];
}

test("Systém opens with a sentence for a person", () => {
  assert.equal(systemIntro(true), "Nastavenia, ktoré sa menia za behu aplikácie. Zmena platí najneskôr do 30 sekúnd.");
  assert.equal(systemIntro(false), "Nastavenia, ktoré sa menia za behu aplikácie. Len na čítanie — meniť ich môže správca.");
});

test("Aktualizácie start at the left like every other page", () => {
  const html = renderToStaticMarkup(createElement(ReleaseNotes, { notes: [] }));
  const outer = html.match(/^<div class="([^"]*)"/)[1].split(" ");

  assert.ok(!outer.includes("mx-auto"), outer.join(" "));
  assert.ok(outer.includes("p-6"), outer.join(" "));
});

// DEV-252 — two more sentences the template's demo showed: Relácie opened with „Kotvy životného cyklu JWT…“ (wrong for
// an app with sessions in its database, and jargon anywhere), a changed setting said „Uložený override“.
function sessionsIntro(extra) {
  const html = renderToStaticMarkup(
    createElement(SessionsPanel, { sessions: [], canRevoke: false, onRevoke: async () => {}, ...extra }),
  );
  return html.match(/Relácie používateľa<\/h2><p[^>]*>([^<]*)<\/p>/)[1];
}

test("Relácie open with a sentence for a person, and the app may say more", () => {
  assert.equal(sessionsIntro({}), "Kto je prihlásený a odkedy.");
  assert.equal(
    sessionsIntro({ description: "Kto je prihlásený a odkedy. Zrušená relácia prestane platiť hneď." }),
    "Kto je prihlásený a odkedy. Zrušená relácia prestane platiť hneď.",
  );
});

test("a changed setting says it was changed, by whom", () => {
  const html = renderToStaticMarkup(
    createElement(SystemSettingsPanel, {
      settings: [
        {
          key: "a_b",
          value: "2",
          value_type: "int",
          description: null,
          label: "A",
          updated_at: null,
          updated_by: "u1",
          updated_by_username: "jan",
          is_default: false,
        },
      ],
      categories: [],
      canEdit: false,
      onSave: async () => ({}),
    }),
  );

  assert.match(html, /Zmenené — <span[^>]*>jan<\/span>/);
  assert.doesNotMatch(html, /override/);
});
