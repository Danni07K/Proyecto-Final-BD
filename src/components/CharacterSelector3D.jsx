'use client'
import { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Html, Text, Float, PresentationControls } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

// Componente para el personaje 3D
function CharacterModel({ character, isSelected, onSelect, position }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  // Animación de flotación
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  // Efecto de hover
  useEffect(() => {
    if (meshRef.current) {
      if (hovered || isSelected) {
        meshRef.current.scale.setScalar(1.1)
      } else {
        meshRef.current.scale.setScalar(1)
      }
    }
  }, [hovered, isSelected])

  const handleClick = () => {
    onSelect(character)
  }

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Modelo 3D del personaje */}
      <primitive 
        object={character.model} 
        scale={character.scale || 1.5}
        position={[0, -1, 0]}
      />
      
      {/* Efecto de selección */}
      {isSelected && (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Html position={[0, 3, 0]} center>
            <div className="bg-purple-600/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-400">
              <p className="text-white font-bold text-sm">✓ SELECCIONADO</p>
            </div>
          </Html>
        </Float>
      )}
      
      {/* Nombre del personaje */}
      <Html position={[0, -2.5, 0]} center>
        <div className="text-center">
          <p className="text-white font-bold text-lg drop-shadow-lg">{character.name}</p>
          <p className="text-purple-300 text-sm">{character.type}</p>
        </div>
      </Html>
      
      {/* Aura de energía */}
      {(hovered || isSelected) && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial 
            color={character.auraColor || '#8b5cf6'} 
            transparent 
            opacity={0.1}
            wireframe
          />
        </mesh>
      )}
    </group>
  )
}

// Componente principal del selector
export default function CharacterSelector3D({ onCharacterSelect }) {
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [cameraMode, setCameraMode] = useState('orbit') // orbit, free, cinematic

  // Configuración de personajes
  const characterConfigs = [
    {
      id: 'gojo',
      name: 'Satoru Gojo',
      type: 'Hechicero Especial',
      model: null,
      scale: 2.2,
      auraColor: '#3b82f6',
      description: 'El hechicero más poderoso con la técnica del Infinito',
      stats: { poder: 100, velocidad: 95, resistencia: 90 }
    },
    {
      id: 'yuji',
      name: 'Yuji Itadori',
      type: 'Hechicero Novato',
      model: null,
      scale: 1.8,
      auraColor: '#ef4444',
      description: 'Estudiante con potencial excepcional',
      stats: { poder: 85, velocidad: 90, resistencia: 95 }
    },
    {
      id: 'megumi',
      name: 'Megumi Fushiguro',
      type: 'Hechicero de Sombras',
      model: null,
      scale: 1.9,
      auraColor: '#1f2937',
      description: 'Maestro de las técnicas de sombra',
      stats: { poder: 80, velocidad: 85, resistencia: 85 }
    },
    {
      id: 'nobara',
      name: 'Nobara Kugisaki',
      type: 'Hechicera de Clavos',
      model: null,
      scale: 1.7,
      auraColor: '#ec4899',
      description: 'Especialista en técnicas de maldición',
      stats: { poder: 75, velocidad: 80, resistencia: 80 }
    }
  ]

  // Cargar modelos 3D
  useEffect(() => {
    const loadModels = async () => {
      try {
        // Por ahora usaremos modelos placeholder, pero aquí cargarías los modelos reales
        const loadedCharacters = characterConfigs.map(char => ({
          ...char,
          model: new THREE.Group() // Placeholder - aquí cargarías el modelo real
        }))
        
        setCharacters(loadedCharacters)
        setLoading(false)
      } catch (error) {
        console.error('Error cargando modelos:', error)
        setLoading(false)
      }
    }

    loadModels()
  }, [])

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character)
    onCharacterSelect(character)
  }

  if (loading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando personajes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[600px] relative">
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
          {/* Personajes en círculo */}
          {characters.map((character, index) => {
            const angle = (index / characters.length) * Math.PI * 2
            const radius = 4
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius
            
            return (
              <CharacterModel
                key={character.id}
                character={character}
                isSelected={selectedCharacter?.id === character.id}
                onSelect={handleCharacterSelect}
                position={[x, 0, z]}
              />
            )
          })}
        </PresentationControls>
      </Canvas>

      {/* Panel de información del personaje seleccionado */}
      {selectedCharacter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-xl p-6 border border-purple-600"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">{selectedCharacter.name}</h3>
              <p className="text-purple-300">{selectedCharacter.type}</p>
              <p className="text-gray-400 text-sm mt-2">{selectedCharacter.description}</p>
            </div>
            
            <div className="text-right">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-red-400 font-bold">{selectedCharacter.stats.poder}</p>
                  <p className="text-xs text-gray-400">PODER</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-400 font-bold">{selectedCharacter.stats.velocidad}</p>
                  <p className="text-xs text-gray-400">VELOCIDAD</p>
                </div>
                <div className="text-center">
                  <p className="text-green-400 font-bold">{selectedCharacter.stats.resistencia}</p>
                  <p className="text-xs text-gray-400">RESISTENCIA</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Instrucciones */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-purple-500">
        <p className="text-white text-sm">
          🖱️ Arrastra para rotar • 🖱️ Click para seleccionar • ⌨️ Zoom con rueda
        </p>
      </div>
    </div>
  )
} 