import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  connections: number[];
}

interface NetworkBackgroundProps {
  nodeCount?: number;
  maxConnections?: number;
  connectionDistance?: number;
  animationSpeed?: number;
  mouseInteractionRadius?: number;
}

const NetworkBackground: React.FC<NetworkBackgroundProps> = ({
  nodeCount = 50,
  maxConnections = 6,
  connectionDistance = 180,
  animationSpeed = 0.1,
  mouseInteractionRadius = 150
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize nodes
  const initializeNodes = useCallback(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;
    
    const nodes: Node[] = [];
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * animationSpeed,
        vy: (Math.random() - 0.5) * animationSpeed,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.5 + 0.5,
        connections: []
      });
    }

    // Create connections between nearby nodes
    nodes.forEach((node, index) => {
      const connections: number[] = [];
      
      for (let j = 0; j < nodes.length; j++) {
        if (j !== index && connections.length < maxConnections) {
          const distance = Math.sqrt(
            Math.pow(node.x - nodes[j].x, 2) + Math.pow(node.y - nodes[j].y, 2)
          );
          
          if (distance < connectionDistance) {
            connections.push(j);
          }
        }
      }
      
      node.connections = connections;
    });

    nodesRef.current = nodes;
    setIsInitialized(true);
    console.log('Nodes initialized:', nodes.length);
  }, [nodeCount, maxConnections, connectionDistance, animationSpeed, dimensions]);

  // Update canvas dimensions
  const updateDimensions = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = {
      x: e.clientX,
      y: e.clientY
    };
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const nodes = nodesRef.current;
    if (nodes.length === 0) return;

    const mouse = mouseRef.current;

    // Update node positions
    nodes.forEach(node => {
      // Basic movement
      node.x += node.vx;
      node.y += node.vy;

      // Boundary collision
      if (node.x <= 0 || node.x >= canvas.width) {
        node.vx *= -1;
        node.x = Math.max(0, Math.min(canvas.width, node.x));
      }
      if (node.y <= 0 || node.y >= canvas.height) {
        node.vy *= -1;
        node.y = Math.max(0, Math.min(canvas.height, node.y));
      }

      // Mouse interaction
      const mouseDistance = Math.sqrt(
        Math.pow(mouse.x - node.x, 2) + Math.pow(mouse.y - node.y, 2)
      );

      if (mouseDistance < mouseInteractionRadius) {
        const force = (mouseInteractionRadius - mouseDistance) / mouseInteractionRadius;
        const angle = Math.atan2(node.y - mouse.y, node.x - mouse.x);
        
        node.vx += Math.cos(angle) * force * 0.01;
        node.vy += Math.sin(angle) * force * 0.01;
        
        // Increase opacity when near mouse
        node.opacity = Math.min(1, 0.5 + force * 0.5);
      } else {
        // Return to normal opacity
        node.opacity = Math.max(0.5, node.opacity * 0.98);
      }

      // Limit velocity (slower movement)
      const maxVel = 1;
      node.vx = Math.max(-maxVel, Math.min(maxVel, node.vx));
      node.vy = Math.max(-maxVel, Math.min(maxVel, node.vy));
    });

    // Draw connections
    ctx.strokeStyle = 'rgba(2, 191, 122, 0.3)';
    ctx.lineWidth = 1;
    
    nodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const connectedNode = nodes[connectionId];
        if (!connectedNode) return;

        const distance = Math.sqrt(
          Math.pow(node.x - connectedNode.x, 2) + Math.pow(node.y - connectedNode.y, 2)
        );

        if (distance < connectionDistance) {
          const opacity = Math.max(0.15, 1 - distance / connectionDistance);
          
          // Enhanced opacity for mouse interaction
          const nodeMouseDistance = Math.sqrt(
            Math.pow(mouse.x - node.x, 2) + Math.pow(mouse.y - node.y, 2)
          );
          const connectedNodeMouseDistance = Math.sqrt(
            Math.pow(mouse.x - connectedNode.x, 2) + Math.pow(mouse.y - connectedNode.y, 2)
          );
          
          let finalOpacity = opacity;
          if (nodeMouseDistance < mouseInteractionRadius || connectedNodeMouseDistance < mouseInteractionRadius) {
            finalOpacity = Math.min(0.8, opacity * 2);
          }

          ctx.strokeStyle = `rgba(2, 191, 122, ${finalOpacity})`;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connectedNode.x, connectedNode.y);
          ctx.stroke();
        }
      });
    });

    // Draw nodes
    nodes.forEach(node => {
      const mouseDistance = Math.sqrt(
        Math.pow(mouse.x - node.x, 2) + Math.pow(mouse.y - node.y, 2)
      );

      let nodeSize = node.size;
      let nodeOpacity = node.opacity;
      
      if (mouseDistance < mouseInteractionRadius) {
        const force = (mouseInteractionRadius - mouseDistance) / mouseInteractionRadius;
        nodeSize = node.size * (1 + force * 0.5);
        nodeOpacity = Math.min(1, node.opacity + force * 0.3);
      }

      // Draw node with main brand color
      ctx.fillStyle = `rgba(2, 191, 122, ${nodeOpacity})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
      ctx.fill();

      // Add glow effect for nodes near mouse
      if (mouseDistance < mouseInteractionRadius) {
        const glowRadius = nodeSize * 4;
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowRadius
        );
        
        gradient.addColorStop(0, `rgba(2, 191, 122, ${nodeOpacity * 0.4})`);
        gradient.addColorStop(1, 'rgba(2, 191, 122, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [mouseInteractionRadius, connectionDistance]);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [updateDimensions]);

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      initializeNodes();
    }
  }, [dimensions, initializeNodes]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  useEffect(() => {
    if (isInitialized && nodesRef.current.length > 0) {
      console.log('Starting animation with', nodesRef.current.length, 'nodes');
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
      
      {/* Network canvas */}
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

export default NetworkBackground;