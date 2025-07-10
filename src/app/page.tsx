"use client";

import {
  ContactShadows,
  Environment,
  Float,
  Html,
  Lightformer,
  Text,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { Canvas, ThreeElements, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import {
  EffectComposer,
  N8AO,
  Bloom,
  TiltShift2,
} from "@react-three/postprocessing";
import { Doto } from "next/font/google";

const doto = Doto({
  weight: ["400", "700"],
  variable: "--font-dosis",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        gl={{ alpha: true }}
        camera={{ position: [0, 0, 20], fov: 50 }}
      >
        <group position={[0, 0, -10]} />
        <color attach="background" args={["#e0e0e0"]} />
        <spotLight
          position={[20, 20, 10]}
          penumbra={1}
          castShadow
          angle={0.2}
        />
        <Status position={[0, 0, -10]} />
        <Float floatIntensity={4}>
          <Knot />
        </Float>
        <ContactShadows
          scale={100}
          position={[0, -7.5, 0]}
          blur={1}
          far={100}
          opacity={0.85}
        />
        <Environment preset="city">
          <Lightformer
            intensity={8}
            position={[10, 5, 0]}
            scale={[10, 50, 1]}
            onUpdate={(self) => self.lookAt(0, 0, 0)}
          />
        </Environment>
        <EffectComposer enableNormalPass={true}>
          <N8AO aoRadius={1} intensity={2} />
          <Bloom
            mipmapBlur
            luminanceThreshold={0.8}
            intensity={0.3}
            levels={4}
          />
          <TiltShift2 blur={0.2} />
        </EffectComposer>
        <Rig />
      </Canvas>
    </div>
  );
}

function Rig() {
  // Create a target vector to store the desired camera position
  const targetPosition = new THREE.Vector3();

  useFrame((state, delta) => {
    // Calculate the target position
    targetPosition.set(
      Math.sin(-state.pointer.x) * 5,
      state.pointer.y * -3.5,
      15 + Math.cos(state.pointer.x) * 10
    );

    // Use lerp with a damping factor to smoothly move the camera
    state.camera.position.lerp(targetPosition, 1 - Math.exp(-1 * delta));

    // Keep the camera looking at the center
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}
type MeshProps = ThreeElements["mesh"];
const Knot = (props: MeshProps) => (
  <mesh receiveShadow castShadow {...props}>
    <torusKnotGeometry args={[3, 1, 256, 32]} />
    <MeshTransmissionMaterial
      thickness={3}
      roughness={0.2}
      samples={10}
      ior={1.8}
      chromaticAberration={0.3}
      distortion={0.1}
      clearcoat={1}
      clearcoatRoughness={0.1}
    />
  </mesh>
);

function Status({ position }: { position?: [number, number, number] }) {
  const textString = "/Even";
  return (
    <Text
      fontSize={14}
      letterSpacing={-0.025}
      color="grey"
      position={position}
      font={`/Doto-Bold.ttf`}
    >
      {textString}
      <Html
        style={{ color: "transparent", fontSize: "33.5em" }}
        transform
        className={doto.className}
      >
        {textString}
      </Html>
    </Text>
  );
}
