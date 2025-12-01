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

export interface Obstacle {
  id: number;
  lane: number; // 0-3
  position: number; // 0 (far) to 100 (near)
  type: 'barrier' | 'cone' | 'hazard'; // Different obstacle types
  hit: boolean; // Track if already collided
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
  obstacles: Obstacle[]; // New obstacle array
  isPaused: boolean;
  stats: GameStats;
  lastAnswerCorrect: boolean | null; // null = no feedback, true = correct, false = wrong
  currentQuestionText: string | null; // Explicitly manage current question text
  isTransitioning: boolean; // Block spawning during feedback and transition gap
  usedQuestionIds: number[]; // Track used questions to prevent repetition
  customQuestions: Question[] | null; // Custom questions from API

  actions: {
    startGame: () => void;
    togglePause: () => void;
    moveCar: (laneIndex: number) => void;
    tickGameLoop: () => void;
    restartGame: () => void;
    loadCustomQuestions: (questions: Question[]) => void;
  };
}