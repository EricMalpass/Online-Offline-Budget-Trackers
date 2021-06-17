//console.log("Hi from your service-worker.js file!");

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/index.js",
  "/styles.css",
  "/db.js",
  "/manifest.webmanifest",
  "icons/icon-192x192.png",
  "icons/icon-512x512.png",
  "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
];


  // install
// self.addEventListener("install", function (evt) {
//     // pre cache all static assets
//     evt.waitUntil(
//       caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
//     );
//     // tell the browser to activate this service worker immediately once it
//     // has finished installing
//   });

const PRECACHE = 'precache-v1';
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting())
  );
});

  // fetch
self.addEventListener("fetch", function(evt) {
    if (evt.request.url.includes("/api/")) {
      evt.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
          return fetch(evt.request)
            .then(response => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }
              return response;
            })
            .catch(err => {
              // Network request failed, try to get it from the cache.
              return cache.match(evt.request);
            });
        }).catch(err => console.log(err))
      );
  
      return;
    }
    else { evt.respondWith(
      fetch(evt.request).catch(function(){
          return caches.match(evt.request).then(response => {
              if (response) {return response}
              else if (evt.request.headers.get("accept").includes("text/html")){ 
                  return caches.match("/")
          }
          })
      })
    );}

  
    });