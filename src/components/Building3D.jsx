import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, MeshDistortMaterial, Float, Text, MeshWobbleMaterial } from '@react-three/drei'
import * as THREE from 'three'

function Tower({ position, height, color, name, block }) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t + position[0]) * 0.1
    }
  })

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.05 : 1}
        >
          <boxGeometry args={[1, height, 1]} />
          <meshStandardMaterial 
            color={hovered ? '#22d3ee' : color} 
            transparent 
            opacity={0.8}
            metalness={0.8}
            roughness={0.2}
          />
          {/* Neon wireframe */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1, height, 1)]} />
            <lineBasicMaterial color={hovered ? '#fff' : '#22d3ee'} opacity={0.5} />
          </lineSegments>
        </mesh>
      </Float>
      
      {/* Label */}
      {hovered && (
        <Text
          position={[0, height / 2 + 0.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      )}
    </group>
  )
}

export default function Building3D() {
  const towers = [
    // Block A (A1, A2, A3, A4)
    { pos: [-3, 2, -2], h: 4, color: '#0ea5e9', name: 'A1', block: 'A' },
    { pos: [-1.5, 2.5, -2.5], h: 5, color: '#0ea5e9', name: 'A2', block: 'A' },
    { pos: [0, 2, -3], h: 4, color: '#0ea5e9', name: 'A3', block: 'A' },
    { pos: [1.5, 2.5, -2.5], h: 5, color: '#0ea5e9', name: 'A4', block: 'A' },
    
    // Block B (B1, B2, B3)
    { pos: [-2, 3, 1], h: 6, color: '#8b5cf6', name: 'B1', block: 'B' },
    { pos: [0, 3.5, 1.5], h: 7, color: '#8b5cf6', name: 'B2', block: 'B' },
    { pos: [2, 3, 1], h: 6, color: '#8b5cf6', name: 'B3', block: 'B' },
    
    // Block C (C1, C2, C3, C4)
    { pos: [3, 2, -1], h: 4, color: '#f43f5e', name: 'C1', block: 'C' },
    { pos: [4.5, 2.5, -0.5], h: 5, color: '#f43f5e', name: 'C2', block: 'C' },
    { pos: [3, 2.5, 1.5], h: 5, color: '#f43f5e', name: 'C3', block: 'C' },
    { pos: [4.5, 2, 2.5], h: 4, color: '#f43f5e', name: 'C4', block: 'C' },
  ]

  return (
    <div className="w-full h-[500px] md:h-full min-h-[400px]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[10, 8, 15]} fov={35} />
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 4}
        />
        
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Ground glow */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#0a0a20" opacity={0.5} transparent />
        </mesh>
        
        <gridHelper args={[20, 20, '#1e293b', '#0f172a']} position={[0, 0, 0]} />

        {/* Towers */}
        {towers.map((tower, idx) => (
          <Tower 
            key={idx} 
            position={tower.pos} 
            height={tower.h} 
            color={tower.color} 
            name={tower.name}
            block={tower.block}
          />
        ))}
        
        {/* Environment Decor */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  )
}

function Stars({ radius, depth, count, factor, saturation, fade, speed }) {
  const ref = useRef()
  const positions = React.useMemo(() => {
    const array = new Float32Array(count * 3)
    for (let i = 0; i < array.length; i++) {
        // eslint-disable-next-line react-hooks/purity
        array[i] = (Math.random() - 0.5) * radius * 2
    }
    return array
  }, [count, radius])

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed
    if (ref.current) {
      ref.current.rotation.y = t * 0.05
      ref.current.rotation.x = t * 0.02
    }
  })
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.1} color="white" transparent opacity={0.6} sizeAttenuation={true} />
      </points>
    </group>
  )
}
