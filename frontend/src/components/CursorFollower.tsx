import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface CursorFollowerProps {
  children: React.ReactNode;
}

const CursorFollower: React.FC<CursorFollowerProps> = ({ children }) => {
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  
  const trailX = useSpring(mouseX, { damping: 25, stiffness: 100 });
  const trailY = useSpring(mouseY, { damping: 25, stiffness: 100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Add event listeners to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [data-magnetic]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {children}
      
      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
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

      {/* Cursor trail */}
      <motion.div
        ref={trailRef}
        className="fixed pointer-events-none z-49"
        style={{
          left: trailX,
          top: trailY,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-8 h-8 border-2 border-stellar-accent/30 rounded-full"></div>
      </motion.div>

      {/* Particle trail */}
      <motion.div
        className="fixed pointer-events-none z-48"
        style={{
          left: x,
          top: y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-stellar-glow/40 rounded-full"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
            }}
            style={{
              left: Math.random() * 20 - 10,
              top: Math.random() * 20 - 10,
            }}
          />
        ))}
      </motion.div>
    </>
  );
};

export default CursorFollower;