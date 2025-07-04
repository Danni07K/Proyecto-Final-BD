'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function UnirseClase() {
  const [codigo, setCodigo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const router = useRouter()

  const habilitarAudio = () => {
    setAudioEnabled(true)
    const audio = new Audio()
    audio.play().then(() => {
      toast.success('🔊 Audio habilitado')
    }).catch(() => {
      toast.error('❌ No se pudo habilitar el audio')
    })
  }

  const unirse = async (e) => {
    e.preventDefault()
    setCargando(true)
    setMensaje('')
    const token = localStorage.getItem('token')

    if (!token) {
      toast.error('Debes iniciar sesión')
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
        body: JSON.stringify({ codigo })
      })
      const data = await res.json()
      if (res.ok) {
        setMensaje('¡Unido correctamente a la clase!')
        toast.custom((t) => (
          <div className="bg-black/90 border-2 border-green-500 text-center px-6 py-4 rounded-xl shadow-2xl animate-pulse-glow">
            <div className="text-5xl mb-2">🎉</div>
            <div className="text-lg font-bold text-green-400 mb-1">¡Unido a la clase!</div>
            <div className="text-purple-300">Has ingresado al dominio del profesor.<br/>Prepárate para la energía maldita.</div>
          </div>
        ))
        if (audioEnabled) {
          try {
            const audio = new Audio('/sounds/energia-maldita.mp3')
            audio.volume = 0.5
            audio.play().catch(() => {})
          } catch (error) {}
        }
        if (data && data.claseId) {
          setTimeout(async () => {
            const token = localStorage.getItem('token');
            await fetch(`/api/usuarios/${data.usuarioId || ''}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            router.push('/escoger-personaje');
          }, 2000);
        } else {
          setTimeout(() => router.push('/escoger-personaje'), 2000)
        }
      } else {
        setMensaje(data.error || 'Error al unirse')
        toast.custom((t) => (
          <div className="bg-black/90 border-2 border-red-500 text-center px-6 py-4 rounded-xl shadow-2xl animate-pulse-glow">
            <div className="text-5xl mb-2">👹</div>
            <div className="text-lg font-bold text-yellow-400 mb-1">Código inválido</div>
            <div className="text-purple-300">No se encontró ninguna clase con ese código.<br/>Verifica con tu profesor.</div>
          </div>
        ))
      }
    } catch (error) {
      setMensaje('Error de conexión')
      toast.error('Error de conexión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex flex-col items-center justify-center">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-purple-400 to-yellow-400 mb-4 drop-shadow-2xl">
          🏫 UNIRSE A UNA CLASE
        </h1>
        <p className="text-lg text-purple-300">
          Ingresa el código que te dio tu profesor para unirte a la clase
        </p>
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
      <motion.form
        onSubmit={unirse}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-dark p-8 rounded-xl border-2 border-green-500/50 shadow-jjk-lg w-full max-w-md space-y-6"
      >
        <div>
          <label className="block text-lg font-semibold text-green-300 mb-2">Código de la clase</label>
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            className="w-full p-4 rounded-lg bg-gray-900 border-2 border-green-500 text-white text-2xl text-center tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Ej: ABC123"
            maxLength={6}
            required
          />
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={cargando}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 rounded-lg text-white font-bold text-lg transition-all shadow-lg disabled:cursor-not-allowed"
        >
          {cargando ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Uniéndose...
            </span>
          ) : (
            '⚡ UNIRME A LA CLASE'
          )}
        </motion.button>
        <AnimatePresence>
          {mensaje && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`mt-6 p-4 rounded-lg text-center font-semibold ${
                mensaje.includes('correctamente')
                  ? 'bg-green-900/30 border border-green-500 text-green-400'
                  : 'bg-red-900/30 border border-red-500 text-red-400'
              }`}
            >
              {mensaje}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500 rounded-lg">
          <h3 className="text-lg font-bold text-blue-400 mb-2">💡 ¿Cómo obtener el código?</h3>
          <ul className="text-sm text-blue-300 space-y-1">
            <li>• Pídele el código a tu profesor</li>
            <li>• El código es único para cada clase</li>
            <li>• Solo puedes unirte a una clase a la vez</li>
            <li>• Una vez unido, podrás acceder a todas las funcionalidades</li>
          </ul>
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="text-purple-400 hover:text-purple-300 transition-colors font-semibold mt-4"
        >
          ← Volver
        </motion.button>
      </motion.form>
    </div>
  )
}
