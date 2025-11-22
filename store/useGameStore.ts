// store/useGameStore.ts
import { create } from 'zustand';
import { questions } from '@/data/questions';
import { GameState } from '@/types/game';

const TIME_PER_QUESTION = 10;

export const useGameStore = create<GameState>((set, get) => ({
  status: 'intro',
  currentQuestionIndex: 0,
  score: 0,
  selectedLane: 2, // Start in middle-ish
  timeLeft: TIME_PER_QUESTION,

  actions: {
    startGame: () => {
      set({
        status: 'playing',
        currentQuestionIndex: 0,
        score: 0,
        selectedLane: 1, // Reset car position
        timeLeft: TIME_PER_QUESTION,
      });
    },

    selectAnswer: (laneIndex: number) => {
      const { currentQuestionIndex, score } = get();
      const currentQ = questions[currentQuestionIndex];
      const isCorrect = currentQ.answer === laneIndex;

      // Move car immediately
      set({ selectedLane: laneIndex, status: 'feedback' });

      // Calculate score (add bonus for speed)
      const newScore = isCorrect ? score + 100 + (get().timeLeft * 10) : score - 50;

      setTimeout(() => {
        // Wait for animation, then apply score
        set({ score: newScore });
        
        // Small delay to show result colors then move on
        setTimeout(() => {
          get().actions.nextQuestion();
        }, 1500);
      }, 500); // 500ms for car to arrive at lane
    },

    nextQuestion: () => {
      const { currentQuestionIndex } = get();
      const nextIndex = currentQuestionIndex + 1;

      if (nextIndex >= questions.length) {
        set({ status: 'gameover' });
      } else {
        set({
          currentQuestionIndex: nextIndex,
          status: 'playing',
          selectedLane: 1, // Reset car to center-ish to keep it dynamic or keep previous? Let's keep previous
          timeLeft: TIME_PER_QUESTION,
        });
      }
    },

    timeOut: () => {
      set({ status: 'gameover' });
    },

    tickTimer: () => {
      const { timeLeft, status, actions } = get();
      if (status !== 'playing') return;

      if (timeLeft > 0) {
        set({ timeLeft: timeLeft - 1 });
      } else {
        actions.timeOut();
      }
    },

    resetGame: () => {
      set({
        status: 'intro',
        currentQuestionIndex: 0,
        score: 0,
        timeLeft: TIME_PER_QUESTION,
      });
    },
  },
}));