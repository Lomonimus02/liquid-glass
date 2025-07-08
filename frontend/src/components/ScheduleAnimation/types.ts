// Файл: types.ts (ИЗМЕНЕН)

export interface Teacher {
  id: string;
  name: string;
  subjects: string[];
  workingHours: string[];
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  duration: number;
}

export interface TimeSlot {
  id: string;
  time: string;
  day: string;
}

export interface ScheduleItem {
  id: string;
  teacherId: string;
  subjectId: string;
  timeSlotId: string;
  classroom: string;
  conflict?: boolean;
}

export interface ScheduleStep {
  id: number;
  title: string;
  description: string;
  animationData: any; // <-- ИЗМЕНЕНИЕ: было 'icon: any'
  color: string;
  duration: number;
}

export interface AnimationControlsProps {
  isPlaying: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
  onPlayPause: () => void;
  onSpeedChange: (speed: number) => void;
  onStepChange: (step: number) => void;
}