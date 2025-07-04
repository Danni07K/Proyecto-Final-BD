'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function UnirseClase() {
  const [codigo, setCodigo] = useState('')
  const [mensaje, setMensaje] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [particles, setParticles] = useState([])
  const [audioEnabled, setAudioEnabled] = useState(false)
  const router = useRouter()

  // Generate cursed energy particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
        opacity: Math.random() * 0.6 + 0.2
      }))
      setParticles(newParticles)
    }

    if (typeof window !== 'undefined') {
      generateParticles()
      
      // Handle window resize
      const handleResize = () => generateParticles()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!codigo.trim()) {
      toast.error('Por favor ingresa el código de la clase')
      return
    }

    setIsLoading(true)
    const token = localStorage.getItem('token')

    if (!token) {
      toast.error('Debes iniciar sesión para unirte a una clase')
      router.push('/login')
      return
    }

    try {
      const res = await fetch('/api/clases/unirse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ codigo: codigo.toUpperCase() })
      })

      const data = await res.json()
      
      if (res.ok) {
        setMensaje({ tipo: 'success', texto: data.message })
        toast.custom((t) => (
          <div className="bg-black/90 border-2 border-green-500 text-center px-6 py-4 rounded-xl shadow-2xl animate-pulse-glow">
            <div className="text-5xl mb-2">🎉</div>
            <div className="text-lg font-bold text-green-400 mb-1">¡Unido a la clase!</div>
            <div className="text-purple-300">Has ingresado al dominio del profesor.<br/>Prepárate para la energía maldita.</div>
          </div>
        ))
        // Efecto de sonido
        if (audioEnabled) {
          try {
            const audio = new Audio('/sounds/energia-maldita.mp3')
            audio.volume = 0.5
            audio.play().catch(() => {})
          } catch (error) {}
        }
        setTimeout(() => router.push('/perfil/estudiante'), 2000)
      } else {
        setMensaje({ tipo: 'error', texto: data.error })
        toast.custom((t) => (
          <div className="bg-black/90 border-2 border-red-500 text-center px-6 py-4 rounded-xl shadow-2xl animate-pulse-glow">
            <div className="text-5xl mb-2">👹</div>
            <div className="text-lg font-bold text-yellow-400 mb-1">Código inválido</div>
            <div className="text-purple-300">No se encontró ninguna clase con ese código.<br/>Verifica con tu profesor.</div>
          </div>
        ))
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error de conexión. Verifica tu conexión a internet.' })
      toast.error('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  const habilitarAudio = () => {
    setAudioEnabled(true)
    const audio = new Audio()
    audio.play().then(() => {
      toast.success('🔊 Audio habilitado')
    }).catch(() => {
      toast.error('❌ No se pudo habilitar el audio')
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white relative overflow-hidden particles-bg flex items-center justify-center">
      {/* Enhanced Cursed Energy Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="energy-particle"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity
            }}
            animate={{
              y: [0, -40, -80, -40, 0],
              x: [0, 20, -8, -25, 0],
              opacity: [particle.opacity, 1, 0.8, 0.95, particle.opacity],
              scale: [1, 1.2, 0.9, 1.1, 1],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Header Épico */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 mb-4 drop-shadow-2xl">
            🏫 UNIRSE A CLASE
          </h1>
          <p className="text-lg text-purple-300">
            Ingresa el código de tu clase para comenzar tu entrenamiento como hechicero
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

        {/* Formulario */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-dark p-8 rounded-xl border border-purple-500/30 shadow-jjk-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-purple-300 mb-2">
                🔑 Código de Clase
              </label>
              <input
                type="text"
                placeholder="Ej: ABC123"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                className="w-full px-4 py-4 bg-black/50 border border-purple-500/50 rounded-lg text-white text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                maxLength={6}
                required
              />
              <p className="text-xs text-gray-400 mt-2 text-center">
                El código debe tener 6 caracteres (letras y números)
              </p>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 rounded-lg text-white font-bold text-lg transition-all shadow-lg disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Uniéndose...
                </span>
              ) : (
                '⚡ UNIRME A LA CLASE'
              )}
            </motion.button>
          </form>

          {/* Mensaje de resultado */}
          <AnimatePresence>
            {mensaje && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`mt-6 p-4 rounded-lg text-center font-semibold ${
                  mensaje.tipo === 'error' 
                    ? 'bg-red-900/30 border border-red-500 text-red-400' 
                    : 'bg-green-900/30 border border-green-500 text-green-400'
                }`}
              >
                {mensaje.texto}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500 rounded-lg">
            <h3 className="text-lg font-bold text-blue-400 mb-2">💡 ¿Cómo obtener el código?</h3>
            <ul className="text-sm text-blue-300 space-y-1">
              <li>• Pídele el código a tu profesor</li>
              <li>• El código es único para cada clase</li>
              <li>• Solo puedes unirte a una clase a la vez</li>
              <li>• Una vez unido, podrás acceder a todas las funcionalidades</li>
            </ul>
          </div>
        </motion.div>

        {/* Botón de regreso */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="text-purple-400 hover:text-purple-300 transition-colors font-semibold"
          >
            ← Volver
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
