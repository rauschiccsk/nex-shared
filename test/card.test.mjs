// DEV-240 — a card keeps its content off its border unless the call site says otherwise.
// 27.10.2026 NEX Knowledge 0.1.0 had 52 of 54 cards with the text glued to the edge: the card had no inner spacing
// and every call site had to remember to add it. Runs on the compiled component (`npm test` compiles src/Card.tsx to
// .test-build first) with Node's own runner, rendered to markup by react-dom/server.
import assert from "node:assert/strict";
import { test } from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Card } from "../.test-build/Card.js";

const SURFACE = [
  "rounded-xl",
  "border",
  "border-[var(--color-border-default)]",
  "bg-[var(--color-surface-elevated)]",
  "shadow-[var(--shadow-sm)]",
];

function classesOf(props) {
  const html = renderToStaticMarkup(createElement(Card, props, "Obsah"));
  const match = html.match(/^<div class="([^"]*)"[^>]*>Obsah<\/div>$/);
  assert.ok(match, `unexpected markup: ${html}`);
  return match[1].split(" ");
}

test("a card without a padding class gets the default inner spacing", () => {
  assert.deepEqual(classesOf({}), [...SURFACE, "p-5"]);
});

test("layout classes at the call site keep the default inner spacing", () => {
  assert.deepEqual(classesOf({ className: "mb-6 max-w-lg" }), [...SURFACE, "p-5", "mb-6", "max-w-lg"]);
});

test("an explicit padding replaces the default instead of fighting it", () => {
  assert.deepEqual(classesOf({ className: "p-4 mt-6" }), [...SURFACE, "p-4", "mt-6"]);
  assert.deepEqual(classesOf({ className: "mt-6 p-[18px]" }), [...SURFACE, "mt-6", "p-[18px]"]);
});

test("a card that wraps a table stays edge to edge with p-0", () => {
  assert.deepEqual(classesOf({ className: "overflow-hidden p-0" }), [...SURFACE, "overflow-hidden", "p-0"]);
});

test("one side or one breakpoint does not count as the card's padding", () => {
  // px-0 / py-2 refine one axis and sm:p-8 one breakpoint — the card still needs its base spacing under them.
  assert.deepEqual(classesOf({ className: "px-0" }), [...SURFACE, "p-5", "px-0"]);
  assert.deepEqual(classesOf({ className: "sm:p-8" }), [...SURFACE, "p-5", "sm:p-8"]);
});

test("other attributes still reach the element", () => {
  const html = renderToStaticMarkup(createElement(Card, { id: "karta", "data-x": "1" }, "Obsah"));
  assert.match(html, / id="karta"/);
  assert.match(html, / data-x="1"/);
});
