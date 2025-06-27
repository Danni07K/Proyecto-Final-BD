import { connectDB } from '@/lib/mongoose';
import Usuario from '@/models/Usuario';
import Mision from '@/models/Mision';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectDB();
    const { usuarioId, misionId } = await req.json();

    const usuario = await Usuario.findById(usuarioId);
    const mision = await Mision.findById(misionId);

    if (!usuario || !mision) {
      return NextResponse.json({ error: 'Usuario o misión no encontrados' }, { status: 404 });
    }

    let subioNivel = false;

    if (!usuario.misionesCompletadas.includes(misionId)) {
      usuario.misionesCompletadas.push(misionId);
      usuario.experiencia += mision.experiencia;

      let xpNecesaria = usuario.nivel * 100;
      while (usuario.experiencia >= xpNecesaria) {
        usuario.experiencia -= xpNecesaria;
        usuario.nivel += 1;
        subioNivel = true;
        xpNecesaria = usuario.nivel * 100;
      }

      await usuario.save();

      if (mision.estado !== 'completada') {
        mision.estado = 'completada';
        await mision.save();
      }
    }

    return NextResponse.json({
      mensaje: '✅ Misión asignada correctamente',
      subioNivel,
      nuevoNivel: usuario.nivel
    });
  } catch (error) {
    console.error('Error al asignar misión:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}


