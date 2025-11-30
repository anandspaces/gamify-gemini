// components/Car.tsx
import { motion } from 'framer-motion';
import { CarFront } from 'lucide-react';

interface CarProps {
  lane: number; // 0 to 3
  isCrash?: boolean;
}

export default function Car({ lane, isCrash }: CarProps) {
  // Calculate percentage position for 4 lanes (12.5%, 37.5%, 62.5%, 87.5%)
  const leftPosition = `${lane * 25 + 12.5}%`;

  return (
    <motion.div
      className="absolute bottom-2 sm:bottom-3 md:bottom-4 lg:bottom-6 z-20 w-12 h-20 xs:w-14 xs:h-24 sm:w-16 sm:h-28 md:w-20 md:h-32 lg:w-24 lg:h-36"
      initial={{ left: "37.5%" }}
      animate={{
        left: leftPosition,
        scale: isCrash ? [1, 1.2, 0.8, 1] : 1,
        rotate: isCrash ? [0, -10, 10, -10, 0] : 0
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8 // Slightly lighter for smoother mobile animation
      }}
      style={{ translateX: '-50%' }} // Center the car on its lane position
    >
      {/* Simple Car Graphic */}
      <div className={`relative w-full h-full rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl md:shadow-2xl transition-all duration-300 ${isCrash
          ? 'bg-red-600 shadow-red-500/50'
          : 'bg-gradient-to-b from-indigo-500 to-indigo-700 shadow-indigo-500/50'
        }`}>
        {/* Roof/Windshield */}
        <div className="absolute top-[18%] sm:top-[20%] left-[8%] sm:left-[10%] right-[8%] sm:right-[10%] h-[38%] sm:h-[40%] bg-gradient-to-b from-gray-800 to-gray-900 rounded-md sm:rounded-lg border border-indigo-400/20 sm:border-2 sm:border-indigo-400/30 backdrop-blur-sm" />

        {/* Headlights */}
        <div className="absolute top-1 sm:top-2 left-1.5 sm:left-2 w-2 h-4 sm:w-3 sm:h-6 bg-yellow-300 rounded-full blur-[1px] sm:blur-[2px] shadow-[0_0_8px_yellow] sm:shadow-[0_0_10px_yellow]" />
        <div className="absolute top-1 sm:top-2 right-1.5 sm:right-2 w-2 h-4 sm:w-3 sm:h-6 bg-yellow-300 rounded-full blur-[1px] sm:blur-[2px] shadow-[0_0_8px_yellow] sm:shadow-[0_0_10px_yellow]" />

        {/* Side Mirrors */}
        <div className="absolute top-[30%] -left-1 w-2 h-3 sm:w-2.5 sm:h-4 bg-gray-700 rounded-sm border border-gray-600" />
        <div className="absolute top-[30%] -right-1 w-2 h-3 sm:w-2.5 sm:h-4 bg-gray-700 rounded-sm border border-gray-600" />

        {/* Tail lights */}
        <div className="absolute bottom-0.5 sm:bottom-1 left-1.5 sm:left-2 w-3 h-1.5 sm:w-4 sm:h-2 bg-red-500 rounded-full shadow-[0_0_10px_red] sm:shadow-[0_0_15px_red]" />
        <div className="absolute bottom-0.5 sm:bottom-1 right-1.5 sm:right-2 w-3 h-1.5 sm:w-4 sm:h-2 bg-red-500 rounded-full shadow-[0_0_10px_red] sm:shadow-[0_0_15px_red]" />

        {/* Front Bumper Detail */}
        <div className="absolute top-0 left-[15%] right-[15%] h-1 sm:h-1.5 bg-gray-800 rounded-b-md" />

        {/* Car Icon Overlay */}
        <div className="flex items-center justify-center h-full opacity-15 sm:opacity-20">
          <CarFront size={28} className="sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
        </div>

        {/* Speed Lines Effect (when not crashed) */}
        {!isCrash && (
          <div className="absolute inset-0 overflow-hidden rounded-lg sm:rounded-xl opacity-30">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        )}

        {/* Crash Effect */}
        {isCrash && (
          <div className="absolute inset-0 bg-red-500/30 rounded-lg sm:rounded-xl animate-pulse" />
        )}
      </div>

      {/* Headlight Beams */}
      <div className="absolute -top-16 sm:-top-20 md:-top-24 left-1.5 sm:left-2 w-3 h-16 sm:w-4 sm:h-20 md:h-24 bg-gradient-to-t from-yellow-300/30 via-yellow-300/10 to-transparent blur-sm sm:blur-md pointer-events-none" />
      <div className="absolute -top-16 sm:-top-20 md:-top-24 right-1.5 sm:right-2 w-3 h-16 sm:w-4 sm:h-20 md:h-24 bg-gradient-to-t from-yellow-300/30 via-yellow-300/10 to-transparent blur-sm sm:blur-md pointer-events-none" />

      {/* Exhaust Smoke Effect (subtle) */}
      {!isCrash && (
        <>
          <div className="absolute -bottom-1 left-[20%] w-2 h-2 bg-gray-400/20 rounded-full blur-md animate-pulse" style={{ animationDuration: '2s' }} />
          <div className="absolute -bottom-1 right-[20%] w-2 h-2 bg-gray-400/20 rounded-full blur-md animate-pulse" style={{ animationDuration: '2s', animationDelay: '1s' }} />
        </>
      )}

      {/* Shadow */}
      <div className="absolute -bottom-1 left-[10%] right-[10%] h-2 bg-black/30 rounded-full blur-md" />
    </motion.div>
  );
}