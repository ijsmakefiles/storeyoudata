var C = "storeyoudata-v1";
var ASSETS = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(C).then(function(c){ return c.addAll(ASSETS); }));
  self.skipWaiting();
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(n){ return n !== C; }).map(function(n){ return caches.delete(n); }));
  }));
  self.clients.claim();
});
self.addEventListener("fetch", function(e){
  if(e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(function(r){
    var cp = r.clone();
    caches.open(C).then(function(c){ c.put(e.request, cp); });
    return r;
  }).catch(function(){
    return caches.match(e.request).then(function(m){ return m || caches.match("index.html"); });
  }));
});
