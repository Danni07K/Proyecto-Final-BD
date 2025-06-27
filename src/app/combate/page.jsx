'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useClient'
import CombatSystem3D from '@/components/CombatSystem3D'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function CombatePage() {
  const { user } = useAuth()
  const [selectedOpponent, setSelectedOpponent] = useState(null)
  const [showCombat, setShowCombat] = useState(false)

  const opponents = [
    {
      id: 'gojo',
      name: 'Satoru Gojo',
      type: 'Hechicero Especial',
      level: 30,
      difficulty: 'Legendario',
      description: 'El hechicero más poderoso con la técnica del Infinito',
      stats: { poder: 100, velocidad: 95, resistencia: 90 },
      rewards: { xp: 1000, coins: 500 }
    },
    {
      id: 'sukuna',
      name: 'Ryomen Sukuna',
      type: 'Rey de las Maldiciones',
      level: 35,
      difficulty: 'Mítico',
      description: 'El rey de las maldiciones con poder incomparable',
      stats: { poder: 120, velocidad: 90, resistencia: 95 },
      rewards: { xp: 1500, coins: 750 }
    },
    {
      id: 'yuji',
      name: 'Yuji Itadori',
      type: 'Hechicero Novato',
      level: 20,
      difficulty: 'Intermedio',
      description: 'Estudiante con potencial excepcional',
      stats: { poder: 85, velocidad: 90, resistencia: 95 },
      rewards: { xp: 500, coins: 250 }
    },
    {
      id: 'megumi',
      name: 'Megumi Fushiguro',
      type: 'Hechicero de Sombras',
      level: 22,
      difficulty: 'Avanzado',
      description: 'Maestro de las técnicas de sombra',
      stats: { poder: 80, velocidad: 85, resistencia: 85 },
      rewards: { xp: 600, coins: 300 }
    }
  ]

  const handleCombatEnd = (winner) => {
    setShowCombat(false)
    if (winner) {
      toast.success(`🏆 ¡${winner.name} ha ganado el combate!`)
    }
  }

  const startCombat = (opponent) => {
    setSelectedOpponent(opponent)
    setShowCombat(true)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚔️</div>
          <h1 className="text-3xl font-bold text-white mb-4">Acceso Denegado</h1>
          <p className="text-gray-400">Debes iniciar sesión para acceder al combate</p>
        </div>
      </div>
    )
  }

  if (showCombat && selectedOpponent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black">
        <CombatSystem3D
          player={user}
          opponent={selectedOpponent}
          onCombatEnd={handleCombatEnd}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-6 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold text-gradient mb-4 drop-shadow-2xl">
            ⚔️ Arena de Combate 3D
          </h1>
          <p className="text-xl text-purple-300">
            Enfréntate a oponentes épicos en combates legendarios
          </p>
        </motion.div>

        {/* Información del jugador */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-600 shadow-2xl">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">👤 Tu Personaje</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2">🎭</div>
                <div className="text-lg font-bold text-white">{user.nombre}</div>
                <div className="text-gray-400">Nivel {user.nivel}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">⚡</div>
                <div className="text-lg font-bold text-yellow-400">{user.experiencia}</div>
                <div className="text-gray-400">Experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-lg font-bold text-green-400">{user.monedas}</div>
                <div className="text-gray-400">Monedas</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Oponentes disponibles */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center">
            🎯 Selecciona tu Oponente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opponents.map((opponent, index) => (
              <motion.div
                key={opponent.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-900/80 backdrop-blur-sm rounded-xl border-2 border-purple-600 shadow-2xl overflow-hidden"
              >
                {/* Header del oponente */}
                <div className="bg-gradient-to-r from-red-600 to-red-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-red-600">
                        {opponent.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{opponent.name}</h3>
                        <p className="text-red-200">{opponent.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-400">
                        Nivel {opponent.level}
                      </div>
                      <div className="text-sm text-gray-200">{opponent.difficulty}</div>
                    </div>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <p className="text-gray-300 mb-4">{opponent.description}</p>

                  {/* Estadísticas */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-400">{opponent.stats.poder}</div>
                      <div className="text-xs text-gray-400">Poder</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{opponent.stats.velocidad}</div>
                      <div className="text-xs text-gray-400">Velocidad</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{opponent.stats.resistencia}</div>
                      <div className="text-xs text-gray-400">Resistencia</div>
                    </div>
                  </div>

                  {/* Recompensas */}
                  <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-3 mb-4">
                    <h4 className="text-sm font-bold text-yellow-400 mb-2">🏆 Recompensas</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-yellow-300">⚡ {opponent.rewards.xp} XP</span>
                      <span className="text-yellow-300">💰 {opponent.rewards.coins} Monedas</span>
                    </div>
                  </div>

                  {/* Botón de combate */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startCombat(opponent)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition-all"
                  >
                    ⚔️ Iniciar Combate
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Instrucciones */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-600"
        >
          <h3 className="text-xl font-bold text-purple-400 mb-4">📋 Instrucciones de Combate</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-white mb-2">🎮 Controles</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <strong>Atacar:</strong> Gasta 20 energía</li>
                <li>• <strong>Defender:</strong> Reduce daño recibido</li>
                <li>• <strong>Especial:</strong> Gasta 50 energía</li>
                <li>• <strong>Energía:</strong> Se regenera automáticamente</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">💡 Estrategias</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <strong>Gestiona tu energía</strong> sabiamente</li>
                <li>• <strong>Usa defensa</strong> cuando estés en desventaja</li>
                <li>• <strong>Combina ataques</strong> con técnicas especiales</li>
                <li>• <strong>Observa patrones</strong> del oponente</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 