// imports
importScripts('js/libs/sw-utils.js');

const Static_Cache = 'Static-v1';
const Dynamic_Cache = 'Dynamic-v1';
const Inmutable_Cache = 'Inmutable-v1';

const App_Shell = [
    '/',
    '/index.html',
    '/css/style.css',
    '/img/favicon.ico',
    '/img/avatars/hulk.jpg',
    '/img/avatars/ironman.jpg',
    '/img/avatars/spiderman.jpg',
    '/img/avatars/thor.jpg',
    '/img/avatars/wolverine.jpg',
    '/js/app.js',
    '/js/libs/sw-utils.js'
];

const Inmutable_App_Shell = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    '/css/animate.css',
    '/js/libs/jquery.js'
];

self.addEventListener('install', event => {
    const staticCache = caches.open(Static_Cache).then(cache => {
        cache.addAll(App_Shell);
    });

    const inmutableCache = caches.open(Inmutable_Cache).then(cache => {
        cache.addAll(Inmutable_App_Shell);
    });

    event.waitUntil(Promise.all([staticCache, inmutableCache]));
});

self.addEventListener('activate', event => {
    const answer = caches.keys().then(keys => {
        keys.forEach(key => {
            if(key !== Static_Cache && key.includes('Static')){
                return caches.delete(key);
            }
        });
    });

    event.waitUntil(answer);
});

self.addEventListener('fetch', event => {
    const cacheOnly = caches.match(event.request).then(resp => {
        return resp ? resp : fetch(event.request).then(newResp => {
            return updateDynamicCache(Dynamic_Cache, event.request, newResp);
        });
    });
    event.respondWith(cacheOnly);
});
