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
      className="absolute bottom-4 z-20 w-16 h-28 md:w-20 md:h-32"
      initial={{ left: "37.5%" }}
      animate={{ 
        left: leftPosition,
        scale: isCrash ? [1, 1.2, 0.8, 1] : 1,
        rotate: isCrash ? [0, -10, 10, -10, 0] : 0
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Simple Car Graphic */}
      <div className={`relative w-full h-full rounded-xl shadow-2xl transition-colors duration-300 ${isCrash ? 'bg-red-600' : 'bg-indigo-600'}`}>
        {/* Roof/Windshield */}
        <div className="absolute top-[20%] left-[10%] right-[10%] h-[40%] bg-gray-900 rounded-lg border-2 border-indigo-400/30" />
        {/* Headlights */}
        <div className="absolute top-2 left-2 w-3 h-6 bg-yellow-300 rounded-full blur-[2px] shadow-[0_0_10px_yellow]" />
        <div className="absolute top-2 right-2 w-3 h-6 bg-yellow-300 rounded-full blur-[2px] shadow-[0_0_10px_yellow]" />
        {/* Tail lights */}
        <div className="absolute bottom-1 left-2 w-4 h-2 bg-red-500 rounded-full shadow-[0_0_15px_red]" />
        <div className="absolute bottom-1 right-2 w-4 h-2 bg-red-500 rounded-full shadow-[0_0_15px_red]" />
        
        <div className="flex items-center justify-center h-full opacity-20">
            <CarFront size={40} className="text-white"/>
        </div>
      </div>
      
      {/* Headlight Beams */}
      <div className="absolute -top-24 left-2 w-4 h-24 bg-linear-to-t from-yellow-300/0 to-yellow-300/20 blur-md" />
      <div className="absolute -top-24 right-2 w-4 h-24 bg-linear-to-t from-yellow-300/0 to-yellow-300/20 blur-md" />
    </motion.div>
  );
}