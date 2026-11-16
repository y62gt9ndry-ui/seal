// 小秘書離線支援：先走網路拿最新版，沒網路才用上次存下來的。
const CACHE = 'secretary-shell-v1';

self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // 只處理這個資料夾底下自己的檔案；天氣等外部請求不經手
  if (url.origin !== self.location.origin || !url.pathname.startsWith(new URL('./', self.location).pathname)) return;
  e.respondWith(
    fetch(req).then((res) => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match(new URL('./index.html', self.location).href)))
  );
});
