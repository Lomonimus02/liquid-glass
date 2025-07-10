// Файл: FeaturesSection.js (все в одном файле)

import {
  Calendar,
  Users,
  Shield,
  Clock,
  Brain,
  Sparkles,
  ChevronLeft,
  ChevronRight
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
import { useIsMobile } from '@/hooks/use-mobile';

// --- 1. Импортируем ОБЕ анимации ---
import analyticsAnimationData from "./animations/Research (1).json"; 
import mobileAnimationData from "./animations/note (1).json";
import securityAnimationData from "./animations/lock.json";
import scheduleAnimationData from "./animations/calendar V3.json";
import clockAnimationData from "./animations/time.json"
import ideaAnimationData from "./animations/Learn More.json"
import multiAnimationData from "./animations/Staff.json"

// Обновленный LottiePlayer с автопроигрыванием для мобильных
const LottiePlayer = React.memo(({ animationData, isHovered, className, autoplay = false, isMobile = false }) => {
  const lottieRef = useRef(null);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);

  useEffect(() => {
    const lottieInstance = lottieRef.current;
    if (!lottieInstance) return;

    if (isMobile && autoplay && !hasPlayedOnce) {
      // На мобильном проигрываем один раз автоматически при показе
      lottieInstance.playSegments([0, lottieInstance.getDuration(true)], true);
      setHasPlayedOnce(true);
    } else if (!isMobile && isHovered) {
      // На десктопе проигрываем при hover
      lottieInstance.playSegments([0, lottieInstance.getDuration(true)], true);
    } else if (!isMobile && !isHovered) {
      // На десктопе сбрасываем на первый кадр
      lottieInstance.goToAndStop(0, true);
    }
  }, [isHovered, autoplay, isMobile, hasPlayedOnce]);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      autoplay={false}
      loop={false}
      className={className}
    />
  );
});

LottiePlayer.displayName = 'LottiePlayer';


const FeaturesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef(null);
  const scheduleCardRef = useRef(null);
  const isMobile = useIsMobile();

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
      title: "Облачное хранилище",
      description: "Храните Ваши личные документы и файлы в под защитой в бесплатном хранилище объемом 3 гигабайта",
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

  // Мобильная карусель - переключение слайдов
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % features.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
  };

  // Автопереключение для мобильной карусели
  useEffect(() => {
    if (isMobile && isInView) {
      const interval = setInterval(nextSlide, 4000); // Переключение каждые 4 секунды
      return () => clearInterval(interval);
    }
  }, [isMobile, isInView]);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 px-4 relative z-20"
      style={{
        background: 'transparent'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Заголовок секции */}
        <SmoothReveal direction="up" delay={0.1}>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient mb-4 md:mb-6 px-4">
              Преимущества системы
            </h2>
            <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto px-4">
              Stellar School предлагает полный спектр инструментов для современного образования
            </p>
          </div>
        </SmoothReveal>

        {/* Основная сетка карточек - мобильная карусель */}
        {isMobile ? (
          // Мобильная карусель
          <div className="relative">
            <div className="overflow-hidden">
              <motion.div 
                className="flex"
                animate={{ x: `${-currentSlide * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {features.map((feature, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <Interactive3DCard
                      className="h-full min-h-[320px]"
                      glowColor={feature.color === "text-stellar-primary" ? "#02bf7a" : feature.color === "text-stellar-accent" ? "#1a8c5c" : "#0ea5e9"}
                      intensity={0.8}
                      disableGlowOnMobile={true}
                    >
                      <div className="flex flex-col h-full text-center relative z-10 interactive-element p-6">
                        {/* Иконка */}
                        <div className="mb-4 flex justify-center">
                          {feature.isLottie ? (
                            <LottiePlayer 
                              animationData={feature.animationData} 
                              isHovered={false}
                              autoplay={true}
                              isMobile={true}
                              className={`${feature.iconClassName || "w-16 h-16"}`}
                            />
                          ) : (
                            <motion.div
                              animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, 0]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <feature.icon className={`w-16 h-16 ${feature.color || 'text-stellar-primary'}`} />
                            </motion.div>
                          )}
                        </div>

                        {/* Заголовок */}
                        <h3 className="text-xl font-semibold mb-3 text-text-primary leading-tight">
                          {feature.title}
                        </h3>

                        {/* Описание */}
                        <p className="text-text-secondary text-base leading-relaxed flex-grow">
                          {feature.description}
                        </p>
                      </div>
                    </Interactive3DCard>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Индикаторы карусели - улучшенная видимость */}
            <div className="flex justify-center mt-6 space-x-3">
              {features.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`relative transition-all duration-300 ${
                    currentSlide === index 
                      ? 'w-8 h-3' 
                      : 'w-3 h-3'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? 'bg-stellar-accent shadow-lg shadow-stellar-accent/50' 
                      : 'bg-stellar-primary/40 border-2 border-stellar-accent/60 hover:bg-stellar-accent/50'
                  }`} />
                  {/* Дополнительная обводка для лучшей видимости */}
                  <div className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
                    currentSlide === index 
                      ? 'border-white/20' 
                      : 'border-white/40'
                  }`} />
                </motion.button>
              ))}
            </div>

            {/* Кнопки навигации - красивые стрелки */}
            <motion.button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 w-14 h-14 rounded-full backdrop-blur-xl border border-white/30 flex items-center justify-center text-white transition-all duration-300 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(2, 191, 122, 0.2), rgba(2, 191, 122, 0.1))',
                boxShadow: '0 8px 32px rgba(2, 191, 122, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
              initial={{
                x: -16,
                y: '-50%'
              }}
              whileHover={{ 
                scale: 1.05,
                x: -16,
                y: '-50%',
                background: 'linear-gradient(135deg, rgba(2, 191, 122, 0.3), rgba(2, 191, 122, 0.2))'
              }}
              whileTap={{ 
                scale: 0.95,
                x: -16,
                y: '-50%'
              }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="w-6 h-6 text-white drop-shadow-md" />
            </motion.button>
            <motion.button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 w-14 h-14 rounded-full backdrop-blur-xl border border-white/30 flex items-center justify-center text-white transition-all duration-300 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(2, 191, 122, 0.2), rgba(2, 191, 122, 0.1))',
                boxShadow: '0 8px 32px rgba(2, 191, 122, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
              initial={{
                x: 16,
                y: '-50%'
              }}
              whileHover={{ 
                scale: 1.05,
                x: 16,
                y: '-50%',
                background: 'linear-gradient(135deg, rgba(2, 191, 122, 0.3), rgba(2, 191, 122, 0.2))'
              }}
              whileTap={{ 
                scale: 0.95,
                x: 16,
                y: '-50%'
              }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-6 h-6 text-white drop-shadow-md" />
            </motion.button>
          </div>
        ) : (
          // Десктопная сетка
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
                      className="h-full min-h-[280px] sm:min-h-[320px]"
                      glowColor={feature.color === "text-stellar-primary" ? "#02bf7a" : feature.color === "text-stellar-accent" ? "#1a8c5c" : "#0ea5e9"}
                      intensity={0.8}
                      disableGlowOnMobile={true}
                      onHoverChange={(isHovered) => {
                        if (isHovered) {
                          setHoveredIndex(index);
                        } else {
                          setHoveredIndex(null);
                        }
                      }}
                      externalHover={hoveredIndex === index}
                    >
                      <div 
                        className="flex flex-col h-full text-center relative z-10 interactive-element p-4 md:p-6"
                      >
                        {/* Иконка */}
                        <div className="mb-4 flex justify-center">
                          {feature.isLottie ? (
                            <LottiePlayer 
                              animationData={feature.animationData} 
                              isHovered={hoveredIndex === index}
                              autoplay={false}
                              isMobile={false}
                              className={`${feature.iconClassName || "w-12 h-12"} md:w-14 md:h-14`}
                            />
                          ) : (
                            <motion.div
                              animate={hoveredIndex === index ? {
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, 0]
                              } : {}}
                              transition={{ duration: 0.2 }}
                            >
                              <feature.icon className={`w-12 h-12 md:w-14 md:h-14 ${feature.color || 'text-stellar-primary'}`} />
                            </motion.div>
                          )}
                        </div>

                        {/* Заголовок */}
                        <h3 className="text-lg md:text-xl font-semibold mb-3 text-text-primary leading-tight">
                          {feature.title}
                        </h3>

                        {/* Описание */}
                        <motion.p 
                          className="text-text-secondary text-sm md:text-base leading-relaxed flex-grow"
                          initial={{ opacity: 0.7 }}
                          animate={{ opacity: hoveredIndex === index ? 1 : 0.7 }}
                          transition={{ duration: 0.2 }}
                        >
                          {feature.description}
                        </motion.p>

                        {/* Simplified Hover эффект */}
                        <AnimatePresence>
                          {hoveredIndex === index && (
                            <motion.div
                              className="absolute inset-0 pointer-events-none"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-stellar-primary/5 to-stellar-accent/5 rounded-3xl" />
                              
                              {/* Reduced floating particles on hover */}
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="absolute w-1 h-1 bg-stellar-accent rounded-full hidden md:block"
                                  style={{
                                    left: `${20 + i * 30}%`,
                                    top: `${20 + i * 25}%`,
                                  }}
                                  animate={{
                                    y: [0, -15, 0],
                                    opacity: [0, 0.8, 0],
                                    scale: [0, 1, 0],
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.3,
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
        )}

        {/* Дополнительная информация */}
        <SmoothReveal direction="up" delay={0.5}>
          <div className="text-center mt-12 md:mt-16">
            <Interactive3DCard 
              className="max-w-4xl mx-auto"
              glowColor="#02bf7a"
              intensity={0.6}
            >
              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-gradient mb-4">
                  Готовы к революции в образовании?
                </h3>
                <motion.p 
                  className="text-text-secondary text-sm md:text-base"
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