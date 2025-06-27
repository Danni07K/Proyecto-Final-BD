import { connectDB } from '@/lib/mongoose'
import Usuario from '@/models/Usuario'

export async function GET(req, { params }) {
  try {
    await connectDB()
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) return Response.json({ error: 'No autorizado' }, { status: 401 })
    const usuario = await Usuario.findById(params.id).populate('clase')
    if (!usuario) return Response.json({ error: 'Usuario no encontrado' }, { status: 404 })
    return Response.json({ usuario })
  } catch (error) {
    return Response.json({ error: 'Error al obtener usuario' }, { status: 500 })
  }
}
