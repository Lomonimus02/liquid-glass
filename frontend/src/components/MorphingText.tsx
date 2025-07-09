import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface MorphingTextProps {
  words: string[];
  className?: string;
  interval?: number;
}

const MorphingText: React.FC<MorphingTextProps> = ({ 
  words, 
  className = '', 
  interval = 3000 
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (!isInView) return;

    const timer = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval, isInView]);

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: [0, 1, 1, 0],
        scale: [0.8, 1.1, 1, 0.8],
        rotateX: [90, 0, 0, -90],
        transition: {
          duration: 0.8,
          ease: "easeInOut",
        }
      });
    }
  }, [currentWordIndex, controls, isInView]);

  const currentWord = words[currentWordIndex];
  const letters = currentWord.split('');

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        animate={controls}
        className="relative inline-block"
      >
        {letters.map((letter, index) => (
          <motion.span
            key={`${currentWordIndex}-${index}`}
            className="inline-block"
            initial={{ opacity: 0, y: 50, rotateX: 90 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              rotateX: 0,
              transition: {
                delay: index * 0.05,
                duration: 0.6,
                ease: "easeOut"
              }
            }}
            exit={{ 
              opacity: 0, 
              y: -50, 
              rotateX: -90,
              transition: {
                delay: index * 0.02,
                duration: 0.4
              }
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export default MorphingText;