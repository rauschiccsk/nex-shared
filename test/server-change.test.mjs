// DEV-311 — a change made on one screen shows on every other one, without reloading the page.
// 05.11.2026, NEX Manager 1.5.3: the admin changed his own e-mail in Používatelia and Moje konto kept the old one — the
// frame holds a copy of the signed-in person and only Moje konto's own save refreshed it. The client now tells every
// listener what it changed (POST, PUT, PATCH, DELETE that succeeded); a shared copy listens and refreshes itself, so a
// screen that comes later is covered too.
import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { createApiClient, onServerChange } from "../dist/index.js";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

function answering(status, body = { ok: true }) {
  globalThis.fetch = async () =>
    new Response(status === 204 ? null : JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" },
    });
}

function client() {
  return createApiClient({ baseUrl: "http://app.test", getToken: () => null });
}

test("a change that went through is told, with its method and path without the prefix", async () => {
  answering(200);
  const told = [];
  const stop = onServerChange((change) => told.push(change));
  try {
    await client().patch("/users/u1", { email: "a@b.sk" });
    await client().post("/api/v1/groups/g1/members", { user: "u2" });
    await client().delete("/sessions/s1");
    await client().put("/user-layout", {});
  } finally {
    stop();
  }
  assert.deepEqual(told, [
    { method: "PATCH", path: "/users/u1" },
    { method: "POST", path: "/groups/g1/members" },
    { method: "DELETE", path: "/sessions/s1" },
    { method: "PUT", path: "/user-layout" },
  ]);
});

test("a read and a refused change are not told", async () => {
  const told = [];
  const stop = onServerChange((change) => told.push(change));
  try {
    answering(200);
    await client().get("/users");
    answering(409, { detail: "Nie." });
    await assert.rejects(client().patch("/users/u1", {}));
  } finally {
    stop();
  }
  assert.deepEqual(told, []);
});

test("a listener that throws breaks neither the change nor the other listeners", async () => {
  answering(200, { saved: true });
  const told = [];
  const stopBad = onServerChange(() => {
    throw new Error("listener failed");
  });
  const stopGood = onServerChange((change) => told.push(change.path));
  try {
    assert.deepEqual(await client().patch("/auth/me", {}), { saved: true });
  } finally {
    stopBad();
    stopGood();
  }
  assert.deepEqual(told, ["/auth/me"]);
});

test("a listener that stopped listening is told nothing more", async () => {
  answering(200);
  const told = [];
  const stop = onServerChange((change) => told.push(change.path));
  stop();
  await client().patch("/auth/me", {});
  assert.deepEqual(told, []);
});
