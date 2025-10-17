import { Metadata } from "next";
import { Canvas3D } from "./canvas3D";

export const metadata: Metadata = {
  title: "3D Tiles Renderer Demo",
  description:
    "Demonstration of 3D tiles rendering using React Three Fiber and 3DTilesRendererJS",
};

export default function TilesPage() {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-background border-b p-4">
        <h1 className="text-2xl font-bold">3D Tiles Renderer Demo</h1>
        <p className="text-muted-foreground">
          NASA Mars Curiosity Rover - Dingo Gap dataset visualization
        </p>
      </header>

      <main className="flex-1 relative">
        <Canvas3D />

        {/* Control Panel */}
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm border rounded-lg p-4 shadow-lg max-w-sm">
          <h3 className="font-semibold mb-2">Controls</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Left click + drag: Rotate camera</li>
            <li>• Right click + drag: Pan camera</li>
            <li>• Mouse wheel: Zoom in/out</li>
            <li>• Double click: Auto-fit view</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
