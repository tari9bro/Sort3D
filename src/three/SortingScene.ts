import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { CameraViewPreset, StepAction } from '../types/sorting';

// Reusable scratch variables to avoid GC allocations in render loop
const _vec3A = new THREE.Vector3();
const _vec3B = new THREE.Vector3();
const _colorA = new THREE.Color();
const _colorB = new THREE.Color();

export interface BarMeshAssembly {
  group: THREE.Group;
  value: number;
  originalIndex: number;
  currentIndex: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  currentX: number;
  currentY: number;
  currentZ: number;
  height: number;
  isSorted: boolean;
  state: 'idle' | 'compare' | 'swap' | 'pivot' | 'sorted';
  pillarMesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhysicalMaterial>;
  coreMesh: THREE.Mesh<THREE.CylinderGeometry, THREE.MeshBasicMaterial>;
  crownMesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
  pedestalMesh: THREE.Mesh<THREE.CylinderGeometry, THREE.MeshStandardMaterial>;
  shadowMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  spriteLabel: THREE.Sprite;
  sparkleTime: number;
}

export class SortingScene {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private frameId: number = 0;
  private isDestroyed: boolean = false;
  private isSoftwareGl: boolean = false;

  private bars: BarMeshAssembly[] = [];
  private groundMesh: THREE.Mesh | null = null;
  private currentCameraPreset: CameraViewPreset = 'orbit';

  // Camera animation target elevated to keep 3D bars well clear of bottom dock
  private cameraTargetPos = new THREE.Vector3(0, 15, 29);
  private cameraLookTarget = new THREE.Vector3(0, 6.2, 0);

  // Sparkle particle system for sorted triumph
  private particles: THREE.Points | null = null;
  private particlePositions: Float32Array = new Float32Array(0);
  private particleVelocities: Float32Array = new Float32Array(0);
  private particleLifes: Float32Array = new Float32Array(0);

  // Focus beam spotlight
  private pointerLight: THREE.PointLight;

  constructor(container: HTMLElement) {
    this.container = container;

    // Detect software WebGL
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Renderer configuration
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(
      this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // 2. Scene setup & atmospheric fog
    this.scene = new THREE.Scene();
    const bgColor = new THREE.Color('#0a0d14');
    this.scene.background = bgColor;
    this.scene.fog = new THREE.FogExp2('#0a0d14', 0.016);

    // 3. Camera & OrbitControls
    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );
    this.camera.position.set(0, 14, 28);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = !this.isSoftwareGl;
    this.controls.dampingFactor = 0.06;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.03; // prevent going below ground
    this.controls.minDistance = 6;
    this.controls.maxDistance = 75;
    this.controls.target.set(0, 5, 0);

    // 4. Procedural Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Studio Lighting Rig
    this.setupLighting();

    // 6. Ground Platform & Reflection Grid
    this.setupGround();

    // 7. Particle system
    this.setupParticles();

    // Pointer light
    this.pointerLight = new THREE.PointLight('#38bdf8', 2.5, 12, 1.8);
    this.pointerLight.position.set(0, 8, 2);
    this.scene.add(this.pointerLight);

    // Pre-warm shaders
    if (!this.isSoftwareGl) {
      this.renderer.compile(this.scene, this.camera);
    }

    // Window resize binding
    window.addEventListener('resize', this.onWindowResize);

    // Start render loop
    this.startLoop();
  }

  private setupLighting() {
    // Warm key directional light with tight shadow frustum
    const keyLight = new THREE.DirectionalLight('#fff2e6', 2.2);
    keyLight.position.set(16, 26, 18);
    if (!this.isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 5;
      keyLight.shadow.camera.far = 70;
      keyLight.shadow.camera.left = -25;
      keyLight.shadow.camera.right = 25;
      keyLight.shadow.camera.top = 25;
      keyLight.shadow.camera.bottom = -15;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    this.scene.add(keyLight);

    // Cool sky/ground fill light
    const hemiLight = new THREE.HemisphereLight('#4f8bc4', '#0d131f', 1.4);
    hemiLight.position.set(0, 30, 0);
    this.scene.add(hemiLight);

    // Back / rim light for metallic edges
    const rimLight = new THREE.DirectionalLight('#38bdf8', 1.6);
    rimLight.position.set(-18, 18, -20);
    this.scene.add(rimLight);
  }

  private setupGround() {
    // Procedural metallic dark floor with circular radar-grid texture
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Dark gradient background
      const grad = ctx.createRadialGradient(512, 512, 10, 512, 512, 512);
      grad.addColorStop(0, '#131b2c');
      grad.addColorStop(0.5, '#0b101c');
      grad.addColorStop(1, '#06080d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Cybernetic coordinate grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1.5;
      const step = 32;
      for (let x = 0; x <= 1024; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1024);
        ctx.stroke();
      }
      for (let y = 0; y <= 1024; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();
      }

      // Concentric rings
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.lineWidth = 2;
      for (let r = 80; r <= 480; r += 100) {
        ctx.beginPath();
        ctx.arc(512, 512, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Glowing center runway axis
      const runwayGrad = ctx.createLinearGradient(0, 480, 0, 544);
      runwayGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      runwayGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.25)');
      runwayGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = runwayGrad;
      ctx.fillRect(0, 480, 1024, 64);
    }

    const groundTex = new THREE.CanvasTexture(canvas);
    groundTex.colorSpace = THREE.SRGBColorSpace;
    groundTex.wrapS = THREE.RepeatWrapping;
    groundTex.wrapT = THREE.RepeatWrapping;
    groundTex.repeat.set(1, 1);
    groundTex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTex,
      roughness: 0.35,
      metalness: 0.6,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

    this.groundMesh = new THREE.Mesh(groundGeo, groundMat);
    this.groundMesh.rotation.x = -Math.PI / 2;
    this.groundMesh.position.y = 0;
    this.groundMesh.receiveShadow = !this.isSoftwareGl;
    this.scene.add(this.groundMesh);
  }

  private setupParticles() {
    const count = 120;
    const geo = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(count * 3);
    this.particleVelocities = new Float32Array(count * 3);
    this.particleLifes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      this.particleLifes[i] = -1; // inactive
    }

    geo.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));

    // Particle sprite
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const g = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, '#fef08a');
      g.addColorStop(0.3, '#34d399');
      g.addColorStop(0.8, 'rgba(16, 185, 129, 0.2)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      pCtx.fillStyle = g;
      pCtx.fillRect(0, 0, 64, 64);
    }
    const pTex = new THREE.CanvasTexture(pCanvas);
    pTex.colorSpace = THREE.SRGBColorSpace;

    const pMat = new THREE.PointsMaterial({
      size: 0.55,
      map: pTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.particles = new THREE.Points(geo, pMat);
    this.scene.add(this.particles);
  }

  public triggerSparkles(x: number, y: number, z: number) {
    if (!this.particles) return;
    const count = this.particleLifes.length;
    let spawned = 0;
    for (let i = 0; i < count && spawned < 18; i++) {
      if (this.particleLifes[i] <= 0) {
        const i3 = i * 3;
        this.particlePositions[i3] = x + (Math.random() - 0.5) * 0.4;
        this.particlePositions[i3 + 1] = y + Math.random() * 0.5;
        this.particlePositions[i3 + 2] = z + (Math.random() - 0.5) * 0.4;

        this.particleVelocities[i3] = (Math.random() - 0.5) * 1.8;
        this.particleVelocities[i3 + 1] = Math.random() * 2.5 + 1.2;
        this.particleVelocities[i3 + 2] = (Math.random() - 0.5) * 1.8;

        this.particleLifes[i] = 1.0;
        spawned++;
      }
    }
  }

  /**
   * Helper to build procedural label sprite with number value
   */
  private createNumberSprite(val: number): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 128, 64);
      // Soft rounded pill background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 3;
      const x = 14, y = 8, w = 100, h = 48, r = 12;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Number text
      ctx.font = 'bold 30px "JetBrains Mono", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(String(val), 64, 32);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      depthTest: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(1.4, 0.7, 1);
    return sprite;
  }

  /**
   * Procedural Contact Shadow Texture
   */
  private createContactShadowTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const g = ctx.createRadialGradient(64, 64, 10, 64, 64, 60);
      g.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
      g.addColorStop(0.5, 'rgba(0, 0, 0, 0.45)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  /**
   * Rebuild all 3D bars according to array data
   * Follows strict 3-12 part procedural model craft:
   * 1. Grounded socket pedestal
   * 2. Soft contact shadow plane
   * 3. Beveled metallic pillar
   * 4. Luminescent inner energy rod
   * 5. Chamfered top crown cap
   * 6. Floating floating numeric billboard sprite
   */
  public setArray(arr: number[]) {
    // Clean up existing bars
    for (const b of this.bars) {
      this.scene.remove(b.group);
      b.pillarMesh.geometry.dispose();
      b.pillarMesh.material.dispose();
      b.coreMesh.geometry.dispose();
      b.coreMesh.material.dispose();
      b.crownMesh.geometry.dispose();
      b.crownMesh.material.dispose();
      b.pedestalMesh.geometry.dispose();
      b.pedestalMesh.material.dispose();
      b.shadowMesh.geometry.dispose();
      b.shadowMesh.material.dispose();
      if (b.spriteLabel.material.map) b.spriteLabel.material.map.dispose();
      b.spriteLabel.material.dispose();
    }
    this.bars = [];

    const n = arr.length;
    const maxVal = Math.max(...arr, 1);
    const totalSpan = Math.min(26, Math.max(14, n * 1.15));
    const stepX = totalSpan / Math.max(n - 1, 1);
    const startX = -totalSpan / 2;

    const contactShadowTex = this.createContactShadowTexture();
    const barWidth = Math.max(0.3, Math.min(0.95, (totalSpan / n) * 0.72));

    for (let i = 0; i < n; i++) {
      const val = arr[i];
      const normalizedHeight = (val / maxVal) * 9.5 + 0.6; // height between 0.6 and 10.1 units
      const posX = startX + i * stepX;

      const group = new THREE.Group();
      group.position.set(posX, 0, 0);

      // Part 1: Soft grounded contact shadow
      const shadowGeo = new THREE.PlaneGeometry(barWidth * 1.8, barWidth * 1.8);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: contactShadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.6,
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.y = 0.005;
      group.add(shadowMesh);

      // Part 2: Grounded Pedestal Socket (bottom collar)
      const pedestalGeo = new THREE.CylinderGeometry(barWidth * 0.65, barWidth * 0.75, 0.16, 16);
      const pedestalMat = new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.4,
        metalness: 0.85,
      });
      const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
      pedestalMesh.position.y = 0.08;
      pedestalMesh.castShadow = !this.isSoftwareGl;
      pedestalMesh.receiveShadow = !this.isSoftwareGl;
      group.add(pedestalMesh);

      // Part 3: Main beveled pillar silhouette
      const pillarGeo = new THREE.BoxGeometry(barWidth, normalizedHeight, barWidth);
      const pillarMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#0284c7'),
        emissive: new THREE.Color('#0369a1'),
        emissiveIntensity: 0.18,
        roughness: 0.2,
        metalness: 0.75,
        clearcoat: 0.8,
        clearcoatRoughness: 0.15,
      });
      const pillarMesh = new THREE.Mesh(pillarGeo, pillarMat);
      // Pivot flush at bottom
      pillarMesh.position.y = normalizedHeight / 2 + 0.16;
      pillarMesh.castShadow = !this.isSoftwareGl;
      pillarMesh.receiveShadow = !this.isSoftwareGl;
      group.add(pillarMesh);

      // Part 4: Inner Luminescent Energy Rod (shows through corners / glows)
      const coreGeo = new THREE.CylinderGeometry(barWidth * 0.18, barWidth * 0.18, normalizedHeight * 0.95, 12);
      const coreMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#38bdf8'),
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.y = normalizedHeight / 2 + 0.16;
      coreMesh.position.z = barWidth * 0.35; // slightly forward accent line
      group.add(coreMesh);

      // Part 5: Chamfered Top Crown Cap
      const crownGeo = new THREE.BoxGeometry(barWidth * 1.08, 0.2, barWidth * 1.08);
      const crownMat = new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.2,
        metalness: 0.95,
      });
      const crownMesh = new THREE.Mesh(crownGeo, crownMat);
      crownMesh.position.y = normalizedHeight + 0.26;
      crownMesh.castShadow = !this.isSoftwareGl;
      group.add(crownMesh);

      // Part 6: Value Billboard Sprite
      const spriteLabel = this.createNumberSprite(val);
      spriteLabel.position.y = normalizedHeight + 0.85;
      group.add(spriteLabel);

      this.scene.add(group);

      this.bars.push({
        group,
        value: val,
        originalIndex: i,
        currentIndex: i,
        targetX: posX,
        targetY: 0,
        targetZ: 0,
        currentX: posX,
        currentY: 0,
        currentZ: 0,
        height: normalizedHeight,
        isSorted: false,
        state: 'idle',
        pillarMesh,
        coreMesh,
        crownMesh,
        pedestalMesh,
        shadowMesh,
        spriteLabel,
        sparkleTime: 0,
      });
    }

    this.adjustCameraForArray(n);
  }

  private adjustCameraForArray(n: number) {
    if (this.currentCameraPreset === 'orbit') {
      const dist = Math.max(22, n * 1.15 + 10);
      this.cameraTargetPos.set(0, dist * 0.45, dist * 0.9);
      this.cameraLookTarget.set(0, 5, 0);
    }
  }

  /**
   * Apply visual step state from sorting algorithm
   */
  public applyStep(
    action: StepAction,
    indices: number[],
    arrayState: number[],
    sortedIndices: number[],
    pivotIndex?: number
  ) {
    const n = arrayState.length;
    const totalSpan = Math.min(26, Math.max(14, n * 1.15));
    const stepX = totalSpan / Math.max(n - 1, 1);
    const startX = -totalSpan / 2;

    // Reset temporary states
    for (let i = 0; i < this.bars.length; i++) {
      const b = this.bars[i];
      const isPermanentlySorted = sortedIndices.includes(i);
      b.isSorted = isPermanentlySorted;

      if (isPermanentlySorted) {
        b.state = 'sorted';
      } else if (pivotIndex !== undefined && pivotIndex === i) {
        b.state = 'pivot';
      } else {
        b.state = 'idle';
      }

      // Default Y elevation
      b.targetY = 0;
      b.targetZ = 0;
    }

    // Active indices formatting
    if (action === 'compare') {
      for (const idx of indices) {
        if (this.bars[idx]) {
          this.bars[idx].state = 'compare';
          this.bars[idx].targetY = 0.4; // subtle elevation lift
        }
      }
      if (indices.length >= 1 && this.bars[indices[0]]) {
        this.pointerLight.position.x = this.bars[indices[0]].targetX;
      }
    } else if (action === 'swap') {
      for (let k = 0; k < indices.length; k++) {
        const idx = indices[k];
        if (this.bars[idx]) {
          this.bars[idx].state = 'swap';
          // Parabolic 3D crossover: one lifts up, one dips/advances forward in Z
          this.bars[idx].targetY = 1.2;
          this.bars[idx].targetZ = k % 2 === 0 ? 1.4 : -1.4;
        }
      }
      if (indices.length >= 2) {
        // Exchange bars in our array representation
        const [idxA, idxB] = indices;
        const temp = this.bars[idxA];
        this.bars[idxA] = this.bars[idxB];
        this.bars[idxB] = temp;
      }
    } else if (action === 'mark_sorted') {
      for (const idx of indices) {
        if (this.bars[idx]) {
          this.bars[idx].state = 'sorted';
          this.bars[idx].isSorted = true;
          this.bars[idx].sparkleTime = 1.0;
          this.triggerSparkles(
            this.bars[idx].currentX,
            this.bars[idx].height + 0.4,
            0
          );
        }
      }
    } else if (action === 'finish') {
      for (let i = 0; i < this.bars.length; i++) {
        this.bars[i].state = 'sorted';
        this.bars[i].isSorted = true;
      }
    }

    // Sync target positions with new slot indices
    for (let i = 0; i < this.bars.length; i++) {
      const b = this.bars[i];
      b.currentIndex = i;
      b.targetX = startX + i * stepX;
    }

    // Update material colors smoothly based on state
    this.updateBarMaterials();
  }

  private updateBarMaterials() {
    for (const b of this.bars) {
      let targetColor: THREE.Color;
      let targetEmissive: THREE.Color;
      let emissiveIntensity = 0.2;

      switch (b.state) {
        case 'compare':
          // Radiant solar amber
          targetColor = _colorA.set('#fbbf24');
          targetEmissive = _colorB.set('#d97706');
          emissiveIntensity = 0.8;
          b.crownMesh.material.color.set('#fef08a');
          b.coreMesh.material.color.set('#fbbf24');
          break;
        case 'swap':
          // Vivid electric magenta / violet
          targetColor = _colorA.set('#ec4899');
          targetEmissive = _colorB.set('#be185d');
          emissiveIntensity = 0.95;
          b.crownMesh.material.color.set('#f472b6');
          b.coreMesh.material.color.set('#f43f5e');
          break;
        case 'pivot':
          // Cyan laser beacon
          targetColor = _colorA.set('#06b6d4');
          targetEmissive = _colorB.set('#0891b2');
          emissiveIntensity = 0.85;
          b.crownMesh.material.color.set('#67e8f9');
          b.coreMesh.material.color.set('#06b6d4');
          break;
        case 'sorted':
          // Emerald / triumph gold
          targetColor = _colorA.set('#10b981');
          targetEmissive = _colorB.set('#059669');
          emissiveIntensity = 0.65;
          b.crownMesh.material.color.set('#6ee7b7');
          b.coreMesh.material.color.set('#34d399');
          break;
        default:
          // Sleek cyan / steel blue idle
          targetColor = _colorA.set('#0284c7');
          targetEmissive = _colorB.set('#0369a1');
          emissiveIntensity = 0.18;
          b.crownMesh.material.color.set('#f8fafc');
          b.coreMesh.material.color.set('#38bdf8');
          break;
      }

      b.pillarMesh.material.color.copy(targetColor);
      b.pillarMesh.material.emissive.copy(targetEmissive);
      b.pillarMesh.material.emissiveIntensity = emissiveIntensity;
    }
  }

  public setCameraPreset(preset: CameraViewPreset) {
    this.currentCameraPreset = preset;
    const n = this.bars.length;
    const dist = Math.max(22, n * 1.15 + 10);

    switch (preset) {
      case 'front':
        // Straight-on 2D elevation view
        this.cameraTargetPos.set(0, 7.5, dist * 0.95);
        this.cameraLookTarget.set(0, 6.2, 0);
        break;
      case 'top':
        // Overhead runway
        this.cameraTargetPos.set(0, dist * 1.1, 0.001);
        this.cameraLookTarget.set(0, 0, 0);
        break;
      case 'isometric':
        // Isometric 45-degree angle
        this.cameraTargetPos.set(dist * 0.65, dist * 0.75, dist * 0.65);
        this.cameraLookTarget.set(0, 5.5, 0);
        break;
      case 'cinematic':
        // Low angle dynamic shot
        this.cameraTargetPos.set(-dist * 0.45, 4.0, dist * 0.5);
        this.cameraLookTarget.set(0, 6.2, 0);
        break;
      case 'orbit':
      default:
        this.cameraTargetPos.set(0, dist * 0.48, dist * 0.90);
        this.cameraLookTarget.set(0, 6.0, 0);
        break;
    }
  }

  private onWindowResize = () => {
    if (!this.container || this.isDestroyed) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  /**
   * Main render loop with exponential damping and software WebGL pacing
   */
  private startLoop() {
    let lastTime = performance.now();

    const afterDraw = (cb: () => void) => {
      const gl = this.renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (this.isDestroyed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          this.frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          this.frameId = window.setTimeout(cb, 80);
        }
      };
      this.frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      if (this.isDestroyed) return;
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth camera interpolation towards preset
      if (this.camera.position.distanceTo(this.cameraTargetPos) > 0.05) {
        this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, this.cameraTargetPos.x, 3.5, dt);
        this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, this.cameraTargetPos.y, 3.5, dt);
        this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, this.cameraTargetPos.z, 3.5, dt);
        this.controls.target.x = THREE.MathUtils.damp(this.controls.target.x, this.cameraLookTarget.x, 3.5, dt);
        this.controls.target.y = THREE.MathUtils.damp(this.controls.target.y, this.cameraLookTarget.y, 3.5, dt);
        this.controls.target.z = THREE.MathUtils.damp(this.controls.target.z, this.cameraLookTarget.z, 3.5, dt);
      }

      this.controls.update();

      // Smoothly interpolate bar positions (kinematic movement & crossover arcs)
      for (const b of this.bars) {
        b.currentX = THREE.MathUtils.damp(b.currentX, b.targetX, 9.5, dt);
        b.currentY = THREE.MathUtils.damp(b.currentY, b.targetY, 8.5, dt);
        b.currentZ = THREE.MathUtils.damp(b.currentZ, b.targetZ, 8.5, dt);

        b.group.position.set(b.currentX, b.currentY, b.currentZ);

        // Gentle floating respiration on active bars
        if (b.state === 'compare' || b.state === 'swap') {
          b.pillarMesh.rotation.y = Math.sin(now * 0.005) * 0.06;
        } else {
          b.pillarMesh.rotation.y = 0;
        }
      }

      // Update particle physics
      if (this.particles) {
        const count = this.particleLifes.length;
        let activeParticles = false;
        for (let i = 0; i < count; i++) {
          if (this.particleLifes[i] > 0) {
            activeParticles = true;
            this.particleLifes[i] -= dt * 1.2;
            const i3 = i * 3;
            this.particlePositions[i3] += this.particleVelocities[i3] * dt;
            this.particlePositions[i3 + 1] += this.particleVelocities[i3 + 1] * dt;
            this.particlePositions[i3 + 2] += this.particleVelocities[i3 + 2] * dt;
            this.particleVelocities[i3 + 1] -= 2.2 * dt; // gravity
          } else {
            this.particlePositions[i * 3 + 1] = -100;
          }
        }
        if (activeParticles) {
          this.particles.geometry.attributes.position.needsUpdate = true;
        }
      }

      this.renderer.render(this.scene, this.camera);

      if (this.isSoftwareGl) {
        afterDraw(tick);
      } else {
        this.frameId = requestAnimationFrame(tick);
      }
    };

    tick();
  }

  public destroy() {
    this.isDestroyed = true;
    window.removeEventListener('resize', this.onWindowResize);
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);

    this.controls.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
