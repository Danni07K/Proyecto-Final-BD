'use client'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

const CHARACTERS = [
  {
    id: 'gojo',
    name: 'Satoru Gojo',
    image: '/avatars/avatar-gojo.png',
    description: 'El hechicero más fuerte, maestro del infinito.',
    ability: 'Limitless',
    abilityDesc: 'Manipula el espacio a su alrededor para defender y atacar.'
  },
  {
    id: 'yuji',
    name: 'Yuji Itadori',
    image: '/avatars/avatar-itadori.png',
    description: 'Portador de Sukuna, gran fuerza física.',
    ability: 'Divergencia',
    abilityDesc: 'Golpes dobles y energía maldita.'
  },
  {
    id: 'megumi',
    name: 'Megumi Fushiguro',
    image: '/avatars/avatar-megumi.png',
    description: 'Invocador de shikigamis de sombra.',
    ability: 'Diez Sombras',
    abilityDesc: 'Invoca bestias de sombra para atacar y defender.'
  },
  {
    id: 'nobara',
    name: 'Nobara Kugisaki',
    image: '/avatars/avatar-nobara.png',
    description: 'Hechicera de clavos y muñecos.',
    ability: 'Resonancia',
    abilityDesc: 'Daña a sus enemigos a distancia con muñecos y clavos.'
  },
  {
    id: 'yuta',
    name: 'Yuta Okkotsu',
    image: '/avatars/avatar-yuta.png',
    description: 'Portador de Rika, energía maldita inmensa.',
    ability: 'Rika',
    abilityDesc: 'Invoca a Rika para ataques devastadores.'
  },
  {
    id: 'nanami',
    name: 'Kento Nanami',
    image: '/avatars/avatar-nanami.png',
    description: 'Hechicero de grado 1, preciso y calculador.',
    ability: 'Ratio Technique',
    abilityDesc: 'Divide a sus enemigos y ataca puntos débiles.'
  }
]

export default function CharacterSelector3D({ onCharacterSelect }) {
  const [selected, setSelected] = useState(CHARACTERS[0])
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)

  // Rotación 3D simulada con el mouse
  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateY = ((x - centerX) / centerX) * 18 // grados
    const rotateX = -((y - centerY) / centerY) * 18
    setRotation({ x: rotateX, y: rotateY })
  }
  const handleMouseLeave = () => setRotation({ x: 0, y: 0 })

  return (
    <div className="relative w-full h-[600px] flex rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-black via-purple-950 to-black">
      {/* Fondo partículas y energía */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-400/10 blur-2xl"
            style={{
              width: `${40 + Math.random() * 80}px`,
              height: `${40 + Math.random() * 80}px`,
              left: `${Math.random() * 95}%`,
              top: `${Math.random() * 95}%`,
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
              y: [0, Math.random() * 40 - 20, 0],
              x: [0, Math.random() * 40 - 20, 0],
            }}
            transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>

      {/* Columna izquierda: personajes */}
      <div className="z-10 w-1/5 min-w-[120px] max-w-[160px] bg-black/40 flex flex-col items-center py-6 gap-2 border-r border-purple-900 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-700/40 scrollbar-track-transparent">
        {CHARACTERS.map((char) => (
          <button
            key={char.id}
            className={`group flex flex-col items-center w-full py-2 px-1 rounded-xl transition-all duration-200 border-2 ${selected.id === char.id ? 'border-purple-400 bg-purple-900/60 shadow-lg scale-105' : 'border-transparent hover:border-purple-700 hover:bg-purple-900/30'}`}
            onClick={() => setSelected(char)}
          >
            <img src={char.image} alt={char.name} className="w-14 h-14 rounded-lg object-cover group-hover:scale-110 transition-transform duration-200" />
            <div className="text-xs text-white mt-1 font-bold text-center drop-shadow-lg whitespace-nowrap">{char.name}</div>
          </button>
        ))}
      </div>

      {/* Centro: personaje grande */}
      <div className="z-10 w-3/5 flex flex-col items-center justify-center relative">
        <motion.div
          ref={cardRef}
          className="relative w-80 h-[420px] bg-gradient-to-br from-purple-700/60 to-blue-900/60 rounded-3xl shadow-2xl flex flex-col items-center justify-end border-4 border-purple-500/30 mt-6 mb-2"
          style={{
            perspective: '1200px',
            transformStyle: 'preserve-3d',
            boxShadow: '0 0 80px 10px #a78bfa44',
            transition: 'box-shadow 0.3s'
          }}
          animate={{
            rotateX: rotation.x,
            rotateY: rotation.y
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Efecto de aura */}
          <motion.div
            className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-purple-400/20 blur-2xl z-0"
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {/* Imagen grande */}
          <img
            src={selected.image}
            alt={selected.name}
            className="relative z-10 w-56 h-56 object-cover rounded-2xl border-4 border-white/20 shadow-xl mb-4 mt-8 select-none pointer-events-none"
            draggable={false}
          />
          {/* Nombre */}
          <div className="z-10 text-3xl font-extrabold text-white drop-shadow-lg mb-4 text-center">
            {selected.name}
          </div>
        </motion.div>
        {/* Botón de seleccionar */}
        <button
          onClick={() => onCharacterSelect && onCharacterSelect(selected)}
          className="mt-4 px-10 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all text-lg"
        >
          Seleccionar
        </button>
      </div>

      {/* Derecha: detalles y habilidades */}
      <div className="z-10 w-1/4 min-w-[220px] bg-black/30 flex flex-col justify-center px-8 border-l border-purple-900">
        <div className="text-lg text-purple-300 font-bold mb-2">Habilidad</div>
        <div className="text-2xl text-white font-extrabold mb-2">{selected.ability}</div>
        <div className="text-white/80 mb-4">{selected.abilityDesc}</div>
        <div className="text-purple-200 text-sm mb-2">Descripción</div>
        <div className="text-white/90 text-base mb-4">{selected.description}</div>
        <button
          className="mt-2 px-6 py-2 bg-gradient-to-r from-purple-700 to-blue-700 text-white rounded-lg font-semibold shadow hover:from-purple-800 hover:to-blue-800 transition-all"
          disabled
        >
          Subir de nivel (próximamente)
        </button>
      </div>
    </div>
  )
}