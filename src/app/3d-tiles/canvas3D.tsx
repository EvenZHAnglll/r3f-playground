"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import { Suspense } from "react";
import { TilesRenderer3D } from "@/components/r3f/tilesRenderer";

export function Canvas3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{
          position: [50, 50, 100],
          fov: 75,
          near: 0.01,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: false,
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[100, 100, 50]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={0.5}
          panSpeed={0.8}
          rotateSpeed={0.5}
          maxDistance={200}
          minDistance={0.1}
        />

        {/* 3D Tiles */}
        <Suspense fallback={null}>
          <TilesRenderer3D />
        </Suspense>

        {/* Performance Stats */}
        <Stats />

        {/* Environment */}
        <fog attach="fog" args={["#f0f0f0", 100, 2000]} />
      </Canvas>

      {/* Loading Indicator */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm">Loading Mars Terrain Data</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          NASA Curiosity Rover - Dingo Gap
        </p>
      </div>
    </div>
  );
}
