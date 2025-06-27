'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import XPBar from '@/components/XPBar'

export default function RankingPage() {
  const [usuarios, setUsuarios] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtro, setFiltro] = useState('todos')
  const [sortBy, setSortBy] = useState('experiencia') // experiencia, nivel, misiones
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function cargarRanking() {
      setIsLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('/api/usuarios', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Error al cargar ranking')
        const data = await res.json()
        setUsuarios(data)
      } catch (err) {
        setError('Error al cargar el ranking')
      } finally {
        setIsLoading(false)
      }
    }
    cargarRanking()
  }, [])

  const getSortedUsers = () => {
    let filtered = usuarios.filter(u => {
      if (filtro === 'todos') return true
      return u.rol === filtro
    })

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort by different criteria
    switch (sortBy) {
      case 'experiencia':
        return filtered.sort((a, b) => b.experiencia - a.experiencia)
      case 'nivel':
        return filtered.sort((a, b) => b.nivel - a.nivel)
      case 'misiones':
        return filtered.sort((a, b) => (b.misionesCompletadas?.length || 0) - (a.misionesCompletadas?.length || 0))
      default:
        return filtered.sort((a, b) => b.experiencia - a.experiencia)
    }
  }

  const usuariosOrdenados = getSortedUsers()

  const getMedalla = (posicion) => {
    switch (posicion) {
      case 0: return '🥇'
      case 1: return '🥈'
      case 2: return '🥉'
      default: return `#${posicion + 1}`
    }
  }

  const getColorMedalla = (posicion) => {
    switch (posicion) {
      case 0: return 'text-yellow-400'
      case 1: return 'text-gray-400'
      case 2: return 'text-amber-600'
      default: return 'text-purple-400'
    }
  }

  const getTierColor = (posicion) => {
    if (posicion < 3) return 'border-yellow-500 bg-yellow-500/10'
    if (posicion < 10) return 'border-purple-500 bg-purple-500/10'
    if (posicion < 20) return 'border-blue-500 bg-blue-500/10'
    return 'border-gray-500 bg-gray-500/10'
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
            Cargando Ranking...
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-jjk"
          >
            🔄 Reintentar
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-6 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold text-gradient mb-4 drop-shadow-2xl">
            🏆 Ranking de Hechiceros
          </h1>
          <p className="text-xl text-purple-300">
            Los más poderosos de la academia
          </p>
        </motion.div>

        {/* Enhanced Filters and Search */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
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
                  onClick={() => setFiltro(opcion.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    filtro === opcion.key
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {opcion.icon} {opcion.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex justify-center">
            <div className="flex gap-2 bg-gray-800/50 p-2 rounded-lg border border-purple-500/30">
              {[
                { key: 'experiencia', label: '⚡ XP', icon: '⚡' },
                { key: 'nivel', label: '📈 Nivel', icon: '📈' },
                { key: 'misiones', label: '🎯 Misiones', icon: '🎯' }
              ].map((opcion) => (
                <motion.button
                  key={opcion.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSortBy(opcion.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    sortBy === opcion.key
                      ? 'bg-yellow-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {opcion.icon} {opcion.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Statistics */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { 
              icon: '🥇', 
              value: usuariosOrdenados[0]?.nombre || 'Sin datos', 
              label: 'Primer Lugar', 
              color: 'yellow',
              subtitle: usuariosOrdenados[0] ? `${usuariosOrdenados[0].experiencia} XP` : ''
            },
            { 
              icon: '📊', 
              value: usuariosOrdenados.length, 
              label: 'Total Participantes', 
              color: 'purple' 
            },
            { 
              icon: '⚡', 
              value: usuariosOrdenados.reduce((sum, u) => sum + u.experiencia, 0), 
              label: 'XP Total', 
              color: 'green' 
            },
            { 
              icon: '🎯', 
              value: usuariosOrdenados.reduce((sum, u) => sum + (u.misionesCompletadas?.length || 0), 0), 
              label: 'Misiones Completadas', 
              color: 'blue' 
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`glass-dark p-6 rounded-xl border border-${stat.color}-500/30 hover-lift`}
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <h3 className={`text-2xl font-bold text-${stat.color}-400 mb-1`}>{stat.value}</h3>
              <p className="text-gray-400 font-medium">{stat.label}</p>
              {stat.subtitle && (
                <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Ranking List */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <AnimatePresence>
            {usuariosOrdenados.length > 0 ? (
              <div className="space-y-4">
                {usuariosOrdenados.map((usuario, index) => (
                  <motion.div
                    key={usuario._id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`glass-dark p-6 rounded-xl border-2 hover-lift ${getTierColor(index)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className={`text-3xl font-bold ${getColorMedalla(index)}`}>
                            {getMedalla(index)}
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {index < 3 ? 'Leyenda' : index < 10 ? 'Élite' : index < 20 ? 'Veterano' : 'Novato'}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">
                            {usuario.personaje?.avatar || '👤'}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{usuario.nombre}</h3>
                            <p className="text-gray-400">{usuario.email}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm text-purple-400">
                                {usuario.rol === 'profesor' ? '👨‍🏫 Profesor' : '🎓 Estudiante'}
                              </span>
                              <span className="text-sm text-yellow-400">
                                Nivel {usuario.nivel}
                              </span>
                              <span className="text-sm text-blue-400">
                                {usuario.misionesCompletadas?.length || 0} misiones
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-3xl font-bold text-yellow-400 mb-2">
                          {usuario.experiencia} XP
                        </div>
                        <div className="w-32">
                          <XPBar experiencia={usuario.experiencia} nivel={usuario.nivel} />
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {usuario.experiencia}/{usuario.nivel * 100} XP
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional Stats */}
                    <div className="mt-4 pt-4 border-t border-gray-700/50">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-purple-400 font-semibold">Puntos Positivos</div>
                          <div className="text-white">{usuario.puntosPositivos || 0}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-red-400 font-semibold">Puntos Negativos</div>
                          <div className="text-white">{usuario.puntosNegativos || 0}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-400 font-semibold">Puntos Gold</div>
                          <div className="text-white">{usuario.puntosGold || 0}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-400 font-semibold">Monedas</div>
                          <div className="text-white">{usuario.monedas || 0}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl text-gray-400 mb-2">No se encontraron hechiceros</p>
                <p className="text-gray-500">
                  {searchTerm ? 'Intenta con otro nombre' : 'No hay hechiceros registrados'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Back to Dashboard */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 shadow-jjk"
            >
              ← Volver al Dashboard
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
