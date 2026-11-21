// Service worker: cache-first with 30-day TTL for offline repeat visits.
const CACHE = "site-v2";
const TTL = 30 * 24 * 60 * 60 * 1000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(["/", "/index.html"]).catch(() => {})
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      if (cached) {
        const ts = cached.headers.get("x-sw-ts");
        if (ts && Date.now() - Number(ts) < TTL) {
          return cached;
        }
      }
      try {
        const res = await fetch(req);
        if (res && res.status === 200 && res.type === "basic") {
          const headers = new Headers(res.headers);
          headers.set("x-sw-ts", String(Date.now()));
          const stamped = new Response(await res.clone().blob(), {
            status: res.status,
            statusText: res.statusText,
            headers,
          });
          cache.put(req, stamped);
        }
        return res;
      } catch (e) {
        if (cached) return cached;
        throw e;
      }
    })
  );
});