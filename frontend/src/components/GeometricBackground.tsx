import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
}

interface ChaoticLine {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  opacity: number;
  lifetime: number;
  maxLifetime: number;
}

interface GeometricShape {
  id: number;
  points: Point[];
  center: { x: number; y: number };
  lifetime: number;
  maxLifetime: number;
  isDissolving: boolean;
  dissolveProgress: number;
  isFadingIn: boolean;
  fadeInProgress: number;
  rotationSpeed: number;
  rotation: number;
  shapeType: 'triangle' | 'quad' | 'pentagon';
  chaoticLines: ChaoticLine[];
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

  // Generate chaotic lines around a shape
  const generateChaoticLines = useCallback((center: { x: number; y: number }, radius: number): ChaoticLine[] => {
    const lines: ChaoticLine[] = [];
    const lineCount = Math.floor(Math.random() * 3) + 1; // 1-3 lines
    
    for (let i = 0; i < lineCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = radius * (0.7 + Math.random() * 0.6); // 70-130% of radius
      const length = 20 + Math.random() * 30; // 20-50px long
      
      const startX = center.x + Math.cos(angle) * distance;
      const startY = center.y + Math.sin(angle) * distance;
      const endX = startX + Math.cos(angle + (Math.random() - 0.5) * 0.5) * length;
      const endY = startY + Math.sin(angle + (Math.random() - 0.5) * 0.5) * length;
      
      lines.push({
        startX,
        startY,
        endX,
        endY,
        opacity: 0.2 + Math.random() * 0.3,
        lifetime: 0,
        maxLifetime: 2000 + Math.random() * 3000 // 2-5 seconds
      });
    }
    
    return lines;
  }, []);

  // Create a simple geometric shape with pseudo-3D effect and smooth transitions
  const createGeometricShape = useCallback((id: number): GeometricShape => {
    const pointCount = Math.floor(Math.random() * (maxPoints - minPoints + 1)) + minPoints;
    const centerX = Math.random() * dimensions.width;
    const centerY = Math.random() * dimensions.height;
    const radius = Math.random() * 80 + 40; // Size between 40-120px
    
    const points: Point[] = [];
    
    // Determine shape type based on point count
    const shapeType: 'triangle' | 'quad' | 'pentagon' = 
      pointCount === 3 ? 'triangle' : 
      pointCount === 4 ? 'quad' : 'pentagon';
    
    // Create points in a geometric pattern (main shape)
    for (let i = 0; i < pointCount; i++) {
      const angle = (i / pointCount) * Math.PI * 2;
      const variance = (Math.random() - 0.5) * 0.2; // Less randomness
      const actualRadius = radius + variance * radius;
      
      points.push({
        x: centerX + Math.cos(angle) * actualRadius,
        y: centerY + Math.sin(angle) * actualRadius,
        vx: (Math.random() - 0.5) * animationSpeed,
        vy: (Math.random() - 0.5) * animationSpeed,
        opacity: Math.random() * 0.3 + 0.7,
        size: Math.random() * 2 + 1
      });
    }

    // Add center point for 3D effect (this creates the "depth" illusion)
    points.push({
      x: centerX,
      y: centerY,
      vx: (Math.random() - 0.5) * animationSpeed * 0.5,
      vy: (Math.random() - 0.5) * animationSpeed * 0.5,
      opacity: Math.random() * 0.4 + 0.6,
      size: Math.random() * 1.5 + 1
    });

    return {
      id,
      points,
      center: { x: centerX, y: centerY },
      lifetime: 0,
      maxLifetime: shapeLifetime + Math.random() * 3000,
      isDissolving: false,
      dissolveProgress: 0,
      isFadingIn: true,
      fadeInProgress: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.002,
      rotation: 0,
      shapeType,
      chaoticLines: generateChaoticLines({ x: centerX, y: centerY }, radius)
    };
  }, [dimensions, minPoints, maxPoints, animationSpeed, shapeLifetime, generateChaoticLines]);

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

  // Simple animation loop with pseudo-3D effect
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

        // Boundary bouncing
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

      // Update center based on first few points (exclude center point)
      const mainPoints = shape.points.slice(0, -1);
      shape.center.x = mainPoints.reduce((sum, p) => sum + p.x, 0) / mainPoints.length;
      shape.center.y = mainPoints.reduce((sum, p) => sum + p.y, 0) / mainPoints.length;

      // Update center point position
      const centerPoint = shape.points[shape.points.length - 1];
      centerPoint.x = shape.center.x;
      centerPoint.y = shape.center.y;

      // Calculate opacity based on dissolve progress
      const baseOpacity = shape.isDissolving ? 
        Math.max(0, 1 - shape.dissolveProgress) : 
        Math.min(1, shape.lifetime / 1000);

      // Draw perimeter connections (outer shape)
      ctx.strokeStyle = `rgba(2, 191, 122, ${baseOpacity * 0.6})`;
      ctx.lineWidth = 1.5;
      
      const mainPointCount = shape.points.length - 1;
      for (let i = 0; i < mainPointCount; i++) {
        const currentPoint = shape.points[i];
        const nextPoint = shape.points[(i + 1) % mainPointCount];
        
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

      // Draw connections to center point for 3D effect
      ctx.strokeStyle = `rgba(2, 191, 122, ${baseOpacity * 0.4})`;
      ctx.lineWidth = 1;
      
      for (let i = 0; i < mainPointCount; i++) {
        const point = shape.points[i];
        
        let opacity = baseOpacity * 0.4;
        if (shape.isDissolving) {
          opacity *= (1 - shape.dissolveProgress * 0.3 + Math.random() * 0.2);
        }
        
        ctx.strokeStyle = `rgba(2, 191, 122, ${Math.max(0, opacity)})`;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(centerPoint.x, centerPoint.y);
        ctx.stroke();
      }

      // For quadrilaterals and pentagons, add diagonal connections for more 3D effect
      if (shape.shapeType === 'quad' && mainPointCount >= 4) {
        // Draw diagonals
        ctx.strokeStyle = `rgba(2, 191, 122, ${baseOpacity * 0.3})`;
        ctx.lineWidth = 0.8;
        
        ctx.beginPath();
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        ctx.lineTo(shape.points[2].x, shape.points[2].y);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(shape.points[1].x, shape.points[1].y);
        ctx.lineTo(shape.points[3].x, shape.points[3].y);
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