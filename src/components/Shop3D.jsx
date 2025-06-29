'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CharacterViewer3D from './CharacterViewer3D'

// Componente para accesorios 3D con efectos por rareza (sin Three.js)
function Accessory3D({ accessory, isSelected, onSelect, onBuy, onPreview }) {
  const [hovered, setHovered] = useState(false)
  const [rotation, setRotation] = useState(0)
  
  // Animación de rotación
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 2) % 360)
    }, 50)
    
    return () => clearInterval(interval)
  }, [])

  const getRarityColor = (rareza) => {
    switch (rareza) {
      case 'legendario': return '#fbbf24'
      case 'epico': return '#a855f7'
      case 'raro': return '#3b82f6'
      case 'comun': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getAccessoryIcon = (tipo) => {
    switch (tipo) {
      case 'arma': return '⚔️'
      case 'armadura': return '🛡️'
      case 'accesorio': return '💍'
      case 'libro': return '📖'
      case 'consumible': return '🧪'
      default: return '✨'
    }
  }

  return (
    <motion.div
      className="relative cursor-pointer"
      animate={{ rotateY: rotation }}
      transition={{ duration: 0.1, ease: "linear" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(accessory)}
      whileHover={{ scale: 1.1 }}
    >
      {/* Modelo 3D del accesorio */}
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
        style={{
          background: `linear-gradient(135deg, ${getRarityColor(accessory.rareza)}, ${getRarityColor(accessory.rareza)}dd)`,
          boxShadow: `0 0 20px ${getRarityColor(accessory.rareza)}60`
        }}
      >
        {getAccessoryIcon(accessory.tipo)}
      </div>

      {/* Efectos especiales por rareza */}
      {(hovered || isSelected) && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${getRarityColor(accessory.rareza)}40 0%, transparent 70%)`,
            border: `2px solid ${getRarityColor(accessory.rareza)}60`
          }}
        />
      )}

      {/* Partículas para épicos y legendarios */}
      {(accessory.rareza === 'epico' || accessory.rareza === 'legendario') && (hovered || isSelected) && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: getRarityColor(accessory.rareza),
                left: `${50 + Math.sin(i) * 30}%`,
                top: `${50 + Math.cos(i) * 30}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      )}

      {/* Portal dimensional para legendarios */}
      {accessory.rareza === 'legendario' && (hovered || isSelected) && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          className="absolute inset-0 rounded-full border-2 border-dashed"
          style={{
            borderColor: getRarityColor(accessory.rareza),
            transform: 'scale(1.5)',
          }}
        />
      )}
    </motion.div>
  )
}

// Componente principal de la tienda 3D
export default function Shop3D({ accesorios, usuario, onBuyAccessory, character }) {
  const [selectedAccessory, setSelectedAccessory] = useState(null)
  const [viewMode, setViewMode] = useState('showcase') // showcase, grid, preview
  const [previewAccessory, setPreviewAccessory] = useState(null)
  const [equippedAccessories, setEquippedAccessories] = useState([])

  // Configuración de accesorios de ejemplo
  const sampleAccessories = [
    {
      id: '1',
      nombre: 'Espada Maldita',
      descripcion: 'Espada forjada con energía maldita',
      precio: 1500,
      rareza: 'legendario',
      tipo: 'arma',
      stats: { ataque: 50, defensa: 10 }
    },
    {
      id: '2',
      nombre: 'Amuleto de Protección',
      descripcion: 'Protege contra maldiciones menores',
      precio: 800,
      rareza: 'epico',
      tipo: 'accesorio',
      stats: { defensa: 30, resistencia: 20 }
    },
    {
      id: '3',
      nombre: 'Libro de Técnicas',
      descripcion: 'Contiene técnicas secretas de hechicería',
      precio: 1200,
      rareza: 'raro',
      tipo: 'libro',
      stats: { inteligencia: 25, mana: 15 }
    },
    {
      id: '4',
      nombre: 'Poción de Energía',
      descripcion: 'Restaura energía maldita',
      precio: 300,
      rareza: 'comun',
      tipo: 'consumible',
      stats: { energia: 50 }
    },
    {
      id: '5',
      nombre: 'Armadura de Sombra',
      descripcion: 'Armadura que absorbe ataques',
      precio: 2000,
      rareza: 'legendario',
      tipo: 'armadura',
      stats: { defensa: 80, resistencia: 40 }
    },
    {
      id: '6',
      nombre: 'Anillo de Poder',
      descripcion: 'Aumenta el poder de las técnicas',
      precio: 1000,
      rareza: 'epico',
      tipo: 'accesorio',
      stats: { ataque: 30, poder: 25 }
    }
  ]

  const accessoriesToShow = accesorios && accesorios.length > 0 ? accesorios : sampleAccessories

  const handleBuy = (accessory) => {
    if (usuario && usuario.monedas >= accessory.precio) {
      if (onBuyAccessory) {
        onBuyAccessory(accessory)
      }
      // Agregar a accesorios equipados
      setEquippedAccessories(prev => [...prev, accessory])
    } else {
      alert('No tienes suficientes monedas para comprar este accesorio')
    }
  }

  const handlePreview = (accessory) => {
    setPreviewAccessory(accessory)
    setViewMode('preview')
  }

  const getRarityIcon = (rareza) => {
    switch (rareza) {
      case 'legendario': return '⭐'
      case 'epico': return '💎'
      case 'raro': return '🔷'
      case 'comun': return '🔶'
      default: return '🔶'
    }
  }

  const getRarityColor = (rareza) => {
    switch (rareza) {
      case 'legendario': return 'text-yellow-400'
      case 'epico': return 'text-purple-400'
      case 'raro': return 'text-blue-400'
      case 'comun': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  // Vista de preview con personaje equipado
  if (viewMode === 'preview' && previewAccessory) {
    return (
      <div className="w-full h-[600px] relative bg-gradient-to-br from-gray-900 to-black rounded-lg border border-purple-500 overflow-hidden">
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => setViewMode('showcase')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold transition-all"
          >
            ← Volver a la Tienda
          </button>
        </div>
        
        <div className="absolute top-4 right-4 z-10 bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-purple-500">
          <h3 className="text-purple-400 font-bold mb-2">Preview: {previewAccessory.nombre}</h3>
          <p className="text-gray-300 text-sm">{previewAccessory.descripcion}</p>
          <p className={`text-sm font-bold ${getRarityColor(previewAccessory.rareza)}`}>
            {getRarityIcon(previewAccessory.rareza)} {previewAccessory.rareza.toUpperCase()}
          </p>
          <p className="text-yellow-400 font-bold">{previewAccessory.precio} 💰</p>
        </div>

        <div className="w-full h-full">
          {character && (
            <CharacterViewer3D
              character={character}
              accessories={[previewAccessory]}
              onAccessoryClick={() => {}}
            />
          )}
        </div>
      </div>
    )
  }

  // Vista principal de la tienda
  return (
    <div className="w-full h-[600px] relative bg-gradient-to-br from-gray-900 to-black rounded-lg border border-purple-500 overflow-hidden">
      {/* Partículas de energía maldita */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
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

      {/* Controles de vista */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {['showcase', 'grid'].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-3 py-1 rounded text-sm font-bold transition-all ${
              viewMode === mode
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            {mode === 'showcase' ? '🎭 Showcase' : '📦 Grid'}
          </button>
        ))}
      </div>

      {/* Información del usuario */}
      <div className="absolute top-4 right-4 z-10 bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-purple-500">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-yellow-400 font-bold text-xl">{usuario?.monedas || 0}</p>
            <p className="text-gray-400 text-sm">Monedas</p>
          </div>
          <div className="text-center">
            <p className="text-purple-400 font-bold">{equippedAccessories.length}</p>
            <p className="text-gray-400 text-sm">Equipados</p>
          </div>
        </div>
      </div>

      {viewMode === 'showcase' ? (
        // Vista 3D showcase
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative">
            {/* Accesorios en círculo */}
            <div className="relative w-96 h-96">
              {accessoriesToShow.map((accessory, index) => {
                const angle = (index / accessoriesToShow.length) * Math.PI * 2
                const radius = 120
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius
                
                return (
                  <motion.div
                    key={accessory.id}
                    className="absolute"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Accessory3D
                      accessory={accessory}
                      isSelected={selectedAccessory?.id === accessory.id}
                      onSelect={setSelectedAccessory}
                      onBuy={handleBuy}
                      onPreview={handlePreview}
                    />
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        // Vista de grid
        <div className="w-full h-full overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accessoriesToShow.map((accessory) => (
              <motion.div
                key={accessory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg border border-purple-500 hover:border-purple-400 transition-all cursor-pointer"
                onClick={() => setSelectedAccessory(accessory)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-bold">{accessory.nombre}</h3>
                  <span className={`text-2xl ${getRarityColor(accessory.rareza)}`}>
                    {getRarityIcon(accessory.rareza)}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm mb-3">{accessory.descripcion}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 font-bold">{accessory.precio} 💰</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${getRarityColor(accessory.rareza)} bg-gray-800/50`}>
                    {accessory.rareza.toUpperCase()}
                  </span>
                </div>
                
                {selectedAccessory?.id === accessory.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 flex gap-2"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePreview(accessory)
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold transition-all text-sm"
                    >
                      👁️ Preview
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBuy(accessory)
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-bold transition-all text-sm"
                    >
                      💰 Comprar
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Información del accesorio seleccionado */}
      {selectedAccessory && viewMode === 'showcase' && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-purple-400 font-bold">{selectedAccessory.nombre}</h3>
            <span className={`text-sm font-bold ${getRarityColor(selectedAccessory.rareza)}`}>
              {getRarityIcon(selectedAccessory.rareza)} {selectedAccessory.rareza.toUpperCase()}
            </span>
          </div>
          <p className="text-gray-300 text-sm mb-3">{selectedAccessory.descripcion}</p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePreview(selectedAccessory)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold transition-all text-sm"
            >
              👁️ Preview
            </button>
            <button
              onClick={() => handleBuy(selectedAccessory)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-bold transition-all text-sm"
            >
              💰 Comprar {selectedAccessory.precio} 💰
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 