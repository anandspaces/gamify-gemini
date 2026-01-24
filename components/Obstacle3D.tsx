// components/Obstacle3D.tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useResponsiveGame } from '@/lib/responsive.config';
import { ObstacleCarProps, ObstacleRockProps, Obstacle3DProps } from '@/types/types';

export default function Obstacle3D({ obstacle }: Obstacle3DProps) {
    const groupRef = useRef<THREE.Group>(null);
    const config = useResponsiveGame();

    // Map store position (0-100) to 3D Z position (-100 to 0)
    const zPos = -100 + obstacle.position;

    // Lane positioning from centralized config
    const xPos = config.lanePositions[obstacle.lane];

    // Rotation animation - only for rocks
    useFrame((state, delta) => {
        if (groupRef.current && obstacle.type === 'hazard') {
            // Rotate rocks for dynamic feel
            groupRef.current.rotation.y += delta * 2;
        }

        if (groupRef.current) {
            // Add slight bobbing for all obstacles - more grounded
            groupRef.current.position.y = 0.02 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
        }
    });

    // Render different obstacle types with realistic models
    const renderObstacle = () => {
        switch (obstacle.type) {
            case 'barrier':
            case 'cone':
                // Use abandoned car model for barrier and cone types
                return <ObstacleCar3D isMobile={config.isMobile} />;

            case 'hazard':
                // Use rock model for hazard type
                return <ObstacleRock3D isMobile={config.isMobile} />;

            default:
                return <ObstacleCar3D isMobile={config.isMobile} />;
        }
    };

    return (
        <group ref={groupRef} position={[xPos, 0.5, zPos]}>
            {renderObstacle()}
        </group>
    );
}


export function ObstacleCar3D({ isMobile }: ObstacleCarProps) {
    const scale = 0.6; // Smaller than player car

    return (
        <group scale={scale}>
            {/* Car Body - Abandoned/Broken look */}
            <mesh position={[0, 0.15, 0]} castShadow={!isMobile}>
                <boxGeometry args={[0.8, 0.4, 1.6]} />
                <meshStandardMaterial
                    color="#3a3a3a"
                    metalness={0.4}
                    roughness={0.8}
                />
            </mesh>

            {/* Cabin */}
            <mesh position={[0, 0.5, -0.1]} castShadow={!isMobile}>
                <boxGeometry args={[0.65, 0.35, 0.9]} />
                <meshStandardMaterial
                    color="#2a2a2a"
                    metalness={0.3}
                    roughness={0.9}
                    transparent
                    opacity={0.7}
                />
            </mesh>

            {/* Wheels - Flat/Damaged */}
            {[
                [-0.35, 0, 0.5],
                [0.35, 0, 0.5],
                [-0.35, 0, -0.5],
                [0.35, 0, -0.5]
            ].map((pos, i) => (
                <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.18, 0.18, 0.15, isMobile ? 8 : 12]} />
                    <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.9} />
                </mesh>
            ))}

            {/* Rust/Damage spots */}
            <mesh position={[0.3, 0.2, 0.6]}>
                <sphereGeometry args={[0.08, isMobile ? 6 : 8, isMobile ? 6 : 8]} />
                <meshStandardMaterial color="#8b4513" roughness={1} />
            </mesh>
            <mesh position={[-0.25, 0.15, -0.4]}>
                <sphereGeometry args={[0.06, isMobile ? 6 : 8, isMobile ? 6 : 8]} />
                <meshStandardMaterial color="#654321" roughness={1} />
            </mesh>

            {/* Warning stripes on hood */}
            <mesh position={[0, 0.36, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.6, 0.3]} />
                <meshBasicMaterial color="#ffcc00" opacity={0.6} transparent />
            </mesh>
        </group>
    );
}


export function ObstacleRock3D({ isMobile }: ObstacleRockProps) {
    return (
        <group>
            {/* Main rock body - irregular shape */}
            <mesh castShadow={!isMobile} position={[0, 0, 0]}>
                <dodecahedronGeometry args={[0.5, 0]} />
                <meshStandardMaterial
                    color="#5a5a5a"
                    metalness={0.1}
                    roughness={0.95}
                />
            </mesh>

            {/* Additional rock chunks for irregular shape */}
            <mesh castShadow={!isMobile} position={[0.2, 0.15, 0.1]} rotation={[0.5, 0.3, 0.2]}>
                <dodecahedronGeometry args={[0.3, 0]} />
                <meshStandardMaterial
                    color="#4a4a4a"
                    metalness={0.05}
                    roughness={1}
                />
            </mesh>

            <mesh castShadow={!isMobile} position={[-0.15, 0.1, -0.1]} rotation={[0.2, 0.8, 0.4]}>
                <dodecahedronGeometry args={[0.25, 0]} />
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
        </group>
    );
}
