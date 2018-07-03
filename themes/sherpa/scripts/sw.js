(function () {
    'use strict';

    var staticCacheName = 'GITHASH';
    var filesToCache = [
        '/',
    ];

    self.addEventListener('install', function (event) {
        event.waitUntil(
            caches.open(staticCacheName)
                .then(function (cache) {
                    return cache.addAll(filesToCache);
                })
        );
    });

    self.addEventListener('fetch', function (event) {
        event.respondWith(
            caches.match(event.request).then(function (response) {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(function (response) {
                    return caches.open(staticCacheName).then(function (cache) {
                        if (event.request.url.indexOf('test') < 0) {
                            cache.put(event.request.url, response.clone());
                        }
                        return response;
                    });
                });
            }).catch(function (error) {
                console.log('Error, ', error);
            })
        );
    });

    self.addEventListener('activate', function (event) {

        var cacheWhitelist = [staticCacheName];

        event.waitUntil(
            caches.keys().then(function (cacheNames) {
                return Promise.all(
                    cacheNames.map(function (cacheName) {
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        );
    });
})();
