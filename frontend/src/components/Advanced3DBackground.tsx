import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Облегченная система частиц
const SimpleParticleField = ({ count = 800 }) => {
  const mesh = useRef<THREE.Points>(null);

  // Генерируем позиции частиц один раз
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 15;
      positions[i3 + 1] = (Math.random() - 0.5) * 15;
      positions[i3 + 2] = (Math.random() - 0.5) * 15;
      
      // Зеленые оттенки
      colors[i3] = Math.random() * 0.3 + 0.2; // R
      colors[i3 + 1] = Math.random() * 0.3 + 0.7; // G
      colors[i3 + 2] = Math.random() * 0.2 + 0.3; // B
    }
    
    return [positions, colors];
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      // Простая медленная ротация
      mesh.current.rotation.x += 0.0002;
      mesh.current.rotation.y += 0.0001;
    }
  });

  return (
    <Points ref={mesh} positions={positions} colors={colors}>
      <PointMaterial
        transparent
        size={0.01}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

// Простые плавающие элементы
const FloatingElements = () => {
  const elements = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      ] as [number, number, number],
      scale: Math.random() * 0.3 + 0.1,
    }));
  }, []);

  return (
    <>
      {elements.map((element) => (
        <mesh
          key={element.id}
          position={element.position}
          scale={element.scale}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color={new THREE.Color(0.1, 0.8, 0.4)}
            transparent
            opacity={0.05}
            wireframe
          />
        </mesh>
      ))}
    </>
  );
};

// Облегченная 3D сцена
const OptimizedScene = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <SimpleParticleField count={800} />
      <FloatingElements />
    </>
  );
};

// Главный компонент с оптимизацией производительности
const Advanced3DBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'linear-gradient(135deg, #e6fff5 0%, #ccffdd 100%)' }}
        performance={{ min: 0.5 }} // Автоматическое снижение качества при низкой производительности
        dpr={[1, 1.5]} // Ограничиваем разрешение для производительности
      >
        <OptimizedScene />
      </Canvas>
    </div>
  );
};

export default Advanced3DBackground;