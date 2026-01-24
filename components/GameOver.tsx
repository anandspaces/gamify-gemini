// components/GameOver.tsx
import { motion } from 'framer-motion';
import { Trophy, RefreshCw } from 'lucide-react';
import { GameOverProps } from '@/types/types';


export default function GameOver({ score, onRestart }: GameOverProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-lg p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-slate-900 border border-indigo-500/50 p-8 rounded-2xl text-center shadow-[0_0_50px_rgba(79,70,229,0.3)]"
      >
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400 mb-2">
          FINISH LINE!
        </h1>
        <p className="text-slate-400 mb-8">Race Completed</p>

        <div className="flex justify-center mb-8">
          <div className="relative">
            <Trophy className="text-yellow-400 w-24 h-24 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full -z-10"
            />
          </div>
        </div>

        <div className="text-5xl font-mono font-bold text-white mb-8">
          {score} <span className="text-lg text-slate-500">PTS</span>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2"
        >
          <RefreshCw size={20} />
          PLAY AGAIN
        </button>
      </motion.div>
    </div>
  );
}