import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";

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
      isScrolled ? 'backdrop-blur-xl shadow-lg' : 'bg-transparent'
    }`} style={{
      background: isScrolled ? 'rgba(230, 255, 245, 0.8)' : 'transparent'
    }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-8 h-8 rounded-lg bg-stellar-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Stellar School</span>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-text-secondary hover:text-stellar-accent transition-colors"
            >
              Возможности
            </button>
            <button 
              onClick={() => scrollToSection('schedule')}
              className="text-text-secondary hover:text-stellar-accent transition-colors"
            >
              Автоматизация
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-text-secondary hover:text-stellar-accent transition-colors"
            >
              Контакты
            </button>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              onClick={() => scrollToSection('contact')}
              className="glass-button bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Попробовать
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg glass-card text-text-primary"
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
        {isMobileMenuOpen && (
          <div className="md:hidden glass-card mt-2 p-4 space-y-4">
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
              Автоматизация
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left text-text-secondary hover:text-stellar-accent transition-colors py-2"
            >
              Контакты
            </button>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="w-full glass-button bg-primary hover:bg-primary/90 text-primary-foreground mt-4"
            >
              Попробовать
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;