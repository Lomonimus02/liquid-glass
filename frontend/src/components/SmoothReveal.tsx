import React, { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface SmoothRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

const SmoothReveal: React.FC<SmoothRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  className = '',
  threshold = 0.1,
  once = true
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { threshold, once });
  const controls = useAnimation();

  const getInitialPosition = (direction: string) => {
    switch (direction) {
      case 'up':
        return { y: 60, opacity: 0 };
      case 'down':
        return { y: -60, opacity: 0 };
      case 'left':
        return { x: 60, opacity: 0 };
      case 'right':
        return { x: -60, opacity: 0 };
      default:
        return { y: 60, opacity: 0 };
    }
  };

  const getFinalPosition = () => {
    return { x: 0, y: 0, opacity: 1 };
  };

  useEffect(() => {
    if (isInView) {
      controls.start({
        ...getFinalPosition(),
        transition: {
          duration,
          delay,
          ease: "easeOut",
          type: "spring",
          stiffness: 100,
          damping: 20
        }
      });
    } else if (!once) {
      controls.start(getInitialPosition(direction));
    }
  }, [isInView, controls, direction, delay, duration, once]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={getInitialPosition(direction)}
      animate={controls}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
    >
      {children}
    </motion.div>
  );
};

export default SmoothReveal;