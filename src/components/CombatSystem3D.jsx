'use client'
import { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Html, Float, Text, PresentationControls } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import VisualEffects, { EnergyParticles, AuraEffect, DimensionalPortal } from './VisualEffects'

// Componente de personaje en combate
function CombatCharacter({ character, isPlayer, position, onAttack, health, maxHealth, energy, maxEnergy }) {
  const meshRef = useRef()
  const [isAttacking, setIsAttacking] = useState(false)
  const [isDefending, setIsDefending] = useState(false)
  const [attackAnimation, setAttackAnimation] = useState(0)
  const [particles, setParticles] = useState([])
  
  // Animación de combate
  useFrame((state) => {
    if (meshRef.current) {
      // Animación de respiración
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05
      
      // Animación de ataque
      if (isAttacking) {
        setAttackAnimation(prev => prev + 0.1)
        if (attackAnimation > 1) {
          setIsAttacking(false)
          setAttackAnimation(0)
        }
        
        // Efecto de ataque
        meshRef.current.rotation.y = Math.sin(attackAnimation * Math.PI * 2) * 0.3
        meshRef.current.scale.setScalar(1 + Math.sin(attackAnimation * Math.PI) * 0.2)
      }
      
      // Animación de defensa
      if (isDefending) {
        meshRef.current.scale.setScalar(1.1)
        meshRef.current.material.emissiveIntensity = 0.3
      } else {
        meshRef.current.scale.setScalar(1)
        meshRef.current.material.emissiveIntensity = 0.1
      }
    }
  })

  const handleAttack = () => {
    if (!isAttacking && energy >= 20) {
      setIsAttacking(true)
      onAttack(character, 'attack')
      
      // Generar partículas de ataque
      const newParticles = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        position: [position[0], position[1] + 1, position[2]],
        velocity: [
          (Math.random() - 0.5) * 2,
          Math.random() * 2,
          (Math.random() - 0.5) * 2
        ],
        life: 1.0
      }))
      setParticles(newParticles)
    }
  }

  const handleDefend = () => {
    setIsDefending(true)
    setTimeout(() => setIsDefending(false), 1000)
  }

  const handleSpecial = () => {
    if (energy >= 50) {
      onAttack(character, 'special')
    }
  }

  const getCharacterColor = () => {
    switch (character.id) {
      case 'gojo': return '#3b82f6'
      case 'yuji': return '#ef4444'
      case 'megumi': return '#1f2937'
      case 'nobara': return '#ec4899'
      default: return '#8b5cf6'
    }
  }

  return (
    <group ref={meshRef} position={position}>
      {/* Modelo 3D del personaje */}
      <mesh>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial 
          color={getCharacterColor()}
          metalness={0.8}
          roughness={0.2}
          emissive={getCharacterColor()}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Barra de vida */}
      <Html position={[0, 2.5, 0]} center>
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-red-500 min-w-[120px]">
          <div className="flex items-center gap-2">
            <div className="text-red-400 text-xs">❤️</div>
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(health / maxHealth) * 100}%` }}
              />
            </div>
            <div className="text-white text-xs">{health}/{maxHealth}</div>
          </div>
        </div>
      </Html>

      {/* Barra de energía */}
      <Html position={[0, 2.2, 0]} center>
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-blue-500 min-w-[120px]">
          <div className="flex items-center gap-2">
            <div className="text-blue-400 text-xs">⚡</div>
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(energy / maxEnergy) * 100}%` }}
              />
            </div>
            <div className="text-white text-xs">{energy}/{maxEnergy}</div>
          </div>
        </div>
      </Html>

      {/* Controles de combate (solo para el jugador) */}
      {isPlayer && (
        <Html position={[0, -2, 0]} center>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAttack}
              disabled={energy < 20}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-bold transition-all"
            >
              ⚔️ Atacar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDefend}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-bold transition-all"
            >
              🛡️ Defender
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSpecial}
              disabled={energy < 50}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-bold transition-all"
            >
              🌟 Especial
            </motion.button>
          </div>
        </Html>
      )}

      {/* Partículas de combate */}
      {particles.map((particle) => (
        <mesh key={particle.id} position={particle.position}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial 
            color={getCharacterColor()} 
            transparent 
            opacity={particle.life}
          />
        </mesh>
      ))}

      {/* Aura de combate */}
      <AuraEffect 
        position={[0, 0, 0]} 
        color={getCharacterColor()} 
        size={isDefending ? 3 : 2} 
      />
    </group>
  )
}

// Componente principal del sistema de combate
export default function CombatSystem3D({ player, opponent, onCombatEnd }) {
  const [playerHealth, setPlayerHealth] = useState(100)
  const [opponentHealth, setOpponentHealth] = useState(100)
  const [playerEnergy, setPlayerEnergy] = useState(100)
  const [opponentEnergy, setOpponentEnergy] = useState(100)
  const [combatLog, setCombatLog] = useState([])
  const [isCombatActive, setIsCombatActive] = useState(true)
  const [turn, setTurn] = useState('player')
  const [effects, setEffects] = useState([])

  const maxHealth = 100
  const maxEnergy = 100

  // IA del oponente
  useEffect(() => {
    if (turn === 'opponent' && isCombatActive) {
      const aiAction = setTimeout(() => {
        const actions = ['attack', 'defend', 'special']
        const randomAction = actions[Math.floor(Math.random() * actions.length)]
        handleCombatAction(opponent, randomAction, false)
        setTurn('player')
      }, 2000)

      return () => clearTimeout(aiAction)
    }
  }, [turn, isCombatActive])

  const handleCombatAction = (character, action, isPlayer) => {
    const target = isPlayer ? setOpponentHealth : setPlayerHealth
    const energySetter = isPlayer ? setPlayerEnergy : setOpponentEnergy
    const currentEnergy = isPlayer ? playerEnergy : opponentEnergy

    let damage = 0
    let energyCost = 0
    let message = ''

    switch (action) {
      case 'attack':
        if (currentEnergy >= 20) {
          damage = Math.floor(Math.random() * 20) + 10
          energyCost = 20
          message = `${character.name} ataca con energía maldita!`
        }
        break
      case 'defend':
        message = `${character.name} se defiende!`
        // Reducir daño del próximo ataque
        break
      case 'special':
        if (currentEnergy >= 50) {
          damage = Math.floor(Math.random() * 40) + 30
          energyCost = 50
          message = `${character.name} usa técnica especial!`
        }
        break
    }

    if (damage > 0) {
      target(prev => Math.max(0, prev - damage))
      energySetter(prev => Math.max(0, prev - energyCost))
      
      // Agregar efecto visual
      setEffects(prev => [...prev, {
        id: Date.now(),
        type: 'damage',
        position: isPlayer ? [3, 0, 0] : [-3, 0, 0],
        value: damage
      }])
    }

    // Agregar al log de combate
    setCombatLog(prev => [...prev, {
      id: Date.now(),
      message,
      damage,
      isPlayer
    }])

    // Verificar fin de combate
    const newHealth = isPlayer ? opponentHealth - damage : playerHealth - damage
    if (newHealth <= 0) {
      setIsCombatActive(false)
      onCombatEnd(isPlayer ? player : opponent)
    }
  }

  const regenerateEnergy = () => {
    setPlayerEnergy(prev => Math.min(maxEnergy, prev + 10))
    setOpponentEnergy(prev => Math.min(maxEnergy, prev + 10))
  }

  // Regeneración de energía cada 3 segundos
  useEffect(() => {
    const energyRegen = setInterval(regenerateEnergy, 3000)
    return () => clearInterval(energyRegen)
  }, [])

  return (
    <div className="w-full h-[800px] relative">
      {/* Canvas 3D */}
      <Canvas camera={{ position: [0, 3, 8], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#8b5cf6" />
        <pointLight position={[5, -5, 5]} intensity={0.3} color="#fbbf24" />
        
        <Environment preset="night" />
        
        {/* Arena de combate */}
        <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            metalness={0.1} 
            roughness={0.8}
          />
        </mesh>

        {/* Personajes */}
        <CombatCharacter
          character={player}
          isPlayer={true}
          position={[-3, 0, 0]}
          onAttack={(char, action) => handleCombatAction(char, action, true)}
          health={playerHealth}
          maxHealth={maxHealth}
          energy={playerEnergy}
          maxEnergy={maxEnergy}
        />

        <CombatCharacter
          character={opponent}
          isPlayer={false}
          position={[3, 0, 0]}
          onAttack={(char, action) => handleCombatAction(char, action, false)}
          health={opponentHealth}
          maxHealth={maxHealth}
          energy={opponentEnergy}
          maxEnergy={maxEnergy}
        />

        {/* Efectos visuales */}
        <VisualEffects enableParticles={true} enableWaves={true} />
        
        {/* Efectos de daño */}
        {effects.map((effect) => (
          <Html key={effect.id} position={effect.position} center>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="text-red-500 font-bold text-2xl"
            >
              -{effect.value}
            </motion.div>
          </Html>
        ))}

        <OrbitControls enablePan={false} />
      </Canvas>

      {/* Panel de combate */}
      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-purple-600 max-w-md">
        <h3 className="text-xl font-bold text-purple-400 mb-4">⚔️ Combate</h3>
        
        {/* Turno actual */}
        <div className="mb-4">
          <div className={`text-lg font-bold ${turn === 'player' ? 'text-green-400' : 'text-red-400'}`}>
            {turn === 'player' ? '🎯 Tu turno' : '🤖 Turno del oponente'}
          </div>
        </div>

        {/* Log de combate */}
        <div className="max-h-32 overflow-y-auto space-y-1">
          {combatLog.slice(-5).map((log) => (
            <div key={log.id} className={`text-sm ${log.isPlayer ? 'text-green-300' : 'text-red-300'}`}>
              {log.message}
              {log.damage > 0 && <span className="text-yellow-400"> (-{log.damage})</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Resultado del combate */}
      <AnimatePresence>
        {!isCombatActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80"
          >
            <div className="bg-purple-900/90 backdrop-blur-sm rounded-xl p-8 border border-purple-500 text-center">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4">
                {playerHealth > 0 ? '🏆 ¡Victoria!' : '💀 Derrota'}
              </h2>
              <p className="text-white mb-6">
                {playerHealth > 0 
                  ? `${player.name} ha derrotado a ${opponent.name}!`
                  : `${opponent.name} ha derrotado a ${player.name}!`
                }
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCombatEnd(null)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold transition-all"
              >
                Volver
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 