import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, Clock, Zap, Sparkles } from 'lucide-react';
import { scheduleSteps } from './data';
import Stage0UnorganizedData from './Stage0UnorganizedData';
import Stage1Analysis from './Stage1Analysis';
import Stage2ConflictResolution from './Stage2ConflictResolution';
import Stage3FinalSchedule from './Stage3FinalSchedule';
import StepIndicator from './StepIndicator';

const ScheduleAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [autoPlay, setAutoPlay] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Parallax transforms
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const descriptionY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const animationY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const startAnimation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const scheduleNextStep = (currentStep: number) => {
      const currentDuration = scheduleSteps[currentStep]?.duration || 3000;
      intervalRef.current = setTimeout(() => {
        setActiveStep(prev => {
          const nextStep = (prev + 1) % scheduleSteps.length;
          scheduleNextStep(nextStep);
          return nextStep;
        });
      }, currentDuration);
    };

    scheduleNextStep(activeStep);
  }, [activeStep]);

  const stopAnimation = useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Auto-play управление
  useEffect(() => {
    if (autoPlay) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => stopAnimation();
  }, [autoPlay, startAnimation, stopAnimation]);

  const renderStageComponent = () => {
    switch (activeStep) {
      case 0:
        return <Stage0UnorganizedData />;
      case 1:
        return <Stage1Analysis />;
      case 2:
        return <Stage2ConflictResolution />;
      case 3:
        return <Stage3FinalSchedule />;
      default:
        return <Stage0UnorganizedData />;
    }
  };

  return (
    <div ref={containerRef} className="py-16 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div 
            className="inline-flex items-center gap-2 glass-card-supreme px-4 py-2 mb-6"
            style={{ y: titleY }}
          >
            <Calendar className="w-5 h-5 text-stellar-accent" />
            <span className="text-sm font-medium text-text-secondary">
              Автоматическое расписание
            </span>
            <Sparkles className="w-4 h-4 text-stellar-glow" />
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gradient mb-6"
            style={{ y: titleY }}
          >
            Революция в составлении расписания
          </motion.h2>
          
          <motion.div 
            className="glass-card-enhanced p-4 inline-block"
            style={{ y: descriptionY }}
          >
            <p className="text-lg text-text-secondary max-w-3xl">
              Наблюдайте, как ИИ автоматически создает оптимальное расписание с учетом всех ограничений
            </p>
          </motion.div>
        </div>

        <motion.div style={{ y: animationY }}>
          <div className="flex items-center justify-center mb-8">
            <div ref={animationRef} className="glass-card-supreme p-8 min-h-[500px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-stellar-primary/5 to-stellar-accent/5 rounded-3xl" />
              <div className="relative z-10">
                {renderStageComponent()}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-8">
            <StepIndicator 
              steps={scheduleSteps}
              activeStep={activeStep}
              onStepClick={setActiveStep}
            />
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className="px-6 py-3 rounded-2xl glass-card-enhanced border border-stellar-accent/30 text-stellar-accent hover:bg-stellar-accent/10 transition-all duration-300"
            >
              {autoPlay ? 'Остановить' : 'Запустить'}
            </button>
            
            <button
              onClick={() => setActiveStep((prev) => (prev + 1) % scheduleSteps.length)}
              className="px-6 py-3 rounded-2xl glass-card-enhanced border border-stellar-primary/30 text-stellar-primary hover:bg-stellar-primary/10 transition-all duration-300"
            >
              Следующий этап
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScheduleAnimation;