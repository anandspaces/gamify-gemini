// store/useGameStore.ts
import { create } from 'zustand';
import { GameState, Gate, GameStatus } from '@/types/game';
import { questions } from '@/data/questions';

const BASE_SPEED = 0.4;
const SPEED_INCREMENT = 0.05;
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

  actions: {
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
              set({ lastAnswerCorrect: true });
              feedbackSet = true;
              setTimeout(() => set({ lastAnswerCorrect: null }), 1000); // Clear after 1 second
            }
          } else {
            // Wrong / Crash
            newScore -= 50; // Negative marking
            newLives -= 1;
            if (newLives <= 0) {
              newStatus = 'gameover';
            }
            if (!feedbackSet) {
              set({ lastAnswerCorrect: false });
              feedbackSet = true;
              setTimeout(() => set({ lastAnswerCorrect: null }), 1000); // Clear after 1 second
            }
          }
        }
      });

      // 3. Cleanup Old Gates
      const activeGates = newGates.filter(g => g.position < 150);

      // 4. Spawn New Gate
      const lastGate = activeGates[activeGates.length - 1];
      if (!lastGate || lastGate.position > SPAWN_DISTANCE) {
        const { usedQuestionIds } = state;

        // Get unused questions
        const unusedQuestions = questions.filter(q => !usedQuestionIds.includes(q.id));

        // If all questions used, reset the pool
        const availableQuestions = unusedQuestions.length > 0 ? unusedQuestions : questions;

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

        set({ usedQuestionIds: newUsedIds });
      }

      // 5. Update Stats
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