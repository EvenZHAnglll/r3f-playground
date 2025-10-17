"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { TilesRenderer } from "3d-tiles-renderer";
import * as THREE from "three";

export function TilesRenderer3D() {
  const { scene, camera, gl } = useThree();
  const tilesRendererRef = useRef<TilesRenderer | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    // NASA Mars Curiosity Rover - Dingo Gap dataset
    const tilesetUrl =
      "https://raw.githubusercontent.com/NASA-AMMOS/3DTilesSampleData/master/msl-dingo-gap/0528_0260184_to_s64o256_colorize/0528_0260184_to_s64o256_colorize/0528_0260184_to_s64o256_colorize_tileset.json";

    // Alternative datasets you can try:
    // const tilesetUrl = "https://nasa-ammos.github.io/3DTilesRendererJS/example/assets/SampleTileset/tileset.json";
    // const tilesetUrl = "https://storage.googleapis.com/ogc-3d-tiles/ayutthaya/tileset.json";

    const tilesRenderer = new TilesRenderer(tilesetUrl);
    tilesRendererRef.current = tilesRenderer;

    // Configure the tiles renderer
    tilesRenderer.setCamera(camera);
    tilesRenderer.setResolutionFromRenderer(camera, gl);

    // Set error target for level of detail (lower for higher quality)
    tilesRenderer.errorTarget = 6;
    tilesRenderer.maxDepth = 20;

    // Event listeners
    tilesRenderer.addEventListener("load-tile-set", () => {
      console.log("Tile set loaded");
      setIsLoading(false);
      setError(null);

      // Auto-fit the tileset to view
      const sphere = new THREE.Sphere();
      tilesRenderer.getBoundingSphere(sphere);

      if (sphere.radius !== 0) {
        // Center the tileset
        tilesRenderer.group.position.copy(sphere.center).multiplyScalar(-1);

        // Adjust camera to fit the Mars terrain
        const distance = Math.max(sphere.radius * 1.5, 10);
        camera.position.set(distance, distance * 0.5, distance);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
      }
    });

    tilesRenderer.addEventListener("load-model", () => {
      console.log("Model loaded");
      setLoadProgress(tilesRenderer.loadProgress);
    });

    tilesRenderer.addEventListener("load-error", (e: any) => {
      console.error("Error loading tiles:", e);
      setIsLoading(false);
      setError(
        `Failed to load tileset: ${e.error?.message || "Unknown error"}`
      );
    });

    // Add the tiles group to our group
    groupRef.current.add(tilesRenderer.group);

    return () => {
      if (tilesRendererRef.current && groupRef.current) {
        groupRef.current.remove(tilesRendererRef.current.group);
        tilesRendererRef.current.dispose();
      }
    };
  }, [camera, gl, scene]);

  // Update the tiles renderer each frame
  useFrame(() => {
    if (tilesRendererRef.current) {
      // Ensure camera matrix is updated
      camera.updateMatrixWorld();

      // Update tiles
      tilesRendererRef.current.update();

      // Update progress
      setLoadProgress(tilesRendererRef.current.loadProgress);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Show error message if loading failed */}
      {error && (
        <mesh position={[0, 50, 0]}>
          <boxGeometry args={[10, 10, 10]} />
          <meshBasicMaterial color="red" />
        </mesh>
      )}

      {/* Fallback content while loading or if error */}
      {(isLoading || error) && (
        <>
          {/* Simple placeholder geometry */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[50, 50, 50]} />
            <meshLambertMaterial color="#ff6b6b" wireframe />
          </mesh>

          <mesh position={[100, 0, 0]}>
            <sphereGeometry args={[30, 32, 16]} />
            <meshLambertMaterial color="#4ecdc4" wireframe />
          </mesh>

          <mesh position={[-100, 0, 0]}>
            <coneGeometry args={[30, 60, 8]} />
            <meshLambertMaterial color="#45b7d1" wireframe />
          </mesh>
        </>
      )}

      {/* Optional: Add a simple ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshLambertMaterial color="#e8e8e8" transparent opacity={0.3} />
      </mesh>

      {/* Optional: Add coordinate helpers */}
      <axesHelper args={[100]} />
    </group>
  );
}
