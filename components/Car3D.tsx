// components/Car3D.tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/store/useGameStore';
import * as THREE from 'three';

export default function Car3D() {
    const meshRef = useRef<THREE.Group>(null);
    const { selectedLane } = useGameStore();

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Calculate target X based on lane for 4 lanes
            // Lane 0: -2, Lane 1: -0.67, Lane 2: 0.67, Lane 3: 2
            const lanePositions = [-2, -0.67, 0.67, 2];
            const targetX = lanePositions[selectedLane ?? 1];

            // Smooth lerp
            meshRef.current.position.x = THREE.MathUtils.lerp(
                meshRef.current.position.x,
                targetX,
                delta * 10 // Speed of lane switch
            );

            // Add slight tilt when moving
            const tilt = (meshRef.current.position.x - targetX) * 0.5;
            meshRef.current.rotation.z = tilt;

            // Bobbing effect
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 10) * 0.05;
        }
    });

    return (
        <group ref={meshRef} position={[0, 0.5, 0]}>
            {/* Car Body */}
            <mesh position={[0, 0.2, 0]}>
                <boxGeometry args={[0.8, 0.5, 1.8]} />
                <meshStandardMaterial color="#ef4444" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Cabin */}
            <mesh position={[0, 0.6, -0.2]}>
                <boxGeometry args={[0.7, 0.4, 1]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Wheels */}
            <mesh position={[-0.45, 0, 0.5]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
                <meshStandardMaterial color="#000" />
            </mesh>
            <mesh position={[0.45, 0, 0.5]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
                <meshStandardMaterial color="#000" />
            </mesh>
            <mesh position={[-0.45, 0, -0.5]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
                <meshStandardMaterial color="#000" />
            </mesh>
            <mesh position={[0.45, 0, -0.5]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
                <meshStandardMaterial color="#000" />
            </mesh>

            {/* Glow */}
            <pointLight position={[0, 0, -1]} distance={5} intensity={2} color="#ef4444" />
        </group>
    );
}
