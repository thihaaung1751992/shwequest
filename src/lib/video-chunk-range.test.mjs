import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import {
  VIDEO_WINDOW_BYTES,
  assembleChunkRange,
  chunkBounds,
  chunkIndexes,
  resolveVideoRange,
} from "./video-chunk-range.js";
import { videoCacheWorkerScript } from "./video-cache-worker.js";

const WINDOW = VIDEO_WINDOW_BYTES;

test("open range stops after one window", () => {
  assert.deepEqual(resolveVideoRange("bytes=0-", 5_000_000, WINDOW), {
    start: 0,
    end: WINDOW - 1,
  });
});

test("explicit short range is kept", () => {
  assert.deepEqual(resolveVideoRange("bytes=1000-5000", 5_000_000, WINDOW), {
    start: 1000,
    end: 5000,
  });
});

test("range past the file and empty header", () => {
  assert.equal(resolveVideoRange("bytes=20-30", 10, WINDOW), "unsatisfiable");
  assert.equal(resolveVideoRange(null, 10, WINDOW), "passthrough");
  assert.equal(resolveVideoRange("bytes=0-", 0, WINDOW), "passthrough");
});

test("suffix range is capped from its start", () => {
  const size = WINDOW * 3;
  assert.deepEqual(resolveVideoRange(`bytes=-${WINDOW + 10}`, size, WINDOW), {
    start: size - (WINDOW + 10),
    end: size - (WINDOW + 10) + WINDOW - 1,
  });
});

test("chunk bounds stay inside the file", () => {
  assert.deepEqual(chunkBounds("0", 100, 40), { start: 0, end: 39 });
  assert.deepEqual(chunkBounds("2", 100, 40), { start: 80, end: 99 });
  assert.equal(chunkBounds("3", 100, 40), "past-end");
  assert.equal(chunkBounds("01", 100, 40), "bad-index");
  assert.equal(chunkBounds("-1", 100, 40), "bad-index");
});

test("indexes cover a request that crosses a window", () => {
  assert.deepEqual(chunkIndexes(WINDOW - 10, WINDOW + 10, WINDOW), [0, 1]);
});

test("assemble copies only the requested bytes", () => {
  const size = WINDOW + 20;
  const first = new Uint8Array(WINDOW);
  const second = new Uint8Array(20);
  first[WINDOW - 2] = 7;
  first[WINDOW - 1] = 8;
  second[0] = 9;
  second[1] = 10;
  const body = assembleChunkRange(
    [first, second],
    [0, 1],
    WINDOW - 2,
    WINDOW + 1,
    size,
    WINDOW,
  );
  assert.deepEqual(Array.from(body ?? []), [7, 8, 9, 10]);
});

test("assemble rejects a short chunk", () => {
  const body = assembleChunkRange([new Uint8Array(4)], [0], 0, 3, WINDOW, WINDOW);
  assert.equal(body, null);
});

test("worker script uses the same range function", () => {
  const sandbox = {
    self: {
      addEventListener() {},
      skipWaiting() {},
      clients: { claim() {} },
    },
    URL,
    fetch() {
      throw new Error("fetch should not run");
    },
    Response,
    Uint8Array,
    Number,
    Math,
    String,
    console,
  };
  vm.createContext(sandbox);
  vm.runInContext(
    `${videoCacheWorkerScript()}\nself.__resolve = resolveVideoRange;`,
    sandbox,
  );
  const resolve = sandbox.self.__resolve;
  assert.equal(typeof resolve, "function");
  const open = resolve("bytes=0-", 5_000_000, WINDOW);
  const direct = resolveVideoRange("bytes=0-", 5_000_000, WINDOW);
  assert.equal(open.start, direct.start);
  assert.equal(open.end, direct.end);
  const exact = resolve("bytes=1000-5000", 5_000_000, WINDOW);
  assert.equal(exact.start, 1000);
  assert.equal(exact.end, 5000);
});
