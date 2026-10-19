// DEV-142 — a window NEX Manager launched opens where the user left it last time.
// Runs on the compiled module (`npm test` compiles src/launchWindow.ts to .test-build first) with Node's own runner,
// so the library gains no dependency every app would install.
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  LAUNCH_WINDOW_SAVE_DELAY_MS,
  LAUNCH_WINDOW_STORAGE_KEY,
  fitToScreen,
  rememberLaunchWindow,
} from "../.test-build/launchWindow.js";

const SCREEN = { availWidth: 1920, availHeight: 1040, availLeft: 0, availTop: 0 };

function fakeWindow({ name = "nexlaunch_nex-inbox", at = [100, 80, 1400, 900], screen = SCREEN, refuse = false } = {}) {
  const calls = [];
  const listeners = { resize: new Set(), pagehide: new Set() };
  const timers = new Map();
  let nextTimer = 1;
  const win = {
    name,
    screenX: at[0],
    screenY: at[1],
    outerWidth: at[2],
    outerHeight: at[3],
    screen,
    moveTo(x, y) {
      if (refuse) throw new Error("not allowed");
      calls.push(`moveTo ${x} ${y}`);
      win.screenX = x;
      win.screenY = y;
    },
    resizeTo(w, h) {
      if (refuse) throw new Error("not allowed");
      calls.push(`resizeTo ${w} ${h}`);
      win.outerWidth = w;
      win.outerHeight = h;
    },
    addEventListener: (type, fn) => listeners[type].add(fn),
    removeEventListener: (type, fn) => listeners[type].delete(fn),
    setTimeout(fn, ms) {
      const id = nextTimer++;
      timers.set(id, { fn, ms });
      return id;
    },
    clearTimeout: (id) => timers.delete(id),
    fire: (type) => [...listeners[type]].forEach((fn) => fn()),
    runTimers: () => [...timers.entries()].forEach(([id, t]) => (timers.delete(id), t.fn())),
    calls,
    listeners,
    timers,
  };
  return win;
}

function fakeStorage(initial) {
  const data = new Map(initial === undefined ? [] : [[LAUNCH_WINDOW_STORAGE_KEY, initial]]);
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, v),
    data,
  };
}

const placement = (left, top, width, height) => JSON.stringify({ left, top, width, height });

test("a window NEX Manager launched comes back where it was left", () => {
  const win = fakeWindow();
  rememberLaunchWindow(win, fakeStorage(placement(0, 0, 1920, 1040)));
  assert.deepEqual(win.calls, ["moveTo 0 0", "resizeTo 1920 1040"]);
});

test("a tab or a window NEX Manager did not open is never moved and nothing is written", () => {
  for (const name of ["", "nex-inbox", "launch_nex-inbox"]) {
    const win = fakeWindow({ name });
    const storage = fakeStorage(placement(0, 0, 1920, 1040));
    rememberLaunchWindow(win, storage);
    win.fire("resize");
    win.runTimers();
    win.fire("pagehide");
    assert.deepEqual(win.calls, [], name);
    assert.equal(storage.data.get(LAUNCH_WINDOW_STORAGE_KEY), placement(0, 0, 1920, 1040), name);
  }
});

test("the first launch leaves the window as NEX Manager opened it", () => {
  const win = fakeWindow();
  rememberLaunchWindow(win, fakeStorage());
  assert.deepEqual(win.calls, []);
});

test("a resize is written once the window stays still, not on every step", () => {
  const win = fakeWindow({ at: [10, 20, 1500, 950] });
  const storage = fakeStorage();
  rememberLaunchWindow(win, storage);
  win.fire("resize");
  win.fire("resize");
  assert.equal(win.timers.size, 1, "one pending save for a burst of resize steps");
  assert.equal([...win.timers.values()][0].ms, LAUNCH_WINDOW_SAVE_DELAY_MS);
  assert.equal(storage.data.get(LAUNCH_WINDOW_STORAGE_KEY), undefined);
  win.runTimers();
  assert.equal(storage.data.get(LAUNCH_WINDOW_STORAGE_KEY), placement(10, 20, 1500, 950));
});

test("a move without a resize is written when the window closes", () => {
  const win = fakeWindow({ at: [300, 200, 1400, 900] });
  const storage = fakeStorage();
  rememberLaunchWindow(win, storage);
  win.screenX = 640;
  win.fire("pagehide");
  assert.equal(storage.data.get(LAUNCH_WINDOW_STORAGE_KEY), placement(640, 200, 1400, 900));
});

test("a placement left on a bigger screen is fitted to this one", () => {
  assert.deepEqual(fitToScreen({ left: 2500, top: -8, width: 2560, height: 1400 }, SCREEN), {
    left: 0,
    top: 0,
    width: 1920,
    height: 1040,
  });
  assert.deepEqual(fitToScreen({ left: 1800, top: 900, width: 800, height: 600 }, SCREEN), {
    left: 1120,
    top: 440,
    width: 800,
    height: 600,
  });
  assert.deepEqual(
    fitToScreen({ left: 0, top: 0, width: 800, height: 600 }, { availWidth: 1920, availHeight: 1040, availLeft: 1920, availTop: 0 }),
    { left: 1920, top: 0, width: 800, height: 600 },
  );
});

test("a damaged entry is ignored", () => {
  for (const value of ["not json", "null", "{}", placement(0, 0, 0, 900), JSON.stringify({ left: "0", top: 0, width: 1, height: 1 })]) {
    const win = fakeWindow();
    rememberLaunchWindow(win, fakeStorage(value));
    assert.deepEqual(win.calls, [], value);
  }
});

test("a browser that refuses to move the window, or storage that cannot be used, breaks nothing", () => {
  const refusing = fakeWindow({ refuse: true });
  assert.doesNotThrow(() => rememberLaunchWindow(refusing, fakeStorage(placement(0, 0, 1920, 1040))));

  const win = fakeWindow();
  const broken = {
    getItem() {
      throw new Error("denied");
    },
    setItem() {
      throw new Error("denied");
    },
  };
  assert.doesNotThrow(() => {
    rememberLaunchWindow(win, broken);
    win.fire("pagehide");
  });
  assert.deepEqual(rememberLaunchWindow(fakeWindow(), null)(), undefined);
});

test("stopping removes the listeners and the pending save", () => {
  const win = fakeWindow();
  const stop = rememberLaunchWindow(win, fakeStorage());
  win.fire("resize");
  stop();
  assert.equal(win.listeners.resize.size, 0);
  assert.equal(win.listeners.pagehide.size, 0);
  assert.equal(win.timers.size, 0);
});
