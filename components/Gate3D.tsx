// components/Gate3D.tsx
import React, { useRef, useState, useEffect, memo } from 'react';
import { Text } from '@react-three/drei';
import { Gate } from '@/types/game';
import * as THREE from 'three';

interface Gate3DProps {
    gate: Gate;
}

interface GateVisualsProps {
    options: string[];
    isMobile: boolean;
    isTablet: boolean;
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

    // Map store position (0-100) to 3D Z position (-100 to 0)
    const zPos = -100 + gate.position;

    // Responsive gate dimensions
    const getGateDimensions = () => {
        if (isMobile) {
            return {
                width: 1.4, // Wider for better visibility
                height: 2.8,
                depth: 0.12,
                borderWidth: 1.45,
                borderHeight: 2.85,
                badgeRadius: 0.28,
                fontSize: 0.25, // Slightly smaller text for mobile
                labelFontSize: 0.32,
                maxTextWidth: 1.2,
                textOutline: 0.015
            };
        }
        if (isTablet) {
            return {
                width: 1.3,
                height: 2.6,
                depth: 0.11,
                borderWidth: 1.35,
                borderHeight: 2.65,
                badgeRadius: 0.27,
                fontSize: 0.28,
                labelFontSize: 0.34,
                maxTextWidth: 1.15,
                textOutline: 0.012
            };
        }
        // Desktop
        return {
            width: 1.2,
            height: 2.5,
            depth: 0.1,
            borderWidth: 1.25,
            borderHeight: 2.55,
            badgeRadius: 0.25,
            fontSize: 0.3,
            labelFontSize: 0.35,
            maxTextWidth: 1.1,
            textOutline: 0.01
        };
    };

    // Responsive lane positioning
    const getLanePositions = () => {
        if (isMobile) {
            // Wider spacing on mobile for clearer separation
            return [-2.5, -0.83, 0.83, 2.5];
        }
        if (isTablet) {
            return [-2.2, -0.73, 0.73, 2.2];
        }
        // Desktop spacing
        return [-2, -0.67, 0.67, 2];
    };

    // Responsive material properties
    const getMaterialProps = () => {
        if (isMobile) {
            return {
                metalness: 0.3, // Reduced for performance
                roughness: 0.5,
                opacity: 0.9,
                emissiveIntensity: 0.4
            };
        }
        return {
            metalness: 0.4,
            roughness: 0.4,
            opacity: 0.85,
            emissiveIntensity: 0.5
        };
    };

    const dims = getGateDimensions();
    const lanePositions = getLanePositions();
    const materials = getMaterialProps();

    return (
        <group ref={groupRef} position={[0, 0, zPos]}>
            <GateVisuals
                options={gate.options}
                isMobile={isMobile}
                isTablet={isTablet}
                dims={dims}
                lanePositions={lanePositions}
                materials={materials}
            />
        </group>
    );
}