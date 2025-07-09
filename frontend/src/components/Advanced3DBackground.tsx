import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Улучшенная система частиц с плавными переходами
const SmoothParticleField = ({ count = 600 }) => {
  const mesh = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 12;
      positions[i3 + 1] = (Math.random() - 0.5) * 12;
      positions[i3 + 2] = (Math.random() - 0.5) * 12;
      
      // Более мягкие зеленые оттенки
      const intensity = Math.random() * 0.5 + 0.5;
      colors[i3] = intensity * 0.15; // R
      colors[i3 + 1] = intensity * 0.85; // G
      colors[i3 + 2] = intensity * 0.45; // B
    }
    
    return [positions, colors];
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.0001;
      mesh.current.rotation.y += 0.00005;
      
      // Плавное дыхание
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      mesh.current.scale.setScalar(scale);
    }
  });

  return (
    <Points ref={mesh} positions={positions} colors={colors}>
      <PointMaterial
        transparent
        size={0.008}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
    </Points>
  );
};

// Плавные волновые элементы
const SmoothWaveElements = () => {
  const waveRef1 = useRef<THREE.Mesh>(null);
  const waveRef2 = useRef<THREE.Mesh>(null);
  const waveRef3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (waveRef1.current) {
      waveRef1.current.position.y = Math.sin(time * 0.3) * 0.5;
      waveRef1.current.rotation.z = time * 0.1;
    }
    
    if (waveRef2.current) {
      waveRef2.current.position.y = Math.sin(time * 0.4 + Math.PI / 3) * 0.3;
      waveRef2.current.rotation.z = -time * 0.08;
    }
    
    if (waveRef3.current) {
      waveRef3.current.position.y = Math.sin(time * 0.25 + Math.PI / 2) * 0.4;
      waveRef3.current.rotation.z = time * 0.06;
    }
  });

  const waveMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.1, 0.9, 0.5),
    transparent: true,
    opacity: 0.03,
    wireframe: true,
    blending: THREE.AdditiveBlending
  });

  return (
    <>
      <mesh ref={waveRef1} position={[-3, 0, -2]} scale={2}>
        <torusGeometry args={[2, 0.1, 8, 24]} />
        <primitive object={waveMaterial} />
      </mesh>
      
      <mesh ref={waveRef2} position={[3, 1, -1]} scale={1.5}>
        <torusGeometry args={[1.5, 0.08, 6, 20]} />
        <primitive object={waveMaterial} />
      </mesh>
      
      <mesh ref={waveRef3} position={[0, -2, -3]} scale={2.5}>
        <torusGeometry args={[1, 0.05, 4, 16]} />
        <primitive object={waveMaterial} />
      </mesh>
    </>
  );
};

// Улучшенная сцена
const EnhancedScene = () => {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.1} />
      <SmoothParticleField count={600} />
      <SmoothWaveElements />
    </>
  );
};

// Главный компонент с плавным градиентом
const Advanced3DBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      {/* Статичный градиентный фон */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(2, 191, 122, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(26, 140, 92, 0.10) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(14, 165, 233, 0.08) 0%, transparent 50%),
            linear-gradient(135deg, #e6fff5 0%, #f0fff8 25%, #e6fff5 50%, #ccffdd 75%, #e6fff5 100%)
          `
        }}
      />
      
      {/* 3D Canvas поверх градиента */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
        performance={{ min: 0.5 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <EnhancedScene />
      </Canvas>
    </div>
  );
};

export default Advanced3DBackground;