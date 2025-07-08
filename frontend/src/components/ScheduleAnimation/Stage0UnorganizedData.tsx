import { useState, useEffect } from "react";
import { teachers, subjects } from "./data";

const Stage0UnorganizedData = () => {
  const [positions, setPositions] = useState<{ [key: string]: { x: number; y: number } }>({});

  useEffect(() => {
    // Generate better distributed positions for chaotic but visible effect
    const newPositions: { [key: string]: { x: number; y: number } } = {};
    const allItems = [...teachers, ...subjects.map(s => ({ ...s, id: `subject-${s.id}` }))];

    // Create a grid-like distribution with randomness
    const cols = 4;
    const rows = Math.ceil(allItems.length / cols);

    allItems.forEach((item, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);

      // Base position in grid
      const baseX = (col + 0.5) * (100 / cols);
      const baseY = (row + 0.5) * (100 / rows);

      // Add randomness while keeping items visible
      const randomOffsetX = (Math.random() - 0.5) * 15; // ±7.5%
      const randomOffsetY = (Math.random() - 0.5) * 15; // ±7.5%

      newPositions[item.id] = {
        x: Math.max(8, Math.min(92, baseX + randomOffsetX)),
        y: Math.max(8, Math.min(85, baseY + randomOffsetY))
      };
    });

    setPositions(newPositions);
  }, []);

  return (
    <div className="relative h-full">
      <h3 className="text-lg font-semibold text-stellar-accent mb-4 text-center">
        Неорганизованные данные
      </h3>
      
      <div className="relative h-96 overflow-hidden">
        {/* Teacher cards */}
        {teachers.map((teacher, index) => (
          <div
            key={teacher.id}
            className="absolute p-3 glass-card-subtle text-sm animate-shake hover:animate-pulse transition-all cursor-pointer"
            style={{
              left: `${positions[teacher.id]?.x || 0}%`,
              top: `${positions[teacher.id]?.y || 0}%`,
              animationDelay: `${index * 0.2}s`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="font-medium text-text-primary">{teacher.name}</div>
            <div className="text-xs text-text-secondary mt-1">
              {teacher.subjects.join(", ")}
            </div>
          </div>
        ))}
        
        {/* Subject cards */}
        {subjects.map((subject, index) => (
          <div
            key={`subject-${subject.id}`}
            className="absolute p-3 glass-card-subtle text-sm animate-shake hover:animate-pulse transition-all cursor-pointer"
            style={{
              left: `${positions[`subject-${subject.id}`]?.x || 0}%`,
              top: `${positions[`subject-${subject.id}`]?.y || 0}%`,
              animationDelay: `${(index + teachers.length) * 0.2}s`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className={`font-medium ${subject.color}`}>{subject.name}</div>
            <div className="text-xs text-text-secondary mt-1">
              {subject.duration} мин
            </div>
          </div>
        ))}
        
        {/* Chaos indicators */}
        <div className="absolute top-4 right-4 glass-card p-2">
          <div className="text-xs text-destructive font-medium animate-pulse">
            ⚠️ Требует организации
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stage0UnorganizedData;