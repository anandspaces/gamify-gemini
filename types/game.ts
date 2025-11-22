// types/game.ts
export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number; // Index of the correct answer (0-3)
}

export type GameStatus = 'intro' | 'playing' | 'feedback' | 'gameover';

export interface GameState {
  status: GameStatus;
  currentQuestionIndex: number;
  score: number;
  selectedLane: number | null; // 0, 1, 2, 3
  timeLeft: number;
  actions: {
    startGame: () => void;
    selectAnswer: (laneIndex: number) => void;
    nextQuestion: () => void;
    tickTimer: () => void;
    resetGame: () => void;
    timeOut: () => void;
  };
}