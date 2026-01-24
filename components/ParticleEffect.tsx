// components/ParticleEffect.tsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleEffectProps } from '@/types/types';

export default function ParticleEffect({
    position,
    color,
    count = 20,
    duration = 1,
    onComplete
}: ParticleEffectProps) {
    const groupRef = useRef<THREE.Group>(null);
    const startTime = useRef(Date.now());

    const particles = useMemo(() => {
        const particleData = [];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random() * 3;
            const vx = Math.cos(angle) * speed;
            const vy = Math.random() * 3 + 2;
            const vz = Math.sin(angle) * speed;

            particleData.push({
                velocity: new THREE.Vector3(vx, vy, vz),
                size: 0.1 + Math.random() * 0.15,
            });
        }
        return particleData;
    }, [count]);

    useFrame((state, delta) => {
        if (groupRef.current) {
            const elapsed = (Date.now() - startTime.current) / 1000;

            if (elapsed > duration) {
                if (onComplete) onComplete();
                return;
            }

            const progress = elapsed / duration;
            const opacity = 1 - progress;

            groupRef.current.children.forEach((particle, i) => {
                const data = particles[i];

                // Apply velocity
                particle.position.x += data.velocity.x * delta;
                particle.position.y += data.velocity.y * delta;
                particle.position.z += data.velocity.z * delta;

                // Apply gravity
                data.velocity.y -= 9.8 * delta;

                // Update material opacity
                const material = (particle as THREE.Mesh).material as THREE.MeshBasicMaterial;
                material.opacity = opacity;

                // Scale down over time
                const scale = 1 - progress * 0.5;
                particle.scale.set(scale, scale, scale);
            });
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {particles.map((particle, i) => (
                <mesh key={i} position={[0, 0, 0]}>
                    <sphereGeometry args={[particle.size, 8, 8]} />
                    <meshBasicMaterial
                        color={color}
                        transparent
                        opacity={1}
                        depthWrite={false}
                    />
                </mesh>
            ))}
        </group>
    );
}

