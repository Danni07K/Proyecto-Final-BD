import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import Clase from '@/models/Clase'
import User from '@/models/Usuario'
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

    const { nombre } = await req.json()
    const codigoUnico = generarCodigoUnico()

    const clase = await Clase.create({
      nombre,
      codigoUnico,
      profesorId: payload.id,
      estudiantes: []
    })

    return NextResponse.json({ message: 'Clase creada', codigoUnico, claseId: clase._id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Error en la creación de la clase' }, { status: 500 })
  }
}
