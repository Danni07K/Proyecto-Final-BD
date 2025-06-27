'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'

// Componente de métrica individual
function MetricCard({ title, value, change, icon, color, trend = 'up' }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-purple-600 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        <div className={`text-sm font-bold ${
          trend === 'up' ? 'text-green-400' : 'text-red-400'
        }`}>
          {trend === 'up' ? '↗' : '↘'} {change}%
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-2">{value}</div>
      <div className="text-gray-400 text-sm">{title}</div>
    </motion.div>
  )
}

// Componente de gráfico de actividad
function ActivityChart({ data }) {
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-purple-600 shadow-2xl">
      <h3 className="text-xl font-bold text-purple-400 mb-4">📈 Actividad Semanal</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="day" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #7c3aed',
              borderRadius: '8px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="activity" 
            stroke="#8b5cf6" 
            fillOpacity={1} 
            fill="url(#colorActivity)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// Componente de distribución de niveles
function LevelDistributionChart({ data }) {
  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-purple-600 shadow-2xl">
      <h3 className="text-xl font-bold text-purple-400 mb-4">📊 Distribución por Nivel</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #7c3aed',
              borderRadius: '8px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

// Componente de rendimiento por clase
function ClassPerformanceChart({ data }) {
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-purple-600 shadow-2xl">
      <h3 className="text-xl font-bold text-purple-400 mb-4">🏆 Rendimiento por Clase</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="clase" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #7c3aed',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar dataKey="promedioXP" fill="#8b5cf6" name="XP Promedio" />
          <Bar dataKey="misionesCompletadas" fill="#fbbf24" name="Misiones" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Componente de radar chart para habilidades
function SkillsRadarChart({ data }) {
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-purple-600 shadow-2xl">
      <h3 className="text-xl font-bold text-purple-400 mb-4">🎯 Análisis de Habilidades</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="skill" stroke="#9ca3af" />
          <PolarRadiusAxis stroke="#374151" />
          <Radar
            name="Promedio"
            dataKey="value"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.3}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #7c3aed',
              borderRadius: '8px'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Componente de tabla de estudiantes top
function TopStudentsTable({ students }) {
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-purple-600 shadow-2xl">
      <h3 className="text-xl font-bold text-purple-400 mb-4">🏆 Top Estudiantes</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 text-gray-300">Posición</th>
              <th className="text-left py-3 text-gray-300">Estudiante</th>
              <th className="text-left py-3 text-gray-300">Nivel</th>
              <th className="text-left py-3 text-gray-300">XP</th>
              <th className="text-left py-3 text-gray-300">Misiones</th>
              <th className="text-left py-3 text-gray-300">Tendencia</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <motion.tr
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                    </span>
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {student.nombre.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{student.nombre}</div>
                      <div className="text-gray-400 text-xs">{student.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-white">{student.nivel}</td>
                <td className="py-3 text-yellow-400 font-bold">{student.experiencia}</td>
                <td className="py-3 text-blue-400">{student.misionesCompletadas?.length || 0}</td>
                <td className="py-3">
                  <div className={`text-sm font-bold ${
                    student.tendencia === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {student.tendencia === 'up' ? '↗' : '↘'} {student.cambioXP}%
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Componente principal del dashboard de analytics
export default function AnalyticsDashboard({ user }) {
  const [timeRange, setTimeRange] = useState('week')
  const [isLoading, setIsLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState({
    metrics: {},
    activityData: [],
    levelDistribution: [],
    classPerformance: [],
    skillsData: [],
    topStudents: []
  })

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange])

  const loadAnalyticsData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/analytics?range=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.ok) {
        const data = await res.json()
        setAnalyticsData(data)
      } else {
        // Datos de ejemplo si no hay endpoint
        setAnalyticsData(getMockData())
      }
    } catch (error) {
      console.error('Error cargando analytics:', error)
      setAnalyticsData(getMockData())
    } finally {
      setIsLoading(false)
    }
  }

  const getMockData = () => ({
    metrics: {
      totalStudents: 156,
      activeStudents: 142,
      averageLevel: 12.5,
      totalXP: 125000,
      missionsCompleted: 892,
      averageEngagement: 87.3
    },
    activityData: [
      { day: 'Lun', activity: 45 },
      { day: 'Mar', activity: 52 },
      { day: 'Mié', activity: 38 },
      { day: 'Jue', activity: 67 },
      { day: 'Vie', activity: 73 },
      { day: 'Sáb', activity: 28 },
      { day: 'Dom', activity: 15 }
    ],
    levelDistribution: [
      { name: 'Nivel 1-5', value: 23 },
      { name: 'Nivel 6-10', value: 45 },
      { name: 'Nivel 11-15', value: 38 },
      { name: 'Nivel 16-20', value: 25 },
      { name: 'Nivel 21-25', value: 15 },
      { name: 'Nivel 26+', value: 10 }
    ],
    classPerformance: [
      { clase: '3A', promedioXP: 850, misionesCompletadas: 45 },
      { clase: '3B', promedioXP: 920, misionesCompletadas: 52 },
      { clase: '4A', promedioXP: 780, misionesCompletadas: 38 },
      { clase: '4B', promedioXP: 1100, misionesCompletadas: 67 },
      { clase: '5A', promedioXP: 1250, misionesCompletadas: 73 }
    ],
    skillsData: [
      { skill: 'Participación', value: 85 },
      { skill: 'Completación', value: 78 },
      { skill: 'Colaboración', value: 92 },
      { skill: 'Creatividad', value: 73 },
      { skill: 'Pensamiento Crítico', value: 81 },
      { skill: 'Comunicación', value: 88 }
    ],
    topStudents: [
      { id: 1, nombre: 'Daniel García', email: 'daniel@email.com', nivel: 25, experiencia: 2500, misionesCompletadas: [1,2,3], tendencia: 'up', cambioXP: 15 },
      { id: 2, nombre: 'María López', email: 'maria@email.com', nivel: 23, experiencia: 2300, misionesCompletadas: [1,2], tendencia: 'up', cambioXP: 12 },
      { id: 3, nombre: 'Carlos Ruiz', email: 'carlos@email.com', nivel: 22, experiencia: 2200, misionesCompletadas: [1], tendencia: 'down', cambioXP: 5 },
      { id: 4, nombre: 'Ana Martínez', email: 'ana@email.com', nivel: 21, experiencia: 2100, misionesCompletadas: [1,2,3,4], tendencia: 'up', cambioXP: 18 },
      { id: 5, nombre: 'Luis Pérez', email: 'luis@email.com', nivel: 20, experiencia: 2000, misionesCompletadas: [1,2], tendencia: 'up', cambioXP: 8 }
    ]
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
            Cargando Analytics...
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
            📊 Dashboard Analytics
          </h1>
          <p className="text-xl text-purple-300">
            Análisis detallado del rendimiento de tu academia
          </p>
        </motion.div>

        {/* Filtros de tiempo */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="flex gap-2 bg-gray-800/50 p-2 rounded-lg border border-purple-500/30">
            {[
              { key: 'week', label: '📅 Semana' },
              { key: 'month', label: '📅 Mes' },
              { key: 'quarter', label: '📅 Trimestre' },
              { key: 'year', label: '📅 Año' }
            ].map((period) => (
              <motion.button
                key={period.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeRange(period.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  timeRange === period.key
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {period.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Métricas principales */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <MetricCard
            title="Total Estudiantes"
            value={analyticsData.metrics.totalStudents}
            change={12}
            icon="👥"
            color="purple"
            trend="up"
          />
          <MetricCard
            title="Estudiantes Activos"
            value={analyticsData.metrics.activeStudents}
            change={8}
            icon="🔥"
            color="green"
            trend="up"
          />
          <MetricCard
            title="Nivel Promedio"
            value={analyticsData.metrics.averageLevel}
            change={15}
            icon="📈"
            color="blue"
            trend="up"
          />
          <MetricCard
            title="XP Total"
            value={analyticsData.metrics.totalXP.toLocaleString()}
            change={23}
            icon="⚡"
            color="yellow"
            trend="up"
          />
          <MetricCard
            title="Misiones Completadas"
            value={analyticsData.metrics.missionsCompleted}
            change={18}
            icon="🎯"
            color="red"
            trend="up"
          />
          <MetricCard
            title="Engagement Promedio"
            value={`${analyticsData.metrics.averageEngagement}%`}
            change={5}
            icon="💎"
            color="purple"
            trend="up"
          />
        </motion.div>

        {/* Gráficos */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          <ActivityChart data={analyticsData.activityData} />
          <LevelDistributionChart data={analyticsData.levelDistribution} />
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          <ClassPerformanceChart data={analyticsData.classPerformance} />
          <SkillsRadarChart data={analyticsData.skillsData} />
        </motion.div>

        {/* Tabla de estudiantes top */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <TopStudentsTable students={analyticsData.topStudents} />
        </motion.div>
      </div>
    </div>
  )
} 