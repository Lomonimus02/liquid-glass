import { Sparkles, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative py-16 px-4 border-t border-glass-border">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-stellar-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-stellar-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">Stellar School</span>
            </div>
            <p className="text-text-secondary mb-6 max-w-md">
              Инновационная платформа для управления образовательным процессом. 
              Автоматизируем рутину, освобождаем время для творчества и обучения.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-text-secondary">
                <Mail className="w-4 h-4 text-stellar-accent" />
                <span>info@stellarschool.ru</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <Phone className="w-4 h-4 text-stellar-accent" />
                <span>+7 (495) 123-45-67</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <MapPin className="w-4 h-4 text-stellar-accent" />
                <span>Москва, ул. Образования, 1</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-4">Продукт</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-text-secondary hover:text-stellar-accent transition-colors">Возможности</a></li>
              <li><a href="#schedule" className="text-text-secondary hover:text-stellar-accent transition-colors">Автоматизация</a></li>
              <li><a href="#" className="text-text-secondary hover:text-stellar-accent transition-colors">Мобильное приложение</a></li>
              <li><a href="#" className="text-text-secondary hover:text-stellar-accent transition-colors">Интеграции</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-4">Поддержка</h4>
            <ul className="space-y-2">
              <li><a href="#contact" className="text-text-secondary hover:text-stellar-accent transition-colors">Связаться с нами</a></li>
              <li><a href="#" className="text-text-secondary hover:text-stellar-accent transition-colors">Документация</a></li>
              <li><a href="#" className="text-text-secondary hover:text-stellar-accent transition-colors">Обучение</a></li>
              <li><a href="#" className="text-text-secondary hover:text-stellar-accent transition-colors">Статус системы</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-glass-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-text-secondary text-sm">
            © 2024 Stellar School. Все права защищены.
          </div>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="#" className="text-text-secondary hover:text-stellar-accent transition-colors text-sm">
              Политика конфиденциальности
            </a>
            <a href="#" className="text-text-secondary hover:text-stellar-accent transition-colors text-sm">
              Условия использования
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;