// ==================== Service Worker معدل للعمل مع شاشة الدخول ====================
const CACHE_NAME = 'muhasaba-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './icon.png'
];

// تثبيت الـ Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .catch(err => console.log('Cache install error:', err))
    );
    self.skipWaiting();
});

// استقبال الطلبات
self.addEventListener('fetch', event => {
    // تجاهل طلبات الخطوط الخارجية (Google Fonts) - هذا هو الحل لمشكلتك!
    if (event.request.url.includes('fonts.googleapis') || 
        event.request.url.includes('fonts.gstatic') ||
        event.request.url.includes('cdnjs.cloudflare.com')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // إذا وجد في الكاش، أرجعه
                if (response) {
                    return response;
                }
                // وإلا، حاول تجلبه من الشبكة
                return fetch(event.request).catch(() => {
                    // عند فشل الشبكة، أعد الصفحة الرئيسية
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                    return null;
                });
            })
    );
});

// تنظيف الكاش القديم
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});