// components/Car3D.tsx
import { useRef, useState, useEffect, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/store/useGameStore';
import * as THREE from 'three';

function Car3D() {
    const meshRef = useRef<THREE.Group>(null);
    const { selectedLane } = useGameStore();
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            const width = window.innerWidth;
            setIsMobile(width < 640);
            setIsTablet(width >= 640 && width < 1024);
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);
        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    // Responsive lane positioning
    const getLanePositions = () => {
        if (isMobile) {
            // Wider spacing on mobile for easier visibility
            return [-2.5, -0.83, 0.83, 2.5];
        }
        if (isTablet) {
            return [-2.2, -0.73, 0.73, 2.2];
        }
        // Desktop spacing
        return [-2, -0.67, 0.67, 2];
    };

    // Responsive car scale
    const getCarScale = () => {
        if (isMobile) return 0.8; // Slightly smaller on mobile
        if (isTablet) return 0.9;
        return 1.0; // Full size on desktop
    };

    // Responsive animation speeds
    const getAnimationSpeed = () => {
        if (isMobile) {
            return {
                laneSwitch: 8, // Slightly slower for smoother mobile performance
                bobbing: 8,
                bobbingAmplitude: 0.04
            };
        }
        return {
            laneSwitch: 10,
            bobbing: 10,
            bobbingAmplitude: 0.05
        };
    };

    const lanePositions = getLanePositions();
    const carScale = getCarScale();
    const animSpeed = getAnimationSpeed();

    useFrame((state, delta) => {
        if (meshRef.current) {
            const targetX = lanePositions[selectedLane ?? 1];

            // Smooth lerp with responsive speed
            meshRef.current.position.x = THREE.MathUtils.lerp(
                meshRef.current.position.x,
                targetX,
                delta * animSpeed.laneSwitch
            );

            // Add slight tilt when moving (reduced on mobile)
            const tiltMultiplier = isMobile ? 0.3 : 0.5;
            const tilt = (meshRef.current.position.x - targetX) * tiltMultiplier;
            meshRef.current.rotation.z = tilt;

            // Bobbing effect with responsive amplitude
            meshRef.current.position.y =
                Math.sin(state.clock.elapsedTime * animSpeed.bobbing) * animSpeed.bobbingAmplitude;
        }
    });

    // Responsive geometry sizes
    const getCarDimensions = () => {
        const scale = carScale;
        return {
            body: [0.8 * scale, 0.5 * scale, 1.8 * scale] as [number, number, number],
            cabin: [0.7 * scale, 0.4 * scale, 1.0 * scale] as [number, number, number],
            wheelRadius: 0.2 * scale,
            wheelWidth: 0.2 * scale,
            wheelOffset: 0.45 * scale
        };
    };

    const dims = getCarDimensions();

    // Responsive lighting intensity
    const getLightIntensity = () => {
        if (isMobile) return 1.5; // Reduced for performance
        return 2.0;
    };

    return (
        <group ref={meshRef} position={[0, 0.5, 0]} scale={carScale}>
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
                <boxGeometry args={[0.6 * carScale, 0.1 * carScale, 0.3 * carScale]} />
                <meshStandardMaterial
                    color="#dc2626"
                    metalness={0.9}
                    roughness={0.1}
                />
            </mesh>

            {/* Spoiler */}
            <mesh position={[0, 0.7, -0.9]}>
                <boxGeometry args={[0.8 * carScale, 0.05 * carScale, 0.2 * carScale]} />
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
            <mesh position={[-0.3 * carScale, 0.2, 0.9]}>
                <sphereGeometry args={[0.08 * carScale, isMobile ? 8 : 16, isMobile ? 8 : 16]} />
                <meshStandardMaterial
                    color="#ffff00"
                    emissive="#ffff00"
                    emissiveIntensity={1}
                    metalness={0.5}
                    roughness={0.2}
                />
            </mesh>
            <mesh position={[0.3 * carScale, 0.2, 0.9]}>
                <sphereGeometry args={[0.08 * carScale, isMobile ? 8 : 16, isMobile ? 8 : 16]} />
                <meshStandardMaterial
                    color="#ffff00"
                    emissive="#ffff00"
                    emissiveIntensity={1}
                    metalness={0.5}
                    roughness={0.2}
                />
            </mesh>

            {/* Tail Lights */}
            <mesh position={[-0.3 * carScale, 0.15, -0.9]}>
                <sphereGeometry args={[0.06 * carScale, isMobile ? 8 : 12, isMobile ? 8 : 12]} />
                <meshStandardMaterial
                    color="#ff0000"
                    emissive="#ff0000"
                    emissiveIntensity={0.8}
                />
            </mesh>
            <mesh position={[0.3 * carScale, 0.15, -0.9]}>
                <sphereGeometry args={[0.06 * carScale, isMobile ? 8 : 12, isMobile ? 8 : 12]} />
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
                intensity={getLightIntensity()}
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
            {!isMobile && !isTablet && (
                <pointLight position={[0, -0.2, 0]} distance={3} intensity={0.5} color="#6366f1" />
            )}
        </group>
    );
}
export default memo(Car3D);