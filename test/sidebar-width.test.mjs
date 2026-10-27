// DEV-243 — the sidebar width a user sets is remembered for that user, in the app's own browser storage.
// Director 27.10.2026: „Šírka ľavého panelu nie je nastaviteľná - chcem … možnosť šírku nastavovať a následne
// zapamätať, pre každého užívateľa osobitne.“ NEX Knowledge 0.1.0 had a fixed sidebar: the kit could resize it since
// v0.21.0 but left remembering to the app, and the template never switched it on. Runs on the built bundle.
import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  SIDEBAR_WIDTH_KEY_PREFIX,
  Sidebar,
  readRememberedWidth,
  rememberWidth,
  useRememberedSidebarWidth,
} from "../dist/index.js";

const LIMITS = { min: 180, max: 360, defaultWidth: 224 };
let saved;

beforeEach(() => {
  saved = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (k) => (saved.has(k) ? saved.get(k) : null),
      setItem: (k, v) => saved.set(k, String(v)),
      removeItem: (k) => saved.delete(k),
    },
  };
});

const key = (user) => `${SIDEBAR_WIDTH_KEY_PREFIX}${user}`;

function sidebar(props) {
  return renderToStaticMarkup(
    createElement(Sidebar, { collapsed: false, onToggleCollapse: () => {}, ...props }, "menu"),
  );
}
const asideWidth = (html) => html.match(/<aside[^>]*style="width:([^"]*)"/)[1];
const hasHandle = (html) => /role="separator"/.test(html);

test("each user has a width of their own", () => {
  rememberWidth("jana", 300, 224);
  rememberWidth("eva", 260, 224);

  assert.equal(readRememberedWidth("jana", 180, 360), 300);
  assert.equal(readRememberedWidth("eva", 180, 360), 260);
  assert.deepEqual([...saved.keys()].sort(), [key("eva"), key("jana")]);
});

test("the default width is not kept — the entry goes", () => {
  rememberWidth("jana", 300, 224);
  rememberWidth("jana", 224, 224);

  assert.equal(saved.has(key("jana")), false);
});

test("a remembered width is kept within the limits and nonsense is ignored", () => {
  saved.set(key("jana"), "9999");
  saved.set(key("eva"), "nič");

  assert.equal(readRememberedWidth("jana", 180, 360), 360);
  assert.equal(readRememberedWidth("eva", 180, 360), undefined);
});

test("without a signed-in user nothing is remembered", () => {
  rememberWidth(null, 300, 224);

  assert.equal(saved.size, 0);
  assert.equal(readRememberedWidth(undefined, 180, 360), undefined);
});

test("blocked storage breaks nothing", () => {
  globalThis.window = {
    get localStorage() {
      throw new Error("SecurityError");
    },
  };

  rememberWidth("jana", 300, 224);
  assert.equal(readRememberedWidth("jana", 180, 360), undefined);
});

test("the sidebar opens at the width its user left it at, with the handle", () => {
  saved.set(key("jana"), "300");

  const html = sidebar({ rememberWidthFor: "jana" });

  assert.equal(asideWidth(html), "300px");
  assert.ok(hasHandle(html));
});

test("another user starts at the default width", () => {
  saved.set(key("jana"), "300");

  const html = sidebar({ rememberWidthFor: "eva" });

  assert.equal(asideWidth(html), "14rem");
  assert.ok(hasHandle(html));
});

test("an app that remembers nothing keeps the fixed sidebar it had", () => {
  saved.set(key("jana"), "300");

  const html = sidebar({});

  assert.equal(asideWidth(html), "14rem");
  assert.equal(hasHandle(html), false);
});

test("an app that keeps the width itself is left as it is", () => {
  saved.set(key("jana"), "300");

  const html = sidebar({ rememberWidthFor: "jana", width: 250, onWidthChange: () => {} });

  assert.equal(asideWidth(html), "250px");
});

test("changing the width remembers it for the signed-in user", () => {
  let change;
  const Probe = () => {
    change = useRememberedSidebarWidth("jana", LIMITS).onWidthChange;
    return null;
  };
  renderToStaticMarkup(createElement(Probe));

  change(312);

  assert.equal(saved.get(key("jana")), "312");
});

test("without a signed-in user the width cannot be changed", () => {
  let change = "unset";
  const Probe = () => {
    change = useRememberedSidebarWidth(null, LIMITS).onWidthChange;
    return null;
  };
  renderToStaticMarkup(createElement(Probe));

  assert.equal(change, undefined);
});
