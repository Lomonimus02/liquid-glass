import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, PlayCircle, Calendar, BarChart, AlertTriangle, BookOpen } from 'lucide-react';

interface StepIndicatorProps {
  steps: Array<{
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    duration: number;
    color: string;
  }>;
  activeStep: number;
  onStepClick: (step: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, activeStep, onStepClick }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + (100 / (steps[activeStep]?.duration || 3000)) * 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStep, steps]);

  const getStepIcon = (stepId: number) => {
    switch (stepId) {
      case 0:
        return <BookOpen className="w-6 h-6" />;
      case 1:
        return <BarChart className="w-6 h-6" />;
      case 2:
        return <AlertTriangle className="w-6 h-6" />;
      case 3:
        return <Calendar className="w-6 h-6" />;
      default:
        return <Circle className="w-6 h-6" />;
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < activeStep) return 'completed';
    if (stepIndex === activeStep) return 'active';
    return 'pending';
  };

  return (
    <div className="flex items-center justify-center gap-6 px-4 py-6 glass-card-supreme rounded-3xl">
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;
        
        return (
          <motion.div
            key={step.id}
            className="flex flex-col items-center gap-3 relative cursor-pointer"
            onClick={() => onStepClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Step circle with icon */}
            <div className="relative">
              <motion.div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-300 glass-card-ultra ${
                  isActive 
                    ? 'bg-stellar-primary/20 border-stellar-primary/50' 
                    : isCompleted 
                    ? 'bg-stellar-accent/20 border-stellar-accent/50' 
                    : 'bg-glass-secondary border-glass-border'
                }`}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  borderWidth: isActive ? 3 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {isCompleted ? (
                  <CheckCircle className="w-8 h-8 text-stellar-accent" />
                ) : (
                  <motion.div
                    className={`${
                      isActive 
                        ? 'text-stellar-primary' 
                        : 'text-text-secondary'
                    }`}
                    animate={{
                      rotate: isActive ? 360 : 0,
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: isActive ? Infinity : 0,
                      ease: "linear"
                    }}
                  >
                    {getStepIcon(step.id)}
                  </motion.div>
                )}
              </motion.div>

              {/* Progress ring for active step */}
              {isActive && (
                <motion.div
                  className="absolute -inset-2 rounded-full border-2 border-transparent"
                  style={{
                    background: `conic-gradient(from 0deg, ${step.color} ${progress}%, transparent ${progress}%)`,
                    borderRadius: '50%',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              )}

              {/* Glow effect for active step */}
              {isActive && (
                <motion.div
                  className="absolute -inset-4 rounded-full opacity-30"
                  style={{
                    background: `radial-gradient(circle, ${step.color}40 0%, transparent 70%)`,
                    filter: 'blur(15px)',
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </div>

            {/* Step info */}
            <div className="text-center max-w-[120px]">
              <motion.h4
                className={`text-sm font-semibold mb-1 ${
                  isActive 
                    ? 'text-stellar-primary' 
                    : isCompleted 
                    ? 'text-stellar-accent' 
                    : 'text-text-secondary'
                }`}
                animate={{
                  scale: isActive ? 1.05 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {step.title}
              </motion.h4>
              <p className="text-xs text-text-muted leading-tight">
                {step.description}
              </p>
            </div>

            {/* Connection line to next step */}
            {index < steps.length - 1 && (
              <motion.div
                className="absolute top-10 left-20 w-16 h-0.5 bg-gradient-to-r from-stellar-primary/30 to-stellar-accent/30"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isCompleted ? 1 : 0.3 }}
                transition={{ duration: 0.5 }}
                style={{ transformOrigin: 'left' }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default StepIndicator;