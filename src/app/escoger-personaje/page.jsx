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
    toast.success(`¡Has seleccionado a ${character.name}!`)
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
        router.push('/clase/lobby')
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
    <div className="fixed inset-0 overflow-hidden">
      {/* Character Selector 3D - Full Screen */}
      <CharacterSelector3D onCharacterSelect={handleCharacterSelect} />
      
      {/* Floating Confirmation Panel */}
      {selectedCharacter && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="text-center space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Personaje Seleccionado
                </h3>
                <p className="text-lg text-purple-300">
                  <span className="text-white font-bold">{selectedCharacter.name}</span>
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {selectedCharacter.description}
                </p>
              </div>
              
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmarSeleccion}
                  disabled={isConfirming}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-bold shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {isConfirming ? 'Confirmando...' : 'Confirmar Selección'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCharacter(null)}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-bold transition-all duration-300"
                >
                  Cancelar
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-20 px-4 py-2 bg-black/40 backdrop-blur-md rounded-lg text-white hover:bg-black/60 transition-all duration-300 border border-white/20"
      >
        ← Volver
      </motion.button>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute top-6 right-6 z-20 bg-black/40 backdrop-blur-md rounded-lg p-4 text-white text-sm border border-white/20"
      >
        <p className="font-semibold mb-2">🎮 Controles:</p>
        <p>🖱️ Arrastra para rotar</p>
        <p>🔍 Rueda para zoom</p>
        <p>👆 Click para seleccionar</p>
      </motion.div>
    </div>
  )
}
