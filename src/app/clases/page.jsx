'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function ClasesPage() {
  const [clases, setClases] = useState([])
  const [form, setForm] = useState({ nombre: '', descripcion: '', habilidades: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [particles, setParticles] = useState([])
  const [audioEnabled, setAudioEnabled] = useState(false)

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
    cargarClases()
  }, [])

  const cargarClases = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/clases')
      if (!res.ok) throw new Error('Error al cargar clases')
      const data = await res.json()
      setClases(data)
    } catch (error) {
      toast.error('Error al cargar las clases')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form.nombre.trim() || !form.descripcion.trim()) {
      toast.error('Por favor completa todos los campos')
      return
    }

    const toastId = toast.loading('Creando clase...')
    
    try {
      const nuevaClase = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        habilidades: form.habilidades.split(',').map(h => h.trim()).filter(h => h),
      }

      const res = await fetch('/api/clases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaClase),
      })

      if (!res.ok) throw new Error('Error al crear clase')

      const claseAgregada = await res.json()
      setClases([...clases, claseAgregada])
      setForm({ nombre: '', descripcion: '', habilidades: '' })
      setShowForm(false)
      toast.success('✅ Clase creada exitosamente', { id: toastId })
      
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
      toast.error('❌ Error al crear clase', { id: toastId })
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
            Cargando Clases...
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
              🏫 ACADEMIA DE HECHICEROS
            </h1>
            <p className="text-xl text-purple-300 max-w-3xl mx-auto">
              Descubre las técnicas ancestrales y domina el poder de la energía maldita en cada clase especializada
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
              <div className="text-4xl mb-3">🏫</div>
              <h3 className="text-3xl font-bold text-purple-400">{clases.length}</h3>
              <p className="text-gray-400">Clases Disponibles</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-dark p-6 rounded-xl border border-blue-500/30 hover-lift"
            >
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-3xl font-bold text-blue-400">
                {clases.reduce((total, clase) => total + (clase.habilidades?.length || 0), 0)}
              </h3>
              <p className="text-gray-400">Técnicas Totales</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-dark p-6 rounded-xl border border-green-500/30 hover-lift"
            >
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-3xl font-bold text-green-400">
                {clases.filter(c => c.estudiantes?.length > 0).length}
              </h3>
              <p className="text-gray-400">Clases Activas</p>
            </motion.div>
          </motion.div>

          {/* Grid de Clases */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gradient">📚 Clases Disponibles</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all"
              >
                {showForm ? '❌ Cancelar' : '➕ Crear Clase'}
              </motion.button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {clases.map((clase, index) => (
                <motion.div
                  key={clase._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="glass-dark p-8 rounded-xl border-2 border-purple-500/30 shadow-jjk-lg hover:shadow-purple-500/20 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-purple-400 mb-2">{clase.nombre}</h3>
                      <p className="text-gray-300 leading-relaxed">{clase.descripcion}</p>
                    </div>
                    <div className="text-4xl">🏫</div>
                  </div>

                  {clase.habilidades && clase.habilidades.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-lg font-bold text-yellow-400 mb-3">⚡ Técnicas Especiales:</h4>
                      <div className="flex flex-wrap gap-2">
                        {clase.habilidades.map((habilidad, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-900/50 border border-purple-500 rounded-full text-sm text-purple-300"
                          >
                            {habilidad}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>📅 Creada: {new Date(clase.fechaCreacion).toLocaleDateString()}</span>
                    <span>👥 {clase.estudiantes?.length || 0} estudiantes</span>
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
                  ⚡ Crear Nueva Clase
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      🏫 Nombre de la Clase
                    </label>
                    <input
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Ej: Técnicas de Dominio Expandido"
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
                      placeholder="Describe las técnicas y objetivos de esta clase..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      ⚡ Técnicas (separadas por coma)
                    </label>
                    <input
                      name="habilidades"
                      value={form.habilidades}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Ej: Infinito, Limitless, Hollow Purple"
                    />
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-lg font-bold text-white shadow-lg transition-all"
                    >
                      ⚡ Crear Clase
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
