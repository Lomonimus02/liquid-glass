// Файл: ScheduleAnimationSection.tsx (финальная, дважды проверенная версия)

import { useEffect, useRef, useState } from "react";
import { Zap, Sparkles } from "lucide-react"; 
import Lottie from 'lottie-react';

import chatbotAnimationData from './animations/chatbot.json';
import timeAnimationData from './animations/time.json';
import todoAnimationData from './animations/to do.json';
import calendarAnimationData from './animations/calendar.json';
import successAnimationData from './animations/success.json';

const StepLottieIcon = ({ stepAnimationData, successAnimationData, isActive, isCompleted, className }) => {
  const stepLottieRef = useRef(null);
  const successLottieRef = useRef(null);

  useEffect(() => {
    const instance = stepLottieRef.current;
    if (instance) {
      if (isActive) { instance.play(); } 
      else { instance.stop(); }
    }
  }, [isActive]);

  useEffect(() => {
    const instance = successLottieRef.current;
    if (instance && isCompleted) {
      instance.goToAndPlay(0, true);
    }
  }, [isCompleted]);

  return (
    <div className={`relative ${className}`}>
      <div className={`absolute inset-0 transition-opacity duration-500 ${isCompleted ? 'opacity-0' : 'opacity-100'}`}>
        <Lottie lottieRef={stepLottieRef} animationData={stepAnimationData} loop={true} autoplay={false} className="w-full h-full" />
      </div>
      <div className={`absolute inset-0 transition-opacity duration-500 ${isCompleted ? 'opacity-100' : 'opacity-0'}`}>
        <Lottie lottieRef={successLottieRef} animationData={successAnimationData} loop={false} autoplay={false} className="w-full h-full" />
      </div>
    </div>
  );
};

const ScheduleAnimationSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const animationRef = useRef<HTMLDivElement>(null);

  const scheduleSteps = [
    { title: "Анализ ограничений", description: "ИИ анализирует расписание учителей, кабинеты и предметы", animationData: chatbotAnimationData, },
    { title: "Оптимизация времени", description: "Алгоритм находит оптимальное распределение уроков", animationData: timeAnimationData, },
    { title: "Проверка конфликтов", description: "Система автоматически устраняет пересечения", animationData: todoAnimationData, },
    { title: "Готовое расписание", description: "Идеальное расписание создано за секунды", animationData: calendarAnimationData, }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % (scheduleSteps.length + 1));
    }, 3000); 
    return () => clearInterval(interval);
  }, [scheduleSteps.length]);

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-stellar-accent/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-stellar-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
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
          <div className="relative">
            <div ref={animationRef} className="glass-card p-8 min-h-[500px] relative overflow-hidden flex items-center justify-center">
              
              {activeStep < scheduleSteps.length && (
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <Lottie
                    key={activeStep} 
                    animationData={scheduleSteps[activeStep].animationData}
                    loop={true}
                    autoplay={true}
                    className="w-64 h-64"
                  />
                   <div className="text-center mt-4">
                    <h3 className="text-lg font-semibold text-stellar-accent mb-2">{scheduleSteps[activeStep].title}</h3>
                    <p className="text-sm text-text-secondary">{scheduleSteps[activeStep].description}</p>
                  </div>
                </div>
              )}

              {activeStep === scheduleSteps.length && (
                 <div className="flex flex-col items-center justify-center h-full w-full text-center">
                    <Lottie 
                      animationData={successAnimationData}
                      loop={false}
                      autoplay={true}
                      className="w-48 h-48"
                    />
                    <h3 className="text-xl font-bold text-stellar-accent mt-4">Расписание успешно создано!</h3>
                 </div>
              )}

              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-text-secondary">Прогресс создания</span>
                  <span className="text-sm font-semibold text-stellar-accent">
                    {Math.round(Math.min(activeStep, scheduleSteps.length) / scheduleSteps.length * 100)}%
                  </span>
                </div>
                <div className="w-full bg-glass-secondary rounded-full h-2 overflow-hidden">
                  <div className="h-full liquid-gradient transition-all duration-1000 ease-out" style={{
                  width: `${Math.min(activeStep, scheduleSteps.length) / scheduleSteps.length * 100}%`
                }} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="min-h-[450px] flex items-center justify-center relative">
              <div className="relative w-full">
                {scheduleSteps.map((step, index) => {
                  const isActive = index === activeStep;
                  const isCompleted = index < activeStep;

                  return (
                    <div
                      key={index}
                      className={`glass-card p-8 transition-all duration-700 ease-in-out ${
                        isActive ? 'opacity-100 scale-100 ring-2 ring-stellar-accent/50 glow-effect' : 'opacity-0 scale-95 pointer-events-none absolute inset-0'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                        <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-stellar-primary/20">
                          <StepLottieIcon
                            stepAnimationData={step.animationData}
                            successAnimationData={successAnimationData}
                            isActive={isActive}
                            isCompleted={isCompleted}
                            className="w-full h-full"
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-2xl font-bold text-stellar-accent">
                            {step.title}
                          </h3>
                          <p className="text-text-secondary text-lg leading-relaxed">
                            {step.description}
                          </p>
                        </div>

                        <div className="flex space-x-2">
                          {scheduleSteps.map((_, stepIndex) => (
                            <div key={stepIndex} className={`w-2 h-2 rounded-full transition-all duration-300 ${stepIndex === activeStep ? 'bg-stellar-accent scale-125' : stepIndex < activeStep ? 'bg-stellar-accent/60' : 'bg-glass-border'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card p-6 bg-stellar-primary/5 border-stellar-accent/30">
              <h4 className="text-lg font-semibold text-stellar-accent mb-3">Ключевые преимущества:</h4>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-stellar-accent rounded-full" />Учет всех ограничений и пожеланий</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-stellar-accent rounded-full" />Автоматическое разрешение конфликтов</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-stellar-accent rounded-full" />Мгновенные изменения и корректировки</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-stellar-accent rounded-full" />Интеграция с календарными системами</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScheduleAnimationSection;