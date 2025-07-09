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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  // Animation loop with enhanced cursor interaction and organic deformation
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const shapes = shapesRef.current;
    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    if (shapes.length === 0) return;

    // Update cursor particles
    if (particleTrails) {
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        // Update particle
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        particle.opacity = (particle.life / particle.maxLife) * 0.8;
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Draw particle
        ctx.fillStyle = `rgba(2, 191, 122, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Remove dead particles
        if (particle.life <= 0) {
          particles.splice(i, 1);
        }
      }
    }

    // Update shapes with organic deformation and cursor interaction
    shapes.forEach((shape) => {
      // Update rotation
      shape.rotation += shape.rotationSpeed;
      
      // Update size phase for breathing effect
      shape.sizePhase += 0.003;
      shape.currentSizeMultiplier = 1.0 + Math.sin(shape.sizePhase) * 0.1;
      
      // Update float phase for floating effect
      shape.floatPhase += shape.floatSpeed;
      const floatOffset = Math.sin(shape.floatPhase) * 10;

      // Calculate distance to mouse for interaction
      const distanceToMouse = Math.sqrt(
        Math.pow(mouse.x - shape.center.x, 2) + 
        Math.pow(mouse.y - shape.center.y, 2)
      );

      // Mouse influence on center
      if (cursorInteraction && distanceToMouse < 200) {
        const mouseForce = (200 - distanceToMouse) / 200;
        const angle = Math.atan2(mouse.y - shape.center.y, mouse.x - shape.center.x);
        
        // Attraction towards mouse
        shape.center.vx += Math.cos(angle) * shape.mouseAttraction * mouseForce;
        shape.center.vy += Math.sin(angle) * shape.mouseAttraction * mouseForce;
      }

      // Update center point with organic movement
      shape.center.vx += (Math.random() - 0.5) * 0.005;
      shape.center.vy += (Math.random() - 0.5) * 0.005;
      
      shape.center.x += shape.center.vx;
      shape.center.y += shape.center.vy + floatOffset * 0.01;

      // Boundary bouncing for center with soft rebounds
      if (shape.center.x <= 0 || shape.center.x >= canvas.width) {
        shape.center.vx *= -0.6;
        shape.center.x = Math.max(0, Math.min(canvas.width, shape.center.x));
      }
      if (shape.center.y <= 0 || shape.center.y >= canvas.height) {
        shape.center.vy *= -0.6;
        shape.center.y = Math.max(0, Math.min(canvas.height, shape.center.y));
      }

      // Velocity damping for organic movement
      shape.center.vx *= 0.995;
      shape.center.vy *= 0.995;

      // Update vertices with organic deformation and cursor interaction
      shape.vertices.forEach((vertex, index) => {
        // Update deformation phases
        vertex.radiusPhase += 0.008 + (index * 0.003);
        vertex.deformationPhase += 0.006 + (index * 0.002);
        
        // Calculate organic deformation
        const organicDeformation = Math.sin(vertex.deformationPhase) * shape.deformationStrength;
        const breathingMultiplier = 1.0 + Math.sin(vertex.radiusPhase) * shape.liquidness;
        
        // Mouse influence on individual vertices
        let mouseInfluence = 0;
        if (cursorInteraction && distanceToMouse < 150) {
          const vertexDistanceToMouse = Math.sqrt(
            Math.pow(mouse.x - vertex.x, 2) + 
            Math.pow(mouse.y - vertex.y, 2)
          );
          if (vertexDistanceToMouse < 100) {
            mouseInfluence = (100 - vertexDistanceToMouse) / 100 * vertex.mouseInfluence;
          }
        }
        
        // Calculate current radius with all influences
        const currentRadius = vertex.originalRadius * breathingMultiplier * shape.currentSizeMultiplier * (1 + organicDeformation + mouseInfluence * 0.3);
        
        // Calculate deformed angle for organic shape
        const angleDeformation = Math.sin(vertex.deformationPhase + index) * 0.2;
        const currentAngle = vertex.originalAngle + angleDeformation;
        
        // Apply transformations
        const cosAngle = Math.cos(currentAngle + shape.rotation);
        const sinAngle = Math.sin(currentAngle + shape.rotation);
        
        vertex.x = shape.center.x + cosAngle * currentRadius;
        vertex.y = shape.center.y + sinAngle * currentRadius;

        // Update opacity based on deformation
        vertex.opacity = 0.4 + Math.abs(organicDeformation) * 0.3 + mouseInfluence * 0.2;
      });

      // Draw connections between cursor and nearby shapes
      if (cursorInteraction && distanceToMouse < 180) {
        const connectionOpacity = (180 - distanceToMouse) / 180 * 0.4;
        ctx.strokeStyle = `rgba(2, 191, 122, ${connectionOpacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(shape.center.x, shape.center.y);
        ctx.stroke();
      }

      // Use vertex positions for rendering
      const actualVertices = shape.vertices.map(vertex => ({
        x: vertex.x,
        y: vertex.y,
        opacity: vertex.opacity
      }));

      // Draw perimeter connections with organic curve
      ctx.strokeStyle = `rgba(2, 191, 122, 0.7)`;
      ctx.lineWidth = 1.5;
      
      for (let i = 0; i < actualVertices.length; i++) {
        const current = actualVertices[i];
        const next = actualVertices[(i + 1) % actualVertices.length];
        
        // Create curved organic connections
        ctx.beginPath();
        ctx.moveTo(current.x, current.y);
        
        // Add slight curve for organic feel
        const midX = (current.x + next.x) / 2;
        const midY = (current.y + next.y) / 2;
        const curve = Math.sin(Date.now() * 0.001 + i) * 3;
        
        ctx.quadraticCurveTo(
          midX + curve,
          midY + curve,
          next.x,
          next.y
        );
        ctx.stroke();
      }

      // Draw 3D effect lines from center to vertices with varying opacity
      actualVertices.forEach((vertex, index) => {
        const lineOpacity = 0.3 + Math.sin(Date.now() * 0.002 + index) * 0.1;
        ctx.strokeStyle = `rgba(2, 191, 122, ${lineOpacity})`;
        ctx.lineWidth = 0.8;
        
        ctx.beginPath();
        ctx.moveTo(shape.center.x, shape.center.y);
        ctx.lineTo(vertex.x, vertex.y);
        ctx.stroke();
      });

      // Draw vertices with pulsing effect
      actualVertices.forEach((vertex, index) => {
        const pulse = 1 + Math.sin(Date.now() * 0.003 + index) * 0.2;
        ctx.fillStyle = `rgba(2, 191, 122, ${vertex.opacity})`;
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 2 * pulse, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw center point with glow effect
      const centerPulse = 1 + Math.sin(Date.now() * 0.004) * 0.3;
      ctx.fillStyle = `rgba(2, 191, 122, ${shape.center.opacity})`;
      ctx.beginPath();
      ctx.arc(shape.center.x, shape.center.y, 2 * centerPulse, 0, Math.PI * 2);
      ctx.fill();
    });

    // Reset mouse moving state
    mouseRef.current.isMoving = false;

    animationRef.current = requestAnimationFrame(animate);
  }, [cursorInteraction, particleTrails]);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    // Add mouse event listeners for cursor interaction
    if (cursorInteraction) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (cursorInteraction) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [updateDimensions, handleMouseMove, cursorInteraction]);

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
      {/* Enhanced gradient background with more depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(2, 191, 122, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(2, 191, 122, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(2, 191, 122, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 60% 70%, rgba(240, 240, 240, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #ffffff 0%, #f8f9fa 25%, #ffffff 50%, #f5f5f5 75%, #ffffff 100%)
          `
        }}
      />
      
      {/* Organic geometric shapes canvas */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0"
        style={{ 
          background: 'transparent',
          cursor: cursorInteraction ? 'none' : 'default'
        }}
      />
      
      {/* Custom cursor when interaction is enabled */}
      {cursorInteraction && (
        <div 
          className="fixed pointer-events-none z-50"
          style={{
            left: `${mouseRef.current.x - 8}px`,
            top: `${mouseRef.current.y - 8}px`,
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'rgba(2, 191, 122, 0.3)',
            boxShadow: '0 0 10px rgba(2, 191, 122, 0.5)',
            transform: 'translate(-50%, -50%)',
            transition: 'transform 0.1s ease'
          }}
        />
      )}
    </div>
  );
};

export default GeometricBackground;