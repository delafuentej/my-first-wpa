//imports
importScripts("js/sw-utils.js");

let CACHE_STATIC = "static-v5";
const CACHE_DYNAMIC = "dynamic-v2";
const CACHE_IMMUTABLE = "immutable-v1";

//APP_SHELL => all that is needed for the application in order to work(need for quick loading)
const APP_SHELL = [
  // "/",
  "index.html",
  "css/style.css",
  "css/animate.css",
  "img/favicon.ico",
  "img/avatars/batgirl.jpg",
  "img/avatars/batman.jpg",
  "img/avatars/captain-america.jpg",
  "img/avatars/hulk.jpg",
  "img/avatars/ironman.jpg",
  "img/avatars/spiderman.jpg",
  "img/avatars/superman.jpg",
  "img/avatars/thor.jpg",
  "img/avatars/wolverine.jpg",
  "img/avatars/wonder-woman.jpg",
  "js/app.js",
  "js/sw-utils.js",
];

const APP_SHELL_IMNMUTABLE = [
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Lato:400,300",
  "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
  "css/animate.css",
  "js/libs/jquery.js",
];

//SW INSTALLATION
// self.addEventListener("install", (event) => {
//   //open cache
//   const cacheStatic = caches
//     .open(CACHE_STATIC)
//     .then((cache) => cache.addAll(APP_SHELL));

//   const cacheImmutable = caches
//     .open(CACHE_IMMUTABLE)
//     .then((cache) => cache.addAll(APP_SHELL_IMNMUTABLE));

//   //wait until the promise is resolved in full
//   event.waitUntil(Promise.all([cacheStatic, cacheImmutable]));
// });
self.addEventListener("install", (event) => {
  const cacheStatic = caches.open(CACHE_STATIC).then((cache) => {
    return cache.addAll(APP_SHELL);
  });

  const cacheImmutable = caches.open(CACHE_IMMUTABLE).then((cache) => {
    // custom function to manage external resources with 'no-cors'.
    return Promise.all(
      APP_SHELL_IMNMUTABLE.map((url) =>
        cache.add(new Request(url, { mode: "no-cors" })).catch((err) => {
          console.warn(`Error adding ${url} to immutable cache`, err);
        })
      )
    );
  });

  // Espera a que ambos cachés sean configurados
  event.waitUntil(Promise.all([cacheStatic, cacheImmutable]));
});

//CACHING STRATEGY: "Cache with Network Fallback"
self.addEventListener("fetch", (event) => {
  //Check if the request exists in cache => caches.match(event.request)
  const cacheWithNetworkFallback = caches.match(event.request).then((res) => {
    if (res) {
      return res;
    } else {
      console.log("it does not exists", event.request.url);

      return fetch(event.request).then((newRes) => {
        return updateDynamicCache(CACHE_DYNAMIC, event.request, newRes);
      });
    }
    // if !res (if the resource does not exist in the cache)=> http request

    //   caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
    //     cache.put(event.request, newRes);
    //     cleanCache(CACHE_DYNAMIC_NAME, 25);
    //   });
    //   return newRes.clone();
    // });
  });

  event.respondWith(cacheWithNetworkFallback);
});

//to delete old cache versions when the new service worker is activated
self.addEventListener("activate", (event) => {
  // check if another cache type exists with the name static
  const deleteOldCache = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== CACHE_STATIC && key.includes("static")) {
        return caches.delete(key);
      }
      if (key !== CACHE_DYNAMIC && key.includes("dynamic")) {
        return caches.delete(key);
      }
    });
  });
  event.waitUntil(deleteOldCache);
});
