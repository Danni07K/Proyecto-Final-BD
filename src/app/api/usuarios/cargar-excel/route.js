import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import Usuario from '@/models/Usuario'
import Clase from '@/models/Clase'
import { verifyToken } from '@/lib/auth'

export async function POST(req) {
  try {
    await connectDB()
    const token = req.headers.get('authorization')?.split(' ')[1]
    const payload = verifyToken(token)

    if (payload.rol !== 'profesor') {
      return NextResponse.json({ error: 'Solo los profesores pueden cargar estudiantes' }, { status: 403 })
    }

    const { estudiantes, claseId } = await req.json()

    if (!estudiantes || !Array.isArray(estudiantes)) {
      return NextResponse.json({ error: 'Datos de estudiantes inválidos' }, { status: 400 })
    }

    const clase = await Clase.findOne({ 
      profesorId: payload.id,
      _id: claseId 
    })

    if (!clase) {
      return NextResponse.json({ error: 'Clase no encontrada' }, { status: 404 })
    }

    const resultados = {
      exitosos: [],
      errores: [],
      total: estudiantes.length
    }

    for (const estudianteData of estudiantes) {
      try {
        // Validar datos requeridos
        if (!estudianteData.nombre || !estudianteData.email) {
          resultados.errores.push({
            estudiante: estudianteData,
            error: 'Nombre y email son requeridos'
          })
          continue
        }

        // Verificar si el email ya existe
        const existe = await Usuario.findOne({ email: estudianteData.email })
        if (existe) {
          resultados.errores.push({
            estudiante: estudianteData,
            error: 'Email ya registrado'
          })
          continue
        }

        // Crear estudiante
        const nuevoEstudiante = await Usuario.create({
          nombre: estudianteData.nombre,
          email: estudianteData.email,
          password: 'password123', // Contraseña temporal
          rol: 'estudiante',
          clase: claseId,
          nivel: 1,
          experiencia: 0
        })

        // Agregar a la clase
        clase.estudiantes.push(nuevoEstudiante._id)
        await clase.save()

        resultados.exitosos.push({
          id: nuevoEstudiante._id,
          nombre: nuevoEstudiante.nombre,
          email: nuevoEstudiante.email
        })

      } catch (error) {
        resultados.errores.push({
          estudiante: estudianteData,
          error: error.message
        })
      }
    }

    return NextResponse.json({
      mensaje: `✅ Carga completada: ${resultados.exitosos.length} exitosos, ${resultados.errores.length} errores`,
      resultados
    })

  } catch (error) {
    console.error('Error al cargar Excel:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 