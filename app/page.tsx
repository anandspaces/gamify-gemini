// app/page.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import Scene from '@/components/Scene';
import HUD from '@/components/HUD';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load questions from session ID if present
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('id');

    if (!sessionId) {
      console.log('ℹ️ No session ID in URL, using default questions');
      setLoading(false);
      return;
    }

    console.log(`🔍 Found session ID in URL: ${sessionId}`);
    console.log(`📡 Fetching questions from: /api/session/${sessionId}`);

    let mounted = true;

    const loadQuestions = async () => {
      try {
        const response = await fetch(`/api/session/${sessionId}`);
        console.log(`📥 Response status: ${response.status}`);

        const data = await response.json();
        console.log('📦 Response data:', data);

        if (mounted) {
          if (data.success && data.questions) {
            console.log(`✅ Loading ${data.questions.length} custom questions`);
            console.log('📝 First question:', data.questions[0]);
            actions.loadCustomQuestions(data.questions);
            setError(null);
          } else {
            console.error('❌ Failed to load questions:', data.error);
            setError(data.error || 'Session not found or expired');
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('❌ Error fetching session:', err);
        if (mounted) {
          setError('Failed to load questions');
          setLoading(false);
        }
      }
    };

    loadQuestions();

    return () => {
      mounted = false;
    };
  }, [actions]);

  // Game Loop using requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      if (status === 'playing' && !isPaused) {
        // Calculate delta time if needed for smoother movement
        // const deltaTime = time - lastTime;
        // lastTime = time;

        actions.tickGameLoop();
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    if (status === 'playing' && !isPaused) {
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(loop);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
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
    <main className="relative w-full h-screen overflow-hidden bg-slate-950 touch-none select-none">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950 animate-fadeIn">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-500/30 rounded-full"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
            </div>
            <p className="text-indigo-400 font-mono animate-pulse text-lg font-bold">Loading Game...</p>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm">
          <div className="bg-slate-900 border border-red-500/50 p-6 rounded-xl max-w-md mx-4 text-center shadow-2xl shadow-red-500/20">
            <h3 className="text-xl font-bold text-red-400 mb-2">Error Loading Game</h3>
            <p className="text-slate-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* 3D Scene */}
      {status === 'playing' && <Scene />}

      {/* HUD */}
      {status === 'playing' && <HUD />}

      {/* Screens */}
      {status === 'intro' && <StartScreen />}
      {status === 'gameover' && <GameOverScreen />}
      {status === 'playing' && isPaused && <PauseScreen />}
    </main>
  );
}