import { Button } from "@/components/ui/button";
import { ArrowRight, Stars, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-stellar-glow/20 blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-stellar-accent/15 blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-16 h-16 rounded-full bg-stellar-primary/25 blur-lg animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass-card px-6 py-3 mb-8 animate-fade-in-up">
          <Stars className="w-5 h-5 text-stellar-accent" />
          <span className="text-sm font-medium text-text-secondary">
            Инновационный электронный дневник
          </span>
          <Zap className="w-4 h-4 text-stellar-glow animate-pulse-glow" />
        </div>

        {/* Main heading */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <span className="text-gradient">Stellar</span>
          <br />
          <span className="text-text-primary">School</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          Революционная система управления образовательным процессом с 
          <span className="text-stellar-accent font-semibold"> автоматизированным составлением расписания</span> 
          и интеллектуальной аналитикой
        </p>

        {/* Подводка к карточкам */}
        <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <p className="text-lg text-text-secondary">
            Начните сотрудничать с нами и получите
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <Button size="lg" className="glass-button px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary hover:bg-primary/90 group">
            Начать использовать
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="glass-card p-6 text-center group hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-gradient mb-2">🎨</div>
            <div className="text-text-secondary">Персонализированный интерфейс для Вашей школы</div>
          </div>

          <div className="glass-card p-6 text-center group hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-gradient mb-2">🎯</div>
            <div className="text-text-secondary">Бесплатная демонстрация</div>
          </div>

          <div className="glass-card p-6 text-center group hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-gradient mb-2">24/7</div>
            <div className="text-text-secondary">Техническая поддержка</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
        <div className="w-6 h-10 border-2 border-stellar-accent/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-stellar-accent rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;