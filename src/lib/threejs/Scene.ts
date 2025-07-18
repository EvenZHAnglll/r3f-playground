import * as THREE from 'three';
import { GridMaterial } from './GridMaterial';

export class ThreeJSScene {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private gridMaterial!: GridMaterial;
  private gridMaterialBack!: GridMaterial;
  private clock: THREE.Clock;
  private spheres: THREE.Mesh[] = [];
  private cube!: THREE.Mesh;
  private gridMesh!: THREE.Mesh;
  private gridMeshBack!: THREE.Mesh;

  constructor(container: HTMLElement) {
    this.clock = new THREE.Clock();
    this.initScene();
    this.initCamera();
    this.initRenderer(container);
    this.initLights();
    this.initGeometry();
    this.initGridMaterial();
    this.animate();
  }

  private initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#050e20");
    this.scene.fog = new THREE.Fog("#050e20", 25, 35);
  }

  private initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.4,
      1000
    );
    this.camera.position.set(-6, 5, 10);
  }

  private initRenderer(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    
    container.appendChild(this.renderer.domElement);
  }

  private initLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
    this.scene.add(ambientLight);

    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    this.scene.add(directionalLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x87CEEB, 0.3);
    fillLight.position.set(-5, 5, -5);
    this.scene.add(fillLight);
  }

  private initGeometry() {
    // Create spheres
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    
    // Main sphere
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 1, 0);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    this.scene.add(sphere);
    this.spheres.push(sphere);

    // Metallic sphere
    const metallicSphereMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.0,
    });
    const metallicSphere = new THREE.Mesh(sphereGeometry, metallicSphereMaterial);
    metallicSphere.position.set(-2, 1, 0);
    metallicSphere.castShadow = true;
    metallicSphere.receiveShadow = true;
    this.scene.add(metallicSphere);
    this.spheres.push(metallicSphere);

    // Cube
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.1,
    });
    this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.cube.position.set(2, 1, 0);
    this.cube.castShadow = true;
    this.cube.receiveShadow = true;
    this.scene.add(this.cube);

    // Ground plane (reflective)
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshPhysicalMaterial({
      color: "#050e20",
      metalness: 0.6,
      roughness: 1.0,
      reflectivity: 0.2,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  private initGridMaterial() {
    // Main grid material
    this.gridMaterial = new GridMaterial();
    
    // Grid plane
    const gridGeometry = new THREE.PlaneGeometry(40, 40);
    this.gridMesh = new THREE.Mesh(gridGeometry, this.gridMaterial);
    this.gridMesh.rotation.x = -Math.PI / 2;
    this.gridMesh.position.y = 0.003;
    this.gridMesh.renderOrder = 1;
    this.scene.add(this.gridMesh);

    // Back grid material
    this.gridMaterialBack = new GridMaterial();
    this.gridMaterialBack.setSecondaryOpacity(0);
    
    // Back grid plane
    this.gridMeshBack = new THREE.Mesh(gridGeometry, this.gridMaterialBack);
    this.gridMeshBack.position.set(0, 0.003 - 1.875, -3.125);
    this.gridMeshBack.renderOrder = 1;
    this.scene.add(this.gridMeshBack);
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    
    const elapsedTime = this.clock.getElapsedTime();
    
    // Update grid materials
    this.gridMaterial.updateTime(elapsedTime);
    this.gridMaterialBack.updateTime(elapsedTime);
    
    // Animate spheres
    this.spheres.forEach((sphere, index) => {
      sphere.position.y = 1 + Math.sin(elapsedTime + index) * 0.1;
    });
    
    // Animate cube
    this.cube.rotation.y = elapsedTime * 0.5;
    
    this.renderer.render(this.scene, this.camera);
  };

  // Public API for external control
  getCamera() {
    return this.camera;
  }

  getRenderer() {
    return this.renderer;
  }

  getScene() {
    return this.scene;
  }

  getGridMaterial() {
    return this.gridMaterial;
  }

  getGridMaterialBack() {
    return this.gridMaterialBack;
  }

  resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  dispose() {
    this.renderer.dispose();
    this.gridMaterial.dispose();
    this.gridMaterialBack.dispose();
  }
}