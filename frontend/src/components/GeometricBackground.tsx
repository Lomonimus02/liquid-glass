import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  originalRadius: number; // Store original distance from center
  radiusPhase: number; // Phase for radius animation
}

interface GeometricShape {
  id: number;
  vertices: Point[]; // Outer vertices of the shape
  center: Point; // Center point for 3D effect
  originalSize: number; // Original size to return to
  currentSizeMultiplier: number; // Current size multiplier
  sizePhase: number; // Phase for size animation
  rotationSpeed: number;
  rotation: number;
  shapeType: 'triangle' | 'quad' | 'pentagon';
  floatPhase: number; // Phase for floating animation
  floatSpeed: number; // Speed of floating
}

interface GeometricBackgroundProps {
  shapeCount?: number;
  animationSpeed?: number;
}

const GeometricBackground: React.FC<GeometricBackgroundProps> = ({
  shapeCount = 8,
  animationSpeed = 0.5
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const shapesRef = useRef<GeometricShape[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  // Create a geometric shape (triangle, quad, or pentagon)
  const createGeometricShape = useCallback((id: number): GeometricShape => {
    const shapeTypes: ('triangle' | 'quad' | 'pentagon')[] = ['triangle', 'quad', 'pentagon'];
    const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    
    const centerX = Math.random() * dimensions.width;
    const centerY = Math.random() * dimensions.height;
    const originalSize = 40 + Math.random() * 60; // Size between 40-100px
    
    const pointCount = shapeType === 'triangle' ? 3 : 
                     shapeType === 'quad' ? 4 : 5;
    
    const vertices: Point[] = [];
    
    // Create vertices with FIXED relative positions but with breathing effect
    for (let i = 0; i < pointCount; i++) {
      const angle = (i / pointCount) * Math.PI * 2;
      const radius = originalSize; // Fixed radius, no variance
      
      vertices.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0, // No individual movement
        vy: 0, // No individual movement
        opacity: 0.6 + Math.random() * 0.4,
        originalRadius: radius, // Store original distance
        radiusPhase: Math.random() * Math.PI * 2 // Random phase for organic breathing
      });
    }

    // Create center point for 3D effect
    const center: Point = {
      x: centerX,
      y: centerY,
      vx: (Math.random() - 0.5) * animationSpeed * 1.2, // Only center moves
      vy: (Math.random() - 0.5) * animationSpeed * 1.2, // Only center moves
      opacity: 0.7 + Math.random() * 0.3
    };

    return {
      id,
      vertices,
      center,
      originalSize,
      currentSizeMultiplier: 1.0,
      sizePhase: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01,
      rotation: 0,
      shapeType,
      floatPhase: Math.random() * Math.PI * 2,
      floatSpeed: 0.02 + Math.random() * 0.03
    };
  }, [dimensions, animationSpeed]);

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

  // Animation loop with smooth size changes and floating effect
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const shapes = shapesRef.current;
    if (shapes.length === 0) return;

    // Update shapes with floating and size animation
    shapes.forEach((shape) => {
      // Update rotation
      shape.rotation += shape.rotationSpeed;
      
      // Update size phase for smooth size changes
      shape.sizePhase += 0.005;
      // NO SIZE CHANGES - keep multiplier at 1.0 always
      shape.currentSizeMultiplier = 1.0;
      
      // Update float phase for floating effect
      shape.floatPhase += shape.floatSpeed;
      const floatOffset = Math.sin(shape.floatPhase) * 8; // Gentle floating

      // Update center point with movement
      shape.center.vx += (Math.random() - 0.5) * 0.008;
      shape.center.vy += (Math.random() - 0.5) * 0.008;
      
      shape.center.x += shape.center.vx;
      shape.center.y += shape.center.vy + floatOffset * 0.015;

      // Boundary bouncing for center
      if (shape.center.x <= 0 || shape.center.x >= canvas.width) {
        shape.center.vx *= -0.7;
        shape.center.x = Math.max(0, Math.min(canvas.width, shape.center.x));
      }
      if (shape.center.y <= 0 || shape.center.y >= canvas.height) {
        shape.center.vy *= -0.7;
        shape.center.y = Math.max(0, Math.min(canvas.height, shape.center.y));
      }

      // Velocity damping for center
      shape.center.vx *= 0.9995;
      shape.center.vy *= 0.9995;

      // Move all vertices relative to center movement (shape moves as whole)
      const deltaX = shape.center.x - (shape.vertices.reduce((sum, v) => sum + v.x, 0) / shape.vertices.length);
      const deltaY = shape.center.y - (shape.vertices.reduce((sum, v) => sum + v.y, 0) / shape.vertices.length);
      
      shape.vertices.forEach(vertex => {
        vertex.x += deltaX;
        vertex.y += deltaY;
      });

      // Use direct vertex positions without any size calculations
      const actualVertices = shape.vertices.map(vertex => ({
        x: vertex.x,
        y: vertex.y,
        opacity: vertex.opacity
      }));

      // Draw perimeter connections
      ctx.strokeStyle = `rgba(2, 191, 122, 0.6)`;
      ctx.lineWidth = 1.2;
      
      for (let i = 0; i < actualVertices.length; i++) {
        const current = actualVertices[i];
        const next = actualVertices[(i + 1) % actualVertices.length];
        
        ctx.beginPath();
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      }

      // Draw 3D effect lines from center to vertices
      ctx.strokeStyle = `rgba(2, 191, 122, 0.4)`;
      ctx.lineWidth = 0.8;
      
      actualVertices.forEach(vertex => {
        ctx.beginPath();
        ctx.moveTo(shape.center.x, shape.center.y);
        ctx.lineTo(vertex.x, vertex.y);
        ctx.stroke();
      });

      // Draw vertices
      actualVertices.forEach(vertex => {
        ctx.fillStyle = `rgba(2, 191, 122, ${vertex.opacity})`;
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw center point
      ctx.fillStyle = `rgba(2, 191, 122, ${shape.center.opacity})`;
      ctx.beginPath();
      ctx.arc(shape.center.x, shape.center.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    animationRef.current = requestAnimationFrame(animate);
  }, []);

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