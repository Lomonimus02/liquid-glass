import React, { useRef, useState } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';

interface GestureElementProps {
  children: React.ReactNode;
  className?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  dragThreshold?: number;
  returnToCenter?: boolean;
}

const GestureElement: React.FC<GestureElementProps> = ({
  children,
  className = '',
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  dragThreshold = 100,
  returnToCenter = true
}) => {
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | 'up' | 'down' | null>(null);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    
    const { offset, velocity } = info;
    const swipeThreshold = dragThreshold;
    const swipeVelocity = 500;

    // Determine swipe direction
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      // Horizontal swipe
      if (offset.x > swipeThreshold || velocity.x > swipeVelocity) {
        setDragDirection('right');
        onSwipeRight?.();
        if (!returnToCenter) {
          controls.start({ x: window.innerWidth, opacity: 0 });
          return;
        }
      } else if (offset.x < -swipeThreshold || velocity.x < -swipeVelocity) {
        setDragDirection('left');
        onSwipeLeft?.();
        if (!returnToCenter) {
          controls.start({ x: -window.innerWidth, opacity: 0 });
          return;
        }
      }
    } else {
      // Vertical swipe
      if (offset.y > swipeThreshold || velocity.y > swipeVelocity) {
        setDragDirection('down');
        onSwipeDown?.();
        if (!returnToCenter) {
          controls.start({ y: window.innerHeight, opacity: 0 });
          return;
        }
      } else if (offset.y < -swipeThreshold || velocity.y < -swipeVelocity) {
        setDragDirection('up');
        onSwipeUp?.();
        if (!returnToCenter) {
          controls.start({ y: -window.innerHeight, opacity: 0 });
          return;
        }
      }
    }

    // Return to center if configured
    if (returnToCenter) {
      controls.start({ 
        x: 0, 
        y: 0, 
        rotate: 0,
        scale: 1,
        transition: { 
          type: "spring", 
          stiffness: 200, 
          damping: 20 
        }
      });
    }
    
    setDragDirection(null);
  };

  const handleDrag = (event: any, info: PanInfo) => {
    const { offset } = info;
    
    // Add rotation based on horizontal movement
    const rotation = offset.x * 0.1;
    controls.start({
      rotate: rotation,
      transition: { duration: 0 }
    });
  };

  return (
    <motion.div
      className={`relative ${className} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrag={handleDrag}
      animate={controls}
      whileDrag={{ 
        scale: 1.05,
        zIndex: 1000,
        transition: { duration: 0.2 }
      }}
      style={{
        touchAction: 'none',
      }}
    >
      {/* Drag indicators */}
      {isDragging && (
        <>
          <motion.div
            className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-stellar-accent rounded-full flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-white text-xs">←</span>
          </motion.div>
          <motion.div
            className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-stellar-accent rounded-full flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-white text-xs">→</span>
          </motion.div>
        </>
      )}
      
      {/* Swipe direction indicator */}
      {dragDirection && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <div className="bg-stellar-accent text-white px-4 py-2 rounded-full text-sm font-medium">
            {dragDirection === 'left' && '← Swipe Left'}
            {dragDirection === 'right' && 'Swipe Right →'}
            {dragDirection === 'up' && '↑ Swipe Up'}
            {dragDirection === 'down' && '↓ Swipe Down'}
          </div>
        </motion.div>
      )}
      
      {children}
    </motion.div>
  );
};

export default GestureElement;