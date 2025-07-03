'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { jwtDecode } from 'jwt-decode'
import CharacterViewer3D from '@/components/CharacterViewer3D'

const personajesJJK = [
  { id: 'gojo', nombre: 'Satoru Gojo', avatar: '/avatars/avatar-gojo.png', descripcion: 'El más fuerte de todos los hechiceros', auraColor: '#3b82f6', sketchfab: 'https://sketchfab.com/models/1cf90882c2e64074ab62d766ad77d6c4/embed', sketchfabPerfil: 'https://sketchfab.com/models/efdf29937c5b4c9086b7c9bbf5a58976/embed' },
  { id: 'yuji', nombre: 'Yuji Itadori', avatar: '/avatars/avatar-itadori.png', descripcion: 'Estudiante con potencial excepcional', auraColor: '#ef4444', sketchfab: 'https://sketchfab.com/models/8ae59b5a207041999f30b54813d19106/embed', sketchfabPerfil: 'https://sketchfab.com/models/dc1bba29ad134f6a8ffe5a7e1c2a92b8/embed' },
  { id: 'megumi', nombre: 'Megumi Fushiguro', avatar: '/avatars/avatar-megumi.png', descripcion: 'Maestro de las sombras', auraColor: '#1f2937', sketchfab: 'https://sketchfab.com/models/b4073ce4c95c4e46abf3825a0207eaf8/embed', sketchfabPerfil: 'https://sketchfab.com/models/cffc0f3efa364a5ba114bfbbb7e2ec9c/embed' },
  { id: 'nobara', nombre: 'Nobara Kugisaki', avatar: '/avatars/avatar-nobara.png', descripcion: 'Especialista en maldiciones', auraColor: '#ec4899', sketchfab: 'https://sketchfab.com/models/d9ceed236ec1482cabdf293bb1aae573/embed' },
  { id: 'yuta', nombre: 'Yuta Okkotsu', avatar: '/avatars/avatar-yuta.png', descripcion: 'El sucesor de Gojo', auraColor: '#10b981', sketchfab: 'https://sketchfab.com/models/24f9ddc6d6124095a7989188ac28254f/embed' },
  { id: 'geto', nombre: 'Suguru Geto', avatar: '/avatars/avatar-guardian.png', descripcion: 'Maestro de las técnicas de maldición y control de espíritus.', auraColor: '#8b5cf6', sketchfab: 'https://sketchfab.com/models/b8109dde1ac04b87b76eaa984a60cafc/embed' },
]

export default function PerfilEstudiante() {
  const [user, setUser] = useState(null)
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState(null)
  const [equippedAccessories, setEquippedAccessories] = useState([])
  const router = useRouter()

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }
        
        const payload = jwtDecode(token)
        
        const res = await fetch(`/api/usuarios/${payload.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) {
          throw new Error('Error al cargar usuario')
        }
        
        const data = await res.json()
        setUser(data.usuario)
        
        // Configurar personaje seleccionado
        if (data.usuario.personaje) {
          const personajeEncontrado = personajesJJK.find(p => p.nombre === data.usuario.personaje.nombre)
          if (personajeEncontrado) {
            setPersonajeSeleccionado(personajeEncontrado)
          }
        }
        
        // Cargar accesorios equipados (simulado por ahora)
        setEquippedAccessories([
          {
            id: '1',
            nombre: 'Espada Maldita',
            descripcion: 'Espada forjada con energía maldita',
            precio: 1500,
            rareza: 'legendario',
            tipo: 'arma',
            stats: { ataque: 50, defensa: 10 }
          },
          {
            id: '2',
            nombre: 'Amuleto de Protección',
            descripcion: 'Protege contra maldiciones menores',
            precio: 800,
            rareza: 'epico',
            tipo: 'accesorio',
            stats: { defensa: 30, resistencia: 20 }
          }
        ])
      } catch (err) {
        console.error('Error al cargar usuario:', err)
        setError('Error al cargar el perfil')
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }
    
    cargarUsuario()
  }, [router])

  const actualizarPersonaje = async () => {
    if (!personajeSeleccionado) return
    
    setIsUpdating(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/usuarios/personaje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: personajeSeleccionado.nombre,
          avatar: personajeSeleccionado.avatar
        })
      })

      if (res.ok) {
        // Actualizar usuario local
        setUser(prev => ({
          ...prev,
          personaje: {
            nombre: personajeSeleccionado.nombre,
            avatar: personajeSeleccionado.avatar
          }
        }))
      }
    } catch (error) {
      console.error('Error al actualizar personaje:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-yellow-500 border-b-transparent rounded-full animate-spin mx-auto" 
                 style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <motion.p 
            className="text-white text-xl font-bold text-gradient"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Cargando Perfil...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-white text-lg font-bold text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 btn-jjk"
          >
            Volver al Login
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white relative overflow-hidden">
      {/* Partículas de energía maldita */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 mb-4 drop-shadow-2xl">
              👤 PERFIL DEL HECHICERO
            </h1>
            <p className="text-xl text-purple-300 max-w-3xl mx-auto">
              Gestiona tu personaje, equipa accesorios y domina las técnicas de la energía maldita
            </p>
          </motion.div>

          {/* Información del usuario */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
          >
            {/* Tarjeta de información */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-dark p-6 rounded-xl border border-purple-500 shadow-jjk-lg hover:shadow-purple-500/20 transition-all"
            >
              <div className="text-center mb-6">
                <img
                  src={user?.personaje?.avatar || '/avatars/avatar-gojo.png'}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-4 border-purple-500 mx-auto mb-4 shadow-lg"
                />
                <h2 className="text-2xl font-bold text-purple-400">{user?.nombre}</h2>
                <p className="text-gray-400">{user?.email}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Nivel:</span>
                  <span className="text-yellow-400 font-bold text-xl">{user?.nivel || 1}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Experiencia:</span>
                  <span className="text-green-400 font-bold">{user?.experiencia || 0} XP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Monedas:</span>
                  <span className="text-yellow-400 font-bold">{user?.monedas || 100} 💰</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Puntos Positivos:</span>
                  <span className="text-green-400 font-bold">{user?.puntosPositivos || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Puntos Negativos:</span>
                  <span className="text-red-400 font-bold">{user?.puntosNegativos || 0}</span>
                </div>
              </div>
            </motion.div>

            {/* Visor de personaje 3D */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="glass-dark p-6 rounded-xl border border-purple-500 shadow-jjk-lg">
                <h3 className="text-2xl font-bold text-purple-400 mb-4 text-center">
                  🎭 Tu Personaje
                </h3>
                {personajeSeleccionado ? (
                  <iframe
                    title={personajeSeleccionado.nombre}
                    src={
                      (personajeSeleccionado.sketchfabPerfil || personajeSeleccionado.sketchfab) +
                      ((personajeSeleccionado.sketchfabPerfil || personajeSeleccionado.sketchfab).includes('?') ? '&' : '?') +
                      'autostart=1&ui_infos=0&ui_controls=0&ui_watermark=0'
                    }
                    frameBorder="0"
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    mozallowfullscreen="true"
                    webkitallowfullscreen="true"
                    allowFullScreen
                    style={{ width: '100%', height: '500px', border: 'none', borderRadius: '16px', background: 'transparent' }}
                  ></iframe>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">No has seleccionado un personaje aún</p>
                    <button
                      onClick={() => router.push('/escoger-personaje')}
                      className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 btn-jjk"
                    >
                      🎭 Seleccionar Personaje
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Acciones rápidas */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {/* Tienda */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/perfil/estudiante/tienda')}
              className="glass-dark p-6 rounded-xl border border-purple-600 shadow-jjk-lg hover:shadow-purple-500/20 transition-all cursor-pointer hover-lift"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🛍️</div>
                <h3 className="text-xl font-bold text-purple-400 mb-2">Tienda de Accesorios</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Compra accesorios únicos con tus monedas
                </p>
                <div className="bg-yellow-900/30 p-3 rounded-lg border border-yellow-500">
                  <p className="text-lg font-bold text-yellow-400">{user?.monedas || 0}</p>
                  <p className="text-xs text-gray-400">Monedas disponibles</p>
                </div>
              </div>
            </motion.div>

            {/* Ranking */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/ranking')}
              className="glass-dark p-6 rounded-xl border border-purple-600 shadow-jjk-lg hover:shadow-purple-500/20 transition-all cursor-pointer hover-lift"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-purple-400 mb-2">Ranking</h3>
                <p className="text-gray-300 text-sm">
                  Compite con otros hechiceros
                </p>
              </div>
            </motion.div>

            {/* Misiones */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/misiones')}
              className="glass-dark p-6 rounded-xl border border-purple-600 shadow-jjk-lg hover:shadow-purple-500/20 transition-all cursor-pointer hover-lift"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">⚔️</div>
                <h3 className="text-xl font-bold text-purple-400 mb-2">Misiones</h3>
                <p className="text-gray-300 text-sm">
                  Completa misiones para ganar experiencia
                </p>
              </div>
            </motion.div>

            {/* Unirse a Clase */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/perfil/estudiante/unirse-clase')}
              className="glass-dark p-6 rounded-xl border border-purple-600 shadow-jjk-lg hover:shadow-purple-500/20 transition-all cursor-pointer hover-lift"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🏫</div>
                <h3 className="text-xl font-bold text-purple-400 mb-2">Unirse a Clase</h3>
                <p className="text-gray-300 text-sm">
                  Únete a una clase con código
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

