'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import Shop3D from '@/components/Shop3D'

export default function TiendaPage() {
  const [accesorios, setAccesorios] = useState({})
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [viewMode, setViewMode] = useState('3d') // 3d, grid
  const router = useRouter()

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      // Cargar catálogo de accesorios
      const accesoriosRes = await fetch('/api/usuarios/comprar-accesorio')
      if (!accesoriosRes.ok) throw new Error('Error al cargar accesorios')
      const accesoriosData = await accesoriosRes.json()
      setAccesorios(accesoriosData.accesorios)

      // Cargar datos del usuario
      const payload = JSON.parse(atob(token.split('.')[1]))
      const usuarioRes = await fetch(`/api/usuarios/${payload.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!usuarioRes.ok) throw new Error('Error al cargar usuario')
      const usuarioData = await usuarioRes.json()
      setUsuario(usuarioData.usuario)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      toast.error('Error al cargar la tienda')
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

  const comprarAccesorio = async (accesorio) => {
    setCargando(true)
    reproducirSonido()

    const token = localStorage.getItem('token')

    try {
      const res = await fetch('/api/usuarios/comprar-accesorio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ accesorioId: accesorio.id })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(data.mensaje)
        
        if (data.subioNivel) {
          toast.success(`🎉 ¡Subiste al nivel ${data.nuevoNivel}!`)
        }

        // Actualizar datos del usuario
        setUsuario(prev => ({
          ...prev,
          monedas: data.monedasRestantes,
          accesoriosComprados: [...prev.accesoriosComprados, accesorio.id],
          nivel: data.nuevoNivel,
          experiencia: data.experiencia
        }))
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('Error al comprar accesorio')
    } finally {
      setCargando(false)
    }
  }

  const getColorRareza = (rareza) => {
    switch (rareza) {
      case 'legendario': return 'text-yellow-400 border-yellow-500'
      case 'epico': return 'text-purple-400 border-purple-500'
      case 'raro': return 'text-blue-400 border-blue-500'
      case 'comun': return 'text-gray-400 border-gray-500'
      default: return 'text-gray-400 border-gray-500'
    }
  }

  const getIconoRareza = (rareza) => {
    switch (rareza) {
      case 'legendario': return '🌟'
      case 'epico': return '💫'
      case 'raro': return '⭐'
      case 'comun': return '⚪'
      default: return '⚪'
    }
  }

  const yaTieneAccesorio = (accesorioId) => {
    return usuario?.accesoriosComprados?.includes(accesorioId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white">
      {/* Header con efectos de energía maldita */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-8 pb-6"
      >
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-4 drop-shadow-2xl">
          🛍️ TIENDA DE ACCESORIOS 3D 🛍️
        </h1>
        <p className="text-xl text-purple-300 mb-4">
          Explora y adquiere poder con los accesorios de los hechiceros
        </p>
        
        {/* Controles de vista */}
        <div className="flex justify-center space-x-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('3d')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              viewMode === '3d' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🎮 Vista 3D
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('grid')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              viewMode === 'grid' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            📱 Vista Grid
          </motion.button>
        </div>
        
        {/* Botón para habilitar audio */}
        {!audioEnabled && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={habilitarAudio}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold transition-all"
          >
            🔊 Habilitar Efectos de Sonido
          </motion.button>
        )}
      </motion.div>

      {/* Contenido principal */}
      {viewMode === '3d' ? (
        // Vista 3D
        <div className="max-w-7xl mx-auto px-6">
          <Shop3D 
            accesorios={accesorios} 
            usuario={usuario} 
            onBuyAccessory={comprarAccesorio}
          />
        </div>
      ) : (
        // Vista Grid tradicional
        <div className="max-w-6xl mx-auto px-6">
          {/* Panel de Usuario */}
          {usuario && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-600 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={usuario.personaje?.avatar || '/avatars/avatar-gojo.png'}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full border-2 border-purple-500"
                  />
                  <div>
                    <h2 className="text-2xl font-bold">{usuario.nombre}</h2>
                    <p className="text-purple-300">{usuario.personaje?.nombre}</p>
                    <p className="text-sm text-gray-400">Nivel {usuario.nivel} • {usuario.experiencia} XP</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-500">
                    <p className="text-3xl font-bold text-yellow-400">{usuario.monedas}</p>
                    <p className="text-sm text-gray-400">Monedas</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Catálogo de Accesorios en Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Object.entries(accesorios).map(([id, accesorio]) => (
              <motion.div
                key={id}
                whileHover={{ scale: 1.05 }}
                className={`bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border-2 transition-all cursor-pointer ${
                  yaTieneAccesorio(id) 
                    ? 'border-green-500 bg-green-900/20' 
                    : getColorRareza(accesorio.rareza)
                }`}
                onClick={() => !yaTieneAccesorio(id) && comprarAccesorio({ id, ...accesorio })}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{getIconoRareza(accesorio.rareza)}</div>
                  <h3 className="text-xl font-bold mb-2">{accesorio.nombre}</h3>
                  <p className="text-gray-400 text-sm mb-4">{accesorio.descripcion}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 font-bold text-lg">{accesorio.precio} 💰</span>
                    {yaTieneAccesorio(id) ? (
                      <span className="text-green-400 font-bold">✓ COMPRADO</span>
                    ) : (
                      <button
                        disabled={cargando || usuario?.monedas < accesorio.precio}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${
                          usuario?.monedas >= accesorio.precio
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {cargando ? 'Comprando...' : 'Comprar'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Botón de volver */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-8 pb-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white underline transition-colors"
        >
          ← Volver al Perfil
        </motion.button>
      </motion.div>

      {/* Efectos de fondo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
    </div>
  )
} 