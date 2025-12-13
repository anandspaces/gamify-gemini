// store/useGameStore.ts
import { create } from 'zustand';
import { GameState, Gate, Obstacle, GameStatus } from '@/types/game';

const BASE_SPEED = 0.1;
const SPEED_INCREMENT = 0.01;
const SPAWN_DISTANCE = 60; // Increased from 40 to give more time between gates
const OBSTACLE_SPAWN_CHANCE = 0.8; // Increased to 80% to ensure obstacles appear between gates
const OBSTACLE_TYPES: Array<'barrier' | 'cone' | 'hazard'> = ['barrier', 'cone', 'hazard'];

// Game Logic Constants
const GATE_SPAWN_POS = -20;
const OBSTACLE_SPAWN_POS = -10;
const QUESTION_HIDE_POS = 95;
const COLLISION_POS = 100; // Changed to 100 to simulate passing through the gate
const CLEANUP_POS = 150;
const FEEDBACK_DURATION = 1500;
const TRANSITION_DELAY = 500; // Gap between feedback end and new question

export const useGameStore = create<GameState>((set, get) => ({
  status: 'intro',
  score: 0,
  lives: 3,
  speed: BASE_SPEED,
  selectedLane: 1,
  gates: [],
  obstacles: [], // Initialize obstacles array
  isPaused: false,
  stats: { correct: 0, total: 0, accuracy: 0 },
  lastAnswerCorrect: null,
  currentQuestionText: null, // Explicitly manage current question text
  isTransitioning: false,
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
        obstacles: [], // Reset obstacles
        isPaused: false,
        stats: { correct: 0, total: 0, accuracy: 0 },
        lastAnswerCorrect: null,
        currentQuestionText: "Get Ready...", // Initial text
        isTransitioning: false,
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

      const { gates, obstacles, speed, selectedLane, lives, score, stats } = state;
      let newLives = lives;
      let newScore = score;
      let newSpeed = speed;
      let newStatus: GameStatus = state.status;
      const newStats = { ...stats };

      // 1. Move Gates and Obstacles
      const newGates = gates.map(gate => ({
        ...gate,
        position: gate.position + speed
      }));

      const newObstacles = obstacles.map(obstacle => ({
        ...obstacle,
        position: obstacle.position + speed
      }));

      // 2. Check Gate Collisions & Scoring
      // Collision happens at position 98-100 (very close to car)
      let feedbackSet = false;
      let newLastAnswerCorrect = state.lastAnswerCorrect;

      newGates.forEach(gate => {
        if (!gate.passed && gate.position >= COLLISION_POS) { // Hit detection zone
          gate.passed = true; // Mark as processed
          newStats.total += 1;

          if (selectedLane === gate.answer) {
            // Correct
            newScore += 100 + Math.floor(speed * 100);
            newSpeed += SPEED_INCREMENT;
            newStats.correct += 1;
            if (!feedbackSet) {
              feedbackSet = true;
              newLastAnswerCorrect = true;

              // Set transitioning to true to block spawning
              // We can't set it on 'state' directly because we are inside the loop and using local vars for next state
              // But we can set it in the final set() call if we track it
              // However, we need to trigger the timeouts.

              // Schedule reset of feedback and transition
              setTimeout(() => {
                const currentState = get();
                if (currentState.lastAnswerCorrect === true) {
                  // End feedback, hide question, start transition gap
                  set({ lastAnswerCorrect: null, currentQuestionText: null, isTransitioning: true });

                  // After gap, end transition (allowing spawn)
                  setTimeout(() => {
                    set({ isTransitioning: false });
                  }, TRANSITION_DELAY);
                }
              }, FEEDBACK_DURATION);
            }
          } else {
            // Wrong / Crash
            newScore = Math.max(0, newScore - 50);
            newLives -= 1;
            if (newLives <= 0) {
              newStatus = 'gameover';
            }
            if (!feedbackSet) {
              feedbackSet = true;
              newLastAnswerCorrect = false;

              // Schedule reset of feedback and transition
              setTimeout(() => {
                const currentState = get();
                if (currentState.lastAnswerCorrect === false) {
                  // End feedback, hide question, start transition gap
                  set({ lastAnswerCorrect: null, currentQuestionText: null, isTransitioning: true });

                  // After gap, end transition (allowing spawn)
                  setTimeout(() => {
                    set({ isTransitioning: false });
                  }, TRANSITION_DELAY);
                }
              }, FEEDBACK_DURATION);
            }
          }
        }
      });

      // 3. Check Obstacle Collisions
      // Obstacles collide at position 100 (same as gates)
      newObstacles.forEach(obstacle => {
        if (!obstacle.passed && obstacle.position >= COLLISION_POS) {
          obstacle.passed = true; // Mark as processed so we don't check again

          // Check if player is in the same lane
          if (selectedLane === obstacle.lane) {
            obstacle.hit = true; // Mark as hit for visual effects
            newLives -= 1; // Deduct life
            if (newLives <= 0) {
              newStatus = 'gameover';
            }
            // Visual feedback for obstacle hit
            newLastAnswerCorrect = false;

            // Schedule reset of feedback and transition
            setTimeout(() => {
              const currentState = get();
              if (currentState.lastAnswerCorrect === false) {
                // End feedback, hide question, start transition gap
                set({ lastAnswerCorrect: null, currentQuestionText: null, isTransitioning: true });

                // After gap, end transition (allowing spawn)
                setTimeout(() => {
                  set({ isTransitioning: false });
                }, TRANSITION_DELAY);
              }
            }, 800); // Shorter feedback for obstacles? Or use FEEDBACK_DURATION?
            // Using 800ms as per previous code, but maybe should align with FEEDBACK_DURATION
          }
        }
      });

      // 4. Cleanup Old Gates and Obstacles
      const activeGates = newGates.filter(g => g.position < CLEANUP_POS);
      const activeObstacles = newObstacles.filter(o => o.position < CLEANUP_POS);

      // 5. Spawn New Gate
      // STRICT FLOW: Only spawn if feedback is NOT active AND NOT transitioning AND we need a new gate
      const lastGate = activeGates[activeGates.length - 1];
      const isFeedbackActive = state.lastAnswerCorrect !== null;
      const isTransitioning = state.isTransitioning;
      const shouldSpawnNewGate = !isFeedbackActive && !isTransitioning && (!lastGate || lastGate.position > SPAWN_DISTANCE);

      if (shouldSpawnNewGate) {
        const { usedQuestionIds, customQuestions } = state;

        // Use custom questions if available
        const questionPool = customQuestions || [];

        if (questionPool.length > 0) {
          const unusedQuestions = questionPool.filter((q) => !usedQuestionIds.includes(q.id));
          const availableQuestions = unusedQuestions.length > 0 ? unusedQuestions : questionPool;

          // Try to find a valid question up to 3 times to avoid infinite loops
          let randomQ = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
          let attempts = 0;
          while ((!randomQ.options || randomQ.options.length === 0) && attempts < 3) {
            console.warn(`⚠️ Skipping question "${randomQ.question}" - No options found`);
            randomQ = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
            attempts++;
          }

          // Fallback if still no valid options (should not happen with valid data)
          if (!randomQ.options || randomQ.options.length === 0) {
            console.error('❌ Failed to find question with valid options');
            return;
          }

          const newGate: Gate = {
            id: Date.now(),
            question: randomQ.question,
            options: randomQ.options,
            answer: randomQ.answer,
            position: GATE_SPAWN_POS,
            passed: false
          };
          activeGates.push(newGate);

          // Update the question text immediately when spawning
          // Use a local variable to ensure it's passed to set() correctly
          const nextQuestionText = randomQ.question;

          // Spawn obstacle randomly BETWEEN gates (not near the gate)
          // Only spawn if there's enough distance from the last gate
          const shouldSpawnObstacle = Math.random() < OBSTACLE_SPAWN_CHANCE;
          const hasEnoughDistance = !lastGate || lastGate.position > SPAWN_DISTANCE + 15;

          if (shouldSpawnObstacle && hasEnoughDistance) {
            const availableLanes = [0, 1, 2, 3].filter(lane => lane !== randomQ.answer);
            const randomLane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
            const randomType = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];

            const newObstacle: Obstacle = {
              id: Date.now() + 1,
              lane: randomLane,
              position: OBSTACLE_SPAWN_POS, // Spawn between gates (gate at -20, obstacle at -10)
              type: randomType,
              hit: false,
              passed: false
            };
            activeObstacles.push(newObstacle);
          }

          const newUsedIds = unusedQuestions.length > 0
            ? [...usedQuestionIds, randomQ.id]
            : [randomQ.id];

          set({
            gates: activeGates,
            obstacles: activeObstacles,
            lives: newLives,
            score: newScore,
            speed: newSpeed,
            status: newStatus,
            stats: {
              ...newStats,
              accuracy: newStats.total > 0 ? Math.round((newStats.correct / newStats.total) * 100) : 0
            },
            usedQuestionIds: newUsedIds,
            currentQuestionText: nextQuestionText // Update the question text
          });
          return;
        }
      }

      // 6. Update Stats and State
      newStats.accuracy = newStats.total > 0 ? Math.round((newStats.correct / newStats.total) * 100) : 0;

      set({
        gates: activeGates,
        obstacles: activeObstacles,
        lives: newLives,
        score: newScore,
        speed: newSpeed,
        status: newStatus,
        stats: newStats,
        lastAnswerCorrect: newLastAnswerCorrect,
        currentQuestionText: state.currentQuestionText // Persist or update question text
      });
    },
  },
}));