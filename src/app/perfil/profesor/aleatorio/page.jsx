'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function AleatorioPage() {
  const [clases, setClases] = useState([])
  const [claseSeleccionada, setClaseSeleccionada] = useState('')
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null)
  const [seleccionando, setSeleccionando] = useState(false)
  const [efecto, setEfecto] = useState('')
  const [historial, setHistorial] = useState([])
  const [audioEnabled, setAudioEnabled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    cargarClases()
  }, [])

  const cargarClases = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/clases', {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      setClases(data)
    }
  }

  const reproducirSonido = () => {
    if (!audioEnabled) return
    
    try {
      const audio = new Audio('/sounds/energia-maldita.mp3')
      audio.volume = 0.7
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

  const seleccionarAleatorio = async () => {
    if (!claseSeleccionada) {
      toast.error('Selecciona una clase primero')
      return
    }

    setSeleccionando(true)
    reproducirSonido()

    // Simular proceso de selección con efectos
    const efectos = [
      '⚡ Energía maldita detectada...',
      '🌀 Técnica de dominio expandido...',
      '💫 Cursed Energy en acción...',
      '🌟 Poder de hechicero activado...',
      '🔥 Seleccionando al elegido...'
    ]

    for (let i = 0; i < efectos.length; i++) {
      setEfecto(efectos[i])
      await new Promise(resolve => setTimeout(resolve, 800))
    }

    const token = localStorage.getItem('token')

    try {
      const res = await fetch('/api/usuarios/aleatorio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ claseId: claseSeleccionada })
      })

      const data = await res.json()

      if (res.ok) {
        setEstudianteSeleccionado(data.estudiante)
        setEfecto(data.efecto)
        
        // Agregar al historial
        setHistorial(prev => [{
          ...data.estudiante,
          fecha: new Date().toLocaleTimeString(),
          efecto: data.efecto
        }, ...prev.slice(0, 4)])

        toast.success(`¡${data.estudiante.nombre} ha sido seleccionado!`)
      } else {
        if (data.error === 'No hay estudiantes en la clase para seleccionar.') {
          setEstudianteSeleccionado(null)
          setEfecto('')
          toast.custom((t) => (
            <div className="bg-black/90 border-2 border-purple-700 text-center px-6 py-4 rounded-xl shadow-2xl animate-pulse-glow">
              <div className="text-5xl mb-2">👹</div>
              <div className="text-lg font-bold text-yellow-400 mb-1">¡Clase Vacía!</div>
              <div className="text-purple-300">No hay estudiantes en la clase para invocar con energía maldita.<br/>Agrega estudiantes primero.</div>
            </div>
          ))
        } else {
          toast.error(data.error || 'Error al seleccionar estudiante')
        }
      }
    } catch (error) {
      toast.error('Error al seleccionar estudiante')
      setEfecto('')
    } finally {
      setSeleccionando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white p-6">
      {/* Header con efectos de energía maldita */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-extrabold text-yellow-400 mb-4 drop-shadow-2xl">
          🌀 SELECCIÓN ALEATORIA 🌀
        </h1>
        <p className="text-xl text-purple-300">
          El poder de la energía maldita elige al estudiante
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
        {/* Panel de Control */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-600 shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-purple-400 mb-6">⚡ Control de Selección</h2>
          
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

          {/* Botón de Selección */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={seleccionarAleatorio}
            disabled={seleccionando || !claseSeleccionada}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-6 px-8 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-xl"
          >
            {seleccionando ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
                Seleccionando...
              </span>
            ) : (
              '🌀 ¡SELECCIONAR ALEATORIAMENTE!'
            )}
          </motion.button>

          {/* Efecto Actual */}
          <AnimatePresence>
            {efecto && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-6 p-4 bg-purple-900/30 rounded-lg border border-purple-500 text-center"
              >
                <p className="text-lg font-bold text-purple-300">{efecto}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Historial */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-purple-400 mb-4">📜 Historial de Selecciones</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {historial.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">{item.nombre}</p>
                      <p className="text-sm text-gray-400">{item.fecha}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-purple-300">{item.efecto}</p>
                      <p className="text-xs text-gray-500">Nivel {item.nivel}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Panel de Resultado */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-600 shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-purple-400 mb-6">🎯 Estudiante Seleccionado</h2>

          <AnimatePresence>
            {estudianteSeleccionado ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                {/* Efecto de energía maldita alrededor del avatar */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                  <img
                    src={estudianteSeleccionado.personaje?.avatar || '/avatars/avatar-gojo.png'}
                    alt="Avatar"
                    className="relative w-32 h-32 rounded-full border-4 border-purple-500 mx-auto shadow-2xl"
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm animate-bounce">
                    ⚡
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-yellow-400 mb-2">
                  {estudianteSeleccionado.nombre}
                </h3>
                
                <p className="text-xl text-purple-300 mb-4">
                  {estudianteSeleccionado.personaje?.nombre}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500">
                    <p className="text-2xl font-bold text-purple-400">{estudianteSeleccionado.nivel}</p>
                    <p className="text-sm text-gray-400">Nivel</p>
                  </div>
                  <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500">
                    <p className="text-2xl font-bold text-yellow-400">{estudianteSeleccionado.experiencia}</p>
                    <p className="text-sm text-gray-400">Experiencia</p>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-purple-600/20 to-purple-800/20 p-4 rounded-lg border border-purple-500"
                >
                  <p className="text-lg font-bold text-purple-300">¡Ha sido elegido por la energía maldita!</p>
                  <p className="text-sm text-gray-400 mt-2">Es hora de demostrar tu poder, hechicero</p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-8xl mb-6">🎯</div>
                <p className="text-gray-400 text-lg">Presiona el botón para seleccionar un estudiante</p>
                <p className="text-gray-500 text-sm mt-2">La energía maldita elegirá al elegido</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
} 