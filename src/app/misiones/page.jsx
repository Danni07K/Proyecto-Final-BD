'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function MisionesPage() {
  const [misiones, setMisiones] = useState([])
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    experiencia: 0,
    dificultad: 'facil',
    estado: 'disponible'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [particles, setParticles] = useState([])
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [filterEstado, setFilterEstado] = useState('todos')
  const [filterDificultad, setFilterDificultad] = useState('todos')

  // Generate cursed energy particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 25 }, (_, i) => ({
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
    cargarMisiones()
  }, [])

  const cargarMisiones = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/misiones')
      if (!res.ok) throw new Error('Error al cargar misiones')
      const data = await res.json()
      setMisiones(data)
    } catch (error) {
      toast.error('Error al cargar las misiones')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ 
      ...form, 
      [name]: name === 'experiencia' ? parseInt(value) : value 
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form.titulo.trim() || !form.descripcion.trim()) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    const toastId = toast.loading('Creando misión...')
    
    try {
      const res = await fetch('/api/misiones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!res.ok) throw new Error('Error al crear misión')

      const misionCreada = await res.json()
      setMisiones([...misiones, misionCreada])
      setForm({ titulo: '', descripcion: '', experiencia: 0, dificultad: 'facil', estado: 'disponible' })
      setShowForm(false)
      toast.success('✅ Misión creada exitosamente', { id: toastId })
      
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
      toast.error('❌ Error al crear misión', { id: toastId })
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

  const getDificultadColor = (dificultad) => {
    switch (dificultad) {
      case 'facil': return 'text-green-400 bg-green-900/30 border-green-500'
      case 'media': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500'
      case 'dificil': return 'text-red-400 bg-red-900/30 border-red-500'
      case 'epica': return 'text-purple-400 bg-purple-900/30 border-purple-500'
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500'
    }
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'disponible': return 'text-blue-400 bg-blue-900/30 border-blue-500'
      case 'en_progreso': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500'
      case 'completada': return 'text-green-400 bg-green-900/30 border-green-500'
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500'
    }
  }

  const misionesFiltradas = misiones.filter(mision => {
    const matchesEstado = filterEstado === 'todos' || mision.estado === filterEstado
    const matchesDificultad = filterDificultad === 'todos' || mision.dificultad === filterDificultad
    return matchesEstado && matchesDificultad
  })

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
            Cargando Misiones Épicas...
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
        <div className="max-w-7xl mx-auto">
          {/* Header Épico */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 mb-4 drop-shadow-2xl">
              📜 MISIONES ÉPICAS
            </h1>
            <p className="text-xl text-purple-300 max-w-3xl mx-auto">
              Descubre y completa misiones legendarias para ganar experiencia y subir de nivel como hechicero
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
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-dark p-6 rounded-xl border border-purple-500/30 hover-lift"
            >
              <div className="text-4xl mb-3">📜</div>
              <h3 className="text-3xl font-bold text-purple-400">{misiones.length}</h3>
              <p className="text-gray-400">Total Misiones</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-dark p-6 rounded-xl border border-blue-500/30 hover-lift"
            >
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-3xl font-bold text-blue-400">
                {misiones.reduce((total, m) => total + m.experiencia, 0).toLocaleString()}
              </h3>
              <p className="text-gray-400">XP Total</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-dark p-6 rounded-xl border border-green-500/30 hover-lift"
            >
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-3xl font-bold text-green-400">
                {misiones.filter(m => m.estado === 'completada').length}
              </h3>
              <p className="text-gray-400">Completadas</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-dark p-6 rounded-xl border border-yellow-500/30 hover-lift"
            >
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-3xl font-bold text-yellow-400">
                {misiones.filter(m => m.estado === 'disponible').length}
              </h3>
              <p className="text-gray-400">Disponibles</p>
            </motion.div>
          </motion.div>

          {/* Filtros */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8 space-y-4"
          >
            <div className="flex flex-wrap justify-center gap-4">
              {/* Filtro por Estado */}
              <div className="flex gap-2 bg-gray-800/50 p-2 rounded-lg border border-purple-500/30">
                <span className="text-purple-300 font-semibold px-2">Estado:</span>
                {[
                  { key: 'todos', label: '📋 Todos', icon: '📋' },
                  { key: 'disponible', label: '🎯 Disponibles', icon: '🎯' },
                  { key: 'en_progreso', label: '⚡ En Progreso', icon: '⚡' },
                  { key: 'completada', label: '✅ Completadas', icon: '✅' }
                ].map((opcion) => (
                  <motion.button
                    key={opcion.key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilterEstado(opcion.key)}
                    className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 ${
                      filterEstado === opcion.key
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    {opcion.icon} {opcion.label}
                  </motion.button>
                ))}
              </div>

              {/* Filtro por Dificultad */}
              <div className="flex gap-2 bg-gray-800/50 p-2 rounded-lg border border-purple-500/30">
                <span className="text-purple-300 font-semibold px-2">Dificultad:</span>
                {[
                  { key: 'todos', label: '🎲 Todas', icon: '🎲' },
                  { key: 'facil', label: '🟢 Fácil', icon: '🟢' },
                  { key: 'media', label: '🟡 Media', icon: '🟡' },
                  { key: 'dificil', label: '🔴 Difícil', icon: '🔴' },
                  { key: 'epica', label: '🟣 Épica', icon: '🟣' }
                ].map((opcion) => (
                  <motion.button
                    key={opcion.key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilterDificultad(opcion.key)}
                    className={`px-3 py-1 rounded-lg font-medium transition-all duration-300 ${
                      filterDificultad === opcion.key
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    {opcion.icon} {opcion.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Grid de Misiones */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gradient">⚔️ Lista de Misiones</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all"
              >
                {showForm ? '❌ Cancelar' : '➕ Crear Misión'}
              </motion.button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {misionesFiltradas.map((mision, index) => (
                <motion.div
                  key={mision._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="glass-dark p-8 rounded-xl border-2 border-purple-500/30 shadow-jjk-lg hover:shadow-purple-500/20 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-purple-400 mb-2">{mision.titulo}</h3>
                      <p className="text-gray-300 leading-relaxed mb-4">{mision.descripcion}</p>
                    </div>
                    <div className="text-4xl ml-4">📜</div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getDificultadColor(mision.dificultad)}`}>
                      {mision.dificultad === 'facil' && '🟢 Fácil'}
                      {mision.dificultad === 'media' && '🟡 Media'}
                      {mision.dificultad === 'dificil' && '🔴 Difícil'}
                      {mision.dificultad === 'epica' && '🟣 Épica'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getEstadoColor(mision.estado)}`}>
                      {mision.estado === 'disponible' && '🎯 Disponible'}
                      {mision.estado === 'en_progreso' && '⚡ En Progreso'}
                      {mision.estado === 'completada' && '✅ Completada'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-yellow-400 font-bold">⚡ {mision.experiencia} XP</span>
                    <span className="text-gray-400">
                      📅 {new Date(mision.fechaCreacion).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Formulario de Creación */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-dark p-8 rounded-xl border border-purple-500/30 shadow-jjk-lg"
              >
                <h2 className="text-3xl font-bold text-gradient mb-6 text-center">
                  ⚡ Crear Nueva Misión
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      📜 Título de la Misión
                    </label>
                    <input
                      name="titulo"
                      value={form.titulo}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Ej: Derrotar a un espíritu maldito"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      📝 Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      value={form.descripcion}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      placeholder="Describe los objetivos y requisitos de la misión..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-purple-300 mb-2">
                        ⚡ Experiencia
                      </label>
                      <input
                        type="number"
                        name="experiencia"
                        value={form.experiencia}
                        min="0"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-purple-300 mb-2">
                        🎯 Dificultad
                      </label>
                      <select
                        name="dificultad"
                        value={form.dificultad}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        <option value="facil">🟢 Fácil</option>
                        <option value="media">🟡 Media</option>
                        <option value="dificil">🔴 Difícil</option>
                        <option value="epica">🟣 Épica</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-purple-300 mb-2">
                        📊 Estado
                      </label>
                      <select
                        name="estado"
                        value={form.estado}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        <option value="disponible">🎯 Disponible</option>
                        <option value="en_progreso">⚡ En Progreso</option>
                        <option value="completada">✅ Completada</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-lg font-bold text-white shadow-lg transition-all"
                    >
                      ⚡ Crear Misión
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowForm(false)}
                      className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-white transition-all"
                    >
                      ❌ Cancelar
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

