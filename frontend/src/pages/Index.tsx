// Файл: src/pages/Index.tsx (Оригинальная версия)

import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import StickyScheduleAnimation from "@/components/StickyScheduleAnimation";
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

          {/* Sticky анимация с демонстрацией этапов */}
          <section id="schedule">
            <StickyScheduleAnimation />
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