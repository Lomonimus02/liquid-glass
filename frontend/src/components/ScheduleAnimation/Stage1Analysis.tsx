import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, BarChart3, TrendingUp, CheckCircle } from 'lucide-react';

const Stage1Analysis = () => {
  const [analysisStep, setAnalysisStep] = useState(0);
  const [processedItems, setProcessedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalysisStep(prev => (prev + 1) % 4);
      
      // Simulate processing items
      if (analysisStep === 1) {
        setProcessedItems(prev => {
          const newSet = new Set(prev);
          const nextItem = prev.size;
          if (nextItem < 6) {
            newSet.add(nextItem);
          }
          return newSet;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [analysisStep]);

  const analysisSteps = [
    { title: "Сканирование данных", icon: <Search className="w-6 h-6" />, color: "text-stellar-primary" },
    { title: "Анализ конфликтов", icon: <Zap className="w-6 h-6" />, color: "text-stellar-accent" },
    { title: "Построение графика", icon: <BarChart3 className="w-6 h-6" />, color: "text-stellar-glow" },
    { title: "Оптимизация", icon: <TrendingUp className="w-6 h-6" />, color: "text-stellar-primary" },
  ];

  const dataCategories = [
    { name: "Предметы", count: 15, processed: processedItems.has(0) },
    { name: "Преподаватели", count: 8, processed: processedItems.has(1) },
    { name: "Аудитории", count: 12, processed: processedItems.has(2) },
    { name: "Классы", count: 6, processed: processedItems.has(3) },
    { name: "Временные слоты", count: 35, processed: processedItems.has(4) },
    { name: "Ограничения", count: 23, processed: processedItems.has(5) },
  ];

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
          <Search className="w-5 h-5 text-stellar-accent" />
          <span className="text-sm font-medium text-text-secondary">
            Этап анализа
          </span>
        </motion.div>
        
        <motion.h3
          className="text-xl font-bold text-gradient mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Анализ данных и выявление ограничений
        </motion.h3>
        
        <motion.p
          className="text-text-secondary text-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          ИИ изучает все элементы и их взаимосвязи
        </motion.p>
      </div>

      {/* Current analysis step */}
      <div className="flex justify-center mb-8">
        <motion.div
          className="glass-card-ultra p-3 inline-block"
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 4px 16px rgba(2, 191, 122, 0.2)',
              '0 8px 32px rgba(2, 191, 122, 0.4)',
              '0 4px 16px rgba(2, 191, 122, 0.2)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="flex items-center gap-3">
            <span className={analysisSteps[analysisStep].color}>
              {analysisSteps[analysisStep].icon}
            </span>
            <span className="text-text-primary font-medium">
              {analysisSteps[analysisStep].title}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Data processing grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {dataCategories.map((category, index) => (
          <motion.div
            key={category.name}
            className={`glass-card-enhanced p-4 text-center transition-all duration-500 ${
              category.processed 
                ? 'bg-stellar-primary/10 border-stellar-primary/30' 
                : 'bg-glass-secondary'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: category.processed ? 1.05 : 1,
            }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.1,
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              {category.processed && (
                <CheckCircle className="w-4 h-4 text-stellar-primary" />
              )}
              <span className={`text-sm font-medium ${
                category.processed ? 'text-stellar-primary' : 'text-text-secondary'
              }`}>
                {category.name}
              </span>
            </div>
            <div className={`text-lg font-bold ${
              category.processed ? 'text-stellar-primary' : 'text-text-primary'
            }`}>
              {category.count}
            </div>
            
            {category.processed && (
              <motion.div
                className="mt-2 h-1 bg-stellar-primary/20 rounded-full overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <motion.div
                  className="h-full bg-stellar-primary rounded-full"
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Analysis progress */}
      <div className="flex justify-center">
        <div className="glass-card-ultra p-4 w-full max-w-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">Прогресс анализа</span>
            <span className="text-sm font-medium text-stellar-primary">
              {Math.round((processedItems.size / 6) * 100)}%
            </span>
          </div>
          <div className="w-full bg-glass-secondary rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-stellar-primary to-stellar-accent h-2 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(processedItems.size / 6) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>

      {/* Floating data connections */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-12 bg-gradient-to-b from-stellar-accent/40 to-transparent"
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scaleY: [0, 1, 0],
            }}
            transition={{
              duration: 2,
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

export default Stage1Analysis;