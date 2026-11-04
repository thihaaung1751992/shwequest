/** Complete object size Cloudflare Free will store is far above one window. */
export const VIDEO_WINDOW_BYTES = 2 * 1024 * 1024;

/**
 * Range the service worker should answer from chunk URLs.
 * Open or oversized ranges stop after one window, matching the origin stream cap.
 * @param {string | null} header
 * @param {number} size
 * @param {number} windowBytes
 * @returns {{ start: number, end: number } | "unsatisfiable" | "passthrough"}
 */
export function resolveVideoRange(header, size, windowBytes) {
  if (!Number.isSafeInteger(size) || size < 0 || !Number.isSafeInteger(windowBytes) || windowBytes <= 0) {
    return "unsatisfiable";
  }
  if (size === 0 || header === null) return "passthrough";
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match) return "passthrough";
  const startText = match[1] ?? "";
  const endText = match[2] ?? "";
  if (startText === "" && endText === "") return "unsatisfiable";

  let start;
  let end;
  if (startText === "") {
    const suffix = Number(endText);
    if (!Number.isInteger(suffix) || suffix <= 0) return "unsatisfiable";
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(startText);
    if (!Number.isInteger(start) || start < 0 || start >= size) return "unsatisfiable";
    end = endText === "" ? size - 1 : Number(endText);
    if (!Number.isInteger(end) || end < start) return "unsatisfiable";
    end = Math.min(end, size - 1);
  }

  if (end - start + 1 > windowBytes) end = start + windowBytes - 1;
  return { start, end };
}

/**
 * Chunk indexes that cover [start, end]. Each chunk is one cacheable object.
 * @param {number} start
 * @param {number} end
 * @param {number} windowBytes
 * @returns {number[]}
 */
export function chunkIndexes(start, end, windowBytes) {
  const first = Math.floor(start / windowBytes);
  const last = Math.floor(end / windowBytes);
  const indexes = [];
  for (let index = first; index <= last; index += 1) indexes.push(index);
  return indexes;
}

/**
 * @param {string} indexText
 * @param {number} size
 * @param {number} windowBytes
 * @returns {{ start: number, end: number } | "bad-index" | "past-end"}
 */
export function chunkBounds(indexText, size, windowBytes) {
  if (!/^(0|[1-9]\d*)$/.test(indexText)) return "bad-index";
  const index = Number(indexText);
  if (!Number.isSafeInteger(index) || !Number.isSafeInteger(size) || size < 0) return "bad-index";
  const start = index * windowBytes;
  if (!Number.isSafeInteger(start)) return "bad-index";
  if (start >= size) return "past-end";
  return { start, end: Math.min(start + windowBytes, size) - 1 };
}

/**
 * Copy the requested interval out of whole chunk bodies.
 * Returns null when a chunk length does not match the file, so a short body is not cached as success.
 * @param {Uint8Array[]} parts
 * @param {number[]} indexes
 * @param {number} start
 * @param {number} end
 * @param {number} size
 * @param {number} windowBytes
 * @returns {Uint8Array | null}
 */
export function assembleChunkRange(parts, indexes, start, end, size, windowBytes) {
  if (indexes.length === 0 || indexes.length !== parts.length) return null;
  const length = end - start + 1;
  if (!Number.isSafeInteger(length) || length <= 0 || length > windowBytes) return null;
  const merged = new Uint8Array(length);
  let covered = 0;
  for (let i = 0; i < indexes.length; i += 1) {
    const index = indexes[i];
    const part = parts[i];
    if (index === undefined || !part) return null;
    const chunkStart = index * windowBytes;
    const expected = Math.min(windowBytes, size - chunkStart);
    if (!Number.isSafeInteger(chunkStart) || expected <= 0 || part.length !== expected) return null;
    const copyFrom = Math.max(start, chunkStart);
    const copyTo = Math.min(end + 1, chunkStart + part.length);
    if (copyTo <= copyFrom) return null;
    merged.set(part.subarray(copyFrom - chunkStart, copyTo - chunkStart), copyFrom - start);
    covered += copyTo - copyFrom;
  }
  if (covered !== length) return null;
  return merged;
}
