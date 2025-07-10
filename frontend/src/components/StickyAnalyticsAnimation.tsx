import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, Activity, Target, Zap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const StickyAnalyticsAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const isInView = useInView(containerRef, {
    once: false,
    margin: "-20% 0px -20% 0px"
  });

  // Анимации для заголовка
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);
  const titleScale = useTransform(scrollYProgress, [0, 0.3, 1], [0.9, 1, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.5, 1], [20, 0, -10]);

  // Анимации для демонстрации
  const demoOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const demoScale = useTransform(scrollYProgress, [0.2, 0.5], [0.9, 1]);

  // Анимации для иконок
  const iconScale = useTransform(scrollYProgress, [0.2, 0.8], [0.5, 1.2]);
  const iconRotate = useTransform(scrollYProgress, [0.2, 0.8], [0, 360]);
  const iconOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);

  // Этапы анализа данных
  const analyticsStages = [
    {
      id: 0,
      title: "Сбор данных",
      description: "Агрегация информации из всех источников",
      duration: 3000,
      icon: Activity,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      id: 1,
      title: "Обработка данных",
      description: "ИИ анализирует паттерны и тенденции",
      duration: 3500,
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/20"
    },
    {
      id: 2,
      title: "Генерация отчетов",
      description: "Создание интерактивных диаграмм и графиков",
      duration: 3000,
      icon: BarChart3,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20"
    },
    {
      id: 3,
      title: "Аналитические инсайты",
      description: "Получение готовых рекомендаций и прогнозов",
      duration: 4000,
      icon: Target,
      color: "text-stellar-accent",
      bgColor: "bg-stellar-accent/20"
    }
  ];

  const startAnimation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const scheduleNextStage = (currentStage: number) => {
      const currentDuration = analyticsStages[currentStage]?.duration || 3000;
      intervalRef.current = setTimeout(() => {
        setActiveStage(prev => {
          const nextStage = (prev + 1) % analyticsStages.length;
          scheduleNextStage(nextStage);
          return nextStage;
        });
      }, currentDuration);
    };

    scheduleNextStage(activeStage);
  }, [activeStage]);

  const stopAnimation = useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (!isInView) {
        setShowDemo(false);
        stopAnimation();
      } else if (progress > 0.4) {
        setShowDemo(true);
        startAnimation();
      } else {
        setShowDemo(false);
        stopAnimation();
      }
    });

    return unsubscribe;
  }, [scrollYProgress, isInView, startAnimation, stopAnimation]);

  // Компонент для отображения этапа анализа
  const AnalyticsStageRenderer = ({ stage }: { stage: typeof analyticsStages[0] }) => {
    const IconComponent = stage.icon;
    
    return (
      <motion.div
        className="relative w-full h-full flex flex-col items-center justify-center p-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Центральная иконка */}
        <motion.div
          className={`w-32 h-32 rounded-full ${stage.bgColor} flex items-center justify-center mb-8 relative`}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <IconComponent className={`w-16 h-16 ${stage.color}`} />
          
          {/* Анимированное кольцо */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-stellar-accent/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Анимированные точки данных */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-stellar-accent rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
              y: [0, -20, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Анимированные графики */}
        {stage.id === 2 && (
          <motion.div
            className="absolute bottom-8 left-8 right-8 flex justify-between items-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="bg-stellar-accent/60 rounded-t-lg"
                style={{
                  width: '12%',
                  height: `${20 + Math.random() * 60}%`
                }}
                animate={{
                  scaleY: [0.5, 1, 0.8, 1],
                  opacity: [0.4, 0.8, 0.6, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Текстовая информация */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-text-primary mb-2">{stage.title}</h3>
          <p className="text-text-secondary">{stage.description}</p>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[200vh] w-full"
    >
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
          {/* Заголовок секции */}
          <motion.div
            className="text-center relative mb-8"
            style={{
              opacity: titleOpacity,
              scale: titleScale,
              y: titleY,
            }}
          >
            <motion.div
              className="glass-card-enhanced p-8 relative overflow-hidden"
              animate={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(25px)",
                border: "1px solid rgba(2, 191, 122, 0.4)",
                boxShadow: "0 8px 32px rgba(2, 191, 122, 0.2), 0 16px 64px rgba(2, 191, 122, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.7)"
              }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            >
              <motion.div
                className="flex items-center justify-center gap-4 mb-4"
                initial={{ flexDirection: "column" }}
                animate={{ flexDirection: "row" }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <motion.div
                  className="w-16 h-16 bg-stellar-accent/20 rounded-full flex items-center justify-center"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <BarChart3 className="w-8 h-8 text-stellar-accent" />
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
                  Продвинутая аналитика
                </motion.h2>
              </motion.div>

              <motion.p
                className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Наблюдайте, как система превращает данные в ценные инсайты
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
              <PieChart className="w-8 h-8 text-purple-400" />
            </motion.div>

            <motion.div
              className="absolute -top-4 -right-16"
              style={{
                scale: iconScale,
                rotate: iconRotate,
                opacity: iconOpacity,
              }}
            >
              <TrendingUp className="w-6 h-6 text-green-400" />
            </motion.div>

            <motion.div
              className="absolute -bottom-8 left-1/4"
              style={{
                scale: iconScale,
                rotate: iconRotate,
                opacity: iconOpacity,
              }}
            >
              <Target className="w-6 h-6 text-stellar-accent" />
            </motion.div>
          </motion.div>

          {/* Демонстрация этапов аналитики */}
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
                    delay: 0.3
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
                    <div className="glass-card-enhanced p-8 min-h-[500px] relative overflow-hidden">
                      <AnimatePresence mode="wait">
                        <AnalyticsStageRenderer
                          key={activeStage}
                          stage={analyticsStages[activeStage]}
                        />
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Правая часть - индикатор этапов */}
                  <div className="space-y-6">
                    <div className="glass-card-enhanced p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Zap className="w-6 h-6 text-stellar-accent" />
                        <h3 className="text-xl font-semibold text-text-primary">
                          Этапы анализа данных
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {analyticsStages.map((stage, index) => (
                          <motion.div
                            key={stage.id}
                            className={`p-4 rounded-2xl border transition-all duration-300 ${
                              activeStage === index
                                ? 'border-stellar-accent bg-stellar-accent/10'
                                : 'border-white/20 bg-white/5'
                            }`}
                            animate={{
                              scale: activeStage === index ? 1.05 : 1,
                              opacity: activeStage === index ? 1 : 0.7
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex items-center gap-3">
                              <motion.div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  activeStage === index ? stage.bgColor : 'bg-white/10'
                                }`}
                                animate={{
                                  scale: activeStage === index ? 1.1 : 1
                                }}
                                transition={{ duration: 0.3 }}
                              >
                                <stage.icon className={`w-5 h-5 ${
                                  activeStage === index ? stage.color : 'text-white/60'
                                }`} />
                              </motion.div>
                              <div>
                                <h4 className="font-semibold text-text-primary">
                                  {stage.title}
                                </h4>
                                <p className="text-sm text-text-secondary">
                                  {stage.description}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StickyAnalyticsAnimation;