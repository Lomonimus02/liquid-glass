import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import MagneticElement from './MagneticElement';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [lastScrollY, setLastScrollY] = useState(0);

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

  // Animation configurations for different scroll behaviors
  const floatingIslandAnimation = {
    // Water droplet detachment effect (scrolling down)
    down: {
      y: 4, // Reduced from 8px to 4px for smaller gap
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 25,
        duration: 0.8,
      }
    },
    // Sticky attachment effect (scrolling up to top)  
    up: {
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.4,
      }
    },
    // Transparent state
    transparent: {
      y: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 20,
        duration: 0.6,
      }
    }
  };

  // Get current animation based on scroll state and direction
  const getCurrentAnimation = () => {
    const currentScrollY = window.scrollY;
    
    console.log('Animation Debug:', {
      isScrolled,
      currentScrollY,
      scrollDirection,
      atTop: currentScrollY <= 10
    });
    
    if (!isScrolled) {
      console.log('Animation State: transparent');
      return floatingIslandAnimation.transparent;
    }
    
    // Only snap to top when actually at the top of the page (within 10px)
    if (scrollDirection === 'up' && currentScrollY <= 10) {
      console.log('Animation State: back to transparent (at top)');
      return floatingIslandAnimation.transparent;
    }
    
    // When scrolling down or scrolling up but not at the top, maintain floating position
    console.log('Animation State: floating (down)');
    return floatingIslandAnimation.down;
  };

  return (
    <motion.nav 
      className={`fixed top-0 z-[9999] transition-all duration-300 ${
        isScrolled 
          ? 'mx-2 md:mx-4 frosted-glass shadow-lg' 
          : 'left-0 right-0 bg-transparent'
      }`}
      animate={getCurrentAnimation()}
      initial={{ y: 0 }}
    >
      <div className={`${isScrolled ? 'max-w-7xl mx-auto px-4' : 'max-w-7xl mx-auto px-4'}`}>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => scrollToSection('hero')}
          >
            <div 
              className="w-8 h-8 rounded-lg bg-stellar-primary flex items-center justify-center"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient-animated">Stellar School</span>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-text-secondary hover:text-stellar-accent transition-colors relative group"
            >
              Возможности
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stellar-accent group-hover:w-full transition-all duration-300"></span>
            </button>
            
            <button 
              onClick={() => scrollToSection('schedule')}
              className="text-text-secondary hover:text-stellar-accent transition-colors relative group"
            >
              Расписание
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stellar-accent group-hover:w-full transition-all duration-300"></span>
            </button>
            
            <button 
              onClick={() => scrollToSection('analytics')}
              className="text-text-secondary hover:text-stellar-accent transition-colors relative group"
            >
              Аналитика
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stellar-accent group-hover:w-full transition-all duration-300"></span>
            </button>
            
            <button 
              onClick={() => scrollToSection('ai-assistant')}
              className="text-text-secondary hover:text-stellar-accent transition-colors relative group"
            >
              ИИ-помощник
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stellar-accent group-hover:w-full transition-all duration-300"></span>
            </button>
            
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-text-secondary hover:text-stellar-accent transition-colors relative group"
            >
              Контакты
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stellar-accent group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              onClick={() => scrollToSection('contact')}
              className="glass-button text-white glass-shimmer-effect"
            >
              Попробовать
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg frosted-glass text-text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
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
    </motion.nav>
  );
};

export default Navigation;