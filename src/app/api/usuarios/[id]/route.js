import { connectDB } from '@/lib/mongoose'
import Usuario from '@/models/Usuario'
import { NextResponse } from 'next/server'
import { Types } from 'mongoose'

export async function GET(req, { params }) {
  try {
    await connectDB()
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { id } = await params
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID de usuario inválido' }, { status: 400 })
    }
    const usuario = await Usuario.findById(id).populate('clase')
    if (!usuario) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    return NextResponse.json({ usuario })
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener usuario', detalle: error.message }, { status: 500 })
  }
}
