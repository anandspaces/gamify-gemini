// components/Car3D.tsx
import { useRef, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/store/useGameStore';
import * as THREE from 'three';
import { useResponsiveGame } from '@/lib/responsive.config';
import { CarProps } from '@/types/types';
import { motion } from 'framer-motion';
import { CarFront } from 'lucide-react';


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

export function Car3D() {
    const meshRef = useRef<THREE.Group>(null);
    const wheelRefs = useRef<THREE.Mesh[]>([]);
    const shadowRef = useRef<THREE.Mesh>(null);
    const { selectedLane, speed } = useGameStore();
    const config = useResponsiveGame();

    const { lanePositions, car: carConfig, isMobile } = config;

    useFrame((state, delta) => {
        if (meshRef.current) {
            const targetX = lanePositions[selectedLane ?? 1];

            // Smooth lerp with responsive speed
            meshRef.current.position.x = THREE.MathUtils.lerp(
                meshRef.current.position.x,
                targetX,
                delta * carConfig.animationSpeed.laneSwitch
            );

            // Add slight tilt when moving (reduced on mobile)
            const tiltMultiplier = isMobile ? 0.3 : 0.5;
            const tilt = (meshRef.current.position.x - targetX) * tiltMultiplier;
            meshRef.current.rotation.z = tilt;

            // Subtle bobbing effect - more realistic suspension
            const bobbingY = Math.sin(state.clock.elapsedTime * carConfig.animationSpeed.bobbing) * carConfig.animationSpeed.bobbingAmplitude;
            meshRef.current.position.y = 0.05 + bobbingY;

            // Rotate wheels based on speed
            wheelRefs.current.forEach((wheel) => {
                if (wheel) {
                    wheel.rotation.x -= speed * delta * 20;
                }
            });

            // Update shadow
            if (shadowRef.current) {
                shadowRef.current.position.x = meshRef.current.position.x;
                // Shadow size and opacity based on car height
                const shadowScale = 1 - (meshRef.current.position.y - 0.05) * 0.5;
                shadowRef.current.scale.set(shadowScale, shadowScale, shadowScale);
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
                {/* Car Body - Enhanced with gradient-like effect */}
                <mesh position={[0, 0.2, 0]} castShadow={!isMobile}>
                    <boxGeometry args={dims.body} />
                    <meshStandardMaterial
                        color="#ef4444"
                        metalness={isMobile ? 0.7 : 0.8}
                        roughness={isMobile ? 0.3 : 0.2}
                        emissive="#ef4444"
                        emissiveIntensity={0.1}
                    />
                </mesh>

                {/* Cabin/Windshield */}
                <mesh position={[0, 0.6, -0.2]} castShadow={!isMobile}>
                    <boxGeometry args={dims.cabin} />
                    <meshStandardMaterial
                        color="#1e293b"
                        metalness={isMobile ? 0.8 : 0.9}
                        roughness={0.1}
                        transparent
                        opacity={0.9}
                    />
                </mesh>

                {/* Front Hood Detail */}
                <mesh position={[0, 0.3, 0.8]}>
                    <boxGeometry args={[0.6 * carConfig.scale, 0.1 * carConfig.scale, 0.3 * carConfig.scale]} />
                    <meshStandardMaterial
                        color="#dc2626"
                        metalness={0.9}
                        roughness={0.1}
                    />
                </mesh>

                {/* Spoiler */}
                <mesh position={[0, 0.7, -0.9]}>
                    <boxGeometry args={[0.8 * carConfig.scale, 0.05 * carConfig.scale, 0.2 * carConfig.scale]} />
                    <meshStandardMaterial
                        color="#1e293b"
                        metalness={0.8}
                        roughness={0.2}
                    />
                </mesh>

                {/* Front Wheels */}
                <mesh
                    ref={(el) => { if (el) wheelRefs.current[0] = el; }}
                    position={[-dims.wheelOffset, 0, 0.5]}
                    rotation={[0, 0, Math.PI / 2]}
                    castShadow={!isMobile}
                >
                    <cylinderGeometry args={[dims.wheelRadius, dims.wheelRadius, dims.wheelWidth, isMobile ? 12 : 16]} />
                    <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
                </mesh>
                <mesh
                    ref={(el) => { if (el) wheelRefs.current[1] = el; }}
                    position={[dims.wheelOffset, 0, 0.5]}
                    rotation={[0, 0, Math.PI / 2]}
                    castShadow={!isMobile}
                >
                    <cylinderGeometry args={[dims.wheelRadius, dims.wheelRadius, dims.wheelWidth, isMobile ? 12 : 16]} />
                    <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
                </mesh>

                {/* Rear Wheels */}
                <mesh
                    ref={(el) => { if (el) wheelRefs.current[2] = el; }}
                    position={[-dims.wheelOffset, 0, -0.5]}
                    rotation={[0, 0, Math.PI / 2]}
                    castShadow={!isMobile}
                >
                    <cylinderGeometry args={[dims.wheelRadius, dims.wheelRadius, dims.wheelWidth, isMobile ? 12 : 16]} />
                    <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
                </mesh>
                <mesh
                    ref={(el) => { if (el) wheelRefs.current[3] = el; }}
                    position={[dims.wheelOffset, 0, -0.5]}
                    rotation={[0, 0, Math.PI / 2]}
                    castShadow={!isMobile}
                >
                    <cylinderGeometry args={[dims.wheelRadius, dims.wheelRadius, dims.wheelWidth, isMobile ? 12 : 16]} />
                    <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
                </mesh>

                {/* Wheel Rims */}
                <mesh position={[-dims.wheelOffset, 0, 0.5]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[dims.wheelRadius * 0.6, dims.wheelRadius * 0.6, dims.wheelWidth * 0.3, isMobile ? 8 : 12]} />
                    <meshStandardMaterial color="#silver" metalness={1} roughness={0.1} />
                </mesh>
                <mesh position={[dims.wheelOffset, 0, 0.5]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[dims.wheelRadius * 0.6, dims.wheelRadius * 0.6, dims.wheelWidth * 0.3, isMobile ? 8 : 12]} />
                    <meshStandardMaterial color="#silver" metalness={1} roughness={0.1} />
                </mesh>
                <mesh position={[-dims.wheelOffset, 0, -0.5]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[dims.wheelRadius * 0.6, dims.wheelRadius * 0.6, dims.wheelWidth * 0.3, isMobile ? 8 : 12]} />
                    <meshStandardMaterial color="#silver" metalness={1} roughness={0.1} />
                </mesh>
                <mesh position={[dims.wheelOffset, 0, -0.5]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[dims.wheelRadius * 0.6, dims.wheelRadius * 0.6, dims.wheelWidth * 0.3, isMobile ? 8 : 12]} />
                    <meshStandardMaterial color="#silver" metalness={1} roughness={0.1} />
                </mesh>

                {/* Headlights */}
                <mesh position={[-0.3 * carConfig.scale, 0.2, 0.9]}>
                    <sphereGeometry args={[0.08 * carConfig.scale, isMobile ? 8 : 16, isMobile ? 8 : 16]} />
                    <meshStandardMaterial
                        color="#ffff00"
                        emissive="#ffff00"
                        emissiveIntensity={1}
                        metalness={0.5}
                        roughness={0.2}
                    />
                </mesh>
                <mesh position={[0.3 * carConfig.scale, 0.2, 0.9]}>
                    <sphereGeometry args={[0.08 * carConfig.scale, isMobile ? 8 : 16, isMobile ? 8 : 16]} />
                    <meshStandardMaterial
                        color="#ffff00"
                        emissive="#ffff00"
                        emissiveIntensity={1}
                        metalness={0.5}
                        roughness={0.2}
                    />
                </mesh>

                {/* Tail Lights */}
                <mesh position={[-0.3 * carConfig.scale, 0.15, -0.9]}>
                    <sphereGeometry args={[0.06 * carConfig.scale, isMobile ? 8 : 12, isMobile ? 8 : 12]} />
                    <meshStandardMaterial
                        color="#ff0000"
                        emissive="#ff0000"
                        emissiveIntensity={0.8}
                    />
                </mesh>
                <mesh position={[0.3 * carConfig.scale, 0.15, -0.9]}>
                    <sphereGeometry args={[0.06 * carConfig.scale, isMobile ? 8 : 12, isMobile ? 8 : 12]} />
                    <meshStandardMaterial
                        color="#ff0000"
                        emissive="#ff0000"
                        emissiveIntensity={0.8}
                    />
                </mesh>

                {/* Responsive Glow Effects */}
                <pointLight
                    position={[0, 0, -1]}
                    distance={isMobile ? 4 : 5}
                    intensity={carConfig.lightIntensity}
                    color="#ef4444"
                />

                {/* Headlight beams (reduced on mobile) */}
                {!isMobile && (
                    <>
                        <pointLight position={[-0.3, 0.2, 1]} distance={8} intensity={1.5} color="#ffff88" />
                        <pointLight position={[0.3, 0.2, 1]} distance={8} intensity={1.5} color="#ffff88" />
                    </>
                )}

                {/* Underglow effect (desktop only) */}
                {config.isDesktop && (
                    <pointLight position={[0, -0.2, 0]} distance={3} intensity={0.5} color="#6366f1" />
                )}
            </group>
        </>
    );
}
export default memo(Car3D);