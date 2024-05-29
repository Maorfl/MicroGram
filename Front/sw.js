self.addEventListener('install', (event) => {
    const urlsToCache = [
        "index.html",
        "manifest.json",
        "sw.js",
        "src/main.tsx",
        "public/microgram1.jpg",
        "public/microgram2.jpg"
    ];

    event.waitUntil(
        caches.open()
    )
})

self.addEventListener('fetch', (event) => {
    caches.match(event.request).then((response) => {
        const res = response

        if (!res) {
            console.log(event.request.url, "Not found in cache");
            res = fetch(event.request)
        } else console.log(event.request.url, "Found in cache");

        return res
    })
})