import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface LiquidTransitionProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  intensity?: number;
}

const LiquidTransition: React.FC<LiquidTransitionProps> = ({
  children,
  className = '',
  color = '#02bf7a',
  intensity = 1
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100 * intensity, -100 * intensity]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        y,
        opacity,
        scale
      }}
    >
      {/* Liquid background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, ${color}20 0%, transparent 70%)`,
            transform: 'scale(1.5)',
          }}
          animate={{
            scale: [1.5, 1.8, 1.5],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Liquid waves */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{
              background: `linear-gradient(45deg, ${color}10 0%, transparent 50%, ${color}10 100%)`,
              clipPath: `polygon(0 ${20 + i * 10}%, 100% ${30 + i * 10}%, 100% ${50 + i * 10}%, 0 ${40 + i * 10}%)`,
            }}
            animate={{
              clipPath: [
                `polygon(0 ${20 + i * 10}%, 100% ${30 + i * 10}%, 100% ${50 + i * 10}%, 0 ${40 + i * 10}%)`,
                `polygon(0 ${30 + i * 10}%, 100% ${20 + i * 10}%, 100% ${40 + i * 10}%, 0 ${50 + i * 10}%)`,
                `polygon(0 ${20 + i * 10}%, 100% ${30 + i * 10}%, 100% ${50 + i * 10}%, 0 ${40 + i * 10}%)`
              ]
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default LiquidTransition;