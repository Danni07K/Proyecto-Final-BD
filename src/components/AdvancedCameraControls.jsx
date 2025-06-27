'use client'
import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

export default function AdvancedCameraControls({ 
  target = [0, 0, 0], 
  distance = 8, 
  minDistance = 2, 
  maxDistance = 20,
  enableDamping = true,
  dampingFactor = 0.05,
  enableZoom = true,
  enableRotate = true,
  enablePan = false,
  autoRotate = false,
  autoRotateSpeed = 1,
  children 
}) {
  const controlsRef = useRef()
  const { camera } = useThree()

  // Configuración inicial de la cámara
  useEffect(() => {
    if (camera && controlsRef.current) {
      camera.position.set(0, 2, distance)
      controlsRef.current.target.set(...target)
      controlsRef.current.update()
    }
  }, [camera, target, distance])

  // Animación suave de la cámara
  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update()
    }
  })

  // Controles de teclado para movimiento
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!controlsRef.current) return

      const speed = 0.5
      const currentPosition = camera.position.clone()
      const currentTarget = controlsRef.current.target.clone()

      switch (event.key.toLowerCase()) {
        case 'w':
          // Mover hacia adelante
          const forward = new THREE.Vector3()
          camera.getWorldDirection(forward)
          forward.y = 0
          forward.normalize()
          camera.position.add(forward.multiplyScalar(speed))
          controlsRef.current.target.add(forward.multiplyScalar(speed))
          break
        case 's':
          // Mover hacia atrás
          const backward = new THREE.Vector3()
          camera.getWorldDirection(backward)
          backward.y = 0
          backward.normalize()
          camera.position.sub(backward.multiplyScalar(speed))
          controlsRef.current.target.sub(backward.multiplyScalar(speed))
          break
        case 'a':
          // Mover hacia la izquierda
          const left = new THREE.Vector3()
          camera.getWorldDirection(left)
          left.cross(camera.up).normalize()
          camera.position.sub(left.multiplyScalar(speed))
          controlsRef.current.target.sub(left.multiplyScalar(speed))
          break
        case 'd':
          // Mover hacia la derecha
          const right = new THREE.Vector3()
          camera.getWorldDirection(right)
          right.cross(camera.up).normalize()
          camera.position.add(right.multiplyScalar(speed))
          controlsRef.current.target.add(right.multiplyScalar(speed))
          break
        case 'q':
          // Rotar hacia la izquierda
          controlsRef.current.rotateLeft(0.1)
          break
        case 'e':
          // Rotar hacia la derecha
          controlsRef.current.rotateLeft(-0.1)
          break
        case 'r':
          // Resetear posición
          camera.position.set(0, 2, distance)
          controlsRef.current.target.set(...target)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [camera, target, distance])

  return (
    <OrbitControls
      ref={controlsRef}
      target={target}
      minDistance={minDistance}
      maxDistance={maxDistance}
      enableDamping={enableDamping}
      dampingFactor={dampingFactor}
      enableZoom={enableZoom}
      enableRotate={enableRotate}
      enablePan={enablePan}
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      maxPolarAngle={Math.PI / 1.5}
      minPolarAngle={0}
    />
  )
}

// Hook personalizado para efectos de cámara
export function useCameraEffects() {
  const { camera } = useThree()

  const shakeCamera = (intensity = 0.1, duration = 500) => {
    const originalPosition = camera.position.clone()
    const startTime = Date.now()

    const shake = () => {
      const elapsed = Date.now() - startTime
      const progress = elapsed / duration

      if (progress < 1) {
        const shakeX = (Math.random() - 0.5) * intensity * (1 - progress)
        const shakeY = (Math.random() - 0.5) * intensity * (1 - progress)
        const shakeZ = (Math.random() - 0.5) * intensity * (1 - progress)

        camera.position.set(
          originalPosition.x + shakeX,
          originalPosition.y + shakeY,
          originalPosition.z + shakeZ
        )

        requestAnimationFrame(shake)
      } else {
        camera.position.copy(originalPosition)
      }
    }

    shake()
  }

  const zoomToTarget = (target, duration = 1000) => {
    const startPosition = camera.position.clone()
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Función de easing suave
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)

      camera.position.lerpVectors(startPosition, target, easeOutCubic)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }

  return { shakeCamera, zoomToTarget }
} 