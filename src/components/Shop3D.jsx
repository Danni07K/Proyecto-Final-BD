'use client'
import { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Html, Float, Text, PresentationControls } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import VisualEffects, { EnergyParticles, AuraEffect, DimensionalPortal } from './VisualEffects'

// Componente para accesorios 3D
function Accessory3D({ accessory, isSelected, onSelect, position, onBuy }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  // Animación de rotación automática
  useFrame((state) => {
    if (meshRef.current) {
      // Rotación automática
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      
      // Efecto de flotación
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
      
      // Efecto de escala en hover
      if (hovered || isSelected) {
        meshRef.current.scale.setScalar(1.2)
      } else {
        meshRef.current.scale.setScalar(1)
      }
    }
  })

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendario': return '#fbbf24'
      case 'epico': return '#a855f7'
      case 'raro': return '#3b82f6'
      case 'comun': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getRarityGlow = (rarity) => {
    switch (rarity) {
      case 'legendario': return '#fbbf24'
      case 'epico': return '#a855f7'
      case 'raro': return '#3b82f6'
      case 'comun': return '#6b7280'
      default: return '#6b7280'
    }
  }

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onSelect(accessory)}
    >
      {/* Modelo 3D del accesorio */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={getRarityColor(accessory.rareza)}
          metalness={0.8}
          roughness={0.2}
          emissive={getRarityGlow(accessory.rareza)}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>

      {/* Aura de rareza */}
      {(hovered || isSelected) && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial 
            color={getRarityGlow(accessory.rareza)} 
            transparent 
            opacity={0.2}
            wireframe
          />
        </mesh>
      )}

      {/* Información del accesorio */}
      <Html position={[0, 2, 0]} center>
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-purple-500 min-w-[200px]">
          <div className="text-center">
            <p className="text-white font-bold text-sm">{accessory.nombre}</p>
            <p className={`text-xs font-bold ${getRarityColor(accessory.rareza)}`}>
              {accessory.rareza.toUpperCase()}
            </p>
            <p className="text-yellow-400 font-bold text-lg">{accessory.precio} 💰</p>
            <p className="text-gray-300 text-xs mt-1">{accessory.descripcion}</p>
          </div>
        </div>
      </Html>

      {/* Botón de compra */}
      {isSelected && (
        <Html position={[0, -2, 0]} center>
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            onClick={(e) => {
              e.stopPropagation()
              onBuy(accessory)
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold transition-all"
          >
            COMPRAR
          </motion.button>
        </Html>
      )}
    </group>
  )
}

// Componente principal de la tienda 3D
export default function Shop3D({ accesorios, usuario, onBuyAccessory }) {
  const [selectedAccessory, setSelectedAccessory] = useState(null)
  const [viewMode, setViewMode] = useState('showcase') // showcase, grid, detail

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
      nombre: 'Poción de Energía',
      descripcion: 'Restaura energía maldita',
      precio: 300,
      rareza: 'raro',
      tipo: 'consumible',
      stats: { energia: 100 }
    },
    {
      id: '4',
      nombre: 'Túnica del Hechicero',
      descripcion: 'Túnica con runas protectoras',
      precio: 1200,
      rareza: 'epico',
      tipo: 'armadura',
      stats: { defensa: 40, energia: 20 }
    },
    {
      id: '5',
      nombre: 'Grimorio Antiguo',
      descripcion: 'Contiene técnicas prohibidas',
      precio: 2000,
      rareza: 'legendario',
      tipo: 'libro',
      stats: { conocimiento: 100, poder: 30 }
    },
    {
      id: '6',
      nombre: 'Cristal de Energía',
      descripcion: 'Amplifica el poder maldito',
      precio: 600,
      rareza: 'raro',
      tipo: 'accesorio',
      stats: { poder: 25, energia: 15 }
    }
  ]

  const handleBuy = (accessory) => {
    onBuyAccessory(accessory)
    setSelectedAccessory(null)
  }

  const getRarityIcon = (rareza) => {
    switch (rareza) {
      case 'legendario': return '🌟'
      case 'epico': return '💫'
      case 'raro': return '⭐'
      case 'comun': return '⚪'
      default: return '⚪'
    }
  }

  return (
    <div className="w-full h-[700px] relative">
      {/* Canvas 3D */}
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#8b5cf6" />
        <pointLight position={[5, -5, 5]} intensity={0.3} color="#fbbf24" />
        
        <Environment preset="night" />
        
        <PresentationControls
          global
          rotation={[0, -Math.PI / 4, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
        >
          {/* Accesorios en disposición circular */}
          {sampleAccessories.map((accessory, index) => {
            const angle = (index / sampleAccessories.length) * Math.PI * 2
            const radius = 5
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius
            
            return (
              <Accessory3D
                key={accessory.id}
                accessory={accessory}
                isSelected={selectedAccessory?.id === accessory.id}
                onSelect={setSelectedAccessory}
                onBuy={handleBuy}
                position={[x, 0, z]}
              />
            )
          })}
        </PresentationControls>
      </Canvas>

      {/* Panel de información del usuario */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-purple-600"
      >
        <div className="flex items-center space-x-3">
          <img
            src={usuario?.personaje?.avatar || '/avatars/avatar-gojo.png'}
            alt="Avatar"
            className="w-12 h-12 rounded-full border-2 border-purple-500"
          />
          <div>
            <p className="text-white font-bold">{usuario?.nombre}</p>
            <p className="text-purple-300 text-sm">Nivel {usuario?.nivel}</p>
            <p className="text-yellow-400 font-bold">{usuario?.monedas} 💰</p>
          </div>
        </div>
      </motion.div>

      {/* Panel de información del accesorio seleccionado */}
      {selectedAccessory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-xl p-6 border border-purple-600"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{getRarityIcon(selectedAccessory.rareza)}</span>
                <h3 className="text-2xl font-bold text-white">{selectedAccessory.nombre}</h3>
              </div>
              <p className="text-purple-300 mb-2">{selectedAccessory.descripcion}</p>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedAccessory.stats).map(([stat, value]) => (
                  <div key={stat} className="text-center">
                    <p className="text-green-400 font-bold">{value}</p>
                    <p className="text-xs text-gray-400 uppercase">{stat}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-right ml-6">
              <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-500">
                <p className="text-3xl font-bold text-yellow-400">{selectedAccessory.precio}</p>
                <p className="text-sm text-gray-400">Monedas</p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBuy(selectedAccessory)}
                disabled={usuario?.monedas < selectedAccessory.precio}
                className={`mt-4 px-6 py-3 rounded-lg font-bold transition-all ${
                  usuario?.monedas >= selectedAccessory.precio
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {usuario?.monedas >= selectedAccessory.precio ? 'COMPRAR' : 'MONEDAS INSUFICIENTES'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Controles de vista */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-purple-500">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('showcase')}
            className={`px-3 py-1 rounded text-sm font-bold transition-all ${
              viewMode === 'showcase' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            SHOWCASE
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded text-sm font-bold transition-all ${
              viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            GRID
          </button>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="absolute top-20 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-purple-500">
        <p className="text-white text-sm">
          🖱️ Click para seleccionar • 🖱️ Arrastra para rotar • ⌨️ Zoom con rueda
        </p>
      </div>
    </div>
  )
} 