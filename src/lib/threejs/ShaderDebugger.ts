import * as THREE from 'three';

/**
 * Utility functions for debugging and inspecting Three.js shaders
 */
export class ShaderDebugger {
  static logShaderUniforms(material: THREE.ShaderMaterial) {
    console.group('Shader Uniforms');
    Object.entries(material.uniforms).forEach(([key, uniform]) => {
      console.log(`${key}:`, uniform.value);
    });
    console.groupEnd();
  }

  static logShaderSource(material: THREE.ShaderMaterial) {
    console.group('Shader Source');
    console.log('Vertex Shader:', material.vertexShader);
    console.log('Fragment Shader:', material.fragmentShader);
    console.groupEnd();
  }

  static createShaderVariant(baseMaterial: THREE.ShaderMaterial, modifications: {
    vertexShader?: string;
    fragmentShader?: string;
    uniforms?: { [key: string]: unknown };
  }) {
    const newMaterial = baseMaterial.clone();
    
    if (modifications.vertexShader) {
      newMaterial.vertexShader = modifications.vertexShader;
    }
    
    if (modifications.fragmentShader) {
      newMaterial.fragmentShader = modifications.fragmentShader;
    }
    
    if (modifications.uniforms) {
      Object.entries(modifications.uniforms).forEach(([key, value]) => {
        if (newMaterial.uniforms[key]) {
          newMaterial.uniforms[key].value = value;
        } else {
          newMaterial.uniforms[key] = { value };
        }
      });
    }
    
    newMaterial.needsUpdate = true;
    return newMaterial;
  }

  static addShaderToGlobalScope(material: THREE.ShaderMaterial, name: string) {
    // Add material to global scope for console debugging
    (window as unknown as Record<string, unknown>)[name] = material;
    console.log(`Material "${name}" added to global scope. Access with: ${name}`);
  }

  static hotReplaceShader(material: THREE.ShaderMaterial, type: 'vertex' | 'fragment', newShader: string) {
    if (type === 'vertex') {
      material.vertexShader = newShader;
    } else {
      material.fragmentShader = newShader;
    }
    material.needsUpdate = true;
    console.log(`${type} shader hot-replaced`);
  }
}

/**
 * Development helper to expose Three.js objects globally
 */
export class DevHelper {
  static exposeToGlobal(objects: { [key: string]: unknown }) {
    Object.entries(objects).forEach(([key, value]) => {
      (window as unknown as Record<string, unknown>)[key] = value;
    });
    console.log('Exposed to global scope:', Object.keys(objects));
  }

  static logSceneGraph(scene: THREE.Scene) {
    console.group('Scene Graph');
    scene.traverse((obj) => {
      const indent = '  '.repeat(getObjectDepth(obj));
      console.log(`${indent}${obj.type}: ${obj.name || 'unnamed'}`);
    });
    console.groupEnd();
  }
}

function getObjectDepth(obj: THREE.Object3D): number {
  let depth = 0;
  let current = obj.parent;
  while (current) {
    depth++;
    current = current.parent;
  }
  return depth;
}