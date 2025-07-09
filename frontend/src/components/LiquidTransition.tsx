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

  const y = useTransform(scrollYProgress, [0, 1], [50 * intensity, -50 * intensity]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        y,
        opacity
      }}
    >
      {/* Seamless background blending */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Плавный градиентный фон без резких краев */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at center top, ${color}08 0%, transparent 40%),
              radial-gradient(ellipse at center bottom, ${color}06 0%, transparent 40%),
              linear-gradient(to bottom, transparent 0%, ${color}03 20%, ${color}05 50%, ${color}03 80%, transparent 100%)
            `,
            filter: 'blur(2px)',
          }}
          animate={{
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Плавные волны без clip-path */}
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 200% 60% at 50% ${30 + i * 20}%, ${color}04 0%, transparent 60%),
                radial-gradient(ellipse 150% 40% at 50% ${60 + i * 15}%, ${color}02 0%, transparent 50%)
              `,
              filter: 'blur(1px)',
            }}
            animate={{
              transform: [
                `translateY(${i * 10}px) scale(1)`,
                `translateY(${-i * 10}px) scale(1.1)`,
                `translateY(${i * 10}px) scale(1)`
              ],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 4 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Content with seamless integration */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default LiquidTransition;