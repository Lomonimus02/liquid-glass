// Файл: src/pages/Index.tsx (Обновленная версия с wow эффектами)

import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import StickyScheduleAnimation from "@/components/StickyScheduleAnimation";
import StickyAnalyticsAnimation from "@/components/StickyAnalyticsAnimation";
import StickyAIAnimation from "@/components/StickyAIAnimation";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import LiquidTransition from "@/components/LiquidTransition";
import SmoothReveal from "@/components/SmoothReveal";

const Index = () => {
  return (
    // Main container with transparent background since the fixed background is now handled at App level
    <div className="relative min-h-screen bg-transparent">
      {/*
        All content with z-10 to ensure it appears above the fixed background
      */}
      <div className="relative z-10 flex flex-col">
        <Navigation />

        <main>
          <SmoothReveal>
            <section id="hero">
              <HeroSection />
            </section>
          </SmoothReveal>

          <LiquidTransition>
            <SmoothReveal direction="left" delay={0.2}>
              <section id="features">
                <FeaturesSection />
              </section>
            </SmoothReveal>
          </LiquidTransition>

          {/* Sticky анимация с демонстрацией этапов создания расписания */}
          <LiquidTransition color="#02bf7a">
            <SmoothReveal direction="right" delay={0.1}>
              <section id="schedule">
                <StickyScheduleAnimation />
              </section>
            </SmoothReveal>
          </LiquidTransition>

          {/* Новая sticky анимация для аналитики */}
          <LiquidTransition color="#1a8c5c">
            <SmoothReveal direction="up" delay={0.3}>
              <section id="analytics">
                <StickyAnalyticsAnimation />
              </section>
            </SmoothReveal>
          </LiquidTransition>

          {/* Новая sticky анимация для ИИ-помощника */}
          <LiquidTransition color="#0ea5e9">
            <SmoothReveal direction="down" delay={0.2}>
              <section id="ai-assistant">
                <StickyAIAnimation />
              </section>
            </SmoothReveal>
          </LiquidTransition>

          <LiquidTransition>
            <SmoothReveal direction="up" delay={0.4}>
              <section id="contact">
                <ContactSection />
              </section>
            </SmoothReveal>
          </LiquidTransition>
        </main>

        <SmoothReveal>
          <Footer />
        </SmoothReveal>
      </div>
    </div>
  );
};

export default Index;