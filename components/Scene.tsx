// components/Scene.tsx
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useGameStore } from '@/store/useGameStore';
import { useEffect, useState } from 'react';
import Track3D from './Track3D';
import Car3D from './Car3D';
import Gate3D from './Gate3D';

export default function Scene() {
    const { gates } = useGameStore();
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

    // Responsive camera settings
    const getCameraSettings = () => {
        if (isMobile) {
            return {
                position: [0, 4, 7] as [number, number, number],
                fov: 70
            };
        }
        if (isTablet) {
            return {
                position: [0, 3.5, 6] as [number, number, number],
                fov: 65
            };
        }
        return {
            position: [0, 3, 5] as [number, number, number],
            fov: 60
        };
    };

    // Responsive lighting intensity
    const getLightingIntensity = () => {
        if (isMobile) {
            return {
                ambient: 0.4,
                directional: 1.2,
                secondary: 0.6,
                point: 0.4
            };
        }
        return {
            ambient: 0.3,
            directional: 1.5,
            secondary: 0.8,
            point: 0.5
        };
    };

    // Responsive stars configuration
    const getStarsConfig = () => {
        if (isMobile) {
            return {
                count: 2000,
                factor: 3,
                speed: 0.8
            };
        }
        if (isTablet) {
            return {
                count: 3500,
                factor: 3.5,
                speed: 0.9
            };
        }
        return {
            count: 5000,
            factor: 4,
            speed: 1
        };
    };

    const cameraSettings = getCameraSettings();
    const lighting = getLightingIntensity();
    const starsConfig = getStarsConfig();

    return (
        <div className="absolute inset-0 w-full h-full bg-slate-950 touch-none">
            <Canvas
                camera={{
                    position: cameraSettings.position,
                    fov: cameraSettings.fov
                }}
                dpr={isMobile ? [1, 1.5] : [1, 2]} // Lower pixel ratio on mobile for performance
                performance={{ min: 0.5 }} // Allow framerate to drop if needed
                gl={{
                    powerPreference: isMobile ? 'low-power' : 'high-performance',
                    antialias: !isMobile, // Disable antialiasing on mobile for performance
                    alpha: false,
                    stencil: false,
                    depth: true
                }}
            >
                {/* Responsive Lighting */}
                <ambientLight intensity={lighting.ambient} />
                <directionalLight
                    position={[5, 10, 5]}
                    intensity={lighting.directional}
                    castShadow={!isMobile} // Disable shadows on mobile
                    shadow-mapSize={isMobile ? [512, 512] : [1024, 1024]}
                />
                <directionalLight
                    position={[-5, 10, -5]}
                    intensity={lighting.secondary}
                    color="#4f46e5"
                />
                <pointLight
                    position={[0, 5, 0]}
                    intensity={lighting.point}
                    color="#818cf8"
                />

                {/* Responsive Environment */}
                <Stars
                    radius={100}
                    depth={50}
                    count={starsConfig.count}
                    factor={starsConfig.factor}
                    saturation={0}
                    fade
                    speed={starsConfig.speed}
                />
                <fog attach="fog" args={['#020617', 10, isMobile ? 60 : 80]} />

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