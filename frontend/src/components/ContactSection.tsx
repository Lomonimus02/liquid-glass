import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import Lottie from 'lottie-react';
// --- 1. Импортируем ОБЕ анимации ---
import paperPlaneAnimationData from "./animations/Paper Plane.json";
import successAnimationData from "./animations/Success.json";

// --- 2. Немного улучшаем наш "компонент-помощник" ---
// Добавляем поддержку 'loop' и однократного проигрывания
const LottieIconPlayer = ({ animationData, isPlaying, loop = true, className }) => {
  const lottieRef = useRef(null);

  useEffect(() => {
    const lottieInstance = lottieRef.current;
    if (lottieInstance) {
      if (isPlaying) {
        // Если анимация не зациклена, проигрываем ее один раз от начала
        if (!loop) {
          lottieInstance.goToAndPlay(0, true);
        } else {
          lottieInstance.play();
        }
      } else {
        lottieInstance.stop();
      }
    }
  }, [isPlaying, loop, animationData]);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      loop={false}
      autoplay={false}
      className={className}
    />
  );
};


const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  // --- 3. Добавляем два новых состояния ---
  const [isSuccess, setIsSuccess] = useState(false); // Для показа галочки
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  const { toast } = useToast();

  // --- 4. Обновляем логику отправки для трех состояний ---
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isSubmitting || isSuccess) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Переход из "Отправка" в "Успех"
      setIsSubmitting(false);
      setIsSuccess(true);
      
      toast({
        title: "Заявка отправлена!",
        description: "Мы свяжемся с вами в ближайшее время.",
      });
      setFormData({ name: "", email: "", school: "", message: "" });

      // Через 2 секунды сбрасываем состояние кнопки в исходное
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);

    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const shouldAnimatePlane = isButtonHovered || isSubmitting;

  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
            {/* ... */}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="glass-card p-8">
            <h3 className="text-2xl font-semibold text-text-primary mb-6">Запросить демонстрацию</h3>
            <form className="space-y-6">
                {/* ... Поля формы ... */}
                <div><label htmlFor="name">Имя и фамилия</label><Input id="name" name="name" type="text" required value={formData.name} onChange={handleInputChange} placeholder="Введите ваше имя"/></div>
                <div><label htmlFor="email">Email</label><Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} placeholder="example@school.ru"/></div>
                <div><label htmlFor="school">Образовательная организация</label><Input id="school" name="school" type="text" required value={formData.school} onChange={handleInputChange} placeholder="Название школы или учреждения"/></div>
                <div><label htmlFor="message">Сообщение</label><Textarea id="message" name="message" rows={4} value={formData.message} onChange={handleInputChange} placeholder="Расскажите о ваших потребностях и вопросах..."/></div>

              {/* --- 5. Самое главное - новая кнопка --- */}
              <Button 
                type="submit" 
                size="lg" 
                className="w-full glass-button bg-primary hover:bg-primary/90 text-primary-foreground group flex items-center justify-center transition-all duration-300"
                disabled={isSubmitting} 
                onClick={handleSubmit}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
              >
                {/* Текст меняется в зависимости от состояния */}
                <span>
                  {isSuccess ? "Отправлено!" : isSubmitting ? "Отправка..." : "Отправить заявку"}
                </span>

                {/* Контейнер для двух анимаций */}
                <div className="relative w-6 h-6 ml-2">
                  {/* Иконка самолетика */}
                  <div className={`absolute inset-0 transition-opacity duration-300 ${isSuccess ? 'opacity-0' : 'opacity-100'}`}>
                    <LottieIconPlayer 
                      animationData={paperPlaneAnimationData} 
                      isPlaying={shouldAnimatePlane}
                      className="w-full h-full"
                    />
                  </div>
                  
                  {/* Иконка галочки */}
                  <div className={`absolute inset-0 transition-opacity duration-300 ${isSuccess ? 'opacity-100' : 'opacity-0'}`}>
                    <LottieIconPlayer 
                      animationData={successAnimationData} 
                      isPlaying={isSuccess} // Играет только в состоянии успеха
                      loop={false} // Проигрывается один раз
                      className="w-15 h-15"
                    />
                  </div>
                </div>
              </Button>
            </form>
          </div>

          {/* Contact information */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="glass-card p-6 group hover:scale-105 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-stellar-primary/20 flex items-center justify-center group-hover:bg-stellar-primary/30 transition-colors">
                    <Mail className="w-6 h-6 text-stellar-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-text-primary">Email</h4>
                    <p className="text-text-secondary">info@stellarschool.ru</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 group hover:scale-105 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-stellar-accent/20 flex items-center justify-center group-hover:bg-stellar-accent/30 transition-colors">
                    <Phone className="w-6 h-6 text-stellar-accent" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-text-primary">Телефон</h4>
                    <p className="text-text-secondary">+7 (495) 123-45-67</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 group hover:scale-105 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-stellar-glow/20 flex items-center justify-center group-hover:bg-stellar-glow/30 transition-colors">
                    <MapPin className="w-6 h-6 text-stellar-glow" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-text-primary">Адрес</h4>
                    <p className="text-text-secondary">Москва, ул. Образования, 1</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 bg-stellar-primary/5 border-stellar-accent/30">
              <h4 className="text-xl font-semibold text-stellar-accent mb-4">
                Бесплатная консультация
              </h4>
              <p className="text-text-secondary mb-4">
                Мы предлагаем бесплатную 30-минутную консультацию для обсуждения 
                потребностей вашей образовательной организации
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-stellar-accent rounded-full" />
                  Анализ текущих процессов
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-stellar-accent rounded-full" />
                  Демонстрация функционала
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-stellar-accent rounded-full" />
                  Расчет экономической эффективности
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-stellar-accent rounded-full" />
                  План внедрения
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;