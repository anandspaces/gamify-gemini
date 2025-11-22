// app/page.tsx
"use client";

import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { questions } from '@/data/questions';
import Track from '@/components/Track';
import Car from '@/components/Car';
import HUD from '@/components/HUD';
import Controls from '@/components/Controls';
import GameOver from '@/components/GameOver';
import { Play } from 'lucide-react';

export default function GamePage() {
  const { 
    status, 
    currentQuestionIndex, 
    score, 
    selectedLane, 
    timeLeft, 
    actions 
  } = useGameStore();

  const currentQ = questions[currentQuestionIndex];

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'playing') {
      interval = setInterval(() => {
        actions.tickTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, actions]);

  // Derived Visual States
  const isFeedback = status === 'feedback';
  const isWrong = isFeedback && selectedLane !== null && selectedLane !== currentQ.answer;

  return (
    <main className="relative w-full h-screen bg-slate-950 overflow-hidden select-none font-sans">
      
      {/* Background Track */}
      <Track />

      {/* The Car */}
      <div className="absolute inset-0 max-w-3xl mx-auto pointer-events-none">
        <Car 
          lane={selectedLane ?? 1} 
          isCrash={isWrong}
        />
      </div>

      {/* Game Over Overlay */}
      {status === 'gameover' && (
        <GameOver score={score} onRestart={actions.resetGame} />
      )}

      {/* Intro Screen */}
      {status === 'intro' && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm p-6 text-center">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 mb-6 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">
            NEON RACER
          </h1>
          <p className="text-slate-300 text-lg md:text-xl mb-8 max-w-md">
            Speed through the lanes by answering correctly. Wrong turns cause a crash!
          </p>
          <button
            onClick={actions.startGame}
            className="px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xl font-bold rounded-full transition-all shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:scale-105 flex items-center gap-2"
          >
            <Play fill="currentColor" /> START ENGINE
          </button>
        </div>
      )}

      {/* Active Game UI */}
      {(status === 'playing' || status === 'feedback') && (
        <>
          <HUD 
            question={currentQ.question} 
            score={score} 
            timeLeft={timeLeft} 
          />
          
          <Controls 
            options={currentQ.options}
            onSelect={actions.selectAnswer}
            disabled={status !== 'playing'}
            correctAnswer={isFeedback ? currentQ.answer : null}
            selectedAnswer={selectedLane}
          />
        </>
      )}

      {/* Visual Effects Overlay (Flash Red/Green) */}
      {isFeedback && (
        <div className={`absolute inset-0 pointer-events-none z-40 mix-blend-overlay transition-opacity duration-300 ${
          selectedLane === currentQ.answer ? 'bg-green-500/30' : 'bg-red-500/30'
        }`} />
      )}
    </main>
  );
}