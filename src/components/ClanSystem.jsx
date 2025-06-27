'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

// Configuración de roles de clan
const CLAN_ROLES = {
  'leader': {
    name: 'Líder',
    color: 'red',
    icon: '👑',
    permissions: ['manage_members', 'edit_clan', 'start_events', 'manage_roles']
  },
  'officer': {
    name: 'Oficial',
    color: 'purple',
    icon: '⚔️',
    permissions: ['manage_members', 'start_events']
  },
  'veteran': {
    name: 'Veterano',
    color: 'blue',
    icon: '🛡️',
    permissions: ['invite_members']
  },
  'member': {
    name: 'Miembro',
    color: 'green',
    icon: '👤',
    permissions: []
  },
  'recruit': {
    name: 'Recluta',
    color: 'gray',
    icon: '🌱',
    permissions: []
  }
}

// Componente de tarjeta de clan
function ClanCard({ clan, onJoin, onView, userRole = null }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getClanLevel = (xp) => {
    if (xp >= 100000) return { level: 10, name: 'Legendario', color: 'red' }
    if (xp >= 75000) return { level: 9, name: 'Épico', color: 'purple' }
    if (xp >= 50000) return { level: 8, name: 'Maestro', color: 'blue' }
    if (xp >= 30000) return { level: 7, name: 'Experto', color: 'green' }
    if (xp >= 15000) return { level: 6, name: 'Avanzado', color: 'yellow' }
    if (xp >= 8000) return { level: 5, name: 'Intermedio', color: 'orange' }
    if (xp >= 4000) return { level: 4, name: 'Novato', color: 'cyan' }
    if (xp >= 2000) return { level: 3, name: 'Iniciado', color: 'gray' }
    if (xp >= 1000) return { level: 2, name: 'Principiante', color: 'gray' }
    return { level: 1, name: 'Recién Formado', color: 'gray' }
  }

  const clanLevel = getClanLevel(clan.totalXP)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-900/80 backdrop-blur-sm rounded-xl border-2 border-purple-600 shadow-2xl overflow-hidden"
    >
      {/* Header del clan */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-purple-600">
              {clan.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{clan.name}</h3>
              <p className="text-purple-200">{clan.tag}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold text-${clanLevel.color}-400`}>
              Nivel {clanLevel.level}
            </div>
            <div className="text-sm text-gray-200">{clanLevel.name}</div>
          </div>
        </div>

        {/* Estadísticas básicas */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{clan.members.length}</div>
            <div className="text-sm text-gray-200">Miembros</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{clan.totalXP.toLocaleString()}</div>
            <div className="text-sm text-gray-200">XP Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{clan.rank}</div>
            <div className="text-sm text-gray-200">Ranking</div>
          </div>
        </div>
      </div>

      {/* Contenido del clan */}
      <div className="p-6">
        <p className="text-gray-300 mb-4">{clan.description}</p>

        {/* Líder del clan */}
        <div className="mb-4">
          <h4 className="text-sm font-bold text-white mb-2">👑 Líder del Clan</h4>
          <div className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
              {clan.leader.nombre.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-white">{clan.leader.nombre}</div>
              <div className="text-sm text-gray-400">Nivel {clan.leader.nivel}</div>
            </div>
          </div>
        </div>

        {/* Miembros destacados */}
        <div className="mb-4">
          <h4 className="text-sm font-bold text-white mb-2">⭐ Miembros Destacados</h4>
          <div className="grid grid-cols-2 gap-2">
            {clan.members.slice(1, 5).map((member, index) => (
              <div key={member.id} className="flex items-center gap-2 bg-gray-800/30 rounded-lg p-2">
                <div className="text-sm">
                  {index === 0 ? '🥈' : index === 1 ? '🥉' : `${index + 2}.`}
                </div>
                <div className="text-xs text-gray-300 truncate">{member.nombre}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Eventos activos */}
        {clan.activeEvents && clan.activeEvents.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-bold text-white mb-2">🎉 Eventos Activos</h4>
            <div className="space-y-2">
              {clan.activeEvents.map((event) => (
                <div key={event.id} className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-2">
                  <div className="text-sm font-semibold text-yellow-400">{event.name}</div>
                  <div className="text-xs text-yellow-300">{event.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3">
          {userRole ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onView(clan.id)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold transition-all"
            >
              🏠 Ver Clan
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onJoin(clan.id)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-all"
            >
              🤝 Unirse
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
                <h4 className="text-sm font-bold text-white mb-3">📊 Estadísticas Detalladas</h4>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Promedio de Nivel</div>
                    <div className="text-lg font-bold text-white">{clan.averageLevel}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Misiones Completadas</div>
                    <div className="text-lg font-bold text-white">{clan.missionsCompleted}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Fecha de Creación</div>
                    <div className="text-sm text-white">{new Date(clan.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Requisito Mínimo</div>
                    <div className="text-sm text-white">Nivel {clan.minLevel}</div>
                  </div>
                </div>

                {/* Alianzas */}
                {clan.alliances && clan.alliances.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-bold text-white mb-2">🤝 Alianzas</h5>
                    <div className="space-y-2">
                      {clan.alliances.map((alliance) => (
                        <div key={alliance.id} className="flex items-center gap-3 bg-blue-900/30 border border-blue-500 rounded-lg p-2">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {alliance.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-blue-400">{alliance.name}</div>
                            <div className="text-xs text-blue-300">Alianza desde {new Date(alliance.date).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Logros del clan */}
                <div>
                  <h5 className="text-sm font-bold text-white mb-2">🏆 Logros del Clan</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {clan.achievements.map((achievement) => (
                      <div key={achievement.id} className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-2 text-center">
                        <div className="text-lg mb-1">{achievement.icon}</div>
                        <div className="text-xs text-yellow-400 font-bold">{achievement.name}</div>
                        <div className="text-xs text-yellow-300">{achievement.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Componente de gestión de miembros
function ClanMembersManager({ clan, userRole, onUpdateRole, onKickMember }) {
  const canManageMembers = CLAN_ROLES[userRole]?.permissions.includes('manage_members')

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-600 shadow-2xl">
      <h3 className="text-xl font-bold text-purple-400 mb-4">👥 Gestión de Miembros</h3>
      
      <div className="space-y-3">
        {clan.members.map((member) => (
          <div key={member.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {member.nombre.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-white">{member.nombre}</div>
                <div className="text-sm text-gray-400">Nivel {member.nivel} • {member.role}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`px-2 py-1 rounded text-xs font-bold text-${CLAN_ROLES[member.role]?.color}-400 bg-${CLAN_ROLES[member.role]?.color}-900/30`}>
                {CLAN_ROLES[member.role]?.icon} {CLAN_ROLES[member.role]?.name}
              </div>
              
              {canManageMembers && member.role !== 'leader' && (
                <div className="flex gap-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onUpdateRole(member.id)}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-all"
                  >
                    ⚙️
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onKickMember(member.id)}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-all"
                  >
                    🚪
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente de eventos de clan
function ClanEvents({ clan, userRole, onStartEvent, onJoinEvent }) {
  const canStartEvents = CLAN_ROLES[userRole]?.permissions.includes('start_events')

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-600 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-purple-400">🎉 Eventos de Clan</h3>
        {canStartEvents && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onStartEvent()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold transition-all"
          >
            🚀 Crear Evento
          </motion.button>
        )}
      </div>
      
      <div className="space-y-4">
        {clan.events.map((event) => (
          <div key={event.id} className="bg-gray-800/50 rounded-lg p-4 border border-yellow-500/30">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-white">{event.name}</h4>
              <div className={`px-2 py-1 rounded text-xs font-bold ${
                event.status === 'active' ? 'text-green-400 bg-green-900/30' :
                event.status === 'upcoming' ? 'text-blue-400 bg-blue-900/30' :
                'text-gray-400 bg-gray-900/30'
              }`}>
                {event.status === 'active' ? '🟢 Activo' : 
                 event.status === 'upcoming' ? '🔵 Próximo' : '⚫ Finalizado'}
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-3">{event.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                📅 {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-400">
                👥 {event.participants.length}/{event.maxParticipants} participantes
              </div>
            </div>
            
            {event.status === 'active' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onJoinEvent(event.id)}
                className="w-full mt-3 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg font-bold transition-all"
              >
                🎯 Participar
              </motion.button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente principal del sistema de clanes
export default function ClanSystem({ user }) {
  const [clans, setClans] = useState([])
  const [userClan, setUserClan] = useState(null)
  const [showCreateClan, setShowCreateClan] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadClans()
  }, [])

  const loadClans = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/clans', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.ok) {
        const data = await res.json()
        setClans(data.clans)
        setUserClan(data.userClan)
      } else {
        // Datos de ejemplo
        setClans(getMockClans())
        setUserClan(null)
      }
    } catch (error) {
      console.error('Error cargando clanes:', error)
      setClans(getMockClans())
      setUserClan(null)
    } finally {
      setIsLoading(false)
    }
  }

  const getMockClans = () => [
    {
      id: 1,
      name: 'Shadow Hunters',
      tag: '[SH]',
      description: 'Clan especializado en técnicas de sombra y sigilo. Buscamos hechiceros que dominen el arte de la discreción.',
      totalXP: 85000,
      rank: 1,
      averageLevel: 18,
      missionsCompleted: 1250,
      createdAt: '2024-01-15',
      minLevel: 10,
      leader: { id: 1, nombre: 'Megumi Fushiguro', nivel: 25 },
      members: [
        { id: 1, nombre: 'Megumi Fushiguro', nivel: 25, role: 'leader' },
        { id: 2, nombre: 'Yuji Itadori', nivel: 23, role: 'officer' },
        { id: 3, nombre: 'Nobara Kugisaki', nivel: 22, role: 'veteran' },
        { id: 4, nombre: 'Satoru Gojo', nivel: 30, role: 'member' }
      ],
      activeEvents: [
        { id: 1, name: 'Cacería Nocturna', description: 'Misión especial de sigilo' }
      ],
      alliances: [
        { id: 1, name: 'Light Warriors', date: '2024-02-01' }
      ],
      achievements: [
        { id: 1, name: 'Primer Lugar', icon: '🥇', date: '2024-01-30' },
        { id: 2, name: '1000 Misiones', icon: '🎯', date: '2024-01-25' }
      ],
      events: [
        {
          id: 1,
          name: 'Cacería Nocturna',
          description: 'Misión especial de sigilo para miembros del clan',
          status: 'active',
          startDate: '2024-02-01',
          endDate: '2024-02-07',
          participants: [],
          maxParticipants: 10
        }
      ]
    },
    {
      id: 2,
      name: 'Light Warriors',
      tag: '[LW]',
      description: 'Clan de hechiceros que dominan técnicas de luz y energía positiva. Luchamos por la justicia.',
      totalXP: 72000,
      rank: 2,
      averageLevel: 16,
      missionsCompleted: 980,
      createdAt: '2024-01-20',
      minLevel: 8,
      leader: { id: 5, nombre: 'Satoru Gojo', nivel: 30 },
      members: [
        { id: 5, nombre: 'Satoru Gojo', nivel: 30, role: 'leader' },
        { id: 6, nombre: 'Yuta Okkotsu', nivel: 28, role: 'officer' },
        { id: 7, nombre: 'Maki Zenin', nivel: 26, role: 'veteran' }
      ],
      activeEvents: [],
      alliances: [
        { id: 1, name: 'Shadow Hunters', date: '2024-02-01' }
      ],
      achievements: [
        { id: 3, name: 'Segundo Lugar', icon: '🥈', date: '2024-01-30' }
      ],
      events: []
    }
  ]

  const joinClan = async (clanId) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/clans/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ clanId })
      })

      if (res.ok) {
        toast.success('🎉 ¡Te has unido al clan!')
        loadClans() // Recargar clanes
      } else {
        const error = await res.json()
        toast.error(error.message || 'Error al unirse al clan')
      }
    } catch (error) {
      toast.error('Error al unirse al clan')
    }
  }

  const leaveClan = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/clans/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (res.ok) {
        toast.success('Has abandonado el clan')
        loadClans() // Recargar clanes
      } else {
        const error = await res.json()
        toast.error(error.message || 'Error al abandonar el clan')
      }
    } catch (error) {
      toast.error('Error al abandonar el clan')
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
            Cargando Clanes...
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
            🏰 Sistema de Clanes
          </h1>
          <p className="text-xl text-purple-300">
            Únete a un clan y forma alianzas épicas
          </p>
        </motion.div>

        {/* Clan del usuario */}
        {userClan && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-green-400 mb-6">🏠 Mi Clan</h2>
            <ClanCard
              clan={userClan}
              onView={() => console.log('Ver clan')}
              userRole="member"
            />
            
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ClanMembersManager
                clan={userClan}
                userRole="member"
                onUpdateRole={() => console.log('Actualizar rol')}
                onKickMember={() => console.log('Expulsar miembro')}
              />
              <ClanEvents
                clan={userClan}
                userRole="member"
                onStartEvent={() => console.log('Crear evento')}
                onJoinEvent={() => console.log('Unirse a evento')}
              />
            </div>
          </motion.div>
        )}

        {/* Clanes disponibles */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-purple-400">🏆 Clanes Disponibles</h2>
            {!userClan && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateClan(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-all"
              >
                🚀 Crear Clan
              </motion.button>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {clans.map((clan) => (
              <ClanCard
                key={clan.id}
                clan={clan}
                onJoin={joinClan}
                onView={() => console.log('Ver clan')}
              />
            ))}
          </div>
        </motion.div>

        {/* Modal de crear clan */}
        <AnimatePresence>
          {showCreateClan && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowCreateClan(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-6 max-w-md w-full border border-purple-500"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-purple-400 mb-4">🚀 Crear Clan</h3>
                <p className="text-gray-300 mb-6">
                  Forma tu propio clan y reúne a hechiceros poderosos
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Nombre del Clan</label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      placeholder="Ej: Shadow Hunters"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Tag del Clan</label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      placeholder="Ej: [SH]"
                      maxLength={4}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Descripción</label>
                    <textarea
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      rows={3}
                      placeholder="Describe tu clan..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Nivel Mínimo</label>
                    <input
                      type="number"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      placeholder="5"
                      min="1"
                      max="50"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateClan(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-bold transition-all"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      toast.success('🏰 ¡Clan creado exitosamente!')
                      setShowCreateClan(false)
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-all"
                  >
                    Crear Clan
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 