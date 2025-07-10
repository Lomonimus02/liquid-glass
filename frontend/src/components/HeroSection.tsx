import { Button } from "@/components/ui/button";
import { ArrowRight, Stars, Zap } from "lucide-react";
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import ParticleSystem from './ParticleSystem';
import MorphingText from './MorphingText';
import KineticTypography from './KineticTypography';
import Interactive3DCard from './Interactive3DCard';
import MagneticElement from './MagneticElement';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const buttonY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-10 overflow-hidden z-20">
      {/* Particle system background - отключен на мобильном */}
      {!isMobile && (
        <div className="absolute inset-0 z-0">
          <ParticleSystem
            particleCount={60}
            colors={['rgba(2, 191, 122, 0.3)', 'rgba(2, 191, 122, 0.2)', 'rgba(255, 255, 255, 0.1)']}
            speed={0.5}
            size={1.5}
            className="opacity-70"
          />
        </div>
      )}

      {/* Floating elements with parallax - скрытые на мобильных */}
      {!isMobile && (
        <motion.div
          className="absolute inset-0 overflow-hidden pointer-events-none z-5"
          style={{ y: backgroundY }}
        >
        <motion.div 
          className="absolute top-20 left-10 w-20 h-20 rounded-full bg-stellar-glow/20 blur-xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-40 right-20 w-32 h-32 rounded-full bg-stellar-accent/15 blur-2xl"
          animate={{
            y: [0, -20, 0],
            x: [0, -15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute bottom-40 left-1/4 w-16 h-16 rounded-full bg-stellar-primary/25 blur-lg"
          animate={{
            y: [0, -25, 0],
            x: [0, 20, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </motion.div>

      <div className="max-w-6xl mx-auto text-center relative z-30">
        {/* Badge */}
        <MagneticElement>
          <motion.div 
            className="inline-flex items-center gap-2 frosted-glass px-4 md:px-6 py-2 md:py-3 mb-6 md:mb-8 glass-shimmer-effect"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Stars className="w-4 md:w-5 h-4 md:h-5 text-stellar-accent" />
            <span className="text-xs md:text-sm font-medium text-text-secondary">
              Инновационный электронный дневник
            </span>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Zap className="w-3 md:w-4 h-3 md:h-4 text-stellar-glow" />
            </motion.div>
          </motion.div>
        </MagneticElement>

        {/* Main heading with morphing text - мобильная оптимизация */}
        <motion.div 
          className={`font-bold mb-4 md:mb-6 ${isMobile ? 'text-4xl' : 'text-5xl md:text-6xl lg:text-8xl'}`}
          style={{ y: textY }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.span 
            className="text-gradient-animated"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            Stellar
          </motion.span>
          <br />
          <span className="text-text-primary">School</span>
        </motion.div>

        {/* Subtitle - мобильная оптимизация */}
        <motion.p 
          className={`text-text-secondary mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4 ${
            isMobile ? 'text-lg' : 'text-lg md:text-xl lg:text-2xl'
          }`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Революционная система управления образовательным процессом с 
          <motion.span 
            className="text-stellar-accent font-semibold"
            animate={{
              textShadow: [
                "0 0 0px rgba(2, 191, 122, 0.5)",
                "0 0 20px rgba(2, 191, 122, 0.8)",
                "0 0 0px rgba(2, 191, 122, 0.5)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {" "}автоматизированным составлением расписания
          </motion.span> 
          и интеллектуальной аналитикой
        </motion.p>

        {/* Подводка к карточкам */}
        <motion.div 
          className="text-center mb-6 md:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-base md:text-lg text-text-secondary">
            Начните сотрудничать с нами и получите
          </p>
        </motion.div>

        {/* CTA Button with magnetic effect - мобильная оптимизация */}
        <motion.div 
          className="flex justify-center items-center mb-12 md:mb-16"
          style={{ y: buttonY }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {isMobile ? (
            <Button 
              size="lg" 
              className="glass-button w-full max-w-sm h-14 text-lg font-semibold text-white group glass-shimmer-effect"
            >
              Начать использовать
              <motion.div
                className="ml-2"
                animate={{
                  x: [0, 5, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Button>
          ) : (
            <MagneticElement strength={0.2}>
              <Button 
                size="lg" 
                className="glass-button px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold text-white group glass-shimmer-effect"
              >
                Начать использовать
                <motion.div
                  className="ml-2"
                  animate={{
                    x: [0, 5, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
                </motion.div>
              </Button>
            </MagneticElement>
          )}
        </motion.div>

        {/* Stats with 3D Interactive Cards - мобильная адаптация */}
        <motion.div
          className={`gap-4 md:gap-8 ${isMobile ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-3'}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {isMobile ? (
            // Мобильная версия - вертикальный стек
            <>
              <Interactive3DCard className="h-full min-h-[120px]" glowColor="#02bf7a" intensity={0.8}>
                <div className="text-center p-4 flex flex-col justify-center h-full">
                  <div className="text-2xl font-bold text-gradient mb-2">🎨</div>
                  <div className="text-text-secondary text-base">Персонализированный интерфейс для Вашей школы</div>
                </div>
              </Interactive3DCard>

              <Interactive3DCard className="h-full min-h-[120px]" glowColor="#1a8c5c" intensity={0.9}>
                <div className="text-center p-4 flex flex-col justify-center h-full">
                  <div className="text-2xl font-bold text-gradient mb-2">🎯</div>
                  <div className="text-text-secondary text-base">Бесплатная демонстрация</div>
                </div>
              </Interactive3DCard>

              <Interactive3DCard className="h-full min-h-[120px]" glowColor="#0ea5e9" intensity={0.8}>
                <div className="text-center p-4 flex flex-col justify-center h-full">
                  <div className="text-2xl font-bold text-gradient mb-2">24/7</div>
                  <div className="text-text-secondary text-base">Техническая поддержка</div>
                </div>
              </Interactive3DCard>
            </>
          ) : (
            // Десктопная версия - сетка с MagneticElement
            <>
              <MagneticElement strength={0.1} className="h-full">
                <Interactive3DCard className="h-full min-h-[160px] md:min-h-[180px]" glowColor="#02bf7a" intensity={0.8}>
                  <div className="text-center p-4 md:p-6 flex flex-col justify-center h-full">
                    <div className="text-2xl md:text-3xl font-bold text-gradient mb-2">🎨</div>
                    <div className="text-text-secondary text-sm md:text-base">Персонализированный интерфейс для Вашей школы</div>
                  </div>
                </Interactive3DCard>
              </MagneticElement>

              <MagneticElement strength={0.1} className="h-full">
                <Interactive3DCard className="h-full min-h-[160px] md:min-h-[180px]" glowColor="#1a8c5c" intensity={0.9}>
                  <div className="text-center p-4 md:p-6 flex flex-col justify-center h-full">
                    <div className="text-2xl md:text-3xl font-bold text-gradient mb-2">🎯</div>
                    <div className="text-text-secondary text-sm md:text-base">Бесплатная демонстрация</div>
                  </div>
                </Interactive3DCard>
              </MagneticElement>

              <MagneticElement strength={0.1} className="h-full">
                <Interactive3DCard className="h-full min-h-[160px] md:min-h-[180px]" glowColor="#0ea5e9" intensity={0.8}>
                  <div className="text-center p-4 md:p-6 flex flex-col justify-center h-full">
                    <div className="text-2xl md:text-3xl font-bold text-gradient mb-2">24/7</div>
                    <div className="text-text-secondary text-sm md:text-base">Техническая поддержка</div>
                  </div>
                </Interactive3DCard>
              </MagneticElement>
            </>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator - скрыт на мобильном */}
      {!isMobile && (
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
        <div className="w-6 h-10 border-2 border-stellar-accent/50 rounded-full flex justify-center">
          <motion.div 
            className="w-1 h-3 bg-stellar-accent rounded-full mt-2"
            animate={{
              y: [0, 12, 0],
              opacity: [1, 0.3, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;