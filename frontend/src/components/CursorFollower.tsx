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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Добавляем слушатели только к кнопкам и ссылкам
    const interactiveElements = document.querySelectorAll('button, a');
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
      
      {/* Простой cursor с минимальным влиянием */}
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
            opacity: isHovering ? 0.8 : 0.3,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-3 h-3 bg-stellar-glow rounded-full"></div>
        </motion.div>
      )}
    </>
  );
};

export default CursorFollower;