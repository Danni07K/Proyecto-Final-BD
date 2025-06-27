'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

// Configuración de eventos
const EVENT_TYPES = {
  'daily_challenge': {
    name: '🎯 Desafío Diario',
    description: 'Completa misiones especiales para obtener recompensas únicas',
    duration: 24 * 60 * 60 * 1000, // 24 horas
    rewards: { xp: 500, coins: 200, items: ['rare_accessory'] },
    color: 'purple'
  },
  'weekly_tournament': {
    name: '🏆 Torneo Semanal',
    description: 'Compite contra otros estudiantes en un torneo épico',
    duration: 7 * 24 * 60 * 60 * 1000, // 7 días
    rewards: { xp: 2000, coins: 1000, items: ['legendary_accessory', 'special_title'] },
    color: 'yellow'
  },
  'monthly_competition': {
    name: '🌟 Competencia Mensual',
    description: 'La competencia más grande del mes con premios legendarios',
    duration: 30 * 24 * 60 * 60 * 1000, // 30 días
    rewards: { xp: 5000, coins: 2500, items: ['mythic_accessory', 'exclusive_avatar'] },
    color: 'red'
  },
  'special_event': {
    name: '🎉 Evento Especial',
    description: 'Eventos únicos con temáticas especiales de Jujutsu Kaisen',
    duration: 3 * 24 * 60 * 60 * 1000, // 3 días
    rewards: { xp: 1500, coins: 750, items: ['event_exclusive'] },
    color: 'blue'
  }
}

// Componente de temporizador
function EventTimer({ endTime, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime - Date.now()
      if (difference > 0) {
        setTimeLeft(difference)
      } else {
        setTimeLeft(0)
        if (onExpire) onExpire()
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endTime, onExpire])

  const formatTime = (ms) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    } else {
      return `${minutes}m ${seconds}s`
    }
  }

  const getProgressPercentage = () => {
    const totalDuration = EVENT_TYPES.daily_challenge.duration // Usar como referencia
    return Math.max(0, Math.min(100, ((totalDuration - timeLeft) / totalDuration) * 100))
  }

  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500">
      <div className="text-center mb-3">
        <div className="text-2xl font-bold text-purple-400 mb-1">
          {formatTime(timeLeft)}
        </div>
        <div className="text-sm text-gray-400">Tiempo Restante</div>
      </div>
      
      {/* Barra de progreso */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
        <div 
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>
      
      <div className="text-xs text-gray-400 text-center">
        {getProgressPercentage().toFixed(1)}% completado
      </div>
    </div>
  )
}

// Componente de tarjeta de evento
function EventCard({ event, onJoin, onLeave, isParticipating, userRank }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getEventColor = (type) => {
    const colors = {
      'daily_challenge': 'purple',
      'weekly_tournament': 'yellow',
      'monthly_competition': 'red',
      'special_event': 'blue'
    }
    return colors[type] || 'purple'
  }

  const color = getEventColor(event.type)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gray-900/80 backdrop-blur-sm rounded-xl border-2 border-${color}-500 shadow-2xl overflow-hidden`}
    >
      {/* Header del evento */}
      <div className={`bg-gradient-to-r from-${color}-600 to-${color}-800 p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{event.name}</h3>
            <p className="text-gray-200">{event.description}</p>
          </div>
          <div className="text-4xl">{event.icon}</div>
        </div>

        {/* Estado del evento */}
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${
            event.status === 'active' 
              ? 'bg-green-500 text-white' 
              : event.status === 'upcoming'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-500 text-white'
          }`}>
            {event.status === 'active' ? '🟢 Activo' : 
             event.status === 'upcoming' ? '🔵 Próximo' : '⚫ Finalizado'}
          </div>
          
          {isParticipating && (
            <div className="px-3 py-1 bg-yellow-500 text-black rounded-full text-sm font-bold">
              🏆 Participando
            </div>
          )}
        </div>
      </div>

      {/* Contenido del evento */}
      <div className="p-6">
        {/* Temporizador */}
        {event.status === 'active' && (
          <EventTimer 
            endTime={event.endTime} 
            onExpire={() => console.log('Evento expirado')}
          />
        )}

        {/* Recompensas */}
        <div className="mt-6">
          <h4 className="text-lg font-bold text-white mb-3">🏆 Recompensas</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-3 text-center">
              <div className="text-yellow-400 font-bold text-lg">⚡ {event.rewards.xp}</div>
              <div className="text-yellow-300 text-sm">XP</div>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-3 text-center">
              <div className="text-yellow-400 font-bold text-lg">💰 {event.rewards.coins}</div>
              <div className="text-yellow-300 text-sm">Monedas</div>
            </div>
            <div className="bg-purple-900/30 border border-purple-500 rounded-lg p-3 text-center">
              <div className="text-purple-400 font-bold text-lg">🎁 {event.rewards.items.length}</div>
              <div className="text-purple-300 text-sm">Items</div>
            </div>
          </div>
        </div>

        {/* Participantes */}
        {event.participants && (
          <div className="mt-6">
            <h4 className="text-lg font-bold text-white mb-3">
              👥 Participantes ({event.participants.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {event.participants.slice(0, 8).map((participant, index) => (
                <div key={participant.id} className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-2">
                  <div className="text-sm">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                  </div>
                  <div className="text-xs text-gray-300 truncate">{participant.nombre}</div>
                </div>
              ))}
              {event.participants.length > 8 && (
                <div className="text-xs text-gray-400 flex items-center justify-center">
                  +{event.participants.length - 8} más
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ranking del usuario */}
        {isParticipating && userRank && (
          <div className="mt-4 p-3 bg-purple-900/30 border border-purple-500 rounded-lg">
            <div className="text-center">
              <div className="text-purple-400 font-bold">Tu Posición</div>
              <div className="text-2xl font-bold text-white">#{userRank}</div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="mt-6 flex gap-3">
          {event.status === 'active' && !isParticipating && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onJoin(event.id)}
              className={`flex-1 bg-${color}-600 hover:bg-${color}-700 text-white py-3 rounded-lg font-bold transition-all`}
            >
              🚀 Unirse al Evento
            </motion.button>
          )}
          
          {event.status === 'active' && isParticipating && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onLeave(event.id)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition-all"
            >
              ❌ Abandonar
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-all"
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
                <h4 className="text-lg font-bold text-white mb-3">📋 Detalles del Evento</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div><strong>Inicio:</strong> {new Date(event.startTime).toLocaleString()}</div>
                  <div><strong>Fin:</strong> {new Date(event.endTime).toLocaleString()}</div>
                  <div><strong>Duración:</strong> {Math.floor(event.duration / (1000 * 60 * 60 * 24))} días</div>
                  <div><strong>Participantes máximos:</strong> {event.maxParticipants || 'Ilimitado'}</div>
                  <div><strong>Nivel mínimo:</strong> {event.minLevel || 'Cualquiera'}</div>
                </div>

                {/* Reglas del evento */}
                {event.rules && (
                  <div className="mt-4">
                    <h5 className="font-bold text-white mb-2">📜 Reglas</h5>
                    <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                      {event.rules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
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

// Componente de leaderboard
function EventLeaderboard({ participants, currentUser }) {
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-600 shadow-2xl">
      <h3 className="text-xl font-bold text-purple-400 mb-4">🏆 Leaderboard</h3>
      <div className="space-y-2">
        {participants.map((participant, index) => (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-3 rounded-lg ${
              participant.id === currentUser?.id 
                ? 'bg-purple-900/30 border border-purple-500' 
                : 'bg-gray-800/30 hover:bg-gray-700/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-lg font-bold">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
              </div>
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {participant.nombre.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-white">{participant.nombre}</div>
                <div className="text-sm text-gray-400">Nivel {participant.nivel}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-yellow-400">{participant.score}</div>
              <div className="text-sm text-gray-400">puntos</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Componente principal del sistema de eventos
export default function EventSystem({ user }) {
  const [events, setEvents] = useState([])
  const [userEvents, setUserEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/events', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.ok) {
        const data = await res.json()
        setEvents(data.events)
        setUserEvents(data.userEvents)
      } else {
        // Datos de ejemplo
        setEvents(getMockEvents())
        setUserEvents([])
      }
    } catch (error) {
      console.error('Error cargando eventos:', error)
      setEvents(getMockEvents())
      setUserEvents([])
    } finally {
      setIsLoading(false)
    }
  }

  const getMockEvents = () => [
    {
      id: 1,
      type: 'daily_challenge',
      name: '🎯 Desafío Diario: Técnicas Básicas',
      description: 'Domina las técnicas fundamentales de Jujutsu Kaisen',
      icon: '🎯',
      status: 'active',
      startTime: Date.now() - 6 * 60 * 60 * 1000, // 6 horas atrás
      endTime: Date.now() + 18 * 60 * 60 * 1000, // 18 horas restantes
      duration: 24 * 60 * 60 * 1000,
      rewards: { xp: 500, coins: 200, items: ['rare_accessory'] },
      participants: [
        { id: 1, nombre: 'Daniel', nivel: 25, score: 850 },
        { id: 2, nombre: 'María', nivel: 23, score: 720 },
        { id: 3, nombre: 'Carlos', nivel: 22, score: 680 }
      ],
      maxParticipants: 50,
      minLevel: 5,
      rules: [
        'Completa al menos 3 misiones diarias',
        'No se permiten trampas o exploits',
        'Los puntos se calculan por completación y velocidad'
      ]
    },
    {
      id: 2,
      type: 'weekly_tournament',
      name: '🏆 Torneo Semanal: Batalla de Hechiceros',
      description: 'El torneo más épico de la semana',
      icon: '🏆',
      status: 'upcoming',
      startTime: Date.now() + 2 * 24 * 60 * 60 * 1000, // 2 días
      endTime: Date.now() + 9 * 24 * 60 * 60 * 1000, // 9 días
      duration: 7 * 24 * 60 * 60 * 1000,
      rewards: { xp: 2000, coins: 1000, items: ['legendary_accessory', 'special_title'] },
      participants: [],
      maxParticipants: 100,
      minLevel: 10,
      rules: [
        'Combate 1v1 contra otros participantes',
        'Sistema de eliminación simple',
        'Los ganadores avanzan a la siguiente ronda'
      ]
    },
    {
      id: 3,
      type: 'special_event',
      name: '🎉 Evento Especial: Gojo vs Sukuna',
      description: 'Celebra el enfrentamiento más épico',
      icon: '🎉',
      status: 'active',
      startTime: Date.now() - 12 * 60 * 60 * 1000, // 12 horas atrás
      endTime: Date.now() + 12 * 60 * 60 * 1000, // 12 horas restantes
      duration: 3 * 24 * 60 * 60 * 1000,
      rewards: { xp: 1500, coins: 750, items: ['event_exclusive'] },
      participants: [
        { id: 1, nombre: 'Daniel', nivel: 25, score: 1200 },
        { id: 4, nombre: 'Ana', nivel: 21, score: 980 },
        { id: 5, nombre: 'Luis', nivel: 20, score: 850 }
      ],
      maxParticipants: 200,
      minLevel: 1,
      rules: [
        'Participa en misiones temáticas de Gojo y Sukuna',
        'Colecciona fragmentos de energía maldita',
        'El participante con más fragmentos gana'
      ]
    }
  ]

  const joinEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/events/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ eventId })
      })

      if (res.ok) {
        toast.success('🎉 ¡Te has unido al evento!')
        loadEvents() // Recargar eventos
      } else {
        const error = await res.json()
        toast.error(error.message || 'Error al unirse al evento')
      }
    } catch (error) {
      toast.error('Error al unirse al evento')
    }
  }

  const leaveEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/events/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ eventId })
      })

      if (res.ok) {
        toast.success('Has abandonado el evento')
        loadEvents() // Recargar eventos
      } else {
        const error = await res.json()
        toast.error(error.message || 'Error al abandonar el evento')
      }
    } catch (error) {
      toast.error('Error al abandonar el evento')
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
            <div className="absolute inset-0 w-20 h-20 border-4 border-yellow-500 border-b-transparent rounded-full animate-spin mx-auto" 
                 style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <motion.p 
            className="text-white text-xl font-bold text-gradient"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Cargando Eventos...
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
            🎉 Sistema de Eventos
          </h1>
          <p className="text-xl text-purple-300">
            Participa en eventos épicos y gana recompensas legendarias
          </p>
        </motion.div>

        {/* Eventos activos */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-purple-400 mb-6">🔥 Eventos Activos</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.filter(e => e.status === 'active').map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onJoin={joinEvent}
                onLeave={leaveEvent}
                isParticipating={userEvents.some(ue => ue.eventId === event.id)}
                userRank={event.participants.findIndex(p => p.id === user?.id) + 1}
              />
            ))}
          </div>
        </motion.div>

        {/* Eventos próximos */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-blue-400 mb-6">🔮 Eventos Próximos</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.filter(e => e.status === 'upcoming').map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onJoin={joinEvent}
                onLeave={leaveEvent}
                isParticipating={false}
              />
            ))}
          </div>
        </motion.div>

        {/* Mis eventos */}
        {userEvents.length > 0 && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-green-400 mb-6">🎯 Mis Eventos</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userEvents.map((userEvent) => {
                const event = events.find(e => e.id === userEvent.eventId)
                if (!event) return null
                
                return (
                  <EventCard
                    key={event.id}
                    event={event}
                    onJoin={joinEvent}
                    onLeave={leaveEvent}
                    isParticipating={true}
                    userRank={event.participants.findIndex(p => p.id === user?.id) + 1}
                  />
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Leaderboard general */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-yellow-400 mb-6">🏆 Leaderboard General</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.filter(e => e.status === 'active' && e.participants.length > 0).map((event) => (
              <div key={event.id}>
                <h3 className="text-xl font-bold text-purple-400 mb-4">{event.name}</h3>
                <EventLeaderboard 
                  participants={event.participants} 
                  currentUser={user}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 