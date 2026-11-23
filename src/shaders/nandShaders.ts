/**
 * Custom GLSL shaders for NAND Lab's procedural 3D hardware, circuit traces,
 * volumetric data streams, and scroll-velocity reactive optical surfaces.
 */

export const circuitCoreVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uVelocity;
  uniform float uExplode;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Subtle micro-harmonic vibration tied to scroll velocity
    float wave = sin(pos.x * 6.0 + uTime * 2.2) * cos(pos.y * 6.0 + uTime * 1.8);
    pos += normal * wave * (0.008 + clamp(abs(uVelocity) * 0.015, 0.0, 0.04));

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPos.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vElevation = wave;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const circuitCoreFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uVelocity;
  uniform float uSignalState; // 1.0 when NAND output is HIGH (1), 0.18 when LOW (0)
  uniform float uModeMix;     // 0.0 = B2C Cyan (#00E5FF), 1.0 = B2B Amber (#FFB020)
  uniform vec3 uCameraPos;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  varying float vElevation;

  // Procedural crisp PCB / silicon trace pattern
  float circuitGrid(vec2 uv) {
    vec2 grid = abs(fract(uv * 10.0 - 0.5) - 0.5) / fwidth(uv * 10.0);
    float line = min(grid.x, grid.y);
    float fineGrid = 1.0 - min(line, 1.0);

    // Diagonal bus channels
    float diag = abs(fract((uv.x + uv.y) * 5.0) - 0.5);
    float bus = smoothstep(0.035, 0.0, diag);

    return max(fineGrid * 0.35, bus * 0.85);
  }

  void main() {
    vec3 viewDir = normalize(uCameraPos - vWorldPosition);
    vec3 normal = normalize(vNormal);

    // Optical Fresnel rim lighting
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.2);

    // Dual-engine palette interpolation
    vec3 cyanSignal = vec3(0.0, 0.898, 1.0);
    vec3 amberSignal = vec3(1.0, 0.690, 0.125);
    vec3 violetCore = vec3(0.431, 0.337, 0.812);

    vec3 activeColor = mix(cyanSignal, amberSignal, uModeMix);

    // Traveling data pulse along local coordinates
    float pulseSpeed = 2.4 + abs(uVelocity) * 4.0;
    float pulse = smoothstep(
      0.75,
      1.0,
      sin(vWorldPosition.y * 5.5 - uTime * pulseSpeed + vWorldPosition.x * 3.0)
    );

    float traces = circuitGrid(vUv);

    // Deep obsidian silicon base with directional key light
    vec3 keyLightDir = normalize(vec3(0.6, 0.9, 0.7));
    float diff = max(dot(normal, keyLightDir), 0.0) * 0.45 + 0.12;
    vec3 baseSilicon = vec3(0.032, 0.045, 0.072) * diff;

    // Combine procedural circuit traces, traveling signal pulse, and fresnel edge
    vec3 traceGlow = activeColor * traces * (0.28 + pulse * 0.95) * uSignalState;
    vec3 rimGlow = mix(activeColor, violetCore, 0.25) * fresnel * (0.75 + abs(uVelocity) * 0.8);

    vec3 finalColor = baseSilicon + traceGlow + rimGlow;

    gl_FragColor = vec4(finalColor, 0.96);
  }
`;

export const particleFieldVertexShader = /* glsl */ `
  attribute float aScale;
  attribute float aPhase;
  attribute vec3 aTargetPos;

  uniform float uTime;
  uniform float uMorph;     // 0.0 = organic cloud, 1.0 = structured enterprise lattice
  uniform float uVelocity;
  uniform float uPixelRatio;

  varying float vAlpha;
  varying float vPhase;

  void main() {
    vPhase = aPhase;

    // Organic drift position
    vec3 organic = position;
    organic.y += sin(uTime * 0.7 + aPhase * 6.28) * 0.18;
    organic.x += cos(uTime * 0.5 + aPhase * 6.28) * 0.18;

    // Structured B2B lattice position
    vec3 structured = aTargetPos;
    structured.z += sin(uTime * 1.4 + aPhase * 3.14) * 0.05;

    vec3 blended = mix(organic, structured, uMorph);

    vec4 mvPosition = modelViewMatrix * vec4(blended, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float velocityBoost = 1.0 + clamp(abs(uVelocity) * 0.6, 0.0, 0.9);
    gl_PointSize = aScale * uPixelRatio * velocityBoost * (26.0 / max(-mvPosition.z, 1.0));

    vAlpha = smoothstep(16.0, 2.5, -mvPosition.z) * (0.45 + 0.45 * sin(uTime * 1.5 + aPhase * 6.28));
  }
`;

export const particleFieldFragmentShader = /* glsl */ `
  uniform float uModeMix;
  varying float vAlpha;
  varying float vPhase;

  void main() {
    // Crisp circular optical bokeh falloff
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;

    float core = smoothstep(0.5, 0.05, dist);

    vec3 cyan = vec3(0.0, 0.898, 1.0);
    vec3 amber = vec3(1.0, 0.690, 0.125);
    vec3 slate = vec3(0.58, 0.68, 0.82);

    vec3 tint = mix(cyan, amber, uModeMix);
    vec3 color = mix(slate, tint, step(0.45, fract(vPhase * 7.13)));

    gl_FragColor = vec4(color, core * vAlpha * 0.78);
  }
`;