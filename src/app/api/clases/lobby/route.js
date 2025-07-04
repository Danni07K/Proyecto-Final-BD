import { connectDB } from '@/lib/mongoose';
import Usuario from '@/models/Usuario';
import Clase from '@/models/Clase';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// Modelo de mensaje de chat (puedes moverlo a models si lo deseas)
const ChatLobbySchema = {
  _id: ObjectId,
  classId: String,
  user: String,
  avatar: String,
  msg: String,
  created_at: Date,
};

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get('classId');
  if (!classId) {
    return NextResponse.json({ error: 'classId requerido' }, { status: 400 });
  }
  if (!ObjectId.isValid(classId)) {
    return NextResponse.json({ error: 'classId inválido, debe ser un ObjectId de MongoDB' }, { status: 400 });
  }

  // Buscar la clase y sus estudiantes
  const clase = await Clase.findOne({ _id: classId }).populate('estudiantes');
  if (!clase) {
    return NextResponse.json({ error: 'Clase no encontrada' }, { status: 404 });
  }
  const estudiantes = clase.estudiantes.map(e => ({
    nombre: e.nombre,
    avatar: e.avatar,
    personaje: e.personaje,
  }));

  // Leer mensajes del chat del lobby (colección chat_lobby)
  const db = (await connectDB()).connection.db;
  const chat = await db.collection('chat_lobby')
    .find({ classId })
    .sort({ created_at: 1 })
    .toArray();

  return NextResponse.json({ estudiantes, chat });
} 