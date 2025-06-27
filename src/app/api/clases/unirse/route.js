// src/app/api/clase/unirse/route.js
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

    const { codigo } = await req.json()

    const clase = await Clase.findOne({ codigoUnico: codigo })
    if (!clase) {
      return NextResponse.json({ error: 'Código de clase no válido' }, { status: 404 })
    }

    const yaRegistrado = clase.estudiantes.includes(payload.id)
    if (yaRegistrado) {
      return NextResponse.json({ error: 'Ya perteneces a esta clase' }, { status: 400 })
    }

    // Agregar al estudiante
    clase.estudiantes.push(payload.id)
    await clase.save()

    // Vincular clase al usuario
    await Usuario.findByIdAndUpdate(payload.id, {
      clase: clase._id,
    })

    return NextResponse.json({ message: 'Unido correctamente a la clase', claseId: clase._id })
  } catch (err) {
    console.error('Error al unirse a clase:', err)
    return NextResponse.json({ error: 'Error al unirse a la clase' }, { status: 500 })
  }
}
