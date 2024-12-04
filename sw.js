let CACHE_STATIC = 'static-v1';
const CACHE_DYNAMIC = 'dynamic-v1';
const CACHE_INMUTABLE = 'inmutable-v1';



//APP_SHELL => all that is needed for the application in order to work(need for quick loading)
const APP_SHELL = [
    'index.html',
    'css/style.css',
    'css/animate.css',
    'img/favicon.ico',
    'img/avatars/batgirl.jpg',
    'img/avatars/batman.jpg',
    'img/avatars/captain-america.jpg',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/superman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolwerine.jpg',
    'img/avatars/wonder-woman.jpg',
    'js/app.js',
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    '/css/animate.css',
    '/js/libs/jquery.js',
];



//SW INSTALLATION
self.addEventListener('install', event => {
    //open cache
    const cacheStatic = caches.open(CACHE_STATIC)
                        .then( cache => cache.addAll(APP_SHELL));


    const cacheInmutable = caches.open(CACHE_INMUTABLE)
                        .then( cache => cache.addAll(APP_SHELL_INMUTABLE));


    //wait until the promise is resolved in full
    event.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});


//to delete old cache versions when the new service worker is activated
self.addEventListener('activate', event => {
    // check if another cache type exists with the name static
   const deleteOldCache = caches.keys().then( keys => {
       keys.forEach( key => {
           if( key !== CACHE_STATIC && key.includes('static')){
               return caches.delete(key);
           }
       });
   });
   event.waitUntil(deleteOldCache);
})



