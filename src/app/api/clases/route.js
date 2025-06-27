import { connectDB } from '@/lib/mongoose';
import Clase from '@/models/Clase';

export async function GET(req) {
  try {
    await connectDB();
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) return Response.json({ error: 'No autorizado' }, { status: 401 })
    // Opcional: verificar token aquí si quieres máxima seguridad
    const clases = await Clase.find();
    return Response.json(clases);
  } catch (error) {
    return Response.json({ error: 'Error al obtener clases' }, { status: 500 })
  }
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const nueva = await Clase.create(data);
  return Response.json(nueva);
}
