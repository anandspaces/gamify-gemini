// components/Gate.tsx

interface GateProps {
    options: string[];
    position: number; // 0 to 100
    question: string;
}

export default function Gate({ options, position, question }: GateProps) {
    // Map position (0-100) to visual depth/scale
    const topPos = 30 + (position * 0.8); // 30% to 110%
    const scale = 0.1 + (position * 0.015); // 0.1 to 1.6
    const opacity = position < 5 ? position / 5 : 1; // Fade in at start

    return (
        <div
            className="absolute left-0 w-full flex flex-col items-center justify-center pointer-events-none z-10 px-2 sm:px-4"
            style={{
                top: `${topPos}%`,
                transform: `scale(${scale})`,
                opacity: opacity,
                transformOrigin: '50% 100%' // Scale from bottom center
            }}
        >
            {/* Question Text Floating Above Gate */}
            <div className="mb-4 sm:mb-6 md:mb-8 bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-indigo-400/50 text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg shadow-[0_0_15px_rgba(99,102,241,0.5)] sm:shadow-[0_0_20px_rgba(99,102,241,0.5)] max-w-[90vw] text-center leading-tight">
                <span className="line-clamp-2 sm:line-clamp-1">{question}</span>
            </div>

            {/* Gate Options - Responsive Grid */}
            <div className="grid grid-cols-2 sm:flex gap-2 xs:gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12 w-full max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl justify-center">
                {options.map((opt, idx) => (
                    <div
                        key={idx}
                        className="relative w-full sm:w-24 md:w-32 lg:w-40 h-16 xs:h-20 sm:h-20 md:h-24 lg:h-32 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-sm border-2 sm:border-3 md:border-4 border-indigo-500/50 rounded-md sm:rounded-lg flex items-center justify-center text-center p-1.5 xs:p-2 shadow-[0_0_15px_rgba(79,70,229,0.3)] sm:shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:border-indigo-400/70 transition-all"
                    >
                        {/* Option Letter Badge */}
                        <div className="absolute -top-3 xs:-top-4 sm:-top-5 md:-top-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white font-black text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 border-indigo-400 shadow-lg">
                            {['A', 'B', 'C', 'D'][idx]}
                        </div>

                        {/* Option Text */}
                        <span className="text-white font-bold text-xs leading-tight drop-shadow-md line-clamp-3 px-1">
                            {opt}
                        </span>

                        {/* Gate Pillars/Arch effect - Responsive */}
                        <div className="absolute -left-1 sm:-left-1.5 md:-left-2 top-0 bottom-0 w-1 sm:w-1.5 md:w-2 bg-gradient-to-b from-indigo-500 to-indigo-700 rounded-l-sm" />
                        <div className="absolute -right-1 sm:-right-1.5 md:-right-2 top-0 bottom-0 w-1 sm:w-1.5 md:w-2 bg-gradient-to-b from-indigo-500 to-indigo-700 rounded-r-sm" />
                        <div className="absolute left-0 right-0 -top-1 sm:-top-1.5 md:-top-2 h-1 sm:h-1.5 md:h-2 bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-500 rounded-t-sm" />

                        {/* Glow effect at bottom */}
                        <div className="absolute -bottom-1 left-1/4 right-1/4 h-2 bg-indigo-500/30 blur-md rounded-full" />

                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-md" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-md" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-md" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400/50 rounded-br-md" />
                    </div>
                ))}
            </div>

            {/* Lane Divider Lines (Visual Guide) */}
            <div className="absolute top-full mt-4 sm:mt-6 md:mt-8 left-0 right-0 flex justify-around px-4 opacity-30 pointer-events-none">
                <div className="w-0.5 h-8 sm:h-12 md:h-16 bg-gradient-to-b from-indigo-400 to-transparent" />
                <div className="w-0.5 h-8 sm:h-12 md:h-16 bg-gradient-to-b from-indigo-400 to-transparent" />
                <div className="w-0.5 h-8 sm:h-12 md:h-16 bg-gradient-to-b from-indigo-400 to-transparent" />
                <div className="w-0.5 h-8 sm:h-12 md:h-16 bg-gradient-to-b from-indigo-400 to-transparent" />
            </div>
        </div>
    );
}