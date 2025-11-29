// types/game.ts
export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number; // Index of the correct answer (0-3)
}

export type GameStatus = 'intro' | 'playing' | 'feedback' | 'gameover';

export interface Gate {
  id: number;
  question: string;
  options: string[];
  answer: number;
  position: number; // 0 (far) to 100 (near)
  passed: boolean;
}

export interface GameStats {
  correct: number;
  total: number;
  accuracy: number;
}

export interface GameState {
  status: GameStatus;
  score: number;
  lives: number;
  speed: number;
  selectedLane: number | null; // 0, 1, 2, 3
  gates: Gate[];
  isPaused: boolean;
  stats: GameStats;
  lastAnswerCorrect: boolean | null; // null = no answer yet, true = correct, false = incorrect
  usedQuestionIds: number[]; // Track used questions to prevent repetition

  actions: {
    startGame: () => void;
    togglePause: () => void;
    moveCar: (laneIndex: number) => void;
    tickGameLoop: () => void;
    restartGame: () => void;
  };
}