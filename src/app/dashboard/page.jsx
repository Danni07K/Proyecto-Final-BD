'use client'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import XPBar from '@/components/XPBar'
import UsuariosPorNivelChart from '@/components/UsuariosPorNivelChart'
import Link from 'next/link'
import { useAuth } from '@/hooks/useClient'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { isAuthenticated, isClient } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [misiones, setMisiones] = useState([])
  const [filtro, setFiltro] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedMission, setSelectedMission] = useState(null)
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalMisiones: 0,
    promedioNivel: 0,
    usuariosActivos: 0,
    misionesCompletadas: 0,
    experienciaTotal: 0
  })
  const router = useRouter()

  useEffect(() => {
    if (!isClient) return
    
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para acceder al dashboard')
      window.location.href = '/login'
      return
    }

    async function cargarDatos() {
      try {
        setIsLoading(true)
        const token = localStorage.getItem('token')
        console.log('Token en dashboard:', token ? 'Sí' : 'No')
        
        if (!token) {
          toast.error('No hay token de autenticación')
          window.location.href = '/login'
          return
        }
        
        // Probar autenticación primero
        const authTest = await fetch('/api/test-auth', { 
          headers: { Authorization: `Bearer ${token}` } 
        })
        console.log('Test auth status:', authTest.status)
        
        if (!authTest.ok) {
          toast.error('Token inválido. Inicia sesión de nuevo.')
          window.location.href = '/login'
          return
        }
        
        const [usuariosRes, misionesRes] = await Promise.all([
          fetch('/api/usuarios', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/misiones', { headers: { Authorization: `Bearer ${token}` } })
        ])
        
        console.log('Status usuarios:', usuariosRes.status)
        console.log('Status misiones:', misionesRes.status)
        
        if (!usuariosRes.ok || !misionesRes.ok) {
          const usuariosError = await usuariosRes.json().catch(() => ({}))
          const misionesError = await misionesRes.json().catch(() => ({}))
          const errorMsg = usuariosError.error || misionesError.error || 'Error al cargar datos'
          console.error('Error al cargar datos:', errorMsg)
          if (usuariosRes.status === 401 || misionesRes.status === 401) {
            toast.error('Sesión expirada. Inicia sesión de nuevo.')
            window.location.href = '/login'
            return
          }
          throw new Error(errorMsg)
        }

        const [usuariosJson, misionesJson] = await Promise.all([
          usuariosRes.json(),
          misionesRes.json()
        ])

        console.log('Respuesta usuarios:', usuariosJson)
        console.log('Respuesta misiones:', misionesJson)

        // Validar que los datos sean arrays
        if (!Array.isArray(usuariosJson)) {
          console.error('Error: usuarios no es un array:', usuariosJson)
          throw new Error('Formato de datos inválido para usuarios')
        }
        
        if (!Array.isArray(misionesJson)) {
          console.error('Error: misiones no es un array:', misionesJson)
          throw new Error('Formato de datos inválido para misiones')
        }

        setUsuarios(usuariosJson)
        setMisiones(misionesJson)

        // Calculate enhanced statistics
        const totalUsuarios = usuariosJson.length
        const totalMisiones = misionesJson.length
        const promedioNivel = totalUsuarios > 0 
          ? Math.round(usuariosJson.reduce((sum, u) => sum + u.nivel, 0) / totalUsuarios)
          : 0
        const usuariosActivos = usuariosJson.filter(u => u.experiencia > 0).length
        const misionesCompletadas = usuariosJson.reduce((sum, u) => sum + (u.misionesCompletadas?.length || 0), 0)
        const experienciaTotal = usuariosJson.reduce((sum, u) => sum + u.experiencia, 0)

        setStats({
          totalUsuarios,
          totalMisiones,
          promedioNivel,
          usuariosActivos,
          misionesCompletadas,
          experienciaTotal
        })
      } catch (error) {
        console.error('Error al cargar datos:', error)
        toast.error(error.message || 'Error al cargar los datos del dashboard')
      } finally {
        setIsLoading(false)
      }
    }
    cargarDatos()
  }, [isClient, isAuthenticated])

  const asignarMision = async (usuarioId, misionId) => {
    if (!selectedUser || !selectedMission) {
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

      // Reload updated data
      const actualizados = await fetch('/api/usuarios').then((r) => r.json())
      setUsuarios(actualizados)
      
      // Reset selections
      setSelectedUser(null)
      setSelectedMission(null)

    } catch (err) {
      toast.error('⚠️ Error inesperado', { id: toastId })
    }
  }

  const usuariosFiltrados = Array.isArray(usuarios) ? usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    u.email?.toLowerCase().includes(filtro.toLowerCase())
  ) : []

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
            Cargando Dashboard...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-6 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold text-gradient mb-4 drop-shadow-2xl">
            📊 Panel del Profesor
          </h1>
          <p className="text-xl text-purple-300">
            Gestiona tu academia de hechiceros
          </p>
        </motion.div>

        {/* Enhanced Statistics */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {[
            { icon: '👥', number: stats.totalUsuarios, label: 'Total Estudiantes', color: 'purple' },
            { icon: '⚔️', number: stats.totalMisiones, label: 'Misiones Disponibles', color: 'yellow' },
            { icon: '📈', number: stats.promedioNivel, label: 'Nivel Promedio', color: 'green' },
            { icon: '🔥', number: stats.usuariosActivos, label: 'Estudiantes Activos', color: 'red' },
            { icon: '🏆', number: stats.misionesCompletadas, label: 'Misiones Completadas', color: 'blue' },
            { icon: '⚡', number: stats.experienciaTotal, label: 'Experiencia Total', color: 'purple' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`glass-dark p-6 rounded-xl border border-${stat.color}-500/30 hover-lift`}
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <h3 className={`text-3xl font-bold text-${stat.color}-400 mb-2`}>{stat.number}</h3>
              <p className="text-gray-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Search Bar */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="🔍 Buscar estudiante o email..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-lg glass-dark border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </motion.div>

        {/* Enhanced Mission Assignment Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* User Selection */}
          <div className="glass-dark p-6 rounded-xl border border-purple-500/30">
            <h3 className="text-2xl font-bold text-gradient mb-4">👤 Seleccionar Estudiante</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {usuariosFiltrados.map((usuario) => (
                <motion.div
                  key={usuario._id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedUser(usuario)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedUser?._id === usuario._id
                      ? 'bg-purple-600/30 border-2 border-purple-500'
                      : 'bg-black/30 border-2 border-transparent hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">{usuario.nombre}</h4>
                      <p className="text-sm text-gray-400">{usuario.email}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-purple-400">Nivel {usuario.nivel}</span>
                        <span className="text-sm text-yellow-400">{usuario.experiencia} XP</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl">{usuario.personaje?.avatar || '👤'}</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <XPBar experiencia={usuario.experiencia} nivel={usuario.nivel} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mission Selection */}
          <div className="glass-dark p-6 rounded-xl border border-yellow-500/30">
            <h3 className="text-2xl font-bold text-gradient mb-4">⚔️ Seleccionar Misión</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Array.isArray(misiones) ? misiones.map((mision) => (
                <motion.div
                  key={mision._id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedMission(mision)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedMission?._id === mision._id
                      ? 'bg-yellow-600/30 border-2 border-yellow-500'
                      : 'bg-black/30 border-2 border-transparent hover:border-yellow-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">{mision.titulo}</h4>
                      <p className="text-sm text-gray-400">{mision.descripcion}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-yellow-400">{mision.experiencia} XP</span>
                        <span className="text-sm text-purple-400">Dificultad: {mision.dificultad}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl">⚔️</div>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center text-gray-400 py-4">
                  No hay misiones disponibles
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Assignment Button */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => asignarMision(selectedUser?._id, selectedMission?._id)}
            disabled={!selectedUser || !selectedMission}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              selectedUser && selectedMission
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-jjk-lg'
                : 'bg-gray-600 cursor-not-allowed opacity-50'
            }`}
          >
            {selectedUser && selectedMission ? (
              `🎯 Asignar misión a ${selectedUser.nombre}`
            ) : (
              'Selecciona un estudiante y una misión'
            )}
          </motion.button>
        </motion.div>

        {/* Enhanced Charts Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          <div className="glass-dark p-6 rounded-xl border border-purple-500/30">
            <h3 className="text-2xl font-bold text-gradient mb-4">📊 Distribución por Nivel</h3>
            <UsuariosPorNivelChart usuarios={usuarios} />
          </div>
          
          <div className="glass-dark p-6 rounded-xl border border-yellow-500/30">
            <h3 className="text-2xl font-bold text-gradient mb-4">🏆 Top Estudiantes</h3>
            <div className="space-y-3">
              {Array.isArray(usuarios) ? usuarios
                .sort((a, b) => b.experiencia - a.experiencia)
                .slice(0, 5)
                .map((usuario, index) => (
                  <motion.div
                    key={usuario._id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-black/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{usuario.nombre}</h4>
                        <p className="text-sm text-gray-400">Nivel {usuario.nivel}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-400">{usuario.experiencia} XP</div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center text-gray-400 py-4">
                    No hay datos disponibles
                  </div>
                )}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gradient mb-6">⚡ Acciones Rápidas</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/perfil/profesor/crear-clase">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg font-semibold transition-all duration-300 shadow-jjk"
              >
                🏫 Crear Clase
              </motion.button>
            </Link>
            
            <Link href="/perfil/profesor/calificar">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-semibold transition-all duration-300 shadow-jjk"
              >
                📝 Calificar
              </motion.button>
            </Link>
            
            <Link href="/ranking">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 rounded-lg font-semibold transition-all duration-300 shadow-jjk"
              >
                🏆 Ver Ranking
              </motion.button>
            </Link>
            
            <Link href="/misiones">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg font-semibold transition-all duration-300 shadow-jjk"
              >
                ⚔️ Gestionar Misiones
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Enhanced Navigation Cards */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {[
            { 
              title: '🎯 Misiones', 
              description: 'Explora y completa misiones épicas',
              href: '/misiones',
              color: 'purple',
              icon: '🎯'
            },
            { 
              title: '🏆 Ranking', 
              description: 'Ve cómo te posicionas entre otros hechiceros',
              href: '/ranking',
              color: 'yellow',
              icon: '🏆'
            },
            { 
              title: '👤 Perfil', 
              description: 'Gestiona tu personaje y progreso',
              href: '/perfil',
              color: 'blue',
              icon: '👤'
            },
            { 
              title: '🛍️ Tienda', 
              description: 'Compra accesorios y mejoras',
              href: '/perfil/estudiante/tienda',
              color: 'green',
              icon: '🛍️'
            },
            { 
              title: '⚔️ Combate 3D', 
              description: 'Entrena en combates épicos',
              href: '/combate',
              color: 'red',
              icon: '⚔️'
            },
            { 
              title: '🏰 Clanes', 
              description: 'Únete a clanes y forma alianzas',
              href: '/clanes',
              color: 'purple',
              icon: '🏰'
            },
            { 
              title: '🎉 Eventos', 
              description: 'Participa en eventos especiales',
              href: '/eventos',
              color: 'yellow',
              icon: '🎉'
            },
            { 
              title: '🤖 IA Recomendaciones', 
              description: 'Recibe sugerencias personalizadas',
              href: '/ai-recomendaciones',
              color: 'cyan',
              icon: '🤖'
            },
            { 
              title: '📊 Analytics', 
              description: 'Analiza tu progreso detallado',
              href: '/analytics',
              color: 'blue',
              icon: '📊'
            }
          ].map((card, index) => (
            <motion.div
              key={card.title}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(card.href)}
              className={`glass-dark p-6 rounded-xl border border-${card.color}-500/30 hover-lift cursor-pointer`}
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className={`text-xl font-bold text-${card.color}-400 mb-2`}>{card.title}</h3>
              <p className="text-gray-400 text-sm">{card.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

