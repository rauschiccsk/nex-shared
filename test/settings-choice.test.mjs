// DEV-257 — a system setting chosen from the app's own offer. NEX Knowledge picks the group of its statutory persons
// from the groups of NEX Manager; Systém knew only text, numbers and yes/no, so the app would have had to keep a
// screen of its own beside the template's Nastavenia.
import assert from "node:assert/strict";
import { test } from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { SystemSettingsPanel } from "../dist/index.js";

const setting = (over) => ({
  key: "statutory_group_id",
  value: "g-2",
  value_type: "string",
  label: "Skupina konateľov",
  description: "Kto schvaľuje uchovávanie.",
  unit: null,
  updated_at: null,
  updated_by: null,
  updated_by_username: null,
  is_default: true,
  ...over,
});

function panel(s, canEdit = true) {
  return renderToStaticMarkup(
    createElement(SystemSettingsPanel, {
      settings: [s],
      categories: [{ id: "base", label: "Báza", description: "", prefixes: ["statutory_"] }],
      canEdit,
      onSave: async () => s,
    }),
  );
}

const choices = [
  { value: "g-1", label: "Vedenie" },
  { value: "g-2", label: "Konatelia" },
];

test("a setting with an offer is a choice among it, the stored value selected", () => {
  const html = panel(setting({ choices }));

  assert.match(html, /<select[^>]*>/);
  assert.match(html, /<option value="g-1">Vedenie<\/option>/);
  assert.match(html, /<option value="g-2" selected="">Konatelia<\/option>/);
  assert.doesNotMatch(html, /nie je v ponuke/);
});

test("a stored value the offer no longer holds is shown as itself, not swapped for the first choice", () => {
  const html = panel(setting({ value: "g-9", choices }));

  assert.match(html, /<option value="g-9" selected="">g-9 \(nie je v ponuke\)<\/option>/);
});

test("an offer that could not be read says so and the setting cannot be changed", () => {
  const html = panel(setting({ choices: [] }));

  assert.match(html, /Ponuka sa teraz nedá načítať — nastavenie sa zatiaľ nedá zmeniť\./);
  assert.match(html, /<select[^>]*disabled=""/);
});

test("a setting without an offer keeps the editor of its type", () => {
  const html = panel(setting({ value: "20", value_type: "int" }));

  assert.doesNotMatch(html, /<select/);
  assert.match(html, /<input type="number"[^>]*value="20"/);
});
