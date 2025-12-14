// components/SpeedLines.tsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/store/useGameStore';
import * as THREE from 'three';
import { useResponsiveGame } from '@/lib/responsive.config';

export default function SpeedLines() {
    const groupRef = useRef<THREE.Group>(null);
    const { speed, isPaused, status } = useGameStore();
    const config = useResponsiveGame();

    // Generate speed lines
    const lines = useMemo(() => {
        const lineCount = config.isMobile ? 20 : 40;
        const lineData = [];

        for (let i = 0; i < lineCount; i++) {
            const angle = (Math.PI * 2 * i) / lineCount;
            const radius = 3 + Math.random() * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.random() * 4 - 1;
            const z = -Math.random() * 50;
            const length = 0.5 + Math.random() * 1.5;

            lineData.push({ x, y, z, length, speed: 0.5 + Math.random() * 0.5 });
        }

        return lineData;
    }, [config.isMobile]);

    useFrame((state, delta) => {
        if (groupRef.current && status === 'playing' && !isPaused) {
            groupRef.current.children.forEach((line, i) => {
                const lineData = lines[i];
                // Move lines forward based on game speed
                line.position.z += speed * 30 * delta * lineData.speed;

                // Reset position when line passes camera
                if (line.position.z > 5) {
                    line.position.z = -50;
                }

                // Fade based on speed
                const material = (line as THREE.Mesh).material as THREE.MeshBasicMaterial;
                material.opacity = Math.min(speed * 0.8, 0.6);
            });
        }
    });

    return (
        <group ref={groupRef}>
            {lines.map((line, i) => (
                <mesh
                    key={i}
                    position={[line.x, line.y, line.z]}
                    rotation={[Math.PI / 2, 0, 0]}
                >
                    <planeGeometry args={[0.05, line.length]} />
                    <meshBasicMaterial
                        color="#ffffff"
                        transparent
                        opacity={0.3}
                        depthWrite={false}
                    />
                </mesh>
            ))}
        </group>
    );
}

