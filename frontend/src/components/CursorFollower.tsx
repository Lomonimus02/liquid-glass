import React, { useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Добавляем слушатели к интерактивным элементам
    const interactiveElements = document.querySelectorAll('button, a, h1, h2, h3, p, span, [data-magnetic]');
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