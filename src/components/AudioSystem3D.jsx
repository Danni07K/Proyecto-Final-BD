'use client'
import { useState, useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'

// Configuración de sonidos
const SOUNDS = {
  // Sonidos de combate
  'attack': {
    url: '/sounds/energia-maldita.mp3',
    volume: 0.7,
    spatial: true
  },
  'defend': {
    url: '/sounds/energia-maldita.mp3',
    volume: 0.5,
    spatial: true
  },
  'special': {
    url: '/sounds/energia-maldita.mp3',
    volume: 0.8,
    spatial: true
  },
  'damage': {
    url: '/sounds/energia-maldita.mp3',
    volume: 0.6,
    spatial: true
  },

  // Sonidos de energía maldita
  'energia_maldita': {
    url: '/sounds/energia-maldita.mp3',
    volume: 0.4,
    spatial: false
  },
  'cursed_energy': {
    url: '/sounds/energia-maldita.mp3',
    volume: 0.5,
    spatial: true
  },
  'domain_expansion': {
    url: '/sounds/energia-maldita.mp3',
    volume: 0.9,
    spatial: true
  },

  // Sonidos de UI (todos usan energia-maldita.mp3 para evitar 404)
  'button_hover': {
    url: '/sounds/energia-maldita.mp3',
    volume: 0.3,
    spatial: false
  },
  'button_click': {
    url: '/sounds/energia-maldita.mp3',
    volume: 0.4,
    spatial: false
  },
  'achievement': {
    url: '/sounds/energia-maldita.mp3',
    volume: 0.6,
    spatial: false
  },
  'level_up': {
    url: '/sounds/energia-maldita.mp3',
    volume: 0.7,
    spatial: false
  },

  // Música ambiental
  'ambient_day': {
    url: '/sounds/energia-maldita.mp3',
    volume: 0.3,
    spatial: false,
    loop: true
  },
  'ambient_night': {
    url: '/sounds/energia-maldita.mp3',
    volume: 0.3,
    spatial: false,
    loop: true
  },
  'battle_theme': {
    url: '/sounds/energia-maldita.mp3',
    volume: 0.5,
    spatial: false,
    loop: true
  },
  'victory_theme': {
    url: '/sounds/energia-maldita.mp3',
    volume: 0.6,
    spatial: false,
    loop: false
  }
}

// Componente de audio 3D
function Audio3D({ soundId, position = [0, 0, 0], volume = 1, loop = false }) {
  const { camera } = useThree()
  const audioRef = useRef()
  const listenerRef = useRef()

  useEffect(() => {
    if (!audioRef.current) return

    const sound = SOUNDS[soundId]
    if (!sound) return

    const audio = new Audio(sound.url)
    audio.volume = sound.volume * volume
    audio.loop = loop || sound.loop || false
    audioRef.current = audio

    if (sound.spatial) {
      // Configurar audio espacial
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const source = audioContext.createMediaElementSource(audio)
      const panner = audioContext.createPanner()
      
      panner.setPosition(...position)
      panner.setDistanceModel('inverse')
      panner.setRefDistance(1)
      panner.setMaxDistance(100)
      panner.setRolloffFactor(1)
      
      source.connect(panner)
      panner.connect(audioContext.destination)
      
      // Actualizar posición del panner cuando se mueve la cámara
      const updatePosition = () => {
        const cameraPosition = camera.position
        panner.setPosition(
          position[0] - cameraPosition.x,
          position[1] - cameraPosition.y,
          position[2] - cameraPosition.z
        )
      }
      
      updatePosition()
      camera.addEventListener('position', updatePosition)
      
      return () => {
        camera.removeEventListener('position', updatePosition)
        audioContext.close()
      }
    }

    return () => {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [soundId, position, volume, loop, camera])

  return null
}

// Hook personalizado para el sistema de audio
export function useAudioSystem() {
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [masterVolume, setMasterVolume] = useState(0.7)
  const [musicVolume, setMusicVolume] = useState(0.5)
  const [sfxVolume, setSfxVolume] = useState(0.8)
  const [currentMusic, setCurrentMusic] = useState(null)
  const audioContextRef = useRef(null)
  const audioCache = useRef(new Map())

  // Inicializar sistema de audio
  useEffect(() => {
    const initAudio = async () => {
      try {
        // Crear contexto de audio
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
        
        // Precargar sonidos importantes
        await preloadSounds(['button_hover', 'button_click', 'achievement', 'level_up'])
        
        setAudioEnabled(true)
      } catch (error) {
        console.error('Error al inicializar audio:', error)
      }
    }

    initAudio()

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Precargar sonidos
  const preloadSounds = async (soundIds) => {
    for (const soundId of soundIds) {
      const sound = SOUNDS[soundId]
      if (sound && !audioCache.current.has(soundId)) {
        try {
          const audio = new Audio(sound.url)
          audio.preload = 'auto'
          audioCache.current.set(soundId, audio)
        } catch (error) {
          console.error(`Error al precargar ${soundId}:`, error)
        }
      }
    }
  }

  // Reproducir sonido
  const playSound = (soundId, options = {}) => {
    if (!audioEnabled) return

    const sound = SOUNDS[soundId]
    if (!sound) {
      console.warn(`Sonido no encontrado: ${soundId}`)
      return
    }

    try {
      let audio
      
      // Usar caché si está disponible
      if (audioCache.current.has(soundId)) {
        audio = audioCache.current.get(soundId).cloneNode()
      } else {
        audio = new Audio(sound.url)
      }

      // Configurar volumen
      const volume = (sound.volume * sfxVolume * masterVolume) * (options.volume || 1)
      audio.volume = Math.min(volume, 1)

      // Configurar loop
      audio.loop = options.loop || sound.loop || false

      // Reproducir
      audio.play().catch(error => {
        console.error(`Error al reproducir ${soundId}:`, error)
      })

      // Limpiar después de reproducir (si no es loop)
      if (!audio.loop) {
        audio.addEventListener('ended', () => {
          audio.remove()
        })
      }

      return audio
    } catch (error) {
      console.error(`Error al reproducir ${soundId}:`, error)
    }
  }

  // Reproducir música
  const playMusic = (musicId, fadeIn = true) => {
    if (!audioEnabled) return

    // Detener música actual
    if (currentMusic) {
      if (fadeIn) {
        fadeOutMusic(currentMusic, () => {
          startNewMusic(musicId)
        })
      } else {
        currentMusic.pause()
        currentMusic.currentTime = 0
        startNewMusic(musicId)
      }
    } else {
      startNewMusic(musicId)
    }
  }

  const startNewMusic = (musicId) => {
    const sound = SOUNDS[musicId]
    if (!sound) return

    const audio = new Audio(sound.url)
    audio.volume = 0
    audio.loop = sound.loop || false
    
    if (sound.loop) {
      audio.volume = sound.volume * musicVolume * masterVolume
    } else {
      audio.volume = sound.volume * musicVolume * masterVolume
    }

    audio.play().catch(error => {
      console.error(`Error al reproducir música ${musicId}:`, error)
    })

    setCurrentMusic(audio)
  }

  // Fade out de música
  const fadeOutMusic = (audio, callback) => {
    const fadeOut = setInterval(() => {
      if (audio.volume > 0.1) {
        audio.volume -= 0.1
      } else {
        audio.pause()
        audio.currentTime = 0
        clearInterval(fadeOut)
        if (callback) callback()
      }
    }, 100)
  }

  // Detener música
  const stopMusic = (fadeOut = true) => {
    if (currentMusic) {
      if (fadeOut) {
        fadeOutMusic(currentMusic, () => {
          setCurrentMusic(null)
        })
      } else {
        currentMusic.pause()
        currentMusic.currentTime = 0
        setCurrentMusic(null)
      }
    }
  }

  // Efectos de sonido específicos
  const playButtonHover = () => playSound('button_hover')
  const playButtonClick = () => playSound('button_click')
  const playAchievement = () => playSound('achievement')
  const playLevelUp = () => playSound('level_up')
  const playAttack = () => playSound('attack')
  const playDefend = () => playSound('defend')
  const playSpecial = () => playSound('special')
  const playDamage = () => playSound('damage')
  const playEnergiaMaldita = () => playSound('energia_maldita')
  const playCursedEnergy = () => playSound('cursed_energy')
  const playDomainExpansion = () => playSound('domain_expansion')

  // Música ambiental
  const playAmbientDay = () => playMusic('ambient_day')
  const playAmbientNight = () => playMusic('ambient_night')
  const playBattleTheme = () => playMusic('battle_theme')
  const playVictoryTheme = () => playMusic('victory_theme')

  return {
    // Estado
    audioEnabled,
    masterVolume,
    musicVolume,
    sfxVolume,
    currentMusic,

    // Controles
    setAudioEnabled,
    setMasterVolume,
    setMusicVolume,
    setSfxVolume,

    // Sonidos generales
    playSound,
    playMusic,
    stopMusic,

    // Efectos específicos
    playButtonHover,
    playButtonClick,
    playAchievement,
    playLevelUp,
    playAttack,
    playDefend,
    playSpecial,
    playDamage,
    playEnergiaMaldita,
    playCursedEnergy,
    playDomainExpansion,

    // Música
    playAmbientDay,
    playAmbientNight,
    playBattleTheme,
    playVictoryTheme,

    // Utilidades
    preloadSounds
  }
}

// Componente de controles de audio
export function AudioControls({ audioSystem }) {
  const [showControls, setShowControls] = useState(false)

  return (
    <>
      {/* Botón de controles de audio */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowControls(!showControls)}
        className="fixed top-4 left-4 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-2xl z-40"
      >
        {audioSystem.audioEnabled ? '🔊' : '🔇'}
      </motion.button>

      {/* Panel de controles */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed top-16 left-4 bg-black/90 backdrop-blur-sm rounded-xl p-4 border border-purple-500 shadow-2xl z-40 min-w-[250px]"
          >
            <h3 className="text-lg font-bold text-purple-400 mb-4">🎵 Controles de Audio</h3>
            
            {/* Master Volume */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">Volumen General</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={audioSystem.masterVolume}
                onChange={(e) => audioSystem.setMasterVolume(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">
                {Math.round(audioSystem.masterVolume * 100)}%
              </div>
            </div>

            {/* Music Volume */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">Volumen Música</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={audioSystem.musicVolume}
                onChange={(e) => audioSystem.setMusicVolume(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">
                {Math.round(audioSystem.musicVolume * 100)}%
              </div>
            </div>

            {/* SFX Volume */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">Volumen Efectos</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={audioSystem.sfxVolume}
                onChange={(e) => audioSystem.setSfxVolume(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">
                {Math.round(audioSystem.sfxVolume * 100)}%
              </div>
            </div>

            {/* Botones de prueba */}
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={audioSystem.playButtonClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-bold transition-all"
              >
                🔊 Probar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => audioSystem.setAudioEnabled(!audioSystem.audioEnabled)}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                  audioSystem.audioEnabled 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {audioSystem.audioEnabled ? '🔇 Desactivar' : '🔊 Activar'}
              </motion.button>
            </div>

            {/* Música actual */}
            {audioSystem.currentMusic && (
              <div className="mt-4 p-2 bg-purple-900/30 rounded-lg">
                <div className="text-xs text-gray-400">Reproduciendo:</div>
                <div className="text-sm text-purple-300">🎵 Música Ambiental</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Componente principal del sistema de audio
export default function AudioSystem3D() {
  const audioSystem = useAudioSystem()

  return (
    <>
      <AudioControls audioSystem={audioSystem} />
      {/* No renderices {audioSystem} aquí */}
    </>
  )
} 