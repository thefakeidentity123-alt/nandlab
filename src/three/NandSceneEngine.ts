import * as THREE from 'three';
import {
  circuitCoreFragmentShader,
  circuitCoreVertexShader,
  particleFieldFragmentShader,
  particleFieldVertexShader
} from '../shaders/nandShaders';
import { createNodeBadgeTexture, createSiliconMicrogridTexture } from './proceduralTextures';

export interface SceneScrollState {
  progress: number;       // 0.0 -> 1.0 overall page scroll
  velocity: number;       // normalized scroll velocity
  activeTrackIndex: number;
  inputA: 0 | 1;
  inputB: 0 | 1;
}

/**
 * Self-contained Three.js scene engine for NAND Lab.
 * Renders:
 * 1. Procedural 3D NAND Logic Gate Sculpture (D-body + Inversion Bubble + Input/Output Buses)
 * 2. Scroll-scrubbed exploded-view layer separation
 * 3. Orbiting B2C Curriculum Nodes
 * 4. Morphing Data Particle Lattice (Chaos -> Structured Enterprise Grid)
 */
export class NandSceneEngine {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private clock: THREE.Clock;

  private rootAssembly: THREE.Group;
  private layerInputBus: THREE.Group;
  private layerGateBody: THREE.Group;
  private layerInverterNode: THREE.Group;
  private layerOutputBus: THREE.Group;
  private b2cOrbitGroup: THREE.Group;
  private trackNodes: THREE.Mesh[] = [];

  private coreShaderMaterial: THREE.ShaderMaterial;
  private particleMaterial: THREE.ShaderMaterial;
  private inputPinAMesh!: THREE.Mesh;
  private inputPinBMesh!: THREE.Mesh;
  private outputPinMesh!: THREE.Mesh;
  private ringHalo!: THREE.Mesh;

  private pointer = new THREE.Vector2(0, 0);
  private smoothPointer = new THREE.Vector2(0, 0);
  private cameraTarget = new THREE.Vector3(0, 0, 0);
  private desiredCamPos = new THREE.Vector3(0, 0.35, 7.4);
  private desiredCamTarget = new THREE.Vector3(0, 0, 0);

  private rafId: number | null = null;
  private isDisposed = false;
  private reducedMotion = false;

  public state: SceneScrollState = {
    progress: 0,
    velocity: 0,
    activeTrackIndex: 0,
    inputA: 1,
    inputB: 1
  };

  constructor(container: HTMLElement, onReady?: () => void) {
    this.container = container;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2('#05070B', 0.055);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 60);
    this.camera.position.copy(this.desiredCamPos);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();

    // Custom shader material for the NAND Gate body
    this.coreShaderMaterial = new THREE.ShaderMaterial({
      vertexShader: circuitCoreVertexShader,
      fragmentShader: circuitCoreFragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uVelocity: { value: 0 },
        uSignalState: { value: 0.25 },
        uModeMix: { value: 0 },
        uCameraPos: { value: this.camera.position.clone() }
      }
    });

    this.particleMaterial = new THREE.ShaderMaterial({
      vertexShader: particleFieldVertexShader,
      fragmentShader: particleFieldFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uVelocity: { value: 0 },
        uModeMix: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      }
    });

    this.rootAssembly = new THREE.Group();
    this.layerInputBus = new THREE.Group();
    this.layerGateBody = new THREE.Group();
    this.layerInverterNode = new THREE.Group();
    this.layerOutputBus = new THREE.Group();
    this.b2cOrbitGroup = new THREE.Group();

    this.rootAssembly.add(
      this.layerInputBus,
      this.layerGateBody,
      this.layerInverterNode,
      this.layerOutputBus,
      this.b2cOrbitGroup
    );
    this.scene.add(this.rootAssembly);

    this.setupLighting();
    this.buildNandGateSculpture();
    this.buildB2COrbitNodes();
    this.buildMorphingParticleField();

    window.addEventListener('resize', this.handleResize);
    window.addEventListener('pointermove', this.handlePointerMove, { passive: true });

    // Signal readiness after initial GPU compile frame
    requestAnimationFrame(() => {
      this.renderer.render(this.scene, this.camera);
      onReady?.();
      this.animate();
    });
  }

  private setupLighting(): void {
    const ambient = new THREE.AmbientLight('#8aa4c8', 0.45);
    this.scene.add(ambient);

    const keyLight = new THREE.DirectionalLight('#ffffff', 1.8);
    keyLight.position.set(5, 7, 6);
    this.scene.add(keyLight);

    const cyanRim = new THREE.PointLight('#00E5FF', 2.8, 16);
    cyanRim.position.set(-4.5, 2.2, 3.5);
    this.scene.add(cyanRim);

    const amberRim = new THREE.PointLight('#FFB020', 2.2, 16);
    amberRim.position.set(4.5, -2.0, 3.0);
    this.scene.add(amberRim);
  }

  /**
   * Constructs a bespoke 3D NAND Logic Gate (D-shaped extruded core + NOT inversion bubble +
   * dual input rails A/B + output bus + precision calibration ring).
   */
  private buildNandGateSculpture(): void {
    const gridTex = createSiliconMicrogridTexture();

    const frameMaterial = new THREE.MeshStandardMaterial({
      color: '#0d1420',
      map: gridTex,
      metalness: 0.78,
      roughness: 0.28
    });

    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: '#cbd5e1',
      metalness: 0.9,
      roughness: 0.18
    });

    // 1. Extruded D-shaped NAND Gate Geometry
    const gateShape = new THREE.Shape();
    const w = 1.15;
    const h = 1.05;
    gateShape.moveTo(-w, -h);
    gateShape.lineTo(0.05, -h);
    gateShape.absarc(0.05, 0, h, -Math.PI / 2, Math.PI / 2, false);
    gateShape.lineTo(-w, h);
    gateShape.closePath();

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.56,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 2,
      bevelSize: 0.06,
      bevelThickness: 0.06
    };

    const gateGeo = new THREE.ExtrudeGeometry(gateShape, extrudeSettings);
    gateGeo.center();

    const gateCoreMesh = new THREE.Mesh(gateGeo, this.coreShaderMaterial);
    this.layerGateBody.add(gateCoreMesh);

    // Outer precision wireframe cage around the NAND body
    const edges = new THREE.EdgesGeometry(gateGeo, 24);
    const edgeLines = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: '#00E5FF', transparent: true, opacity: 0.35 })
    );
    this.layerGateBody.add(edgeLines);

    // Backplate housing for exploded disassembly depth
    const backPlate = new THREE.Mesh(gateGeo, frameMaterial);
    backPlate.scale.set(0.96, 0.96, 0.35);
    backPlate.position.z = -0.45;
    this.layerGateBody.add(backPlate);

    // 2. Dual Input Bus (Inputs A & B on the left)
    const railGeo = new THREE.CylinderGeometry(0.055, 0.055, 1.35, 20);
    railGeo.rotateZ(Math.PI / 2);

    const railA = new THREE.Mesh(railGeo, chromeMaterial);
    railA.position.set(-1.75, 0.48, 0);

    const railB = new THREE.Mesh(railGeo, chromeMaterial);
    railB.position.set(-1.75, -0.48, 0);

    const pinNodeGeo = new THREE.SphereGeometry(0.13, 24, 24);
    this.inputPinAMesh = new THREE.Mesh(
      pinNodeGeo,
      new THREE.MeshStandardMaterial({
        color: '#00E5FF',
        emissive: '#00E5FF',
        emissiveIntensity: 1.4
      })
    );
    this.inputPinAMesh.position.set(-2.45, 0.48, 0);

    this.inputPinBMesh = new THREE.Mesh(
      pinNodeGeo,
      new THREE.MeshStandardMaterial({
        color: '#00E5FF',
        emissive: '#00E5FF',
        emissiveIntensity: 1.4
      })
    );
    this.inputPinBMesh.position.set(-2.45, -0.48, 0);

    this.layerInputBus.add(railA, railB, this.inputPinAMesh, this.inputPinBMesh);

    // 3. The Signature NAND Inversion Bubble (NOT circle at apex)
    const bubbleGeo = new THREE.TorusGeometry(0.24, 0.055, 20, 48);
    const bubbleRing = new THREE.Mesh(bubbleGeo, chromeMaterial);
    bubbleRing.position.set(1.38, 0, 0);

    const bubbleCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 24, 24),
      new THREE.MeshStandardMaterial({
        color: '#FFB020',
        emissive: '#FFB020',
        emissiveIntensity: 1.2
      })
    );
    bubbleCore.position.set(1.38, 0, 0);
    this.layerInverterNode.add(bubbleRing, bubbleCore);

    // 4. Output Signal Bus (Right side)
    const outRail = new THREE.Mesh(railGeo, chromeMaterial);
    outRail.scale.set(0.85, 1, 1);
    outRail.position.set(2.18, 0, 0);

    this.outputPinMesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.18, 1),
      new THREE.MeshStandardMaterial({
        color: '#00E5FF',
        emissive: '#00E5FF',
        emissiveIntensity: 0.4
      })
    );
    this.outputPinMesh.position.set(2.75, 0, 0);
    this.layerOutputBus.add(outRail, this.outputPinMesh);

    // 5. Architectural Calibration Halo
    const haloGeo = new THREE.RingGeometry(3.15, 3.18, 96);
    const haloMat = new THREE.MeshBasicMaterial({
      color: '#38bdf8',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18
    });
    this.ringHalo = new THREE.Mesh(haloGeo, haloMat);
    this.ringHalo.rotation.x = Math.PI * 0.12;
    this.rootAssembly.add(this.ringHalo);
  }

  /**
   * Builds 5 orbiting B2C Curriculum Nodes (Excel/MIS, SQL, Power BI, Python, Web)
   * that illuminate and focus during Chapter 03.
   */
  private buildB2COrbitNodes(): void {
    const labels = ['TRK-01 // MIS', 'TRK-02 // SQL', 'TRK-03 // BI', 'TRK-04 // PY', 'TRK-05 // WEB'];
    const radius = 2.65;

    labels.forEach((label, idx) => {
      const angle = (idx / labels.length) * Math.PI * 2 - Math.PI / 2;
      const tex = createNodeBadgeTexture(label, '#00E5FF');
      const geo = new THREE.BoxGeometry(0.95, 0.52, 0.16);
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        color: '#e2e8f0',
        metalness: 0.45,
        roughness: 0.3,
        emissive: '#00E5FF',
        emissiveIntensity: idx === 0 ? 0.45 : 0.08
      });

      const node = new THREE.Mesh(geo, mat);
      node.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.45);
      this.trackNodes.push(node);
      this.b2cOrbitGroup.add(node);
    });

    this.b2cOrbitGroup.scale.setScalar(0.001);
  }

  /**
   * Builds 900 instanced optical data particles that morph from an organic cloud
   * into an organized B2B enterprise matrix during Chapter 04.
   */
  private buildMorphingParticleField(): void {
    const count = window.innerWidth < 768 ? 420 : 900;
    const positions = new Float32Array(count * 3);
    const targetPositions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);

    const gridCols = 15;
    const gridRows = 10;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Organic spherical shell
      const r = 3.2 + Math.random() * 5.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = (Math.random() - 0.5) * 7.0;

      // Structured 3D data warehouse lattice for B2B chapter
      const col = i % gridCols;
      const row = Math.floor(i / gridCols) % gridRows;
      const layer = Math.floor(i / (gridCols * gridRows));

      targetPositions[i3] = (col - gridCols / 2) * 0.42;
      targetPositions[i3 + 1] = (row - gridRows / 2) * 0.36;
      targetPositions[i3 + 2] = (layer - 3) * 0.55 - 1.2;

      scales[i] = 0.6 + Math.random() * 1.4;
      phases[i] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aTargetPos', new THREE.BufferAttribute(targetPositions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const points = new THREE.Points(geometry, this.particleMaterial);
    this.scene.add(points);
  }

  public setLogicInputs(inputA: 0 | 1, inputB: 0 | 1): void {
    this.state.inputA = inputA;
    this.state.inputB = inputB;

    const nandOutput: 0 | 1 = inputA === 1 && inputB === 1 ? 0 : 1;

    const matA = this.inputPinAMesh.material as THREE.MeshStandardMaterial;
    const matB = this.inputPinBMesh.material as THREE.MeshStandardMaterial;
    const matOut = this.outputPinMesh.material as THREE.MeshStandardMaterial;

    matA.emissiveIntensity = inputA === 1 ? 1.8 : 0.15;
    matA.color.set(inputA === 1 ? '#00E5FF' : '#334155');

    matB.emissiveIntensity = inputB === 1 ? 1.8 : 0.15;
    matB.color.set(inputB === 1 ? '#00E5FF' : '#334155');

    matOut.emissiveIntensity = nandOutput === 1 ? 2.1 : 0.18;
    matOut.color.set(nandOutput === 1 ? '#00E5FF' : '#FFB020');
    matOut.emissive.set(nandOutput === 1 ? '#00E5FF' : '#FFB020');

    this.coreShaderMaterial.uniforms.uSignalState.value = nandOutput === 1 ? 1.15 : 0.32;
  }

  public setActiveTrack(index: number): void {
    this.state.activeTrackIndex = index;
    this.trackNodes.forEach((node, idx) => {
      const mat = node.material as THREE.MeshStandardMaterial;
      const isSelected = idx === index;
      mat.emissiveIntensity = isSelected ? 0.95 : 0.12;
      node.scale.setScalar(isSelected ? 1.18 : 0.94);
    });
  }

  /**
   * Maps normalized scroll progress [0..1] to camera rails, exploded-view offsets,
   * B2C orbital nodes, and B2B particle lattice morphing.
   */
  private updateChoreography(elapsed: number): void {
    const p = this.state.progress;
    const isMobile = window.innerWidth < 900;
    const xScale = isMobile ? 0.35 : 1.0;

    // 1. Camera Rail Interpolation across the 6 chapters
    if (p < 0.16) {
      // Chapter 01: Hero Universal Gate
      const t = p / 0.16;
      this.desiredCamPos.set(THREE.MathUtils.lerp(0.5 * xScale, 1.3 * xScale, t), 0.3, 7.2 - t * 0.9);
      this.desiredCamTarget.set(-0.6 * xScale, 0, 0);
    } else if (p < 0.32) {
      // Chapter 02: Exploded-View Disassembly
      const t = (p - 0.16) / 0.16;
      this.desiredCamPos.set(THREE.MathUtils.lerp(1.3 * xScale, 2.2 * xScale, t), 0.9, 6.1);
      this.desiredCamTarget.set(-0.85 * xScale, 0, 0);
    } else if (p < 0.54) {
      // Chapter 03: B2C Talent Foundry (Left spatial alcove)
      const t = (p - 0.32) / 0.22;
      this.desiredCamPos.set(THREE.MathUtils.lerp(-1.9 * xScale, -1.5 * xScale, t), 0.2, 6.4);
      this.desiredCamTarget.set(0.9 * xScale, -0.05, 0);
    } else if (p < 0.76) {
      // Chapter 04: B2B Enterprise Engine (Right spatial alcove + Amber shift)
      const t = (p - 0.54) / 0.22;
      this.desiredCamPos.set(THREE.MathUtils.lerp(2.0 * xScale, 1.6 * xScale, t), -0.25, 6.3);
      this.desiredCamTarget.set(-0.85 * xScale, 0, 0);
    } else if (p < 0.90) {
      // Chapter 05: Interactive Logic Lab
      const t = (p - 0.76) / 0.14;
      this.desiredCamPos.set(0, THREE.MathUtils.lerp(1.4, 0.7, t), 6.2);
      this.desiredCamTarget.set(0, -0.35, 0);
    } else {
      // Chapter 06: Contact Finale
      this.desiredCamPos.set(0, 0.2, 7.6);
      this.desiredCamTarget.set(0, 0.2, 0);
    }

    // 2. Exploded-View Scrub (peaks cleanly during Chapter 02)
    const explodeCurve = Math.sin(THREE.MathUtils.clamp((p - 0.12) / 0.24, 0, 1) * Math.PI);
    const explodeOffset = this.reducedMotion ? 0 : explodeCurve * 0.95;

    this.layerInputBus.position.x = -explodeOffset * 0.9;
    this.layerGateBody.position.z = explodeOffset * 0.35;
    this.layerInverterNode.position.x = explodeOffset * 0.65;
    this.layerOutputBus.position.x = explodeOffset * 1.15;

    // 3. B2C Orbit Nodes visibility & gentle counter-rotation
    const b2cEnvelope = Math.sin(THREE.MathUtils.clamp((p - 0.28) / 0.28, 0, 1) * Math.PI);
    const targetOrbitScale = b2cEnvelope > 0.02 ? THREE.MathUtils.lerp(0.001, 1.0, b2cEnvelope) : 0.001;
    this.b2cOrbitGroup.scale.setScalar(targetOrbitScale);
    if (!this.reducedMotion) {
      this.b2cOrbitGroup.rotation.z = elapsed * 0.14;
      this.trackNodes.forEach((node) => {
        node.rotation.z = -elapsed * 0.14;
      });
    }

    // 4. B2B Mode Mix (Cyan 0.0 -> Amber 1.0 during Chapter 04)
    const b2bFactor = THREE.MathUtils.smoothstep(p, 0.50, 0.60) * (1 - THREE.MathUtils.smoothstep(p, 0.74, 0.82));
    this.coreShaderMaterial.uniforms.uModeMix.value = b2bFactor;
    this.particleMaterial.uniforms.uModeMix.value = b2bFactor;
    this.particleMaterial.uniforms.uMorph.value = b2bFactor;

    // 5. Smooth Camera & Pointer Parallax
    this.smoothPointer.lerp(this.pointer, 0.06);
    const parallaxX = this.reducedMotion ? 0 : this.smoothPointer.x * 0.38;
    const parallaxY = this.reducedMotion ? 0 : this.smoothPointer.y * 0.24;

    this.camera.position.lerp(
      new THREE.Vector3(
        this.desiredCamPos.x + parallaxX,
        this.desiredCamPos.y + parallaxY,
        this.desiredCamPos.z
      ),
      0.065
    );
    this.cameraTarget.lerp(this.desiredCamTarget, 0.075);
    this.camera.lookAt(this.cameraTarget);

    // Subtle organic assembly rotation
    if (!this.reducedMotion) {
      this.rootAssembly.rotation.y = Math.sin(elapsed * 0.35) * 0.16 + this.smoothPointer.x * 0.22;
      this.rootAssembly.rotation.x = Math.cos(elapsed * 0.28) * 0.08 - this.smoothPointer.y * 0.14;
      this.ringHalo.rotation.z = elapsed * 0.12;
    }

    // Update shader uniforms
    this.coreShaderMaterial.uniforms.uTime.value = elapsed;
    this.coreShaderMaterial.uniforms.uVelocity.value = this.state.velocity;
    this.coreShaderMaterial.uniforms.uCameraPos.value.copy(this.camera.position);

    this.particleMaterial.uniforms.uTime.value = elapsed;
    this.particleMaterial.uniforms.uVelocity.value = this.state.velocity;

    // Decay velocity smoothly
    this.state.velocity *= 0.92;
  }

  private animate = (): void => {
    if (this.isDisposed) return;
    this.rafId = requestAnimationFrame(this.animate);
    const elapsed = this.clock.getElapsedTime();
    this.updateChoreography(elapsed);
    this.renderer.render(this.scene, this.camera);
  };

  private handlePointerMove = (e: PointerEvent): void => {
    this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  private handleResize = (): void => {
    if (this.isDisposed) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    const dpr = Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(dpr);
    this.particleMaterial.uniforms.uPixelRatio.value = dpr;
  };

  public dispose(): void {
    this.isDisposed = true;
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('pointermove', this.handlePointerMove);

    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.LineSegments) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });

    this.renderer.dispose();
    if (this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}