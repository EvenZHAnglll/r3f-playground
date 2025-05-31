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
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import {
  EffectComposer,
  N8AO,
  Bloom,
  TiltShift2,
} from "@react-three/postprocessing";

export default function Home() {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        gl={{ alpha: true }}
        camera={{ position: [0, 0, 20], fov: 50 }}
      >
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

const Knot = (props) => (
  <mesh receiveShadow castShadow {...props}>
    <torusKnotGeometry args={[3, 1, 256, 32]} />
    <MeshTransmissionMaterial thickness={4} />
  </mesh>
);

function Status(props) {
  const text = "/Even";
  return (
    <Text fontSize={14} letterSpacing={-0.025} color="black" {...props}>
      {text}
      <Html style={{ color: "transparent", fontSize: "33.5em" }} transform>
        {text}
      </Html>
    </Text>
  );
}
