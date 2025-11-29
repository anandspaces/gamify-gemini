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
            className="absolute left-0 w-full flex flex-col items-center justify-center pointer-events-none z-10"
            style={{
                top: `${topPos}%`,
                transform: `scale(${scale})`,
                opacity: opacity,
                transformOrigin: '50% 100%' // Scale from bottom center
            }}
        >
            {/* Question Text Floating Above Gate */}
            <div className="mb-8 bg-slate-900/80 px-4 py-2 rounded-full border border-indigo-400/50 text-white font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.5)] whitespace-nowrap">
                {question}
            </div>

            <div className="flex gap-8 md:gap-12 w-full max-w-4xl justify-center">
                {options.map((opt, idx) => (
                    <div
                        key={idx}
                        className="relative w-32 h-24 md:w-40 md:h-32 bg-slate-800/90 border-4 border-indigo-500/50 rounded-lg flex items-center justify-center text-center p-2 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                    >
                        <div className="absolute -top-6 text-indigo-300 font-bold text-xl">
                            {['A', 'B', 'C', 'D'][idx]}
                        </div>
                        <span className="text-white font-bold text-sm md:text-base leading-tight drop-shadow-md">
                            {opt}
                        </span>

                        {/* Gate Pillars/Arch effect */}
                        <div className="absolute -left-2 top-0 bottom-0 w-2 bg-indigo-600" />
                        <div className="absolute -right-2 top-0 bottom-0 w-2 bg-indigo-600" />
                        <div className="absolute left-0 right-0 -top-2 h-2 bg-indigo-600" />
                    </div>
                ))}
            </div>
        </div>
    );
}
