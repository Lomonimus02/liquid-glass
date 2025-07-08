import { Play, Pause, SkipBack, SkipForward, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimationControlsProps } from "./types";
const AnimationControls = ({
  isPlaying,
  speed,
  currentStep,
  totalSteps,
  onPlayPause,
  onSpeedChange,
  onStepChange
}: AnimationControlsProps) => {
  const speedOptions = [0.5, 1, 1.5, 2];
  
  return (
    <div className="flex items-center justify-center gap-4 glass-card p-4 mb-8">
      <Button
        onClick={() => onStepChange(Math.max(0, currentStep - 1))}
        variant="outline"
        size="sm"
        disabled={currentStep === 0}
      >
        <SkipBack className="w-4 h-4" />
      </Button>
      
      <Button onClick={onPlayPause} variant="outline" size="sm">
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>
      
      <Button
        onClick={() => onStepChange(Math.min(totalSteps - 1, currentStep + 1))}
        variant="outline"
        size="sm"
        disabled={currentStep === totalSteps - 1}
      >
        <SkipForward className="w-4 h-4" />
      </Button>
      
      <div className="flex items-center gap-2 ml-4">
        <Gauge className="w-4 h-4 text-stellar-accent" />
        <span className="text-sm text-text-secondary">Скорость:</span>
        {speedOptions.map((option) => (
          <Button
            key={option}
            onClick={() => onSpeedChange(option)}
            variant={speed === option ? "default" : "outline"}
            size="sm"
            className="min-w-[3rem]"
          >
            {option}x
          </Button>
        ))}
      </div>
    </div>
  );
};
export default AnimationControls;