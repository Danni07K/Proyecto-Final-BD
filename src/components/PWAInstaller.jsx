'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

// Componente de instalación PWA
function PWAInstallPrompt({ onInstall, onDismiss }) {
  const [isVisible, setIsVisible] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsVisible(true)
    }

    // Escuchar el evento appinstalled
    const handleAppInstalled = () => {
      setIsVisible(false)
      setDeferredPrompt(null)
      toast.success('🎉 ¡ClassCraft ha sido instalado!')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        onInstall()
      }
      
      setDeferredPrompt(null)
      setIsVisible(false)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss()
  }

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-4 left-4 right-4 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-4 shadow-2xl border border-purple-400 z-50"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">📱</div>
          <div>
            <h3 className="text-white font-bold">Instalar ClassCraft</h3>
            <p className="text-purple-200 text-sm">Accede desde tu pantalla de inicio</p>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleInstall}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold transition-all"
          >
            Instalar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDismiss}
            className="text-white hover:text-purple-200 transition-colors"
          >
            ✕
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// Componente de notificaciones push
function PushNotificationManager({ onPermissionGranted, onPermissionDenied }) {
  const [permission, setPermission] = useState('default')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Verificar si las notificaciones push están soportadas
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      
      if (result === 'granted') {
        onPermissionGranted()
        toast.success('🔔 Notificaciones activadas')
      } else {
        onPermissionDenied()
        toast.error('🔕 Notificaciones desactivadas')
      }
    } catch (error) {
      console.error('Error al solicitar permisos:', error)
      toast.error('Error al activar notificaciones')
    }
  }

  const sendTestNotification = async () => {
    if (permission === 'granted') {
      try {
        const notification = new Notification('ClassCraft', {
          body: '¡Bienvenido de vuelta, hechicero!',
          icon: '/classcraft-logo.png',
          badge: '/classcraft-logo.png',
          tag: 'welcome',
          requireInteraction: false,
          actions: [
            {
              action: 'open',
              title: 'Abrir App'
            },
            {
              action: 'dismiss',
              title: 'Cerrar'
            }
          ]
        })

        notification.onclick = () => {
          window.focus()
          notification.close()
        }

        notification.onaction = (event) => {
          if (event.action === 'open') {
            window.focus()
          }
          notification.close()
        }
      } catch (error) {
        console.error('Error al enviar notificación:', error)
      }
    }
  }

  if (!isSupported) {
    return (
      <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">⚠️</div>
          <div>
            <h3 className="text-red-400 font-bold">Notificaciones no soportadas</h3>
            <p className="text-red-300 text-sm">Tu navegador no soporta notificaciones push</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-600 shadow-2xl">
      <h3 className="text-xl font-bold text-purple-400 mb-4">🔔 Notificaciones Push</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-semibold">Estado de Permisos</div>
            <div className={`text-sm ${
              permission === 'granted' ? 'text-green-400' : 
              permission === 'denied' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {permission === 'granted' ? '✅ Permitido' : 
               permission === 'denied' ? '❌ Denegado' : '⏳ Pendiente'}
            </div>
          </div>
          <div className="text-2xl">
            {permission === 'granted' ? '🔔' : 
             permission === 'denied' ? '🔕' : '⏳'}
          </div>
        </div>

        {permission === 'default' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={requestPermission}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold transition-all"
          >
            🔔 Activar Notificaciones
          </motion.button>
        )}

        {permission === 'granted' && (
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendTestNotification}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-all"
            >
              📤 Enviar Notificación de Prueba
            </motion.button>
            
            <div className="bg-green-900/30 border border-green-500 rounded-lg p-3">
              <div className="text-sm text-green-300">
                <strong>Notificaciones activas:</strong>
                <ul className="mt-2 space-y-1">
                  <li>• Nuevas misiones disponibles</li>
                  <li>• Logros desbloqueados</li>
                  <li>• Eventos especiales</li>
                  <li>• Recordatorios diarios</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {permission === 'denied' && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-3">
            <div className="text-sm text-red-300">
              <strong>Para activar notificaciones:</strong>
              <ol className="mt-2 space-y-1 list-decimal list-inside">
                <li>Ve a Configuración del navegador</li>
                <li>Busca "Notificaciones"</li>
                <li>Permite notificaciones para ClassCraft</li>
                <li>Recarga la página</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente de estado offline
function OfflineStatus({ isOnline }) {
  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 bg-red-600 text-white p-3 text-center font-bold z-50"
        >
          📡 Modo Offline - Algunas funciones pueden no estar disponibles
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Componente de sincronización
function SyncManager({ onSyncComplete, onSyncError }) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState(null)

  useEffect(() => {
    // Cargar última sincronización desde localStorage
    const saved = localStorage.getItem('lastSync')
    if (saved) {
      setLastSync(new Date(saved))
    }
  }, [])

  const performSync = async () => {
    setIsSyncing(true)
    try {
      // Simular sincronización
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const now = new Date()
      setLastSync(now)
      localStorage.setItem('lastSync', now.toISOString())
      
      onSyncComplete()
      toast.success('🔄 Datos sincronizados correctamente')
    } catch (error) {
      onSyncError(error)
      toast.error('❌ Error al sincronizar datos')
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-600 shadow-2xl">
      <h3 className="text-xl font-bold text-purple-400 mb-4">🔄 Sincronización</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-semibold">Última Sincronización</div>
            <div className="text-sm text-gray-400">
              {lastSync ? lastSync.toLocaleString() : 'Nunca'}
            </div>
          </div>
          <div className="text-2xl">
            {isSyncing ? '🔄' : '✅'}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={performSync}
          disabled={isSyncing}
          className={`w-full py-3 rounded-lg font-bold transition-all ${
            isSyncing
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          } text-white`}
        >
          {isSyncing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sincronizando...
            </div>
          ) : (
            '🔄 Sincronizar Ahora'
          )}
        </motion.button>

        <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-3">
          <div className="text-sm text-blue-300">
            <strong>Datos sincronizados:</strong>
            <ul className="mt-2 space-y-1">
              <li>• Progreso de misiones</li>
              <li>• Experiencia y nivel</li>
              <li>• Accesorios comprados</li>
              <li>• Logros desbloqueados</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente principal del instalador PWA
export default function PWAInstaller({ user }) {
  const [isOnline, setIsOnline] = useState(true)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    // Verificar estado de conexión
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    setIsOnline(navigator.onLine)

    // Verificar si la app está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstall = () => {
    setIsInstalled(true)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
  }

  const handlePermissionGranted = () => {
    // Configurar service worker para notificaciones
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registrado:', registration)
        })
        .catch(error => {
          console.error('Error al registrar Service Worker:', error)
        })
    }
  }

  const handlePermissionDenied = () => {
    console.log('Permisos de notificación denegados')
  }

  const handleSyncComplete = () => {
    console.log('Sincronización completada')
  }

  const handleSyncError = (error) => {
    console.error('Error de sincronización:', error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-6 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold text-gradient mb-4 drop-shadow-2xl">
            📱 ClassCraft PWA
          </h1>
          <p className="text-xl text-purple-300">
            Instala ClassCraft como una aplicación nativa
          </p>
        </motion.div>

        {/* Estado de conexión */}
        <OfflineStatus isOnline={isOnline} />

        {/* Características PWA */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-purple-600 shadow-2xl">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold text-purple-400 mb-2">Instalación Nativa</h3>
            <p className="text-gray-300 text-sm">
              Instala ClassCraft en tu dispositivo como una aplicación nativa
            </p>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-purple-600 shadow-2xl">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-xl font-bold text-purple-400 mb-2">Notificaciones Push</h3>
            <p className="text-gray-300 text-sm">
              Recibe notificaciones en tiempo real sobre eventos y misiones
            </p>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-purple-600 shadow-2xl">
            <div className="text-4xl mb-4">📡</div>
            <h3 className="text-xl font-bold text-purple-400 mb-2">Modo Offline</h3>
            <p className="text-gray-300 text-sm">
              Accede a contenido básico incluso sin conexión a internet
            </p>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-purple-600 shadow-2xl">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-xl font-bold text-purple-400 mb-2">Sincronización</h3>
            <p className="text-gray-300 text-sm">
              Tus datos se sincronizan automáticamente entre dispositivos
            </p>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-purple-600 shadow-2xl">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-purple-400 mb-2">Rendimiento</h3>
            <p className="text-gray-300 text-sm">
              Carga más rápida y mejor rendimiento que la versión web
            </p>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-purple-600 shadow-2xl">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-purple-400 mb-2">Seguridad</h3>
            <p className="text-gray-300 text-sm">
              Conexión HTTPS y datos cifrados para máxima seguridad
            </p>
          </div>
        </motion.div>

        {/* Componentes de funcionalidad */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <PushNotificationManager
            onPermissionGranted={handlePermissionGranted}
            onPermissionDenied={handlePermissionDenied}
          />
          
          <SyncManager
            onSyncComplete={handleSyncComplete}
            onSyncError={handleSyncError}
          />
        </motion.div>

        {/* Estado de instalación */}
        {isInstalled && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-green-900/30 border border-green-500 rounded-xl p-6 text-center"
          >
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-green-400 mb-2">
              ¡ClassCraft está instalado!
            </h3>
            <p className="text-green-300">
              Puedes acceder a la aplicación desde tu pantalla de inicio
            </p>
          </motion.div>
        )}

        {/* Instrucciones de instalación */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-600"
        >
          <h3 className="text-xl font-bold text-purple-400 mb-4">📋 Instrucciones de Instalación</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-white mb-2">📱 Android (Chrome)</h4>
              <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                <li>Abre ClassCraft en Chrome</li>
                <li>Toca el menú (⋮) en la esquina superior</li>
                <li>Selecciona "Instalar aplicación"</li>
                <li>Confirma la instalación</li>
              </ol>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">🍎 iOS (Safari)</h4>
              <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                <li>Abre ClassCraft en Safari</li>
                <li>Toca el botón compartir (□↑)</li>
                <li>Selecciona "Añadir a pantalla de inicio"</li>
                <li>Confirma la instalación</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Prompt de instalación */}
      <PWAInstallPrompt
        onInstall={handleInstall}
        onDismiss={handleDismiss}
      />
    </div>
  )
} 