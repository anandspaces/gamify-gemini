// components/Track.tsx
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import Gate from './Gate';

export default function Track() {
  const { gates } = useGameStore();

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950 perspective-500">
      {/* Moving Grid Floor Effect */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(66, 220, 219, .3) 25%, rgba(66, 220, 219, .3) 26%, transparent 27%, transparent 74%, rgba(66, 220, 219, .3) 75%, rgba(66, 220, 219, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(66, 220, 219, .3) 25%, rgba(66, 220, 219, .3) 26%, transparent 27%, transparent 74%, rgba(66, 220, 219, .3) 75%, rgba(66, 220, 219, .3) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }}
        animate={{ backgroundPosition: ['0px 0px', '0px 50px'] }}
        transition={{ repeat: Infinity, duration: 0.2, ease: "linear" }}
      />

      {/* The 4 Lanes */}
      <div className="relative w-full max-w-3xl mx-auto h-full flex border-x-4 border-indigo-500/30 bg-slate-900/80 backdrop-blur-sm shadow-[0_0_50px_rgba(79,70,229,0.2)]">
        {[0, 1, 2, 3].map((lane) => (
          <div key={lane} className="relative flex-1 h-full border-r border-dashed border-indigo-500/20 last:border-none">
            {/* Lane Number/Indicator */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-indigo-900 font-black text-6xl opacity-20">
              {['A', 'B', 'C', 'D'][lane]}
            </div>
          </div>
        ))}

        {/* Render Gates */}
        {gates.map((gate) => (
          <Gate key={gate.id} options={gate.options} position={gate.position} question={gate.question} />
        ))}
      </div>
    </div>
  );
}