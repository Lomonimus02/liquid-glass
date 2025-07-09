import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import MagneticElement from './MagneticElement';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'frosted-glass shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => scrollToSection('hero')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className="w-8 h-8 rounded-lg bg-stellar-primary flex items-center justify-center"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-gradient-animated">Stellar School</span>
          </motion.div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.button 
              onClick={() => scrollToSection('features')}
              className="text-text-secondary hover:text-stellar-accent transition-colors relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Возможности
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stellar-accent group-hover:w-full transition-all duration-300"></span>
            </motion.button>
            
            <motion.button 
              onClick={() => scrollToSection('schedule')}
              className="text-text-secondary hover:text-stellar-accent transition-colors relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Расписание
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stellar-accent group-hover:w-full transition-all duration-300"></span>
            </motion.button>
            
            <motion.button 
              onClick={() => scrollToSection('analytics')}
              className="text-text-secondary hover:text-stellar-accent transition-colors relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Аналитика
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stellar-accent group-hover:w-full transition-all duration-300"></span>
            </motion.button>
            
            <motion.button 
              onClick={() => scrollToSection('ai-assistant')}
              className="text-text-secondary hover:text-stellar-accent transition-colors relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ИИ-помощник
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stellar-accent group-hover:w-full transition-all duration-300"></span>
            </motion.button>
            
            <motion.button 
              onClick={() => scrollToSection('contact')}
              className="text-text-secondary hover:text-stellar-accent transition-colors relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Контакты
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stellar-accent group-hover:w-full transition-all duration-300"></span>
            </motion.button>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => scrollToSection('contact')}
                className="glass-button text-white glass-shimmer-effect"
              >
                Попробовать
              </Button>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden p-2 rounded-lg frosted-glass text-text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
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
              <motion.button 
                onClick={() => scrollToSection('features')}
                className="block w-full text-left text-text-secondary hover:text-stellar-accent transition-colors py-2"
                whileHover={{ x: 5 }}
              >
                Возможности
              </motion.button>
              <motion.button 
                onClick={() => scrollToSection('schedule')}
                className="block w-full text-left text-text-secondary hover:text-stellar-accent transition-colors py-2"
                whileHover={{ x: 5 }}
              >
                Расписание
              </motion.button>
              <motion.button 
                onClick={() => scrollToSection('analytics')}
                className="block w-full text-left text-text-secondary hover:text-stellar-accent transition-colors py-2"
                whileHover={{ x: 5 }}
              >
                Аналитика
              </motion.button>
              <motion.button 
                onClick={() => scrollToSection('ai-assistant')}
                className="block w-full text-left text-text-secondary hover:text-stellar-accent transition-colors py-2"
                whileHover={{ x: 5 }}
              >
                ИИ-помощник
              </motion.button>
              <motion.button 
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left text-text-secondary hover:text-stellar-accent transition-colors py-2"
                whileHover={{ x: 5 }}
              >
                Контакты
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={() => scrollToSection('contact')}
                  className="w-full frosted-glass bg-primary hover:bg-primary/90 text-primary-foreground mt-4"
                >
                  Попробовать
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;