import { connectDB } from '@/lib/mongoose';
import Usuario from '@/models/Usuario';
import Clase from '@/models/Clase';

export async function GET(req) {
  try {
    await connectDB();
    const token = req.headers.get('authorization')?.split(' ')[1]
    console.log('Token recibido:', token ? 'Sí' : 'No')
    
    if (!token) {
      console.log('No hay token, devolviendo error 401')
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    // Opcional: verificar token aquí si quieres máxima seguridad
    const usuarios = await Usuario.find().populate('clase');
    console.log('Usuarios encontrados:', usuarios.length)
    console.log('Primer usuario:', usuarios[0])
    
    return Response.json(usuarios);
  } catch (error) {
    console.error('Error en GET /api/usuarios:', error)
    return Response.json({ error: 'Error al obtener usuarios' }, { status: 500 })
  }
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const nuevo = await Usuario.create(data);
  return Response.json(nuevo);
}
