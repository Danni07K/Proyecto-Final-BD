const CACHE_NAME = 'classcraft-v1.0.0'
const urlsToCache = [
  '/',
  '/dashboard',
  '/misiones',
  '/perfil/estudiante/tienda',
  '/globals.css',
  '/classcraft-logo.png',
  '/sounds/energia-maldita.mp3'
]

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto')
        return cache.addAll(urlsToCache)
      })
  )
})

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Interceptar requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devolver desde cache si está disponible
        if (response) {
          return response
        }
        
        // Si no está en cache, hacer fetch
        return fetch(event.request)
          .then((response) => {
            // Verificar si la respuesta es válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }
            
            // Clonar la respuesta
            const responseToCache = response.clone()
            
            // Agregar al cache
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })
            
            return response
          })
          .catch(() => {
            // Fallback para páginas offline
            if (event.request.destination === 'document') {
              return caches.match('/offline.html')
            }
          })
      })
  )
})

// Manejo de notificaciones push
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : '¡Nueva notificación de ClassCraft!',
    icon: '/classcraft-logo.png',
    badge: '/classcraft-logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver más',
        icon: '/classcraft-logo.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/classcraft-logo.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('ClassCraft', options)
  )
})

// Manejo de clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    )
  } else if (event.action === 'close') {
    // Solo cerrar la notificación
  } else {
    // Click en la notificación principal
    event.waitUntil(
      clients.openWindow('/dashboard')
    )
  }
})

// Sincronización en background
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Aquí iría la lógica de sincronización
      console.log('Sincronización en background')
    )
  }
}) 