// components/Gate3D.tsx
import { useRef } from 'react';
import { Text } from '@react-three/drei';
import { Gate } from '@/types/game';
import * as THREE from 'three';

interface Gate3DProps {
    gate: Gate;
}

export default function Gate3D({ gate }: Gate3DProps) {
    const groupRef = useRef<THREE.Group>(null);

    // Map store position (0-100) to 3D Z position (-100 to 0)
    const zPos = -100 + gate.position;

    return (
        <group ref={groupRef} position={[0, 0, zPos]}>
            {/* Options */}
            {gate.options.map((opt, idx) => {
                // Position for 4 lanes: -2, -0.67, 0.67, 2
                const lanePositions = [-2, -0.67, 0.67, 2];
                const xPos = lanePositions[idx];

                return (
                    <group key={idx} position={[xPos, 1, 0]}>
                        {/* Clean Gate Frame */}
                        <mesh>
                            <boxGeometry args={[1.2, 2.5, 0.1]} />
                            <meshStandardMaterial
                                color="#0f172a"
                                metalness={0.4}
                                roughness={0.4}
                                transparent
                                opacity={0.85}
                            />
                        </mesh>

                        {/* Subtle Border */}
                        <mesh position={[0, 0, 0.06]}>
                            <boxGeometry args={[1.25, 2.55, 0.02]} />
                            <meshStandardMaterial
                                color="#4f46e5"
                                emissive="#4f46e5"
                                emissiveIntensity={0.5}
                            />
                        </mesh>

                        {/* Lane Label Badge at Top */}
                        <mesh position={[0, 1.5, 0.07]}>
                            <circleGeometry args={[0.25, 32]} />
                            <meshStandardMaterial
                                color="#1e1b4b"
                                emissive="#6366f1"
                                emissiveIntensity={0.4}
                            />
                        </mesh>
                        <Text
                            position={[0, 1.5, 0.12]}
                            fontSize={0.35}
                            color="#ffffff"
                            anchorX="center"
                            anchorY="middle"
                            fontWeight="bold"
                        >
                            {['A', 'B', 'C', 'D'][idx]}
                        </Text>

                        {/* Option Text - Centered and Clean */}
                        <Text
                            position={[0, 0, 0.12]}
                            fontSize={0.3}
                            color="#ffffff"
                            anchorX="center"
                            anchorY="middle"
                            maxWidth={1.1}
                            textAlign="center"
                            outlineWidth={0.01}
                            outlineColor="#000000"
                            lineHeight={1.2}
                        >
                            {opt}
                        </Text>
                    </group>
                );
            })}
        </group>
    );
}
