// components/Screens.tsx
import { Play, RotateCcw, Trophy, Target, Zap, Brain } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';

export function StartScreen() {
    const { actions } = useGameStore();
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-indigo-950/50 to-slate-950 backdrop-blur-sm p-4 md:p-6 text-center animate-fadeIn">
            <div className="mb-4 sm:mb-6 md:mb-8 animate-slideDown">
                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(99,102,241,0.8)] animate-pulse leading-tight">
                    IQ RACER
                </h1>
                <div className="h-1 sm:h-1.5 md:h-2 w-32 sm:w-48 md:w-64 mx-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-expandWidth" />
            </div>

            <div className="max-w-2xl mb-6 sm:mb-8 md:mb-12 px-3 sm:px-4">
                <p className="text-slate-300 text-sm sm:text-base md:text-xl lg:text-2xl mb-4 sm:mb-5 md:mb-6 leading-relaxed font-medium">
                    Race through the IQ highway and test your knowledge!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 text-sm">
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-indigo-500/30 rounded-lg p-2.5 sm:p-3 md:p-4">
                        <Trophy className="mx-auto mb-1.5 sm:mb-2" size={24} />
                        <div className="text-indigo-300 font-bold text-xs sm:text-sm md:text-base">Earn Points</div>
                        <div className="text-slate-400 text-xs mt-1">+100 per correct answer</div>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-indigo-500/30 rounded-lg p-2.5 sm:p-3 md:p-4">
                        <Zap className="mx-auto mb-1.5 sm:mb-2 text-cyan-400" size={24} />
                        <div className="text-indigo-300 font-bold text-xs sm:text-sm md:text-base">Speed Up</div>
                        <div className="text-slate-400 text-xs mt-1">Get faster with each win</div>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-indigo-500/30 rounded-lg p-2.5 sm:p-3 md:p-4">
                        <Target className="mx-auto mb-1.5 sm:mb-2 text-red-400" size={24} />
                        <div className="text-indigo-300 font-bold text-xs sm:text-sm md:text-base">3 Lives</div>
                        <div className="text-slate-400 text-xs mt-1">Don&apos;t crash!</div>
                    </div>
                </div>
            </div>

            <button
                onClick={actions.startGame}
                className="group relative px-8 py-3 sm:px-10 sm:py-4 md:px-16 md:py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-lg sm:text-xl md:text-2xl font-black rounded-xl sm:rounded-2xl transition-all shadow-[0_0_40px_rgba(79,70,229,0.6)] hover:shadow-[0_0_60px_rgba(79,70,229,0.9)] hover:scale-105 active:scale-95 overflow-hidden animate-slideUp"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                <div className="relative flex items-center gap-2 sm:gap-2.5 md:gap-3">
                    <Play fill="currentColor" size={24} className="sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:animate-pulse" />
                    <span>START RACE</span>
                </div>
            </button>

            <div className="mt-4 sm:mt-6 md:mt-8 text-slate-500 text-xs sm:text-sm">
                Press <kbd className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-slate-800 border border-slate-700 rounded text-slate-400 font-mono text-xs">ESC</kbd> to pause
            </div>
        </div>
    );
}

export function GameOverScreen() {
    const { score, stats, actions } = useGameStore();

    const calculateIQ = () => {
        const accuracyBonus = stats.accuracy * 0.5;
        const scoreBonus = Math.min(score / 100, 30);
        const errorPenalty = (stats.total - stats.correct) * 2;
        const consistencyBonus = stats.total >= 10 ? 10 : stats.total;

        const rawIQ = 100 + accuracyBonus + scoreBonus + consistencyBonus - errorPenalty;
        return Math.round(Math.max(70, Math.min(150, rawIQ)));
    };

    const iqScore = calculateIQ();

    const getIQCategory = (iq: number) => {
        if (iq >= 140) return { category: 'Genius', color: 'from-yellow-400 to-orange-400' };
        if (iq >= 130) return { category: 'Very Superior', color: 'from-purple-400 to-pink-400' };
        if (iq >= 120) return { category: 'Superior', color: 'from-green-400 to-emerald-400' };
        if (iq >= 110) return { category: 'High Average', color: 'from-blue-400 to-cyan-400' };
        if (iq >= 90) return { category: 'Average', color: 'from-indigo-400 to-purple-400' };
        if (iq >= 80) return { category: 'Low Average', color: 'from-slate-400 to-slate-500' };
        return { category: 'Below Average', color: 'from-red-400 to-orange-400' };
    };

    const iqInfo = getIQCategory(iqScore);

    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-red-950/90 via-slate-950/95 to-slate-950 backdrop-blur-md p-3 sm:p-4 md:p-6 text-center overflow-y-auto animate-fadeIn">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-2 sm:mb-3 md:mb-4 drop-shadow-[0_0_40px_rgba(220,38,38,0.8)] animate-slideDown">
                RACE OVER
            </h2>

            {/* IQ Score Display */}
            <div className="mb-4 sm:mb-6 md:mb-8">
                <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-2">
                    <Brain className="text-purple-400 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
                    <div className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-br ${iqInfo.color} bg-clip-text text-transparent`}>
                        {iqScore}
                    </div>
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">IQ Score</div>
                <div className={`text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r ${iqInfo.color} bg-clip-text text-transparent`}>
                    {iqInfo.category}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12 max-w-3xl w-full px-3 sm:px-4">
                <div className="bg-gradient-to-br from-yellow-900/50 to-amber-900/50 backdrop-blur-sm border-2 border-yellow-500/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg">
                    <Trophy className="mx-auto mb-1.5 sm:mb-2 md:mb-3 text-yellow-400 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" />
                    <div className="text-xs sm:text-xs md:text-sm uppercase tracking-widest text-yellow-200/70 mb-1 sm:mb-2">Final Score</div>
                    <div className="text-2xl sm:text-3xl md:text-5xl font-black text-yellow-100">{score.toLocaleString()}</div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-sm border-2 border-purple-500/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg">
                    <Target className="mx-auto mb-1.5 sm:mb-2 md:mb-3 text-purple-400 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" />
                    <div className="text-xs sm:text-xs md:text-sm uppercase tracking-widest text-purple-200/70 mb-1 sm:mb-2">Accuracy</div>
                    <div className="text-2xl sm:text-3xl md:text-5xl font-black text-purple-100">{stats.accuracy}%</div>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 backdrop-blur-sm border-2 border-cyan-500/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg">
                    <Zap className="mx-auto mb-1.5 sm:mb-2 md:mb-3 text-cyan-400 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" />
                    <div className="text-xs sm:text-xs md:text-sm uppercase tracking-widest text-cyan-200/70 mb-1 sm:mb-2">Correct</div>
                    <div className="text-2xl sm:text-3xl md:text-5xl font-black text-cyan-100">{stats.correct}/{stats.total}</div>
                </div>
            </div>

            <button
                onClick={actions.restartGame}
                className="group relative px-8 py-3 sm:px-10 sm:py-4 md:px-12 md:py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-base sm:text-lg md:text-xl font-black rounded-xl transition-all shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_50px_rgba(99,102,241,0.8)] hover:scale-105 active:scale-95 overflow-hidden animate-slideUp"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                <div className="relative flex items-center gap-2 sm:gap-2.5 md:gap-3">
                    <RotateCcw size={18} className="sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
                    <span>RACE AGAIN</span>
                </div>
            </button>
        </div>
    );
}

export function PauseScreen() {
    const { actions } = useGameStore();
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-lg p-3 sm:p-4 md:p-6 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 sm:mb-8 md:mb-12 tracking-widest drop-shadow-lg">
                PAUSED
            </h2>

            <button
                onClick={actions.togglePause}
                className="px-8 py-3 sm:px-10 sm:py-4 md:px-12 md:py-5 border-3 sm:border-4 border-white text-white hover:bg-white hover:text-slate-900 text-lg sm:text-xl md:text-2xl font-black rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2 sm:gap-2.5 md:gap-3"
            >
                <Play fill="currentColor" size={20} className="sm:w-6 sm:h-6" />
                <span>RESUME</span>
            </button>

            <div className="mt-4 sm:mt-6 md:mt-8 text-slate-400 text-xs sm:text-sm">
                Press <kbd className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono text-xs">ESC</kbd> or <kbd className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono text-xs">P</kbd> to resume
            </div>
        </div>
    );
}