import { connectDB } from '@/lib/mongoose';
import Mision from '@/models/Mision';

export async function GET() {
  await connectDB();
  const misiones = await Mision.find();
  return Response.json(misiones);
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const nueva = await Mision.create(data);
  return Response.json(nueva);
}
