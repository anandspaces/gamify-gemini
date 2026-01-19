# Gamify Gemini - Frontend Architecture Overview

## Table of Contents
1. [Introduction](#introduction)
2. [Architecture Diagram](#architecture-diagram)
3. [Component Hierarchy](#component-hierarchy)
4. [Data Flow](#data-flow)
5. [Directory Structure](#directory-structure)
6. [File Summaries](#file-summaries)
7. [Technology Stack](#technology-stack)
8. [Key Architectural Patterns](#key-architectural-patterns)

---

## Introduction

Gamify Gemini is a 3D educational racing game built with Next.js and React Three Fiber. Players answer AI-generated questions while navigating a car through lanes, avoiding obstacles, and collecting points. The game features real-time 3D graphics, particle effects, and dynamic question generation powered by Google's Gemini AI.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          Entry Point                            │
│  ┌──────────────────────┐      ┌─────────────────────────┐      │
│  │   app/page.tsx       │      │   app/layout.tsx        │      │
│  │   Main Game Page     │      │   Root Layout           │      │
│  └──────────────────────┘      └─────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      State Management                           │
│  ┌──────────────────────┐      ┌─────────────────────────┐      │
│  │ store/useGameStore   │◄────►│   types/game.ts         │      │
│  │ Zustand Store        │      │   Type Definitions      │      │
│  └──────────────────────┘      └─────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Layer                               │
│  ┌─────────────────┐  ┌──────────────┐  ┌─────────────────┐     │
│  │ api/generate-   │  │ api/session/ │  │  lib/gemini.ts  │     │
│  │ game/route.ts   │  │ [id]/route.ts│  │  Gemini Client  │     │
│  └─────────────────┘  └──────────────┘  └─────────────────┘     │
│  ┌─────────────────┐  ┌──────────────────────────────────┐      │
│  │ lib/rateLimit   │  │  lib/sessionStore.ts             │      │
│  │ Rate Limiting   │  │  Session Management              │      │
│  └─────────────────┘  └──────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Core UI Components                         │
│  ┌──────────────────────┐  ┌─────────────────────────────┐      │
│  │ components/Screens   │  │  components/HUD.tsx         │      │
│  │ Start, GameOver,     │  │  Heads-Up Display           │      │
│  │ Pause Screens        │  │                             │      │
│  └──────────────────────┘  └─────────────────────────────┘      │
│  ┌──────────────────────────────────────────────────────┐       │
│  │          components/Scene.tsx                        │       │
│  │          3D Scene Container                          │       │
│  └──────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     3D Game Objects                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐       │
│  │ Car3D.tsx    │  │ Gate3D.tsx   │  │  Track3D.tsx     │       │
│  │ Player Car   │  │ Question     │  │  Road Track      │       │
│  │              │  │ Gates        │  │                  │       │
│  └──────────────┘  └──────────────┘  └──────────────────┘       │
│  ┌──────────────────────────────────────────────────────┐       │
│  │              Obstacle3D.tsx                          │       │
│  │              Obstacle Manager                        │       │
│  │  ┌────────────────────┐  ┌─────────────────────┐     │       │
│  │  │ ObstacleCar3D.tsx  │  │ ObstacleRock3D.tsx  │     │       │
│  │  │ Car Obstacles      │  │ Rock Obstacles      │     │       │
│  │  └────────────────────┘  └─────────────────────┘     │       │
│  └──────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Visual Effects                             │
│  ┌──────────────────────┐  ┌─────────────────────────────┐      │
│  │ SpeedLines.tsx       │  │  ParticleEffect.tsx         │      │
│  │ Speed Effect         │  │  Particle System            │      │
│  └──────────────────────┘  └─────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
app/page.tsx (GamePage)
├── StartScreen
├── Game View
│   ├── HUD Component
│   │   ├── Score Display
│   │   ├── Lives Display
│   │   ├── Speed Display
│   │   ├── Accuracy Display
│   │   ├── Question Display
│   │   └── Mobile Lane Buttons
│   │
│   └── Scene Component (React Three Fiber Canvas)
│       ├── Lighting Setup
│       ├── Track3D
│       ├── Car3D
│       │   ├── GLB Model
│       │   └── Particle Effects
│       │
│       ├── Gate3D Array
│       ├── Obstacle3D Array
│       │   ├── ObstacleCar3D
│       │   └── ObstacleRock3D
│       │
│       └── Visual Effects
│           ├── Camera Shake
│           ├── SpeedLines
│           └── Stars Background
│
├── PauseScreen
└── GameOverScreen
```

---

## Data Flow

### Game Initialization Flow
```
User → StartScreen → Click Play
    → app/page.tsx: loadCustomQuestions()
    → API: /api/generate-game
    → Gemini AI: Generate Questions
    → Return Questions Array
    → useGameStore: Initialize Game State
    → Game Loop Starts (60 FPS)
```

### Game Loop Flow
```
requestAnimationFrame (60 FPS)
    → useGameStore.tickGameLoop()
    → Update positions (gates, obstacles, car)
    → Check collisions
    → Update game state
    → Trigger effects
    → Re-render Scene & HUD
```

### User Input Flow
```
User Input (Keyboard/Touch)
    → Select Lane (1/2/3/4 or Touch Button)
    → useGameStore.moveCar(laneIndex)
    → Check Gate Collision
    → Update Score/Lives
    → Update Visual Feedback (HUD, Camera Shake, Particles)
    → Continue Game Loop
```

---

## Directory Structure

```
/home/anand/yoyo/gamify-gemini/
│
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── generate-game/
│   │   │   └── route.ts          # Question generation endpoint
│   │   └── session/
│   │       └── [id]/
│   │           └── route.ts      # Session management endpoint
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Main game page (entry point)
│   ├── globals.css               # Global styles & animations
│   └── favicon.ico               # App icon
│
├── components/                   # React Components
│   ├── Car3D.tsx                 # 3D player car with GLB model
│   ├── Gate3D.tsx                # 3D question gates with options
│   ├── Track3D.tsx               # 3D road track
│   ├── Obstacle3D.tsx            # Obstacle manager component
│   ├── ObstacleCar3D.tsx         # Car obstacle variant
│   ├── ObstacleRock3D.tsx        # Rock obstacle variant
│   ├── Scene.tsx                 # Main 3D scene container
│   ├── HUD.tsx                   # Heads-up display overlay
│   ├── Screens.tsx               # Game screens (Start, GameOver, Pause)
│   ├── SpeedLines.tsx            # Speed effect particles
│   ├── ParticleEffect.tsx        # Particle system for car
│   ├── Car.tsx                   # Legacy 2D car (unused)
│   ├── Gate.tsx                  # Legacy 2D gate (unused)
│   └── Track.tsx                 # Legacy 2D track (unused)
│
├── lib/                          # Utility Libraries
│   ├── gemini.ts                 # Gemini AI client & question generation
│   ├── rateLimit.ts              # API rate limiting logic
│   ├── sessionStore.ts           # Session management for concurrent users
│   └── responsive.config.ts      # Responsive configuration for mobile/desktop
│
├── store/                        # State Management
│   └── useGameStore.ts           # Zustand store (game state & logic)
│
├── types/                        # TypeScript Definitions
│   └── game.ts                   # Game interfaces & types
│
├── public/                       # Static Assets
│   ├── object.glb                # 3D car model
│   └── *.svg                     # Icon assets
│
├── .env                          # Environment variables (API keys)
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
└── README.md                     # Project documentation
```

---

## File Summaries

### Entry Point & Layout

#### `app/page.tsx`
Main game page component that orchestrates the entire game flow. Handles keyboard and touch input, manages the game loop via `requestAnimationFrame`, fetches questions from the API, and conditionally renders screens based on game status (Start, Playing, GameOver, Pause).

#### `app/layout.tsx`
Root layout wrapper that defines the HTML structure, metadata (title, description), and global styles for the entire application.

---

### State Management

#### `store/useGameStore.ts`
Zustand state store that serves as the central game state management hub. Contains score, lives, speed, gates, obstacles, game status, and all core game logic including collision detection, spawning, scoring, and state transitions. The `tickGameLoop()` function drives the entire game at 60 FPS.

#### `types/game.ts`
TypeScript type definitions that define interfaces for `Question`, `Gate`, `Obstacle`, `GameState`, `GameStats`, and the `GameStatus` enum.

---

### API Layer

#### `app/api/generate-game/route.ts`
Question generation API endpoint that accepts topic/subject parameters and uses Gemini AI to generate educational questions. Implements rate limiting and session management for production use.

#### `app/api/session/[id]/route.ts`
Session management endpoint that handles session creation and retrieval for supporting concurrent users.

#### `lib/gemini.ts`
Gemini AI client that initializes the Google Generative AI SDK and provides the `generateQuestions()` function with structured output parsing.

#### `lib/rateLimit.ts`
Rate limiting utility that implements a token bucket algorithm to prevent API abuse, configured for 10 requests per minute per IP address.

#### `lib/sessionStore.ts`
Session storage utility providing an in-memory session store for managing concurrent game sessions with automatic cleanup.

---

### Core UI Components

#### `components/Screens.tsx`
Contains three game screen components:
- **StartScreen**: Introduction screen with play button
- **GameOverScreen**: Results screen with IQ calculation and replay option
- **PauseScreen**: Pause overlay

#### `components/HUD.tsx`
Heads-up display overlay that shows score, lives, speed, accuracy, current question, pause button, and mobile lane selection buttons. Includes visual feedback animations for correct/incorrect answers.

#### `components/Scene.tsx`
3D scene container that sets up the React Three Fiber canvas, lighting, camera, fog, stars background, and renders all 3D game objects. Includes camera shake effect triggered by wrong answers.

---

### 3D Game Objects

#### `components/Car3D.tsx`
Player car component that loads the GLB model, handles lane transitions with smooth animations, manages particle effects (exhaust and sparks), and responds to game state changes with visual feedback.

#### `components/Gate3D.tsx`
Question gate component that renders 3D gates with four answer options (A, B, C, D) in separate lanes. Displays question text, animates based on position, and provides visual feedback (green/red) when answered.

#### `components/Track3D.tsx`
Road track component that renders an infinite scrolling road with lane markers, road surface texture, and environmental elements.

#### `components/Obstacle3D.tsx`
Obstacle manager component that routes obstacle rendering to specific obstacle type components based on the obstacle's type property.

#### `components/ObstacleCar3D.tsx`
Car obstacle variant that renders 3D car obstacles blocking specific lanes.

#### `components/ObstacleRock3D.tsx`
Rock obstacle variant that renders 3D rock obstacles blocking specific lanes.

---

### Visual Effects

#### `components/SpeedLines.tsx`
Speed effect particles that create a motion blur effect with animated particles moving past the camera to enhance the sense of speed.

#### `components/ParticleEffect.tsx`
Particle system that generates exhaust and spark particles for the player car, with different colors and behaviors based on the current game state (correct/incorrect answer feedback).

---

### Configuration

#### `lib/responsive.config.ts`
Centralized responsive configuration that provides settings for mobile vs desktop experiences, including camera position, FOV, lighting, performance settings, and star count. Exports the `useResponsiveGame()` hook for components to access responsive settings.

---

### Legacy Components (Unused)

#### `components/Car.tsx`
Original 2D car implementation, replaced by `Car3D.tsx`.

#### `components/Gate.tsx`
Original 2D gate implementation, replaced by `Gate3D.tsx`.

#### `components/Track.tsx`
Original 2D track implementation, replaced by `Track3D.tsx`.

---

## Technology Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **3D Rendering** | React Three Fiber (@react-three/fiber) |
| **3D Utilities** | @react-three/drei |
| **State Management** | Zustand |
| **AI Integration** | Google Generative AI (Gemini) |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |

---

## Key Architectural Patterns

### 1. Centralized State Management
All game logic resides in `useGameStore.ts` using Zustand, making state predictable, easy to debug, and accessible from any component without prop drilling.

### 2. Component Composition
The 3D scene is composed of small, focused components (Car, Gate, Track, Obstacles) that read from the global store, making the codebase modular and maintainable.

### 3. Responsive Design
`responsive.config.ts` provides a single source of truth for mobile/desktop differences, ensuring consistent scaling and optimal performance across devices.

### 4. Game Loop Architecture
`requestAnimationFrame` in `page.tsx` calls `tickGameLoop()` at 60 FPS, which updates all game state synchronously, ensuring smooth gameplay and predictable physics.

### 5. API-Driven Content
Questions are dynamically generated via Gemini AI with session management and rate limiting, making the game scalable and production-ready.

### 6. Visual Feedback System
Multiple layers of feedback (HUD color changes, camera shake, particle effects, screen flashes) provide a rich, immersive user experience that clearly communicates game state changes.

---

## Summary

Gamify Gemini demonstrates a modern, scalable architecture for building interactive 3D web applications. By leveraging Next.js for server-side rendering, Zustand for state management, React Three Fiber for 3D graphics, and Gemini AI for dynamic content generation, the project achieves high performance, maintainability, and extensibility. The clear separation of concerns between UI components, game logic, API layer, and visual effects makes it easy to add new features, fix bugs, and optimize performance.