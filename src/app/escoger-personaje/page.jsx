'use client'
import CharacterSelector3D from '@/components/CharacterSelector3D'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

export default function EscogerPersonaje() {
  const router = useRouter()
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [isConfirming, setIsConfirming] = useState(false)

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character)
  }

  const confirmarSeleccion = async () => {
    if (!selectedCharacter) {
      toast.error('Por favor selecciona un personaje primero')
      return
    }

    setIsConfirming(true)
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      // Aquí harías el POST al backend con el personaje seleccionado
      const response = await fetch('/api/usuarios/personaje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: selectedCharacter.name,
          avatar: selectedCharacter.avatar || ''
        })
      })

      if (response.ok) {
        toast.success(`¡Has elegido a ${selectedCharacter.name}!`)
        router.push('/perfil/estudiante')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error al seleccionar personaje')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al seleccionar personaje')
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white">
      {/* Header con efectos */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-8 pb-6"
      >
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4 drop-shadow-2xl">
          SELECCIONA TU PERSONAJE
        </h1>
        <p className="text-xl text-purple-300 max-w-2xl mx-auto">
          Elige tu destino como hechicero y domina las técnicas de Jujutsu Kaisen
        </p>
      </motion.div>

      {/* Selector 3D de personajes */}
      <div className="max-w-7xl mx-auto px-6">
        <CharacterSelector3D onCharacterSelect={handleCharacterSelect} />
      </div>

      {/* Panel de confirmación */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-8 pb-8"
      >
        {selectedCharacter ? (
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-block bg-purple-600/20 backdrop-blur-sm rounded-xl p-4 border border-purple-500"
            >
              <p className="text-lg text-purple-300">
                Has seleccionado: <span className="text-white font-bold">{selectedCharacter.name}</span>
              </p>
              <p className="text-sm text-gray-400">{selectedCharacter.description}</p>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={confirmarSeleccion}
              disabled={isConfirming}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full text-xl font-bold shadow-2xl transition-all duration-300 disabled:opacity-50"
            >
              {isConfirming ? 'Confirmando...' : `¡Elegir a ${selectedCharacter.name}!`}
            </motion.button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-purple-300 text-lg">
              🖱️ Usa el mouse para explorar los personajes • 🖱️ Click para seleccionar
            </p>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => router.back()}
          className="mt-6 text-sm text-gray-400 hover:text-white underline transition-colors"
        >
          ← Volver
        </motion.button>
      </motion.div>

      {/* Efectos de fondo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
    </div>
  )
}
