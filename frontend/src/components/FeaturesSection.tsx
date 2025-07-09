// Файл: FeaturesSection.js (все в одном файле)

import {
  Calendar,
  Users,
  Shield,
  Clock,
  Brain,
  Sparkles
} from "lucide-react";
import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import ParticleSystem from './ParticleSystem';
import Interactive3DCard from './Interactive3DCard';
import SmoothReveal from './SmoothReveal';
import KineticTypography from './KineticTypography';
import MagneticElement from './MagneticElement';
import GestureElement from './GestureElement';

// --- 1. Импортируем ОБЕ анимации ---
import analyticsAnimationData from "./animations/Research (1).json"; 
import mobileAnimationData from "./animations/note (1).json";
import securityAnimationData from "./animations/lock.json";
import scheduleAnimationData from "./animations/calendar V3.json";
import clockAnimationData from "./animations/time.json"
import ideaAnimationData from "./animations/Learn More.json"
import multiAnimationData from "./animations/Staff.json"

// --- 2. Создаем "компонент-помощник" прямо здесь ---
// Этот маленький компонент будет нашим "умным" плеером для КАЖДОЙ иконки.
// Он содержит свою собственную, независимую логику управления.
const LottiePlayer = ({ animationData, isHovered, className }) => {
  const lottieRef = useRef(null);

  useEffect(() => {
    const lottieInstance = lottieRef.current;
    if (!lottieInstance) return;

    if (isHovered) {
      // Проигрываем всю анимацию от начала до конца, один раз
      lottieInstance.playSegments([0, lottieInstance.getDuration(true)], true);
    } else {
      // Сбрасываем на первый кадр и останавливаем
      lottieInstance.goToAndStop(0, true);
    }
  }, [isHovered, animationData]); // Эффект сработает, когда isHovered изменится

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      autoplay={false}
      loop={false}
      className={className}
    />
  );
};


// --- 3. Наш основной компонент FeaturesSection ---
// Обратите внимание, насколько он стал чище! Вся сложная логика ушла в LottiePlayer.
const FeaturesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const sectionRef = useRef(null);
  const scheduleCardRef = useRef(null);

  // Отслеживаем, когда секция в поле зрения
  const isInView = useInView(sectionRef, {
    once: false,
    margin: "-20% 0px -20% 0px"
  });

  // Состояния для этапов морфинг-анимации
  const [animationPhase, setAnimationPhase] = useState<'normal' | 'sticky' | 'fadeOut' | 'morphing'>('normal');

  // Более точное отслеживание позиции скролла для этапов анимации
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Этап 1: Нормальное состояние - секция полностью видна
        if (rect.top > -windowHeight * 0.2) {
          setAnimationPhase('normal');
        }
        // Этап 2: Sticky - карточка закрепляется на экране
        else if (rect.top > -windowHeight * 0.5) {
          setAnimationPhase('sticky');
        }
        // Этап 3: Fade out - другие карточки затухают
        else if (rect.bottom > windowHeight * 0.4) {
          setAnimationPhase('fadeOut');
        }
        // Этап 4: Морфинг - карточка готова к трансформации
        else {
          setAnimationPhase('morphing');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Вызываем сразу для инициализации
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "ИИ-помощник",
      description: "Интеллектуальная система анализа успеваемости и рекомендаций для каждого ученика",
      color: "text-stellar-primary",
      animationClass: "animate-pulse"
    },
    {
      isLottie: true,
      animationData: scheduleAnimationData,
      title: "Автоматическое расписание",
      description: "Революционная функция автоматического составления расписания с учетом всех ограничений",
      color: "text-stellar-accent",
      highlight: false,
      iconClassName: "w-10 h-10"
    },
    {
      isLottie: true,
      animationData: analyticsAnimationData,
      title: "Продвинутая аналитика",
      description: "Детальная статистика и отчеты в реальном времени для принятия обоснованных решений",
      iconClassName: "w-13 h-13"
    },
    {
      isLottie: true,
      animationData: multiAnimationData,
      title: "Многоуровневый доступ",
      description: "Гибкая система ролей для учителей, учеников, родителей и администрации",
      iconClassName: "w-13 h-13"
    },
    {
      isLottie: true,
      animationData: mobileAnimationData,
      title: "Мобильное приложение",
      description: "Полнофункциональное мобильное приложение для всех участников образовательного процесса",
      iconClassName: "w-10 h-10",
    },
    {
      isLottie: true,
      animationData: securityAnimationData,
      title: "Безопасность данных",
      description: "Современные методы шифрования и защиты персональных данных учащихся",
      iconClassName: "w-10 h-10",
    },
    {
      isLottie: true,
      animationData: clockAnimationData,
      title: "Экономия времени",
      description: "Автоматизация рутинных задач позволяет сосредоточиться на образовательном процессе",
      iconClassName: "w-10 h-10"
    },
    {
      isLottie: true,
      animationData: ideaAnimationData,
      title: "Инновационные решения",
      description: "Постоянное развитие и внедрение передовых технологий в образовательный процесс",
      iconClassName: "w-12 h-12"
    }
  ];

  const highlightedFeature = features.find(feature => feature.highlight);
  const nonHighlightedFeatures = features.filter(feature => !feature.highlight);

  return (
    <section 
      ref={sectionRef}
      className="py-20 px-4 relative overflow-hidden"
      style={{
        background: 'transparent'
      }}
    >
      {/* Particle system для features */}
      <ParticleSystem
        particleCount={40}
        colors={['rgba(2, 191, 122, 0.2)', 'rgba(2, 191, 122, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        speed={0.3}
        size={1}
        className="opacity-50"
      />

      <div className="max-w-7xl mx-auto">
        {/* Заголовок секции */}
        <SmoothReveal direction="up" delay={0.1}>
          <div className="text-center mb-16">
            <KineticTypography
              text="Возможности системы"
              className="text-4xl md:text-5xl font-bold text-gradient mb-6"
              animation="elastic"
              stagger={0.1}
            />
            <KineticTypography
              text="Stellar School предлагает полный спектр инструментов для современного образования"
              className="text-xl text-text-secondary max-w-3xl mx-auto"
              animation="wave"
              stagger={0.05}
            />
          </div>
        </SmoothReveal>

        {/* Основная сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <SmoothReveal 
              key={index}
              direction={index % 2 === 0 ? "left" : "right"}
              delay={index * 0.1}
              className="h-full"
            >
              <GestureElement
                className="h-full"
                onSwipeLeft={() => console.log(`Swiped left on ${feature.title}`)}
                onSwipeRight={() => console.log(`Swiped right on ${feature.title}`)}
              >
                <MagneticElement strength={0.1} className="h-full">
                  <Interactive3DCard
                    className="h-full"
                    glowColor={feature.color === "text-stellar-primary" ? "#02bf7a" : feature.color === "text-stellar-accent" ? "#1a8c5c" : "#0ea5e9"}
                    intensity={0.8}
                  >
                    <div 
                      className="flex flex-col h-full text-center relative z-10"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Иконка */}
                      <div className="mb-4 flex justify-center">
                        {feature.isLottie ? (
                          <LottiePlayer 
                            animationData={feature.animationData} 
                            isHovered={hoveredIndex === index}
                            className={feature.iconClassName || "w-12 h-12"}
                          />
                        ) : (
                          <motion.div
                            animate={hoveredIndex === index ? {
                              scale: [1, 1.2, 1],
                              rotate: [0, 10, 0]
                            } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            <feature.icon className={`w-12 h-12 ${feature.color || 'text-stellar-primary'}`} />
                          </motion.div>
                        )}
                      </div>

                      {/* Заголовок */}
                      <KineticTypography
                        text={feature.title}
                        className="text-lg font-semibold mb-3 text-text-primary"
                        animation="bounce"
                        stagger={0.05}
                      />

                      {/* Описание */}
                      <motion.p 
                        className="text-text-secondary text-sm leading-relaxed flex-grow"
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: hoveredIndex === index ? 1 : 0.7 }}
                        transition={{ duration: 0.3 }}
                      >
                        {feature.description}
                      </motion.p>

                      {/* Hover эффект */}
                      <AnimatePresence>
                        {hoveredIndex === index && (
                          <motion.div
                            className="absolute inset-0 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-stellar-primary/5 to-stellar-accent/5 rounded-3xl" />
                            
                            {/* Floating particles on hover */}
                            {[...Array(5)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-stellar-accent rounded-full"
                                style={{
                                  left: `${Math.random() * 100}%`,
                                  top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                  y: [0, -20, 0],
                                  opacity: [0, 1, 0],
                                  scale: [0, 1, 0],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                  ease: "easeInOut"
                                }}
                              />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Interactive3DCard>
                </MagneticElement>
              </GestureElement>
            </SmoothReveal>
          ))}
        </div>

        {/* Дополнительная информация */}
        <SmoothReveal direction="up" delay={0.5}>
          <div className="text-center mt-16">
            <Interactive3DCard 
              className="max-w-4xl mx-auto"
              glowColor="#02bf7a"
              intensity={0.6}
            >
              <div className="p-8">
                <KineticTypography
                  text="Готовы к революции в образовании?"
                  className="text-2xl font-bold text-gradient mb-4"
                  animation="wave"
                  stagger={0.08}
                />
                <motion.p 
                  className="text-text-secondary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  Stellar School объединяет все необходимые инструменты в одной интуитивно понятной системе, 
                  которая адаптируется под потребности вашего образовательного учреждения.
                </motion.p>
              </div>
            </Interactive3DCard>
          </div>
        </SmoothReveal>
      </div>
    </section>
  );
};

export default FeaturesSection;
        size={1}
        className="opacity-60"
      />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-stellar-accent/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-stellar-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-stellar-glow/3 rounded-full blur-2xl animate-pulse"></div>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-stellar-accent" />
            <span className="text-sm font-medium text-text-secondary">Возможности системы</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Почему выбирают</span>
            <br />
            <span className="text-text-primary">Stellar School?</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Наша платформа объединяет все необходимые инструменты для эффективного управления 
            образовательным процессом в едином, интуитивно понятном интерфейсе
          </p>
        </div>

        <AnimatePresence mode="wait">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const isScheduleCard = feature.title === "Автоматическое расписание";

              // ВРЕМЕННО ОТКЛЮЧЕНО: морфинг-эффекты для фокуса на sticky секции
              // if (isScheduleCard && (animationPhase === 'sticky' || animationPhase === 'fadeOut')) {
              //   return sticky card logic...
              // }

              return (
                <motion.div
                  key={index}
                  ref={isScheduleCard ? scheduleCardRef : null}
                  // ВРЕМЕННО ОТКЛЮЧЕНО: layoutId для фокуса на sticky секции
                  // layoutId={isScheduleCard ? "schedule-card" : undefined}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`glass-card-enhanced perspective-card group hover:scale-105 transition-all duration-300 relative overflow-hidden glass-shimmer-effect glass-floating-particles ${
                    feature.highlight ? 'ring-2 ring-stellar-accent/30 glow-effect-enhanced' : ''
                  } ${hoveredIndex === index ? 'glass-card-glow-animation' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  animate={{
                    // ВРЕМЕННО ОТКЛЮЧЕНО: анимации затухания для фокуса на sticky секции
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    y: 50
                  }}
                  transition={{
                    duration: animationPhase === 'sticky' ? 0.8 :
                             animationPhase === 'fadeOut' ? 0.6 :
                             animationPhase === 'morphing' ? 1.2 : 0.4,
                    ease: animationPhase === 'morphing' ? "easeInOut" : "easeOut",
                    layout: {
                      duration: animationPhase === 'morphing' ? 1.5 : 1.0,
                      ease: "easeInOut"
                    }
                  }}
                >
                <div className="relative z-10 perspective-card-content">
                  <div className={`w-12 h-12 rounded-2xl bg-glass-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.highlight ? 'animate-pulse-glow' : ''}`}>
                    {/* --- 4. Используем наш "компонент-помощник" --- */}
                    {feature.isLottie ? (
                      <LottiePlayer
                        animationData={feature.animationData}
                        isHovered={hoveredIndex === index}
                        className={feature.iconClassName}
                      />
                    ) : (
                      <IconComponent
                        className={`${feature.iconClassName || 'w-6 h-6'} ${feature.color || ''} ${feature.animationClass || ''} group-hover:animate-none`}
                      />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-3 group-hover:text-stellar-accent transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
        
        <div className="mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="glass-card-floating perspective-card text-center group hover:scale-105 transition-transform glass-shimmer-effect">
              <div className="perspective-card-content p-8">
                <div className="text-5xl font-bold text-gradient-animated mb-4">-70%</div>
                <div className="text-xl font-semibold text-text-primary mb-2">Времени на администрирование</div>
                <div className="text-text-secondary">Автоматизация рутинных задач освобождает время для обучения</div>
              </div>
            </div>
            <div className="glass-card-floating perspective-card text-center group hover:scale-105 transition-transform glass-shimmer-effect">
              <div className="perspective-card-content p-8">
                <div className="text-5xl font-bold text-gradient-animated mb-4">+40%</div>
                <div className="text-xl font-semibold text-text-primary mb-2">Вовлеченность учеников</div>
                <div className="text-text-secondary">Интерактивные инструменты повышают интерес к обучению</div>
              </div>
            </div>
            <div className="glass-card-floating perspective-card text-center group hover:scale-105 transition-transform glass-shimmer-effect">
              <div className="perspective-card-content p-8">
                <div className="text-5xl font-bold text-gradient-animated mb-4">100%</div>
                <div className="text-xl font-semibold text-text-primary mb-2">Прозрачность процесса</div>
                <div className="text-text-secondary">Полная видимость успеваемости для всех участников</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;