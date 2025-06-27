'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particula({ position, scale = 1 }) {
  const ref = useRef()
  useFrame(() => {
    ref.current.rotation.x += 0.003
    ref.current.rotation.y += 0.004
  })

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial
        color="#aa00ff"
        emissive="#aa00ff"
        emissiveIntensity={1.5}
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

export default function EnergiaMaldita() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={['#0a0010']} />
        <fog attach="fog" args={['#0a0010', 5, 15]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 3, 5]} intensity={1.5} color="#ff00ff" />

        {/* Varias partículas flotando */}
        {[
          [0, 0, 0],
          [2, 1, -1],
          [-2, -1, 1],
          [1.5, -1.5, 1],
          [-1.5, 1.5, -1],
          [0.5, -2, 2],
        ].map((pos, idx) => (
          <Particula key={idx} position={pos} scale={Math.random() * 1.2 + 0.8} />
        ))}

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />

      </Canvas>
    </div>
  )
}
