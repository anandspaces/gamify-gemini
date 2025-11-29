// components/Controls.tsx
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ControlsProps {
  options?: string[]; // Deprecated but keeping for interface compat if needed
  onSelect?: (index: number) => void;
  disabled: boolean;
  correctAnswer?: number | null;
  selectedAnswer?: number | null;
}

export default function Controls({ disabled }: ControlsProps) {
  return (
    <div className="absolute bottom-4 left-0 w-full z-30 pointer-events-none">
      <div className="max-w-3xl mx-auto flex justify-between px-8">
        {/* Steering Hints */}
        {/* <div className={`flex items-center gap-2 text-white/50 ${disabled ? 'opacity-0' : 'animate-pulse'}`}>
          <ArrowLeft /> <span className="text-sm font-bold">STEER LEFT</span>
        </div>
        <div className={`flex items-center gap-2 text-white/50 ${disabled ? 'opacity-0' : 'animate-pulse'}`}>
          <span className="text-sm font-bold">STEER RIGHT</span> <ArrowRight />
        </div> */}
      </div>
    </div>
  );
}