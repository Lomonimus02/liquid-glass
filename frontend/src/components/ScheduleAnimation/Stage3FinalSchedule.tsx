import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { daysOfWeek, timeSlotLabels, subjects } from "./data";
import { useIsMobile } from '@/hooks/use-mobile';

interface ScheduleCell {
  subject: string;
  teacher: string;
  classroom: string;
  color: string;
  built: boolean;
}

const Stage3FinalSchedule = () => {
  const [schedule, setSchedule] = useState<{ [key: string]: ScheduleCell }>({});
  const [buildingStep, setBuildingStep] = useState(0);
  const [stats, setStats] = useState({
    totalLessons: 0,
    teachersScheduled: 0,
    efficiency: 0
  });
  const isMobile = useIsMobile();

  const scheduleData = [
    // Monday
    { day: 0, time: 0, subject: "Математика", teacher: "Иванов И.И.", classroom: "205", color: "text-blue-400" },
    { day: 0, time: 1, subject: "Физика", teacher: "Петрова А.С.", classroom: "301", color: "text-purple-400" },
    { day: 0, time: 2, subject: "Химия", teacher: "Сидоров В.П.", classroom: "102", color: "text-green-400" },

    // Tuesday
    { day: 1, time: 0, subject: "История", teacher: "Козлова М.Н.", classroom: "203", color: "text-orange-400" },
    { day: 1, time: 1, subject: "География", teacher: "Федоров Д.А.", classroom: "204", color: "text-teal-400" },
    { day: 1, time: 2, subject: "Литература", teacher: "Морозова Е.В.", classroom: "201", color: "text-pink-400" },

    // Wednesday
    { day: 2, time: 0, subject: "Биология", teacher: "Петрова А.С.", classroom: "103", color: "text-emerald-400" },
    { day: 2, time: 1, subject: "Английский", teacher: "Морозова Е.В.", classroom: "206", color: "text-cyan-400" },
    { day: 2, time: 2, subject: "Математика", teacher: "Иванов И.И.", classroom: "205", color: "text-blue-400" },

    // Thursday
    { day: 3, time: 0, subject: "Физика", teacher: "Петрова А.С.", classroom: "301", color: "text-purple-400" },
    { day: 3, time: 1, subject: "Химия", teacher: "Сидоров В.П.", classroom: "102", color: "text-green-400" },
    { day: 3, time: 2, subject: "История", teacher: "Козлова М.Н.", classroom: "203", color: "text-orange-400" },

    // Friday
    { day: 4, time: 0, subject: "География", teacher: "Федоров Д.А.", classroom: "204", color: "text-teal-400" },
    { day: 4, time: 1, subject: "Литература", teacher: "Морозова Е.В.", classroom: "201", color: "text-pink-400" },
    { day: 4, time: 2, subject: "Биология", teacher: "Петрова А.С.", classroom: "103", color: "text-emerald-400" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (buildingStep < scheduleData.length) {
        const item = scheduleData[buildingStep];
        const dayName = daysOfWeek[item.day];
        const timeSlot = timeSlotLabels[item.time];
        const key = `${dayName}-${timeSlot}`;

        setSchedule(prev => ({
          ...prev,
          [key]: {
            subject: item.subject,
            teacher: item.teacher,
            classroom: item.classroom,
            color: item.color,
            built: true
          }
        }));

        setBuildingStep(prev => prev + 1);

        // Update stats
        setStats(prev => ({
          totalLessons: buildingStep + 1,
          teachersScheduled: new Set(scheduleData.slice(0, buildingStep + 1).map(s => s.teacher)).size,
          efficiency: Math.min(100, ((buildingStep + 1) / scheduleData.length) * 100)
        }));
      }
    }, 300);

    return () => clearInterval(interval);
  }, [buildingStep]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-stellar-accent mb-2 flex items-center justify-center gap-2">
          <Calendar className="w-5 h-5 animate-pulse" />
          Готовое расписание
        </h3>
        
        {/* Stats */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="glass-card p-2 text-xs">
            <div className="text-stellar-accent font-medium">{stats.totalLessons}</div>
            <div className="text-text-secondary">Уроков</div>
          </div>
          <div className="glass-card p-2 text-xs">
            <div className="text-stellar-accent font-medium">{stats.teachersScheduled}</div>
            <div className="text-text-secondary">Учителей</div>
          </div>
          <div className="glass-card p-2 text-xs">
            <div className="text-stellar-accent font-medium">{Math.round(stats.efficiency)}%</div>
            <div className="text-text-secondary">Эффективность</div>
          </div>
        </div>
      </div>

      {/* Weekly schedule grid - адаптированная для мобильных */}
      <div className={`grid gap-2 text-xs ${isMobile ? 'grid-cols-3' : 'grid-cols-6'}`}>
        {/* Header row */}
        <div className="text-center font-medium text-stellar-accent p-2">
          Время
        </div>
        {(isMobile ? daysOfWeek.slice(0, 2) : daysOfWeek).map((day, dayIndex) => (
          <div key={dayIndex} className="text-center font-medium text-stellar-accent p-2 glass-card">
            {isMobile ? day.slice(0, 2) : day.slice(0, 3)}
          </div>
        ))}

        {/* Time slots and schedule */}
        {timeSlotLabels.map((time, timeIndex) => (
          <div key={timeIndex} className="contents">
            {/* Time label */}
            <div className="text-center p-2 glass-card text-stellar-accent font-medium flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" />
              {time}
            </div>

            {/* Schedule cells for each day */}
            {(isMobile ? daysOfWeek.slice(0, 2) : daysOfWeek).map((day, dayIndex) => {
              const key = `${day}-${time}`;
              const cell = schedule[key];

              return (
                <div
                  key={key}
                  className={`p-2 rounded-3xl text-center transition-all duration-700 flex flex-col justify-center ${
                    isMobile ? 'min-h-[60px]' : 'min-h-[80px]'
                  } ${
                    cell && cell.built
                      ? 'glass-card text-stellar-accent animate-build-in'
                      : 'glass-card opacity-50'
                  }`}
                  style={{
                    animationDelay: `${(dayIndex + timeIndex) * 0.2}s`
                  }}
                >
                  {cell && cell.built && (
                    <>
                      <div className={`font-medium ${cell.color} flex items-center justify-center gap-1`}>
                        <CheckCircle2 className={isMobile ? 'w-2 h-2' : 'w-3 h-3'} />
                        <span className={isMobile ? 'text-[9px]' : 'text-xs'}>
                          {isMobile ? cell.subject.slice(0, 6) + (cell.subject.length > 6 ? '...' : '') : cell.subject}
                        </span>
                      </div>
                      <div className={`text-text-secondary mt-1 ${isMobile ? 'text-[8px]' : 'text-[10px]'}`}>
                        {isMobile ? cell.teacher.split(' ')[0].slice(0, 5) + '.' : cell.teacher.split(' ')[0]}
                      </div>
                      <div className={`text-stellar-accent/70 flex items-center justify-center gap-1 ${isMobile ? 'text-[8px]' : 'text-[10px]'}`}>
                        <MapPin className={isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'} />
                        {cell.classroom}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

    </div>
  );
};

export default Stage3FinalSchedule;