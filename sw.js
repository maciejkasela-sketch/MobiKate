const CACHE='kasia-v2';
const CORE=['./','index.html','manifest.webmanifest','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png','fonts/instrument-serif-latin-400-normal.woff2','fonts/instrument-serif-latin-ext-400-normal.woff2','fonts/instrument-serif-latin-400-italic.woff2','fonts/instrument-serif-latin-ext-400-italic.woff2','fonts/manrope-latin-wght-normal.woff2','fonts/manrope-latin-ext-wght-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const put=res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));}return res;};
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(put).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
  }else{
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(put)));
  }
});
