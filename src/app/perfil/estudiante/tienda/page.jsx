'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { jwtDecode } from 'jwt-decode'
import Shop3D from '@/components/Shop3D'

const personajesJJK = [
  { id: 'gojo', nombre: 'Satoru Gojo', avatar: '/avatars/avatar-gojo.png', descripcion: 'El más fuerte de todos los hechiceros', auraColor: '#3b82f6' },
  { id: 'yuji', nombre: 'Yuji Itadori', avatar: '/avatars/avatar-itadori.png', descripcion: 'Estudiante con potencial excepcional', auraColor: '#ef4444' },
  { id: 'megumi', nombre: 'Megumi Fushiguro', avatar: '/avatars/avatar-megumi.png', descripcion: 'Maestro de las sombras', auraColor: '#1f2937' },
  { id: 'nobara', nombre: 'Nobara Kugisaki', avatar: '/avatars/avatar-nobara.png', descripcion: 'Especialista en maldiciones', auraColor: '#ec4899' },
  { id: 'yuta', nombre: 'Yuta Okkotsu', avatar: '/avatars/avatar-yuta.png', descripcion: 'El sucesor de Gojo', auraColor: '#10b981' },
  { id: 'nanami', nombre: 'Kento Nanami', avatar: '/avatars/avatar-nanami.png', descripcion: 'Hechicero experimentado', auraColor: '#f59e0b' },
]

export default function TiendaEstudiante() {
  const [user, setUser] = useState(null)
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }
        
        const payload = jwtDecode(token)
        
        const res = await fetch(`/api/usuarios/${payload.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) {
          throw new Error('Error al cargar usuario')
        }
        
        const data = await res.json()
        setUser(data.usuario)
        
        // Configurar personaje seleccionado
        if (data.usuario.personaje) {
          const personaje = personajesJJK.find(p => p.id === data.usuario.personaje.nombre?.toLowerCase())
          if (personaje) {
            setPersonajeSeleccionado(personaje)
          }
        }
      } catch (err) {
        console.error('Error al cargar usuario:', err)
        setError('Error al cargar el perfil')
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }
    
    cargarUsuario()
  }, [router])

  const handleBuyAccessory = async (accessory) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/usuarios/comprar-accesorio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          accesorioId: accessory.id,
          precio: accessory.precio
        })
      })

      if (res.ok) {
        // Actualizar monedas del usuario
        setUser(prev => ({
          ...prev,
          monedas: prev.monedas - accessory.precio
        }))
        
        // Mostrar mensaje de éxito
        alert(`¡${accessory.nombre} comprado exitosamente!`)
      } else {
        const error = await res.json()
        alert(error.error || 'Error al comprar el accesorio')
      }
    } catch (error) {
      console.error('Error al comprar accesorio:', error)
      alert('Error al procesar la compra')
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
            Cargando Tienda...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-white text-lg font-bold text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/perfil/estudiante')}
            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 btn-jjk"
          >
            Volver al Perfil
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white relative overflow-hidden">
      {/* Partículas de energía maldita */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8"
          >
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 mb-4 drop-shadow-2xl">
              🛍️ TIENDA DE ACCESORIOS
            </h1>
            <p className="text-xl text-purple-300 max-w-3xl mx-auto">
              Descubre accesorios únicos y equipa a tu personaje con el poder de la energía maldita
            </p>
          </motion.div>

          {/* Información del usuario */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-dark p-6 rounded-xl border border-purple-500 shadow-jjk-lg mb-8 max-w-md mx-auto"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={user?.personaje?.avatar || '/avatars/avatar-gojo.png'}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full border-2 border-purple-500"
                />
                <div>
                  <h3 className="text-lg font-bold text-purple-400">{user?.nombre}</h3>
                  <p className="text-gray-400 text-sm">{user?.personaje?.nombre || 'Sin personaje'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-yellow-400 font-bold text-2xl">{user?.monedas || 0}</p>
                <p className="text-gray-400 text-sm">Monedas</p>
              </div>
            </div>
          </motion.div>

          {/* Tienda 3D */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-dark rounded-xl border border-purple-500 shadow-jjk-lg overflow-hidden"
          >
            <Shop3D
              accesorios={[]}
              usuario={user}
              onBuyAccessory={handleBuyAccessory}
              character={personajeSeleccionado}
            />
          </motion.div>

          {/* Botón de regreso */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-8"
          >
            <button
              onClick={() => router.push('/perfil/estudiante')}
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 btn-jjk"
            >
              ← Volver al Perfil
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 