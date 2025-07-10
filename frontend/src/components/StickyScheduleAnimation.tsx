import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Zap, Sparkles } from 'lucide-react';
import { scheduleSteps } from './ScheduleAnimation/data';
import Stage0UnorganizedData from './ScheduleAnimation/Stage0UnorganizedData';
import Stage1Analysis from './ScheduleAnimation/Stage1Analysis';
import Stage2ConflictResolution from './ScheduleAnimation/Stage2ConflictResolution';
import Stage3FinalSchedule from './ScheduleAnimation/Stage3FinalSchedule';
import StepIndicator from './ScheduleAnimation/StepIndicator';
import { useIsMobile } from '@/hooks/use-mobile';

const StickyScheduleAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const isMobile = useIsMobile();

  // Состояния для этапов анимации (упрощенные)
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'fadeOut' | 'demo'>('idle');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: isMobile ? ["start end", "end start"] : ["start center", "end center"]
  });

  const isInView = useInView(containerRef, {
    once: false,
    margin: isMobile ? "-10% 0px -10% 0px" : "-20% 0px -20% 0px"
  });

  // Исправленная логика определения этапа анимации
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (!isInView) {
        setAnimationPhase('idle');
      } else if (progress > 0.3) {
        setAnimationPhase('demo'); // Демонстрация появляется когда прокрутили достаточно
      } else {
        setAnimationPhase('fadeOut');
      }
    });

    return unsubscribe;
  }, [scrollYProgress, isInView]);

  // Упрощенные и плавные анимации заголовка
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);
  const titleScale = useTransform(scrollYProgress, [0, 0.3, 1], [0.9, 1, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.5, 1], [20, 0, -10]); // Плавное движение вверх

  // Упрощенная анимация демонстрации - плавное появление
  const demoOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const demoScale = useTransform(scrollYProgress, [0.2, 0.5], [0.9, 1]);

  // Анимация иконок
  const iconScale = useTransform(scrollYProgress, [0.2, 0.8], [0.5, 1.2]);
  const iconRotate = useTransform(scrollYProgress, [0.2, 0.8], [0, 180]);
  const iconOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);

  // Исправленная логика анимации этапов
  const startAnimation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const scheduleNextStep = (currentStep: number) => {
      const currentDuration = scheduleSteps[currentStep]?.duration || 3000;
      intervalRef.current = setTimeout(() => {
        setActiveStep(prev => {
          const nextStep = (prev + 1) % scheduleSteps.length;
          scheduleNextStep(nextStep); // Рекурсивно планируем следующий этап
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

  // Управление демонстрацией - появляется после заголовка
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (!isInView) {
        setShowDemo(false);
        stopAnimation();
      } else if (progress > 0.4) {
        // Демонстрация появляется после того как заголовок уже виден
        setShowDemo(true);
        startAnimation();
      } else {
        setShowDemo(false);
        stopAnimation();
      }
    });

    return unsubscribe;
  }, [scrollYProgress, isInView, startAnimation, stopAnimation]);

  const renderCurrentStage = () => {
    switch (activeStep) {
      case 0:
        return <Stage0UnorganizedData />; // Анализ ограничений
      case 1:
        return <Stage1Analysis />; // Оптимизация времени
      case 2:
        return <Stage2ConflictResolution />; // Проверка конфликтов
      case 3:
        return <Stage3FinalSchedule />; // Готовое расписание
      default:
        return <Stage0UnorganizedData />;
    }
  };

  return (
    <div
      ref={containerRef}
      className={isMobile ? "relative w-full py-12" : "relative h-[200vh] w-full"}
    >
      {/* Мобильная версия - обычная секция */}
      {isMobile ? (
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Заголовок секции */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass-card-enhanced p-6 relative overflow-hidden">
              <div className="flex items-center justify-center gap-4 mb-4">
                <motion.div
                  className="w-12 h-12 bg-stellar-accent/20 rounded-full flex items-center justify-center"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-6 h-6 text-stellar-accent" />
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-bold text-gradient">
                  Автоматизированное расписание
                </h2>
              </div>

              <p className="text-lg text-text-secondary max-w-3xl mx-auto">
                Наблюдайте, как ИИ создает идеальное расписание за секунды
              </p>
            </div>
          </motion.div>

          {/* Мобильная демонстрация - одна карточка с этапами внутри */}
          <motion.div
            className="glass-card p-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Этапы в верхней части карточки */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-stellar-accent" />
                Этапы создания расписания
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {scheduleSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                      activeStep === index
                        ? 'border-stellar-accent bg-stellar-accent/10'
                        : 'border-white/20 bg-white/5'
                    }`}
                    onClick={() => setActiveStep(index)}
                    animate={{
                      scale: activeStep === index ? 1.02 : 1,
                      opacity: activeStep === index ? 1 : 0.7
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center">
                      <div className={`text-lg mb-1 ${
                        activeStep === index ? 'text-stellar-accent' : 'text-text-secondary'
                      }`}>
                        {step.icon}
                      </div>
                      <h4 className="text-sm font-semibold text-text-primary leading-tight">
                        {step.title}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Визуализация этапа */}
            <div className="min-h-[300px] relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {renderCurrentStage()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      ) : (
        // Десктопная версия - sticky контейнер
        <div
          ref={stickyRef}
          className="sticky left-0 w-full flex items-start justify-center bg-transparent z-20 overflow-visible"
          style={{
            top: '80px',
            height: 'calc(100vh - 80px)',
            paddingTop: '20px'
          }}
        >
        <div className="relative w-full max-w-7xl mx-auto px-4">
          {/* Заголовок секции - морфинг временно отключен */}
          <motion.div
            // ВРЕМЕННО ОТКЛЮЧЕНО: layoutId="schedule-card"
            className="text-center relative mb-8"
            style={{
              opacity: titleOpacity,
              scale: titleScale,
              y: titleY, // Плавное движение по вертикали
            }}
            initial={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "16px",
              padding: "24px"
            }}
            animate={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(2, 191, 122, 0.3)",
              borderRadius: "24px",
              padding: "32px"
            }}
            transition={{
              layout: {
                duration: animationPhase === 'morphing' ? 1.5 : 1.0,
                ease: "easeInOut",
                delay: animationPhase === 'morphing' ? 0.2 : 0
              },
              background: {
                duration: 1.4,
                ease: "easeInOut",
                delay: animationPhase === 'morphing' ? 0.3 : 0
              },
              border: {
                duration: 1.4,
                ease: "easeInOut",
                delay: animationPhase === 'morphing' ? 0.3 : 0
              }
            }}
          >
            {/* Заголовок без растекания (временно упрощено) */}
            <motion.div
              className="relative"
            >
              <motion.div
                className="flex items-center justify-center gap-4 mb-4"
                initial={{ flexDirection: "column" }}
                animate={{ flexDirection: "row" }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {/* Иконка Lottie */}
                <motion.div
                  className="w-16 h-16"
                  initial={{ scale: 1 }}
                  animate={{
                    scale: animationPhase === 'demo' ? 1.3 : 1.2,
                    rotate: animationPhase === 'demo' ? 360 : 0
                  }}
                  transition={{
                    duration: animationPhase === 'demo' ? 1.2 : 0.6,
                    delay: 0.5,
                    ease: "easeInOut"
                  }}
                >
                  <motion.div
                    className="w-full h-full bg-stellar-accent/20 rounded-full flex items-center justify-center"
                    animate={{
                      background: animationPhase === 'demo' ?
                        "rgba(2, 191, 122, 0.3)" : "rgba(2, 191, 122, 0.2)"
                    }}
                    transition={{ duration: 0.8 }}
                  >
                    <Sparkles className="w-8 h-8 text-stellar-accent" />
                  </motion.div>
                </motion.div>

                <motion.h2
                  className="text-4xl md:text-6xl font-bold text-gradient"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  Автоматизированное расписание
                </motion.h2>
              </motion.div>

              <motion.p
                className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Наблюдайте, как ИИ создает идеальное расписание за секунды
              </motion.p>
            </motion.div>

            {/* Анимированные иконки вокруг заголовка */}
            <motion.div
              className="absolute -top-8 -left-12"
              style={{
                scale: iconScale,
                rotate: iconRotate,
                opacity: iconOpacity,
              }}
            >
              <Calendar className="w-8 h-8 text-stellar-accent" />
            </motion.div>

            <motion.div
              className="absolute -top-4 -right-16"
              style={{
                scale: iconScale,
                rotate: iconRotate,
                opacity: iconOpacity,
              }}
            >
              <Clock className="w-6 h-6 text-stellar-primary" />
            </motion.div>

            <motion.div
              className="absolute -bottom-8 left-1/4"
              style={{
                scale: iconScale,
                rotate: iconRotate,
                opacity: iconOpacity,
              }}
            >
              <Zap className="w-6 h-6 text-stellar-glow" />
            </motion.div>
          </motion.div>

          {/* Демонстрация этапов - автоматическое проявление */}
          <AnimatePresence>
            {showDemo && (
              <motion.div
                className="mt-12"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: 1.2,
                    ease: "easeOut",
                    delay: 0.3 // Появляется после заголовка
                  }
                }}
                exit={{
                  opacity: 0,
                  y: 30,
                  scale: 0.95,
                  transition: {
                    duration: 0.5,
                    ease: "easeIn"
                  }
                }}
              >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Левая часть - анимация этапа */}
              <div className="relative">
                <div className="glass-card p-8 min-h-[500px] relative overflow-hidden">
                  {renderCurrentStage()}
                </div>
              </div>

              {/* Правая часть - индикатор этапов */}
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-6 h-6 text-stellar-accent" />
                    <h3 className="text-xl font-semibold text-text-primary">
                      Этапы создания расписания
                    </h3>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }} // Быстрее и меньше задержка
                  >
                    <StepIndicator
                      steps={scheduleSteps}
                      activeStep={activeStep}
                      onStepChange={setActiveStep}
                    />
                  </motion.div>
                </div>
              </div>
              </div>
            </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
      )}
    </div>
  );
};

export default StickyScheduleAnimation;
