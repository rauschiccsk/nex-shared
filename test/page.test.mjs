// DEV-244 — a page uses the whole width of the screen unless it is a form or text to read.
// 27.10.2026 NEX Knowledge 0.1.0 at 1920 px: every page capped itself (mx-auto max-w-6xl) and left about 270 px empty
// on each side. Director: „Poprosím efektívnejšie využiť priestor obrazovky“. Runs on the built bundle.
import assert from "node:assert/strict";
import { test } from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Page } from "../dist/index.js";

const outer = (html) => html.match(/^<div class="([^"]*)"/)[1].split(" ");

test("a page uses the whole width by default", () => {
  const html = renderToStaticMarkup(createElement(Page, { title: "Protokoly o vyradení" }, "tabuľka"));
  assert.deepEqual(outer(html), ["w-full"]);
});

test("a form or text to read is narrow, and stays on the left under its heading", () => {
  const html = renderToStaticMarkup(createElement(Page, { title: "Nastavenia", width: "narrow" }, "formulár"));
  assert.deepEqual(outer(html), ["w-full", "max-w-3xl"]);
  assert.doesNotMatch(html, /mx-auto/);
});

test("the title row carries the heading, the line under it and the buttons", () => {
  const html = renderToStaticMarkup(
    createElement(
      Page,
      { title: "Protokoly o vyradení", subtitle: "Vedomosti, ktorým lehota beží.", actions: createElement("button", null, "Pripraviť") },
      "tabuľka",
    ),
  );
  assert.match(html, /<h1 class="[^"]*">Protokoly o vyradení<\/h1>/);
  assert.match(html, /<p class="[^"]*">Vedomosti, ktorým lehota beží\.<\/p>/);
  assert.match(html, /<div class="flex flex-wrap items-center gap-2"><button>Pripraviť<\/button><\/div>/);
  assert.ok(html.endsWith("tabuľka</div>"));
});

test("a page without a title has no empty title row", () => {
  const html = renderToStaticMarkup(createElement(Page, {}, "obsah"));
  assert.equal(html, '<div class="w-full">obsah</div>');
});

test("layout classes and attributes of the app still reach the page", () => {
  const html = renderToStaticMarkup(createElement(Page, { className: "space-y-4", id: "domov" }, "obsah"));
  assert.deepEqual(outer(html), ["w-full", "space-y-4"]);
  assert.match(html, / id="domov"/);
});
