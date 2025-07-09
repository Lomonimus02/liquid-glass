import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, Float, Text3D, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Particle system with advanced 3D effects
const ParticleField = ({ count = 2000 }) => {
  const mesh = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Generate particle positions
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Create a more organic distribution
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
      
      // Green-based colors with variations
      colors[i3] = Math.random() * 0.5 + 0.5; // R
      colors[i3 + 1] = Math.random() * 0.3 + 0.7; // G
      colors[i3 + 2] = Math.random() * 0.4 + 0.3; // B
    }
    
    return [positions, colors];
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.0005;
      mesh.current.rotation.y += 0.0003;
      
      // Interactive movement based on mouse
      const time = state.clock.getElapsedTime();
      const positions = mesh.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];
        
        // Create wave-like movement
        positions[i3 + 1] = y + Math.sin(time * 0.5 + x * 0.1) * 0.01;
        positions[i3] = x + Math.cos(time * 0.3 + y * 0.1) * 0.005;
        positions[i3 + 2] = z + Math.sin(time * 0.4 + x * 0.05) * 0.008;
      }
      
      mesh.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={mesh} positions={positions} colors={colors}>
      <PointMaterial
        transparent
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

// Floating geometric shapes
const FloatingGeometry = () => {
  const shapes = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
      scale: Math.random() * 0.5 + 0.2,
      type: Math.floor(Math.random() * 4) // 0: box, 1: sphere, 2: octahedron, 3: tetrahedron
    }));
  }, []);

  return (
    <>
      {shapes.map((shape) => (
        <Float
          key={shape.id}
          speed={0.5 + Math.random() * 0.5}
          rotationIntensity={0.3 + Math.random() * 0.2}
          floatIntensity={0.2 + Math.random() * 0.3}
        >
          <mesh
            position={shape.position}
            rotation={shape.rotation}
            scale={shape.scale}
          >
            {shape.type === 0 && <boxGeometry args={[1, 1, 1]} />}
            {shape.type === 1 && <sphereGeometry args={[1, 16, 16]} />}
            {shape.type === 2 && <octahedronGeometry args={[1, 0]} />}
            {shape.type === 3 && <tetrahedronGeometry args={[1, 0]} />}
            <meshStandardMaterial
              color={new THREE.Color(0.1, 0.8, 0.4)}
              transparent
              opacity={0.1}
              wireframe
            />
          </mesh>
        </Float>
      ))}
    </>
  );
};

// Energy orbs with glowing effects
const EnergyOrbs = () => {
  const orbs = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 18
      ] as [number, number, number],
      scale: Math.random() * 0.8 + 0.3,
      color: new THREE.Color().setHSL(0.3 + Math.random() * 0.1, 0.8, 0.6)
    }));
  }, []);

  return (
    <>
      {orbs.map((orb) => (
        <Float
          key={orb.id}
          speed={0.3 + Math.random() * 0.4}
          rotationIntensity={0.1}
          floatIntensity={0.4 + Math.random() * 0.3}
        >
          <mesh position={orb.position} scale={orb.scale}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial
              color={orb.color}
              transparent
              opacity={0.3}
              emissive={orb.color}
              emissiveIntensity={0.2}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
};

// Neural network connections
const NeuralConnections = () => {
  const connections = useMemo(() => {
    const points = Array.from({ length: 20 }, () => ({
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12
      ] as [number, number, number]
    }));
    
    const lines = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const distance = Math.sqrt(
          Math.pow(points[i].position[0] - points[j].position[0], 2) +
          Math.pow(points[i].position[1] - points[j].position[1], 2) +
          Math.pow(points[i].position[2] - points[j].position[2], 2)
        );
        
        if (distance < 5) {
          lines.push({
            start: points[i].position,
            end: points[j].position,
            opacity: 1 - (distance / 5)
          });
        }
      }
    }
    
    return { points, lines };
  }, []);

  return (
    <>
      {connections.points.map((point, i) => (
        <mesh key={i} position={point.position}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color={new THREE.Color(0.2, 0.9, 0.5)}
            emissive={new THREE.Color(0.1, 0.4, 0.2)}
          />
        </mesh>
      ))}
      {connections.lines.map((line, i) => {
        const start = new THREE.Vector3(...line.start);
        const end = new THREE.Vector3(...line.end);
        const direction = end.clone().sub(start);
        const length = direction.length();
        
        return (
          <mesh key={i} position={start.clone().add(direction.clone().multiplyScalar(0.5))}>
            <boxGeometry args={[0.01, 0.01, length]} />
            <meshStandardMaterial
              color={new THREE.Color(0.3, 1, 0.6)}
              transparent
              opacity={line.opacity * 0.3}
              emissive={new THREE.Color(0.1, 0.3, 0.2)}
            />
          </mesh>
        );
      })}
    </>
  );
};

// Main 3D Scene Component
const Scene3D = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color={new THREE.Color(0.2, 0.8, 0.4)} />
      
      <ParticleField count={2000} />
      <FloatingGeometry />
      <EnergyOrbs />
      <NeuralConnections />
    </>
  );
};

// Main Advanced3DBackground component
const Advanced3DBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: 'linear-gradient(135deg, #e6fff5 0%, #ccffdd 100%)' }}
      >
        <Scene3D />
      </Canvas>
    </div>
  );
};

export default Advanced3DBackground;