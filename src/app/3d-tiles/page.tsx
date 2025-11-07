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
      <main className="flex-1 relative">
        <Canvas3D />
      </main>
    </div>
  );
}
