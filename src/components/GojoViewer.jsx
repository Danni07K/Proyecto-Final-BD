'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Suspense, useRef, useMemo } from 'react'
import * as THREE from 'three'

function GojoModel() {
  const { scene } = useGLTF('/models/gojo.glb')
  return <primitive object={scene} scale={1.6} position={[0, -2.2, 0]} />
}

// Aura animada
function Aura() {
  const meshRef = useRef()
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.18 + Math.sin(state.clock.elapsedTime * 2) * 0.07
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.25
    }
  })
  return (
    <mesh ref={meshRef} position={[0, -2.2, 0]}>
      <sphereGeometry args={[2.1, 64, 64]} />
      <meshBasicMaterial color="#a78bfa" transparent opacity={0.18} side={THREE.DoubleSide} />
    </mesh>
  )
}

// Partículas flotantes
function FloatingParticles({ count = 24 }) {
  const group = useRef()
  const positions = useMemo(() =>
    Array.from({ length: count }, () => [
      (Math.random() - 0.5) * 4.5,
      Math.random() * 3.5 - 0.5,
      (Math.random() - 0.5) * 4.5
    ]), [count])
  useFrame((state) => {
    if (group.current) {
      group.current.children.forEach((mesh, i) => {
        mesh.position.y += Math.sin(state.clock.elapsedTime * 1.2 + i) * 0.003
        mesh.position.x += Math.cos(state.clock.elapsedTime * 0.7 + i) * 0.002
      })
    }
  })
  return (
    <group ref={group}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#c4b5fd' : '#a78bfa'} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  )
}

export default function GojoViewer() {
  return (
    <div className="w-full h-[500px] md:h-[700px] max-w-3xl mx-auto rounded-xl overflow-hidden border-2 border-purple-600 shadow-2xl bg-black">
      <Canvas camera={{ position: [0, 1.2, 7.2], fov: 32 }} shadows dpr={[1, 2]}>
        {/* Luces */}
        <ambientLight intensity={0.7} color="#a78bfa" />
        <directionalLight position={[6, 10, 6]} intensity={1.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} color="#fff" />
        {/* Rim light */}
        <directionalLight position={[-8, 6, -6]} intensity={0.7} color="#60a5fa" />
        {/* Piso */}
        <mesh receiveShadow position={[0, -3.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[16, 16]} />
          <shadowMaterial opacity={0.22} />
        </mesh>
        {/* Fondo 3D */}
        <Environment preset="night" />
        {/* Aura y partículas */}
        <Aura />
        <FloatingParticles />
        {/* Modelo de Gojo */}
        <Suspense fallback={<Html center><span className="text-white">Cargando modelo...</span></Html>}>
          <GojoModel />
        </Suspense>
        {/* Controles: solo rotación */}
        <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI/2.3} maxPolarAngle={Math.PI/1.7} />
      </Canvas>
    </div>
  )
}
