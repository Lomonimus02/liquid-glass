import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  animationSpeed?: number;
  cursorInteraction?: boolean;
  particleTrails?: boolean;
}

const GeometricBackground: React.FC<GeometricBackgroundProps> = ({
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
  const isMobile = useIsMobile();

  // Calculate responsive shape count based on screen size
  const getShapeCount = useCallback(() => {
    // Отключаем геометрический фон на мобильных для производительности
    if (isMobile) return 0;
    
    const area = dimensions.width * dimensions.height;
    const baseCount = Math.max(6, Math.floor(area / 200000)); // 1 shape per ~200k pixels
    return Math.min(baseCount, 15); // Cap at 15 shapes for performance
  }, [dimensions, isMobile]);

  // Mouse movement handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newPosition = { x: e.clientX, y: e.clientY };
    
    mouseRef.current = {
      x: newPosition.x,
      y: newPosition.y,
      isMoving: true
    };
    
    setMousePosition(newPosition);

    // Create cursor particles if enabled
    if (particleTrails && Math.random() < 0.3) {
      const particle: CursorParticle = {
        id: Date.now() + Math.random(),
        x: newPosition.x + (Math.random() - 0.5) * 20,
        y: newPosition.y + (Math.random() - 0.5) * 20,
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
    const originalSize = 60 + Math.random() * 120; // Increased size: 60-180px (was 30-100px)
    
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

  // Initialize shapes with proper cleanup
  const initializeShapes = useCallback(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    
    const shapeCount = getShapeCount();
    
    // Always clear existing shapes first to prevent stale state
    shapesRef.current = [];
    particlesRef.current = [];
    
    // If no shapes needed (mobile), just set initialized and return
    if (shapeCount === 0) {
      setIsInitialized(true);
      console.log('Geometric shapes disabled for mobile, clearing existing shapes');
      return;
    }
    
    const shapes: GeometricShape[] = [];
    
    for (let i = 0; i < shapeCount; i++) {
      shapes.push(createGeometricShape(i));
    }

    shapesRef.current = shapes;
    setIsInitialized(true);
    console.log('Geometric shapes initialized:', shapes.length, 'for screen size:', dimensions.width, 'x', dimensions.height, 'isMobile:', isMobile);
  }, [createGeometricShape, dimensions, getShapeCount, isMobile]);

  // Update canvas dimensions with debouncing to prevent excessive reinitialization
  const updateDimensions = useCallback(() => {
    const newDimensions = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    // Only update if dimensions actually changed significantly (avoid minor changes)
    if (Math.abs(newDimensions.width - dimensions.width) > 10 || 
        Math.abs(newDimensions.height - dimensions.height) > 10) {
      console.log('Dimensions changed from', dimensions, 'to', newDimensions);
      setDimensions(newDimensions);
    }
  }, [dimensions]);

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

        // Draw particle with brand color
        ctx.fillStyle = `rgba(2, 191, 122, ${particle.opacity})`; // Brand green color
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
      
      // Update size phase for breathing effect (even slower for smoother transitions)
      shape.sizePhase += 0.0005; // Reduced from 0.001 to 0.0005 for smoother transitions
      shape.currentSizeMultiplier = 1.0 + Math.sin(shape.sizePhase) * 0.06; // Reduced from 0.08 to 0.06
      
      // Update float phase for floating effect
      shape.floatPhase += shape.floatSpeed;
      const floatOffset = Math.sin(shape.floatPhase) * 10;

      // Calculate distance to mouse for interaction
      const distanceToMouse = Math.sqrt(
        Math.pow(mouse.x - shape.center.x, 2) + 
        Math.pow(mouse.y - shape.center.y, 2)
      );

      // NO mouse influence on center - shapes move independently
      // Mouse interaction removed to prevent shape attraction/repulsion

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
        // Update phases for organic deformation - slower animation
        vertex.radiusPhase += 0.004 + (index * 0.0015); // Reduced from 0.008 + 0.003
        vertex.deformationPhase += 0.003 + (index * 0.001); // Reduced from 0.006 + 0.002
        
        // Calculate organic deformation
        const organicDeformation = Math.sin(vertex.deformationPhase) * shape.deformationStrength;
        const breathingMultiplier = 1.0 + Math.sin(vertex.radiusPhase) * shape.liquidness;
        
        // NO mouse influence on individual vertices - shapes remain unchanged
        // Only connection lines appear, no shape deformation
        const mouseInfluence = 0; // Always 0 - no shape changes from cursor
        
        // Calculate current radius with all influences (smoother transitions)
        const currentRadius = vertex.originalRadius * breathingMultiplier * shape.currentSizeMultiplier * (1 + organicDeformation + mouseInfluence);
        
        // Calculate deformed angle for organic shape
        const angleDeformation = Math.sin(vertex.deformationPhase + index) * 0.2;
        const currentAngle = vertex.originalAngle + angleDeformation;
        
        // Apply transformations
        const cosAngle = Math.cos(currentAngle + shape.rotation);
        const sinAngle = Math.sin(currentAngle + shape.rotation);
        
        vertex.x = shape.center.x + cosAngle * currentRadius;
        vertex.y = shape.center.y + sinAngle * currentRadius;

        // Update opacity based on deformation (no mouse influence)
        vertex.opacity = 0.4 + Math.abs(organicDeformation) * 0.3;
      });

      // Draw connections between cursor and nearby shapes - increased distance and brightness
      if (cursorInteraction && distanceToMouse < 280) {
        const connectionOpacity = (280 - distanceToMouse) / 280 * 0.5; // Increased distance to 280 and opacity to 0.5
        ctx.strokeStyle = `rgba(2, 191, 122, ${connectionOpacity})`; // Brand green color
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
      ctx.strokeStyle = `rgba(2, 191, 122, 0.7)`; // Brand green color with higher opacity
      ctx.lineWidth = 1.5;
      
      for (let i = 0; i < actualVertices.length; i++) {
        const current = actualVertices[i];
        const next = actualVertices[(i + 1) % actualVertices.length];
        
        // Create curved organic connections
        ctx.beginPath();
        ctx.moveTo(current.x, current.y);
        
        // Add slight curve for organic feel - slower animation
        const midX = (current.x + next.x) / 2;
        const midY = (current.y + next.y) / 2;
        const curve = Math.sin(Date.now() * 0.0005 + i) * 3; // Reduced speed from 0.001 to 0.0005
        
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
        const lineOpacity = 0.3 + Math.sin(Date.now() * 0.001 + index) * 0.1; // Slower animation
        ctx.strokeStyle = `rgba(2, 191, 122, ${lineOpacity})`; // Brand green color
        ctx.lineWidth = 0.8;
        
        ctx.beginPath();
        ctx.moveTo(shape.center.x, shape.center.y);
        ctx.lineTo(vertex.x, vertex.y);
        ctx.stroke();
      });

      // Vertices dots removed - keeping only geometric shapes

      // Center point dots removed - keeping only geometric shapes
    });

    // Reset mouse moving state
    mouseRef.current.isMoving = false;

    animationRef.current = requestAnimationFrame(animate);
  }, [cursorInteraction, particleTrails]);

  useEffect(() => {
    updateDimensions();
    
    // Debounce resize events to prevent excessive reinitialization
    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateDimensions, 300); // 300ms debounce
    };
    
    window.addEventListener('resize', debouncedResize);
    
    // Add mouse event listeners for cursor interaction
    if (cursorInteraction) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', debouncedResize);
      if (cursorInteraction) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [handleMouseMove, cursorInteraction]); // Removed updateDimensions from deps to prevent recreation

  useEffect(() => {
    // Always reinitialize when dimensions or mobile state changes
    if (dimensions.width > 0 && dimensions.height > 0) {
      console.log('Reinitializing shapes due to dimension/mobile state change:', { 
        dimensions, 
        isMobile, 
        currentShapeCount: shapesRef.current.length,
        expectedShapeCount: getShapeCount()
      });
      initializeShapes();
    }
  }, [dimensions, initializeShapes, isMobile]); // Added isMobile to dependencies

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
    <div className="fixed inset-0 z-[1]">
      {/* Exact brand green background color - FORCED */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{
          backgroundColor: 'rgb(230, 255, 245)',
          background: 'rgb(230, 255, 245) !important'
        }}
      />
      
      {/* Organic geometric shapes canvas */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 z-[2]"
        style={{ 
          background: 'transparent'
        }}
      />
    </div>
  );
};

export default GeometricBackground;