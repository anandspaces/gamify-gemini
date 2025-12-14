// components/HUD.tsx
import { Trophy, Heart, Pause, Zap, Target } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { useEffect, useState } from 'react';

export default function HUD() {
  const { score, lives, speed, stats, lastAnswerCorrect, actions, currentQuestionText, selectedLane } = useGameStore();
  const [prevLives, setPrevLives] = useState(lives);
  const [livesShake, setLivesShake] = useState(false);

  // Use the explicitly managed question text from the store
  // This ensures the question stays the same during feedback and only changes when new gate spawns
  const currentQuestion = currentQuestionText || '';

  // Trigger shake animation when lives decrease
  useEffect(() => {
    if (lives < prevLives) {
      setLivesShake(true);
      setTimeout(() => setLivesShake(false), 500);
    }
    setPrevLives(lives);
  }, [lives, prevLives]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-30 select-none">
      
      {/* Mobile Lane Buttons - Bottom of screen */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 sm:hidden pointer-events-auto">
        {['A', 'B', 'C', 'D'].map((lane, idx) => (
          <button
            key={lane}
            onClick={() => actions.moveCar(idx)}
            className={`w-14 h-14 rounded-xl font-black text-lg transition-all shadow-lg ${
              idx === (selectedLane ?? 1)
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white scale-110 shadow-indigo-500/50'
                : 'bg-slate-900/80 backdrop-blur-md text-slate-300 border border-white/20 active:scale-95'
            }`}
          >
            {lane}
          </button>
        ))}
      </div>

      {/* TOP LEFT - Score and Lives */}
      <div className="absolute left-2 sm:left-4 md:left-6 top-2 sm:top-4 md:top-6 flex flex-col gap-2 sm:gap-2.5">
        {/* Score */}
        <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-lg sm:rounded-xl border border-yellow-500/20 shadow-lg shadow-yellow-900/10">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="p-1 sm:p-1.5 bg-yellow-500/10 rounded border border-yellow-500/20">
              <Trophy className="text-yellow-400" size={12} />
            </div>
            <div className="flex flex-col">
              <div className="font-mono text-base sm:text-lg md:text-xl font-black text-yellow-100 leading-none tracking-tight">
                {score.toLocaleString()}
              </div>
              <div className="text-[8px] sm:text-[9px] text-yellow-500/60 uppercase tracking-wider mt-0.5">Score</div>
            </div>
          </div>
        </div>

        {/* Lives */}
        <div className={`bg-slate-900/60 backdrop-blur-md px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-lg sm:rounded-xl border border-white/10 shadow-lg transition-all ${livesShake ? 'animate-shake border-red-500/50' : ''}`}>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex gap-0.5 sm:gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  size={14}
                  className={`sm:w-4 sm:h-4 transition-all drop-shadow-md ${i < lives
                    ? 'text-red-500 fill-red-500 animate-pulse'
                    : 'text-slate-700 fill-slate-800'
                    } `}
                />
              ))}
            </div>
            <div className="text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-wider">Lives</div>
          </div>
        </div>
      </div>

      {/* TOP RIGHT - Speed, Accuracy, and Pause */}
      <div className="absolute right-2 sm:right-4 md:right-6 top-2 sm:top-4 md:top-6 flex flex-col gap-2 sm:gap-2.5">
        {/* Speed */}
        <div className="bg-slate-900/60 backdrop-blur-md px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-lg sm:rounded-xl border border-white/10 shadow-lg">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="p-0.5 sm:p-1 bg-cyan-500/20 rounded">
              <Zap size={12} className="sm:w-3.5 sm:h-3.5 text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <div className="font-mono text-xs sm:text-sm font-bold text-cyan-100 leading-none">
                {Math.round(speed * 100)}
              </div>
              <div className="text-[8px] sm:text-[9px] text-cyan-500/60 uppercase tracking-wider mt-0.5">km/h</div>
            </div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-slate-900/60 backdrop-blur-md px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-lg sm:rounded-xl border border-white/10 shadow-lg">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Target size={12} className="sm:w-3.5 sm:h-3.5 text-purple-400" />
            <div className="flex flex-col">
              <div className={`font-mono text-xs sm:text-sm font-bold leading-none ${stats.accuracy >= 80 ? 'text-green-400' :
                stats.accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'
                } `}>
                {stats.accuracy}%
              </div>
              <div className="text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">Acc</div>
            </div>
          </div>
        </div>

        {/* Pause Button */}
        <button
          onClick={actions.togglePause}
          className="pointer-events-auto p-2 sm:p-2.5 bg-slate-900/60 backdrop-blur-md rounded-lg sm:rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800/80 hover:border-indigo-500/50 transition-all shadow-lg group self-end"
        >
          <Pause size={14} className="sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* TOP CENTER - Compact Question (only when present) */}
      {currentQuestion && (
        <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 max-w-md sm:max-w-lg md:max-w-xl w-auto px-2">
          <div className={`relative overflow-hidden bg-slate-900/90 backdrop-blur-xl rounded-lg sm:rounded-xl border shadow-xl transition-all duration-300 px-3 py-1.5 sm:px-4 sm:py-2 ${lastAnswerCorrect === true
            ? 'border-green-500/50 shadow-green-500/20 animate-pulse'
            : lastAnswerCorrect === false
              ? 'border-red-500/50 shadow-red-500/20 animate-pulse'
              : 'border-white/10 shadow-black/40'
            } `}>
            {/* Feedback Glow */}
            {lastAnswerCorrect !== null && (
              <div className={`absolute inset-0 opacity-20 ${lastAnswerCorrect ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
            )}

            <div className="relative text-center">
              <div className="text-xs sm:text-sm md:text-base font-bold text-white leading-tight drop-shadow-lg">
                {currentQuestion}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Feedback Flash */}
      {lastAnswerCorrect !== null && (
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          lastAnswerCorrect 
            ? 'bg-green-500/10 animate-pulse' 
            : 'bg-red-500/10 animate-pulse'
        }`} />
      )}
    </div>
  );
}