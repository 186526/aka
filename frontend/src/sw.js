importScripts(
  "https://cdn.jsdelivr.net/npm/workbox-cdn@4.2.0/workbox/workbox-sw.js"
);
console.log("service worker 注册成功");
self.addEventListener("install", (e) => {
  console.log("Service worker 安装成功");
  self.skipWaiting();
});
self.addEventListener("activate", () => {
  console.log("Service worker 激活||应用更新 成功");
});
if (workbox) {
  workbox.core.setCacheNameDetails({
    prefix: "AKA",
    suffix: "0.1 sw-test",
    precache: "precache",
    runtime: "runtime",
  });
  workbox.routing.registerRoute(
    /\/js*/,
    new workbox.strategies.CacheFirst({
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 60 * 24 * 7,
        }),
      ],
      cacheName: "Static Sources",
    })
  );
  workbox.routing.registerRoute(
    /\/css*/,
    new workbox.strategies.CacheFirst({
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 60 * 24 * 7,
        }),
      ],
      cacheName: "Static Sources",
    })
  );
  workbox.routing.registerRoute(
    /\/_dist_*/,
    new workbox.strategies.CacheFirst({
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60*10,
        }),
      ],
      cacheName: "Static Sources",
    })
  );
  workbox.routing.registerRoute(
    /\/web_modules*/,
    new workbox.strategies.CacheFirst({
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 60 * 24 * 3,
        }),
      ],
      cacheName: "Static Sources",
    })
  );
  workbox.routing.registerRoute(
    /\/assets*/,
    new workbox.strategies.CacheFirst({
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 60 * 24 * 7,
        }),
      ],
      cacheName: "Static Sources",
    })
  );
  workbox.routing.registerRoute(
    /.*cdn\.jsdelivr\.net/,
    new workbox.strategies.CacheFirst({
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 60 * 24 * 24 * 30,
        }),
      ],
      cacheName: "jsDelivr",
    })
  );
  workbox.routing.registerRoute(
    /\/api*/,
    new workbox.strategies.NetworkFirst({
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 5,
        }),
      ],
      cacheName: "Others",
    })
  );
  workbox.routing.registerRoute(
    /\//,
    new workbox.strategies.StaleWhileRevalidate({
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 60 * 4,
        }),
      ],
      cacheName: "index",
    })
  );
  workbox.routing.registerRoute(
    /\*/,
    new workbox.strategies.StaleWhileRevalidate({
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 5,
        }),
      ],
      cacheName: "Others",
    })
  );
}
