// components/Car3D.tsx
import { useRef, memo, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/store/useGameStore';
import * as THREE from 'three';
import { useResponsiveGame } from '@/lib/responsive.config';
import { CarProps } from '@/types/types';
import { motion } from 'framer-motion';
import { CarFront } from 'lucide-react';
import { RoundedBox } from '@react-three/drei';


export function Car({ lane, isCrash }: CarProps) {
    // Calculate percentage position for 4 lanes (12.5%, 37.5%, 62.5%, 87.5%)
    const leftPosition = `${lane * 25 + 12.5}%`;

    return (
        <motion.div
            className="absolute bottom-2 sm:bottom-3 md:bottom-4 lg:bottom-6 z-20 w-12 h-20 xs:w-14 xs:h-24 sm:w-16 sm:h-28 md:w-20 md:h-32 lg:w-24 lg:h-36"
            initial={{ left: "37.5%" }}
            animate={{
                left: leftPosition,
                scale: isCrash ? [1, 1.2, 0.8, 1] : 1,
                rotate: isCrash ? [0, -10, 10, -10, 0] : 0
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8 // Slightly lighter for smoother mobile animation
            }}
            style={{ translateX: '-50%' }} // Center the car on its lane position
        >
            {/* Simple Car Graphic */}
            <div className={`relative w-full h-full rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl md:shadow-2xl transition-all duration-300 ${isCrash
                ? 'bg-red-600 shadow-red-500/50'
                : 'bg-gradient-to-b from-indigo-500 to-indigo-700 shadow-indigo-500/50'
                }`}>
                {/* Roof/Windshield */}
                <div className="absolute top-[18%] sm:top-[20%] left-[8%] sm:left-[10%] right-[8%] sm:right-[10%] h-[38%] sm:h-[40%] bg-gradient-to-b from-gray-800 to-gray-900 rounded-md sm:rounded-lg border border-indigo-400/20 sm:border-2 sm:border-indigo-400/30 backdrop-blur-sm" />

                {/* Headlights */}
                <div className="absolute top-1 sm:top-2 left-1.5 sm:left-2 w-2 h-4 sm:w-3 sm:h-6 bg-yellow-300 rounded-full blur-[1px] sm:blur-[2px] shadow-[0_0_8px_yellow] sm:shadow-[0_0_10px_yellow]" />
                <div className="absolute top-1 sm:top-2 right-1.5 sm:right-2 w-2 h-4 sm:w-3 sm:h-6 bg-yellow-300 rounded-full blur-[1px] sm:blur-[2px] shadow-[0_0_8px_yellow] sm:shadow-[0_0_10px_yellow]" />

                {/* Side Mirrors */}
                <div className="absolute top-[30%] -left-1 w-2 h-3 sm:w-2.5 sm:h-4 bg-gray-700 rounded-sm border border-gray-600" />
                <div className="absolute top-[30%] -right-1 w-2 h-3 sm:w-2.5 sm:h-4 bg-gray-700 rounded-sm border border-gray-600" />

                {/* Tail lights */}
                <div className="absolute bottom-0.5 sm:bottom-1 left-1.5 sm:left-2 w-3 h-1.5 sm:w-4 sm:h-2 bg-red-500 rounded-full shadow-[0_0_10px_red] sm:shadow-[0_0_15px_red]" />
                <div className="absolute bottom-0.5 sm:bottom-1 right-1.5 sm:right-2 w-3 h-1.5 sm:w-4 sm:h-2 bg-red-500 rounded-full shadow-[0_0_10px_red] sm:shadow-[0_0_15px_red]" />

                {/* Front Bumper Detail */}
                <div className="absolute top-0 left-[15%] right-[15%] h-1 sm:h-1.5 bg-gray-800 rounded-b-md" />

                {/* Car Icon Overlay */}
                <div className="flex items-center justify-center h-full opacity-15 sm:opacity-20">
                    <CarFront size={28} className="sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                </div>

                {/* Speed Lines Effect (when not crashed) */}
                {!isCrash && (
                    <div className="absolute inset-0 overflow-hidden rounded-lg sm:rounded-xl opacity-30">
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </div>
                )}

                {/* Crash Effect */}
                {isCrash && (
                    <div className="absolute inset-0 bg-red-500/30 rounded-lg sm:rounded-xl animate-pulse" />
                )}
            </div>

            {/* Headlight Beams */}
            <div className="absolute -top-16 sm:-top-20 md:-top-24 left-1.5 sm:left-2 w-3 h-16 sm:w-4 sm:h-20 md:h-24 bg-gradient-to-t from-yellow-300/30 via-yellow-300/10 to-transparent blur-sm sm:blur-md pointer-events-none" />
            <div className="absolute -top-16 sm:-top-20 md:-top-24 right-1.5 sm:right-2 w-3 h-16 sm:w-4 sm:h-20 md:h-24 bg-gradient-to-t from-yellow-300/30 via-yellow-300/10 to-transparent blur-sm sm:blur-md pointer-events-none" />

            {/* Exhaust Smoke Effect (subtle) */}
            {!isCrash && (
                <>
                    <div className="absolute -bottom-1 left-[20%] w-2 h-2 bg-gray-400/20 rounded-full blur-md animate-pulse" style={{ animationDuration: '2s' }} />
                    <div className="absolute -bottom-1 right-[20%] w-2 h-2 bg-gray-400/20 rounded-full blur-md animate-pulse" style={{ animationDuration: '2s', animationDelay: '1s' }} />
                </>
            )}

            {/* Shadow */}
            <div className="absolute -bottom-1 left-[10%] right-[10%] h-2 bg-black/30 rounded-full blur-md" />
        </motion.div>
    );
}

// Exhaust Particle System Component
function ExhaustParticles({ position, speed }: { position: [number, number, number]; speed: number }) {
    const particlesRef = useRef<THREE.Points>(null);
    const particleCount = 20;

    const particles = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const lifetimes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 0.1;
            positions[i * 3 + 1] = Math.random() * 0.1;
            positions[i * 3 + 2] = Math.random() * 0.2;

            velocities[i * 3] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 1] = Math.random() * 0.05;
            velocities[i * 3 + 2] = -Math.random() * 0.1;

            lifetimes[i] = Math.random();
        }

        return { positions, velocities, lifetimes };
    }, []);

    useFrame((state, delta) => {
        if (particlesRef.current && speed > 0.05) {
            const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

            for (let i = 0; i < particleCount; i++) {
                particles.lifetimes[i] -= delta * 2;

                if (particles.lifetimes[i] <= 0) {
                    // Reset particle
                    positions[i * 3] = (Math.random() - 0.5) * 0.1;
                    positions[i * 3 + 1] = 0;
                    positions[i * 3 + 2] = 0;
                    particles.lifetimes[i] = 1;
                } else {
                    // Update particle position
                    positions[i * 3] += particles.velocities[i * 3];
                    positions[i * 3 + 1] += particles.velocities[i * 3 + 1];
                    positions[i * 3 + 2] += particles.velocities[i * 3 + 2];
                }
            }

            particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    if (speed < 0.05) return null;

    return (
        <points ref={particlesRef} position={position}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles.positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#666666"
                transparent
                opacity={0.3}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
}

export function Car3D() {
    const meshRef = useRef<THREE.Group>(null);
    const wheelRefs = useRef<THREE.Mesh[]>([]);
    const shadowRef = useRef<THREE.Mesh>(null);
    const brakeLightRefs = useRef<THREE.Mesh[]>([]);
    const suspensionRef = useRef({ compression: 0, velocity: 0 });
    const previousLane = useRef<number>(1);

    const { selectedLane, speed, lastAnswerCorrect } = useGameStore();
    const config = useResponsiveGame();

    const { lanePositions, car: carConfig, isMobile } = config;

    // Create environment map for reflections
    const envMap = useMemo(() => {
        if (isMobile) return null;
        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
        return cubeRenderTarget.texture;
    }, [isMobile]);

    useFrame((state, delta) => {
        if (meshRef.current) {
            const targetX = lanePositions[selectedLane ?? 1];
            const currentX = meshRef.current.position.x;

            // Smooth lerp with responsive speed
            meshRef.current.position.x = THREE.MathUtils.lerp(
                currentX,
                targetX,
                delta * carConfig.animationSpeed.laneSwitch
            );

            // Enhanced tilt with banking effect during lane changes
            const tiltMultiplier = isMobile ? 0.3 : 0.5;
            const lateralVelocity = (targetX - currentX) * 2;
            const tilt = lateralVelocity * tiltMultiplier;
            meshRef.current.rotation.z = THREE.MathUtils.lerp(
                meshRef.current.rotation.z,
                tilt,
                delta * 8
            );

            // Advanced suspension system with spring physics
            const targetHeight = 0.05;
            const springStrength = 15;
            const damping = 0.8;

            // Calculate suspension compression based on speed and lane changes
            const speedBump = Math.sin(state.clock.elapsedTime * 10) * 0.01 * speed;
            const laneChangeCompression = Math.abs(lateralVelocity) * 0.02;

            suspensionRef.current.velocity += (targetHeight - meshRef.current.position.y) * springStrength * delta;
            suspensionRef.current.velocity *= damping;
            suspensionRef.current.compression = speedBump + laneChangeCompression;

            const bobbingY = Math.sin(state.clock.elapsedTime * carConfig.animationSpeed.bobbing) * carConfig.animationSpeed.bobbingAmplitude;
            meshRef.current.position.y = targetHeight + bobbingY + suspensionRef.current.compression;

            // Rotate wheels based on speed with realistic physics
            wheelRefs.current.forEach((wheel) => {
                if (wheel) {
                    wheel.rotation.x -= speed * delta * 20;
                }
            });

            // Brake lights activation during deceleration or wrong answer
            const isBraking = lastAnswerCorrect === false || speed < 0.08;
            brakeLightRefs.current.forEach((light) => {
                if (light) {
                    const targetIntensity = isBraking ? 1.5 : 0.8;
                    const currentMaterial = light.material as THREE.MeshStandardMaterial;
                    currentMaterial.emissiveIntensity = THREE.MathUtils.lerp(
                        currentMaterial.emissiveIntensity,
                        targetIntensity,
                        delta * 10
                    );
                }
            });

            // Update shadow with realistic projection
            if (shadowRef.current) {
                shadowRef.current.position.x = meshRef.current.position.x;
                const shadowScale = 1 - (meshRef.current.position.y - 0.05) * 0.5;
                shadowRef.current.scale.set(shadowScale, shadowScale, shadowScale);
                const shadowOpacity = 0.4 * shadowScale;
                (shadowRef.current.material as THREE.MeshBasicMaterial).opacity = shadowOpacity;
            }

            // Track lane changes for effects
            if (selectedLane !== previousLane.current) {
                previousLane.current = selectedLane ?? 1;
            }
        }
    });

    // Responsive geometry sizes
    const getCarDimensions = () => {
        const scale = carConfig.scale;
        return {
            body: [0.8 * scale, 0.5 * scale, 1.8 * scale] as [number, number, number],
            cabin: [0.7 * scale, 0.4 * scale, 1.0 * scale] as [number, number, number],
            wheelRadius: 0.2 * scale,
            wheelWidth: 0.2 * scale,
            wheelOffset: 0.45 * scale
        };
    };

    const dims = getCarDimensions();

    return (
        <>
            {/* Ground Shadow - Contact Shadow for realistic ground effect */}
            <mesh
                ref={shadowRef}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.48, 0]}
                receiveShadow={false}
            >
                <circleGeometry args={[1.2 * carConfig.scale, 32]} />
                <meshBasicMaterial
                    color="#000000"
                    transparent
                    opacity={0.4}
                    depthWrite={false}
                />
            </mesh>

            <group ref={meshRef} position={[0, 0.05, 0]} scale={carConfig.scale}>
                {/* Car Body - Enhanced with RoundedBox for smooth edges */}
                <RoundedBox
                    args={dims.body}
                    radius={0.08 * carConfig.scale}
                    smoothness={4}
                    position={[0, 0.2, 0]}
                    castShadow={!isMobile}
                >
                    <meshStandardMaterial
                        color="#ef4444"
                        metalness={isMobile ? 0.7 : 0.85}
                        roughness={isMobile ? 0.3 : 0.15}
                        emissive="#ef4444"
                        emissiveIntensity={0.1}
                        envMap={envMap}
                        envMapIntensity={0.5}
                    />
                </RoundedBox>

                {/* Cabin/Windshield - Rounded for realism */}
                <RoundedBox
                    args={dims.cabin}
                    radius={0.06 * carConfig.scale}
                    smoothness={4}
                    position={[0, 0.6, -0.2]}
                    castShadow={!isMobile}
                >
                    <meshStandardMaterial
                        color="#1e293b"
                        metalness={isMobile ? 0.8 : 0.95}
                        roughness={0.05}
                        transparent
                        opacity={0.85}
                        envMap={envMap}
                        envMapIntensity={0.8}
                    />
                </RoundedBox>

                {/* Front Hood Detail with Rounded Edges */}
                <RoundedBox
                    args={[0.6 * carConfig.scale, 0.1 * carConfig.scale, 0.3 * carConfig.scale]}
                    radius={0.02 * carConfig.scale}
                    smoothness={2}
                    position={[0, 0.3, 0.8]}
                >
                    <meshStandardMaterial
                        color="#dc2626"
                        metalness={0.9}
                        roughness={0.1}
                        envMap={envMap}
                    />
                </RoundedBox>

                {/* Spoiler with aerodynamic shape */}
                <RoundedBox
                    args={[0.8 * carConfig.scale, 0.05 * carConfig.scale, 0.2 * carConfig.scale]}
                    radius={0.01 * carConfig.scale}
                    smoothness={2}
                    position={[0, 0.7, -0.9]}
                >
                    <meshStandardMaterial
                        color="#1e293b"
                        metalness={0.8}
                        roughness={0.2}
                    />
                </RoundedBox>

                {/* Front Wheels with Treads */}
                <group position={[-dims.wheelOffset, 0, 0.5]}>
                    <mesh
                        ref={(el) => { if (el) wheelRefs.current[0] = el; }}
                        rotation={[0, 0, Math.PI / 2]}
                        castShadow={!isMobile}
                    >
                        <cylinderGeometry args={[dims.wheelRadius, dims.wheelRadius, dims.wheelWidth, isMobile ? 12 : 16]} />
                        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
                    </mesh>
                    {/* Tire Tread Details */}
                    {!isMobile && (
                        <>
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                <mesh
                                    key={i}
                                    rotation={[0, 0, Math.PI / 2]}
                                    position={[0, 0, 0]}
                                >
                                    <torusGeometry args={[dims.wheelRadius * 0.95, 0.01, 4, 16, Math.PI / 3]} />
                                    <meshStandardMaterial color="#0a0a0a" roughness={1} />
                                </mesh>
                            ))}
                        </>
                    )}
                </group>

                <group position={[dims.wheelOffset, 0, 0.5]}>
                    <mesh
                        ref={(el) => { if (el) wheelRefs.current[1] = el; }}
                        rotation={[0, 0, Math.PI / 2]}
                        castShadow={!isMobile}
                    >
                        <cylinderGeometry args={[dims.wheelRadius, dims.wheelRadius, dims.wheelWidth, isMobile ? 12 : 16]} />
                        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
                    </mesh>
                </group>

                {/* Rear Wheels with Treads */}
                <group position={[-dims.wheelOffset, 0, -0.5]}>
                    <mesh
                        ref={(el) => { if (el) wheelRefs.current[2] = el; }}
                        rotation={[0, 0, Math.PI / 2]}
                        castShadow={!isMobile}
                    >
                        <cylinderGeometry args={[dims.wheelRadius, dims.wheelRadius, dims.wheelWidth, isMobile ? 12 : 16]} />
                        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
                    </mesh>
                </group>

                <group position={[dims.wheelOffset, 0, -0.5]}>
                    <mesh
                        ref={(el) => { if (el) wheelRefs.current[3] = el; }}
                        rotation={[0, 0, Math.PI / 2]}
                        castShadow={!isMobile}
                    >
                        <cylinderGeometry args={[dims.wheelRadius, dims.wheelRadius, dims.wheelWidth, isMobile ? 12 : 16]} />
                        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
                    </mesh>
                </group>

                {/* Enhanced Wheel Rims with Chrome Effect */}
                <mesh position={[-dims.wheelOffset, 0, 0.5]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[dims.wheelRadius * 0.6, dims.wheelRadius * 0.6, dims.wheelWidth * 0.3, isMobile ? 8 : 12]} />
                    <meshStandardMaterial
                        color="#c0c0c0"
                        metalness={1}
                        roughness={0.05}
                        envMap={envMap}
                        envMapIntensity={1}
                    />
                </mesh>
                <mesh position={[dims.wheelOffset, 0, 0.5]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[dims.wheelRadius * 0.6, dims.wheelRadius * 0.6, dims.wheelWidth * 0.3, isMobile ? 8 : 12]} />
                    <meshStandardMaterial
                        color="#c0c0c0"
                        metalness={1}
                        roughness={0.05}
                        envMap={envMap}
                        envMapIntensity={1}
                    />
                </mesh>
                <mesh position={[-dims.wheelOffset, 0, -0.5]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[dims.wheelRadius * 0.6, dims.wheelRadius * 0.6, dims.wheelWidth * 0.3, isMobile ? 8 : 12]} />
                    <meshStandardMaterial
                        color="#c0c0c0"
                        metalness={1}
                        roughness={0.05}
                        envMap={envMap}
                        envMapIntensity={1}
                    />
                </mesh>
                <mesh position={[dims.wheelOffset, 0, -0.5]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[dims.wheelRadius * 0.6, dims.wheelRadius * 0.6, dims.wheelWidth * 0.3, isMobile ? 8 : 12]} />
                    <meshStandardMaterial
                        color="#c0c0c0"
                        metalness={1}
                        roughness={0.05}
                        envMap={envMap}
                        envMapIntensity={1}
                    />
                </mesh>

                {/* Headlights with Better Glow */}
                <mesh position={[-0.3 * carConfig.scale, 0.2, 0.9]}>
                    <sphereGeometry args={[0.08 * carConfig.scale, isMobile ? 8 : 16, isMobile ? 8 : 16]} />
                    <meshStandardMaterial
                        color="#ffff00"
                        emissive="#ffff00"
                        emissiveIntensity={1.2}
                        metalness={0.5}
                        roughness={0.1}
                    />
                </mesh>
                <mesh position={[0.3 * carConfig.scale, 0.2, 0.9]}>
                    <sphereGeometry args={[0.08 * carConfig.scale, isMobile ? 8 : 16, isMobile ? 8 : 16]} />
                    <meshStandardMaterial
                        color="#ffff00"
                        emissive="#ffff00"
                        emissiveIntensity={1.2}
                        metalness={0.5}
                        roughness={0.1}
                    />
                </mesh>

                {/* Tail Lights with Dynamic Brightness */}
                <mesh
                    ref={(el) => { if (el) brakeLightRefs.current[0] = el; }}
                    position={[-0.3 * carConfig.scale, 0.15, -0.9]}
                >
                    <sphereGeometry args={[0.06 * carConfig.scale, isMobile ? 8 : 12, isMobile ? 8 : 12]} />
                    <meshStandardMaterial
                        color="#ff0000"
                        emissive="#ff0000"
                        emissiveIntensity={0.8}
                    />
                </mesh>
                <mesh
                    ref={(el) => { if (el) brakeLightRefs.current[1] = el; }}
                    position={[0.3 * carConfig.scale, 0.15, -0.9]}
                >
                    <sphereGeometry args={[0.06 * carConfig.scale, isMobile ? 8 : 12, isMobile ? 8 : 12]} />
                    <meshStandardMaterial
                        color="#ff0000"
                        emissive="#ff0000"
                        emissiveIntensity={0.8}
                    />
                </mesh>

                {/* Exhaust Pipes */}
                <mesh position={[-0.25 * carConfig.scale, 0, -0.95]}>
                    <cylinderGeometry args={[0.04 * carConfig.scale, 0.04 * carConfig.scale, 0.1 * carConfig.scale, 8]} />
                    <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.3} />
                </mesh>
                <mesh position={[0.25 * carConfig.scale, 0, -0.95]}>
                    <cylinderGeometry args={[0.04 * carConfig.scale, 0.04 * carConfig.scale, 0.1 * carConfig.scale, 8]} />
                    <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.3} />
                </mesh>

                {/* Exhaust Particle Effects */}
                <ExhaustParticles
                    position={[-0.25 * carConfig.scale, 0, -1] as [number, number, number]}
                    speed={speed}
                />
                <ExhaustParticles
                    position={[0.25 * carConfig.scale, 0, -1] as [number, number, number]}
                    speed={speed}
                />

                {/* Enhanced Lighting System */}
                <pointLight
                    position={[0, 0, -1]}
                    distance={isMobile ? 4 : 5}
                    intensity={carConfig.lightIntensity}
                    color="#ef4444"
                />

                {/* Headlight beams with volumetric effect */}
                {!isMobile && (
                    <>
                        <spotLight
                            position={[-0.3 * carConfig.scale, 0.2, 0.9]}
                            angle={0.4}
                            penumbra={0.5}
                            intensity={2}
                            distance={10}
                            color="#ffff88"
                            target-position={[0, 0, 10]}
                        />
                        <spotLight
                            position={[0.3 * carConfig.scale, 0.2, 0.9]}
                            angle={0.4}
                            penumbra={0.5}
                            intensity={2}
                            distance={10}
                            color="#ffff88"
                            target-position={[0, 0, 10]}
                        />
                    </>
                )}

                {/* Underglow effect (desktop only) - Enhanced */}
                {config.isDesktop && (
                    <>
                        <pointLight position={[0, -0.2, 0]} distance={3} intensity={0.8} color="#6366f1" />
                        <pointLight position={[-0.3, -0.2, 0.5]} distance={2} intensity={0.4} color="#8b5cf6" />
                        <pointLight position={[0.3, -0.2, 0.5]} distance={2} intensity={0.4} color="#8b5cf6" />
                    </>
                )}

                {/* Side Mirror Details */}
                <mesh position={[-0.45 * carConfig.scale, 0.4, 0.2]}>
                    <boxGeometry args={[0.08 * carConfig.scale, 0.12 * carConfig.scale, 0.05 * carConfig.scale]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
                </mesh>
                <mesh position={[0.45 * carConfig.scale, 0.4, 0.2]}>
                    <boxGeometry args={[0.08 * carConfig.scale, 0.12 * carConfig.scale, 0.05 * carConfig.scale]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
                </mesh>

                {/* Front Grille */}
                <mesh position={[0, 0.15, 0.91]}>
                    <boxGeometry args={[0.5 * carConfig.scale, 0.15 * carConfig.scale, 0.02 * carConfig.scale]} />
                    <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.4} />
                </mesh>

                {/* Racing Stripes (optional detail) */}
                {!isMobile && (
                    <>
                        <mesh position={[0, 0.46, 0]}>
                            <boxGeometry args={[0.1 * carConfig.scale, 0.01 * carConfig.scale, 1.8 * carConfig.scale]} />
                            <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
                        </mesh>
                    </>
                )}
            </group>
        </>
    );
}
export default memo(Car3D);