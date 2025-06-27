'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import XPBar from '@/components/XPBar'

export default function AlumnoPage() {
  const { id } = useParams()
  const [usuario, setUsuario] = useState(null)
  const [misiones, setMisiones] = useState([])

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Error al cargar usuario')
      const data = await res.json()
      setUsuario(data.usuario)
      setMisiones(await fetch(`/api/misiones`).then(res => res.json()))
    }

    fetchData()
  }, [id])

  if (!usuario) return <p className="p-10 text-center">Cargando perfil del alumno...</p>

  const completadas = usuario.misionesCompletadas.map(m => m._id)
  const misionesCompletadas = misiones.filter(m => completadas.includes(m._id))
  const misionesPendientes = misiones.filter(m => !completadas.includes(m._id))

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded space-y-6">
      <h1 className="text-2xl font-bold">🎓 Perfil del alumno</h1>

      <div>
        <p className="text-lg font-semibold">{usuario.nombre}</p>
        <p className="text-sm text-gray-600">Clase: {usuario.clase?.nombre || 'Sin clase'}</p>
        <p className="text-sm text-gray-600">Nivel {usuario.nivel} — {usuario.experiencia}/{usuario.nivel * 100} XP</p>
        <XPBar experiencia={usuario.experiencia} nivel={usuario.nivel} />
      </div>

      <div>
        <h2 className="font-bold text-xl mt-6 mb-2">📜 Misiones completadas</h2>
        <ul className="list-disc pl-6 text-green-700">
          {misionesCompletadas.length === 0 && <li>No ha completado misiones aún.</li>}
          {misionesCompletadas.map(m => (
            <li key={m._id}>
              <strong>{m.titulo}</strong> — +{m.experiencia} XP
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-bold text-xl mt-6 mb-2">🕑 Misiones pendientes</h2>
        <ul className="list-disc pl-6 text-yellow-700">
          {misionesPendientes.length === 0 && <li>¡Ha completado todas las misiones!</li>}
          {misionesPendientes.map(m => (
            <li key={m._id}>
              <strong>{m.titulo}</strong> — {m.experiencia} XP
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
