// components/ObstacleRock3D.tsx
import React from 'react';
import * as THREE from 'three';

interface ObstacleRockProps {
    isMobile: boolean;
}

export default function ObstacleRock3D({ isMobile }: ObstacleRockProps) {
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
