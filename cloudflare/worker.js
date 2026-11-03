const TARGET_ORIGIN = "https://thiha-shwequest.vercel.app";

const STREAM_CACHE_CONTROL =
  "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400";
const STREAM_CDN_CACHE_CONTROL = "max-age=604800";

const HOP_BY_HOP = [
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
];

function applyCors(headers) {
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Range, Content-Type");
  headers.set(
    "Access-Control-Expose-Headers",
    "Accept-Ranges, Content-Range, Content-Length, Content-Type",
  );
  return headers;
}

function isVideoPath(pathname) {
  return /^\/api\/video\/[1-9]\d*$/.test(pathname);
}

function cacheKeyFor(targetUrl, range) {
  const keyUrl = new URL(targetUrl);
  keyUrl.searchParams.set("__range", range || "none");
  return new Request(keyUrl.toString(), { method: "GET" });
}

function clientResponse(source, status, cacheState, method) {
  const headers = new Headers(source.headers);
  headers.delete("x-sq-status");
  headers.set("Vary", "Range");
  headers.set("X-Shwequest-Cache", cacheState);
  applyCors(headers);
  return new Response(method === "HEAD" ? null : source.body, {
    status,
    statusText: source.statusText,
    headers,
  });
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: applyCors(new Headers()) });
    }

    const incoming = new URL(request.url);
    const targetUrl = new URL(incoming.pathname + incoming.search, TARGET_ORIGIN);
    const range = request.headers.get("Range");
    const video = isVideoPath(incoming.pathname);
    const cache = caches.default;
    const key = cacheKeyFor(targetUrl, range);

    if (video && (request.method === "GET" || request.method === "HEAD")) {
      const hit = await cache.match(key);
      if (hit) {
        const status = Number(hit.headers.get("x-sq-status") || "200");
        return clientResponse(hit, status, "HIT", request.method);
      }
    }

    const headers = new Headers(request.headers);
    for (const name of HOP_BY_HOP) headers.delete(name);
    // Keep byte ranges identical to the origin body.
    headers.delete("accept-encoding");
    if (range) headers.set("Range", range);
    else headers.delete("range");

    const origin = await fetch(targetUrl, {
      method: request.method === "HEAD" && video ? "GET" : request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
      redirect: "follow",
    });

    const status = origin.status;
    const cacheable =
      video &&
      (request.method === "GET" || request.method === "HEAD") &&
      (status === 200 || status === 206) &&
      (origin.headers.get("content-type") || "").includes("video/");

    const responseHeaders = new Headers(origin.headers);
    if (cacheable) {
      responseHeaders.set("Cache-Control", STREAM_CACHE_CONTROL);
      responseHeaders.set("CDN-Cache-Control", STREAM_CDN_CACHE_CONTROL);
      responseHeaders.set("Vary", "Range");

      const storedHeaders = new Headers(responseHeaders);
      storedHeaders.set("x-sq-status", String(status));
      storedHeaders.delete("vary");
      const stored = new Response(origin.clone().body, {
        status: 200,
        headers: storedHeaders,
      });
      ctx.waitUntil(cache.put(key, stored).catch(() => undefined));
    }

    if (request.method === "HEAD" && origin.body) {
      ctx.waitUntil(origin.body.cancel());
    }

    responseHeaders.set("X-Shwequest-Cache", cacheable ? "MISS" : "BYPASS");
    responseHeaders.set("X-Shwequest-Range", range || "none");
    applyCors(responseHeaders);

    return new Response(request.method === "HEAD" ? null : origin.body, {
      status,
      statusText: origin.statusText,
      headers: responseHeaders,
    });
  },
};
