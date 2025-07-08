import { Button } from "@/components/ui/button";
import { ArrowRight, Stars, Zap } from "lucide-react";
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import ParticleSystem from './ParticleSystem';

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const buttonY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden">
      {/* Particle system background */}
      <ParticleSystem
        particleCount={60}
        colors={['rgba(2, 191, 122, 0.3)', 'rgba(2, 191, 122, 0.2)', 'rgba(255, 255, 255, 0.1)']}
        speed={0.5}
        size={1.5}
        className="opacity-70"
      />

      {/* Floating elements with parallax */}
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
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

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div 
          className="inline-flex items-center gap-2 glass-card-enhanced px-6 py-3 mb-8 glass-shimmer-effect"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Stars className="w-5 h-5 text-stellar-accent" />
          <span className="text-sm font-medium text-text-secondary">
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
            <Zap className="w-4 h-4 text-stellar-glow" />
          </motion.div>
        </motion.div>

        {/* Main heading with parallax */}
        <motion.h1 
          className="text-6xl md:text-8xl font-bold mb-6"
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
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-xl md:text-2xl text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed"
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
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-lg text-text-secondary">
            Начните сотрудничать с нами и получите
          </p>
        </motion.div>

        {/* CTA Button with parallax */}
        <motion.div 
          className="flex justify-center items-center"
          style={{ y: buttonY }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              className="glass-button px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary hover:bg-primary/90 group glass-shimmer-effect"
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
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div 
            className="glass-card-enhanced perspective-card text-center group"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="perspective-card-content p-6">
              <div className="text-3xl font-bold text-gradient mb-2">🎨</div>
              <div className="text-text-secondary">Персонализированный интерфейс для Вашей школы</div>
            </div>
          </motion.div>

          <motion.div 
            className="glass-card-enhanced perspective-card text-center group"
            whileHover={{ scale: 1.05, rotateY: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="perspective-card-content p-6">
              <div className="text-3xl font-bold text-gradient mb-2">🎯</div>
              <div className="text-text-secondary">Бесплатная демонстрация</div>
            </div>
          </motion.div>

          <motion.div 
            className="glass-card-enhanced perspective-card text-center group"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="perspective-card-content p-6">
              <div className="text-3xl font-bold text-gradient mb-2">24/7</div>
              <div className="text-text-secondary">Техническая поддержка</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
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