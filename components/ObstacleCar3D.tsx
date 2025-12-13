// components/ObstacleCar3D.tsx
import React from 'react';
import * as THREE from 'three';

interface ObstacleCarProps {
    isMobile: boolean;
}

export default function ObstacleCar3D({ isMobile }: ObstacleCarProps) {
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
