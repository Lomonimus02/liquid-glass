import { useEffect, useRef, useState, useCallback } from "react";
import { Zap, Sparkles } from "lucide-react";
import { scheduleSteps } from "./data";
import Stage0UnorganizedData from "./Stage0UnorganizedData";
import Stage1Analysis from "./Stage1Analysis";
import Stage2ConflictResolution from "./Stage2ConflictResolution";
import Stage3FinalSchedule from "./Stage3FinalSchedule";
import StepIndicator from "./StepIndicator";
const ScheduleAnimationSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const animationRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startAnimation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveStep(prev => (prev + 1) % scheduleSteps.length);
    }, scheduleSteps[activeStep]?.duration || 3000);
  }, [activeStep]);
  const stopAnimation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  useEffect(() => {
    startAnimation();
    return () => stopAnimation();
  }, [startAnimation, stopAnimation]);
  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };
  const renderCurrentStage = () => {
    switch (activeStep) {
      case 0:
        return <Stage0UnorganizedData />;
      case 1:
        return <Stage1Analysis />;
      case 2:
        return <Stage2ConflictResolution />;
      case 3:
        return <Stage3FinalSchedule />;
      default:
        return <Stage0UnorganizedData />;
    }
  };
  return <section className="py-24 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-stellar-accent/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-stellar-primary/10 rounded-full blur-3xl animate-float" style={{
        animationDelay: '2s'
      }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-stellar-accent animate-pulse" />
            <span className="text-sm font-medium text-text-secondary">Инновационная технология</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Автоматическое</span>
            <br />
            <span className="text-text-primary">составление расписания</span>
          </h2>
          
          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
            Революционная функция, которая экономит часы ручной работы. 
            Наш ИИ создает идеальное расписание за секунды, учитывая все ограничения и пожелания
          </p>

          <div className="glass-card p-4 inline-block">
            <div className="flex items-center gap-2 text-stellar-accent">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="font-semibold">Экономия времени: до 20 часов в неделю</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Animation visualization */}
          <div className="relative">
            <div ref={animationRef} className="glass-card p-8 min-h-[500px] relative overflow-hidden">
              {renderCurrentStage()}

              {/* Progress indicator */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-text-secondary">Прогресс создания</span>
                  <span className="text-sm font-semibold text-stellar-accent">
                    {Math.round((activeStep + 1) / scheduleSteps.length * 100)}%
                  </span>
                </div>
                <div className="w-full bg-glass-secondary rounded-full h-2 overflow-hidden">
                  <div className="h-full liquid-gradient transition-all duration-1000 ease-out" style={{
                  width: `${(activeStep + 1) / scheduleSteps.length * 100}%`
                }} />
                </div>
              </div>
            </div>
          </div>

          {/* Process steps */}
          <div className="space-y-8">
            <StepIndicator steps={scheduleSteps} currentStep={activeStep} onStepClick={handleStepChange} />

            {/* Benefits highlight */}
            
          </div>
        </div>
      </div>
    </section>;
};
export default ScheduleAnimationSection;