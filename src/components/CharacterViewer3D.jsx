'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

// Componente para el personaje equipado (sin Three.js)
function EquippedCharacter({ character, accessories, onAccessoryClick }) {
  const [hovered, setHovered] = useState(false)
  const [rotation, setRotation] = useState(0)
  
  // Animación de rotación
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360)
    }, 50)
    
    return () => clearInterval(interval)
  }, [])

  const getCharacterColor = () => {
    const characterColors = {
      'gojo': '#3b82f6',
      'yuji': '#ef4444', 
      'megumi': '#1f2937',
      'nobara': '#ec4899',
      'yuta': '#10b981',
      'nanami': '#f59e0b'
    }
    return characterColors[character.id] || character.auraColor || '#8b5cf6'
  }

  const getRarityColor = (rareza) => {
    switch (rareza) {
      case 'legendario': return '#fbbf24'
      case 'epico': return '#a855f7'
      case 'raro': return '#3b82f6'
      case 'comun': return '#6b7280'
      default: return '#6b7280'
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Personaje 3D simulado */}
      <motion.div
        className="relative"
        animate={{ rotateY: rotation }}
        transition={{ duration: 0.1, ease: "linear" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Cuerpo del personaje */}
        <div 
          className="w-32 h-48 mx-auto relative"
          style={{ 
            background: `linear-gradient(135deg, ${getCharacterColor()}, ${getCharacterColor()}dd)`,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            boxShadow: `0 0 20px ${getCharacterColor()}40`
          }}
        >
          {/* Cabeza */}
          <div 
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full"
            style={{ 
              background: `linear-gradient(135deg, ${getCharacterColor()}, ${getCharacterColor()}dd)`,
              boxShadow: `0 0 15px ${getCharacterColor()}40`
            }}
          />
          
          {/* Brazos */}
          <div 
            className="absolute top-8 -left-4 w-8 h-20 rounded-full"
            style={{ 
              background: `linear-gradient(135deg, ${getCharacterColor()}, ${getCharacterColor()}dd)`,
              transform: 'rotate(-15deg)'
            }}
          />
          <div 
            className="absolute top-8 -right-4 w-8 h-20 rounded-full"
            style={{ 
              background: `linear-gradient(135deg, ${getCharacterColor()}, ${getCharacterColor()}dd)`,
              transform: 'rotate(15deg)'
            }}
          />
          
          {/* Piernas */}
          <div 
            className="absolute bottom-0 left-4 w-6 h-16 rounded-full"
            style={{ 
              background: `linear-gradient(135deg, ${getCharacterColor()}, ${getCharacterColor()}dd)`,
              transform: 'rotate(-5deg)'
            }}
          />
          <div 
            className="absolute bottom-0 right-4 w-6 h-16 rounded-full"
            style={{ 
              background: `linear-gradient(135deg, ${getCharacterColor()}, ${getCharacterColor()}dd)`,
              transform: 'rotate(5deg)'
            }}
          />
        </div>

        {/* Accesorios equipados */}
        {accessories.map((accessory, index) => (
          <motion.div
            key={accessory.id}
            className="absolute"
            style={{
              left: accessory.tipo === 'arma' ? '60%' : accessory.tipo === 'libro' ? '10%' : '50%',
              top: accessory.tipo === 'accesorio' ? '20%' : '50%',
              transform: 'translate(-50%, -50%)'
            }}
            whileHover={{ scale: 1.2 }}
            onClick={() => onAccessoryClick(accessory)}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${getRarityColor(accessory.rareza)}, ${getRarityColor(accessory.rareza)}dd)`,
                boxShadow: `0 0 10px ${getRarityColor(accessory.rareza)}60`
              }}
            >
              {accessory.tipo === 'arma' ? '⚔️' : 
               accessory.tipo === 'armadura' ? '🛡️' : 
               accessory.tipo === 'accesorio' ? '💍' : 
               accessory.tipo === 'libro' ? '📖' : '✨'}
            </div>
          </motion.div>
        ))}

        {/* Aura de energía */}
        {hovered && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${getCharacterColor()}40 0%, transparent 70%)`,
              border: `2px solid ${getCharacterColor()}60`
            }}
          />
        )}
      </motion.div>

      {/* Información del personaje */}
      <div className="absolute bottom-4 left-4 right-4 bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg border border-purple-500">
        <div className="text-center">
          <p className="text-white font-bold text-lg">{character.nombre}</p>
          <p className="text-purple-300 text-sm">Nivel {character.nivel || 1}</p>
          {accessories.length > 0 && (
            <p className="text-yellow-400 text-xs mt-1">
              {accessories.length} accesorio{accessories.length > 1 ? 's' : ''} equipado{accessories.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// Componente principal del visor de personaje
export default function CharacterViewer3D({ character, accessories = [], onAccessoryClick }) {
  const [selectedAccessory, setSelectedAccessory] = useState(null)

  const handleAccessoryClick = (accessory) => {
    setSelectedAccessory(accessory)
    if (onAccessoryClick) {
      onAccessoryClick(accessory)
    }
  }

  if (!character) {
    return (
      <div className="w-full h-[500px] bg-gray-900/50 rounded-lg border border-purple-500 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎭</div>
          <p className="text-white font-bold">No hay personaje seleccionado</p>
          <p className="text-gray-400 text-sm">Selecciona un personaje para verlo aquí</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[500px] relative bg-gradient-to-br from-gray-900 to-black rounded-lg border border-purple-500 overflow-hidden">
      {/* Partículas de energía maldita */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Controles de cámara */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button className="px-3 py-1 rounded text-sm font-bold bg-purple-600 text-white">
          🔄 Rotación
        </button>
      </div>

      {/* Personaje */}
      <EquippedCharacter 
        character={character} 
        accessories={accessories}
        onAccessoryClick={handleAccessoryClick}
      />

      {/* Lista de accesorios equipados */}
      {accessories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-20 left-4 right-4 bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg border border-purple-500"
        >
          <h4 className="text-purple-400 font-bold mb-2">Accesorios Equipados:</h4>
          <div className="grid grid-cols-2 gap-2">
            {accessories.map((accessory) => (
              <div
                key={accessory.id}
                className="flex items-center gap-2 p-2 bg-gray-800/50 rounded cursor-pointer hover:bg-gray-700/50 transition-colors"
                onClick={() => handleAccessoryClick(accessory)}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: accessory.rareza === 'legendario' ? '#fbbf24' :
                                   accessory.rareza === 'epico' ? '#a855f7' :
                                   accessory.rareza === 'raro' ? '#3b82f6' : '#6b7280'
                  }}
                />
                <span className="text-white text-sm truncate">{accessory.nombre}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Modal de información del accesorio */}
      {selectedAccessory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-20"
          onClick={() => setSelectedAccessory(null)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-gray-900 p-6 rounded-lg border border-purple-500 max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-purple-400 mb-2">{selectedAccessory.nombre}</h3>
            <p className="text-gray-300 mb-4">{selectedAccessory.descripcion}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-yellow-400 font-bold">{selectedAccessory.precio} 💰</span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                selectedAccessory.rareza === 'legendario' ? 'bg-yellow-900/30 text-yellow-400' :
                selectedAccessory.rareza === 'epico' ? 'bg-purple-900/30 text-purple-400' :
                selectedAccessory.rareza === 'raro' ? 'bg-blue-900/30 text-blue-400' :
                'bg-gray-900/30 text-gray-400'
              }`}>
                {selectedAccessory.rareza?.toUpperCase()}
              </span>
            </div>
            <button
              onClick={() => setSelectedAccessory(null)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-bold transition-colors"
            >
              Cerrar
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
} 