// components/HUD.tsx
import { Trophy, Heart, Pause, Zap, Target, CheckCircle, XCircle } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';

export default function HUD() {
  const { score, lives, speed, stats, gates, lastAnswerCorrect, actions } = useGameStore();

  // Get the gate that's CLOSEST to the player (highest position, not passed yet)
  const visibleGates = gates.filter(g => !g.passed && g.position >= -10);
  const closestGate = visibleGates.length > 0
    ? visibleGates.reduce((closest, gate) => gate.position > closest.position ? gate : closest)
    : null;
  const currentQuestion = closestGate?.question || '';

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-30 flex flex-col justify-between p-4 md:p-6 select-none">

      {/* TOP AREA */}
      <div className="flex justify-between items-start w-full gap-4">

        {/* LEFT: Question Display */}
        <div className="flex-1 max-w-sm transform transition-all duration-300">
          {currentQuestion && (
            <div className={`relative overflow-hidden bg-slate-900/80 backdrop-blur-xl rounded-2xl border shadow-2xl transition-all duration-300 ${lastAnswerCorrect === true
              ? 'border-green-500/50 shadow-green-500/20'
              : lastAnswerCorrect === false
                ? 'border-red-500/50 shadow-red-500/20'
                : 'border-white/10 shadow-black/40'
              }`}>
              {/* Feedback Glow */}
              {lastAnswerCorrect !== null && (
                <div className={`absolute inset-0 opacity-20 ${lastAnswerCorrect ? 'bg-green-500' : 'bg-red-500'}`} />
              )}

              <div className="relative px-6 py-4 md:px-4 md:py-5">
                <div className="text-base md:text-lg font-black text-white leading-tight drop-shadow-lg">
                  {currentQuestion}
                </div>
              </div>

              {/* Feedback Icon */}
              {lastAnswerCorrect !== null && (
                <div className="absolute top-1/2 right-4 -translate-y-1/2 hidden lg:block">
                  {lastAnswerCorrect ? (
                    <CheckCircle size={28} className="text-green-400 animate-bounce drop-shadow-lg" />
                  ) : (
                    <XCircle size={28} className="text-red-400 animate-bounce drop-shadow-lg" />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Stats & Controls */}
        <div className="flex flex-col gap-3 items-end">

          {/* Row 1: Score & Pause */}
          <div className="flex items-center gap-3">
            {/* Score */}
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md pl-5 pr-6 py-2 rounded-xl border border-yellow-500/20 shadow-lg shadow-yellow-900/10">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <Trophy className="text-yellow-400" size={16} />
                </div>
                <div className="text-right">
                  <div className="font-mono text-xl md:text-2xl font-black text-yellow-100 leading-none tracking-tight">
                    {score.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Pause Button */}
            <button
              onClick={actions.togglePause}
              className="pointer-events-auto p-3 bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800/80 hover:border-indigo-500/50 transition-all shadow-lg group"
            >
              <Pause size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Row 2: Lives & Speed */}
          <div className="flex items-center gap-3">
            {/* Lives */}
            <div className="flex items-center gap-1 bg-slate-900/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 shadow-lg">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    size={18}
                    className={`transition-all drop-shadow-md ${i < lives
                      ? 'text-red-500 fill-red-500'
                      : 'text-slate-700 fill-slate-800'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Speed */}
            <div className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-lg">
              <div className="p-1 bg-cyan-500/20 rounded-lg">
                <Zap size={14} className="text-cyan-400" />
              </div>
              <div className="font-mono text-base font-bold text-cyan-100 leading-none">
                {Math.round(speed * 100)} <span className="text-[10px] text-cyan-500/60 font-normal">km/h</span>
              </div>
            </div>
          </div>

          {/* Row 3: Accuracy */}
          <div className="bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-lg flex items-center gap-3">
            <Target size={14} className="text-purple-400" />
            <div className="h-3 w-px bg-white/10" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accuracy</span>
              <span className={`font-mono text-base font-bold ${stats.accuracy >= 80 ? 'text-green-400' :
                stats.accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                {stats.accuracy}%
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}