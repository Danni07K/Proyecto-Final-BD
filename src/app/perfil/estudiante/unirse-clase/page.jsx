'use client'
import { useState } from 'react'

export default function UnirseClase() {
  const [codigo, setCodigo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const unirse = async () => {
    setCargando(true)
    const token = localStorage.getItem('token')

    const res = await fetch('/api/clase/unirse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ codigo })
    })

    const data = await res.json()
    setCargando(false)

    if (res.ok) {
      setMensaje('¡Unido correctamente a la clase!')
    } else {
      setMensaje(data.error || 'Error al unirse')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold text-green-400 mb-6">Unirse a una clase</h1>

      <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-green-600 max-w-md">
        <label className="block text-lg mb-2">Código de la clase</label>
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 border border-green-500 text-white mb-4"
          placeholder="Ej: ABC123"
        />
        <button
          onClick={unirse}
          disabled={cargando}
          className="w-full bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded font-bold shadow-md"
        >
          {cargando ? 'Uniéndose...' : 'Unirse a Clase'}
        </button>
        {mensaje && (
          <p className="mt-4 text-center text-yellow-300">{mensaje}</p>
        )}
      </div>
    </div>
  )
}
