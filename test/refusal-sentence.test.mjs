// DEV-309 — „Moje konto“ says why the server refused, not „Uloženie zlyhalo. Skús to znova.“
// 05.11.2026, NEX Manager 1.5.1 on the ICC app template: the server answered „Tento e-mail už používa iný používateľ.“
// (409) and the panel showed its own fixed sentence; a refused password said „skontroluj súčasné heslo“ whatever the
// reason. refusalSentence() is the sentence a refusal carries — the panel shows it, or its own when there is none.
import assert from "node:assert/strict";
import { test } from "node:test";

import { ApiError, refusalSentence } from "../dist/index.js";

const TAKEN = "Tento e-mail už používa iný používateľ.";

test("the template's refusal {detail: sentence} is its sentence", () => {
  assert.equal(refusalSentence(new ApiError(409, TAKEN, { detail: TAKEN, code: "KIT-EMAIL-TAKEN" })), TAKEN);
});

test("a sentence inside an object detail is still the sentence", () => {
  const err = new ApiError(422, "Unprocessable Entity", { detail: { code: "NSV-X", detail: "Súčasné heslo je nesprávne." } });
  assert.equal(refusalSentence(err), "Súčasné heslo je nesprávne.");
});

test("no sentence — a validation list, a 500 page, a network failure — is none", () => {
  assert.equal(refusalSentence(new ApiError(422, "Field required", { detail: [{ msg: "Field required" }] })), "");
  assert.equal(refusalSentence(new ApiError(500, "Internal Server Error", "Internal Server Error")), "");
  assert.equal(refusalSentence(new ApiError(502, "Bad Gateway", null)), "");
  assert.equal(refusalSentence(new TypeError("Failed to fetch")), "");
  assert.equal(refusalSentence(new ApiError(409, "  ", { detail: "  " })), "");
});

test("the panel's own sentences when the refusal carries none", async () => {
  const { accountRefusal, passwordRefusal } = await import("../dist/index.js");
  assert.equal(accountRefusal(new ApiError(409, TAKEN, { detail: TAKEN })), TAKEN);
  assert.equal(accountRefusal(new TypeError("Failed to fetch")), "Uloženie zlyhalo. Skús to znova.");
  assert.equal(passwordRefusal(new ApiError(422, "x", { detail: "Súčasné heslo je nesprávne." })), "Súčasné heslo je nesprávne.");
  assert.equal(passwordRefusal(new ApiError(500, "Internal Server Error", null)), "Zmena hesla zlyhala. Skús to znova.");
});
