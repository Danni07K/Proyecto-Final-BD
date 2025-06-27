import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import Usuario from '@/models/Usuario'
import { verifyToken } from '@/lib/auth'

export async function POST(req) {
  try {
    await connectDB()
    const token = req.headers.get('authorization')?.split(' ')[1]
    const payload = verifyToken(token)

    if (payload.rol !== 'profesor') {
      return NextResponse.json({ error: 'Solo los profesores pueden calificar' }, { status: 403 })
    }

    const { estudianteId, tipo, cantidad, motivo } = await req.json()

    const estudiante = await Usuario.findById(estudianteId)
    if (!estudiante) {
      return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
    }

    // Actualizar puntos según el tipo
    switch (tipo) {
      case 'positivo':
        estudiante.puntosPositivos += cantidad
        estudiante.experiencia += cantidad * 10 // Bonus de XP
        break
      case 'negativo':
        estudiante.puntosNegativos += cantidad
        estudiante.experiencia = Math.max(0, estudiante.experiencia - cantidad * 5) // Penalización
        break
      case 'gold':
        estudiante.puntosGold += cantidad
        estudiante.monedas += cantidad * 50 // Bonus de monedas
        estudiante.experiencia += cantidad * 20 // Bonus de XP
        break
      default:
        return NextResponse.json({ error: 'Tipo de calificación inválido' }, { status: 400 })
    }

    // Agregar al historial
    estudiante.historialCalificaciones.push({
      tipo,
      cantidad,
      motivo,
      profesorId: payload.id
    })

    // Verificar si subió de nivel
    let subioNivel = false
    let xpNecesaria = estudiante.nivel * 100
    while (estudiante.experiencia >= xpNecesaria) {
      estudiante.experiencia -= xpNecesaria
      estudiante.nivel += 1
      subioNivel = true
      xpNecesaria = estudiante.nivel * 100
    }

    await estudiante.save()

    return NextResponse.json({
      mensaje: '✅ Calificación aplicada exitosamente',
      subioNivel,
      nuevoNivel: estudiante.nivel,
      puntosActuales: {
        positivos: estudiante.puntosPositivos,
        negativos: estudiante.puntosNegativos,
        gold: estudiante.puntosGold,
        monedas: estudiante.monedas
      }
    })

  } catch (error) {
    console.error('Error al calificar:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 