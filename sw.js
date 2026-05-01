const CACHE_NAME = 'gold-system-v1';
// قائمة الملفات التي سيتم حفظها في ذاكرة الهاتف لتعمل بدون نت
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// مرحلة التثبيت: حفظ الملفات في الكاش
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('تم حفظ ملفات النظام للعمل أوفلاين');
      return cache.addAll(assets);
    })
  );
});

// مرحلة التشغيل: جلب الملفات من الكاش حتى لو انقطع الإنترنت
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
