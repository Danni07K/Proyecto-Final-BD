'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useClient'
import PWAInstaller from '@/components/PWAInstaller'

export default function Home() {
  const inscribeteRef = useRef(null)
  const registrateRef = useRef(null)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const { isAuthenticated, logout, isClient } = useAuth()

  const habilitarAudio = async () => {
    try {
      // Crear un contexto de audio
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Crear un oscilador para activar el audio
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Configurar el oscilador (frecuencia muy baja para que sea inaudible)
      oscillator.frequency.setValueAtTime(1, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.001, audioContext.currentTime) // Volumen prácticamente inaudible
      
      // Iniciar y detener rápidamente
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
      
      setAudioEnabled(true)
      console.log('Audio habilitado correctamente')
    } catch (error) {
      console.error('Error al habilitar audio:', error)
      // Fallback: intentar con un audio silencioso
      try {
        const audio = new Audio()
        audio.volume = 0
        await audio.play()
        setAudioEnabled(true)
        console.log('Audio habilitado con fallback')
      } catch (fallbackError) {
        console.error('No se pudo habilitar el audio:', fallbackError)
      }
    }
  }

  const handleHover = (ref) => {
    if (!audioEnabled) return
    
    try {
      const audio = new Audio('/sounds/energia-maldita.mp3')
      audio.volume = 0.5
      audio.play().catch(err => {
        console.log('Audio no pudo reproducirse:', err)
      })
    } catch (error) {
      console.log('Error al reproducir audio:', error)
    }

    if (ref.current) {
      ref.current.classList.remove('animate-shake')
      void ref.current.offsetWidth // Reinicia animación
      ref.current.classList.add('animate-shake')
    }
  }

  const handleButtonHover = () => {
    if (!audioEnabled) return
    
    try {
      const audio = new Audio('/sounds/energia-maldita.mp3')
      audio.volume = 0.5
      audio.play().catch(err => {
        console.log('Audio no pudo reproducirse:', err)
      })
    } catch (error) {
      console.log('Error al reproducir audio:', error)
    }

    const btn = document.getElementById('btn-empezar')
    if (btn) {
      btn.classList.remove('animate-shake')
      void btn.offsetWidth
      btn.classList.add('animate-shake')
    }
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden text-white font-sans">
      {/* 🎥 Fondo en video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/jujutsu-kaisen.mp4" type="video/mp4" />
        Tu navegador no soporta videos en HTML5.
      </video>

      {/* Efectos de partículas de energía maldita */}
      <div className="absolute inset-0 z-1">
        <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
      </div>

      {/* Navbar tipo RPG */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute top-0 left-0 w-full z-20 bg-gradient-to-r from-black/90 via-purple-900/80 to-black/90 backdrop-blur-md flex justify-between items-center px-8 py-4 border-b border-purple-500/50 shadow-2xl"
      >
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <Image src="/logo-jujutsu-kaisen.jpg" width={48} height={48} alt="Logo" className="rounded-full border-2 border-yellow-500 shadow-lg" />
            <div className="absolute -inset-1 bg-yellow-500/20 rounded-full blur-lg animate-pulse"></div>
          </div>
          <h1 className="text-2xl font-extrabold text-yellow-400 tracking-wide drop-shadow-lg">
            JUJUTSU KAISEN
          </h1>
        </motion.div>
        
        <nav className="hidden md:flex gap-6 text-sm text-gray-300 font-medium">
          <motion.a 
            whileHover={{ scale: 1.05, color: '#fbbf24' }}
            href="#" 
            className="hover:text-yellow-400 transition-all duration-300 relative group"
          >
            Testimonios
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></div>
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.05, color: '#fbbf24' }}
            href="#" 
            className="hover:text-yellow-400 transition-all duration-300 relative group"
          >
            Tarifa
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></div>
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.05, color: '#fbbf24' }}
            href="#" 
            className="hover:text-yellow-400 transition-all duration-300 relative group"
          >
            Visión general
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></div>
          </motion.a>
        </nav>
        
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex gap-3"
        >
          {/* Solo mostrar botones de login/register si no hay token */}
          {isClient && !isAuthenticated && (
            <>
              {/* INSCRÍBETE */}
              <Link href="/login">
                <motion.button
                  ref={inscribeteRef}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => handleHover(inscribeteRef)}
                  className="relative px-6 py-3 text-purple-400 border-2 border-purple-400 rounded-lg font-bold overflow-hidden group shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                >
                  <span className="relative z-10">INSCRÍBETE</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-800/20 blur-xl group-hover:opacity-100 opacity-0 transition-all duration-300" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition-all duration-300 animate-pulse" />
                </motion.button>
              </Link>

              {/* REGÍSTRATE */}
              <Link href="/register">
                <motion.button
                  ref={registrateRef}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => handleHover(registrateRef)}
                  className="relative px-6 py-3 text-yellow-400 border-2 border-yellow-400 rounded-lg font-bold overflow-hidden group shadow-lg hover:shadow-yellow-500/50 transition-all duration-300"
                >
                  <span className="relative z-10">REGÍSTRATE</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-yellow-800/20 blur-xl group-hover:opacity-100 opacity-0 transition-all duration-300" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition-all duration-300 animate-pulse" />
                </motion.button>
              </Link>
            </>
          )}

          {/* PERFIL (solo si hay token y estamos en el cliente) */}
          {isClient && isAuthenticated && (
            <>
              <Link href="/perfil">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-lg text-white font-bold shadow-lg transition-all duration-300 relative group overflow-hidden"
                >
                  <span className="relative z-10">Perfil</span>
                  <div className="absolute inset-0 bg-purple-500/20 blur-lg group-hover:animate-pulse-glow" />
                </motion.button>
              </Link>

              {/* CERRAR SESIÓN */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-lg text-white font-bold shadow-lg transition-all duration-300 relative group overflow-hidden"
                onMouseEnter={() => {
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
                }}
              >
                <span className="relative z-10">Cerrar sesión</span>
                <div className="absolute inset-0 bg-red-500/20 blur-lg group-hover:animate-pulse-glow" />
              </motion.button>
            </>
          )}
        </motion.div>
      </motion.header>

      {/* Hero principal */}
      <main className="relative w-full h-full bg-cover bg-center flex flex-col items-center justify-center text-center overflow-hidden z-10 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-0" />

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="z-10 relative bg-gradient-to-br from-black/80 via-purple-900/40 to-black/80 p-12 rounded-2xl shadow-2xl max-w-4xl backdrop-blur-md border border-purple-500/30"
        >
          {/* Efecto de energía maldita alrededor del título */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-yellow-500/20 to-purple-600/20 rounded-2xl blur-xl animate-pulse"></div>
          
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 drop-shadow-2xl mb-6 relative z-10"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            HAZ TUS CLASES INOLVIDABLES
          </motion.h1>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-xl md:text-2xl font-medium text-gray-300 mb-8 leading-relaxed"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Gamifica la educación con tus estudiantes al estilo de los hechiceros de Jujutsu Kaisen
          </motion.p>
          
          {/* Botón para habilitar audio */}
          {!audioEnabled && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              onClick={habilitarAudio}
              className="mb-6 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-purple-500/50 cursor-pointer"
            >
              🔊 Habilitar Efectos de Sonido
            </motion.button>
          )}
          
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={handleButtonHover}
                id="btn-empezar"
                className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white px-12 py-4 rounded-full text-xl font-bold shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                <span className="relative z-10">⚡ Empieza ahora, ¡es gratis!</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-yellow-600/30 blur-xl group-hover:opacity-100 opacity-0 transition-all duration-300" />
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 via-yellow-400 to-purple-400 rounded-full blur opacity-0 group-hover:opacity-40 transition-all duration-300 animate-pulse" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </main>
      <PWAInstaller />
    </div>
  )
}
