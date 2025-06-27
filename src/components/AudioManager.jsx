'use client'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

export default function AudioManager({ children }) {
  const [audioEnabled, setAudioEnabled] = useState(false)

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

  const reproducirSonido = (ruta = '/sounds/energia-maldita.mp3', volumen = 0.6) => {
    if (!audioEnabled) return
    
    try {
      const audio = new Audio(ruta)
      audio.volume = volumen
      audio.play().catch(err => {
        console.log('Audio no pudo reproducirse:', err)
      })
    } catch (error) {
      console.log('Error al reproducir audio:', error)
    }
  }

  return (
    <div>
      {!audioEnabled && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={habilitarAudio}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg"
          >
            🔊 Habilitar Efectos de Sonido
          </button>
        </div>
      )}
      {children({ audioEnabled, reproducirSonido })}
    </div>
  )
} 