// DEV-318 — the cockpit's left rail holds 22 entries at 1280×800 without scrolling: in a dense sidebar `compactRows`
// makes a row 26 px instead of 28. The Director 06.11.2026 on lowering the cockpit's rows by 2 px: „Súhlasím“. Only the
// cockpit asks for it — an app on the template (nex-app-kit) keeps its dense 28 px rows, and a sidebar that is not
// dense keeps 35 px. Runs on the built bundle.
import assert from "node:assert/strict";
import { test } from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NavItem, Sidebar } from "../dist/index.js";

function row(props) {
  const html = renderToStaticMarkup(
    createElement(
      Sidebar,
      { collapsed: false, onToggleCollapse: () => {}, ...props },
      createElement(NavItem, { icon: "💡", label: "Nápady", onClick: () => {} }),
    ),
  );
  const classes = html.match(/<button[^>]*class="([^"]*)"[^>]*>(?:(?!<\/button>).)*Nápady/s)[1].split(" ");
  const heights = classes.filter((c) => /^h-(\[[0-9]+px\]|7)$/.test(c));
  assert.equal(heights.length, 1, `one height class, got ${heights}`);
  return heights[0].slice(2);
}

test("a compact dense rail has 26 px rows", () => {
  assert.equal(row({ dense: true, compactRows: true }), "[26px]");
});

test("a dense rail without it keeps 28 px, a plain one 35 px", () => {
  assert.equal(row({ dense: true }), "7");
  assert.equal(row({}), "[35px]");
  assert.equal(row({ compactRows: true }), "[35px]"); // compact only tightens a dense rail
});
