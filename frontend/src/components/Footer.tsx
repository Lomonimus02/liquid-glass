import { Sparkles, Mail, Phone, MapPin } from "lucide-react";
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="relative py-16 px-4 border-t border-glass-border z-20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-stellar-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="md:col-span-2 lg:col-span-2">
            <motion.div 
              className="flex items-center gap-2 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="w-8 h-8 rounded-lg bg-stellar-primary flex items-center justify-center"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold text-gradient-animated">Stellar School</span>
            </motion.div>
            <motion.p 
              className="text-text-secondary mb-6 max-w-md text-sm md:text-base"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Инновационная платформа для управления образовательным процессом. 
              Автоматизируем рутину, освобождаем время для творчества и обучения.
            </motion.p>
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="flex items-center gap-3 text-text-secondary text-sm md:text-base"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Mail className="w-4 h-4 text-stellar-accent" />
                <span>info@stellarschool.ru</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 text-text-secondary text-sm md:text-base"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Phone className="w-4 h-4 text-stellar-accent" />
                <span>+7 (495) 123-45-67</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3 text-text-secondary text-sm md:text-base"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <MapPin className="w-4 h-4 text-stellar-accent" />
                <span>Москва, ул. Образования, 1</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-text-primary mb-4">Продукт</h4>
            <ul className="space-y-2">
              <li><motion.a 
                href="#features" 
                className="text-text-secondary hover:text-stellar-accent transition-colors text-sm md:text-base"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >Возможности</motion.a></li>
              <li><motion.a 
                href="#schedule" 
                className="text-text-secondary hover:text-stellar-accent transition-colors text-sm md:text-base"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >Расписание</motion.a></li>
              <li><motion.a 
                href="#analytics" 
                className="text-text-secondary hover:text-stellar-accent transition-colors text-sm md:text-base"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >Аналитика</motion.a></li>
              <li><motion.a 
                href="#ai-assistant" 
                className="text-text-secondary hover:text-stellar-accent transition-colors text-sm md:text-base"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >ИИ-помощник</motion.a></li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-text-primary mb-4">Поддержка</h4>
            <ul className="space-y-2">
              <li><motion.a 
                href="#contact" 
                className="text-text-secondary hover:text-stellar-accent transition-colors text-sm md:text-base"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >Связаться с нами</motion.a></li>
              <li><motion.a 
                href="#" 
                className="text-text-secondary hover:text-stellar-accent transition-colors text-sm md:text-base"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >Документация</motion.a></li>
              <li><motion.a 
                href="#" 
                className="text-text-secondary hover:text-stellar-accent transition-colors text-sm md:text-base"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >Обучение</motion.a></li>
              <li><motion.a 
                href="#" 
                className="text-text-secondary hover:text-stellar-accent transition-colors text-sm md:text-base"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >Статус системы</motion.a></li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-glass-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-text-secondary text-sm">
            © 2024 Stellar School. Все права защищены.
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-4 md:mt-0">
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