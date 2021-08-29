const nombreCache = 'apv-v3';
const offlinePage = '/error.html';
const archivos = [
    '/',
    '/index.html',
    '/error.html',
    '/css/bootstrap.css',
    '/css/styles.css',
    '/js/app.js',
    '/js/apv.js',
    '/manifest.json',
];

self.addEventListener('install', e =>{
    console.log('Instalando el service worker');

    e.waitUntil(
        caches.open(nombreCache)
            .then(cache =>{
                console.log('cacheando');
                cache.addAll(archivos)
            })
    )
});


//Activar el service worker

self.addEventListener('activate', e=>{
    console.log('Service worker activado');
    
    e.waitUntil(
        caches.keys()
            .then(keys =>{
                return Promise.all( 
                    keys.filter(key => key !== nombreCache)
                        .map(key => caches.delete(key)) //Borra los keys anteriores
                )
            })
    )
});

//Evento fetch para descargar archviso estaticos
self.addEventListener('fetch', e =>{
    e.respondWith(
        caches.match(e.request)
        .then(cacheResponse => (cacheResponse ? cacheResponse : caches.match(offlinePage)))
    )
})