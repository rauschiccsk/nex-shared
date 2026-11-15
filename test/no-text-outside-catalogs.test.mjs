// DEV-393 — no text a person reads is written into a component; every one comes from the catalogs (src/locales).
//
// The rule reads the source as TypeScript sees it: text between JSX tags, a text attribute (placeholder, title,
// aria-label, alt, label), a string shown as a JSX child, a fallback sentence after `||` / `??`, and any string with a
// Slovak letter. Class names, keys and technical values are none of these. A new component cannot bring hard text
// back: the rule walks every file, it keeps no list of them.
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

import ts from "typescript";

const SRC = new URL("../src/", import.meta.url);
const TEXT_ATTRIBUTES = new Set(["placeholder", "title", "aria-label", "alt", "label"]);
const LETTER = /\p{L}/u;
const SLOVAK = /[áäčďéíĺľňóôŕšťúýž]/i;
const SENTENCE = /\p{L}{2,}[\s\p{L}]*\s\p{L}{2,}/u;

export function sources() {
  return readdirSync(SRC).filter((name) => /\.tsx?$/.test(name)).map((name) => [name, readFileSync(new URL(name, SRC), "utf8")]);
}

/** A string handed (directly, or as a branch of a condition) to a setter of what a person reads — `setError(…)`,
 *  `setSaveMessage(…)`. */
function toldToAPerson(node) {
  let at = node.parent;
  if (ts.isConditionalExpression(at)) at = at.parent;
  return ts.isCallExpression(at) && /^set\w*(Error|Message|Result|Notice)$/.test(at.expression.getText());
}

/** The texts written into one source file — `[line, what, text]`. */
export function hardTexts(name, code) {
  const file = ts.createSourceFile(name, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const found = [];
  const line = (node) => file.getLineAndCharacterOfPosition(node.getStart()).line + 1;
  const isString = (node) => ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node);
  const languageName = (node) =>
    ts.isPropertyAssignment(node.parent) && node.parent.name.getText() === "name" && name === "i18n.tsx";
  const visit = (node) => {
    if (ts.isJsxText(node) && LETTER.test(node.text)) found.push([line(node), "JSX text", node.text.trim()]);
    if (ts.isJsxAttribute(node) && node.initializer && isString(node.initializer) && TEXT_ATTRIBUTES.has(node.name.getText()) && LETTER.test(node.initializer.text)) {
      found.push([line(node), node.name.getText(), node.initializer.text]);
    }
    if (isString(node) && !ts.isImportDeclaration(node.parent) && !ts.isExportDeclaration(node.parent) && !languageName(node)) {
      const parent = node.parent;
      const shownAsChild = ts.isJsxExpression(parent) && !ts.isJsxAttribute(parent.parent) && LETTER.test(node.text);
      const inChildCondition = ts.isConditionalExpression(parent) && ts.isJsxExpression(parent.parent) && !ts.isJsxAttribute(parent.parent.parent) && LETTER.test(node.text);
      const fallback = ts.isBinaryExpression(parent) && parent.right === node && [ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken].includes(parent.operatorToken.kind) && SENTENCE.test(node.text);
      const told = toldToAPerson(node) && LETTER.test(node.text);
      if (shownAsChild || inChildCondition || fallback || told || SLOVAK.test(node.text)) found.push([line(node), "string", node.text]);
    }
    if (ts.isTemplateExpression(node) && SLOVAK.test(node.getText())) found.push([line(node), "template", node.getText()]);
    ts.forEachChild(node, visit);
  };
  visit(file);
  return found;
}

test("no component writes a text a person reads — every one comes from the catalogs", () => {
  const said = sources()
    .filter(([name]) => !name.startsWith("locales"))
    .flatMap(([name, code]) => hardTexts(name, code).map(([l, what, text]) => `${name}:${l} (${what}): ${text.slice(0, 70)}`));
  assert.deepEqual(said, []);
});

test("the rule reads every component and sees each shape of a hard text", () => {
  assert.ok(sources().length > 30);
  const shapes = {
    "JSX text": `export const A = () => <p>Zatiaľ nič</p>;`,
    placeholder: `export const A = () => <input placeholder="napr. Tibor" />;`,
    "child string": `export const A = ({ b }) => <p>{b ? "Ano" : "Nie"}</p>;`,
    fallback: `export const f = (e) => e.message || "Test zlyhal (chyba spojenia).";`,
    "Slovak string": `const LABELS = { low: "Nízka" };`,
    "told to a person": `const f = (e, setError) => setError(e instanceof Error ? e.message : "Login failed");`,
  };
  for (const [shape, code] of Object.entries(shapes)) assert.notDeepEqual(hardTexts("x.tsx", code), [], shape);
  const fine = `export const A = ({ t }) => <p className="flex gap-2 text-sm" title={t("x.y")}>{t("x.z")} — {"·"}</p>;`;
  assert.deepEqual(hardTexts("x.tsx", fine), []);
});
