// components/HUD.tsx
import { motion } from 'framer-motion';
import { Timer, Trophy } from 'lucide-react';

interface HUDProps {
  question: string;
  score: number;
  timeLeft: number;
}

export default function HUD({ question, score, timeLeft }: HUDProps) {
  const progress = (timeLeft / 10) * 100;

  return (
    <div className="absolute top-0 left-0 w-full p-4 z-30 pointer-events-none">
      <div className="max-w-3xl mx-auto">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          {/* Timer */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-indigo-500/50 px-4 py-2 rounded-full text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Timer className={`${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-indigo-400'}`} size={20} />
            <span className={`font-mono text-xl font-bold ${timeLeft <= 3 ? 'text-red-500' : 'text-white'}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-yellow-500/50 px-4 py-2 rounded-full text-white shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            <Trophy className="text-yellow-400" size={20} />
            <span className="font-mono text-xl font-bold text-yellow-100">{score}</span>
          </div>
        </div>

        {/* Question Card */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          key={question} // Re-animate on question change
          className="bg-slate-900/90 border border-indigo-500/50 p-6 rounded-2xl text-center shadow-2xl backdrop-blur-md"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide leading-relaxed">
            {question}
          </h2>
          
          {/* Time Progress Bar */}
          <div className="w-full h-1 bg-gray-800 mt-4 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${timeLeft <= 3 ? 'bg-red-500' : 'bg-indigo-500'}`}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}