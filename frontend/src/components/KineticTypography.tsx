import React, { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface KineticTypographyProps {
  text: string;
  className?: string;
  animation?: 'wave' | 'bounce' | 'slide' | 'rotate' | 'elastic';
  stagger?: number;
  duration?: number;
}

const KineticTypography: React.FC<KineticTypographyProps> = ({ 
  text, 
  className = '', 
  animation = 'wave',
  stagger = 0.1,
  duration = 0.6
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  const getAnimationVariants = (animation: string) => {
    switch (animation) {
      case 'wave':
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration, ease: "easeOut" }
          }
        };
      case 'bounce':
        return {
          hidden: { opacity: 0, scale: 0 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { 
              duration, 
              ease: "easeOut",
              type: "spring",
              stiffness: 200
            }
          }
        };
      case 'slide':
        return {
          hidden: { opacity: 0, x: -20 },
          visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration, ease: "easeOut" }
          }
        };
      case 'rotate':
        return {
          hidden: { opacity: 0, rotateY: 90 },
          visible: { 
            opacity: 1, 
            rotateY: 0,
            transition: { duration, ease: "easeOut" }
          }
        };
      case 'elastic':
        return {
          hidden: { opacity: 0, scale: 0.5, rotateZ: -10 },
          visible: { 
            opacity: 1, 
            scale: 1, 
            rotateZ: 0,
            transition: { 
              duration, 
              ease: "easeOut",
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          }
        };
      default:
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration, ease: "easeOut" }
          }
        };
    }
  };

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const variants = getAnimationVariants(animation);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: 0.1
      }
    }
  };

  // Split text into words and letters
  const words = text.split(' ');

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="inline-block"
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block mr-2">
            {word.split('').map((letter, letterIndex) => (
              <motion.span
                key={`${wordIndex}-${letterIndex}`}
                variants={variants}
                className="inline-block"
                whileHover={{
                  scale: 1.2,
                  color: '#02bf7a',
                  transition: { duration: 0.2 }
                }}
                onHoverEnd={{
                  scale: 1,
                  color: 'inherit',
                  transition: { duration: 0.2 }
                }}
                animate={{
                  scale: 1,
                  transition: { duration: 0.2 }
                }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default KineticTypography;