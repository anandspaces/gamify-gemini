// components/Scene.tsx
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useGameStore } from '@/store/useGameStore';
import { useResponsiveGame } from '@/lib/responsive.config';
import Track3D from './Track3D';
import Car3D from './Car3D';
import Gate3D from './Gate3D';
import Obstacle3D from './Obstacle3D';

export default function Scene() {
    const { gates, obstacles } = useGameStore();
    const config = useResponsiveGame();

    return (
        <div className="absolute inset-0 w-full h-full bg-slate-950 touch-none">
            <Canvas
                camera={{
                    position: config.camera.position,
                    fov: config.camera.fov
                }}
                dpr={config.performance.dpr}
                performance={{ min: 0.5 }}
                gl={{
                    powerPreference: config.performance.powerPreference,
                    antialias: config.performance.antialias,
                    alpha: false,
                    stencil: false,
                    depth: true
                }}
            >
                {/* Responsive Lighting */}
                <ambientLight intensity={config.lighting.ambient} />
                <directionalLight
                    position={[5, 10, 5]}
                    intensity={config.lighting.directional}
                    castShadow={config.performance.castShadow}
                    shadow-mapSize={config.performance.shadowMapSize}
                />
                <directionalLight
                    position={[-5, 10, -5]}
                    intensity={config.lighting.secondary}
                    color="#4f46e5"
                />
                <pointLight
                    position={[0, 5, 0]}
                    intensity={config.lighting.point}
                    color="#818cf8"
                />

                {/* Responsive Environment */}
                <Stars
                    radius={100}
                    depth={50}
                    count={config.stars.count}
                    factor={config.stars.factor}
                    saturation={0}
                    fade
                    speed={config.stars.speed}
                />
                <fog attach="fog" args={['#020617', 5, config.performance.fogDistance]} />

                {/* Game Objects */}
                <Track3D />
                <Car3D />

                {/* Gates */}
                {gates.map((gate) => (
                    <Gate3D key={gate.id} gate={gate} />
                ))}

                {/* Obstacles */}
                {obstacles.map((obstacle) => (
                    <Obstacle3D key={obstacle.id} obstacle={obstacle} />
                ))}

            </Canvas>
        </div>
    );
}