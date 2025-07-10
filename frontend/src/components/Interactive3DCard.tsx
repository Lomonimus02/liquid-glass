import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Interactive3DCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: number;
  onHoverChange?: (isHovered: boolean) => void;
  externalHover?: boolean;
}

const Interactive3DCard: React.FC<Interactive3DCardProps> = ({
  children,
  className = '',
  glowColor = '#02bf7a',
  intensity = 1,
  onHoverChange,
  externalHover = false
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  // Use external hover state if provided, otherwise use internal state
  const effectiveHoverState = externalHover !== undefined ? externalHover : isHovering;
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 300 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const scale = useSpring(1, springConfig);
  const glowIntensity = useSpring(0, springConfig);

  // Update scale and glow based on effective hover state
  useEffect(() => {
    if (effectiveHoverState) {
      scale.set(1.08);
      glowIntensity.set(1);
    } else {
      scale.set(1);
      glowIntensity.set(0);
    }
  }, [effectiveHoverState, scale, glowIntensity]);

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
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    mouseX.set(0);
    mouseY.set(0);
    onHoverChange?.(false);
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
          background: `radial-gradient(circle at center, ${glowColor}30 0%, transparent 70%)`, // Уменьшенная интенсивность
          filter: 'blur(20px)', // Уменьшенный blur
          transform: 'translateZ(-1px)',
          opacity: glowIntensity,
          borderRadius: '1.5rem',
          WebkitBorderRadius: '1.5rem',
          MozBorderRadius: '1.5rem',
        }}
        animate={{
          opacity: effectiveHoverState ? 0.4 : 0, // Уменьшенная прозрачность свечения
          scale: effectiveHoverState ? 1.05 : 1, // Уменьшенное масштабирование
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      
      {/* Main card */}
      <motion.div
        className="relative backdrop-blur-3xl border rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(230, 255, 245, 0.06)', // Consistent green tint like other glass cards
          borderColor: 'rgba(2, 191, 122, 0.12)', // Green border consistent with glass-card-enhanced
          backdropFilter: 'blur(50px) saturate(1.6) brightness(1.1)', // Consistent with glass-card-enhanced
          boxShadow: effectiveHoverState
            ? `0 20px 60px rgba(2, 191, 122, 0.25), 0 0 0 1px ${glowColor}25, inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(2, 191, 122, 0.08)`
            : '0 8px 32px rgba(2, 191, 122, 0.15), 0 16px 64px rgba(2, 191, 122, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(2, 191, 122, 0.08)',
          transform: 'translateZ(0)',
          borderRadius: '1.5rem',
          WebkitBorderRadius: '1.5rem',
          MozBorderRadius: '1.5rem',
        }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-0"
          style={{
            background: `linear-gradient(135deg, transparent 0%, ${glowColor}30 50%, transparent 100%)`,
            transform: 'translateX(-100%) skewX(-15deg)',
          }}
          animate={{
            transform: effectiveHoverState
              ? 'translateX(200%) skewX(-15deg)'
              : 'translateX(-100%) skewX(-15deg)',
            opacity: effectiveHoverState ? 0.8 : 0, // Увеличенная прозрачность
          }}
          transition={{ duration: 0.6, ease: "easeOut" }} // Быстрее анимация
        />
        
        {/* Content */}
        <div 
          className="relative z-10 p-6"
          style={{ transform: 'translateZ(20px)' }}
        >
          {children}
        </div>
        
        {/* Floating particles - Only show if NOT using external hover control */}
        {effectiveHoverState && !onHoverChange && (
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