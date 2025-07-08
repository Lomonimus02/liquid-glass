import { useState, useEffect } from "react";
import { Users, Brain, Cpu } from "lucide-react";

const Stage1Analysis = () => {
  const [processedCount, setProcessedCount] = useState(0);
  const [connections, setConnections] = useState<Array<{ from: number; to: number; active: boolean }>>([]);
  
  const totalItems = 14; // teachers + subjects

  useEffect(() => {
    // Animate processing counter
    const counterInterval = setInterval(() => {
      setProcessedCount(prev => {
        if (prev >= totalItems) {
          clearInterval(counterInterval);
          return totalItems;
        }
        return prev + 1;
      });
    }, 200);

    // Generate neural connections
    const connectionLines = [];
    for (let i = 0; i < 8; i++) {
      connectionLines.push({
        from: Math.floor(Math.random() * 6),
        to: Math.floor(Math.random() * 6) + 6,
        active: false
      });
    }
    setConnections(connectionLines);

    // Animate connections
    const connectionInterval = setInterval(() => {
      setConnections(prev => prev.map(conn => ({
        ...conn,
        active: Math.random() > 0.5
      })));
    }, 500);

    return () => {
      clearInterval(counterInterval);
      clearInterval(connectionInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      {/* Main processing indicator */}
      <div className="relative">
        <div className="w-24 h-24 border-4 border-stellar-accent/30 border-t-stellar-accent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="w-8 h-8 text-stellar-accent animate-pulse" />
        </div>
      </div>
      
      {/* Processing status */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-stellar-accent">Анализ данных</h3>
        <p className="text-sm text-text-secondary">
          ИИ анализирует ограничения и оптимизирует распределение
        </p>
        
        {/* Progress counter */}
        <div className="glass-card p-3 inline-block">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-stellar-accent animate-pulse" />
            <span className="text-sm font-medium text-stellar-accent">
              Обработано: {processedCount}/{totalItems}
            </span>
          </div>
        </div>
      </div>

      {/* Neural network visualization */}
      <div className="relative w-full h-32">
        <svg className="w-full h-full" viewBox="0 0 400 120">
          {/* Neural nodes */}
          {Array.from({ length: 6 }, (_, i) => (
            <circle
              key={`left-${i}`}
              cx={50}
              cy={20 + i * 16}
              r="4"
              className="fill-stellar-primary animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <circle
              key={`right-${i}`}
              cx={350}
              cy={20 + i * 16}
              r="4"
              className="fill-stellar-accent animate-pulse"
              style={{ animationDelay: `${(i + 6) * 0.1}s` }}
            />
          ))}
          
          {/* Connection lines */}
          {connections.map((conn, index) => (
            <line
              key={index}
              x1={50}
              y1={20 + conn.from * 16}
              x2={350}
              y2={20 + (conn.to - 6) * 16}
              stroke={conn.active ? "hsl(var(--stellar-accent))" : "hsl(var(--glass-border))"}
              strokeWidth="1"
              opacity={conn.active ? 0.8 : 0.3}
              className="transition-all duration-300"
            />
          ))}
        </svg>
      </div>

      {/* Data flow particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-stellar-accent rounded-full opacity-60"
            style={{
              top: `${30 + (i % 4) * 15}%`,
              left: `${30 + Math.floor(i / 4) * 30}%`,
              animation: `pulse 2s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Stage1Analysis;