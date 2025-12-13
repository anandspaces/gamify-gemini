// lib/responsive.config.ts
import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveGameConfig {
    deviceType: DeviceType;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;

    // Lane positioning (consistent across all components)
    lanePositions: [number, number, number, number];

    // Track dimensions
    track: {
        width: number;
        length: number;
        laneDividerWidth: number;
        edgeOffset: number;
        edgeWidth: number;
        barrierHeight: number;
        barrierOffset: number;
    };

    // Track detail levels
    trackDetail: {
        dashCount: number;
        gridLines: number;
        dashLength: number;
        gridSpacing: number;
    };

    // Track materials
    trackMaterials: {
        roadRoughness: number;
        roadMetalness: number;
        barrierEmissive: number;
        dashOpacity: number;
        gridOpacity: number;
    };

    // Gate dimensions
    gate: {
        width: number;
        height: number;
        depth: number;
        borderWidth: number;
        borderHeight: number;
        badgeRadius: number;
        fontSize: number;
        labelFontSize: number;
        maxTextWidth: number;
        textOutline: number;
    };

    // Gate materials
    gateMaterials: {
        metalness: number;
        roughness: number;
        opacity: number;
        emissiveIntensity: number;
    };

    // Car configuration
    car: {
        scale: number;
        animationSpeed: {
            laneSwitch: number;
            bobbing: number;
            bobbingAmplitude: number;
        };
        lightIntensity: number;
    };

    // Camera settings
    camera: {
        position: [number, number, number];
        fov: number;
    };

    // Lighting
    lighting: {
        ambient: number;
        directional: number;
        secondary: number;
        point: number;
    };

    // Stars configuration
    stars: {
        count: number;
        factor: number;
        speed: number;
    };

    // Performance settings
    performance: {
        dpr: [number, number];
        powerPreference: 'low-power' | 'high-performance';
        antialias: boolean;
        castShadow: boolean;
        shadowMapSize: [number, number];
        fogDistance: number;
    };
}

// Breakpoints
const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1024;

function getDeviceType(width: number): DeviceType {
    if (width < MOBILE_BREAKPOINT) return 'mobile';
    if (width < TABLET_BREAKPOINT) return 'tablet';
    return 'desktop';
}

/**
 * Calculate lane positions dynamically based on screen width
 * Ensures lanes span the full visible width of the screen
 */
function calculateLanePositions(deviceType: DeviceType, screenWidth: number): [number, number, number, number] {
    // Base track width that scales with screen
    let trackWidth: number;

    if (deviceType === 'mobile') {
        // Reduced scaling for narrower lanes on mobile
        trackWidth = Math.min(screenWidth * 0.008, 5); // Reduced from 0.015 to 0.008, max 5 units
    } else if (deviceType === 'tablet') {
        trackWidth = Math.min(screenWidth * 0.01, 6); // Slightly reduced from 0.012
    } else {
        // Desktop uses fixed width for consistency - NOT scaled by screen width
        trackWidth = 5.5; // Fixed width for desktop
    }

    // Calculate lane spacing - 4 lanes evenly distributed
    const laneSpacing = trackWidth / 3; // 3 gaps between 4 lanes
    const startPos = -trackWidth / 2;

    return [
        startPos + laneSpacing * 0,  // Lane 0 (leftmost)
        startPos + laneSpacing * 1,  // Lane 1
        startPos + laneSpacing * 2,  // Lane 2
        startPos + laneSpacing * 3   // Lane 3 (rightmost)
    ];
}

// Configuration for each device type
export function getResponsiveConfig(deviceType: DeviceType, screenWidth: number = 1920): Omit<ResponsiveGameConfig, 'deviceType' | 'isMobile' | 'isTablet' | 'isDesktop'> {
    // Calculate dynamic lane positions based on screen width
    const lanePositions = calculateLanePositions(deviceType, screenWidth);

    switch (deviceType) {
        case 'mobile':
            return {
                // Lane positions are calculated dynamically above
                lanePositions,

                track: {
                    width: Math.min(screenWidth * 0.008, 5) + 1.5, // Reduced margins
                    length: 200,
                    laneDividerWidth: 0.15, // Thinner dividers
                    edgeOffset: Math.min(screenWidth * 0.008, 5) / 2 + 0.75,
                    edgeWidth: 0.2,
                    barrierHeight: 1.5, // Lower barriers for better view
                    barrierOffset: Math.min(screenWidth * 0.008, 5) / 2 + 1.25,
                },

                trackDetail: {
                    dashCount: 20, // Reduced from 30 for performance
                    gridLines: 10, // Reduced from 15 for performance
                    dashLength: 2.5,
                    gridSpacing: 20, // Increased spacing
                },

                trackMaterials: {
                    roadRoughness: 0.9,
                    roadMetalness: 0.05,
                    barrierEmissive: 1.5,
                    dashOpacity: 0.85,
                    gridOpacity: 0.4,
                },

                gate: {
                    width: 1.2, // Reduced from 1.4
                    height: 1.4, // Reduced from 1.6
                    depth: 0.1,
                    borderWidth: 1.25,
                    borderHeight: 1.45,
                    badgeRadius: 0.25,
                    fontSize: 0.18, // Reduced for better performance
                    labelFontSize: 0.28,
                    maxTextWidth: 1.1,
                    textOutline: 0.01,
                },

                gateMaterials: {
                    metalness: 0.3,
                    roughness: 0.5,
                    opacity: 0.9,
                    emissiveIntensity: 0.5,
                },

                car: {
                    scale: 0.8,
                    animationSpeed: {
                        laneSwitch: 8,
                        bobbing: 8,
                        bobbingAmplitude: 0.04,
                    },
                    lightIntensity: 1.5,
                },

                camera: {
                    position: [0, 3.2, 6], // Adjusted for narrower lanes
                    fov: 75, // Wider FOV for better mobile view
                },

                lighting: {
                    ambient: 0.5, // Increased for better visibility
                    directional: 1.0, // Reduced for performance
                    secondary: 0.5,
                    point: 0.3,
                },

                stars: {
                    count: 1000, // Reduced from 2000 for performance
                    factor: 2.5,
                    speed: 0.6,
                },

                performance: {
                    dpr: [0.75, 1], // Reduced from [1, 1.5] for better performance
                    powerPreference: 'low-power',
                    antialias: false,
                    castShadow: false,
                    shadowMapSize: [256, 256], // Reduced from [512, 512]
                    fogDistance: 30, // Reduced from 35
                },
            };

        case 'tablet':
            return {
                // Lane positions are calculated dynamically above
                lanePositions,

                track: {
                    width: Math.min(screenWidth * 0.01, 6) + 1.75,
                    length: 200,
                    laneDividerWidth: 0.18,
                    edgeOffset: Math.min(screenWidth * 0.01, 6) / 2 + 0.875,
                    edgeWidth: 0.22,
                    barrierHeight: 1.9,
                    barrierOffset: Math.min(screenWidth * 0.01, 6) / 2 + 1.375,
                },

                trackDetail: {
                    dashCount: 35,
                    gridLines: 18,
                    dashLength: 2.2,
                    gridSpacing: 11.11,
                },

                trackMaterials: {
                    roadRoughness: 0.8,
                    roadMetalness: 0.1,
                    barrierEmissive: 2,
                    dashOpacity: 0.9,
                    gridOpacity: 0.5,
                },

                gate: {
                    width: 1.3,
                    height: 1.5,
                    depth: 0.11,
                    borderWidth: 1.35,
                    borderHeight: 1.55,
                    badgeRadius: 0.27,
                    fontSize: 0.24,
                    labelFontSize: 0.34,
                    maxTextWidth: 1.2,
                    textOutline: 0.012,
                },

                gateMaterials: {
                    metalness: 0.4,
                    roughness: 0.4,
                    opacity: 0.85,
                    emissiveIntensity: 0.6,
                },

                car: {
                    scale: 0.9,
                    animationSpeed: {
                        laneSwitch: 10,
                        bobbing: 10,
                        bobbingAmplitude: 0.05,
                    },
                    lightIntensity: 2.0,
                },

                camera: {
                    position: [0, 3, 6],
                    fov: 65,
                },

                lighting: {
                    ambient: 0.3,
                    directional: 1.5,
                    secondary: 0.8,
                    point: 0.5,
                },

                stars: {
                    count: 3500,
                    factor: 3.5,
                    speed: 0.9,
                },

                performance: {
                    dpr: [1, 2],
                    powerPreference: 'high-performance',
                    antialias: true,
                    castShadow: true,
                    shadowMapSize: [1024, 1024],
                    fogDistance: 45,
                },
            };

        case 'desktop':
        default:
            return {
                // Lane positions are calculated dynamically above
                lanePositions,

                track: {
                    width: 7, // Fixed width for desktop
                    length: 200,
                    laneDividerWidth: 0.15,
                    edgeOffset: 3.5,
                    edgeWidth: 0.2,
                    barrierHeight: 2,
                    barrierOffset: 4.25,
                },

                trackDetail: {
                    dashCount: 40,
                    gridLines: 20,
                    dashLength: 2,
                    gridSpacing: 10,
                },

                trackMaterials: {
                    roadRoughness: 0.8,
                    roadMetalness: 0.1,
                    barrierEmissive: 2,
                    dashOpacity: 0.9,
                    gridOpacity: 0.5,
                },

                gate: {
                    width: 1.2,
                    height: 1.4,
                    depth: 0.1,
                    borderWidth: 1.25,
                    borderHeight: 1.45,
                    badgeRadius: 0.25,
                    fontSize: 0.18,
                    labelFontSize: 0.35,
                    maxTextWidth: 1.15,
                    textOutline: 0.01,
                },

                gateMaterials: {
                    metalness: 0.4,
                    roughness: 0.4,
                    opacity: 0.85,
                    emissiveIntensity: 0.6,
                },

                car: {
                    scale: 1.0,
                    animationSpeed: {
                        laneSwitch: 10,
                        bobbing: 10,
                        bobbingAmplitude: 0.05,
                    },
                    lightIntensity: 2.0,
                },

                camera: {
                    position: [0, 2.8, 5.5],
                    fov: 60,
                },

                lighting: {
                    ambient: 0.3,
                    directional: 1.5,
                    secondary: 0.8,
                    point: 0.5,
                },

                stars: {
                    count: 5000,
                    factor: 4,
                    speed: 1,
                },

                performance: {
                    dpr: [1, 2],
                    powerPreference: 'high-performance',
                    antialias: true,
                    castShadow: true,
                    shadowMapSize: [1024, 1024],
                    fogDistance: 45,
                },
            };
    }
}

/**
 * React hook to get responsive game configuration
 * Automatically updates on window resize and recalculates lane positions
 */
export function useResponsiveGame(): ResponsiveGameConfig {
    const [deviceType, setDeviceType] = useState<DeviceType>(() => {
        if (typeof window === 'undefined') return 'desktop';
        return getDeviceType(window.innerWidth);
    });

    const [screenWidth, setScreenWidth] = useState<number>(() => {
        if (typeof window === 'undefined') return 1920;
        return window.innerWidth;
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setDeviceType(getDeviceType(width));
            setScreenWidth(width);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const config = getResponsiveConfig(deviceType, screenWidth);

    return {
        deviceType,
        isMobile: deviceType === 'mobile',
        isTablet: deviceType === 'tablet',
        isDesktop: deviceType === 'desktop',
        ...config,
    };
}
