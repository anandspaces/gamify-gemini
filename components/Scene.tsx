// components/Scene.tsx
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useGameStore } from '@/store/useGameStore';
import Track3D from './Track3D';
import Car3D from './Car3D';
import Gate3D from './Gate3D';

export default function Scene() {
    const { gates } = useGameStore();

    return (
        <div className="absolute inset-0 w-full h-full bg-slate-950">
            <Canvas camera={{ position: [0, 3, 5], fov: 60 }}>
                {/* Lighting */}
                <ambientLight intensity={0.3} />
                <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
                <directionalLight position={[-5, 10, -5]} intensity={0.8} color="#4f46e5" />
                <pointLight position={[0, 5, 0]} intensity={0.5} color="#818cf8" />

                {/* Environment */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <fog attach="fog" args={['#020617', 10, 80]} />

                {/* Game Objects */}
                <Track3D />
                <Car3D />

                {/* Gates */}
                {gates.map((gate) => (
                    <Gate3D key={gate.id} gate={gate} />
                ))}

            </Canvas>
        </div>
    );
}
