// DEV-242 — a number, a date, a state or a menu entry stays on one line.
// 27.10.2026 NEX Knowledge 0.1.0, „Protokoly o vyradení“ at 1920 px: „P-2026-003“ broke at its hyphen, „31. 1. 2037“
// and „Čaká na prípravu“ at their spaces, and the menu entry „Uchovávanie a odstraňovanie (3)“ took two lines of a
// 35 px row. Director: „nechcem, aby čísla, dátumy a stavy boli rozbité do dvoch riadkov“. Runs on the built bundle
// (dist/index.js) — exactly what an app installs — rendered to markup by react-dom/server.
import assert from "node:assert/strict";
import { test } from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Badge, DataTable, NavItem, StatusBadge } from "../dist/index.js";

const classes = (html, tag) =>
  [...html.matchAll(new RegExp(`<${tag}\\s[^>]*class="([^"]*)"`, "g"))].map((m) => m[1].split(" "));

test("a state badge never breaks", () => {
  const html = renderToStaticMarkup(createElement(StatusBadge, { status: "warning" }, "Čaká na prípravu"));
  assert.ok(classes(html, "span")[0].includes("whitespace-nowrap"), html);
});

test("a badge never breaks", () => {
  const html = renderToStaticMarkup(createElement(Badge, {}, "v0.1.0 beta"));
  assert.ok(classes(html, "span")[0].includes("whitespace-nowrap"), html);
});

function table(columns) {
  return renderToStaticMarkup(
    createElement(DataTable, {
      columns,
      rows: [{ id: 1, number: "P-2026-003", title: "Dohoda o urovnaní — Beta Trade a.s.", due: "31. 1. 2037" }],
      getRowKey: (r) => r.id,
      rowActions: () => "PDF",
    }),
  );
}

test("every header and every value stays on one line", () => {
  const html = table([
    { key: "number", header: "Číslo" },
    { key: "due", header: "Lehota" },
  ]);
  const heads = classes(html, "th");
  const cells = classes(html, "td");
  assert.equal(heads.length, 3);
  assert.equal(cells.length, 3);
  for (const cell of [...heads, ...cells]) assert.ok(cell.includes("whitespace-nowrap"), cell.join(" "));
});

test("only a column marked as long text may wrap", () => {
  const html = table([
    { key: "number", header: "Číslo" },
    { key: "title", header: "Vedomosť", wrap: true },
  ]);
  const [number, title] = classes(html, "td");
  assert.ok(number.includes("whitespace-nowrap"));
  assert.ok(!title.includes("whitespace-nowrap"), title.join(" "));
  // the header of the long text column still stays on one line
  assert.ok(classes(html, "th")[1].includes("whitespace-nowrap"));
});

function navItem(props) {
  return renderToStaticMarkup(createElement(NavItem, { icon: "⚖️", label: "Uchovávanie a odstraňovanie", ...props }));
}

test("a menu entry keeps its label on one line and names it in full on hover", () => {
  const html = navItem({});
  const label = html.match(/<span class="([^"]*)" title="([^"]*)">Uchovávanie a odstraňovanie<\/span>/);
  assert.ok(label, html);
  assert.deepEqual(label[1].split(" ").sort(), ["min-w-0", "truncate"]);
  assert.equal(label[2], "Uchovávanie a odstraňovanie");
});

test("a count beside the label stays visible when the label is cut", () => {
  const html = navItem({ count: 3 });
  assert.match(html, /<span class="min-w-0 truncate" title="Uchovávanie a odstraňovanie">Uchovávanie a odstraňovanie<\/span><span class="[^"]*shrink-0[^"]*">\(3\)<\/span>/);
});

test("no count, or zero, shows nothing beside the label", () => {
  assert.doesNotMatch(navItem({}), /\(\d+\)/);
  assert.doesNotMatch(navItem({ count: 0 }), /\(0\)/);
});

test("a disabled entry keeps its reason as the only hover text", () => {
  const html = navItem({ disabled: true, disabledTitle: "Nemáš prístup" });
  assert.match(html, /<button[^>]*title="Nemáš prístup"/);
  assert.doesNotMatch(html, /<span[^>]*title=/);
});
