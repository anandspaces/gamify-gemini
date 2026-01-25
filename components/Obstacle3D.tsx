// components/Obstacle3D.tsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useResponsiveGame } from '@/lib/responsive.config';
import { ObstacleCarProps, ObstacleRockProps, Obstacle3DProps } from '@/types/types';
import { RoundedBox } from '@react-three/drei';

export default function Obstacle3D({ obstacle }: Obstacle3DProps) {
    const groupRef = useRef<THREE.Group>(null);
    const config = useResponsiveGame();

    // Map store position (0-100) to 3D Z position (-100 to 0)
    const zPos = -100 + obstacle.position;

    // Lane positioning from centralized config
    const xPos = config.lanePositions[obstacle.lane];

    // Enhanced rotation and bobbing animations
    useFrame((state, delta) => {
        if (groupRef.current) {
            // Different animations based on obstacle type
            if (obstacle.type === 'hazard') {
                // Rocks rotate slowly
                groupRef.current.rotation.y += delta * 1.5;
            } else if (obstacle.type === 'cone') {
                // Cones wobble slightly
                groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.05;
            }

            // Realistic bobbing - more grounded for heavy objects
            const bobbingAmplitude = obstacle.type === 'cone' ? 0.03 : 0.01;
            const bobbingSpeed = obstacle.type === 'cone' ? 3 : 2;
            groupRef.current.position.y = 0.02 + Math.sin(state.clock.elapsedTime * bobbingSpeed) * bobbingAmplitude;

            // Pulse effect when hit
            if (obstacle.hit) {
                const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 20) * 0.1;
                groupRef.current.scale.setScalar(pulseScale);
            }
        }
    });

    // Render different obstacle types with realistic models
    const renderObstacle = () => {
        switch (obstacle.type) {
            case 'barrier':
                return <ObstacleBarrier3D isMobile={config.isMobile} hit={obstacle.hit} />;
            case 'cone':
                return <ObstacleCone3D isMobile={config.isMobile} hit={obstacle.hit} />;
            case 'hazard':
                return <ObstacleRock3D isMobile={config.isMobile} hit={obstacle.hit} />;
            default:
                return <ObstacleBarrier3D isMobile={config.isMobile} hit={obstacle.hit} />;
        }
    };

    return (
        <group ref={groupRef} position={[xPos, 0.5, zPos]}>
            {renderObstacle()}

            {/* Collision particle effect */}
            {obstacle.hit && <CollisionParticles />}
        </group>
    );
}

// Collision Particle Effect
function CollisionParticles() {
    const particlesRef = useRef<THREE.Points>(null);
    const particleCount = 15;

    const particles = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const velocities: THREE.Vector3[] = [];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;

            velocities.push(new THREE.Vector3(
                (Math.random() - 0.5) * 0.5,
                Math.random() * 0.5,
                (Math.random() - 0.5) * 0.5
            ));
        }

        return { positions, velocities };
    }, []);

    useFrame((state, delta) => {
        if (particlesRef.current) {
            const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] += particles.velocities[i].x * delta;
                positions[i * 3 + 1] += particles.velocities[i].y * delta;
                positions[i * 3 + 2] += particles.velocities[i].z * delta;

                // Gravity
                particles.velocities[i].y -= delta * 2;
            }

            particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles.positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                color="#ff6600"
                transparent
                opacity={0.8}
                sizeAttenuation
            />
        </points>
    );
}

// Traffic Cone - Realistic construction cone
function ObstacleCone3D({ isMobile, hit }: { isMobile: boolean; hit: boolean }) {
    const scale = 0.5;

    return (
        <group scale={scale}>
            {/* Cone body */}
            <mesh position={[0, 0.3, 0]} castShadow={!isMobile}>
                <coneGeometry args={[0.3, 0.6, isMobile ? 8 : 16]} />
                <meshStandardMaterial
                    color={hit ? "#ff0000" : "#ff6600"}
                    metalness={0.1}
                    roughness={0.8}
                    emissive={hit ? "#ff0000" : "#000000"}
                    emissiveIntensity={hit ? 0.5 : 0}
                />
            </mesh>

            {/* White reflective stripes */}
            {[0.15, 0.35, 0.55].map((y, i) => (
                <mesh key={i} position={[0, y, 0]}>
                    <cylinderGeometry args={[0.31 - y * 0.3, 0.31 - y * 0.3, 0.06, isMobile ? 8 : 16]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        metalness={0.3}
                        roughness={0.4}
                        emissive="#ffffff"
                        emissiveIntensity={0.2}
                    />
                </mesh>
            ))}

            {/* Base */}
            <mesh position={[0, 0, 0]} castShadow={!isMobile}>
                <cylinderGeometry args={[0.35, 0.35, 0.05, isMobile ? 8 : 16]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    metalness={0.2}
                    roughness={0.9}
                />
            </mesh>

            {/* Rubber base ring */}
            <mesh position={[0, 0.025, 0]}>
                <torusGeometry args={[0.32, 0.03, 8, isMobile ? 12 : 16]} />
                <meshStandardMaterial
                    color="#0a0a0a"
                    metalness={0}
                    roughness={1}
                />
            </mesh>

            {/* Shadow */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]}>
                <circleGeometry args={[0.4, 16]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.3} depthWrite={false} />
            </mesh>
        </group>
    );
}

// Barrier - Abandoned/Damaged Car
function ObstacleBarrier3D({ isMobile, hit }: { isMobile: boolean; hit: boolean }) {
    const scale = 0.6;

    return (
        <group scale={scale}>
            {/* Car Body - Damaged and rusted */}
            <RoundedBox
                args={[0.8, 0.4, 1.6]}
                radius={0.05}
                smoothness={2}
                position={[0, 0.15, 0]}
                castShadow={!isMobile}
            >
                <meshStandardMaterial
                    color={hit ? "#ff0000" : "#3a3a3a"}
                    metalness={0.3}
                    roughness={0.9}
                    emissive={hit ? "#ff0000" : "#000000"}
                    emissiveIntensity={hit ? 0.3 : 0}
                />
            </RoundedBox>

            {/* Broken Cabin */}
            <RoundedBox
                args={[0.65, 0.35, 0.9]}
                radius={0.04}
                smoothness={2}
                position={[0, 0.5, -0.1]}
                castShadow={!isMobile}
            >
                <meshStandardMaterial
                    color="#2a2a2a"
                    metalness={0.2}
                    roughness={0.95}
                    transparent
                    opacity={0.6}
                />
            </RoundedBox>

            {/* Flat/Damaged Wheels */}
            {[
                [-0.35, 0, 0.5],
                [0.35, 0, 0.5],
                [-0.35, 0, -0.5],
                [0.35, 0, -0.5]
            ].map((pos, i) => (
                <group key={i} position={pos as [number, number, number]}>
                    <mesh rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.18, 0.18, 0.15, isMobile ? 8 : 12]} />
                        <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={1} />
                    </mesh>
                    {/* Flat tire effect */}
                    <mesh rotation={[0, 0, Math.PI / 2]} position={[0, -0.05, 0]}>
                        <cylinderGeometry args={[0.19, 0.17, 0.14, isMobile ? 8 : 12]} />
                        <meshStandardMaterial color="#0a0a0a" metalness={0} roughness={1} />
                    </mesh>
                </group>
            ))}

            {/* Rust/Damage spots with varied colors */}
            <mesh position={[0.3, 0.2, 0.6]}>
                <sphereGeometry args={[0.08, isMobile ? 6 : 8, isMobile ? 6 : 8]} />
                <meshStandardMaterial color="#8b4513" roughness={1} metalness={0} />
            </mesh>
            <mesh position={[-0.25, 0.15, -0.4]}>
                <sphereGeometry args={[0.06, isMobile ? 6 : 8, isMobile ? 6 : 8]} />
                <meshStandardMaterial color="#654321" roughness={1} metalness={0} />
            </mesh>
            <mesh position={[0.1, 0.3, 0.2]}>
                <sphereGeometry args={[0.05, isMobile ? 6 : 8, isMobile ? 6 : 8]} />
                <meshStandardMaterial color="#a0522d" roughness={1} metalness={0} />
            </mesh>

            {/* Broken headlight */}
            <mesh position={[-0.3, 0.2, 0.8]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial
                    color="#333333"
                    metalness={0.5}
                    roughness={0.8}
                    transparent
                    opacity={0.3}
                />
            </mesh>

            {/* Warning stripes on hood - faded */}
            <mesh position={[0, 0.36, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.6, 0.3]} />
                <meshBasicMaterial color="#ffcc00" opacity={0.4} transparent />
            </mesh>

            {/* Dents and damage */}
            <mesh position={[0.35, 0.2, 0]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial color="#2a2a2a" metalness={0.1} roughness={1} />
            </mesh>

            {/* Shadow */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]} scale={[0.5, 0.9, 1]}>
                <circleGeometry args={[1, 16]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.4} depthWrite={false} />
            </mesh>
        </group>
    );
}

// Enhanced Rock Formation
export function ObstacleRock3D({ isMobile, hit }: { isMobile: boolean; hit: boolean }) {
    // Random variation for each rock
    const variation = useMemo(() => ({
        scale: 0.8 + Math.random() * 0.4,
        rotation: Math.random() * Math.PI * 2,
        color: ['#5a5a5a', '#4a4a4a', '#6a6a6a'][Math.floor(Math.random() * 3)]
    }), []);

    return (
        <group scale={variation.scale} rotation={[0, variation.rotation, 0]}>
            {/* Main rock body - irregular shape with multiple dodecahedrons */}
            <mesh castShadow={!isMobile} position={[0, 0, 0]}>
                <dodecahedronGeometry args={[0.5, 1]} />
                <meshStandardMaterial
                    color={hit ? "#ff4444" : variation.color}
                    metalness={0.1}
                    roughness={0.95}
                    emissive={hit ? "#ff0000" : "#000000"}
                    emissiveIntensity={hit ? 0.3 : 0}
                />
            </mesh>

            {/* Additional rock chunks for more realistic irregular shape */}
            <mesh castShadow={!isMobile} position={[0.2, 0.15, 0.1]} rotation={[0.5, 0.3, 0.2]}>
                <dodecahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial
                    color="#4a4a4a"
                    metalness={0.05}
                    roughness={1}
                />
            </mesh>

            <mesh castShadow={!isMobile} position={[-0.15, 0.1, -0.1]} rotation={[0.2, 0.8, 0.4]}>
                <dodecahedronGeometry args={[0.25, 1]} />
                <meshStandardMaterial
                    color="#6a6a6a"
                    metalness={0.08}
                    roughness={0.98}
                />
            </mesh>

            {/* Smaller detail rocks */}
            <mesh position={[0.3, -0.1, 0.2]}>
                <dodecahedronGeometry args={[0.15, 0]} />
                <meshStandardMaterial
                    color="#3a3a3a"
                    metalness={0}
                    roughness={1}
                />
            </mesh>

            <mesh position={[-0.25, -0.05, 0.15]}>
                <dodecahedronGeometry args={[0.12, 0]} />
                <meshStandardMaterial
                    color="#4a4a4a"
                    metalness={0}
                    roughness={1}
                />
            </mesh>

            {/* Moss/lichen patches for realism */}
            <mesh position={[0.1, 0.2, 0.25]}>
                <sphereGeometry args={[0.08, isMobile ? 6 : 8, isMobile ? 6 : 8]} />
                <meshStandardMaterial
                    color="#2d5016"
                    roughness={1}
                    metalness={0}
                />
            </mesh>

            <mesh position={[-0.2, 0.05, -0.2]}>
                <sphereGeometry args={[0.06, isMobile ? 6 : 8, isMobile ? 6 : 8]} />
                <meshStandardMaterial
                    color="#3a6b1f"
                    roughness={1}
                    metalness={0}
                />
            </mesh>

            {/* Small pebbles around base */}
            {[...Array(5)].map((_, i) => (
                <mesh
                    key={i}
                    position={[
                        (Math.random() - 0.5) * 0.8,
                        -0.2,
                        (Math.random() - 0.5) * 0.8
                    ]}
                >
                    <sphereGeometry args={[0.05 + Math.random() * 0.05, 6, 6]} />
                    <meshStandardMaterial
                        color="#3a3a3a"
                        roughness={1}
                        metalness={0}
                    />
                </mesh>
            ))}

            {/* Cracks and texture details (desktop only) */}
            {!isMobile && (
                <>
                    <mesh position={[0.15, 0.1, 0.3]}>
                        <boxGeometry args={[0.02, 0.15, 0.02]} />
                        <meshStandardMaterial color="#1a1a1a" roughness={1} />
                    </mesh>
                    <mesh position={[-0.1, 0.05, -0.15]}>
                        <boxGeometry args={[0.02, 0.12, 0.02]} />
                        <meshStandardMaterial color="#1a1a1a" roughness={1} />
                    </mesh>
                </>
            )}

            {/* Shadow */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]}>
                <circleGeometry args={[0.6, 16]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.35} depthWrite={false} />
            </mesh>
        </group>
    );
}
