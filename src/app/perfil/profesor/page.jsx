'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import { motion } from 'framer-motion'

export default function PerfilProfesor() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return router.push('/login')

    try {
      const decoded = jwtDecode(token)
      if (decoded.rol !== 'profesor') {
        router.push('/perfil/estudiante')
      } else {
        setUser(decoded)
      }
    } catch {
      router.push('/login')
    }
  }, [])

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p>Cargando perfil...</p>
      </div>
    </div>
  )

  const funcionalidades = [
    {
      titulo: 'Crear Clase',
      descripcion: 'Crea una nueva clase y genera un código único para que los estudiantes se unan.',
      icono: '🏫',
      color: 'purple',
      ruta: '/perfil/profesor/crear-clase',
      gradiente: 'from-purple-600 to-purple-800'
    },
    {
      titulo: 'Cargar Estudiantes (Excel)',
      descripcion: 'Sube un archivo Excel para registrar múltiples estudiantes en una clase.',
      icono: '📊',
      color: 'blue',
      ruta: '/perfil/profesor/cargar-excel',
      gradiente: 'from-blue-600 to-blue-800'
    },
    {
      titulo: 'Selección Aleatoria',
      descripcion: 'La energía maldita elige aleatoriamente a un estudiante para responder.',
      icono: '🌀',
      color: 'cyan',
      ruta: '/perfil/profesor/aleatorio',
      gradiente: 'from-cyan-600 to-cyan-800'
    },
    {
      titulo: 'Sistema de Calificación',
      descripcion: 'Asigna puntos positivos (+), negativos (-) o GOLD a los estudiantes.',
      icono: '⚡',
      color: 'yellow',
      ruta: '/perfil/profesor/calificar',
      gradiente: 'from-yellow-600 to-yellow-800'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-6 text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold text-yellow-400 mb-4 drop-shadow-2xl">
          🧙‍♂️ PANEL DEL PROFESOR 🧙‍♂️
        </h1>
        <p className="text-xl text-purple-300">
          Bienvenido, Profesor {user.nombre}
        </p>
        <p className="text-gray-400 mt-2">
          Controla tu clase con el poder de la energía maldita
        </p>
      </motion.div>

      {/* Grid de Funcionalidades */}
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-8 md:grid-cols-2">
          {funcionalidades.map((func, index) => (
            <motion.div
              key={func.titulo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl border border-purple-600 shadow-2xl hover:shadow-purple-500/20 transition-all cursor-pointer"
              onClick={() => router.push(func.ruta)}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{func.icono}</div>
                <h2 className="text-2xl font-bold text-purple-400 mb-3">{func.titulo}</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">{func.descripcion}</p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-gradient-to-r ${func.gradiente} hover:from-${func.color}-700 hover:to-${func.color}-900 px-6 py-3 rounded-lg text-white font-bold transition-all shadow-lg`}
                >
                  ⚡ Acceder
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Información Adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-purple-900/30 p-8 rounded-xl border border-purple-500"
        >
          <h3 className="text-2xl font-bold text-purple-400 mb-4 text-center">
            🎯 Funcionalidades Disponibles
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-bold text-yellow-400 mb-2">Para Profesores:</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• Crear clases con códigos únicos</li>
                <li>• Cargar estudiantes masivamente</li>
                <li>• Selección aleatoria de estudiantes</li>
                <li>• Sistema de calificación avanzado</li>
                <li>• Gestión de misiones y recompensas</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-yellow-400 mb-2">Para Estudiantes:</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• Unirse a clases con códigos</li>
                <li>• Seleccionar personajes únicos</li>
                <li>• Comprar accesorios en la tienda</li>
                <li>• Sistema de niveles y experiencia</li>
                <li>• Ranking y competencia</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
