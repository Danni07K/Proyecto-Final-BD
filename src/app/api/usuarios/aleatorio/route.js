import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import Clase from '@/models/Clase'
import Usuario from '@/models/Usuario'
import { verifyToken } from '@/lib/auth'

export async function POST(req) {
  try {
    await connectDB()
    const token = req.headers.get('authorization')?.split(' ')[1]
    const payload = verifyToken(token)

    const { claseId } = await req.json()
    if (!claseId) {
      return NextResponse.json({ error: 'ID de clase requerido.' }, { status: 400 })
    }

    const clase = await Clase.findById(claseId).populate('estudiantes')
    if (!clase) {
      return NextResponse.json({ error: 'Clase no encontrada.' }, { status: 404 })
    }

    const estudiantes = clase.estudiantes.filter(e => e && e.nombre)
    if (!estudiantes.length) {
      return NextResponse.json({ error: 'No hay estudiantes en la clase para seleccionar.' }, { status: 400 })
    }

    // Selección aleatoria
    const randomIndex = Math.floor(Math.random() * estudiantes.length)
    const estudiante = estudiantes[randomIndex]

    // Efectos de energía maldita
    const efectos = [
      '⚡ Energía maldita detectada...',
      '🌀 Técnica de dominio expandido...',
      '💫 Cursed Energy en acción...',
      '🌟 Poder de hechicero activado...',
      '🔥 Seleccionando al elegido...'
    ]
    const efecto = efectos[Math.floor(Math.random() * efectos.length)]

    return NextResponse.json({ estudiante, efecto })
  } catch (error) {
    console.error('Error en selección aleatoria:', error)
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
} 