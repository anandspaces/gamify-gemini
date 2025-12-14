// components/Gate3D.tsx
import React, { useRef, useState, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Gate } from '@/types/game';
import * as THREE from 'three';
import { useResponsiveGame } from '@/lib/responsive.config';

interface Gate3DProps {
    gate: Gate;
}

interface GateVisualsProps {
    options: string[];
    isMobile: boolean;
    dims: any;
    lanePositions: number[];
    materials: any;
}

// Memoized component for the expensive visual elements (Text, Geometries)
const GateVisuals = memo(({ options, isMobile, dims, lanePositions, materials }: GateVisualsProps) => {
    return (
        <>
            {/* Options */}
            {options.map((opt, idx) => {
                const xPos = lanePositions[idx];

                return (
                    <group key={idx} position={[xPos, 1, 0]}>
                        {/* Main Gate Frame */}
                        <mesh castShadow={!isMobile} receiveShadow={!isMobile}>
                            <boxGeometry args={[dims.width, dims.height, dims.depth]} />
                            <meshStandardMaterial
                                color="#0f172a"
                                metalness={materials.metalness}
                                roughness={materials.roughness}
                                transparent
                                opacity={materials.opacity}
                            />
                        </mesh>

                        {/* Glowing Border */}
                        <mesh position={[0, 0, 0.06]}>
                            <boxGeometry args={[dims.borderWidth, dims.borderHeight, 0.02]} />
                            <meshStandardMaterial
                                color="#4f46e5"
                                emissive="#4f46e5"
                                emissiveIntensity={materials.emissiveIntensity}
                            />
                        </mesh>

                        {/* Side Pillars */}
                        <mesh position={[-dims.width / 2, 0, 0.03]}>
                            <boxGeometry args={[0.08, dims.height, 0.08]} />
                            <meshStandardMaterial
                                color="#6366f1"
                                emissive="#6366f1"
                                emissiveIntensity={0.3}
                                metalness={0.8}
                                roughness={0.2}
                            />
                        </mesh>
                        <mesh position={[dims.width / 2, 0, 0.03]}>
                            <boxGeometry args={[0.08, dims.height, 0.08]} />
                            <meshStandardMaterial
                                color="#6366f1"
                                emissive="#6366f1"
                                emissiveIntensity={0.3}
                                metalness={0.8}
                                roughness={0.2}
                            />
                        </mesh>

                        {/* Top Arch */}
                        <mesh position={[0, dims.height / 2, 0.03]}>
                            <boxGeometry args={[dims.width, 0.08, 0.08]} />
                            <meshStandardMaterial
                                color="#6366f1"
                                emissive="#6366f1"
                                emissiveIntensity={0.3}
                                metalness={0.8}
                                roughness={0.2}
                            />
                        </mesh>

                        {/* Lane Label Badge at Top */}
                        <mesh position={[0, dims.height / 2 + 0.25, 0.07]}>
                            <circleGeometry args={[dims.badgeRadius, isMobile ? 24 : 32]} />
                            <meshStandardMaterial
                                color="#1e1b4b"
                                emissive="#6366f1"
                                emissiveIntensity={materials.emissiveIntensity}
                            />
                        </mesh>

                        {/* Badge Border Ring */}
                        <mesh position={[0, dims.height / 2 + 0.25, 0.08]}>
                            <ringGeometry args={[dims.badgeRadius, dims.badgeRadius + 0.03, isMobile ? 24 : 32]} />
                            <meshStandardMaterial
                                color="#818cf8"
                                emissive="#818cf8"
                                emissiveIntensity={0.6}
                            />
                        </mesh>

                        {/* Lane Letter */}
                        <Text
                            position={[0, dims.height / 2 + 0.25, 0.12]}
                            fontSize={dims.labelFontSize}
                            color="#ffffff"
                            anchorX="center"
                            anchorY="middle"
                            outlineWidth={dims.textOutline}
                            outlineColor="#000000"
                        >
                            {['A', 'B', 'C', 'D'][idx]}
                        </Text>

                        {/* Option Text - Centered and Clean */}
                        <Text
                            position={[0, 0, 0.12]}
                            fontSize={dims.fontSize}
                            color="#ffffff"
                            anchorX="center"
                            anchorY="middle"
                            maxWidth={dims.maxTextWidth}
                            textAlign="center"
                            outlineWidth={dims.textOutline}
                            outlineColor="#000000"
                            lineHeight={isMobile ? 1.1 : 1.2}
                        >
                            {opt}
                        </Text>

                        {/* Corner Accents */}
                        <mesh position={[-dims.width / 2 + 0.1, dims.height / 2 - 0.1, 0.08]}>
                            <boxGeometry args={[0.15, 0.02, 0.02]} />
                            <meshStandardMaterial
                                color="#22d3ee"
                                emissive="#22d3ee"
                                emissiveIntensity={0.8}
                            />
                        </mesh>
                        <mesh position={[-dims.width / 2 + 0.1, dims.height / 2 - 0.1, 0.08]} rotation={[0, 0, Math.PI / 2]}>
                            <boxGeometry args={[0.15, 0.02, 0.02]} />
                            <meshStandardMaterial
                                color="#22d3ee"
                                emissive="#22d3ee"
                                emissiveIntensity={0.8}
                            />
                        </mesh>

                        <mesh position={[dims.width / 2 - 0.1, dims.height / 2 - 0.1, 0.08]}>
                            <boxGeometry args={[0.15, 0.02, 0.02]} />
                            <meshStandardMaterial
                                color="#22d3ee"
                                emissive="#22d3ee"
                                emissiveIntensity={0.8}
                            />
                        </mesh>
                        <mesh position={[dims.width / 2 - 0.1, dims.height / 2 - 0.1, 0.08]} rotation={[0, 0, Math.PI / 2]}>
                            <boxGeometry args={[0.15, 0.02, 0.02]} />
                            <meshStandardMaterial
                                color="#22d3ee"
                                emissive="#22d3ee"
                                emissiveIntensity={0.8}
                            />
                        </mesh>

                        {/* Point Light for Glow (reduced on mobile) */}
                        {!isMobile && (
                            <pointLight
                                position={[0, 0, 0.5]}
                                intensity={0.5}
                                distance={3}
                                color="#6366f1"
                            />
                        )}

                        {/* Bottom Glow Bar */}
                        <mesh position={[0, -dims.height / 2 + 0.1, 0.08]}>
                            <boxGeometry args={[dims.width * 0.8, 0.05, 0.02]} />
                            <meshStandardMaterial
                                color="#818cf8"
                                emissive="#818cf8"
                                emissiveIntensity={0.7}
                                transparent
                                opacity={0.6}
                            />
                        </mesh>
                    </group>
                );
            })}
        </>
    );
});

export default function Gate3D({ gate }: Gate3DProps) {
    const groupRef = useRef<THREE.Group>(null);
    const config = useResponsiveGame();
    const [scale, setScale] = useState(0); // For scale-in animation
    const [opacity, setOpacity] = useState(0); // For fade-in animation

    // Animate gate appearance and floating
    useFrame((state, delta) => {
        if (groupRef.current) {
            // Scale-in animation
            if (scale < 1) {
                setScale(Math.min(1, scale + delta * 3));
            }

            // Fade-in animation
            if (opacity < 1) {
                setOpacity(Math.min(1, opacity + delta * 2));
            }

            // Floating/bobbing animation - more subtle
            const baseY = 0;
            const floatAmplitude = 0.08;
            const floatSpeed = 1.2;
            groupRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * floatSpeed + gate.id * 0.5) * floatAmplitude;

            // Very subtle rotation for dynamic feel
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
        }
    });

    // Map store position (0-100) to 3D Z position (-100 to 0)
    const zPos = -100 + gate.position;

    // Apply fade-in to materials
    const materials = {
        ...config.gateMaterials,
        opacity: config.gateMaterials.opacity * opacity,
        emissiveIntensity: config.gateMaterials.emissiveIntensity * opacity,
    };

    return (
        <group ref={groupRef} position={[0, 0, zPos]} scale={scale}>
            <GateVisuals
                options={gate.options}
                isMobile={config.isMobile}
                dims={config.gate}
                lanePositions={config.lanePositions}
                materials={materials}
            />
        </group>
    );
}