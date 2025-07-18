import * as THREE from 'three';

export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private domElement: HTMLElement;
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  private spherical = new THREE.Spherical();
  private target = new THREE.Vector3();
  private offset = new THREE.Vector3();
  private minDistance = 1;
  private maxDistance = 30;
  private minPolarAngle = 0.1;
  private maxPolarAngle = 1.4;
  private rotateSpeed = 1.0;
  private zoomSpeed = 1.0;
  private panSpeed = 1.0;
  private autoRotate = false;
  private autoRotateSpeed = 2.0;
  private dampingFactor = 0.05;
  private enableDamping = true;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;
    
    // Set initial values
    this.target.set(0, 0, 0);
    this.update();
    
    this.addEventListeners();
  }

  private addEventListeners() {
    this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.domElement.addEventListener('wheel', this.onMouseWheel.bind(this));
    this.domElement.addEventListener('contextmenu', this.onContextMenu.bind(this));
  }

  private onMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.isDragging = true;
    this.previousMousePosition = { x: event.clientX, y: event.clientY };
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    
    const deltaMove = {
      x: event.clientX - this.previousMousePosition.x,
      y: event.clientY - this.previousMousePosition.y
    };

    // Rotate around the target
    this.spherical.theta -= deltaMove.x * this.rotateSpeed * 0.01;
    this.spherical.phi += deltaMove.y * this.rotateSpeed * 0.01;
    
    // Restrict phi to be between desired limits
    this.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi));
    
    this.previousMousePosition = { x: event.clientX, y: event.clientY };
  }

  private onMouseUp() {
    this.isDragging = false;
  }

  private onMouseWheel(event: WheelEvent) {
    event.preventDefault();
    
    if (event.deltaY < 0) {
      this.spherical.radius *= 0.9;
    } else {
      this.spherical.radius *= 1.1;
    }
    
    this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));
  }

  private onContextMenu(event: Event) {
    event.preventDefault();
  }

  update() {
    this.offset.copy(this.camera.position).sub(this.target);
    this.spherical.setFromVector3(this.offset);
    
    if (this.autoRotate && !this.isDragging) {
      this.spherical.theta += this.autoRotateSpeed * 0.01;
    }
    
    this.spherical.makeSafe();
    this.offset.setFromSpherical(this.spherical);
    
    this.camera.position.copy(this.target).add(this.offset);
    this.camera.lookAt(this.target);
  }

  setTarget(x: number, y: number, z: number) {
    this.target.set(x, y, z);
  }

  setPosition(x: number, y: number, z: number) {
    this.camera.position.set(x, y, z);
    this.update();
  }

  setAutoRotate(enabled: boolean) {
    this.autoRotate = enabled;
  }

  dispose() {
    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    this.domElement.removeEventListener('mousemove', this.onMouseMove);
    this.domElement.removeEventListener('mouseup', this.onMouseUp);
    this.domElement.removeEventListener('wheel', this.onMouseWheel);
    this.domElement.removeEventListener('contextmenu', this.onContextMenu);
  }
}