import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Interactive3DCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: number;
}

const Interactive3DCard: React.FC<Interactive3DCardProps> = ({
  children,
  className = '',
  glowColor = '#02bf7a',
  intensity = 1
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 300 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const scale = useSpring(1, springConfig);
  const glowIntensity = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    
    mouseX.set(x * intensity);
    mouseY.set(y * intensity);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    scale.set(1.05);
    glowIntensity.set(1);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
    glowIntensity.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative cursor-pointer ${className}`}
      style={{
        scale,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0"
        style={{
          background: `radial-gradient(circle at center, ${glowColor}40 0%, transparent 70%)`,
          filter: 'blur(20px)',
          transform: 'translateZ(-1px)',
          opacity: glowIntensity,
        }}
        animate={{
          opacity: isHovering ? 0.6 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Main card */}
      <motion.div
        className={`relative backdrop-blur-3xl border rounded-3xl overflow-hidden ${className.includes('frosted-glass') ? '' : 'glass-card-enhanced'}`}
        style={{
          background: className.includes('frosted-glass') ? undefined : 'rgba(255, 255, 255, 0.03)',
          borderColor: className.includes('frosted-glass') ? undefined : 'rgba(255, 255, 255, 0.1)',
          backdropFilter: className.includes('frosted-glass') ? undefined : 'blur(60px) saturate(1.8) brightness(1.15)',
          boxShadow: className.includes('frosted-glass') ? undefined : (isHovering 
            ? `0 20px 60px rgba(2, 191, 122, 0.3), 0 0 0 1px ${glowColor}30, inset 0 1px 0 rgba(255, 255, 255, 0.4)`
            : '0 8px 32px rgba(2, 191, 122, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)'),
          transform: 'translateZ(0)',
        }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-0"
          style={{
            background: `linear-gradient(135deg, transparent 0%, ${glowColor}20 50%, transparent 100%)`,
            transform: 'translateX(-100%) skewX(-15deg)',
          }}
          animate={{
            transform: isHovering 
              ? 'translateX(200%) skewX(-15deg)' 
              : 'translateX(-100%) skewX(-15deg)',
            opacity: isHovering ? 0.6 : 0,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        
        {/* Content */}
        <div 
          className="relative z-10 p-6"
          style={{ transform: 'translateZ(20px)' }}
        >
          {children}
        </div>
        
        {/* Floating particles */}
        {isHovering && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: glowColor,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Interactive3DCard;