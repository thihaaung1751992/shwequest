import {
  VIDEO_WINDOW_BYTES,
  assembleChunkRange,
  chunkIndexes,
  resolveVideoRange,
} from "./video-chunk-range.js";

/** Browser script. Range math is the same functions the tests call. */
export function videoCacheWorkerScript() {
  return `const WINDOW_BYTES = ${VIDEO_WINDOW_BYTES};
${resolveVideoRange.toString()}
${chunkIndexes.toString()}
${assembleChunkRange.toString()}

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  var url = new URL(event.request.url);
  if (url.searchParams.has("origin")) return;
  var match = /^\\/api\\/video\\/([1-9]\\d*)$/.exec(url.pathname);
  if (!match) return;
  event.respondWith(serveVideo(event.request, match[1]));
});

function originRequest(request) {
  var url = new URL(request.url);
  url.searchParams.set("origin", "1");
  var headers = new Headers();
  var range = request.headers.get("Range");
  if (range) headers.set("Range", range);
  return fetch(url, { headers: headers });
}

function videoMime(mime) {
  if (typeof mime === "string" && mime.indexOf("video/") === 0 && mime.indexOf("\\r") === -1 && mime.indexOf("\\n") === -1) {
    return mime;
  }
  return "video/mp4";
}

async function serveVideo(request, id) {
  try {
    var metaResponse = await fetch(new URL("/api/video/" + id + "/meta", request.url));
    if (!metaResponse.ok) return originRequest(request);
    var meta = await metaResponse.json();
    if (!meta || typeof meta.size !== "number" || !Number.isSafeInteger(meta.size) || meta.size < 0) {
      return originRequest(request);
    }
    var resolved = resolveVideoRange(request.headers.get("Range"), meta.size, WINDOW_BYTES);
    if (resolved === "passthrough") return originRequest(request);
    if (resolved === "unsatisfiable") {
      return new Response("Range not satisfiable.", {
        status: 416,
        headers: {
          "Content-Range": "bytes */" + meta.size,
          "Accept-Ranges": "bytes",
        },
      });
    }
    var indexes = chunkIndexes(resolved.start, resolved.end, WINDOW_BYTES);
    var parts = [];
    for (var i = 0; i < indexes.length; i += 1) {
      var chunkResponse = await fetch(new URL("/api/video/" + id + "/chunk/" + indexes[i], request.url), {
        headers: { "Accept-Encoding": "identity" },
      });
      if (!chunkResponse.ok) return originRequest(request);
      parts.push(new Uint8Array(await chunkResponse.arrayBuffer()));
    }
    var body = assembleChunkRange(parts, indexes, resolved.start, resolved.end, meta.size, WINDOW_BYTES);
    if (!body) return originRequest(request);
    return new Response(body, {
      status: 206,
      headers: {
        "Content-Type": videoMime(meta.mime),
        "Content-Length": String(body.byteLength),
        "Content-Range": "bytes " + resolved.start + "-" + resolved.end + "/" + meta.size,
        "Accept-Ranges": "bytes",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return originRequest(request);
  }
}
`;
}
