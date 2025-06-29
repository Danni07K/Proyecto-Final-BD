'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as BABYLON from '@babylonjs/core'
import '@babylonjs/loaders'

const CharacterSelector3D = ({ onCharacterSelect }) => {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const characterRef = useRef(null)
  const [selectedCharacter, setSelectedCharacter] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const characters = [
    {
      name: 'Yuji Itadori',
      rarity: 'legendary',
      model: '/models/personajes/yuji_itadori.glb',
      description: 'Estudiante de Jujutsu con increíble fuerza física y resistencia.',
      abilities: ['Divergent Fist', 'Black Flash', 'Sukuna\'s Techniques'],
      color: 'from-red-500 to-orange-600'
    },
    {
      name: 'Satoru Gojo',
      rarity: 'mythic',
      model: '/models/personajes/satoru_gojo.glb',
      description: 'El hechicero más fuerte, maestro de las técnicas del Infinito.',
      abilities: ['Infinity', 'Blue', 'Red', 'Purple'],
      color: 'from-blue-400 to-purple-600'
    },
    {
      name: 'Megumi Fushiguro',
      rarity: 'epic',
      model: '/models/personajes/megumi_fushiguro.glb',
      description: 'Usuario de las Técnicas de las Sombras y Ten Shadows Technique.',
      abilities: ['Ten Shadows Technique', 'Domain Expansion', 'Shadow Manipulation'],
      color: 'from-gray-600 to-black'
    },
    {
      name: 'Nobara Kugisaki',
      rarity: 'rare',
      model: '/models/personajes/nobara_kugisaki.glb',
      description: 'Especialista en técnicas de maldición usando martillos y clavos.',
      abilities: ['Straw Doll Technique', 'Resonance', 'Hairpin'],
      color: 'from-pink-400 to-red-500'
    },
    {
      name: 'Yuta Okkotsu',
      rarity: 'legendary',
      model: '/models/personajes/yuta_okkotsu.glb',
      description: 'Usuario de Copy Technique y Rika, el espíritu maldito.',
      abilities: ['Copy Technique', 'Rika', 'Reverse Cursed Technique'],
      color: 'from-green-400 to-blue-500'
    },
    {
      name: 'Suguru Geto',
      rarity: 'mythic',
      model: '/models/personajes/suguru_geto.glb',
      description: 'Maestro de las técnicas de maldición y control de espíritus.',
      abilities: ['Cursed Spirit Manipulation', 'Uzumaki', 'Maximum: Uzumaki'],
      color: 'from-purple-600 to-black'
    }
  ]

  const rarityEffects = {
    common: { glow: '#ffffff', particles: 10, intensity: 0.5 },
    rare: { glow: '#3b82f6', particles: 20, intensity: 0.8 },
    epic: { glow: '#8b5cf6', particles: 30, intensity: 1.2 },
    legendary: { glow: '#f59e0b', particles: 40, intensity: 1.5 },
    mythic: { glow: '#ef4444', particles: 50, intensity: 2.0 }
  }

  useEffect(() => {
    if (!canvasRef.current) return

    // Initialize Babylon.js
    engineRef.current = new BABYLON.Engine(canvasRef.current, true)
    sceneRef.current = new BABYLON.Scene(engineRef.current)

    // Create camera
    cameraRef.current = new BABYLON.ArcRotateCamera(
      'camera',
      0,
      Math.PI / 3,
      5,
      BABYLON.Vector3.Zero(),
      sceneRef.current
    )
    cameraRef.current.attachControl(canvasRef.current, true)
    cameraRef.current.lowerRadiusLimit = 3
    cameraRef.current.upperRadiusLimit = 8
    cameraRef.current.wheelDeltaPercentage = 0.01

    // Create lighting
    const light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(0, 1, 0),
      sceneRef.current
    )
    light.intensity = 0.7

    const pointLight = new BABYLON.PointLight(
      'pointLight',
      new BABYLON.Vector3(0, 2, 0),
      sceneRef.current
    )
    pointLight.intensity = 0.5

    // Create animated background
    createAnimatedBackground()

    // Load initial character
    loadCharacter(selectedCharacter)

    // Start render loop
    engineRef.current.runRenderLoop(() => {
      sceneRef.current.render()
    })

    // Handle window resize
    const handleResize = () => {
      engineRef.current?.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      engineRef.current?.dispose()
    }
  }, [])

  const createAnimatedBackground = () => {
    // Create particle system for background without external texture
    const particleSystem = new BABYLON.ParticleSystem('particles', 2000, sceneRef.current)
    
    // Use default particle texture instead of external file
    particleSystem.particleTexture = null // Let Babylon.js use default
    
    particleSystem.emitter = new BABYLON.Vector3(0, 0, 0)
    particleSystem.minEmitBox = new BABYLON.Vector3(-10, -10, -10)
    particleSystem.maxEmitBox = new BABYLON.Vector3(10, 10, 10)

    particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0)
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0)
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0)

    particleSystem.minSize = 0.1
    particleSystem.maxSize = 0.5

    particleSystem.minLifeTime = 0.3
    particleSystem.maxLifeTime = 1.5

    particleSystem.emitRate = 500

    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE

    particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0)

    particleSystem.direction1 = new BABYLON.Vector3(-2, -8, -2)
    particleSystem.direction2 = new BABYLON.Vector3(2, -8, 2)

    particleSystem.minAngularSpeed = 0
    particleSystem.maxAngularSpeed = Math.PI

    particleSystem.minEmitPower = 1
    particleSystem.maxEmitPower = 3
    particleSystem.updateSpeed = 0.005

    particleSystem.start()
  }

  const loadCharacter = async (index) => {
    if (!sceneRef.current) return

    setIsLoading(true)

    // Remove previous character
    if (characterRef.current) {
      characterRef.current.dispose()
    }

    const character = characters[index]

    try {
      // Load GLB model
      const result = await BABYLON.SceneLoader.ImportMeshAsync(
        '',
        '',
        character.model,
        sceneRef.current
      )

      characterRef.current = result.meshes[0]

      // Scale and position character
      characterRef.current.scaling = new BABYLON.Vector3(1, 1, 1)
      characterRef.current.position = new BABYLON.Vector3(0, 0, 0)

      // Add rarity effects
      addRarityEffects(character.rarity)

      // Auto-rotate character
      sceneRef.current.registerBeforeRender(() => {
        if (characterRef.current) {
          characterRef.current.rotate(BABYLON.Vector3.Up(), 0.01)
        }
      })

      setIsLoading(false)
    } catch (error) {
      console.error('Error loading character:', error)
      
      // Create a fallback sphere if model fails to load
      const sphere = BABYLON.MeshBuilder.CreateSphere('fallback', { diameter: 1 }, sceneRef.current)
      const material = new BABYLON.StandardMaterial('fallbackMaterial', sceneRef.current)
      
      // Set material color based on character rarity
      const rarityColors = {
        common: new BABYLON.Color3(0.8, 0.8, 0.8),
        rare: new BABYLON.Color3(0.2, 0.5, 1.0),
        epic: new BABYLON.Color3(0.5, 0.2, 1.0),
        legendary: new BABYLON.Color3(1.0, 0.6, 0.0),
        mythic: new BABYLON.Color3(1.0, 0.2, 0.2)
      }
      
      material.diffuseColor = rarityColors[character.rarity] || rarityColors.common
      material.emissiveColor = rarityColors[character.rarity] || rarityColors.common
      material.emissiveIntensity = 0.3
      
      sphere.material = material
      characterRef.current = sphere
      
      // Add rarity effects
      addRarityEffects(character.rarity)
      
      // Auto-rotate character
      sceneRef.current.registerBeforeRender(() => {
        if (characterRef.current) {
          characterRef.current.rotate(BABYLON.Vector3.Up(), 0.01)
        }
      })
      
      setIsLoading(false)
    }
  }

  const addRarityEffects = (rarity) => {
    if (!characterRef.current || !rarityEffects[rarity]) return

    const effects = rarityEffects[rarity]

    // Add glow effect
    const glowLayer = new BABYLON.GlowLayer('glow', sceneRef.current)
    glowLayer.intensity = effects.intensity

    // Add particle effects around character without external texture
    const characterParticles = new BABYLON.ParticleSystem('characterParticles', effects.particles, sceneRef.current)
    
    // Use default particle texture
    characterParticles.particleTexture = null
    
    characterParticles.emitter = characterRef.current
    characterParticles.minEmitBox = new BABYLON.Vector3(-0.5, -0.5, -0.5)
    characterParticles.maxEmitBox = new BABYLON.Vector3(0.5, 0.5, 0.5)

    characterParticles.color1 = new BABYLON.Color4(1, 1, 1, 1)
    characterParticles.color2 = new BABYLON.Color4(1, 1, 1, 0.8)
    characterParticles.colorDead = new BABYLON.Color4(0, 0, 0, 0)

    characterParticles.minSize = 0.1
    characterParticles.maxSize = 0.3

    characterParticles.minLifeTime = 1.0
    characterParticles.maxLifeTime = 2.0

    characterParticles.emitRate = effects.particles

    characterParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE

    characterParticles.start()
  }

  const handleCharacterChange = (index) => {
    setSelectedCharacter(index)
    loadCharacter(index)
  }

  const handleSelectCharacter = () => {
    onCharacterSelect?.(characters[selectedCharacter])
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        <div className="particles-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex">
        {/* Left Panel - Character List */}
        <div className="w-80 bg-black/20 backdrop-blur-md border-r border-white/10 p-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Seleccionar Personaje
          </h2>
          
          <div className="space-y-3">
            {characters.map((character, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCharacterChange(index)}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedCharacter === index
                    ? 'bg-gradient-to-r from-purple-600/50 to-blue-600/50 border-2 border-white/30'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${character.color}`} />
                  <div>
                    <h3 className="text-white font-semibold">{character.name}</h3>
                    <p className="text-gray-300 text-sm capitalize">{character.rarity}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Center Panel - 3D Character Viewer */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ background: 'transparent' }}
          />
          
          {/* Loading Overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white text-lg">Cargando personaje...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Camera Controls Info */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md rounded-lg p-3 text-white text-sm">
            <p>🖱️ Arrastra para rotar</p>
            <p>🔍 Rueda para zoom</p>
          </div>
        </div>

        {/* Right Panel - Character Details */}
        <div className="w-96 bg-black/20 backdrop-blur-md border-l border-white/10 p-6">
          <div className="h-full flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Detalles del Personaje
            </h2>
            
            <div className="flex-1">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {characters[selectedCharacter].name}
                </h3>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${characters[selectedCharacter].color} text-white mb-3`}>
                  {characters[selectedCharacter].rarity.toUpperCase()}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {characters[selectedCharacter].description}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Habilidades</h4>
                <div className="space-y-2">
                  {characters[selectedCharacter].abilities.map((ability, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full" />
                      <span className="text-gray-300 text-sm">{ability}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Select Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSelectCharacter}
              className={`w-full py-4 rounded-lg font-bold text-white text-lg bg-gradient-to-r ${characters[selectedCharacter].color} hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300`}
            >
              Seleccionar Personaje
            </motion.button>
          </div>
        </div>
      </div>

      {/* CSS for animated particles */}
      <style jsx>{`
        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: float linear infinite;
        }
        
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default CharacterSelector3D