import { Canvas3D } from "./canvas3D";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative w-full h-full">
      <Canvas3D />
      
      {/* Navigation Panel */}
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
            <Link href="/vanilla-threejs">
              <Button variant="ghost" size="sm">
                Pure Three.js
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="p-4 backdrop-blur-lg bg-white/20 shadow-lg text-white">
          <CardContent className="p-0">
            <h3 className="text-lg font-semibold mb-2">R3F Grid Demo</h3>
            <p className="text-sm opacity-90 mb-2">
              Grid material with custom shaders using React Three Fiber.
            </p>
            <ul className="text-xs space-y-1">
              <li>• Custom shader materials</li>
              <li>• R3F component integration</li>
              <li>• Interactive controls</li>
              <li>• Post-processing effects</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
