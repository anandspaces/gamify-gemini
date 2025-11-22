// components/Controls.tsx
import { motion } from 'framer-motion';

interface ControlsProps {
  options: string[];
  onSelect: (index: number) => void;
  disabled: boolean;
  correctAnswer: number | null; // Revealed during feedback
  selectedAnswer: number | null;
}

export default function Controls({ options, onSelect, disabled, correctAnswer, selectedAnswer }: ControlsProps) {
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-slate-950 to-transparent pt-12 pb-6 px-4 z-30">
      <div className="max-w-3xl mx-auto grid grid-cols-4 gap-2 md:gap-4">
        {options.map((opt, idx) => {
          // Determine color based on state
          let btnColor = "bg-slate-900/80 border-indigo-500/30 hover:bg-indigo-900/40"; // Default
          
          if (disabled && selectedAnswer === idx) {
             // This is what user picked
             if (idx === correctAnswer) btnColor = "bg-green-900/80 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]";
             else btnColor = "bg-red-900/80 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]";
          } else if (disabled && idx === correctAnswer) {
             // Reveal correct answer if user missed it
             btnColor = "bg-green-900/80 border-green-500 opacity-50";
          }

          return (
            <motion.button
              key={idx}
              disabled={disabled}
              onClick={() => onSelect(idx)}
              whileTap={{ scale: 0.95 }}
              className={`
                relative flex flex-col items-center justify-center p-2 md:p-4 rounded-xl 
                border-2 transition-all duration-200 min-h-[100px]
                ${btnColor}
                ${disabled ? 'cursor-default' : 'cursor-pointer active:scale-95'}
              `}
            >
              <span className="text-xs md:text-sm font-bold text-slate-400 mb-1">{letters[idx]}</span>
              <span className="text-xs md:text-base font-bold text-white text-center leading-tight">{opt}</span>
              
              {/* Neon Glow on Active */}
              {!disabled && (
                <div className="absolute inset-0 rounded-xl hover:shadow-[inset_0_0_20px_rgba(99,102,241,0.2)] transition-shadow" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}