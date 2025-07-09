import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  originalRadius: number;
  originalAngle: number;
  radiusPhase: number;
  deformationPhase: number; // For organic deformation
  mouseInfluence: number; // How much mouse affects this point
}

interface CursorParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
}

interface GeometricShape {
  id: number;
  vertices: Point[];
  center: Point;
  originalSize: number;
  currentSizeMultiplier: number;
  sizePhase: number;
  rotationSpeed: number;
  rotation: number;
  shapeType: 'triangle' | 'quad' | 'pentagon';
  floatPhase: number;
  floatSpeed: number;
  deformationStrength: number; // How much shape can deform
  mouseAttraction: number; // How much mouse attracts this shape
  liquidness: number; // How fluid/organic the shape is
}

interface GeometricBackgroundProps {
  shapeCount?: number;
  animationSpeed?: number;
  cursorInteraction?: boolean;
  particleTrails?: boolean;
}

const GeometricBackground: React.FC<GeometricBackgroundProps> = ({
  shapeCount = 8,
  animationSpeed = 0.5,
  cursorInteraction = true,
  particleTrails = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const shapesRef = useRef<GeometricShape[]>([]);
  const particlesRef = useRef<CursorParticle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  // Mouse movement handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = {
      x: e.clientX,
      y: e.clientY,
      isMoving: true
    };

    // Create cursor particles if enabled
    if (particleTrails && Math.random() < 0.3) {
      const particle: CursorParticle = {
        id: Date.now() + Math.random(),
        x: e.clientX + (Math.random() - 0.5) * 20,
        y: e.clientY + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        maxLife: 60 + Math.random() * 40,
        size: 1 + Math.random() * 3,
        opacity: 0.8
      };
      particlesRef.current.push(particle);
    }
  }, [particleTrails]);

  // Create organic geometric shape with deformation capabilities
  const createGeometricShape = useCallback((id: number): GeometricShape => {
    const shapeTypes: ('triangle' | 'quad' | 'pentagon')[] = ['triangle', 'quad', 'pentagon'];
    const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    
    const centerX = Math.random() * dimensions.width;
    const centerY = Math.random() * dimensions.height;
    const originalSize = 30 + Math.random() * 70; // Size between 30-100px
    
    const pointCount = shapeType === 'triangle' ? 3 : 
                     shapeType === 'quad' ? 4 : 5;
    
    const vertices: Point[] = [];
    
    // Create vertices with organic deformation capabilities
    for (let i = 0; i < pointCount; i++) {
      const angle = (i / pointCount) * Math.PI * 2;
      const radiusVariation = 0.8 + Math.random() * 0.4; // 80%-120% of original
      const radius = originalSize * radiusVariation;
      
      vertices.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        opacity: 0.4 + Math.random() * 0.6,
        originalRadius: radius,
        originalAngle: angle,
        radiusPhase: Math.random() * Math.PI * 2,
        deformationPhase: Math.random() * Math.PI * 2,
        mouseInfluence: 0.5 + Math.random() * 0.5
      });
    }

    // Create center point
    const center: Point = {
      x: centerX,
      y: centerY,
      vx: (Math.random() - 0.5) * animationSpeed * 0.8,
      vy: (Math.random() - 0.5) * animationSpeed * 0.8,
      opacity: 0.6 + Math.random() * 0.4,
      originalRadius: 0,
      originalAngle: 0,
      radiusPhase: 0,
      deformationPhase: 0,
      mouseInfluence: 0.8
    };

    return {
      id,
      vertices,
      center,
      originalSize,
      currentSizeMultiplier: 1.0,
      sizePhase: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.008,
      rotation: 0,
      shapeType,
      floatPhase: Math.random() * Math.PI * 2,
      floatSpeed: 0.015 + Math.random() * 0.025,
      deformationStrength: 0.3 + Math.random() * 0.4,
      mouseAttraction: 0.0008 + Math.random() * 0.0012,
      liquidness: 0.1 + Math.random() * 0.2
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

      // Update vertices with gentle breathing effect using FIXED angles
      shape.vertices.forEach((vertex, index) => {
        // Update radius phase for breathing
        vertex.radiusPhase += 0.01 + (index * 0.002); // Different speeds for organic feel
        
        // Calculate breathing radius (small variations: ±12%)
        const breathingMultiplier = 1.0 + Math.sin(vertex.radiusPhase) * 0.12;
        const currentRadius = vertex.originalRadius * breathingMultiplier;
        
        // Use FIXED original angle to maintain geometry
        vertex.x = shape.center.x + Math.cos(vertex.originalAngle) * currentRadius;
        vertex.y = shape.center.y + Math.sin(vertex.originalAngle) * currentRadius;
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