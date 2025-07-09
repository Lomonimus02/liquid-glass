// Файл: data.ts (ИЗМЕНЕН)

// --- 1. Импортируем все нужные Lottie-анимации ---
import { Teacher, Subject, ScheduleStep, TimeSlot } from "./types";
import chatbotAnimationData from '../animations/Chatbot.json';
import timeAnimationData from '../animations/time.json';
import todoAnimationData from '../animations/To Do.json';
import calendarAnimationData from '../animations/calendar.json';


export const teachers: Teacher[] = [
  { id: "1", name: "Иванов И.И.", subjects: ["Математика", "Физика"], workingHours: ["09:00-15:00"] },
  { id: "2", name: "Петрова А.С.", subjects: ["Химия", "Биология"], workingHours: ["08:00-14:00"] },
  // ... и так далее
];

export const subjects: Subject[] = [
  { id: "1", name: "Математика", color: "text-blue-400", duration: 45 },
  { id: "2", name: "Физика", color: "text-purple-400", duration: 45 },
  // ... и так далее
];

export const timeSlots: TimeSlot[] = [
  { id: "1", time: "08:00", day: "Понедельник" },
  { id: "2", time: "09:00", day: "Понедельник" },
  { id: "3", time: "10:00", day: "Понедельник" }
];

// --- 2. Восстанавливаем все 4 этапа включая "Оптимизация времени" ---
export const scheduleSteps: ScheduleStep[] = [
  {
    id: 0,
    title: "Анализ ограничений",
    description: "ИИ анализирует данные",
    animationData: chatbotAnimationData,
    color: "text-stellar-primary",
    duration: 10000
  },
  {
    id: 1,
    title: "Оптимизация времени",
    description: "Алгоритм находит оптимальное распределение уроков",
    animationData: timeAnimationData,
    color: "text-stellar-accent",
    duration: 24000
  },
  {
    id: 2,
    title: "Проверка конфликтов",
    description: "Система автоматически обнаруживает и устраняет временные пересечения и конфликты ресурсов",
    animationData: todoAnimationData,
    color: "text-stellar-glow",
    duration: 14000
  },
  {
    id: 3,
    title: "Готовое расписание",
    description: "Идеальное расписание создано!",
    animationData: calendarAnimationData,
    color: "text-stellar-primary-light",
    duration: 5000
  }
];

export const daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"];
export const timeSlotLabels = ["08:00", "09:00", "10:00"];