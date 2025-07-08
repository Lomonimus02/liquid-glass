// Файл: StepIndicator.tsx (ИЗМЕНЕН)

import { ScheduleStep } from "./types";
import { useEffect, useRef, useState } from "react";
import Lottie from 'lottie-react';

// Импортируем анимацию галочки
import successAnimationData from '../animations/successs.json';


// "Компонент-помощник" для управления анимациями (остается без изменений)
const StepLottieIcon = ({ stepAnimationData, successAnimationData, isActive, isCompleted, className }) => {
  const stepLottieRef = useRef(null);
  const successLottieRef = useRef(null);

  useEffect(() => {
    const instance = stepLottieRef.current;
    if (instance) {
      if (isActive) {
        // Сразу запускаем анимацию
        instance.goToAndPlay(0, true);

        // Перезапускаем анимацию каждые 2 секунды для активности
        const interval = setInterval(() => {
          instance.goToAndPlay(0, true);
        }, 2000);
        return () => clearInterval(interval);
      } else {
        instance.stop();
      }
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
        <Lottie
          lottieRef={stepLottieRef}
          animationData={stepAnimationData}
          loop={true}
          autoplay={isActive}
          style={{
            filter: isActive ? 'brightness(1.2) saturate(1.3)' : 'brightness(0.7) saturate(0.8)',
            transform: isActive ? 'scale(1.05)' : 'scale(1)'
          }}
          className="w-full h-full transition-all duration-300"
        />
      </div>
      <div className={`absolute inset-0 transition-opacity duration-500 ${isCompleted ? 'opacity-100' : 'opacity-0'}`}>
        <Lottie lottieRef={successLottieRef} animationData={successAnimationData} loop={false} autoplay={false} className="w-full h-full" />
      </div>
    </div>
  );
};


interface StepIndicatorProps {
  steps: ScheduleStep[];
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
}

const StepIndicator = ({ steps, currentStep, onStepClick }: StepIndicatorProps) => {
  // --- НОВОЕ: Состояние для отсчета времени ---
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- НОВОЕ: Логика для управления таймером ---
  useEffect(() => {
    // Очищаем предыдущий таймер, если он был
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Сбрасываем счетчик для нового этапа
    setElapsedTime(0);

    const currentStepData = steps[currentStep];
    // Запускаем таймер только если текущий этап существует
    if (currentStepData) {
      const duration = currentStepData.duration;
      
      timerRef.current = setInterval(() => {
        setElapsedTime(prevTime => {
          const newTime = prevTime + 100;
          if (newTime >= duration) {
            if(timerRef.current) clearInterval(timerRef.current);
            return duration; // Останавливаемся на максимальном значении
          }
          return newTime;
        });
      }, 100); // Обновляем каждые 0.1 секунды
    }

    // Функция очистки при смене этапа или размонтировании компонента
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentStep, steps]); // Перезапускаем эффект при смене этапа

  return (
    <div className="relative">
      <div className="space-y-8">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div
              key={step.id}
              className={`relative flex items-start gap-6 cursor-pointer transition-all duration-300 ${
                isActive ? 'scale-105' : 'hover:scale-102'
              }`}
              onClick={() => onStepClick(index)}
            >
              {/* --- ИЗМЕНЕНИЕ №1: Увеличиваем размер контейнера иконки --- */}
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-300 glass-card ${
                isActive ? 'ring-2 ring-stellar-accent glow-effect' : isCompleted ? 'ring-1 ring-stellar-accent/50' : ''
              }`}>
                
                <StepLottieIcon
                  stepAnimationData={step.animationData}
                  successAnimationData={successAnimationData}
                  isActive={isActive}
                  isCompleted={isCompleted}
                  // --- ИЗМЕНЕНИЕ №2: Увеличиваем размер самой иконки ---
                  className="w-10 h-10" 
                />

              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`text-xl font-bold ${
                    isActive ? 'text-stellar-accent' : isCompleted ? 'text-stellar-primary' : 'text-text-secondary'
                  }`}>
                    {step.title}
                  </h3>
                  
                  {/* --- ИЗМЕНЕНИЕ №3: Отображение таймера --- */}
                  <span className={`text-xs px-2 py-1 rounded-full transition-colors duration-300 ${
                    isActive ? 'bg-stellar-accent/20 text-stellar-accent' : 'bg-glass-secondary text-text-secondary'
                  }`}>
                    {/* Показываем активный таймер для текущего этапа, и статичный для остальных */}
                    {isActive 
                      ? `${(elapsedTime / 1000).toFixed(1)}s` 
                      : `${(step.duration / 1000).toFixed(1)}s`
                    }
                  </span>
                </div>
                
                <p className={`text-base leading-relaxed ${
                  isActive ? 'text-text-primary' : 'text-text-secondary'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;