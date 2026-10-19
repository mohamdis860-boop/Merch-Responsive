/* ==================== Service Worker ==================== */

const CACHE_VERSION = 'v2.0.0';
const CACHE_NAME = `merch-${CACHE_VERSION}`;
const BASE_PATH = '/Merch';

console.log('🔧 SW Base:', BASE_PATH);

const STATIC_ASSETS = [
    // Root
    `${BASE_PATH}/`,
    `${BASE_PATH}/index.html`,
    `${BASE_PATH}/404.html`,
    `${BASE_PATH}/offline.html`,
    `${BASE_PATH}/manifest.json`,

    // CSS
    `${BASE_PATH}/shared/navbar.css`,
    `${BASE_PATH}/shared/toast.css`,
    `${BASE_PATH}/shared/footer.css`,
    `${BASE_PATH}/shared/theme.css`,
    `${BASE_PATH}/shared/compare-bar.css`,
    `${BASE_PATH}/shared/skeleton.css`,
    `${BASE_PATH}/shared/scroll-fix.css`,

    // JS
    `${BASE_PATH}/shared/config.js`,
    `${BASE_PATH}/shared/cart.js`,
    `${BASE_PATH}/shared/toast.js`,
    `${BASE_PATH}/shared/compare.js`,
    `${BASE_PATH}/shared/compare-bar.js`,
    `${BASE_PATH}/shared/navbar.js`,
    `${BASE_PATH}/shared/footer.js`,
    `${BASE_PATH}/shared/theme.js`,

    // Pages
    `${BASE_PATH}/Pages/products.html`,
    `${BASE_PATH}/Pages/product-details.html`,
    `${BASE_PATH}/Pages/categories.html`,
    `${BASE_PATH}/Pages/about.html`,
    `${BASE_PATH}/Pages/contact.html`,
    `${BASE_PATH}/Pages/wishlist.html`,
    `${BASE_PATH}/Pages/cart.html`,
    `${BASE_PATH}/Pages/order-tracking.html`,
    `${BASE_PATH}/Pages/compare.html`,
    `${BASE_PATH}/Pages/search-results.html`,
    `${BASE_PATH}/Pages/category-products.html`,
    `${BASE_PATH}/Pages/checkout.html`,

    // Auth
    `${BASE_PATH}/Auth/login.html`,
    `${BASE_PATH}/Auth/register.html`,
    `${BASE_PATH}/Auth/profile.html`,
    `${BASE_PATH}/Auth/forgot-password.html`,
    `${BASE_PATH}/Auth/reset-password.html`,

    // Support
    `${BASE_PATH}/Support/faq.html`,
    `${BASE_PATH}/Support/privacy.html`,
    `${BASE_PATH}/Support/terms.html`,

    // Icons
    `${BASE_PATH}/favicon.ico`,
    `${BASE_PATH}/favicon.svg`,
    `${BASE_PATH}/icons/apple-touch-icon.png`,
    `${BASE_PATH}/icons/favicon-96x96.png`,
    `${BASE_PATH}/icons/web-app-manifest-192x192.png`,
    `${BASE_PATH}/icons/web-app-manifest-512x512.png`
];

// ===== Install =====
self.addEventListener('install', (event) => {
    console.log('📦 SW: Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            const promises = STATIC_ASSETS.map((url) => {
                return cache.add(url).catch((err) => {
                    console.warn(`⚠️ Failed: ${url}`);
                    return null;
                });
            });

            return Promise.all(promises).then((results) => {
                const success = results.filter(r => r !== null).length;
                console.log(`✅ Cached: ${success}/${results.length}`);
            });
        }).then(() => {
            console.log('✅ SW: Installed');
            return self.skipWaiting();
        })
    );
});

// ===== Activate =====
self.addEventListener('activate', (event) => {
    console.log('🔄 SW: Activating...');

    event.waitUntil(
        caches.keys()
            .then((names) => {
                return Promise.all(
                    names
                        .filter((name) => name.startsWith('merch-') && name !== CACHE_NAME)
                        .map((name) => {
                            console.log('🗑️ Deleting:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                console.log('✅ SW: Activated');
                return self.clients.claim();
            })
    );
});

// ===== Fetch =====
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== 'GET') return;
    if (url.hostname.includes('supabase')) return;
    if (url.protocol === 'chrome-extension:') return;

    // CDN: Cache-First
    if (url.hostname.includes('cdnjs.cloudflare.com') ||
        url.hostname.includes('fonts.googleapis.com') ||
        url.hostname.includes('fonts.gstatic.com') ||
        url.hostname.includes('unpkg.com') ||
        url.hostname.includes('jsdelivr.net')) {

        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;

                return fetch(request).then((response) => {
                    if (response && response.status === 200) {
                        const cloned = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, cloned);
                        });
                    }
                    return response;
                }).catch(() => null);
            })
        );
        return;
    }

    // Local: Network-First
    event.respondWith(
        fetch(request)
            .then((response) => {
                if (response && response.status === 200 && response.type === 'basic') {
                    const cloned = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, cloned);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(request).then((cached) => {
                    if (cached) return cached;

                    if (request.headers.get('accept')?.includes('text/html')) {
                        return caches.match(`${BASE_PATH}/offline.html`);
                    }
                });
            })
    );
});

// ===== Message =====
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

console.log('✅ SW loaded:', CACHE_VERSION);