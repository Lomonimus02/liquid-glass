import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
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
    
    // Create vertices of the shape
    for (let i = 0; i < pointCount; i++) {
      const angle = (i / pointCount) * Math.PI * 2;
      // Add slight randomness to make shapes not identical
      const variance = (Math.random() - 0.5) * 0.3;
      const radius = originalSize + variance * originalSize;
      
      vertices.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * animationSpeed * 0.8,
        vy: (Math.random() - 0.5) * animationSpeed * 0.8,
        opacity: 0.6 + Math.random() * 0.4
      });
    }

    // Create center point for 3D effect
    const center: Point = {
      x: centerX,
      y: centerY,
      vx: (Math.random() - 0.5) * animationSpeed * 0.5,
      vy: (Math.random() - 0.5) * animationSpeed * 0.5,
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

  // Animation loop with diverse shapes that just fly around
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const shapes = shapesRef.current;
    if (shapes.length === 0) return;

    // Update shapes - they just fly around without dissolving
    shapes.forEach((shape) => {
      shape.rotation += shape.rotationSpeed;

      // Update points with more chaotic movement
      shape.points.forEach(point => {
        // Add more random variations for chaotic movement
        point.vx += (Math.random() - 0.5) * 0.02;
        point.vy += (Math.random() - 0.5) * 0.02;
        
        point.x += point.vx;
        point.y += point.vy;

        // Boundary bouncing with more variety
        if (point.x <= 0 || point.x >= canvas.width) {
          point.vx *= -(0.6 + Math.random() * 0.4); // Random bounce strength
          point.x = Math.max(0, Math.min(canvas.width, point.x));
        }
        if (point.y <= 0 || point.y >= canvas.height) {
          point.vy *= -(0.6 + Math.random() * 0.4); // Random bounce strength
          point.y = Math.max(0, Math.min(canvas.height, point.y));
        }

        // Variable velocity damping
        point.vx *= (0.995 + Math.random() * 0.01);
        point.vy *= (0.995 + Math.random() * 0.01);
      });

      // Update center based on main points (exclude center point if it exists)
      const mainPoints = shape.points.slice(0, -1);
      if (mainPoints.length > 0) {
        shape.center.x = mainPoints.reduce((sum, p) => sum + p.x, 0) / mainPoints.length;
        shape.center.y = mainPoints.reduce((sum, p) => sum + p.y, 0) / mainPoints.length;

        // Update center point position if it exists
        if (shape.points.length > mainPoints.length) {
          const centerPoint = shape.points[shape.points.length - 1];
          centerPoint.x = shape.center.x;
          centerPoint.y = shape.center.y;
        }
      }

      const baseOpacity = 0.6; // Fixed opacity without breathing effect

      // Draw connections based on shape type
      if (shape.shapeType === 'irregular') {
        // Draw irregular connections
        shape.irregularConnections.forEach((connections, pointIndex) => {
          connections.forEach(targetIndex => {
            const startPoint = shape.points[pointIndex];
            const endPoint = shape.points[targetIndex];
            
            if (startPoint && endPoint) {
              ctx.strokeStyle = `rgba(2, 191, 122, ${baseOpacity * 0.5})`;
              ctx.lineWidth = 1.0; // Fixed line width
              ctx.beginPath();
              ctx.moveTo(startPoint.x, startPoint.y);
              ctx.lineTo(endPoint.x, endPoint.y);
              ctx.stroke();
            }
          });
        });
      } else {
        // Draw regular perimeter connections
        const mainPointCount = shape.points.length > 3 ? shape.points.length - 1 : shape.points.length;
        
        for (let i = 0; i < mainPointCount; i++) {
          const currentPoint = shape.points[i];
          const nextPoint = shape.points[(i + 1) % mainPointCount];
          
          ctx.strokeStyle = `rgba(2, 191, 122, ${baseOpacity * 0.7})`;
          ctx.lineWidth = 1.2; // Fixed line width
          ctx.beginPath();
          ctx.moveTo(currentPoint.x, currentPoint.y);
          ctx.lineTo(nextPoint.x, nextPoint.y);
          ctx.stroke();
        }

        // Draw connections to center point for 3D effect (if center point exists)
        if (shape.points.length > mainPointCount) {
          const centerPoint = shape.points[shape.points.length - 1];
          ctx.strokeStyle = `rgba(2, 191, 122, ${baseOpacity * 0.4})`;
          ctx.lineWidth = 0.8;
          
          for (let i = 0; i < mainPointCount; i++) {
            const point = shape.points[i];
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(centerPoint.x, centerPoint.y);
            ctx.stroke();
          }
        }

        // For quadrilaterals and hexagons, add diagonal connections
        if (shape.shapeType === 'quad' && mainPointCount >= 4) {
          ctx.strokeStyle = `rgba(2, 191, 122, ${baseOpacity * 0.3})`;
          ctx.lineWidth = 0.6;
          
          ctx.beginPath();
          ctx.moveTo(shape.points[0].x, shape.points[0].y);
          ctx.lineTo(shape.points[2].x, shape.points[2].y);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(shape.points[1].x, shape.points[1].y);
          ctx.lineTo(shape.points[3].x, shape.points[3].y);
          ctx.stroke();
        }
        
        if (shape.shapeType === 'hexagon' && mainPointCount >= 6) {
          ctx.strokeStyle = `rgba(2, 191, 122, ${baseOpacity * 0.25})`;
          ctx.lineWidth = 0.5;
          
          // Draw some inner connections for hexagon
          for (let i = 0; i < mainPointCount; i += 2) {
            const targetIndex = (i + 3) % mainPointCount;
            ctx.beginPath();
            ctx.moveTo(shape.points[i].x, shape.points[i].y);
            ctx.lineTo(shape.points[targetIndex].x, shape.points[targetIndex].y);
            ctx.stroke();
          }
        }
      }

      // Draw points with consistent size
      shape.points.forEach((point, index) => {
        const pointOpacity = baseOpacity * point.opacity;
        const pointSize = point.size; // Fixed size without pulsation
        
        ctx.fillStyle = `rgba(2, 191, 122, ${pointOpacity})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, Math.max(0.2, pointSize), 0, Math.PI * 2);
        ctx.fill();
        
        // Removed glow effect to prevent size variations
      });
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