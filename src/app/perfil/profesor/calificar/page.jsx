'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function CalificarPage() {
  const [estudiantes, setEstudiantes] = useState([])
  const [clases, setClases] = useState([])
  const [claseSeleccionada, setClaseSeleccionada] = useState('')
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null)
  const [tipoCalificacion, setTipoCalificacion] = useState('positivo')
  const [cantidad, setCantidad] = useState(1)
  const [motivo, setMotivo] = useState('')
  const [cargando, setCargando] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    cargarClases()
  }, [])

  useEffect(() => {
    if (claseSeleccionada) {
      cargarEstudiantes()
    }
  }, [claseSeleccionada])

  const cargarClases = async () => {
    const token = localStorage.getItem('token')
    if (!token) return toast.error('Debes iniciar sesión')
    const res = await fetch('/api/clases', {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      setClases(data)
    } else {
      toast.error('Error al cargar clases')
    }
  }

  const cargarEstudiantes = async () => {
    const token = localStorage.getItem('token')
    if (!token) return toast.error('Debes iniciar sesión')
    const res = await fetch('/api/usuarios', {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      const estudiantesClase = data.filter(u => u.clase?._id === claseSeleccionada)
      setEstudiantes(estudiantesClase)
    } else {
      toast.error('Error al cargar estudiantes')
    }
  }

  const reproducirSonido = () => {
    if (!audioEnabled) return
    
    try {
      const audio = new Audio('/sounds/energia-maldita.mp3')
      audio.volume = 0.6
      audio.play().catch(err => {
        console.log('Audio no pudo reproducirse:', err)
      })
    } catch (error) {
      console.log('Error al reproducir audio:', error)
    }
  }

  const habilitarAudio = () => {
    setAudioEnabled(true)
    // Reproducir un sonido silencioso para activar el audio
    const audio = new Audio()
    audio.play().then(() => {
      toast.success('🔊 Audio habilitado')
    }).catch(() => {
      toast.error('❌ No se pudo habilitar el audio')
    })
  }

  const calificarEstudiante = async () => {
    if (!estudianteSeleccionado || !motivo.trim()) {
      toast.error('Selecciona un estudiante y proporciona un motivo')
      return
    }

    setCargando(true)
    const token = localStorage.getItem('token')

    try {
      const res = await fetch('/api/usuarios/calificar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          estudianteId: estudianteSeleccionado._id,
          tipo: tipoCalificacion,
          cantidad: parseInt(cantidad),
          motivo: motivo.trim()
        })
      })

      const data = await res.json()

      if (res.ok) {
        reproducirSonido()
        toast.success(data.mensaje)
        
        if (data.subioNivel) {
          toast.success(`🎉 ¡${estudianteSeleccionado.nombre} subió al nivel ${data.nuevoNivel}!`)
        }

        // Limpiar formulario
        setEstudianteSeleccionado(null)
        setMotivo('')
        setCantidad(1)
        
        // Recargar estudiantes
        cargarEstudiantes()
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('Error al calificar')
    } finally {
      setCargando(false)
    }
  }

  const getColorTipo = (tipo) => {
    switch (tipo) {
      case 'positivo': return 'text-green-400'
      case 'negativo': return 'text-red-400'
      case 'gold': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getIconoTipo = (tipo) => {
    switch (tipo) {
      case 'positivo': return '⚡'
      case 'negativo': return '💀'
      case 'gold': return '🌟'
      default: return '❓'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white p-6">
      {/* Header con efecto de energía maldita */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-extrabold text-yellow-400 mb-4 drop-shadow-2xl">
          ⚡ SISTEMA DE CALIFICACIÓN ⚡
        </h1>
        <p className="text-xl text-purple-300">
          Asigna puntos con el poder de la energía maldita
        </p>
        
        {/* Botón para habilitar audio */}
        {!audioEnabled && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={habilitarAudio}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold transition-all"
          >
            🔊 Habilitar Efectos de Sonido
          </motion.button>
        )}
      </motion.div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* Panel de Selección */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-600 shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-purple-400 mb-6">🎯 Seleccionar Estudiante</h2>
          
          {/* Selector de Clase */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-2">Clase</label>
            <select
              value={claseSeleccionada}
              onChange={(e) => setClaseSeleccionada(e.target.value)}
              className="w-full bg-black border border-purple-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            >
              <option value="">Selecciona una clase</option>
              {clases.map(clase => (
                <option key={clase._id} value={clase._id}>
                  {clase.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Lista de Estudiantes */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {estudiantes.map(estudiante => (
              <motion.div
                key={estudiante._id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setEstudianteSeleccionado(estudiante)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  estudianteSeleccionado?._id === estudiante._id
                    ? 'border-purple-500 bg-purple-900/30'
                    : 'border-gray-700 hover:border-purple-500 bg-gray-800/50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={estudiante.personaje?.avatar || '/avatars/avatar-gojo.png'}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full border-2 border-purple-500"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{estudiante.nombre}</h3>
                    <p className="text-sm text-gray-400">
                      Nivel {estudiante.nivel} • {estudiante.experiencia} XP
                    </p>
                    <div className="flex space-x-4 mt-2 text-xs">
                      <span className="text-green-400">+{estudiante.puntosPositivos || 0}</span>
                      <span className="text-red-400">-{estudiante.puntosNegativos || 0}</span>
                      <span className="text-yellow-400">🌟{estudiante.puntosGold || 0}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Panel de Calificación */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-600 shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-purple-400 mb-6">⚔️ Sistema de Calificación</h2>

          {estudianteSeleccionado ? (
            <div className="space-y-6">
              {/* Estudiante Seleccionado */}
              <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500">
                <div className="flex items-center space-x-4">
                  <img
                    src={estudianteSeleccionado.personaje?.avatar || '/avatars/avatar-gojo.png'}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full border-2 border-purple-500"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{estudianteSeleccionado.nombre}</h3>
                    <p className="text-purple-300">{estudianteSeleccionado.personaje?.nombre}</p>
                    <p className="text-sm text-gray-400">Nivel {estudianteSeleccionado.nivel}</p>
                  </div>
                </div>
              </div>

              {/* Tipo de Calificación */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Tipo de Calificación</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { tipo: 'positivo', label: 'Positivo', color: 'green' },
                    { tipo: 'negativo', label: 'Negativo', color: 'red' },
                    { tipo: 'gold', label: 'GOLD', color: 'yellow' }
                  ].map(({ tipo, label, color }) => (
                    <motion.button
                      key={tipo}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setTipoCalificacion(tipo)}
                      className={`p-3 rounded-lg border-2 font-bold transition-all ${
                        tipoCalificacion === tipo
                          ? `border-${color}-500 bg-${color}-900/30 text-${color}-400`
                          : 'border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {getIconoTipo(tipo)} {label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Cantidad */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  className="w-full bg-black border border-purple-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {/* Motivo */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Motivo</label>
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Explica por qué asignas esta calificación..."
                  className="w-full bg-black border border-purple-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-400 h-24 resize-none"
                />
              </div>

              {/* Botón de Calificar */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={calificarEstudiante}
                disabled={cargando || !motivo.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {cargando ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                    Aplicando calificación...
                  </span>
                ) : (
                  `⚡ Aplicar ${getIconoTipo(tipoCalificacion)} ${tipoCalificacion.toUpperCase()}`
                )}
              </motion.button>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-gray-400">Selecciona un estudiante para comenzar</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 