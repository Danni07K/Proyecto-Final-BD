import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import Usuario from '@/models/Usuario'
import { verifyToken } from '@/lib/auth'

export async function POST(req) {
  try {
    await connectDB()
    const token = req.headers.get('authorization')?.split(' ')[1]
    const payload = verifyToken(token)

    const { nombre, avatar } = await req.json()

    const user = await Usuario.findByIdAndUpdate(payload.id, {
      personaje: { nombre, avatar }
    }, { new: true })

    return NextResponse.json({ message: 'Personaje asignado', personaje: user.personaje })
  } catch (err) {
    console.error('Error al asignar personaje:', err)
    return NextResponse.json({ error: 'Error al asignar personaje' }, { status: 500 })
  }
}
