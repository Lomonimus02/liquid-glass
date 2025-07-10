import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, X, Zap, Target, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Stage2ConflictResolution = () => {
  const [conflicts, setConflicts] = useState([
    { id: 1, type: 'room', severity: 'high', resolved: false, description: 'Каб. 205 - конфликт времени' },
    { id: 2, type: 'teacher', severity: 'medium', resolved: false, description: 'Иванов И.И. - двойное назначение' },
    { id: 3, type: 'class', severity: 'low', resolved: false, description: '11А - превышение нагрузки' },
    { id: 4, type: 'time', severity: 'high', resolved: false, description: 'Слот 09:00 - пересечение' },
  ]);

  const [currentlyResolving, setCurrentlyResolving] = useState<number | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const interval = setInterval(() => {
      setConflicts(prev => {
        const unresolvedConflicts = prev.filter(c => !c.resolved);
        if (unresolvedConflicts.length > 0) {
          const randomConflict = unresolvedConflicts[Math.floor(Math.random() * unresolvedConflicts.length)];
          setCurrentlyResolving(randomConflict.id);
          
          setTimeout(() => {
            setConflicts(conflicts => 
              conflicts.map(c => 
                c.id === randomConflict.id ? { ...c, resolved: true } : c
              )
            );
            setCurrentlyResolving(null);
          }, 2000);
        }
        return prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-stellar-glow';
      default: return 'text-text-secondary';
    }
  };

  const getConflictTypeIcon = (type: string) => {
    switch (type) {
      case 'room': return '🏫';
      case 'teacher': return '👨‍🏫';
      case 'class': return '🎓';
      case 'time': return '⏰';
      default: return '⚠️';
    }
  };

  const resolvedCount = conflicts.filter(c => c.resolved).length;
  const totalCount = conflicts.length;

  return (
    <div className="relative w-full h-full min-h-[400px] p-8">
      {/* Header - скрыть надписи на мобильных */}
      {!isMobile && (
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center gap-2 glass-card-enhanced px-4 py-2 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Settings className="w-5 h-5 text-stellar-accent" />
            <span className="text-sm font-medium text-text-secondary">
              Разрешение конфликтов
            </span>
          </motion.div>
          
          <motion.h3
            className="text-xl font-bold text-gradient mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Автоматическое устранение конфликтов
          </motion.h3>
          
          <motion.p
            className="text-text-secondary text-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            ИИ находит и устраняет пересечения в расписании
          </motion.p>
        </div>
      )}

      {/* Resolution progress */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-4">
          <div className="glass-card-ultra p-2 flex items-center gap-2">
            <Target className="w-5 h-5 text-stellar-primary" />
            <span className="text-sm font-medium text-text-primary">Найдено:</span>
            <span className="text-sm text-stellar-primary font-bold">{totalCount}</span>
          </div>
          <div className="glass-card-ultra p-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-stellar-accent" />
            <span className="text-sm font-medium text-text-primary">Решено:</span>
            <span className="text-sm text-stellar-accent font-bold">{resolvedCount}</span>
          </div>
        </div>
      </div>

      {/* Conflicts list */}
      <div className="space-y-4 mb-6">
        <AnimatePresence>
          {conflicts.map((conflict) => (
            <motion.div
              key={conflict.id}
              className={`p-3 glass-card-ultra text-xs transition-all duration-700 transform ${
                conflict.resolved 
                  ? 'bg-stellar-accent/10 border-stellar-accent/30' 
                  : currentlyResolving === conflict.id 
                  ? 'bg-stellar-primary/10 border-stellar-primary/30 scale-105' 
                  : 'bg-glass-secondary border-glass-border'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                scale: currentlyResolving === conflict.id ? 1.02 : 1,
              }}
              transition={{ duration: 0.5 }}
              layout
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {getConflictTypeIcon(conflict.type)}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-text-primary font-medium">
                      {conflict.description}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full glass-card-subtle ${getSeverityColor(conflict.severity)}`}>
                      {conflict.severity}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  {conflict.resolved ? (
                    <CheckCircle className="w-4 h-4 text-stellar-accent" />
                  ) : currentlyResolving === conflict.id ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Settings className="w-4 h-4 text-stellar-primary" />
                    </motion.div>
                  ) : (
                    <AlertTriangle className={`w-4 h-4 ${getSeverityColor(conflict.severity)}`} />
                  )}
                </div>
              </div>
              
              {currentlyResolving === conflict.id && (
                <motion.div
                  className="mt-2 h-1 bg-stellar-primary/20 rounded-full overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                >
                  <motion.div
                    className="h-full bg-stellar-primary rounded-full"
                    initial={{ x: '-100%' }}
                    animate={{ x: '0%' }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Overall progress */}
      <div className="mt-6 glass-card-enhanced p-4 bg-stellar-primary/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">Общий прогресс</span>
          <span className="text-sm font-medium text-stellar-primary">
            {Math.round((resolvedCount / totalCount) * 100)}%
          </span>
        </div>
        <div className="w-full bg-glass-secondary rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-stellar-primary to-stellar-accent h-2 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(resolvedCount / totalCount) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        
        {resolvedCount === totalCount && (
          <motion.div
            className="mt-3 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-center gap-2 text-stellar-accent">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Все конфликты устранены!</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Resolution animation effects */}
      <div className="absolute inset-0 pointer-events-none">
        {currentlyResolving && (
          <motion.div
            className="absolute inset-0 border-2 border-stellar-primary/30 rounded-3xl"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Stage2ConflictResolution;