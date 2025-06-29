'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Configuración de sonidos
const SOUNDS = {
  // Sonidos de combate
  'attack': {
    url: '/sounds/energia-maldita.mp3',
    volume: 0.7,
    spatial: false
  },
  'defend': {
    url: '/sounds/energia-maldita.mp3',
    volume: 0.5,
    spatial: false
  },
  'special': {
    url: '/sounds/energia-maldita.mp3',
    volume: 0.8,
    spatial: false
  },
  'damage': {
    url: '/sounds/energia-maldita.mp3',
    volume: 0.6,
    spatial: false
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
    spatial: false
  },
  'domain_expansion': {
    url: '/sounds/energia-maldita.mp3',
    volume: 0.9,
    spatial: false
  },

  // Sonidos de UI
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

// Hook personalizado para el sistema de audio
export function useAudioSystem() {
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [masterVolume, setMasterVolume] = useState(0.7)
  const [musicVolume, setMusicVolume] = useState(0.5)
  const [sfxVolume, setSfxVolume] = useState(0.8)
  const [currentMusic, setCurrentMusic] = useState(null)
  const audioContextRef = useRef(null)
  const audioCache = useRef(new Map())
  const currentMusicRef = useRef(null)

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
      if (currentMusicRef.current) {
        currentMusicRef.current.pause()
        currentMusicRef.current = null
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
          console.error(`Error al precargar sonido ${soundId}:`, error)
        }
      }
    }
  }

  // Reproducir sonido
  const playSound = (soundId, options = {}) => {
    if (!audioEnabled || !audioContextRef.current) return

    const sound = SOUNDS[soundId]
    if (!sound) {
      console.warn(`Sonido no encontrado: ${soundId}`)
      return
    }

    try {
      const audio = audioCache.current.get(soundId) || new Audio(sound.url)
      audio.volume = (sound.volume * sfxVolume * masterVolume) * (options.volume || 1)
      audio.loop = options.loop || sound.loop || false
      
      if (audio.readyState >= 2) {
        audio.play().catch(error => {
          console.error(`Error al reproducir sonido ${soundId}:`, error)
        })
      } else {
        audio.addEventListener('canplaythrough', () => {
          audio.play().catch(error => {
            console.error(`Error al reproducir sonido ${soundId}:`, error)
          })
        }, { once: true })
      }
    } catch (error) {
      console.error(`Error al reproducir sonido ${soundId}:`, error)
    }
  }

  // Reproducir música
  const playMusic = (musicId, fadeIn = true) => {
    if (!audioEnabled || !audioContextRef.current) return

    const music = SOUNDS[musicId]
    if (!music) {
      console.warn(`Música no encontrada: ${musicId}`)
      return
    }

    try {
      // Detener música actual si existe
      if (currentMusicRef.current) {
        currentMusicRef.current.pause()
        currentMusicRef.current = null
      }

      const audio = new Audio(music.url)
      audio.volume = fadeIn ? 0 : (music.volume * musicVolume * masterVolume)
      audio.loop = music.loop || false
      
      currentMusicRef.current = audio
      setCurrentMusic(musicId)

      audio.addEventListener('canplaythrough', () => {
        audio.play().catch(error => {
          console.error(`Error al reproducir música ${musicId}:`, error)
        })

        if (fadeIn) {
          fadeInMusic(audio, music.volume * musicVolume * masterVolume)
        }
      }, { once: true })
    } catch (error) {
      console.error(`Error al reproducir música ${musicId}:`, error)
    }
  }

  // Fade in de música
  const fadeInMusic = (audio, targetVolume) => {
    const duration = 2000 // 2 segundos
    const steps = 20
    const stepDuration = duration / steps
    const volumeStep = targetVolume / steps
    let currentStep = 0

    const fadeInterval = setInterval(() => {
      currentStep++
      audio.volume = volumeStep * currentStep

      if (currentStep >= steps) {
        clearInterval(fadeInterval)
        audio.volume = targetVolume
      }
    }, stepDuration)
  }

  // Fade out de música
  const fadeOutMusic = (audio, callback) => {
    const duration = 1000 // 1 segundo
    const steps = 10
    const stepDuration = duration / steps
    const initialVolume = audio.volume
    const volumeStep = initialVolume / steps
    let currentStep = 0

    const fadeInterval = setInterval(() => {
      currentStep++
      audio.volume = initialVolume - (volumeStep * currentStep)

      if (currentStep >= steps) {
        clearInterval(fadeInterval)
        audio.pause()
        audio.currentTime = 0
        if (callback) callback()
      }
    }, stepDuration)
  }

  // Detener música
  const stopMusic = (fadeOut = true) => {
    if (currentMusicRef.current) {
      if (fadeOut) {
        fadeOutMusic(currentMusicRef.current, () => {
          currentMusicRef.current = null
          setCurrentMusic(null)
        })
      } else {
        currentMusicRef.current.pause()
        currentMusicRef.current.currentTime = 0
        currentMusicRef.current = null
        setCurrentMusic(null)
      }
    }
  }

  // Funciones de conveniencia para sonidos específicos
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

  // Funciones de conveniencia para música
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

    // Funciones de sonido
    playSound,
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

    // Funciones de música
    playMusic,
    stopMusic,
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

  if (!audioSystem) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Botón de toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowControls(!showControls)}
        className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all"
      >
        {audioSystem.audioEnabled ? '🔊' : '🔇'}
      </motion.button>

      {/* Panel de controles */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 bg-black/90 backdrop-blur-sm p-4 rounded-lg border border-purple-500 min-w-[250px]"
          >
            <h3 className="text-white font-bold mb-4">🎵 Controles de Audio</h3>
            
            {/* Toggle principal */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-300">Audio</span>
              <button
                onClick={() => audioSystem.setAudioEnabled(!audioSystem.audioEnabled)}
                className={`px-3 py-1 rounded text-sm font-bold transition-all ${
                  audioSystem.audioEnabled
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white'
                }`}
              >
                {audioSystem.audioEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Volumen maestro */}
            <div className="mb-3">
              <label className="text-gray-300 text-sm block mb-1">Volumen Maestro</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={audioSystem.masterVolume}
                onChange={(e) => audioSystem.setMasterVolume(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Volumen música */}
            <div className="mb-3">
              <label className="text-gray-300 text-sm block mb-1">Volumen Música</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={audioSystem.musicVolume}
                onChange={(e) => audioSystem.setMusicVolume(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Volumen efectos */}
            <div className="mb-4">
              <label className="text-gray-300 text-sm block mb-1">Volumen Efectos</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={audioSystem.sfxVolume}
                onChange={(e) => audioSystem.setSfxVolume(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Botones de prueba */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={audioSystem.playButtonClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
              >
                Test Click
              </button>
              <button
                onClick={audioSystem.playAchievement}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs"
              >
                Test Achievement
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Componente principal del sistema de audio
export default function AudioSystem3D() {
  const audioSystem = useAudioSystem()

  return (
    <>
      <AudioControls audioSystem={audioSystem} />
    </>
  )
} 