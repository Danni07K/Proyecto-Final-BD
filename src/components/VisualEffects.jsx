'use client'
import { useRef, useFrame, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Efecto de partículas de energía
export function EnergyParticles({ count = 100, color = '#8b5cf6' }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.05
    }
  })

  const particles = []
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 20
    const y = (Math.random() - 0.5) * 20
    const z = (Math.random() - 0.5) * 20
    particles.push(x, y, z)
  }

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={new Float32Array(particles)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Efecto de ondas de energía
export function EnergyWaves({ color = '#8b5cf6', speed = 1 }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current && meshRef.current.material.uniforms) {
      meshRef.current.material.uniforms.time.value = state.clock.elapsedTime * speed
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[20, 20, 32, 32]} />
      <shaderMaterial
        transparent
        uniforms={{
          time: { value: 0 },
          color: { value: new THREE.Color(color) }
        }}
        vertexShader={`
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            float elevation = sin(pos.x * 2.0 + time) * sin(pos.z * 2.0 + time) * 0.1;
            pos.y += elevation;
            vElevation = elevation;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 color;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            float intensity = 0.5 + vElevation * 2.0;
            gl_FragColor = vec4(color, intensity * 0.3);
          }
        `}
      />
    </mesh>
  )
}

// Efecto de aura alrededor de objetos
export function AuraEffect({ position = [0, 0, 0], color = '#8b5cf6', size = 2 }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      meshRef.current.material.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.2}
        wireframe
      />
    </mesh>
  )
}

// Efecto de rayo de energía
export function EnergyBeam({ start = [0, 0, 0], end = [0, 5, 0], color = '#8b5cf6' }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current && meshRef.current.material.uniforms) {
      meshRef.current.material.uniforms.time.value = state.clock.elapsedTime
    }
  })

  const direction = new THREE.Vector3().subVectors(
    new THREE.Vector3(...end),
    new THREE.Vector3(...start)
  )
  const length = direction.length()
  const center = new THREE.Vector3().addVectors(
    new THREE.Vector3(...start),
    direction.clone().multiplyScalar(0.5)
  )

  return (
    <mesh ref={meshRef} position={center}>
      <cylinderGeometry args={[0.1, 0.1, length, 8]} />
      <shaderMaterial
        transparent
        uniforms={{
          time: { value: 0 },
          color: { value: new THREE.Color(color) }
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          uniform vec3 color;
          varying vec2 vUv;
          
          void main() {
            float intensity = sin(vUv.y * 10.0 + time * 5.0) * 0.5 + 0.5;
            gl_FragColor = vec4(color, intensity * 0.8);
          }
        `}
      />
    </mesh>
  )
}

// Efecto de explosión de energía
export function EnergyExplosion({ position = [0, 0, 0], color = '#8b5cf6', duration = 1000 }) {
  const meshRef = useRef()
  const startTime = useRef(Date.now())

  useFrame(() => {
    if (meshRef.current) {
      const elapsed = Date.now() - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      
      if (progress < 1) {
        const scale = 1 + progress * 3
        meshRef.current.scale.setScalar(scale)
        meshRef.current.material.opacity = 1 - progress
      }
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={1}
        wireframe
      />
    </mesh>
  )
}

// Efecto de portal dimensional
export function DimensionalPortal({ position = [0, 0, 0], size = 3 }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.3
      if (meshRef.current.material.uniforms) {
        meshRef.current.material.uniforms.time.value = state.clock.elapsedTime
      }
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <ringGeometry args={[size * 0.5, size, 32]} />
      <shaderMaterial
        transparent
        uniforms={{
          time: { value: 0 }
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          varying vec2 vUv;
          
          void main() {
            float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
            float radius = length(vUv - 0.5);
            float intensity = sin(angle * 8.0 + time * 2.0) * 0.5 + 0.5;
            intensity *= 1.0 - radius;
            gl_FragColor = vec4(0.5, 0.2, 1.0, intensity * 0.8);
          }
        `}
      />
    </mesh>
  )
}

// Efecto de niebla atmosférica
export function AtmosphericFog({ density = 0.02, color = '#1a1a2e' }) {
  const { scene } = useThree()

  useEffect(() => {
    scene.fog = new THREE.Fog(color, 1, 50)
    scene.fog.density = density

    return () => {
      scene.fog = null
    }
  }, [scene, density, color])

  return null
}

// Efecto de post-procesamiento
export function PostProcessingEffects() {
  const { gl } = useThree()

  useEffect(() => {
    // Configurar efectos de post-procesamiento
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.2
    gl.outputColorSpace = THREE.SRGBColorSpace
  }, [gl])

  return null
}

// Componente principal de efectos visuales
export default function VisualEffects({ 
  enableParticles = true,
  enableWaves = true,
  enableFog = true,
  enablePostProcessing = true
}) {
  return (
    <>
      {enableParticles && <EnergyParticles count={50} />}
      {enableWaves && <EnergyWaves />}
      {enableFog && <AtmosphericFog />}
      {enablePostProcessing && <PostProcessingEffects />}
    </>
  )
} 