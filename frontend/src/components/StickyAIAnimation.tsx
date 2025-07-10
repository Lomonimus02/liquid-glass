import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Brain, Cpu, Network, Lightbulb, Zap, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const StickyAIAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: isMobile ? ["start end", "end start"] : ["start center", "end center"]
  });

  const isInView = useInView(containerRef, {
    once: false,
    margin: isMobile ? "-10% 0px -10% 0px" : "-20% 0px -20% 0px"
  });

  // Анимации для заголовка
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);
  const titleScale = useTransform(scrollYProgress, [0, 0.3, 1], [0.9, 1, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.5, 1], [20, 0, -10]);

  // Анимации для иконок
  const iconScale = useTransform(scrollYProgress, [0.2, 0.8], [0.5, 1.2]);
  const iconRotate = useTransform(scrollYProgress, [0.2, 0.8], [0, 360]);
  const iconOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);

  // Этапы работы ИИ
  const aiStages = [
    {
      id: 0,
      title: "Сбор информации",
      description: "ИИ анализирует данные об учениках и их успеваемости",
      duration: 3500,
      icon: Brain,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      neuralPattern: "data-collection"
    },
    {
      id: 1,
      title: "Обработка алгоритмами",
      description: "Нейронные сети обрабатывают паттерны обучения",
      duration: 4000,
      icon: Cpu,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      neuralPattern: "processing"
    },
    {
      id: 2,
      title: "Генерация инсайтов",
      description: "Создание персональных рекомендаций",
      duration: 3000,
      icon: Lightbulb,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      neuralPattern: "insights"
    },
    {
      id: 3,
      title: "Адаптивное обучение",
      description: "Система адаптируется к потребностям каждого ученика",
      duration: 4500,
      icon: Network,
      color: "text-stellar-accent",
      bgColor: "bg-stellar-accent/20",
      neuralPattern: "adaptation"
    }
  ];

  const startAnimation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const scheduleNextStage = (currentStage: number) => {
      const currentDuration = aiStages[currentStage]?.duration || 3000;
      intervalRef.current = setTimeout(() => {
        setActiveStage(prev => {
          const nextStage = (prev + 1) % aiStages.length;
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

  // Компонент для отображения нейронной сети
  const NeuralNetworkRenderer = ({ stage }: { stage: typeof aiStages[0] }) => {
    const IconComponent = stage.icon;
    
    return (
      <motion.div
        className="relative w-full h-full flex flex-col items-center justify-center p-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Центральный мозг */}
        <motion.div
          className={`w-32 h-32 rounded-full ${stage.bgColor} flex items-center justify-center mb-8 relative`}
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <IconComponent className={`w-16 h-16 ${stage.color}`} />
          
          {/* Пульсирующие кольца */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-stellar-accent/20"
              animate={{
                scale: [1, 1.3 + i * 0.2, 1],
                opacity: [0.6, 0.2, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Нейронные связи */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {/* Узлы нейронной сети */}
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * 360;
            const radius = 120 + Math.random() * 80;
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;
            
            return (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  background: `linear-gradient(135deg, ${stage.color.replace('text-', '')}, rgba(2, 191, 122, 0.8))`
                }}
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            );
          })}

          {/* Анимированные связи */}
          {stage.neuralPattern === 'processing' && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.line
                  key={i}
                  x1="50%"
                  y1="50%"
                  x2={`${50 + Math.cos(i * 45 * Math.PI / 180) * 30}%`}
                  y2={`${50 + Math.sin(i * 45 * Math.PI / 180) * 30}%`}
                  stroke="rgba(2, 191, 122, 0.4)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </svg>
          )}
        </motion.div>

        {/* Импульсы данных */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-stellar-accent rounded-full"
            style={{
              left: `${25 + Math.random() * 50}%`,
              top: `${25 + Math.random() * 50}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 2, 0.5],
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Анимированные данные для этапа обработки */}
        {stage.neuralPattern === 'data-collection' && (
          <motion.div
            className="absolute top-8 left-8 right-8 bottom-8 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, -20, 0],
                  y: [0, -30, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1.5, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Текстовая информация */}
        <motion.div
          className="text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-text-primary mb-2">{stage.title}</h3>
          <p className="text-text-secondary">{stage.description}</p>
        </motion.div>

        {/* Индикатор загрузки для этапа обработки */}
        {stage.neuralPattern === 'processing' && (
          <motion.div
            className="absolute bottom-8 left-8 right-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="bg-white/10 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-400 to-stellar-accent rounded-full"
                animate={{
                  width: ["0%", "100%"],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={isMobile ? "relative w-full py-20" : "relative h-[200vh] w-full"}
    >
      {/* Мобильная версия - обычная секция */}
      {isMobile ? (
        <div className="max-w-7xl mx-auto px-4">
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
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Brain className="w-6 h-6 text-stellar-accent" />
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-bold text-gradient">
                  ИИ-помощник
                </h2>
              </div>

              <p className="text-lg text-text-secondary max-w-3xl mx-auto">
                Смотрите, как искусственный интеллект персонализирует обучение
              </p>
            </div>
          </motion.div>

          {/* Мобильная демонстрация - одна карточка с этапами внутри */}
          <motion.div
            className="glass-card-enhanced p-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Этапы в верхней части карточки */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-stellar-accent" />
                Этапы работы ИИ
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {aiStages.map((stage, index) => (
                  <motion.div
                    key={stage.id}
                    className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                      activeStage === index
                        ? 'border-stellar-accent bg-stellar-accent/10'
                        : 'border-white/20 bg-white/5'
                    }`}
                    onClick={() => setActiveStage(index)}
                    animate={{
                      scale: activeStage === index ? 1.02 : 1,
                      opacity: activeStage === index ? 1 : 0.7
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center">
                      <motion.div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                          activeStage === index ? stage.bgColor : 'bg-white/10'
                        }`}
                        animate={{
                          scale: activeStage === index ? 1.1 : 1
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <stage.icon className={`w-4 h-4 ${
                          activeStage === index ? stage.color : 'text-white/60'
                        }`} />
                      </motion.div>
                      <h4 className="text-sm font-semibold text-text-primary leading-tight">
                        {stage.title}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Визуализация этапа */}
            <div className="min-h-[300px] relative">
              <AnimatePresence mode="wait">
                <NeuralNetworkRenderer
                  key={activeStage}
                  stage={aiStages[activeStage]}
                />
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
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Brain className="w-8 h-8 text-stellar-accent" />
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
                    ИИ-помощник
                  </motion.h2>
                </motion.div>

                <motion.p
                  className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  Смотрите, как искусственный интеллект персонализирует обучение
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
                <Cpu className="w-8 h-8 text-purple-400" />
              </motion.div>

              <motion.div
                className="absolute -top-4 -right-16"
                style={{
                  scale: iconScale,
                  rotate: iconRotate,
                  opacity: iconOpacity,
                }}
              >
                <Network className="w-6 h-6 text-blue-400" />
              </motion.div>

              <motion.div
                className="absolute -bottom-8 left-1/4"
                style={{
                  scale: iconScale,
                  rotate: iconRotate,
                  opacity: iconOpacity,
                }}
              >
                <Lightbulb className="w-6 h-6 text-yellow-400" />
              </motion.div>
            </motion.div>

            {/* Демонстрация этапов ИИ */}
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
                          <NeuralNetworkRenderer
                            key={activeStage}
                            stage={aiStages[activeStage]}
                          />
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Правая часть - индикатор этапов */}
                    <div className="space-y-6">
                      <div className="glass-card-enhanced p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Sparkles className="w-6 h-6 text-stellar-accent" />
                          <h3 className="text-xl font-semibold text-text-primary">
                            Этапы работы ИИ
                          </h3>
                        </div>

                        <div className="space-y-4">
                          {aiStages.map((stage, index) => (
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
      )}
    </div>
  );
};

export default StickyAIAnimation;