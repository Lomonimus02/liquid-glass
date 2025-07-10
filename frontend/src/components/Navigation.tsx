import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import MagneticElement from './MagneticElement';
import { useIsMobile } from '@/hooks/use-mobile';

// Animated Burger Menu Component
const AnimatedBurger = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => {
  return (
    <button
      className="md:hidden p-2 rounded-lg text-text-primary relative w-10 h-10 flex items-center justify-center"
      onClick={onClick}
      style={{
        background: 'rgba(230, 255, 245, 0.08)',
        border: '1px solid rgba(2, 191, 122, 0.15)',
        backdropFilter: 'blur(20px) saturate(1.2) brightness(1.1)',
      }}
    >
      <div className="w-6 h-5 flex flex-col justify-between items-center relative">
        {/* Top line */}
        <motion.span
          className="block h-0.5 w-6 bg-current absolute"
          style={{ top: isOpen ? '50%' : '0%' }}
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? '-50%' : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        
        {/* Middle line */}
        <motion.span
          className="block h-0.5 w-6 bg-current absolute"
          style={{ top: '50%', y: '-50%' }}
          animate={{
            opacity: isOpen ? 0 : 1,
            scaleX: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        
        {/* Bottom line */}
        <motion.span
          className="block h-0.5 w-6 bg-current absolute"
          style={{ bottom: isOpen ? '50%' : '0%' }}
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? '50%' : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </div>
    </button>
  );
};

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [lastScrollY, setLastScrollY] = useState(0);
  const isMobile = useIsMobile();
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрытие меню при клике вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      
      const newIsScrolled = currentScrollY > 50;
      setLastScrollY(currentScrollY);
      setIsScrolled(newIsScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  // Animation configurations for complete floating island transformation
  const floatingIslandAnimation = {
    // Attached state - full width, no glass effect
    attached: {
      y: 0,
      width: '100%',
      left: '50%',
      x: '-50%',
      marginLeft: 0,
      marginRight: 0,
      borderRadius: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 25,
        duration: 1.0,
      }
    },
    // Floating state - detached from edges with glass effect
    floating: {
      y: 8, // Increased for better visual separation
      width: 'calc(100% - 32px)', // Full width minus 16px margin on each side
      left: '50%',
      x: '-50%',
      marginLeft: 0,
      marginRight: 0,
      borderRadius: 24, // 1.5rem
      scale: 0.98, // Slight scale reduction for floating effect
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 20,
        duration: 1.2,
      }
    }
  };

  // Background opacity animation
  const getBackgroundOpacity = () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY <= 10) {
      return 0; // Completely transparent
    }
    
    if (currentScrollY > 50) {
      return 1; // Fully opaque frosted glass
    }
    
    // Gradual opacity increase between 10px and 50px
    return (currentScrollY - 10) / 40; // 0 to 1
  };

  // Get current animation based on scroll state
  const getCurrentAnimation = () => {
    const currentScrollY = window.scrollY;
    
    // Only return to attached state when at the very top (within 10px)
    if (currentScrollY <= 10) {
      return floatingIslandAnimation.attached;
    }
    
    // Float when scrolled past 50px
    if (currentScrollY > 50) {
      return floatingIslandAnimation.floating;
    }
    
    // Intermediate state between 10px and 50px - gradually transition
    const progress = (currentScrollY - 10) / 40; // 0 to 1
    return {
      y: progress * 8,
      width: progress < 1 ? '100%' : 'calc(100% - 32px)',
      left: '50%',
      x: '-50%',
      marginLeft: 0,
      marginRight: 0,
      borderRadius: progress * 24,
      scale: 1 - (progress * 0.02),
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        duration: 0.8,
      }
    };
  };

  return (
    <motion.nav 
      className="fixed top-0 z-[9999] w-full"
      animate={getCurrentAnimation()}
      initial={{ y: 0, width: '100%', left: '50%', x: '-50%', marginLeft: 0, marginRight: 0, borderRadius: 0, scale: 1 }}
      style={{
        // Remove CSS transitions since we're using framer-motion
        transition: 'none',
        maxWidth: '1280px', // max-w-7xl equivalent
      }}
    >
      {/* Animated background overlay - positioned behind content */}
      <motion.div 
        className="absolute inset-0 -z-10"
        animate={{ 
          opacity: getBackgroundOpacity(),
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 25,
            duration: 0.8,
          }
        }}
        initial={{ opacity: 0 }}
        style={{
          borderRadius: 'inherit',
          background: 'rgba(230, 255, 245, 0.08)',
          border: '1px solid rgba(2, 191, 122, 0.15)',
          backdropFilter: 'blur(100px) saturate(2) brightness(1.2)',
          boxShadow: `
            0 8px 32px rgba(2, 191, 122, 0.1),
            0 1px 2px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.5),
            inset 0 -1px 0 rgba(2, 191, 122, 0.1)
          `
        }}
      />
      
      {/* Content - no longer needs z-index since background is behind */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - адаптивный с улучшенной мобильной версией */}
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => scrollToSection('hero')}
            >
              <div 
                className={`rounded-lg bg-stellar-primary flex items-center justify-center transition-all duration-300 ${
                  isScrolled 
                    ? isMobile ? 'w-8 h-8' : 'w-7 h-7' // Больше на мобильном
                    : isMobile ? 'w-10 h-10' : 'w-8 h-8' // Больше на мобильном
                }`}
              >
                <Sparkles className={`text-white transition-all duration-300 ${
                  isScrolled 
                    ? isMobile ? 'w-5 h-5' : 'w-4 h-4'
                    : isMobile ? 'w-6 h-6' : 'w-5 h-5'
                }`} />
              </div>
              <span className={`font-bold text-gradient-animated transition-all duration-300 ${
                isScrolled 
                  ? isMobile ? 'text-xl' : 'text-lg lg:text-xl' // Больше на мобильном
                  : isMobile ? 'text-2xl' : 'text-xl lg:text-2xl' // Больше на мобильном
              }`}>
                {isMobile ? 'Stellar School' : 'Stellar School'}
              </span>
            </div>

            {/* Desktop navigation - adaptive for different screen sizes */}
            <div className={`hidden md:flex items-center transition-all duration-300 ${
              isScrolled 
                ? 'space-x-4 lg:space-x-6' // Reduced spacing when floating
                : 'space-x-6 lg:space-x-8' // Normal spacing when attached
            }`}>
              
              {/* Full navigation for large screens */}
              <div className="hidden lg:flex items-center space-x-6">
                <button 
                  onClick={() => scrollToSection('features')}
                  className={`text-text-secondary hover:text-stellar-accent transition-all duration-300 relative group ${
                    isScrolled 
                      ? 'text-sm py-1' // Smaller text when floating
                      : 'text-base py-2' // Normal size when attached
                  }`}
                >
                  Возможности
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stellar-accent group-hover:w-full transition-all duration-300"></span>
                </button>
                
                <button 
                  onClick={() => scrollToSection('schedule')}
                  className={`text-text-secondary hover:text-stellar-accent transition-all duration-300 relative group ${
                    isScrolled 
                      ? 'text-sm py-1'
                      : 'text-base py-2'
                  }`}
                >
                  Расписание
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stellar-accent group-hover:w-full transition-all duration-300"></span>
                </button>
                
                <button 
                  onClick={() => scrollToSection('analytics')}
                  className={`text-text-secondary hover:text-stellar-accent transition-all duration-300 relative group ${
                    isScrolled 
                      ? 'text-sm py-1'
                      : 'text-base py-2'
                  }`}
                >
                  Аналитика
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stellar-accent group-hover:w-full transition-all duration-300"></span>
                </button>
                
                <button 
                  onClick={() => scrollToSection('ai-assistant')}
                  className={`text-text-secondary hover:text-stellar-accent transition-all duration-300 relative group ${
                    isScrolled 
                      ? 'text-sm py-1'
                      : 'text-base py-2'
                  }`}
                >
                  ИИ-помощник
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stellar-accent group-hover:w-full transition-all duration-300"></span>
                </button>
                
                <button 
                  onClick={() => scrollToSection('contact')}
                  className={`text-text-secondary hover:text-stellar-accent transition-all duration-300 relative group ${
                    isScrolled 
                      ? 'text-sm py-1'
                      : 'text-base py-2'
                  }`}
                >
                  Контакты
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stellar-accent group-hover:w-full transition-all duration-300"></span>
                </button>
              </div>

              {/* Simplified navigation for tablets (md and below lg) */}
              <div className="flex lg:hidden items-center space-x-6">
                <button 
                  onClick={() => scrollToSection('features')}
                  className={`text-text-secondary hover:text-stellar-accent transition-all duration-300 relative group ${
                    isScrolled 
                      ? 'text-sm py-1'
                      : 'text-base py-2'
                  }`}
                >
                  Возможности
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stellar-accent group-hover:w-full transition-all duration-300"></span>
                </button>
                
                <button 
                  onClick={() => scrollToSection('schedule')}
                  className={`text-text-secondary hover:text-stellar-accent transition-all duration-300 relative group ${
                    isScrolled 
                      ? 'text-sm py-1'
                      : 'text-base py-2'
                  }`}
                >
                  Функции
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stellar-accent group-hover:w-full transition-all duration-300"></span>
                </button>
                
                <button 
                  onClick={() => scrollToSection('contact')}
                  className={`text-text-secondary hover:text-stellar-accent transition-all duration-300 relative group ${
                    isScrolled 
                      ? 'text-sm py-1'
                      : 'text-base py-2'
                  }`}
                >
                  Контакты
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stellar-accent group-hover:w-full transition-all duration-300"></span>
                </button>
              </div>
              
            </div>

            {/* CTA Button - adaptive */}
            <div className="hidden md:block">
              <Button 
                onClick={() => scrollToSection('contact')}
                className={`glass-button text-white glass-shimmer-effect transition-all duration-300 ${
                  isScrolled 
                    ? 'px-3 py-1.5 text-sm' // Smaller when floating
                    : 'px-4 py-2 text-base' // Normal when attached
                }`}
              >
                {isScrolled ? 'Попробовать' : 'Попробовать'}
              </Button>
            </div>

            {/* Animated Mobile menu button */}
            <AnimatedBurger 
              isOpen={isMobileMenuOpen} 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            />
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                className="md:hidden frosted-glass mt-2 p-4 space-y-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <button 
                  onClick={() => scrollToSection('features')}
                  className="block w-full text-left text-text-secondary hover:text-stellar-accent transition-colors py-2"
                >
                  Возможности
                </button>
                <button 
                  onClick={() => scrollToSection('schedule')}
                  className="block w-full text-left text-text-secondary hover:text-stellar-accent transition-colors py-2"
                >
                  Расписание
                </button>
                <button 
                  onClick={() => scrollToSection('analytics')}
                  className="block w-full text-left text-text-secondary hover:text-stellar-accent transition-colors py-2"
                >
                  Аналитика
                </button>
                <button 
                  onClick={() => scrollToSection('ai-assistant')}
                  className="block w-full text-left text-text-secondary hover:text-stellar-accent transition-colors py-2"
                >
                  ИИ-помощник
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="block w-full text-left text-text-secondary hover:text-stellar-accent transition-colors py-2"
                >
                  Контакты
                </button>
                <Button 
                  onClick={() => scrollToSection('contact')}
                  className="w-full glass-button text-white mt-4"
                >
                  Попробовать
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;