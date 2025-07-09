import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, Clock, Users, BookOpen, AlertCircle } from 'lucide-react';

const Stage0UnorganizedData = () => {
  const [highlightedItems, setHighlightedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightedItems(prev => {
        const newSet = new Set<number>();
        // Randomly highlight 2-3 items
        for (let i = 0; i < 3; i++) {
          newSet.add(Math.floor(Math.random() * 8));
        }
        return newSet;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const dataItems = [
    { id: 1, text: "Математика - 11А", icon: <BookOpen className="w-4 h-4" />, type: "subject" },
    { id: 2, text: "Иванов И.И.", icon: <Users className="w-4 h-4" />, type: "teacher" },
    { id: 3, text: "Каб. 205", icon: <Calendar className="w-4 h-4" />, type: "room" },
    { id: 4, text: "Понедельник", icon: <Calendar className="w-4 h-4" />, type: "day" },
    { id: 5, text: "09:00-09:45", icon: <Clock className="w-4 h-4" />, type: "time" },
    { id: 6, text: "Физика - 10Б", icon: <BookOpen className="w-4 h-4" />, type: "subject" },
    { id: 7, text: "Петров П.П.", icon: <Users className="w-4 h-4" />, type: "teacher" },
    { id: 8, text: "Лаборатория", icon: <Calendar className="w-4 h-4" />, type: "room" },
  ];

  const getItemPosition = (index: number) => {
    const positions = [
      { left: '10%', top: '15%' },
      { left: '60%', top: '25%' },
      { left: '30%', top: '45%' },
      { left: '75%', top: '35%' },
      { left: '15%', top: '65%' },
      { left: '70%', top: '55%' },
      { left: '45%', top: '75%' },
      { left: '85%', top: '65%' },
    ];
    return positions[index] || { left: '50%', top: '50%' };
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case 'subject': return 'text-stellar-primary';
      case 'teacher': return 'text-stellar-accent';
      case 'room': return 'text-stellar-glow';
      case 'day': return 'text-stellar-primary';
      case 'time': return 'text-stellar-accent';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="relative w-full h-full min-h-[400px] p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          className="inline-flex items-center gap-2 glass-card-enhanced px-4 py-2 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FileText className="w-5 h-5 text-stellar-accent" />
          <span className="text-sm font-medium text-text-secondary">
            Исходные данные
          </span>
        </motion.div>
        
        <motion.h3
          className="text-xl font-bold text-gradient mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Неорганизованные данные
        </motion.h3>
        
        <motion.p
          className="text-text-secondary text-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Учебные предметы, преподаватели, аудитории и временные слоты
        </motion.p>
      </div>

      {/* Scattered data items */}
      <AnimatePresence>
        {dataItems.map((item, index) => {
          const position = getItemPosition(index);
          const isHighlighted = highlightedItems.has(index);
          
          return (
            <motion.div
              key={item.id}
              className={`absolute p-3 glass-card-ultra text-sm animate-shake hover:animate-pulse transition-all cursor-pointer ${
                isHighlighted ? 'ring-2 ring-stellar-accent/50' : ''
              }`}
              style={{
                left: position.left,
                top: position.top,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: isHighlighted ? 1.1 : 1,
                y: isHighlighted ? -5 : 0,
              }}
              transition={{ 
                duration: 0.3,
                delay: index * 0.1,
              }}
              whileHover={{ 
                scale: 1.15,
                y: -8,
                boxShadow: '0 10px 30px rgba(2, 191, 122, 0.3)',
              }}
            >
              <div className="flex items-center gap-2">
                <span className={getItemColor(item.type)}>
                  {item.icon}
                </span>
                <span className="text-text-primary font-medium">
                  {item.text}
                </span>
              </div>
              
              {isHighlighted && (
                <motion.div
                  className="absolute -inset-1 rounded-2xl border-2 border-stellar-accent/30"
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Status indicator */}
      <div className="absolute top-4 right-4 glass-card-enhanced p-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span className="text-xs text-text-secondary">
            Данные не структурированы
          </span>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-stellar-accent rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Stage0UnorganizedData;