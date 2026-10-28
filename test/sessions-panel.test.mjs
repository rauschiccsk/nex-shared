// DEV-252 — Relácie without the cockpit's token number: the app template keeps its sessions in the database and has
// no token version, so the column „tv“ would be a column of nothing. The cockpit, which has it, keeps it.
import assert from "node:assert/strict";
import { test } from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { SessionsPanel } from "../dist/index.js";

const ROW = {
  id: "s1",
  user_id: "u1",
  last_seen_at: "2026-10-28T12:00:00Z",
  created_at: "2026-10-28T08:00:00Z",
  updated_at: "2026-10-28T12:00:00Z",
};

function headers(sessions) {
  const html = renderToStaticMarkup(
    createElement(SessionsPanel, { sessions, canRevoke: false, onRevoke: async () => {} }),
  );
  return [...html.matchAll(/<th[^>]*>([^<]*)<\/th>/g)].map((m) => m[1]);
}

test("sessions with a token version show it, as in the cockpit", () => {
  assert.deepEqual(headers([{ ...ROW, token_version: 3 }]), [
    "Používateľ",
    "ID relácie",
    "tv",
    "Naposledy videný",
    "Vytvorené",
    "Akcie",
  ]);
});

test("sessions without one leave the column out", () => {
  assert.deepEqual(headers([ROW]), ["Používateľ", "ID relácie", "Naposledy videný", "Vytvorené", "Akcie"]);
});
