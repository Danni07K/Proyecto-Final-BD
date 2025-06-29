import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import Usuario from '@/models/Usuario'
import { connectDB } from '@/lib/mongoose'

export async function POST(req) {
  try {
    const { nombre, email, password, rol } = await req.json()
    await connectDB()

    // Verificar si el usuario ya existe
    const existingUser = await Usuario.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 })
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear usuario
    const user = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      rol: rol || 'estudiante'
    })

    return NextResponse.json({
      message: 'Usuario registrado exitosamente',
      user: { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol }
    })
  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
