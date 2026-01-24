// types/game.ts
export type GameStatus = 'intro' | 'playing' | 'feedback' | 'gameover';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface Session {
  id: string;
  questions: GeneratedQuestion[];
  createdAt: number;
  expiresAt: number;
  accessCount: number;
}
export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number; // Index of the correct answer (0-3)
}

export interface ResponsiveGameConfig {
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  // Lane positioning (consistent across all components)
  lanePositions: [number, number, number, number];

  // Track dimensions
  track: {
    width: number;
    length: number;
    laneDividerWidth: number;
    edgeOffset: number;
    edgeWidth: number;
    barrierHeight: number;
    barrierOffset: number;
  };

  // Track detail levels
  trackDetail: {
    dashCount: number;
    gridLines: number;
    dashLength: number;
    gridSpacing: number;
  };

  // Track materials
  trackMaterials: {
    roadRoughness: number;
    roadMetalness: number;
    barrierEmissive: number;
    dashOpacity: number;
    gridOpacity: number;
  };

  // Gate dimensions
  gate: {
    width: number;
    height: number;
    depth: number;
    borderWidth: number;
    borderHeight: number;
    badgeRadius: number;
    fontSize: number;
    labelFontSize: number;
    maxTextWidth: number;
    textOutline: number;
  };

  // Gate materials
  gateMaterials: {
    metalness: number;
    roughness: number;
    opacity: number;
    emissiveIntensity: number;
  };

  // Car configuration
  car: {
    scale: number;
    animationSpeed: {
      laneSwitch: number;
      bobbing: number;
      bobbingAmplitude: number;
    };
    lightIntensity: number;
  };

  // Camera settings
  camera: {
    position: [number, number, number];
    fov: number;
  };

  // Lighting
  lighting: {
    ambient: number;
    directional: number;
    secondary: number;
    point: number;
  };

  // Stars configuration
  stars: {
    count: number;
    factor: number;
    speed: number;
  };

  // Performance settings
  performance: {
    dpr: [number, number];
    powerPreference: 'low-power' | 'high-performance';
    antialias: boolean;
    castShadow: boolean;
    shadowMapSize: [number, number];
    fogDistance: number;
  };
}
export interface CarProps {
  lane: number; // 0 to 3
  isCrash?: boolean;
}

export interface GameOverProps {
  score: number;
  onRestart: () => void;
}

export interface Gate {
  id: number;
  question: string;
  options: string[];
  answer: number;
  position: number; // 0 (far) to 100 (near)
  passed: boolean;
}
export interface Gate3DProps {
  gate: Gate;
}

export interface GateVisualsProps {
  options: string[];
  isMobile: boolean;
  dims: any;
  lanePositions: number[];
  materials: any;
}

export interface GateProps {
  options: string[];
  position: number; // 0 to 100
  question: string;
}

export interface ParticleEffectProps {
  position: [number, number, number];
  color: string;
  count?: number;
  duration?: number;
  onComplete?: () => void;
}

export interface QuestionRequest {
  subject: string;
  topic: string;
  class: string;
  chapter: string;
}


export interface RateLimitConfig {
  maxRequests: number; // Max requests per window
  windowMs: number; // Time window in milliseconds
}

export interface GeneratedQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
}
export interface RateLimitEntry {
  count: number;
  resetAt: number;
}

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
  passed: boolean; // Track if passed the player
}
export interface ObstacleCarProps {
  isMobile: boolean;
}
export interface Obstacle3DProps {
  obstacle: Obstacle;
}

export interface ObstacleRockProps {
  isMobile: boolean;
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