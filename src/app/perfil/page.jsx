'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

export default function PerfilRedirect() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const decoded = jwtDecode(token)
      const rol = decoded.rol
      console.log('ROL DETECTADO EN PERFIL:', rol)

      if (rol === 'profesor') {
        router.push('/perfil/profesor')
      } else if (rol === 'estudiante') {
        router.push('/perfil/estudiante')
      } else {
        // Rol inválido, forzar logout
        localStorage.removeItem('token')
        router.push('/login')
      }
    } catch (err) {
      console.error('Token inválido', err)
      localStorage.removeItem('token')
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-white text-xl font-bold">Cargando tu perfil...</p>
      </div>
    </div>
  )
}
