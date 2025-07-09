import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface CursorFollowerProps {
  children: React.ReactNode;
}

const CursorFollower: React.FC<CursorFollowerProps> = ({ children }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  
  // Trail cursor с задержкой
  const trailX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const trailY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  // Optimized mouse move handler without throttling
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    setIsVisible(true);
  }, [mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);

  useEffect(() => {
    // Use event delegation instead of adding listeners to all elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, h1, h2, h3, [data-magnetic], .interactive-element')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, h1, h2, h3, [data-magnetic], .interactive-element')) {
        setIsHovering(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMoveThrottled);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mousemove', handleMouseMoveThrottled);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
    };
  }, [handleMouseMoveThrottled]);

  return (
    <>
      {children}
      
      {/* Main cursor */}
      {isVisible && (
        <motion.div
          className="fixed pointer-events-none z-50"
          style={{
            left: x,
            top: y,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: isHovering ? 1.5 : 1,
            opacity: isHovering ? 0.8 : 0.6,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-4 h-4 bg-stellar-glow rounded-full shadow-lg">
            <div className="absolute inset-0 bg-stellar-accent rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      )}

      {/* Trail cursor (полый круг) */}
      {isVisible && (
        <motion.div
          className="fixed pointer-events-none z-49"
          style={{
            left: trailX,
            top: trailY,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: isHovering ? 1.8 : 1.2,
            opacity: isHovering ? 0.6 : 0.4,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-8 h-8 border-2 border-stellar-accent/50 rounded-full"></div>
        </motion.div>
      )}
    </>
  );
};

export default CursorFollower;