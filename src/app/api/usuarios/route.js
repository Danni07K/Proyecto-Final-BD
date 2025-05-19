import { connectDB } from '@/lib/mongoose';
import Usuario from '@/models/Usuario';

export async function GET() {
  await connectDB();
  const usuarios = await Usuario.find().populate('clase');
  return Response.json(usuarios);
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const nuevo = await Usuario.create(data);
  return Response.json(nuevo);
}
