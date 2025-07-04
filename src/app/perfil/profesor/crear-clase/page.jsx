'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function CrearClasePage() {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [codigo, setCodigo] = useState(null)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [mostrarBotonPanel, setMostrarBotonPanel] = useState(false)
  const formRef = useRef(null)
  const router = useRouter()

  const habilitarAudio = () => {
    setAudioEnabled(true)
    // Reproducir un sonido silencioso para activar el audio
    const audio = new Audio()
    audio.play().then(() => {
      console.log('Audio habilitado')
    }).catch(() => {
      console.log('No se pudo habilitar el audio')
    })
  }

  const reproducirSonido = () => {
    if (!audioEnabled) return
    
    try {
      const audio = new Audio('/sounds/energia-maldita.mp3')
      audio.volume = 0.7
      audio.play().catch(err => {
        console.log('Audio no pudo reproducirse:', err)
      })
    } catch (error) {
      console.log('Error al reproducir audio:', error)
    }
  }

  const crearClase = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    if (!token) {
      setMensaje('Debes iniciar sesión')
      return
    }

    const res = await fetch('/api/clases/crear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nombre, descripcion })
    })

    const data = await res.json()

    if (!res.ok) {
      setMensaje(data.error || 'Error al crear la clase')
      return
    }

    const codigoClase = data.codigoUnico || (data.clase && data.clase.codigoUnico) || ''
    setCodigo(codigoClase)
    setMensaje('✨ Clase creada con éxito')
    setNombre('')
    setDescripcion('')
    reproducirSonido()
    setMostrarBotonPanel(true)

    // Reiniciar animación de glow
    if (formRef.current) {
      formRef.current.classList.remove('animate-glow-dark')
      void formRef.current.offsetWidth
      formRef.current.classList.add('animate-glow-dark')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-4xl font-extrabold text-yellow-400 mb-6">Crear nueva clase</h1>
      
      {/* Botón para habilitar audio */}
      {!audioEnabled && (
        <div className="text-center mb-6">
          <button
            onClick={habilitarAudio}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold transition-all"
          >
            🔊 Habilitar Efectos de Sonido
          </button>
        </div>
      )}
      
      <form
        ref={formRef}
        onSubmit={crearClase}
        className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg mx-auto space-y-4 border border-purple-600 transition-all duration-300"
      >
        <input
          type="text"
          placeholder="Nombre de la clase (Ej: 3B)"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
          required
        />
        <textarea
          placeholder="Descripción de la clase (Ej: Matemáticas avanzadas)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
          required
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-purple-700 hover:bg-purple-800 rounded font-bold text-white transition transform hover:scale-105 shadow-md relative overflow-hidden"
        >
          Crear clase
          <span className="absolute inset-0 bg-purple-400 opacity-10 blur-xl animate-pulse" />
        </button>
        {mensaje && <p className="text-sm mt-2 text-yellow-300">{mensaje}</p>}
        {codigo && (
          <div className="mt-4 bg-black border-2 border-yellow-500 p-6 rounded-xl text-center animate-glow-dark relative shadow-2xl">
            <div className="text-2xl font-extrabold text-yellow-400 mb-2 tracking-widest drop-shadow-lg flex items-center justify-center gap-2">
              <span className="text-4xl animate-pulse-glow">🔑</span>
              <span id="codigo-clase" className="select-all">{codigo}</span>
              <button
                type="button"
                onClick={() => {navigator.clipboard.writeText(codigo)}}
                className="ml-2 px-3 py-1 bg-purple-700 hover:bg-purple-800 rounded-lg text-white font-bold text-base transition-all border-2 border-purple-500 shadow-md"
              >
                Copiar
              </button>
            </div>
            <div className="text-purple-300 mt-2 text-lg font-semibold">Comparte este código con tus estudiantes para que se unan a tu clase</div>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-gradient-to-r from-yellow-400/30 via-purple-500/30 to-yellow-400/30 blur-xl rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-gradient-to-r from-yellow-400/30 via-purple-500/30 to-yellow-400/30 blur-xl rounded-full animate-pulse"></div>
            {mostrarBotonPanel && (
              <button
                type="button"
                onClick={() => router.push('/perfil/profesor')}
                className="mt-6 w-full py-3 bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 rounded-xl text-white font-extrabold text-lg shadow-lg transition-all animate-pulse-glow"
              >
                Ir al panel del profesor
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
