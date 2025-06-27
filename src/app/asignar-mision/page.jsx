'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function AsignarMision() {
  const [usuarios, setUsuarios] = useState([])
  const [misiones, setMisiones] = useState([])
  const [clases, setClases] = useState([])
  const [usuarioId, setUsuarioId] = useState('')
  const [misionId, setMisionId] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [particles, setParticles] = useState([])
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nombre: '', clase: '' })

  // Generate cursed energy particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
        opacity: Math.random() * 0.6 + 0.2
      }))
      setParticles(newParticles)
    }

    if (typeof window !== 'undefined') {
      generateParticles()
      
      // Handle window resize
      const handleResize = () => generateParticles()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setIsLoading(true)
      const [usuariosRes, misionesRes, clasesRes] = await Promise.all([
        fetch('/api/usuarios'),
        fetch('/api/misiones'),
        fetch('/api/clases'),
      ])
      
      if (!usuariosRes.ok || !misionesRes.ok || !clasesRes.ok) {
        throw new Error('Error al cargar datos')
      }
      
      const [usuariosData, misionesData, clasesData] = await Promise.all([
        usuariosRes.json(),
        misionesRes.json(),
        clasesRes.json()
      ])
      
      setUsuarios(usuariosData)
      setMisiones(misionesData)
      setClases(clasesData)
    } catch (error) {
      toast.error('Error al cargar los datos')
    } finally {
      setIsLoading(false)
    }
  }

  const asignarMision = async (e) => {
    e.preventDefault()
    
    if (!usuarioId || !misionId) {
      toast.error('Por favor selecciona un usuario y una misión')
      return
    }

    const toastId = toast.loading('Asignando misión...')
    
    try {
      const res = await fetch('/api/asignar-mision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId, misionId }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(`❌ ${data.error}`, { id: toastId })
        return
      }

      let mensaje = '✅ Misión completada exitosamente.'
      if (data.subioNivel) {
        mensaje += ` 🎉 Nivel +1 (${data.nuevoNivel})`
      }

      toast.success(mensaje, { id: toastId })
      setMensaje(mensaje)
      setUsuarioId('')
      setMisionId('')

      // Reload updated data
      const actualizados = await fetch('/api/usuarios').then((r) => r.json())
      setUsuarios(actualizados)
      
      // Efecto de sonido
      if (audioEnabled) {
        try {
          const audio = new Audio('/sounds/energia-maldita.mp3')
          audio.volume = 0.3
          audio.play().catch(() => {})
        } catch (error) {
          console.log('Audio no disponible')
        }
      }

    } catch (err) {
      toast.error('⚠️ Error inesperado', { id: toastId })
    }
  }

  const crearUsuario = async (e) => {
    e.preventDefault()
    
    if (!form.nombre.trim() || !form.clase) {
      toast.error('Por favor completa todos los campos')
      return
    }

    const toastId = toast.loading('Creando usuario...')
    
    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error('❌ Error al crear usuario', { id: toastId })
        return
      }

      toast.success(`✅ Usuario creado: ${data.nombre}`, { id: toastId })
      setForm({ nombre: '', clase: '' })
      setShowForm(false)
      
      const usuariosActualizados = await fetch('/api/usuarios').then((r) => r.json())
      setUsuarios(usuariosActualizados)
      
      // Efecto de sonido
      if (audioEnabled) {
        try {
          const audio = new Audio('/sounds/energia-maldita.mp3')
          audio.volume = 0.3
          audio.play().catch(() => {})
        } catch (error) {
          console.log('Audio no disponible')
        }
      }
    } catch (error) {
      toast.error('❌ Error al crear usuario', { id: toastId })
    }
  }

  const habilitarAudio = () => {
    setAudioEnabled(true)
    const audio = new Audio()
    audio.play().then(() => {
      toast.success('🔊 Audio habilitado')
    }).catch(() => {
      toast.error('❌ No se pudo habilitar el audio')
    })
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
            Cargando Sistema de Misiones...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white relative overflow-hidden particles-bg">
      {/* Enhanced Cursed Energy Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="energy-particle"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity
            }}
            animate={{
              y: [0, -40, -80, -40, 0],
              x: [0, 20, -8, -25, 0],
              opacity: [particle.opacity, 1, 0.8, 0.95, particle.opacity],
              scale: [1, 1.2, 0.9, 1.1, 1],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Épico */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 mb-4 drop-shadow-2xl">
              🎯 SISTEMA DE MISIONES
            </h1>
            <p className="text-xl text-purple-300 max-w-3xl mx-auto">
              Asigna misiones épicas a los hechiceros y observa cómo crecen en poder y experiencia
            </p>
            
            {/* Botón para habilitar audio */}
            {!audioEnabled && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={habilitarAudio}
                className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg"
              >
                🔊 Habilitar Efectos de Sonido
              </motion.button>
            )}
          </motion.div>

          {/* Estadísticas */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-dark p-6 rounded-xl border border-purple-500/30 hover-lift"
            >
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-3xl font-bold text-purple-400">{usuarios.length}</h3>
              <p className="text-gray-400">Hechiceros Disponibles</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-dark p-6 rounded-xl border border-blue-500/30 hover-lift"
            >
              <div className="text-4xl mb-3">📜</div>
              <h3 className="text-3xl font-bold text-blue-400">{misiones.length}</h3>
              <p className="text-gray-400">Misiones Disponibles</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-dark p-6 rounded-xl border border-green-500/30 hover-lift"
            >
              <div className="text-4xl mb-3">🏫</div>
              <h3 className="text-3xl font-bold text-green-400">{clases.length}</h3>
              <p className="text-gray-400">Clases Activas</p>
            </motion.div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Panel de Asignación de Misión */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="glass-dark p-8 rounded-xl border border-purple-500/30 shadow-jjk-lg"
            >
              <h2 className="text-3xl font-bold text-gradient mb-6 text-center">
                ⚔️ Asignar Misión
              </h2>
              <form onSubmit={asignarMision} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-purple-300 mb-2">
                    👤 Selecciona un Hechicero
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    value={usuarioId}
                    onChange={(e) => setUsuarioId(e.target.value)}
                    required
                  >
                    <option value="">-- Seleccionar Hechicero --</option>
                    {usuarios.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.nombre} ({u.clase?.nombre || 'Sin clase'}) - Nivel {u.nivel}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-300 mb-2">
                    📜 Selecciona una Misión
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    value={misionId}
                    onChange={(e) => setMisionId(e.target.value)}
                    required
                  >
                    <option value="">-- Seleccionar Misión --</option>
                    {misiones.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.titulo} - {m.experiencia} XP ({m.estado})
                      </option>
                    ))}
                  </select>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-4 rounded-lg font-bold text-white shadow-lg transition-all"
                >
                  ⚡ Asignar y Completar Misión
                </motion.button>
              </form>

              {mensaje && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 p-4 bg-green-900/30 border border-green-500 rounded-lg text-center"
                >
                  <p className="text-green-400 font-semibold">{mensaje}</p>
                </motion.div>
              )}
            </motion.div>

            {/* Panel de Creación de Usuario */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="glass-dark p-8 rounded-xl border border-green-500/30 shadow-jjk-lg"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gradient">
                  ➕ Crear Nuevo Hechicero
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowForm(!showForm)}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-4 py-2 rounded-lg font-bold text-white shadow-lg transition-all"
                >
                  {showForm ? '❌ Ocultar' : '👤 Mostrar'}
                </motion.button>
              </div>

              <AnimatePresence>
                {showForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={crearUsuario}
                    className="space-y-6 overflow-hidden"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-green-300 mb-2">
                        👤 Nombre del Hechicero
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border border-green-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Ej: Nuevo Hechicero"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-green-300 mb-2">
                        🏫 Clase
                      </label>
                      <select
                        name="clase"
                        value={form.clase}
                        onChange={(e) => setForm({ ...form, clase: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border border-green-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="">-- Seleccionar clase --</option>
                        {clases.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 py-3 rounded-lg font-bold text-white shadow-lg transition-all"
                    >
                      ⚡ Crear Hechicero
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500 rounded-lg">
                <h3 className="text-lg font-bold text-blue-400 mb-2">💡 Consejos</h3>
                <ul className="text-sm text-blue-300 space-y-1">
                  <li>• Asigna misiones según el nivel del hechicero</li>
                  <li>• Las misiones otorgan experiencia y pueden subir niveles</li>
                  <li>• Crea nuevos hechiceros para expandir tu academia</li>
                  <li>• Monitorea el progreso de cada estudiante</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

