'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

// Configuración de algoritmos de recomendación
const RECOMMENDATION_ALGORITHMS = {
  'collaborative_filtering': {
    name: 'Filtrado Colaborativo',
    description: 'Basado en el comportamiento de usuarios similares',
    accuracy: 85,
    icon: '👥'
  },
  'content_based': {
    name: 'Basado en Contenido',
    description: 'Analiza tus preferencias y patrones',
    accuracy: 78,
    icon: '📊'
  },
  'hybrid': {
    name: 'Híbrido Avanzado',
    description: 'Combina múltiples algoritmos para máxima precisión',
    accuracy: 92,
    icon: '🧠'
  }
}

// Componente de recomendación individual
function RecommendationCard({ recommendation, onAccept, onReject, type }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getTypeColor = (type) => {
    const colors = {
      'mission': 'purple',
      'accessory': 'blue',
      'strategy': 'green',
      'social': 'yellow',
      'learning': 'red'
    }
    return colors[type] || 'purple'
  }

  const getTypeIcon = (type) => {
    const icons = {
      'mission': '🎯',
      'accessory': '🛍️',
      'strategy': '⚡',
      'social': '👥',
      'learning': '📚'
    }
    return icons[type] || '💡'
  }

  const color = getTypeColor(type)
  const icon = getTypeIcon(type)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gray-900/80 backdrop-blur-sm rounded-xl border-2 border-${color}-500 shadow-2xl overflow-hidden`}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r from-${color}-600 to-${color}-800 p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{icon}</div>
            <div>
              <h3 className="text-lg font-bold text-white">{recommendation.title}</h3>
              <p className="text-sm text-gray-200">{recommendation.subtitle}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">{recommendation.confidence}%</div>
            <div className="text-xs text-gray-200">Confianza</div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <p className="text-gray-300 mb-4">{recommendation.description}</p>

        {/* Razones de la recomendación */}
        <div className="mb-4">
          <h4 className="text-sm font-bold text-white mb-2">🤔 ¿Por qué te lo recomiendo?</h4>
          <ul className="text-sm text-gray-400 space-y-1">
            {recommendation.reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Beneficios esperados */}
        <div className="mb-4">
          <h4 className="text-sm font-bold text-white mb-2">🎯 Beneficios esperados</h4>
          <div className="grid grid-cols-2 gap-2">
            {recommendation.benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-2 text-center">
                <div className="text-yellow-400 font-bold text-sm">{benefit.value}</div>
                <div className="text-xs text-gray-400">{benefit.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dificultad y tiempo */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Dificultad:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`text-lg ${
                  star <= recommendation.difficulty ? 'text-yellow-400' : 'text-gray-600'
                }`}>
                  ★
                </span>
              ))}
            </div>
          </div>
          <div className="text-gray-400">
            ⏱️ {recommendation.estimatedTime}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAccept(recommendation)}
            className={`flex-1 bg-${color}-600 hover:bg-${color}-700 text-white py-2 rounded-lg font-bold transition-all`}
          >
            ✅ Aceptar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onReject(recommendation)}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-bold transition-all"
          >
            ❌ Rechazar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-all"
          >
            {isExpanded ? '📖 Menos' : '📖 Más'}
          </motion.button>
        </div>

        {/* Detalles expandidos */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-sm font-bold text-white mb-3">📊 Análisis Detallado</h4>
                
                {/* Métricas de IA */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Precisión del Modelo</div>
                    <div className="text-lg font-bold text-green-400">{recommendation.modelAccuracy}%</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Usuarios Similares</div>
                    <div className="text-lg font-bold text-blue-400">{recommendation.similarUsers}</div>
                  </div>
                </div>

                {/* Patrones detectados */}
                <div className="mb-4">
                  <h5 className="text-sm font-bold text-white mb-2">🔍 Patrones Detectados</h5>
                  <div className="space-y-2">
                    {recommendation.patterns.map((pattern, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-gray-300">{pattern}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alternativas */}
                {recommendation.alternatives && (
                  <div>
                    <h5 className="text-sm font-bold text-white mb-2">🔄 Alternativas Similares</h5>
                    <div className="space-y-2">
                      {recommendation.alternatives.map((alt, index) => (
                        <div key={index} className="bg-gray-800/30 rounded-lg p-2 text-sm">
                          <div className="font-semibold text-gray-200">{alt.title}</div>
                          <div className="text-gray-400">{alt.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Componente de análisis de comportamiento
function BehaviorAnalysis({ userData, recommendations }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week')

  const getBehaviorInsights = () => {
    return {
      learningStyle: 'Visual y Práctico',
      preferredDifficulty: 'Intermedio',
      activeHours: '14:00 - 18:00',
      favoriteMissions: 'Combate y Estrategia',
      socialTendency: 'Colaborativo',
      improvementAreas: ['Técnicas Avanzadas', 'Velocidad de Respuesta']
    }
  }

  const insights = getBehaviorInsights()

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-600 shadow-2xl">
      <h3 className="text-xl font-bold text-purple-400 mb-4">🧠 Análisis de Comportamiento</h3>
      
      {/* Filtro de tiempo */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'week', label: '📅 Semana' },
          { key: 'month', label: '📅 Mes' },
          { key: 'quarter', label: '📅 Trimestre' }
        ].map((timeframe) => (
          <motion.button
            key={timeframe.key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTimeframe(timeframe.key)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
              selectedTimeframe === timeframe.key
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {timeframe.label}
          </motion.button>
        ))}
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-1">🎓 Estilo de Aprendizaje</div>
            <div className="text-white font-semibold">{insights.learningStyle}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-1">⚡ Dificultad Preferida</div>
            <div className="text-white font-semibold">{insights.preferredDifficulty}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-1">🕐 Horas Activas</div>
            <div className="text-white font-semibold">{insights.activeHours}</div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-1">🎯 Misiones Favoritas</div>
            <div className="text-white font-semibold">{insights.favoriteMissions}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-1">👥 Tendencia Social</div>
            <div className="text-white font-semibold">{insights.socialTendency}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-1">📈 Áreas de Mejora</div>
            <div className="text-white font-semibold text-sm">
              {insights.improvementAreas.join(', ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente principal del sistema de IA
export default function AIRecommendationSystem({ user }) {
  const [recommendations, setRecommendations] = useState([])
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('hybrid')
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState([])

  useEffect(() => {
    loadRecommendations()
  }, [selectedAlgorithm])

  const loadRecommendations = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/ai/recommendations?algorithm=${selectedAlgorithm}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.ok) {
        const data = await res.json()
        setRecommendations(data.recommendations)
      } else {
        // Datos de ejemplo
        setRecommendations(getMockRecommendations())
      }
    } catch (error) {
      console.error('Error cargando recomendaciones:', error)
      setRecommendations(getMockRecommendations())
    } finally {
      setIsLoading(false)
    }
  }

  const getMockRecommendations = () => [
    {
      id: 1,
      type: 'mission',
      title: 'Técnica del Infinito Avanzada',
      subtitle: 'Domina la técnica más poderosa de Gojo',
      description: 'Basándome en tu progreso con técnicas espaciales, esta misión te ayudará a alcanzar el siguiente nivel.',
      confidence: 94,
      reasons: [
        'Has completado 5 misiones de técnicas espaciales',
        'Tu nivel actual es óptimo para este desafío',
        'Otros usuarios similares tuvieron éxito con esta misión'
      ],
      benefits: [
        { label: 'XP', value: '+500' },
        { label: 'Monedas', value: '+200' },
        { label: 'Nivel', value: '+1' },
        { label: 'Habilidad', value: '+15%' }
      ],
      difficulty: 4,
      estimatedTime: '2-3 horas',
      modelAccuracy: 92,
      similarUsers: 47,
      patterns: [
        'Prefieres misiones de alta dificultad',
        'Tienes buen rendimiento en técnicas espaciales',
        'Activo durante las tardes'
      ],
      alternatives: [
        { title: 'Técnica de Sombras', description: 'Alternativa más fácil pero igualmente efectiva' },
        { title: 'Combate Avanzado', description: 'Enfoque en habilidades de combate' }
      ]
    },
    {
      id: 2,
      type: 'accessory',
      title: 'Amuleto de Energía Maldita',
      subtitle: 'Aumenta tu poder de maldición',
      description: 'Este accesorio complementa perfectamente tu estilo de combate actual.',
      confidence: 87,
      reasons: [
        'Compatible con tu personaje actual',
        'Mejora tus estadísticas débiles',
        'Precio accesible para tu presupuesto'
      ],
      benefits: [
        { label: 'Poder', value: '+25' },
        { label: 'Resistencia', value: '+15' },
        { label: 'Energía', value: '+30' },
        { label: 'Rareza', value: 'Épico' }
      ],
      difficulty: 2,
      estimatedTime: '30 min',
      modelAccuracy: 87,
      similarUsers: 23,
      patterns: [
        'Prefieres accesorios que aumenten poder',
        'Tienes suficientes monedas para esta compra',
        'Te gustan los items épicos'
      ]
    },
    {
      id: 3,
      type: 'strategy',
      title: 'Optimización de XP',
      subtitle: 'Maximiza tu ganancia de experiencia',
      description: 'Basándome en tu patrón de juego, esta estrategia te ayudará a subir de nivel más rápido.',
      confidence: 91,
      reasons: [
        'Tu horario de juego es consistente',
        'Completas misiones diarias regularmente',
                'Tienes potencial para optimizar tu tiempo'
      ],
      benefits: [
        { label: 'XP/Hr', value: '+40%' },
        { label: 'Eficiencia', value: '+35%' },
        { label: 'Tiempo', value: '-25%' },
        { label: 'Consistencia', value: '+50%' }
      ],
      difficulty: 3,
      estimatedTime: '1 hora',
      modelAccuracy: 91,
      similarUsers: 156,
      patterns: [
        'Juegas 2-3 horas diarias',
        'Completas misiones en orden de dificultad',
        'Prefieres misiones que den XP alto'
      ]
    }
  ]

  const acceptRecommendation = async (recommendation) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          recommendationId: recommendation.id,
          action: 'accept',
          feedback: 'positive'
        })
      })

      if (res.ok) {
        toast.success('✅ Recomendación aceptada. ¡Gracias por el feedback!')
        setFeedback(prev => [...prev, { id: recommendation.id, action: 'accept' }])
        
        // Aplicar la recomendación según el tipo
        switch (recommendation.type) {
          case 'mission':
            // Redirigir a la misión
            window.location.href = `/misiones?recommended=${recommendation.id}`
            break
          case 'accessory':
            // Redirigir a la tienda
            window.location.href = `/perfil/estudiante/tienda?recommended=${recommendation.id}`
            break
          case 'strategy':
            // Mostrar guía de estrategia
            toast.success('📖 Guía de estrategia aplicada')
            break
        }
      }
    } catch (error) {
      toast.error('Error al procesar la recomendación')
    }
  }

  const rejectRecommendation = async (recommendation) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          recommendationId: recommendation.id,
          action: 'reject',
          feedback: 'negative'
        })
      })

      if (res.ok) {
        toast.success('❌ Recomendación rechazada. Mejoraré mis sugerencias.')
        setFeedback(prev => [...prev, { id: recommendation.id, action: 'reject' }])
        
        // Remover de la lista
        setRecommendations(prev => prev.filter(r => r.id !== recommendation.id))
      }
    } catch (error) {
      toast.error('Error al procesar el feedback')
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
            <div className="absolute inset-0 w-20 h-20 border-4 border-blue-500 border-b-transparent rounded-full animate-spin mx-auto" 
                 style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <motion.p 
            className="text-white text-xl font-bold text-gradient"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Analizando tu comportamiento...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-6 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold text-gradient mb-4 drop-shadow-2xl">
            🤖 IA de Recomendaciones
          </h1>
          <p className="text-xl text-purple-300">
            Descubre contenido personalizado basado en tu comportamiento
          </p>
        </motion.div>

        {/* Selector de algoritmo */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-purple-400 mb-4">🧠 Algoritmo de IA</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(RECOMMENDATION_ALGORITHMS).map(([key, algorithm]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedAlgorithm === key
                    ? 'border-purple-500 bg-purple-900/30'
                    : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                }`}
                onClick={() => setSelectedAlgorithm(key)}
              >
                <div className="text-2xl mb-2">{algorithm.icon}</div>
                <h3 className="font-bold text-white mb-2">{algorithm.name}</h3>
                <p className="text-sm text-gray-300 mb-3">{algorithm.description}</p>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">{algorithm.accuracy}%</div>
                  <div className="text-xs text-gray-400">Precisión</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Análisis de comportamiento */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <BehaviorAnalysis userData={user} recommendations={recommendations} />
        </motion.div>

        {/* Recomendaciones */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-purple-400 mb-6">
            💡 Recomendaciones Personalizadas
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                onAccept={acceptRecommendation}
                onReject={rejectRecommendation}
                type={recommendation.type}
              />
            ))}
          </div>
        </motion.div>

        {/* Feedback histórico */}
        {feedback.length > 0 && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-purple-400 mb-4">📊 Historial de Feedback</h2>
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-600">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {feedback.filter(f => f.action === 'accept').length}
                  </div>
                  <div className="text-sm text-gray-400">Aceptadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {feedback.filter(f => f.action === 'reject').length}
                  </div>
                  <div className="text-sm text-gray-400">Rechazadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {Math.round((feedback.filter(f => f.action === 'accept').length / feedback.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-400">Tasa de Aceptación</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
} 