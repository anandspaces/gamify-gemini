// components/Scene.tsx
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { Stars } from '@react-three/drei';
import { useGameStore } from '@/store/useGameStore';
import { useResponsiveGame } from '@/lib/responsive.config';
import Track3D from './Track3D';
import Car3D from './Car3D';
import { Gate3D } from './Gate3D';
import Obstacle3D from './Obstacle3D';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ParticleEffectProps } from '@/types/types';

export function SpeedLines() {
    const groupRef = useRef<THREE.Group>(null);
    const { speed, isPaused, status } = useGameStore();
    const config = useResponsiveGame();

    // Generate speed lines
    const lines = useMemo(() => {
        const lineCount = config.isMobile ? 20 : 40;
        const lineData = [];

        for (let i = 0; i < lineCount; i++) {
            const angle = (Math.PI * 2 * i) / lineCount;
            const radius = 3 + Math.random() * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.random() * 4 - 1;
            const z = -Math.random() * 50;
            const length = 0.5 + Math.random() * 1.5;

            lineData.push({ x, y, z, length, speed: 0.5 + Math.random() * 0.5 });
        }

        return lineData;
    }, [config.isMobile]);

    useFrame((state, delta) => {
        if (groupRef.current && status === 'playing' && !isPaused) {
            groupRef.current.children.forEach((line, i) => {
                const lineData = lines[i];
                // Move lines forward based on game speed
                line.position.z += speed * 30 * delta * lineData.speed;

                // Reset position when line passes camera
                if (line.position.z > 5) {
                    line.position.z = -50;
                }

                // Fade based on speed
                const material = (line as THREE.Mesh).material as THREE.MeshBasicMaterial;
                material.opacity = Math.min(speed * 0.8, 0.6);
            });
        }
    });

    return (
        <group ref={groupRef}>
            {lines.map((line, i) => (
                <mesh
                    key={i}
                    position={[line.x, line.y, line.z]}
                    rotation={[Math.PI / 2, 0, 0]}
                >
                    <planeGeometry args={[0.05, line.length]} />
                    <meshBasicMaterial
                        color="#ffffff"
                        transparent
                        opacity={0.3}
                        depthWrite={false}
                    />
                </mesh>
            ))}
        </group>
    );
}


function ParticleEffect({
    position,
    color,
    count = 20,
    duration = 1,
    onComplete
}: ParticleEffectProps) {
    const groupRef = useRef<THREE.Group>(null);
    const startTime = useRef(Date.now());

    const particles = useMemo(() => {
        const particleData = [];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random() * 3;
            const vx = Math.cos(angle) * speed;
            const vy = Math.random() * 3 + 2;
            const vz = Math.sin(angle) * speed;

            particleData.push({
                velocity: new THREE.Vector3(vx, vy, vz),
                size: 0.1 + Math.random() * 0.15,
            });
        }
        return particleData;
    }, [count]);

    useFrame((state, delta) => {
        if (groupRef.current) {
            const elapsed = (Date.now() - startTime.current) / 1000;

            if (elapsed > duration) {
                if (onComplete) onComplete();
                return;
            }

            const progress = elapsed / duration;
            const opacity = 1 - progress;

            groupRef.current.children.forEach((particle, i) => {
                const data = particles[i];

                // Apply velocity
                particle.position.x += data.velocity.x * delta;
                particle.position.y += data.velocity.y * delta;
                particle.position.z += data.velocity.z * delta;

                // Apply gravity
                data.velocity.y -= 9.8 * delta;

                // Update material opacity
                const material = (particle as THREE.Mesh).material as THREE.MeshBasicMaterial;
                material.opacity = opacity;

                // Scale down over time
                const scale = 1 - progress * 0.5;
                particle.scale.set(scale, scale, scale);
            });
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {particles.map((particle, i) => (
                <mesh key={i} position={[0, 0, 0]}>
                    <sphereGeometry args={[particle.size, 8, 8]} />
                    <meshBasicMaterial
                        color={color}
                        transparent
                        opacity={1}
                        depthWrite={false}
                    />
                </mesh>
            ))}
        </group>
    );
}


// Camera shake component
function CameraShake() {
    const { camera } = useThree();
    const { lastAnswerCorrect } = useGameStore();
    const shakeIntensity = useRef(0);
    const originalPosition = useRef(new THREE.Vector3());

    useEffect(() => {
        originalPosition.current.copy(camera.position);
    }, [camera]);

    useEffect(() => {
        if (lastAnswerCorrect === false) {
            shakeIntensity.current = 0.3;
        }
    }, [lastAnswerCorrect]);

    useFrame(() => {
        if (shakeIntensity.current > 0) {
            camera.position.x = originalPosition.current.x + (Math.random() - 0.5) * shakeIntensity.current;
            camera.position.y = originalPosition.current.y + (Math.random() - 0.5) * shakeIntensity.current;
            shakeIntensity.current *= 0.9;

            if (shakeIntensity.current < 0.01) {
                shakeIntensity.current = 0;
                camera.position.copy(originalPosition.current);
            }
        }
    });

    return null;
}

export default function Scene() {
    const { gates, obstacles } = useGameStore();
    const config = useResponsiveGame();

    return (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950 touch-none">
            <Canvas
                camera={{
                    position: config.camera.position,
                    fov: config.camera.fov
                }}
                dpr={config.performance.dpr}
                performance={{ min: 0.5 }}
                gl={{
                    powerPreference: config.performance.powerPreference,
                    antialias: config.performance.antialias,
                    alpha: false,
                    stencil: false,
                    depth: true
                }}
            >
                {/* Responsive Lighting */}
                <ambientLight intensity={config.lighting.ambient} />
                <directionalLight
                    position={[5, 10, 5]}
                    intensity={config.lighting.directional}
                    castShadow={config.performance.castShadow}
                    shadow-mapSize={config.performance.shadowMapSize}
                />
                <directionalLight
                    position={[-5, 10, -5]}
                    intensity={config.lighting.secondary}
                    color="#4f46e5"
                />
                <pointLight
                    position={[0, 5, 0]}
                    intensity={config.lighting.point}
                    color="#818cf8"
                />
                {/* Rim lighting for depth */}
                {!config.isMobile && (
                    <>
                        <directionalLight
                            position={[0, 2, -20]}
                            intensity={0.5}
                            color="#6366f1"
                        />
                        <hemisphereLight
                            args={['#4f46e5', '#1e1b4b', 0.3]}
                        />
                    </>
                )}

                {/* Responsive Environment */}
                <Stars
                    radius={100}
                    depth={50}
                    count={config.stars.count}
                    factor={config.stars.factor}
                    saturation={0}
                    fade
                    speed={config.stars.speed}
                />
                <fog attach="fog" args={['#020617', 5, config.performance.fogDistance]} />

                {/* Game Objects */}
                <Track3D />
                <Car3D />

                {/* Gates */}
                {gates.map((gate) => (
                    <Gate3D key={gate.id} gate={gate} />
                ))}

                {/* Obstacles */}
                {obstacles.map((obstacle) => (
                    <Obstacle3D key={obstacle.id} obstacle={obstacle} />
                ))}

                {/* Speed Lines Effect */}
                <SpeedLines />

                {/* Camera Shake Effect */}
                <CameraShake />
            </Canvas>
        </div>
    );
}