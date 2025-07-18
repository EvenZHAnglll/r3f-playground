# Pure Three.js Implementation

This directory contains a pure Three.js implementation that provides direct access to Three.js objects without React Three Fiber abstractions.

## Features

- **Direct Shader Access**: Modify shaders directly without React wrappers
- **Manual Scene Management**: Full control over scene construction and updates
- **Custom Camera Controls**: Implemented camera controls using raw Three.js
- **Live Shader Modification**: Real-time shader uniform updates
- **Full Three.js API**: Complete access to all Three.js functionality

## Structure

```
src/
├── app/vanilla-threejs/
│   ├── page.tsx              # Main page component
│   └── VanillaThreeJS.tsx    # Main Three.js React wrapper
└── lib/threejs/
    ├── GridMaterial.ts       # Custom shader material class
    ├── Scene.ts              # Scene setup and management
    └── CameraController.ts   # Camera control implementation
```

## Usage

The implementation provides several classes for managing Three.js objects:

### GridMaterial

```typescript
import { GridMaterial } from '@/lib/threejs/GridMaterial';

const material = new GridMaterial();
material.setDotColor('#ff0000');
material.setUVScale(50);
material.updateTime(elapsedTime);
```

### Scene Management

```typescript
import { ThreeJSScene } from '@/lib/threejs/Scene';

const scene = new ThreeJSScene(containerElement);
const gridMaterial = scene.getGridMaterial();
// Direct access to modify shaders
gridMaterial.uniforms.dotColor.value = new THREE.Color('#ff0000');
```

### Camera Controls

```typescript
import { CameraController } from '@/lib/threejs/CameraController';

const controls = new CameraController(camera, domElement);
controls.setTarget(0, 0, 0);
controls.setAutoRotate(true);
```

## Benefits over React Three Fiber

1. **Direct Control**: No abstraction layer between your code and Three.js
2. **Easier Debugging**: Direct access to Three.js objects in console
3. **Performance**: No React overhead for 3D rendering
4. **Shader Modification**: Easy to modify shaders at runtime
5. **Three.js Ecosystem**: Use any Three.js plugin or extension directly

## Live Controls

The implementation includes live shader controls that demonstrate:
- Real-time color modification
- UV scale adjustment
- Opacity control
- Direct uniform updates