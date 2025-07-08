// Файл: src/pages/Index.tsx (Обновленная версия с новыми sticky анимациями)

import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import StickyScheduleAnimation from "@/components/StickyScheduleAnimation";
import StickyAnalyticsAnimation from "@/components/StickyAnalyticsAnimation";
import StickyAIAnimation from "@/components/StickyAIAnimation";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

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
          <section id="hero">
            <HeroSection />
          </section>

          <section id="features">
            <FeaturesSection />
          </section>

          {/* Sticky анимация с демонстрацией этапов создания расписания */}
          <section id="schedule">
            <StickyScheduleAnimation />
          </section>

          {/* Новая sticky анимация для аналитики */}
          <section id="analytics">
            <StickyAnalyticsAnimation />
          </section>

          {/* Новая sticky анимация для ИИ-помощника */}
          <section id="ai-assistant">
            <StickyAIAnimation />
          </section>

          <section id="contact">
            <ContactSection />
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Index;