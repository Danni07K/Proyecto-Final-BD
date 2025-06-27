'use client'
import { motion } from 'framer-motion'

export default function XPBar({ experiencia, nivel }) {
  const xpActual = experiencia
  const xpMax = nivel * 100
  const porcentaje = Math.min((xpActual / xpMax) * 100, 100)

  return (
    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden relative">
      {/* Fondo con efecto de brillo */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full"></div>
      
      {/* Barra de progreso animada */}
      <motion.div
        className="h-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 relative overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: `${porcentaje}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Efecto de brillo animado */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Efecto de partículas */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                top: '50%',
                left: `${20 + i * 30}%`,
                transform: 'translateY(-50%)'
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>
      
      {/* Texto de progreso */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white drop-shadow-lg">
          {xpActual}/{xpMax}
        </span>
      </div>
    </div>
  )
}
