import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
  z: number; // Added Z coordinate for 3D effect
  vx: number;
  vy: number;
  vz: number; // Added Z velocity
  opacity: number;
  size: number;
  depth: number; // Depth for 3D perspective
}

interface GeometricShape {
  id: number;
  points: Point[];
  center: { x: number; y: number; z: number }; // Added Z coordinate
  lifetime: number;
  maxLifetime: number;
  isDissolving: boolean;
  dissolveProgress: number;
  rotationSpeed: number;
  rotation: number;
  rotationX: number; // Added X rotation
  rotationY: number; // Added Y rotation
  rotationZ: number; // Added Z rotation
}

interface GeometricBackgroundProps {
  shapeCount?: number;
  minPoints?: number;
  maxPoints?: number;
  animationSpeed?: number;
  shapeLifetime?: number;
  dissolveSpeed?: number;
}

const GeometricBackground: React.FC<GeometricBackgroundProps> = ({
  shapeCount = 8,
  minPoints = 3,
  maxPoints = 5,
  animationSpeed = 0.3,
  shapeLifetime = 8000, // 8 seconds
  dissolveSpeed = 0.02
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const shapesRef = useRef<GeometricShape[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  // Create a single geometric shape with 3D properties
  const createGeometricShape = useCallback((id: number): GeometricShape => {
    const pointCount = Math.floor(Math.random() * (maxPoints - minPoints + 1)) + minPoints;
    const centerX = Math.random() * dimensions.width;
    const centerY = Math.random() * dimensions.height;
    const centerZ = Math.random() * 200 - 100; // Z depth between -100 and 100
    const radius = Math.random() * 80 + 40; // Size between 40-120px
    
    const points: Point[] = [];
    
    // Create points in a 3D geometric pattern
    for (let i = 0; i < pointCount; i++) {
      const angle = (i / pointCount) * Math.PI * 2;
      const variance = (Math.random() - 0.5) * 0.3; // Add some randomness
      const actualRadius = radius + variance * radius;
      
      // Create 3D coordinates
      const x = centerX + Math.cos(angle) * actualRadius;
      const y = centerY + Math.sin(angle) * actualRadius;
      const z = centerZ + (Math.random() - 0.5) * 60; // Z variation
      
      points.push({
        x,
        y,
        z,
        vx: (Math.random() - 0.5) * animationSpeed,
        vy: (Math.random() - 0.5) * animationSpeed,
        vz: (Math.random() - 0.5) * animationSpeed * 0.5,
        opacity: Math.random() * 0.3 + 0.7,
        size: Math.random() * 2 + 1,
        depth: z // Store original depth
      });
    }

    return {
      id,
      points,
      center: { x: centerX, y: centerY, z: centerZ },
      lifetime: 0,
      maxLifetime: shapeLifetime + Math.random() * 3000,
      isDissolving: false,
      dissolveProgress: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.002,
      rotation: 0,
      rotationX: (Math.random() - 0.5) * 0.001,
      rotationY: (Math.random() - 0.5) * 0.001,
      rotationZ: (Math.random() - 0.5) * 0.001
    };
  }, [dimensions, minPoints, maxPoints, animationSpeed, shapeLifetime]);

  // Convert 3D coordinates to 2D with perspective
  const project3D = useCallback((x: number, y: number, z: number) => {
    const perspective = 400; // Distance from camera
    const scale = perspective / (perspective + z);
    
    return {
      x: x * scale,
      y: y * scale,
      scale: scale
    };
  }, []);

  // Create gradient for 3D lighting effect
  const createLightingGradient = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number, depth: number) => {
    const gradient = ctx.createRadialGradient(x - size * 0.3, y - size * 0.3, 0, x, y, size);
    
    // Adjust lighting based on depth
    const lightIntensity = Math.max(0.3, 1 - Math.abs(depth) / 200);
    const baseColor = `rgba(2, 191, 122, ${lightIntensity})`;
    const shadowColor = `rgba(1, 95, 61, ${lightIntensity * 0.3})`;
    
    gradient.addColorStop(0, baseColor);
    gradient.addColorStop(0.7, `rgba(2, 191, 122, ${lightIntensity * 0.6})`);
    gradient.addColorStop(1, shadowColor);
    
    return gradient;
  }, []);

  // Initialize shapes
  const initializeShapes = useCallback(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    
    const shapes: GeometricShape[] = [];
    
    for (let i = 0; i < shapeCount; i++) {
      shapes.push(createGeometricShape(i));
    }

    shapesRef.current = shapes;
    setIsInitialized(true);
    console.log('Geometric shapes initialized:', shapes.length);
  }, [shapeCount, createGeometricShape, dimensions]);

  // Update canvas dimensions
  const updateDimensions = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const shapes = shapesRef.current;
    if (shapes.length === 0) return;

    // Update shapes
    shapes.forEach((shape, shapeIndex) => {
      shape.lifetime += 16; // Assuming 60fps
      shape.rotation += shape.rotationSpeed;

      // Check if shape should start dissolving
      if (shape.lifetime > shape.maxLifetime && !shape.isDissolving) {
        shape.isDissolving = true;
      }

      // Update dissolve progress
      if (shape.isDissolving) {
        shape.dissolveProgress += dissolveSpeed;
        
        // If fully dissolved, recreate the shape
        if (shape.dissolveProgress >= 1) {
          shapesRef.current[shapeIndex] = createGeometricShape(shape.id);
          return;
        }
      }

      // Update points with gentle movement
      shape.points.forEach(point => {
        point.x += point.vx;
        point.y += point.vy;

        // Gentle boundary bouncing
        if (point.x <= 0 || point.x >= canvas.width) {
          point.vx *= -0.8;
          point.x = Math.max(0, Math.min(canvas.width, point.x));
        }
        if (point.y <= 0 || point.y >= canvas.height) {
          point.vy *= -0.8;
          point.y = Math.max(0, Math.min(canvas.height, point.y));
        }

        // Gentle velocity damping
        point.vx *= 0.999;
        point.vy *= 0.999;
      });

      // Update center based on points
      shape.center.x = shape.points.reduce((sum, p) => sum + p.x, 0) / shape.points.length;
      shape.center.y = shape.points.reduce((sum, p) => sum + p.y, 0) / shape.points.length;

      // Calculate opacity based on dissolve progress
      const baseOpacity = shape.isDissolving ? 
        Math.max(0, 1 - shape.dissolveProgress) : 
        Math.min(1, shape.lifetime / 1000); // Fade in over 1 second

      // Draw connections between points
      ctx.strokeStyle = `rgba(2, 191, 122, ${baseOpacity * 0.4})`;
      ctx.lineWidth = 1.5;
      
      // Draw lines connecting all points in the shape
      for (let i = 0; i < shape.points.length; i++) {
        const currentPoint = shape.points[i];
        const nextPoint = shape.points[(i + 1) % shape.points.length];
        
        // Apply slight randomness to dissolving shapes
        let opacity = baseOpacity * 0.6;
        if (shape.isDissolving) {
          opacity *= (1 - shape.dissolveProgress * 0.5 + Math.random() * 0.3);
        }
        
        ctx.strokeStyle = `rgba(2, 191, 122, ${Math.max(0, opacity)})`;
        ctx.beginPath();
        ctx.moveTo(currentPoint.x, currentPoint.y);
        ctx.lineTo(nextPoint.x, nextPoint.y);
        ctx.stroke();
      }

      // Draw points
      shape.points.forEach(point => {
        let pointOpacity = baseOpacity * point.opacity;
        let pointSize = point.size;
        
        // Add dissolve effect to points
        if (shape.isDissolving) {
          pointOpacity *= (1 - shape.dissolveProgress + Math.random() * 0.2);
          pointSize *= (1 - shape.dissolveProgress * 0.5);
        }
        
        ctx.fillStyle = `rgba(2, 191, 122, ${Math.max(0, pointOpacity)})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, Math.max(0, pointSize), 0, Math.PI * 2);
        ctx.fill();
      });
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [createGeometricShape, dissolveSpeed]);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [updateDimensions]);

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      initializeShapes();
    }
  }, [dimensions, initializeShapes]);

  useEffect(() => {
    if (isInitialized && shapesRef.current.length > 0) {
      console.log('Starting geometric animation with', shapesRef.current.length, 'shapes');
      animate();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInitialized, animate]);

  return (
    <div className="fixed inset-0 z-0">
      {/* Static gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(240, 240, 240, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(220, 220, 220, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(200, 200, 200, 0.06) 0%, transparent 50%),
            linear-gradient(135deg, #ffffff 0%, #f8f9fa 25%, #ffffff 50%, #f5f5f5 75%, #ffffff 100%)
          `
        }}
      />
      
      {/* Geometric shapes canvas */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0"
        style={{ background: 'transparent' }}
      />
    </div>
  );
};

export default GeometricBackground;