import { connectDB } from '@/lib/mongoose';
import Clase from '@/models/Clase';

export async function GET() {
  await connectDB();
  const clases = await Clase.find();
  return Response.json(clases);
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const nueva = await Clase.create(data);
  return Response.json(nueva);
}
