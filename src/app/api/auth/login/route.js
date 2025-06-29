// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/mongoose'
import Usuario from '@/models/Usuario'

const JWT_SECRET = process.env.JWT_SECRET || 'secreto-ultra'

export async function POST(req) {
  const { email, password } = await req.json()
  await connectDB()

  const user = await Usuario.findOne({ email })
  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

  const token = jwt.sign(
    { id: user._id, nombre: user.nombre, rol: user.rol },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  const response = NextResponse.json({
    message: 'Login exitoso',
    user: { id: user._id, nombre: user.nombre, rol: user.rol },
    token
  })

  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    sameSite: 'lax'
  })

  return response
}
