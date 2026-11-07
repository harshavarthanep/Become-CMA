/* Rank Rank service worker — offline shell, cached pdf.js, study notifications */
const V = 'rr-2026-11-08';
const SHELL = ['./', './index.html', './styles.css', './app.js', './data/bank.js', './data/cheat.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './icons/badge-96.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.pathname.includes('/pdfs/')) return;
  if (u.origin === location.origin) {
    e.respondWith(fetch(e.request).then(r => { if (r.ok) { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); } return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
  } else if (u.hostname === 'cdnjs.cloudflare.com') {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(n => { if (n.ok) { const c = n.clone(); caches.open(V).then(x => x.put(e.request, c)); } return n; })));
  }
});
/* Notifications: the app mirrors a small summary into IndexedDB; periodic sync (installed PWA on Android/desktop Chrome) checks it. */
const idb = (store, key, val) => new Promise(res => { const r = indexedDB.open('rankrank', 1); r.onupgradeneeded = () => { ['files', 'meta'].forEach(s => r.result.objectStoreNames.contains(s) || r.result.createObjectStore(s)); }; r.onerror = () => res(null); r.onsuccess = () => { try { const t = r.result.transaction(store, val === undefined ? 'readonly' : 'readwrite'); const os = t.objectStore(store); const q = val === undefined ? os.get(key) : os.put(val, key); q.onsuccess = () => res(val === undefined ? q.result : true); q.onerror = () => res(null); } catch (e) { res(null); } }; });
const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
async function nudge() {
  const s = await idb('meta', 'state'); if (!s || !s.notify) return;
  const now = new Date(); const opts = { icon: 'icons/icon-192.png', badge: 'icons/badge-96.png' };
  const due = (s.topic || []).find(t => t.at <= now.getTime() && !t.sent);
  if (due) { due.sent = 1; await idb('meta', 'state', s); return self.registration.showNotification('Time to study: ' + due.title, { ...opts, body: 'You planned this. 25 focused minutes — let’s go.', tag: 'rr-topic', data: { url: due.url } }); }
  const [hh, mm] = (s.remind || '07:00').split(':').map(Number); const at = new Date(); at.setHours(hh, mm, 0, 0);
  if (now < at || (s.today === today() && s.practised) || s.last === today()) return;
  const m = (s.msgs && s.msgs.length) ? s.msgs[Math.floor(Math.random() * s.msgs.length)] : ['Time to practise', 'Close your rings today.', '#today'];
  s.last = today(); await idb('meta', 'state', s);
  return self.registration.showNotification(m[0], { ...opts, body: m[1], tag: 'rr-daily', data: { url: self.registration.scope + 'index.html' + m[2] } });
}
self.addEventListener('periodicsync', e => { if (e.tag === 'rr-daily') e.waitUntil(nudge()); });
self.addEventListener('notificationclick', e => {
  e.notification.close(); const url = (e.notification.data && e.notification.data.url) || self.registration.scope;
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => { const c = cs.find(x => x.url.startsWith(self.registration.scope)); if (c) { c.postMessage({ url }); return c.focus(); } return clients.openWindow(url); }));
});
