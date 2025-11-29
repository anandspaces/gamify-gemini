// components/HUD.tsx
import { Trophy, Heart, Pause, Zap, Target, CheckCircle, XCircle } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';

export default function HUD() {
  const { score, lives, speed, stats, gates, lastAnswerCorrect, actions } = useGameStore();

  // Get the gate that's CLOSEST to the player (highest position, not passed yet)
  // This ensures we show the question for the gate the player is about to hit
  const visibleGates = gates.filter(g => !g.passed && g.position >= -10);
  const closestGate = visibleGates.length > 0
    ? visibleGates.reduce((closest, gate) => gate.position > closest.position ? gate : closest)
    : null;
  const currentQuestion = closestGate?.question || '';

  return (
    <div className="absolute top-0 left-0 w-full h-full p-2 md:p-4 lg:p-6 z-30 pointer-events-none">
      <div className="h-full flex items-start justify-between gap-2 md:gap-3 lg:gap-4 max-w-[1920px] mx-auto">

        {/* LEFT SIDE - Question Display (Responsive) */}
        <div className="flex-1 max-w-[280px] md:max-w-xs lg:max-w-sm">
          {currentQuestion && (
            <div className={`relative bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-md px-2 py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-3 rounded-lg border-2 shadow-lg transition-all duration-300 ${lastAnswerCorrect === true
                ? 'border-green-400/70 shadow-green-400/40'
                : lastAnswerCorrect === false
                  ? 'border-red-400/70 shadow-red-400/40'
                  : 'border-indigo-400/50 shadow-indigo-400/20'
              }`}>
              <div className="text-[8px] md:text-[9px] lg:text-[10px] uppercase tracking-widest text-indigo-300 mb-1 font-bold">Question</div>
              <div className="text-xs md:text-sm lg:text-base font-bold text-white leading-tight">
                {currentQuestion}
              </div>

              {/* Visual Feedback Indicator */}
              {lastAnswerCorrect !== null && (
                <div className={`absolute -top-1 -right-1 md:-top-1.5 md:-right-1.5 rounded-full p-1 md:p-1.5 ${lastAnswerCorrect ? 'bg-green-500' : 'bg-red-500'
                  } shadow-lg animate-bounce`}>
                  {lastAnswerCorrect ? (
                    <CheckCircle size={14} className="text-white md:w-4 md:h-4" />
                  ) : (
                    <XCircle size={14} className="text-white md:w-4 md:h-4" />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT SIDE - All Stats and Controls (Responsive) */}
        <div className="flex flex-col gap-1.5 md:gap-2 items-end">

          {/* Pause Button */}
          <button
            onClick={actions.togglePause}
            className="pointer-events-auto bg-slate-900/90 backdrop-blur-sm p-1.5 md:p-2 lg:p-2.5 rounded-lg text-white border-2 border-indigo-500/50 hover:border-indigo-400 hover:bg-indigo-600/30 transition-all shadow-lg"
          >
            <Pause size={16} className="md:w-5 md:h-5" />
          </button>

          {/* Lives Display */}
          <div className="bg-slate-900/90 backdrop-blur-sm px-2 py-1 md:px-2.5 md:py-1.5 lg:px-3 lg:py-2 rounded-lg border-2 border-red-500/50 shadow-lg">
            <div className="flex items-center gap-1 mb-0.5 md:mb-1">
              <Heart size={10} className="text-red-400 md:w-3 md:h-3" />
              <span className="text-[8px] md:text-[9px] font-bold text-red-100 uppercase tracking-wider">Lives</span>
            </div>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  size={14}
                  className={`md:w-[18px] md:h-[18px] transition-all ${i < lives
                      ? 'text-red-500 fill-red-500'
                      : 'text-slate-700 fill-slate-800'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Score */}
          <div className="bg-gradient-to-br from-yellow-900/90 to-amber-900/90 backdrop-blur-sm px-2 py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 rounded-lg border-2 border-yellow-500/50 shadow-lg">
            <div className="flex items-center gap-1 md:gap-1.5">
              <Trophy className="text-yellow-400" size={14} />
              <div>
                <div className="text-[8px] md:text-[9px] font-bold text-yellow-200/80 uppercase tracking-wider">Score</div>
                <div className="font-mono text-base md:text-lg lg:text-xl font-black text-yellow-100 leading-none">
                  {score.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Speed */}
          <div className="bg-cyan-900/90 backdrop-blur-sm px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg border-2 border-cyan-500/50 shadow-lg">
            <div className="flex items-center gap-0.5 md:gap-1">
              <Zap size={10} className="text-cyan-400 md:w-3 md:h-3" />
              <div>
                <div className="text-[7px] md:text-[8px] font-bold text-cyan-200/70 uppercase tracking-wider">Speed</div>
                <div className="font-mono text-xs md:text-sm font-bold text-cyan-100 leading-none">
                  {Math.round(speed * 100)}
                </div>
              </div>
            </div>
          </div>

          {/* Accuracy */}
          <div className="bg-purple-900/90 backdrop-blur-sm px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg border-2 border-purple-500/50 shadow-lg">
            <div className="flex items-center gap-0.5 md:gap-1">
              <Target size={10} className="text-purple-400 md:w-3 md:h-3" />
              <div>
                <div className="text-[7px] md:text-[8px] font-bold text-purple-200/70 uppercase tracking-wider">Accuracy</div>
                <div className="font-mono text-xs md:text-sm font-bold text-purple-100 leading-none">
                  {stats.accuracy}%
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}