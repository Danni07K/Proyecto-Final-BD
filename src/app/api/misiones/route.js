import { connectDB } from '@/lib/mongoose';
import Mision from '@/models/Mision';

export async function GET(req) {
  try {
    await connectDB();
    const token = req.headers.get('authorization')?.split(' ')[1]
    console.log('Token recibido en misiones:', token ? 'Sí' : 'No')
    
    if (!token) {
      console.log('No hay token en misiones, devolviendo error 401')
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    // Opcional: verificar token aquí si quieres máxima seguridad
    const misiones = await Mision.find();
    console.log('Misiones encontradas:', misiones.length)
    console.log('Primera misión:', misiones[0])
    
    return Response.json(misiones);
  } catch (error) {
    console.error('Error en GET /api/misiones:', error)
    return Response.json({ error: 'Error al obtener misiones' }, { status: 500 })
  }
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const nueva = await Mision.create(data);
  return Response.json(nueva);
}
