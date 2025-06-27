import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(req) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]
    console.log('Token en test-auth:', token ? 'Sí' : 'No')
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    const payload = verifyToken(token)
    console.log('Payload del token:', payload)
    
    return NextResponse.json({ 
      message: 'Autenticación exitosa',
      user: payload 
    })
  } catch (error) {
    console.error('Error en test-auth:', error)
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }
} 