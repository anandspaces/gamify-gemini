// components/Obstacle3D.tsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Obstacle } from '@/types/game';
import * as THREE from 'three';
import { useResponsiveGame } from '@/lib/responsive.config';
import ObstacleCar3D from './ObstacleCar3D';
import ObstacleRock3D from './ObstacleRock3D';

interface Obstacle3DProps {
    obstacle: Obstacle;
}

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
