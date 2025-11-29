// app/page.tsx
"use client";

import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import Scene from '@/components/Scene';
import HUD from '@/components/HUD';
import Controls from '@/components/Controls';
import { StartScreen, GameOverScreen, PauseScreen } from '@/components/Screens';

export default function GamePage() {
  const {
    status,
    selectedLane,
    isPaused,
    actions
  } = useGameStore();

  // Game Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'playing' && !isPaused) {
      interval = setInterval(() => {
        actions.tickGameLoop();
      }, 16); // ~60fps
    }
    return () => clearInterval(interval);
  }, [status, isPaused, actions]);

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow pause toggle anytime
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        actions.togglePause();
        return;
      }

      if (status !== 'playing' || isPaused) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (selectedLane !== null && selectedLane > 0) {
            actions.moveCar(selectedLane - 1);
          } else if (selectedLane === null) {
            actions.moveCar(1); // Default start
          }
          break;
        case 'ArrowRight':
          if (selectedLane !== null && selectedLane < 3) {
            actions.moveCar(selectedLane + 1);
          } else if (selectedLane === null) {
            actions.moveCar(2); // Default start
          }
          break;
        case '1':
        case 'a':
        case 'A':
          actions.moveCar(0);
          break;
        case '2':
        case 'b':
        case 'B':
          actions.moveCar(1);
          break;
        case '3':
        case 'c':
        case 'C':
          actions.moveCar(2);
          break;
        case '4':
        case 'd':
        case 'D':
          actions.moveCar(3);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, isPaused, selectedLane, actions]);

  return (
    <main className="relative w-full h-screen bg-slate-950 overflow-hidden select-none font-sans">

      {/* 3D Scene Layer */}
      <Scene />

      {/* UI Layers */}
      {status === 'intro' && <StartScreen />}
      {status === 'gameover' && <GameOverScreen />}
      {isPaused && <PauseScreen />}

      {/* HUD & Controls (Always visible during play) */}
      {status === 'playing' && (
        <>
          <HUD />
          <Controls disabled={isPaused} />
        </>
      )}

    </main>
  );
}