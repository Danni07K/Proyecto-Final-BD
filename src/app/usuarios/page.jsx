'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [clases, setClases] = useState([])
  const [form, setForm] = useState({
    nombre: '',
    clase: '',
    nivel: 1,
    experiencia: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [particles, setParticles] = useState([])
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRol, setFilterRol] = useState('todos')

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
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setIsLoading(true)
      const [usuariosRes, clasesRes] = await Promise.all([
        fetch('/api/usuarios'),
        fetch('/api/clases')
      ])
      
      if (!usuariosRes.ok || !clasesRes.ok) {
        throw new Error('Error al cargar datos')
      }
      
      const [usuariosData, clasesData] = await Promise.all([
        usuariosRes.json(),
        clasesRes.json()
      ])
      
      setUsuarios(usuariosData)
      setClases(clasesData)
    } catch (error) {
      toast.error('Error al cargar los datos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm({ ...form, [name]: name === 'nivel' || name === 'experiencia' ? parseInt(value) : value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    
    if (!form.nombre.trim() || !form.clase) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    const toastId = toast.loading('Creando usuario...')
    
    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!res.ok) throw new Error('Error al crear usuario')

      const usuariosRes = await fetch('/api/usuarios')
      const actualizados = await usuariosRes.json()
      setUsuarios(actualizados)
      setForm({ nombre: '', clase: '', nivel: 1, experiencia: 0 })
      setShowForm(false)
      toast.success('✅ Usuario creado exitosamente', { id: toastId })
      
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

  const obtenerAvatar = (usuario) => {
    // Si el usuario tiene un personaje asignado, usar ese avatar
    if (usuario.personaje?.avatar) {
      return usuario.personaje.avatar
    }
    
    // Si no, asignar por nombre o clase
    const nombre = usuario.nombre?.toLowerCase() || ''
    const claseNombre = usuario.clase?.nombre?.toLowerCase() || ''
    
    // Mapeo por nombre específico
    if (nombre.includes('gojo') || nombre.includes('satoru')) {
      return '/avatars/avatar-gojo.png'
    }
    if (nombre.includes('itadori') || nombre.includes('yuji')) {
      return '/avatars/avatar-itadori.png'
    }
    if (nombre.includes('megumi') || nombre.includes('fushiguro')) {
      return '/avatars/avatar-megumi.png'
    }
    if (nombre.includes('nobara') || nombre.includes('kugisaki')) {
      return '/avatars/avatar-nobara.png'
    }
    if (nombre.includes('nanami') || nombre.includes('kento')) {
      return '/avatars/avatar-nanami.png'
    }
    if (nombre.includes('yuta') || nombre.includes('okotsu')) {
      return '/avatars/avatar-yuta.png'
    }
    
    // Mapeo por clase
    if (claseNombre.includes('hechicero') || claseNombre.includes('mago')) {
      return '/avatars/avatar-mage.png'
    }
    if (claseNombre.includes('guerrero') || claseNombre.includes('warrior')) {
      return '/avatars/avatar-guerrero.png'
    }
    if (claseNombre.includes('guardian') || claseNombre.includes('protector')) {
      return '/avatars/avatar-guardian.png'
    }
    if (claseNombre.includes('curandero') || claseNombre.includes('healer')) {
      return '/avatars/avatar-curandero.png'
    }
    
    // Avatar por defecto basado en el rol
    return usuario.rol === 'profesor' ? '/avatars/avatar-gojo.png' : '/avatars/avatar-itadori.png'
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

  const usuariosFiltrados = usuarios.filter(u => {
    const matchesSearch = u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRol = filterRol === 'todos' || u.rol === filterRol
    return matchesSearch && matchesRol
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
            Cargando Hechiceros...
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
              👥 LEGIÓN DE HECHICEROS
            </h1>
            <p className="text-xl text-purple-300 max-w-3xl mx-auto">
              Conoce a los guerreros que dominan las técnicas de la energía maldita y forjan su destino en la academia
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
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-3xl font-bold text-purple-400">{usuarios.length}</h3>
              <p className="text-gray-400">Total Hechiceros</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-dark p-6 rounded-xl border border-blue-500/30 hover-lift"
            >
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="text-3xl font-bold text-blue-400">
                {usuarios.filter(u => u.rol === 'estudiante').length}
              </h3>
              <p className="text-gray-400">Estudiantes</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-dark p-6 rounded-xl border border-yellow-500/30 hover-lift"
            >
              <div className="text-4xl mb-3">👨‍🏫</div>
              <h3 className="text-3xl font-bold text-yellow-400">
                {usuarios.filter(u => u.rol === 'profesor').length}
              </h3>
              <p className="text-gray-400">Profesores</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-dark p-6 rounded-xl border border-green-500/30 hover-lift"
            >
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-3xl font-bold text-green-400">
                {usuarios.reduce((total, u) => total + u.experiencia, 0).toLocaleString()}
              </h3>
              <p className="text-gray-400">XP Total</p>
            </motion.div>
          </motion.div>

          {/* Controles de Filtrado */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8 space-y-4"
          >
            {/* Search Bar */}
            <div className="flex justify-center">
              <div className="relative max-w-md w-full">
                <input
                  type="text"
                  placeholder="🔍 Buscar hechicero..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-lg glass-dark border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex justify-center">
              <div className="flex gap-2 bg-gray-800/50 p-2 rounded-lg border border-purple-500/30">
                {[
                  { key: 'todos', label: '👥 Todos', icon: '👥' },
                  { key: 'estudiante', label: '🎓 Estudiantes', icon: '🎓' },
                  { key: 'profesor', label: '👨‍🏫 Profesores', icon: '👨‍🏫' }
                ].map((opcion) => (
                  <motion.button
                    key={opcion.key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilterRol(opcion.key)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      filterRol === opcion.key
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

          {/* Grid de Usuarios */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gradient">⚔️ Lista de Hechiceros</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all"
              >
                {showForm ? '❌ Cancelar' : '➕ Crear Hechicero'}
              </motion.button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {usuariosFiltrados.map((usuario, index) => (
                <motion.div
                  key={usuario._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="glass-dark p-8 rounded-xl border-2 border-purple-500/30 shadow-jjk-lg hover:shadow-purple-500/20 transition-all duration-300"
                >
                  <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="relative">
                      <img
                        src={obtenerAvatar(usuario)}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full border-4 border-purple-500 shadow-lg"
                      />
                      <div className="absolute -inset-2 bg-purple-500/20 rounded-full blur-lg animate-pulse"></div>
                    </div>

                    {/* Información */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-purple-400">{usuario.nombre}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          usuario.rol === 'profesor' 
                            ? 'bg-yellow-600 text-white' 
                            : 'bg-blue-600 text-white'
                        }`}>
                          {usuario.rol === 'profesor' ? '👨‍🏫 Profesor' : '🎓 Estudiante'}
                        </span>
                      </div>

                      <p className="text-gray-300 mb-3">
                        Clase: <span className="text-purple-300 font-semibold">
                          {usuario.clase?.nombre || 'Sin clase'}
                        </span>
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">Nivel {usuario.nivel}</div>
                          <div className="text-xs text-gray-400">Poder</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-400">{usuario.experiencia} XP</div>
                          <div className="text-xs text-gray-400">Experiencia</div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-400 mb-4">
                        Misiones completadas: {usuario.misionesCompletadas?.length || 0}
                      </div>

                      <Link
                        href={`/alumno/${usuario._id}`}
                        className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-semibold"
                      >
                        Ver perfil completo →
                      </Link>
                    </div>
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
                  ⚡ Crear Nuevo Hechicero
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      👤 Nombre del Hechicero
                    </label>
                    <input
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Ej: Satoru Gojo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">
                      🏫 Clase
                    </label>
                    <select
                      name="clase"
                      value={form.clase}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="">Selecciona una clase</option>
                      {clases.map(c => (
                        <option key={c._id} value={c._id}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-purple-300 mb-2">
                        ⚡ Nivel
                      </label>
                      <input
                        type="number"
                        name="nivel"
                        value={form.nivel}
                        min="1"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-black/50 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-purple-300 mb-2">
                        💎 Experiencia
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
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-lg font-bold text-white shadow-lg transition-all"
                    >
                      ⚡ Crear Hechicero
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
