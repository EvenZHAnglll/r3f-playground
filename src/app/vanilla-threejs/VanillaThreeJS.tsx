"use client";

import { useEffect, useRef } from "react";
import { ThreeJSScene } from "@/lib/threejs/Scene";
import { CameraController } from "@/lib/threejs/CameraController";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function VanillaThreeJS() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ThreeJSScene | null>(null);
  const cameraControllerRef = useRef<CameraController | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize the Three.js scene
    const scene = new ThreeJSScene(containerRef.current);
    sceneRef.current = scene;

    // Initialize camera controls
    const cameraController = new CameraController(
      scene.getCamera(),
      containerRef.current
    );
    cameraControllerRef.current = cameraController;

    // Set initial camera position
    cameraController.setPosition(-6, 5, 10);
    cameraController.setTarget(0, 0, 0);

    // Development helpers (only in development)
    if (process.env.NODE_ENV === 'development') {
      // Expose objects to global scope for debugging
      (window as unknown as Record<string, unknown>).threeScene = scene;
      (window as unknown as Record<string, unknown>).gridMaterial = scene.getGridMaterial();
      (window as unknown as Record<string, unknown>).camera = scene.getCamera();
      (window as unknown as Record<string, unknown>).renderer = scene.getRenderer();
      console.log('Development mode: Three.js objects exposed globally');
      console.log('Access with: threeScene, gridMaterial, camera, renderer');
    }

    // Handle window resize
    const handleResize = () => {
      if (sceneRef.current) {
        sceneRef.current.resize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Animation loop for camera controls
    const animate = () => {
      if (cameraControllerRef.current) {
        cameraControllerRef.current.update();
      }
      requestAnimationFrame(animate);
    };
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (cameraControllerRef.current) {
        cameraControllerRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.dispose();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Navigation and Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-4">
        <Card className="p-2 backdrop-blur-lg bg-white/20 shadow-lg">
          <CardContent className="p-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                ← Back to R3F
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="p-2 backdrop-blur-lg bg-white/20 shadow-lg">
          <CardContent className="p-2">
            <Link href="/custom-material/grid">
              <Button variant="ghost" size="sm">
                R3F Grid Demo
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="p-4 backdrop-blur-lg bg-white/20 shadow-lg text-white">
          <CardContent className="p-0">
            <h3 className="text-lg font-semibold mb-2">Pure Three.js</h3>
            <p className="text-sm opacity-90 mb-2">
              This scene uses vanilla Three.js without React Three Fiber.
            </p>
            <ul className="text-xs space-y-1">
              <li>• Direct shader access and modification</li>
              <li>• Manual scene management</li>
              <li>• Custom camera controls</li>
              <li>• Full Three.js API available</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Live Shader Controls */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="p-4 backdrop-blur-lg bg-white/20 shadow-lg">
          <CardContent className="p-0">
            <h3 className="text-white text-sm font-semibold mb-2">Shader Controls</h3>
            <div className="space-y-2">
              <div>
                <label className="text-white text-xs block">Grid Color</label>
                <input
                  type="color"
                  defaultValue="#a4c0f7"
                  className="w-full h-8 rounded border-0"
                  onChange={(e) => {
                    if (sceneRef.current) {
                      sceneRef.current.getGridMaterial().setDotColor(e.target.value);
                    }
                  }}
                />
              </div>
              <div>
                <label className="text-white text-xs block">UV Scale</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  defaultValue="40"
                  className="w-full"
                  onChange={(e) => {
                    if (sceneRef.current) {
                      sceneRef.current.getGridMaterial().setUVScale(parseInt(e.target.value));
                    }
                  }}
                />
              </div>
              <div>
                <label className="text-white text-xs block">Opacity</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="1"
                  className="w-full"
                  onChange={(e) => {
                    if (sceneRef.current) {
                      sceneRef.current.getGridMaterial().setSecondaryOpacity(parseFloat(e.target.value));
                    }
                  }}
                />
              </div>
              <div className="mt-3">
                <button
                  className="w-full px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                  onClick={() => {
                    if (sceneRef.current) {
                      const material = sceneRef.current.getGridMaterial();
                      console.group('Grid Material Debug');
                      console.log('Uniforms:', material.uniforms);
                      console.log('Vertex Shader:', material.vertexShader);
                      console.log('Fragment Shader:', material.fragmentShader);
                      console.groupEnd();
                    }
                  }}
                >
                  Debug Shader
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}