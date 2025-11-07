"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { GizmoHelper, GizmoViewport, Grid, Stats } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { CameraControl } from "@/components/r3f/cameraControl";
import {
  TilesPlugin,
  TilesRenderer,
  EnvironmentControls,
  CompassGizmo,
  TilesAttributionOverlay,
  GlobeControls,
} from "3d-tiles-renderer/r3f";
import {
  DebugTilesPlugin,
  GLTFExtensionsPlugin,
} from "3d-tiles-renderer/plugins";
import { DRACOLoader, KTX2Loader } from "three/examples/jsm/Addons.js";
import { useCameraStore } from "@/components/r3f/cameraStore";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Env } from "@/components/r3f/environment";

const ktxLoader = new KTX2Loader();
// .setTranscoderPath(
// "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/basis/"
// );
const dracoLoader = new DRACOLoader();
// .setDecoderPath(
// "https://www.gstatic.com/draco/v1/decoders/"
// );

export function Canvas3D() {
  const tilesetUrl =
    // "http://192.168.36.145:8080/3DTiles/BaseData/SHCity_SimpleModel/tileset.json";
    // "https://raw.githubusercontent.com/NASA-AMMOS/3DTilesSampleData/master/msl-dingo-gap/0528_0260184_to_s64o256_colorize/0528_0260184_to_s64o256_colorize/0528_0260184_to_s64o256_colorize_tileset.json";
    // "http://localhost:7999/gis/3DTiles/HK_P1_To_P2_v4_ClearNormal_Fix_TC/tileset.json";
    "http://192.168.36.145:8080/3DTiles/AIGC_2025/HK/TC/HK_P1_To_P2_v4_ClearNormal_Fix_TC/tileset.json";

  const tileRef = useRef<typeof TilesRenderer>(null);
  const setLookAt = useCameraStore((state) => state.setLookAt);

  const flyToTiles = () => {
    const transform = tileRef.current?.rootTileSet.root.transform;

    const xyz = [transform[12], transform[13], transform[14]];
    console.log(xyz);

    const center = new THREE.Vector3(xyz[0], xyz[1], xyz[2]);

    const distance = 1000; // 根据场景规模调整比例
    const eye = center.clone().add(new THREE.Vector3(0, distance, distance));

    setLookAt(eye, center);
  };

  function TilesWithLoaders() {
    const { gl } = useThree();
    const [ktxLoader, setKtxLoader] = useState<KTX2Loader | null>(null);
    const [dracoLoader, setDracoLoader] = useState<DRACOLoader | null>(null);

    const handleLoadModel = ({ scene }: any) => {
      console.log("Model loaded:", scene);
      scene.traverse((child: any) => {
        if (child.material) {
          const geometry = child.geometry;
          console.log("UV attributes:", {
            uv0: geometry.attributes.uv, // UV channel 0 (默认)
            uv1: geometry.attributes.uv1, // UV channel 1
            uv2: geometry.attributes.uv2, // UV channel 2
          });

          console.log("Original material:", child.material);
          console.log("Original Map", child.material.map);
          console.log("ColorSpace:", child.material.map?.colorSpace);
          const mat = new THREE.ShaderMaterial({
            uniforms: {
              uTexture: { value: child.material.map },
              uGamma: { value: 0.4 },
              uSaturation: { value: 1.2 },
            },
            vertexShader: `
              varying vec2 vUv0;
              varying vec2 vUv1;
              varying vec2 vUv2;
              attribute vec2 uv1;
              attribute vec2 uv2;
              void main() {
                vUv0 = uv;      // UV channel 0
                vUv1 = uv1;     // UV channel 1
                vUv2 = uv2;     // UV channel 2
            
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `

              vec3 rgbToHsv(vec3 c) {
                vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
                vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
                vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
                float d = q.x - min(q.w, q.y);
                float e = 1.0e-10;
                return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
              }

              vec3 hsvToRgb(vec3 c) {
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
              }

  
              uniform sampler2D uTexture;
              uniform float uGamma;
              uniform float uSaturation;
              varying vec2 vUv0;
              varying vec2 vUv1;
              varying vec2 vUv2;

              void main() {
                vec2 uvMin = vec2(0.0, 0.0);
                vec2 uvMax = vec2(1.0, 1.0);
                uvMin = max(uvMin, vUv1);
                uvMax = min(uvMax, vUv2);
                vec2 remappedUV = mix(uvMin, uvMax, vUv0);
                //vec4 texColor = vec4(vUv2, 0.0, 1.0);
                vec4 texColor = texture2D(uTexture, remappedUV);
            
                vec3 color = pow(texColor.rgb, vec3(uGamma)); // 伽马校正

                vec3 hsv = rgbToHsv(color);
                hsv.y = clamp(hsv.y * uSaturation, 0.0, 1.0); // 调整饱和度
                vec3 saturatedColor = hsvToRgb(hsv);
                gl_FragColor = vec4(saturatedColor, texColor.a);
              }
            `,
          });
          child.material = mat;
        }
      });
    };

    const handleDisposeModel = ({ scene }: any) => {
      scene.traverse((c: any) => {
        if (c.material) {
          c.material.dispose();
        }
      });
    };

    useEffect(() => {
      // 使用 CDN 提供的 basis transcoder（推荐使用与你的 three 版本匹配的 CDN 路径）
      const ktx = new KTX2Loader()
        .setTranscoderPath(
          "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/basis/"
        )
        .detectSupport(gl);
      setKtxLoader(ktx);

      // DRACO loader 也使用 CDN
      const draco = new DRACOLoader().setDecoderPath(
        "https://www.gstatic.com/draco/v1/decoders/"
      );
      setDracoLoader(draco);

      return () => {
        ktx.dispose();
        draco.dispose();
      };
    }, [gl]);

    if (!ktxLoader || !dracoLoader) return null;

    return (
      <group>
        <TilesRenderer
          ref={tileRef}
          url={tilesetUrl}
          onLoadModel={handleLoadModel}
          onDisposeModel={handleDisposeModel}
        >
          <TilesPlugin plugin={DebugTilesPlugin} displayBoxBounds={true} />
          <TilesPlugin
            plugin={GLTFExtensionsPlugin}
            dracoLoader={dracoLoader}
            ktxLoader={ktxLoader}
            // autoDispose={false}
          />
          <CompassGizmo />
          <TilesAttributionOverlay />
        </TilesRenderer>
      </group>
    );
  }

  return (
    <div className="w-full h-full">
      <Button
        onClick={flyToTiles}
        style={{ position: "absolute", zIndex: 10, left: 12, bottom: 120 }}
      >
        Fly to tiles
      </Button>

      <Canvas
        gl={{
          antialias: true,
          alpha: false,
        }}
      >
        <CameraControl />
        <GizmoHelper alignment="bottom-right">
          <GizmoViewport />
        </GizmoHelper>
        <Grid
          infiniteGrid
          cellSize={1000}
          cellColor={"gray"}
          sectionSize={10000}
          fadeDistance={1000000}
        />

        <Suspense fallback={null}>
          <TilesWithLoaders />
        </Suspense>

        {/* Performance Stats */}
        <Stats />

        {/* Environment */}
        <Env />
        <mesh>
          <boxGeometry args={[100000, 100000, 10000]} />
          <meshStandardMaterial color={"#e0e0e0"} />
        </mesh>
      </Canvas>
    </div>
  );
}
