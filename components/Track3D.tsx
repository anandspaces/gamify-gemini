// components/Track3D.tsx
import { useRef, memo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/useGameStore';
import { useResponsiveGame } from '@/lib/responsive.config';

function Track3D() {
    const gridRef = useRef<THREE.Group>(null);
    const { speed, isPaused, status } = useGameStore();
    const config = useResponsiveGame();

    useFrame((state, delta) => {
        if (gridRef.current && status === 'playing' && !isPaused) {
            gridRef.current.position.z = (gridRef.current.position.z + speed * 10 * delta) % 10;
        }
    });

    const { track: dims, trackDetail: detail, trackMaterials: materials, isMobile } = config;

    return (
        <group>
            {/* Main Road Surface - Dark asphalt with realistic texture */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.5, -50]}
                receiveShadow={!isMobile}
            >
                <planeGeometry args={[dims.width, dims.length]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={materials.roadRoughness}
                    metalness={materials.roadMetalness}
                />
            </mesh>

            {/* Road Texture Overlay with noise pattern */}
            {!isMobile && (
                <>
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, -50]}>
                        <planeGeometry args={[dims.width, dims.length]} />
                        <meshBasicMaterial
                            color="#0a0a0a"
                            opacity={0.3}
                            transparent
                        />
                    </mesh>
                    {/* Asphalt grain effect */}
                    {Array.from({ length: 50 }).map((_, i) => (
                        <mesh 
                            key={i} 
                            rotation={[-Math.PI / 2, 0, 0]} 
                            position={[
                                (Math.random() - 0.5) * dims.width,
                                -0.485,
                                -100 + Math.random() * 200
                            ]}
                        >
                            <circleGeometry args={[0.05 + Math.random() * 0.1, 8]} />
                            <meshBasicMaterial
                                color="#0a0a0a"
                                opacity={0.15}
                                transparent
                            />
                        </mesh>
                    ))}
                </>
            )}

            {/* Lane Dividers - White dashed lines (3 dividers for 4 lanes) */}
            {/* Dividers should be between lanes: -1.33, 0, 1.33 */}
            {[-1.33, 0, 1.33].map((x, i) => (
                <group key={i}>
                    {/* Dashed line effect with responsive count */}
                    {Array.from({ length: detail.dashCount }).map((_, j) => (
                        <mesh
                            key={j}
                            rotation={[-Math.PI / 2, 0, 0]}
                            position={[x, -0.48, -100 + j * 5]}
                        >
                            <planeGeometry args={[dims.laneDividerWidth, detail.dashLength]} />
                            <meshBasicMaterial
                                color="#ffffff"
                                opacity={materials.dashOpacity}
                                transparent
                            />
                        </mesh>
                    ))}
                </group>
            ))}

            {/* Road Edges - Yellow solid lines */}
            {[-dims.edgeOffset, dims.edgeOffset].map((x, i) => (
                <mesh
                    key={i}
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[x, -0.48, -50]}
                >
                    <planeGeometry args={[dims.edgeWidth, dims.length]} />
                    <meshBasicMaterial color="#fbbf24" opacity={1} />
                </mesh>
            ))}

            {/* Double Yellow Center Line (Racing aesthetic) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.475, -50]}>
                <planeGeometry args={[dims.laneDividerWidth * 1.5, dims.length]} />
                <meshBasicMaterial
                    color="#fbbf24"
                    opacity={0.6}
                    transparent
                />
            </mesh>

            {/* Side Barriers - Glowing walls */}
            <mesh
                position={[-dims.barrierOffset, 0, -50]}
                rotation={[0, 0, 0]}
                castShadow={!isMobile}
            >
                <boxGeometry args={[0.3, dims.barrierHeight, dims.length]} />
                <meshStandardMaterial
                    color="#656fff"
                    emissive="#656fff"
                    emissiveIntensity={materials.barrierEmissive}
                    metalness={0.5}
                    roughness={0.3}
                />
            </mesh>
            <mesh
                position={[dims.barrierOffset, 0, -50]}
                rotation={[0, 0, 0]}
                castShadow={!isMobile}
            >
                <boxGeometry args={[0.3, dims.barrierHeight, dims.length]} />
                <meshStandardMaterial
                    color="#656fff"
                    emissive="#656fff"
                    emissiveIntensity={materials.barrierEmissive}
                    metalness={0.5}
                    roughness={0.3}
                />
            </mesh>

            {/* Barrier Top Strips (Cyan accent) */}
            <mesh position={[-dims.barrierOffset, dims.barrierHeight / 2 + 0.05, -50]}>
                <boxGeometry args={[0.35, 0.1, dims.length]} />
                <meshStandardMaterial
                    color="#22d3ee"
                    emissive="#22d3ee"
                    emissiveIntensity={isMobile ? 1 : 1.5}
                />
            </mesh>
            <mesh position={[dims.barrierOffset, dims.barrierHeight / 2 + 0.05, -50]}>
                <boxGeometry args={[0.35, 0.1, dims.length]} />
                <meshStandardMaterial
                    color="#22d3ee"
                    emissive="#22d3ee"
                    emissiveIntensity={isMobile ? 1 : 1.5}
                />
            </mesh>

            {/* Barrier Support Posts (Desktop only) */}
            {!isMobile && Array.from({ length: 20 }).map((_, i) => (
                <group key={i}>
                    <mesh position={[-dims.barrierOffset, -0.5, -100 + i * 10]}>
                        <boxGeometry args={[0.2, 0.3, 0.2]} />
                        <meshStandardMaterial
                            color="#1a1a1a"
                            metalness={0.8}
                            roughness={0.2}
                        />
                    </mesh>
                    <mesh position={[dims.barrierOffset, -0.5, -100 + i * 10]}>
                        <boxGeometry args={[0.2, 0.3, 0.2]} />
                        <meshStandardMaterial
                            color="#1a1a1a"
                            metalness={0.8}
                            roughness={0.2}
                        />
                    </mesh>
                </group>
            ))}

            {/* Animated road markings/grid */}
            <group ref={gridRef}>
                {Array.from({ length: detail.gridLines }).map((_, i) => (
                    <mesh
                        key={i}
                        rotation={[-Math.PI / 2, 0, 0]}
                        position={[0, -0.49, -100 + i * detail.gridSpacing]}
                    >
                        <planeGeometry args={[dims.width, 0.5]} />
                        <meshBasicMaterial
                            color="#2a2a2a"
                            opacity={materials.gridOpacity}
                            transparent
                        />
                    </mesh>
                ))}
            </group>

            {/* Starting Grid Pattern (First section) */}
            {Array.from({ length: 4 }).map((_, i) => (
                <group key={i}>
                    {Array.from({ length: isMobile ? 3 : 5 }).map((_, j) => (
                        <mesh
                            key={j}
                            rotation={[-Math.PI / 2, 0, 0]}
                            position={[
                                -dims.width / 2 + dims.width / 4 * i + dims.width / 8,
                                -0.48,
                                5 + j * 1
                            ]}
                        >
                            <planeGeometry args={[dims.width / 5, 0.5]} />
                            <meshBasicMaterial
                                color={j % 2 === 0 ? "#ffffff" : "#1a1a1a"}
                                opacity={0.8}
                                transparent
                            />
                        </mesh>
                    ))}
                </group>
            ))}

            {/* Glow lights on barriers (Desktop/Tablet only) */}
            {!isMobile && (
                <>
                    <pointLight
                        position={[-dims.barrierOffset, 1, 0]}
                        intensity={0.5}
                        distance={8}
                        color="#656fff"
                    />
                    <pointLight
                        position={[dims.barrierOffset, 1, 0]}
                        intensity={0.5}
                        distance={8}
                        color="#656fff"
                    />
                    <pointLight
                        position={[-dims.barrierOffset, 1, -50]}
                        intensity={0.3}
                        distance={8}
                        color="#656fff"
                    />
                    <pointLight
                        position={[dims.barrierOffset, 1, -50]}
                        intensity={0.3}
                        distance={8}
                        color="#656fff"
                    />
                </>
            )}

            {/* Underglow effect (Tablet/Desktop only) */}
            {!isMobile && (
                <pointLight
                    position={[0, -0.3, 0]}
                    intensity={0.4}
                    distance={12}
                    color="#6366f1"
                />
            )}
        </group>
    );
}

export default memo(Track3D);