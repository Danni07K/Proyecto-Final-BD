import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import Usuario from '@/models/Usuario'
import Clase from '@/models/Clase'
import { verifyToken } from '@/lib/auth'

function generarCodigoUnico() {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length: 6 }, () => letras[Math.floor(Math.random() * letras.length)]).join('')
}

export async function POST(req) {
  try {
    await connectDB()
    const token = req.headers.get('authorization')?.split(' ')[1]
    const payload = verifyToken(token)

    if (payload.rol !== 'profesor') {
      return NextResponse.json({ error: 'Solo los profesores pueden crear clases' }, { status: 403 })
    }

    const { nombre, descripcion, habilidades } = await req.json()

    if (!nombre || !descripcion) {
      return NextResponse.json({ error: 'Nombre y descripción son requeridos' }, { status: 400 })
    }

    // Generar código único
    const codigoUnico = Math.random().toString(36).substring(2, 8).toUpperCase()

    const nuevaClase = await Clase.create({
      nombre,
      descripcion,
      habilidades: habilidades || [],
      codigoUnico,
      profesorId: payload.id
    })

    return NextResponse.json({
      message: 'Clase creada exitosamente',
      clase: nuevaClase
    })

  } catch (error) {
    console.error('Error al crear clase:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
