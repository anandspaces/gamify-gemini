// components/Track.tsx
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { useState, useEffect } from 'react';
import Gate from './Gate';

export default function Track() {
  const { gates } = useGameStore();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Responsive grid settings
  const getGridSettings = () => {
    if (isMobile) {
      return {
        size: '40px 40px',
        duration: 0.25 // Slightly slower for smoother mobile animation
      };
    }
    if (isTablet) {
      return {
        size: '45px 45px',
        duration: 0.22
      };
    }
    return {
      size: '50px 50px',
      duration: 0.2
    };
  };

  const gridSettings = getGridSettings();

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Moving Grid Floor Effect - Responsive */}
      <motion.div
        className="absolute inset-0 opacity-15 sm:opacity-20"
        style={{
          backgroundImage: isMobile
            ? 'linear-gradient(0deg, transparent 24%, rgba(66, 220, 219, .25) 25%, rgba(66, 220, 219, .25) 26%, transparent 27%, transparent 74%, rgba(66, 220, 219, .25) 75%, rgba(66, 220, 219, .25) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(66, 220, 219, .25) 25%, rgba(66, 220, 219, .25) 26%, transparent 27%, transparent 74%, rgba(66, 220, 219, .25) 75%, rgba(66, 220, 219, .25) 76%, transparent 77%, transparent)'
            : 'linear-gradient(0deg, transparent 24%, rgba(66, 220, 219, .3) 25%, rgba(66, 220, 219, .3) 26%, transparent 27%, transparent 74%, rgba(66, 220, 219, .3) 75%, rgba(66, 220, 219, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(66, 220, 219, .3) 25%, rgba(66, 220, 219, .3) 26%, transparent 27%, transparent 74%, rgba(66, 220, 219, .3) 75%, rgba(66, 220, 219, .3) 76%, transparent 77%, transparent)',
          backgroundSize: gridSettings.size
        }}
        animate={{
          backgroundPosition: ['0px 0px', `0px ${gridSettings.size.split(' ')[0]}`]
        }}
        transition={{
          repeat: Infinity,
          duration: gridSettings.duration,
          ease: "linear"
        }}
      />

      {/* Perspective Lines (Horizon Effect) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent" />
      </div>

      {/* The 4 Lanes - Fully Responsive */}
      <div className="relative w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto h-full flex border-x-2 sm:border-x-3 md:border-x-4 border-indigo-500/30 bg-slate-900/70 sm:bg-slate-900/80 backdrop-blur-sm shadow-[0_0_30px_rgba(79,70,229,0.15)] sm:shadow-[0_0_40px_rgba(79,70,229,0.2)] md:shadow-[0_0_50px_rgba(79,70,229,0.2)]">
        {[0, 1, 2, 3].map((lane) => (
          <div
            key={lane}
            className="relative flex-1 h-full border-r border-dashed border-indigo-500/15 sm:border-indigo-500/20 last:border-none"
          >
            {/* Lane Number/Indicator - Responsive */}
            <div className="absolute bottom-12 xs:bottom-16 sm:bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 text-indigo-900 font-black text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl opacity-15 sm:opacity-20 select-none pointer-events-none">
              {['A', 'B', 'C', 'D'][lane]}
            </div>

            {/* Lane Markers (Distance Indicators) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 sm:w-1.5">
              {Array.from({ length: isMobile ? 8 : 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-full h-4 sm:h-6 md:h-8 bg-gradient-to-b from-indigo-400/40 to-transparent rounded-full"
                  style={{ top: `${i * (isMobile ? 12.5 : 8.33)}%` }}
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                    scaleY: [1, 1.2, 1]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            {/* Side Glow Effects */}
            {lane === 0 && (
              <div className="absolute left-0 top-0 bottom-0 w-px sm:w-0.5 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
            )}
            {lane === 3 && (
              <div className="absolute right-0 top-0 bottom-0 w-px sm:w-0.5 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
            )}

            {/* Bottom Horizon Glow per Lane */}
            <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 md:h-32 bg-gradient-to-t from-indigo-950/30 via-transparent to-transparent pointer-events-none" />
          </div>
        ))}

        {/* Center Racing Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-transparent via-yellow-500/20 to-transparent pointer-events-none" />

        {/* Speed Lines Effect (Mobile Reduced) */}
        {!isMobile && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(180deg, transparent, transparent 10px, rgba(139, 92, 246, 0.03) 10px, rgba(139, 92, 246, 0.03) 20px)',
            }}
            animate={{
              backgroundPositionY: ['0px', '20px']
            }}
            transition={{
              repeat: Infinity,
              duration: 0.3,
              ease: "linear"
            }}
          />
        )}

        {/* Top Fade */}
        <div className="absolute top-0 left-0 right-0 h-16 sm:h-20 md:h-24 bg-gradient-to-b from-slate-950 via-slate-950/50 to-transparent pointer-events-none z-10" />

        {/* Bottom Starting Line Area */}
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-28 md:h-32 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent pointer-events-none z-10" />

        {/* Starting Line Stripes */}
        <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 left-0 right-0 flex justify-around px-2 sm:px-4 z-10 pointer-events-none">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-12 sm:w-16 md:w-20 h-1 sm:h-1.5 bg-white/80 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            />
          ))}
        </div>

        {/* Render Gates */}
        {gates.map((gate) => (
          <Gate key={gate.id} options={gate.options} position={gate.position} question={gate.question} />
        ))}
      </div>

      {/* Outer Edge Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
      </div>
    </div>
  );
}