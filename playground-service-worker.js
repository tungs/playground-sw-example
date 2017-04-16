self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

var cacheName = 'playground';
var playgroundDirectory = 'playground/';
var storeSession = function (session) {
  return caches
    .delete(cacheName) // first delete the previous session, if it exists
    .then(function () { return caches.open(cacheName); }) // then open it again
    .then(function (cache) {
      return Promise.all(session.files.map(function (file) {
        return cache.put(
          new Request(self.registration.scope + playgroundDirectory + file.name),
          new Response(file.content, {
            headers: { 'Content-Type': getFileType(file) }
          })
        );
      }));
    });
};

var extensionTypes = {
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/javascript",
  "default": "text/plain",
  ".txt": "text/plain",
  ".html": "text/html",
  ".htm": "text/htm"
};

var getFileType = function(file) {	
  var ind = file.name.lastIndexOf('.');
  var extension = file.extension || 'default';
  if (!file.extension && ind !== -1) {
    extension = file.name.substring(ind).toLowerCase();
  }
  return extensionTypes[extension] || extensionTypes['default'];
};

self.addEventListener('fetch', function (event) {
  var baseUrl = new URL(event.request.url);
  event.respondWith(caches.match(new Request(baseUrl))
    .then(function(response){
      if (response) {
        // a response is found in the list of files we should intercept
        // so return the response
        return response;
      } else {
        // the web request isn't found in the list of files
        // so just retrieve the file normally
        // event.request is an object that gets "consumed", so it's important to clone it
        return fetch(event.request.clone());
      }
    })
  )
});

self.addEventListener('message', function (event) {
  var session = event.data;
  storeSession(session).then(function () {
    // runs after the session is stored
    event.ports[0].postMessage({}); // send an empty object as a response
  }).catch(function (err) {
    event.ports[0].postMessage({error: err});
  });
});


