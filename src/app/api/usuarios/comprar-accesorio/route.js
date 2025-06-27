import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import Usuario from '@/models/Usuario'
import { verifyToken } from '@/lib/auth'

// Catálogo de accesorios disponibles
const ACCESORIOS_DISPONIBLES = {
  'mascara-gojo': {
    nombre: 'Máscara de Gojo',
    precio: 200,
    descripcion: 'Máscara negra característica de Satoru Gojo',
    imagen: '/accesorios/mascara-gojo.png',
    rareza: 'legendario'
  },
  'espada-megumi': {
    nombre: 'Espada de Megumi',
    precio: 150,
    descripcion: 'Espada ceremonial de Megumi Fushiguro',
    imagen: '/accesorios/espada-megumi.png',
    rareza: 'epico'
  },
  'martillo-nobara': {
    nombre: 'Martillo de Nobara',
    precio: 120,
    descripcion: 'Martillo y clavos de Nobara Kugisaki',
    imagen: '/accesorios/martillo-nobara.png',
    rareza: 'raro'
  },
  'capa-itadori': {
    nombre: 'Capa de Itadori',
    precio: 100,
    descripcion: 'Capa escolar de Yuji Itadori',
    imagen: '/accesorios/capa-itadori.png',
    rareza: 'comun'
  },
  'gafas-nanami': {
    nombre: 'Gafas de Nanami',
    precio: 80,
    descripcion: 'Gafas elegantes de Kento Nanami',
    imagen: '/accesorios/gafas-nanami.png',
    rareza: 'comun'
  },
  'collar-sukuna': {
    nombre: 'Collar de Sukuna',
    precio: 300,
    descripcion: 'Collar místico del Rey de las Maldiciones',
    imagen: '/accesorios/collar-sukuna.png',
    rareza: 'legendario'
  }
}

export async function POST(req) {
  try {
    await connectDB()
    const token = req.headers.get('authorization')?.split(' ')[1]
    const payload = verifyToken(token)

    if (payload.rol !== 'estudiante') {
      return NextResponse.json({ error: 'Solo los estudiantes pueden comprar accesorios' }, { status: 403 })
    }

    const { accesorioId } = await req.json()

    const usuario = await Usuario.findById(payload.id)
    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const accesorio = ACCESORIOS_DISPONIBLES[accesorioId]
    if (!accesorio) {
      return NextResponse.json({ error: 'Accesorio no encontrado' }, { status: 404 })
    }

    // Verificar si ya tiene el accesorio
    if (usuario.accesoriosComprados.includes(accesorioId)) {
      return NextResponse.json({ error: 'Ya tienes este accesorio' }, { status: 400 })
    }

    // Verificar si tiene suficientes monedas
    if (usuario.monedas < accesorio.precio) {
      return NextResponse.json({ 
        error: 'Monedas insuficientes',
        monedasNecesarias: accesorio.precio,
        monedasActuales: usuario.monedas
      }, { status: 400 })
    }

    // Realizar la compra
    usuario.monedas -= accesorio.precio
    usuario.accesoriosComprados.push(accesorioId)
    
    // Bonus de experiencia por compra
    usuario.experiencia += 10

    // Verificar si subió de nivel
    let subioNivel = false
    let xpNecesaria = usuario.nivel * 100
    while (usuario.experiencia >= xpNecesaria) {
      usuario.experiencia -= xpNecesaria
      usuario.nivel += 1
      subioNivel = true
      xpNecesaria = usuario.nivel * 100
    }

    await usuario.save()

    return NextResponse.json({
      mensaje: `✅ ¡${accesorio.nombre} comprado exitosamente!`,
      accesorio,
      monedasRestantes: usuario.monedas,
      subioNivel,
      nuevoNivel: usuario.nivel,
      experiencia: usuario.experiencia
    })

  } catch (error) {
    console.error('Error al comprar accesorio:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// Endpoint para obtener catálogo
export async function GET() {
  return NextResponse.json({
    accesorios: ACCESORIOS_DISPONIBLES
  })
} 