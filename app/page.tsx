// app/page.tsx
"use client";

import { useEffect, useRef } from 'react';
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

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

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
            actions.moveCar(1);
          }
          break;
        case 'ArrowRight':
          if (selectedLane !== null && selectedLane < 3) {
            actions.moveCar(selectedLane + 1);
          } else if (selectedLane === null) {
            actions.moveCar(1);
          }
          break;
        case 'a':
        case 'A':
          actions.moveCar(0);
          break;
        case 'b':
        case 'B':
          actions.moveCar(1);
          break;
        case 'c':
        case 'C':
          actions.moveCar(2);
          break;
        case 'd':
        case 'D':
          actions.moveCar(3);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, selectedLane, isPaused, actions]);

  // Touch Controls for Tablets/Mobile
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (status !== 'playing' || isPaused) return;
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (status !== 'playing' || isPaused) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;

      // Minimum swipe distance (50px)
      const minSwipeDistance = 50;

      // Detect horizontal swipe (ignore if vertical swipe is dominant)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          // Swipe right
          if (selectedLane !== null && selectedLane < 3) {
            actions.moveCar(selectedLane + 1);
          } else if (selectedLane === null) {
            actions.moveCar(1);
          }
        } else {
          // Swipe left
          if (selectedLane !== null && selectedLane > 0) {
            actions.moveCar(selectedLane - 1);
          } else if (selectedLane === null) {
            actions.moveCar(1);
          }
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent page scrolling during gameplay
      if (status === 'playing' && !isPaused) {
        e.preventDefault();
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [status, selectedLane, isPaused, actions]);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-slate-950">
      {/* 3D Scene */}
      {status === 'playing' && <Scene />}

      {/* HUD */}
      {status === 'playing' && <HUD />}

      {/* Controls */}
      {status === 'playing' && <Controls disabled={isPaused} />}

      {/* Screens */}
      {status === 'intro' && <StartScreen />}
      {status === 'gameover' && <GameOverScreen />}
      {status === 'playing' && isPaused && <PauseScreen />}
    </main>
  );
}