'use client'
import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'

export default function UsuariosPorNivelChart() {
  const [datos, setDatos] = useState([])

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/usuarios', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) return
      const usuarios = await res.json()

      const conteo = {}
      usuarios.forEach(u => {
        conteo[u.nivel] = (conteo[u.nivel] || 0) + 1
      })

      const datosGrafico = Object.entries(conteo).map(([nivel, cantidad]) => ({
        nivel: `Nivel ${nivel}`,
        cantidad
      }))

      setDatos(datosGrafico)
    }

    fetchData()
  }, [])

  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-xl mx-auto">
      <h2 className="text-lg font-semibold text-center mb-4">Usuarios por Nivel</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datos}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nivel" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="cantidad" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
