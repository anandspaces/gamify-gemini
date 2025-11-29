// components/Track3D.tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/useGameStore';

export default function Track3D() {
    const gridRef = useRef<THREE.Group>(null);
    const { speed, isPaused, status } = useGameStore();

    useFrame((state, delta) => {
        if (gridRef.current && status === 'playing' && !isPaused) {
            gridRef.current.position.z = (gridRef.current.position.z + speed * 10 * delta) % 10;
        }
    });

    return (
        <group>
            {/* Main Road Surface - Dark asphalt */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, -50]}>
                <planeGeometry args={[8, 200]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.1} />
            </mesh>

            {/* Lane Dividers - White dashed lines */}
            {[-1.33, 0, 1.33].map((x, i) => (
                <group key={i}>
                    {/* Dashed line effect */}
                    {Array.from({ length: 40 }).map((_, j) => (
                        <mesh
                            key={j}
                            rotation={[-Math.PI / 2, 0, 0]}
                            position={[x, -0.48, -100 + j * 5]}
                        >
                            <planeGeometry args={[0.15, 2]} />
                            <meshBasicMaterial color="#ffffff" opacity={0.9} transparent />
                        </mesh>
                    ))}
                </group>
            ))}

            {/* Road Edges - Yellow solid lines */}
            {[-4, 4].map((x, i) => (
                <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.48, -50]}>
                    <planeGeometry args={[0.2, 200]} />
                    <meshBasicMaterial color="#fbbf24" opacity={1} />
                </mesh>
            ))}

            {/* Side Barriers - IQ walls */}
            <mesh position={[-5, 0, -50]} rotation={[0, 0, 0]}>
                <boxGeometry args={[0.3, 2, 200]} />
                <meshStandardMaterial color="#c026d3" emissive="#c026d3" emissiveIntensity={2} />
            </mesh>
            <mesh position={[5, 0, -50]} rotation={[0, 0, 0]}>
                <boxGeometry args={[0.3, 2, 200]} />
                <meshStandardMaterial color="#c026d3" emissive="#c026d3" emissiveIntensity={2} />
            </mesh>

            {/* Animated road markings */}
            <group ref={gridRef}>
                {Array.from({ length: 20 }).map((_, i) => (
                    <mesh
                        key={i}
                        rotation={[-Math.PI / 2, 0, 0]}
                        position={[0, -0.49, -100 + i * 10]}
                    >
                        <planeGeometry args={[8, 0.5]} />
                        <meshBasicMaterial color="#2a2a2a" opacity={0.5} transparent />
                    </mesh>
                ))}
            </group>
        </group>
    );
}
