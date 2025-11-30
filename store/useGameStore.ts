// store/useGameStore.ts
import { create } from 'zustand';
import { GameState, Gate, GameStatus } from '@/types/game';

const BASE_SPEED = 0.2;
const SPEED_INCREMENT = 0.01;
const SPAWN_DISTANCE = 40; // Distance between gates (0-100 scale)

export const useGameStore = create<GameState>((set, get) => ({
  status: 'intro',
  score: 0,
  lives: 3,
  speed: BASE_SPEED,
  selectedLane: 1,
  gates: [],
  isPaused: false,
  stats: { correct: 0, total: 0, accuracy: 0 },
  lastAnswerCorrect: null,
  usedQuestionIds: [],
  customQuestions: null,

  actions: {
    loadCustomQuestions: (questions) => {
      set({ customQuestions: questions, usedQuestionIds: [] });
    },

    startGame: () => {
      set({
        status: 'playing',
        score: 0,
        lives: 3,
        speed: BASE_SPEED,
        selectedLane: 1,
        gates: [],
        isPaused: false,
        stats: { correct: 0, total: 0, accuracy: 0 },
        lastAnswerCorrect: null,
        usedQuestionIds: [],
      });
      // Game loop in page.tsx will handle spawning
    },

    togglePause: () => {
      set((state) => ({ isPaused: !state.isPaused }));
    },

    moveCar: (laneIndex: number) => {
      set({ selectedLane: laneIndex });
    },

    restartGame: () => {
      get().actions.startGame();
    },

    tickGameLoop: () => {
      const state = get();
      if (state.status !== 'playing' || state.isPaused) return;

      const { gates, speed, selectedLane, lives, score, stats } = state;
      let newLives = lives;
      let newScore = score;
      let newSpeed = speed;
      let newStatus: GameStatus = state.status;
      const newStats = { ...stats };

      // 1. Move Gates
      const newGates = gates.map(gate => ({
        ...gate,
        position: gate.position + speed
      }));

      // 2. Check Collisions & Scoring
      let feedbackSet = false;
      newGates.forEach(gate => {
        if (!gate.passed && gate.position >= 90) { // Hit detection zone (90-100)
          gate.passed = true; // Mark as processed
          newStats.total += 1;

          if (selectedLane === gate.answer) {
            // Correct
            newScore += 100 + Math.floor(speed * 100);
            newSpeed += SPEED_INCREMENT;
            newStats.correct += 1;
            if (!feedbackSet) {
              feedbackSet = true;
              // Use a separate timeout to avoid triggering re-renders during render
              setTimeout(() => {
                const currentState = get();
                if (currentState.status === 'playing') {
                  set({ lastAnswerCorrect: true });
                  setTimeout(() => {
                    const finalState = get();
                    if (finalState.lastAnswerCorrect === true) {
                      set({ lastAnswerCorrect: null });
                    }
                  }, 1000);
                }
              }, 0);
            }
          } else {
            // Wrong / Crash
            newScore = Math.max(0, newScore - 50); // Negative marking, but don't go below 0
            newLives -= 1;
            if (newLives <= 0) {
              newStatus = 'gameover';
            }
            if (!feedbackSet) {
              feedbackSet = true;
              // Use a separate timeout to avoid triggering re-renders during render
              setTimeout(() => {
                const currentState = get();
                if (currentState.status === 'playing' || currentState.status === 'gameover') {
                  set({ lastAnswerCorrect: false });
                  setTimeout(() => {
                    const finalState = get();
                    if (finalState.lastAnswerCorrect === false) {
                      set({ lastAnswerCorrect: null });
                    }
                  }, 1000);
                }
              }, 0);
            }
          }
        }
      });

      // 3. Cleanup Old Gates
      const activeGates = newGates.filter(g => g.position < 150);

      // 4. Spawn New Gate
      const lastGate = activeGates[activeGates.length - 1];
      const shouldSpawnNewGate = !lastGate || lastGate.position > SPAWN_DISTANCE;

      if (shouldSpawnNewGate) {
        const { usedQuestionIds, customQuestions } = state;

        // Use custom questions if available, otherwise use default
        const questionPool = customQuestions || [];

        // Only spawn if we have questions available
        if (questionPool.length > 0) {
          // Get unused questions
          const unusedQuestions = questionPool.filter((q) => !usedQuestionIds.includes(q.id));

          // If all questions used, reset the pool
          const availableQuestions = unusedQuestions.length > 0 ? unusedQuestions : questionPool;

          // Pick random question from available pool
          const randomQ = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];

          const newGate: Gate = {
            id: Date.now(),
            question: randomQ.question,
            options: randomQ.options,
            answer: randomQ.answer,
            position: -20,
            passed: false
          };
          activeGates.push(newGate);

          // Track this question as used
          const newUsedIds = unusedQuestions.length > 0
            ? [...usedQuestionIds, randomQ.id]
            : [randomQ.id]; // Reset if we cycled through all

          // Update used IDs in this batch update
          set({
            gates: activeGates,
            lives: newLives,
            score: newScore,
            speed: newSpeed,
            status: newStatus,
            stats: {
              ...newStats,
              accuracy: newStats.total > 0 ? Math.round((newStats.correct / newStats.total) * 100) : 0
            },
            usedQuestionIds: newUsedIds
          });
          return; // Early return to avoid double set
        }
      }

      // 5. Update Stats and State (if no new gate spawned)
      newStats.accuracy = newStats.total > 0 ? Math.round((newStats.correct / newStats.total) * 100) : 0;

      set({
        gates: activeGates,
        lives: newLives,
        score: newScore,
        speed: newSpeed,
        status: newStatus,
        stats: newStats
      });
    },
  },
}));