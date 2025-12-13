// components/Car3D.tsx
import { useRef, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/store/useGameStore';
import * as THREE from 'three';
import { useResponsiveGame } from '@/lib/responsive.config';

function Car3D() {
    const meshRef = useRef<THREE.Group>(null);
    const { selectedLane } = useGameStore();
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

            // Bobbing effect
            meshRef.current.position.y =
                Math.sin(state.clock.elapsedTime * carConfig.animationSpeed.bobbing) * carConfig.animationSpeed.bobbingAmplitude;
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
        <group ref={meshRef} position={[0, 0.5, 0]} scale={carConfig.scale}>
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
            <mesh position={[-dims.wheelOffset, 0, 0.5]} rotation={[0, 0, Math.PI / 2]} castShadow={!isMobile}>
                <cylinderGeometry args={[dims.wheelRadius, dims.wheelRadius, dims.wheelWidth, isMobile ? 12 : 16]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[dims.wheelOffset, 0, 0.5]} rotation={[0, 0, Math.PI / 2]} castShadow={!isMobile}>
                <cylinderGeometry args={[dims.wheelRadius, dims.wheelRadius, dims.wheelWidth, isMobile ? 12 : 16]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
            </mesh>

            {/* Rear Wheels */}
            <mesh position={[-dims.wheelOffset, 0, -0.5]} rotation={[0, 0, Math.PI / 2]} castShadow={!isMobile}>
                <cylinderGeometry args={[dims.wheelRadius, dims.wheelRadius, dims.wheelWidth, isMobile ? 12 : 16]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[dims.wheelOffset, 0, -0.5]} rotation={[0, 0, Math.PI / 2]} castShadow={!isMobile}>
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
    );
}
export default memo(Car3D);