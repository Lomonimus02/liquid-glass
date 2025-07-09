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
    // Main container with seamless background integration
    <div className="relative min-h-screen">
      {/* Seamless content wrapper */}
      <div className="relative z-10 flex flex-col">
        <Navigation />

        <main className="relative z-10">
          {/* Hero section без дополнительных отступов */}
          <section id="hero" className="relative z-10">
            <SmoothReveal>
              <HeroSection />
            </SmoothReveal>
          </section>

          {/* Features section с плавным переходом */}
          <section id="features" className="relative z-10 -mt-8">
            <LiquidTransition>
              <SmoothReveal direction="left" delay={0.2}>
                <FeaturesSection />
              </SmoothReveal>
            </LiquidTransition>
          </section>

          {/* Schedule section с перекрытием */}
          <section id="schedule" className="relative z-10 -mt-12">
            <LiquidTransition color="#02bf7a">
              <SmoothReveal direction="right" delay={0.1}>
                <StickyScheduleAnimation />
              </SmoothReveal>
            </LiquidTransition>
          </section>

          {/* Analytics section с перекрытием */}
          <section id="analytics" className="relative z-10 -mt-16">
            <LiquidTransition color="#1a8c5c">
              <SmoothReveal direction="up" delay={0.3}>
                <StickyAnalyticsAnimation />
              </SmoothReveal>
            </LiquidTransition>
          </section>

          {/* AI section с перекрытием */}
          <section id="ai-assistant" className="relative z-10 -mt-16">
            <LiquidTransition color="#0ea5e9">
              <SmoothReveal direction="down" delay={0.2}>
                <StickyAIAnimation />
              </SmoothReveal>
            </LiquidTransition>
          </section>

          {/* Contact section с плавным переходом */}
          <section id="contact" className="relative z-10 -mt-8">
            <LiquidTransition>
              <SmoothReveal direction="up" delay={0.4}>
                <ContactSection />
              </SmoothReveal>
            </LiquidTransition>
          </section>
        </main>

        {/* Footer без разделения */}
        <div className="relative z-10">
          <SmoothReveal>
            <Footer />
          </SmoothReveal>
        </div>
      </div>
    </div>
  );
};

export default Index;