'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

// Configuración de logros
const ACHIEVEMENTS = {
  // Logros de nivel
  'first_level': {
    id: 'first_level',
    title: '🎯 Primer Paso',
    description: 'Alcanza el nivel 5',
    icon: '🎯',
    rarity: 'common',
    xpReward: 100,
    coinsReward: 50,
    condition: (user) => user.nivel >= 5
  },
  'level_master': {
    id: 'level_master',
    title: '🌟 Maestro del Nivel',
    description: 'Alcanza el nivel 20',
    icon: '🌟',
    rarity: 'rare',
    xpReward: 500,
    coinsReward: 200,
    condition: (user) => user.nivel >= 20
  },
  'level_legend': {
    id: 'level_legend',
    title: '👑 Leyenda Viviente',
    description: 'Alcanza el nivel 50',
    icon: '👑',
    rarity: 'legendary',
    xpReward: 2000,
    coinsReward: 1000,
    condition: (user) => user.nivel >= 50
  },

  // Logros de experiencia
  'xp_collector': {
    id: 'xp_collector',
    title: '⚡ Recolector de XP',
    description: 'Acumula 10,000 puntos de experiencia',
    icon: '⚡',
    rarity: 'rare',
    xpReward: 300,
    coinsReward: 150,
    condition: (user) => user.experiencia >= 10000
  },
  'xp_master': {
    id: 'xp_master',
    title: '💎 Maestro de la Energía',
    description: 'Acumula 100,000 puntos de experiencia',
    icon: '💎',
    rarity: 'epic',
    xpReward: 1000,
    coinsReward: 500,
    condition: (user) => user.experiencia >= 100000
  },

  // Logros de misiones
  'mission_starter': {
    id: 'mission_starter',
    title: '🎯 Iniciador de Misiones',
    description: 'Completa tu primera misión',
    icon: '🎯',
    rarity: 'common',
    xpReward: 50,
    coinsReward: 25,
    condition: (user) => user.misionesCompletadas?.length >= 1
  },
  'mission_expert': {
    id: 'mission_expert',
    title: '🏆 Experto en Misiones',
    description: 'Completa 50 misiones',
    icon: '🏆',
    rarity: 'epic',
    xpReward: 800,
    coinsReward: 400,
    condition: (user) => user.misionesCompletadas?.length >= 50
  },
  'mission_legend': {
    id: 'mission_legend',
    title: '🌟 Leyenda de las Misiones',
    description: 'Completa 200 misiones',
    icon: '🌟',
    rarity: 'legendary',
    xpReward: 3000,
    coinsReward: 1500,
    condition: (user) => user.misionesCompletadas?.length >= 200
  },

  // Logros de tienda
  'shop_visitor': {
    id: 'shop_visitor',
    title: '🛍️ Visitante de la Tienda',
    description: 'Compra tu primer accesorio',
    icon: '🛍️',
    rarity: 'common',
    xpReward: 75,
    coinsReward: 30,
    condition: (user) => user.accesoriosComprados?.length >= 1
  },
  'shop_collector': {
    id: 'shop_collector',
    title: '💎 Coleccionista',
    description: 'Compra 20 accesorios diferentes',
    icon: '💎',
    rarity: 'epic',
    xpReward: 600,
    coinsReward: 300,
    condition: (user) => user.accesoriosComprados?.length >= 20
  },

  // Logros de personaje
  'character_master': {
    id: 'character_master',
    title: '🎭 Maestro de Personajes',
    description: 'Selecciona un personaje',
    icon: '🎭',
    rarity: 'common',
    xpReward: 100,
    coinsReward: 50,
    condition: (user) => user.personaje?.nombre
  },

  // Logros de calificaciones
  'positive_student': {
    id: 'positive_student',
    title: '⭐ Estudiante Positivo',
    description: 'Recibe 10 puntos positivos',
    icon: '⭐',
    rarity: 'rare',
    xpReward: 200,
    coinsReward: 100,
    condition: (user) => user.puntosPositivos >= 10
  },
  'gold_student': {
    id: 'gold_student',
    title: '🌟 Estudiante Dorado',
    description: 'Recibe 5 puntos GOLD',
    icon: '🌟',
    rarity: 'epic',
    xpReward: 500,
    coinsReward: 250,
    condition: (user) => user.puntosGold >= 5
  },

  // Logros especiales
  'daily_login': {
    id: 'daily_login',
    title: '📅 Fiel Seguidor',
    description: 'Inicia sesión 7 días seguidos',
    icon: '📅',
    rarity: 'rare',
    xpReward: 300,
    coinsReward: 150,
    condition: (user) => user.diasConsecutivos >= 7
  },
  'social_butterfly': {
    id: 'social_butterfly',
    title: '🦋 Mariposa Social',
    description: 'Interactúa con 10 estudiantes diferentes',
    icon: '🦋',
    rarity: 'epic',
    xpReward: 400,
    coinsReward: 200,
    condition: (user) => user.interaccionesSociales >= 10
  }
}

// Componente de notificación de logro
function AchievementNotification({ achievement, onClose }) {
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400 border-yellow-500'
      case 'epic': return 'text-purple-400 border-purple-500'
      case 'rare': return 'text-blue-400 border-blue-500'
      case 'common': return 'text-gray-400 border-gray-500'
      default: return 'text-gray-400 border-gray-500'
    }
  }

  const getRarityGlow = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'shadow-yellow-500/50'
      case 'epic': return 'shadow-purple-500/50'
      case 'rare': return 'shadow-blue-500/50'
      case 'common': return 'shadow-gray-500/50'
      default: return 'shadow-gray-500/50'
    }
  }

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className={`fixed top-4 right-4 bg-black/90 backdrop-blur-sm rounded-xl p-6 border-2 ${getRarityColor(achievement.rarity)} shadow-2xl ${getRarityGlow(achievement.rarity)} z-50 max-w-sm`}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl animate-bounce">{achievement.icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2">{achievement.title}</h3>
          <p className="text-gray-300 text-sm mb-3">{achievement.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-yellow-400">⚡ +{achievement.xpReward} XP</span>
            <span className="text-yellow-400">💰 +{achievement.coinsReward} Monedas</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </motion.div>
  )
}

// Componente principal del sistema de logros
export default function AchievementSystem({ user, onAchievementUnlocked }) {
  const [unlockedAchievements, setUnlockedAchievements] = useState([])
  const [showNotification, setShowNotification] = useState(false)
  const [currentAchievement, setCurrentAchievement] = useState(null)
  const [showAllAchievements, setShowAllAchievements] = useState(false)

  // Verificar logros cuando cambia el usuario
  useEffect(() => {
    if (user) {
      checkAchievements(user)
    }
  }, [user])

  const checkAchievements = (userData) => {
    const newlyUnlocked = []
    
    Object.values(ACHIEVEMENTS).forEach(achievement => {
      // Verificar si ya está desbloqueado
      const isAlreadyUnlocked = unlockedAchievements.some(u => u.id === achievement.id)
      
      if (!isAlreadyUnlocked && achievement.condition(userData)) {
        newlyUnlocked.push(achievement)
      }
    })

    if (newlyUnlocked.length > 0) {
      // Mostrar notificación del primer logro
      const firstAchievement = newlyUnlocked[0]
      setCurrentAchievement(firstAchievement)
      setShowNotification(true)
      
      // Reproducir sonido de logro
      playAchievementSound(firstAchievement.rarity)
      
      // Actualizar logros desbloqueados
      setUnlockedAchievements(prev => [...prev, ...newlyUnlocked])
      
      // Notificar al componente padre
      if (onAchievementUnlocked) {
        onAchievementUnlocked(newlyUnlocked)
      }

      // Mostrar toast de celebración
      toast.success(`🎉 ¡Logro desbloqueado: ${firstAchievement.title}!`, {
        duration: 5000,
        icon: firstAchievement.icon
      })

      // Ocultar notificación después de 5 segundos
      setTimeout(() => {
        setShowNotification(false)
      }, 5000)
    }
  }

  const playAchievementSound = (rarity) => {
    try {
      const audio = new Audio('/sounds/achievement.mp3')
      audio.volume = 0.6
      audio.play().catch(err => {
        console.log('Audio no pudo reproducirse:', err)
      })
    } catch (error) {
      console.log('Error al reproducir audio:', error)
    }
  }

  const getProgressPercentage = (achievement) => {
    if (!user) return 0
    
    switch (achievement.id) {
      case 'first_level':
        return Math.min((user.nivel / 5) * 100, 100)
      case 'level_master':
        return Math.min((user.nivel / 20) * 100, 100)
      case 'level_legend':
        return Math.min((user.nivel / 50) * 100, 100)
      case 'xp_collector':
        return Math.min((user.experiencia / 10000) * 100, 100)
      case 'xp_master':
        return Math.min((user.experiencia / 100000) * 100, 100)
      case 'mission_starter':
        return user.misionesCompletadas?.length >= 1 ? 100 : 0
      case 'mission_expert':
        return Math.min(((user.misionesCompletadas?.length || 0) / 50) * 100, 100)
      case 'mission_legend':
        return Math.min(((user.misionesCompletadas?.length || 0) / 200) * 100, 100)
      case 'shop_visitor':
        return user.accesoriosComprados?.length >= 1 ? 100 : 0
      case 'shop_collector':
        return Math.min(((user.accesoriosComprados?.length || 0) / 20) * 100, 100)
      case 'character_master':
        return user.personaje?.nombre ? 100 : 0
      case 'positive_student':
        return Math.min((user.puntosPositivos / 10) * 100, 100)
      case 'gold_student':
        return Math.min((user.puntosGold / 5) * 100, 100)
      default:
        return 0
    }
  }

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400'
      case 'epic': return 'text-purple-400'
      case 'rare': return 'text-blue-400'
      case 'common': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  const getRarityBorder = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-500'
      case 'epic': return 'border-purple-500'
      case 'rare': return 'border-blue-500'
      case 'common': return 'border-gray-500'
      default: return 'border-gray-500'
    }
  }

  return (
    <>
      {/* Notificación de logro */}
      <AnimatePresence>
        {showNotification && currentAchievement && (
          <AchievementNotification
            achievement={currentAchievement}
            onClose={() => setShowNotification(false)}
          />
        )}
      </AnimatePresence>

      {/* Botón para mostrar todos los logros */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAllAchievements(true)}
        className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-2xl z-40"
      >
        🏆
      </motion.button>

      {/* Modal de todos los logros */}
      <AnimatePresence>
        {showAllAchievements && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAllAchievements(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-purple-500"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gradient">🏆 Sistema de Logros</h2>
                <button
                  onClick={() => setShowAllAchievements(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(ACHIEVEMENTS).map((achievement) => {
                  const isUnlocked = unlockedAchievements.some(u => u.id === achievement.id)
                  const progress = getProgressPercentage(achievement)
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg border-2 ${getRarityBorder(achievement.rarity)} ${
                        isUnlocked ? 'bg-purple-900/30' : 'bg-gray-800/30'
                      } ${isUnlocked ? 'opacity-100' : 'opacity-60'}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <h3 className={`font-bold ${getRarityColor(achievement.rarity)}`}>
                            {achievement.title}
                          </h3>
                          <p className="text-xs text-gray-400 capitalize">{achievement.rarity}</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-300 mb-3">{achievement.description}</p>
                      
                      {/* Barra de progreso */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progreso</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              isUnlocked ? 'bg-green-500' : 'bg-purple-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Recompensas */}
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-yellow-400">⚡ +{achievement.xpReward} XP</span>
                        <span className="text-yellow-400">💰 +{achievement.coinsReward}</span>
                      </div>

                      {/* Estado */}
                      {isUnlocked && (
                        <div className="mt-2 text-center">
                          <span className="text-green-400 text-xs font-bold">✅ DESBLOQUEADO</span>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Estadísticas */}
              <div className="mt-6 p-4 bg-purple-900/30 rounded-lg border border-purple-500">
                <h3 className="text-xl font-bold text-purple-400 mb-3">📊 Estadísticas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {unlockedAchievements.length}
                    </div>
                    <div className="text-sm text-gray-400">Logros Desbloqueados</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {Object.keys(ACHIEVEMENTS).length}
                    </div>
                    <div className="text-sm text-gray-400">Total de Logros</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {Math.round((unlockedAchievements.length / Object.keys(ACHIEVEMENTS).length) * 100)}%
                    </div>
                    <div className="text-sm text-gray-400">Completado</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {unlockedAchievements.reduce((sum, a) => sum + a.xpReward, 0)}
                    </div>
                    <div className="text-sm text-gray-400">XP Total Ganada</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 