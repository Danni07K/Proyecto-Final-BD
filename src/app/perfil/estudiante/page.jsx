'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const personajesJJK = [
  { nombre: 'Gojo', avatar: '/avatars/avatar-gojo.png', descripcion: 'El más fuerte de todos los hechiceros' },
  { nombre: 'Megumi', avatar: '/avatars/avatar-megumi.png', descripcion: 'Maestro de las sombras' },
  { nombre: 'Nobara', avatar: '/avatars/avatar-nobara.png', descripcion: 'Especialista en maldiciones' },
  { nombre: 'Itadori', avatar: '/avatars/avatar-itadori.png', descripcion: 'Portador de Sukuna' },
  { nombre: 'Yuta', avatar: '/avatars/avatar-yuta.png', descripcion: 'El sucesor de Gojo' },
]

export default function PerfilEstudiante() {
  const [user, setUser] = useState(null)
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }
        
        const payload = JSON.parse(atob(token.split('.')[1]))
        
        const res = await fetch(`/api/usuarios/${payload.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) {
          throw new Error('Error al cargar usuario')
        }
        
        const data = await res.json()
        setUser(data.usuario)
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

  const seleccionarPersonaje = async () => {
    if (!personajeSeleccionado) return
    
    setIsUpdating(true)
    setError(null)
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/usuarios/personaje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(personajeSeleccionado),
      })
      
      if (!res.ok) {
        throw new Error('Error al actualizar personaje')
      }
      
      const actualizado = await res.json()
      setUser(prev => ({ ...prev, personaje: actualizado.personaje }))
    } catch (err) {
      console.error('Error al seleccionar personaje:', err)
      setError('Error al seleccionar personaje')
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
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-yellow-500 border-b-transparent rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-white text-lg font-bold text-gradient">Cargando perfil...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-6 text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold text-gradient mb-4 drop-shadow-2xl">
          🎮 PERFIL DEL ESTUDIANTE 🎮
        </h1>
        <p className="text-xl text-purple-300">
          Bienvenido, {user?.nombre}
        </p>
        <p className="text-gray-400 mt-2">
          Desarrolla tu poder como hechicero
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        {/* Mostrar selector si no hay personaje */}
        {!user?.personaje ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-dark p-8 rounded-xl border border-purple-600 shadow-jjk-lg"
          >
            <h2 className="text-3xl font-bold text-gradient mb-6 text-center">
              🎭 Elige tu Personaje
            </h2>
            <p className="text-gray-300 text-center mb-8">
              Selecciona el personaje que representará tu poder como hechicero
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {personajesJJK.map((p, index) => (
                <motion.div
                  key={p.nombre}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPersonajeSeleccionado(p)}
                  className={`cursor-pointer p-6 rounded-xl border-2 transition-all hover-lift ${
                    personajeSeleccionado?.nombre === p.nombre
                      ? 'border-purple-500 bg-purple-900/30 shadow-purple-500/50'
                      : 'border-gray-700 hover:border-purple-600 bg-gray-800/50'
                  }`}
                >
                  <div className="relative mb-4">
                    <img src={p.avatar} alt={p.nombre} className="w-full h-32 object-contain" />
                    <div className="absolute -inset-2 bg-purple-500/20 rounded-lg blur-lg animate-pulse"></div>
                  </div>
                  <h3 className="text-center font-bold text-purple-300 text-lg mb-2">{p.nombre}</h3>
                  <p className="text-center text-gray-400 text-sm">{p.descripcion}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!personajeSeleccionado || isUpdating}
                onClick={seleccionarPersonaje}
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 px-8 py-4 rounded-lg text-white font-bold text-lg disabled:opacity-50 transition-all shadow-lg btn-jjk"
              >
                {isUpdating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Confirmando...
                  </span>
                ) : (
                  '⚡ Confirmar Personaje'
                )}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Información del Usuario */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 glass-dark p-8 rounded-xl border border-purple-600 shadow-jjk-lg"
            >
              <div className="flex items-center space-x-6 mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                  <img 
                    src={user.personaje.avatar} 
                    alt="Avatar" 
                    className="relative w-24 h-24 rounded-full border-4 border-purple-500"
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gradient">{user.nombre}</h2>
                  <p className="text-xl text-purple-300">{user.personaje.nombre}</p>
                  <p className="text-gray-400">Nivel {user.nivel} • {user.experiencia} XP</p>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-green-900/30 p-4 rounded-lg border border-green-500 text-center hover-lift"
                >
                  <p className="text-2xl font-bold text-green-400">{user.puntosPositivos || 0}</p>
                  <p className="text-sm text-gray-400">Puntos +</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-red-900/30 p-4 rounded-lg border border-red-500 text-center hover-lift"
                >
                  <p className="text-2xl font-bold text-red-400">{user.puntosNegativos || 0}</p>
                  <p className="text-sm text-gray-400">Puntos -</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-500 text-center hover-lift"
                >
                  <p className="text-2xl font-bold text-yellow-400">{user.puntosGold || 0}</p>
                  <p className="text-sm text-gray-400">GOLD</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-purple-900/30 p-4 rounded-lg border border-purple-500 text-center hover-lift"
                >
                  <p className="text-2xl font-bold text-purple-400">{user.monedas || 0}</p>
                  <p className="text-sm text-gray-400">Monedas</p>
                </motion.div>
              </div>

              {/* Barra de Experiencia */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Experiencia</span>
                  <span>{user.experiencia} / {user.nivel * 100} XP</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 relative overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-purple-500 to-purple-700 h-3 rounded-full relative overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((user.experiencia / (user.nivel * 100)) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Accesorios Comprados */}
              {user.accesoriosComprados && user.accesoriosComprados.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-purple-400 mb-3">🎭 Accesorios Adquiridos</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.accesoriosComprados.map((accesorio, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500"
                      >
                        {accesorio}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Panel de Acciones */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
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
                    <p className="text-lg font-bold text-yellow-400">{user.monedas || 0}</p>
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
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

