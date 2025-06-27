import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongoose'
import User from '@/models/Usuario'

export async function POST(req) {
  const { nombre, email, password, rol } = await req.json()
  await connectDB()

  const existing = await User.findOne({ email })
  if (existing) {
    return NextResponse.json({ error: 'Ya existe un usuario con ese email' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    nombre,
    email,
    password: hashedPassword,
    rol: rol || 'estudiante'
  })

  return NextResponse.json({ message: 'Usuario registrado correctamente', userId: user._id })
}
