import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
const OFFICIAL_LOGO_SRC = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-isabella-NYSrdGvZYuJp7200gu2CUzA0ookKJ9.jpeg";
const BACKGROUND_AUDIO_SRC = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-audio-J9p5kwgi9cNWNkRZIvA2xh3xW88Qov.mp3";

/**
 * La reproducción sonora se desbloquea únicamente tras una acción explícita
 * del usuario, respetando las políticas de autoplay y sus preferencias.
 */

/**
 * Cinematic 3D Intro Component — WebGL Three.js Experience
 */

const CONFIG = {
  duration: 26000,
  starsDesktop: 8500,
  starsMobile: 3000,
  dataDesktop: 1300,
  dataMobile: 420,
  cometCount: 9,
  basePixelRatio: 1.75,
  initialCameraZ: 1120,
  finalCameraZ: 310,
};

const HEADS = [
  "CROWN",
  "ISA",
  "SOPHIA",
  "ORION",
  "ARGUS",
  "MNEMOSYNE",
  "TELLUS",
  "CHRONOS",
  "HERMES",
  "AXIOMA",
  "PRAXIS",
  "HARMONIA",
];

const COLORS = [
  0x61e8ff, 0x7c9cff, 0xffd47d, 0x987dff, 0x52dca4, 0x5fd9ff, 0x9e92ff, 0xffc467, 0x64e7ff,
  0xb89bff, 0x63f0d0, 0xffd981,
];

interface Phase {
  at: number;
  title: string;
  sub: string;
}

const PHASES: Phase[] = [
  { at: 0, title: "Vacío cognitivo", sub: "Nodo Cero · Real del Monte, Hidalgo" },
  { at: 4, title: "Primer pulso", sub: "Sincronizando memoria territorial" },
  {
    at: 9,
    title: "C.R.O.W.N. Activo",
    sub: "Control · Riesgo · Orquestación · Whitelist · Notificación",
  },
  { at: 14, title: "Red de 12 Cabezas", sub: "Interconexión soberana de orquestación ética" },
  {
    at: 19,
    title: "Mnemósine & Tellus",
    sub: "Gobernanza de conocimiento y pertenencia territorial",
  },
  { at: 22, title: "Núcleo Establecido", sub: "Isabella Villaseñor AI está en línea" },
];

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [statusText, setStatusText] = useState("Inicializando arquitectura cognitiva");
  const [reduced] = useState(prefersReducedMotion);

  const doneRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setFinished(true);

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    onComplete();
  };

  const startExperience = () => {
    if (started) return;
    setStarted(true);
    clockRef.current = new THREE.Clock();

    if (audioRef.current) {
      audioRef.current.volume = 0.65;
      audioRef.current.play().catch(() => {
        setStatusText("Experiencia visual activa · audio silenciado por navegador");
      });
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        finish();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // WebGL Initialization & Simulation loop
  useEffect(() => {
    if (reduced) {
      // Direct completion fallback for prefers-reduced-motion
      if (started) {
        const t = window.setTimeout(finish, 2600);
        return () => window.clearTimeout(t);
      }
      return;
    }

    if (!started || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const isMobile = window.matchMedia("(max-width: 700px)").matches;
    const STAR_COUNT = isMobile ? CONFIG.starsMobile : CONFIG.starsDesktop;
    const DATA_COUNT = isMobile ? CONFIG.dataMobile : CONFIG.dataDesktop;

    // Standard Math Helpers
    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
    const smoothstep = (edge0: number, edge1: number, value: number) => {
      const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
      return t * t * (3 - 2 * t);
    };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

    const randomSphere = (radius: number) => {
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      return new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
      );
    };

    const colorToArray = (hex: number) => {
      const color = new THREE.Color(hex);
      return [color.r, color.g, color.b];
    };

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      58,
      window.innerWidth / window.innerHeight,
      0.1,
      5000,
    );
    camera.position.set(0, 0, CONFIG.initialCameraZ);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: false,
      powerPreference: "high-performance",
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, CONFIG.basePixelRatio));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // 2. Procedural Nebula background
    const nebulaGeometry = new THREE.PlaneGeometry(4300, 2600, 1, 1);
    const nebulaMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uTechnology: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uTechnology;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }

        void main() {
          vec2 uv = vUv - 0.5;
          float radius = length(uv);
          float n = noise(uv * 4.4 + vec2(uTime * 0.006, -uTime * 0.004));
          n += 0.45 * noise(uv * 9.0 - vec2(uTime * 0.012, uTime * 0.009));

          float cloud = smoothstep(0.72, 0.08, radius) * n;
          vec3 cyan = vec3(0.025, 0.30, 0.72);
          vec3 violet = vec3(0.22, 0.06, 0.55);
          vec3 gold = vec3(0.75, 0.31, 0.08);

          vec3 color = mix(cyan, violet, n);
          color = mix(color, gold, uTechnology * n);

          float alpha = cloud * 0.28 * (1.0 - uTechnology * 0.72);
          gl_FragColor = vec4(color, alpha);
        }
      `,
    });
    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    nebula.position.set(0, 0, -900);
    scene.add(nebula);

    // 3. Stars field with depth & convergence
    const starPositions = new Float32Array(STAR_COUNT * 3);
    const starSizes = new Float32Array(STAR_COUNT);
    const starTwinkles = new Float32Array(STAR_COUNT);
    const starColors = new Float32Array(STAR_COUNT * 3);

    interface StarBase {
      x: number;
      y: number;
      z: number;
      angle: number;
      speed: number;
      depth: number;
    }
    const starBase: StarBase[] = [];

    for (let i = 0; i < STAR_COUNT; i++) {
      const point = randomSphere(randomBetween(800, 2100));
      starPositions[i * 3] = point.x;
      starPositions[i * 3 + 1] = point.y;
      starPositions[i * 3 + 2] = point.z;

      starBase.push({
        x: point.x,
        y: point.y,
        z: point.z,
        angle: Math.random() * Math.PI * 2,
        speed: randomBetween(0.004, 0.018),
        depth: randomBetween(0.45, 1.35),
      });

      starSizes[i] = Math.random() < 0.035 ? randomBetween(4.0, 8.0) : randomBetween(0.8, 3.2);
      starTwinkles[i] = randomBetween(0.65, 2.5);

      const palette = Math.random() < 0.12 ? 0xffd58d : Math.random() < 0.3 ? 0x9dbaff : 0xbceeff;
      const color = colorToArray(palette);
      starColors[i * 3] = color[0]!;
      starColors[i * 3 + 1] = color[1]!;
      starColors[i * 3 + 2] = color[2]!;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute("aSize", new THREE.BufferAttribute(starSizes, 1));
    starGeometry.setAttribute("aTwinkle", new THREE.BufferAttribute(starTwinkles, 1));
    starGeometry.setAttribute("aColor", new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.95 },
        uTechnology: { value: 0 },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aTwinkle;
        attribute vec3 aColor;

        uniform float uTime;
        uniform float uTechnology;

        varying vec3 vColor;
        varying float vPulse;

        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float pulse = 0.84 + 0.16 * sin(uTime * aTwinkle + position.x * 0.007);
          float depth = clamp(1.0 - (-mvPosition.z / 2400.0), 0.12, 1.0);

          vColor = mix(aColor, vec3(0.19, 0.58, 1.0), uTechnology * 0.65);
          vPulse = pulse;

          gl_PointSize = aSize * pulse * depth * (610.0 / max(1.0, -mvPosition.z));
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec3 vColor;
        varying float vPulse;

        void main() {
          vec2 uv = gl_PointCoord.xy - 0.5;
          float d = length(uv);

          float core = smoothstep(0.13, 0.0, d);
          float halo = smoothstep(0.5, 0.02, d);
          float rayX = smoothstep(0.055, 0.0, abs(uv.x));
          float rayY = smoothstep(0.055, 0.0, abs(uv.y));
          float sparkle = max(rayX, rayY) * 0.3;

          float alpha = (core * 1.65 + halo * 0.7 + sparkle) * vPulse * uOpacity;
          if (alpha < 0.01) discard;

          gl_FragColor = vec4(vColor * (1.0 + core), alpha);
        }
      `,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 4. Data Flows between nodes
    const dataPositions = new Float32Array(DATA_COUNT * 3);
    const dataColors = new Float32Array(DATA_COUNT * 3);

    interface DataBase {
      x: number;
      y: number;
      z: number;
      angle: number;
      radius: number;
      phase: number;
      speed: number;
      hue: number;
    }
    const dataBase: DataBase[] = [];

    for (let i = 0; i < DATA_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = randomBetween(420, 1250);
      const point = {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius * randomBetween(0.35, 0.72),
        z: randomBetween(-260, 280),
      };

      dataBase.push({
        ...point,
        angle,
        radius,
        phase: Math.random() * Math.PI * 2,
        speed: randomBetween(0.08, 0.42),
        hue: Math.random(),
      });

      dataPositions[i * 3] = point.x;
      dataPositions[i * 3 + 1] = point.y;
      dataPositions[i * 3 + 2] = point.z;

      const color = Math.random() < 0.2 ? colorToArray(0xffd47d) : colorToArray(0x59e8ff);
      dataColors[i * 3] = color[0]!;
      dataColors[i * 3 + 1] = color[1]!;
      dataColors[i * 3 + 2] = color[2]!;
    }

    const dataGeometry = new THREE.BufferGeometry();
    dataGeometry.setAttribute("position", new THREE.BufferAttribute(dataPositions, 3));
    dataGeometry.setAttribute("aColor", new THREE.BufferAttribute(dataColors, 3));

    const dataMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
      },
      vertexShader: `
        attribute vec3 aColor;
        uniform float uTime;
        varying vec3 vColor;
        varying float vPulse;

        void main() {
          vColor = aColor;
          vPulse = 0.7 + 0.3 * sin(uTime * 3.0 + position.x * 0.01);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 2.5 * vPulse * (650.0 / max(1.0, -mvPosition.z));
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec3 vColor;
        varying float vPulse;

        void main() {
          vec2 uv = gl_PointCoord.xy - 0.5;
          float d = length(uv);
          float glow = smoothstep(0.5, 0.0, d);
          float core = smoothstep(0.12, 0.0, d);

          float alpha = (glow * 0.8 + core * 1.5) * vPulse * uOpacity;
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
    });
    const dataFlow = new THREE.Points(dataGeometry, dataMaterial);
    scene.add(dataFlow);

    // 5. Tech Network Grid
    const gridGroup = new THREE.Group();
    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x247da9,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });

    const gridSize = 1800;
    const gridStep = 80;
    const gridPoints: THREE.Vector3[] = [];

    for (let x = -gridSize; x <= gridSize; x += gridStep) {
      gridPoints.push(new THREE.Vector3(x, -gridSize, 0), new THREE.Vector3(x, gridSize, 0));
    }
    for (let y = -gridSize; y <= gridSize; y += gridStep) {
      gridPoints.push(new THREE.Vector3(-gridSize, y, 0), new THREE.Vector3(gridSize, y, 0));
    }

    const gridGeometry = new THREE.BufferGeometry().setFromPoints(gridPoints);
    const gridLines = new THREE.LineSegments(gridGeometry, gridMaterial);
    gridGroup.add(gridLines);
    gridGroup.rotation.x = -Math.PI / 2;
    gridGroup.position.y = -270;
    gridGroup.position.z = -30;
    gridGroup.scale.setScalar(0.01);
    scene.add(gridGroup);

    // 6. Central Core (Pulsing Icosahedron)
    const coreGroup = new THREE.Group();
    coreGroup.scale.setScalar(0.001);

    const coreGeometry = new THREE.IcosahedronGeometry(76, 3);
    const coreMaterial = new THREE.ShaderMaterial({
      transparent: true,
      wireframe: true,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
      },
      vertexShader: `
        uniform float uTime;
        varying float vGlow;
        void main() {
          vec3 transformed = position;
          float wave = sin(uTime * 1.6 + position.y * 0.04) * 4.0;
          transformed += normalize(position) * wave;
          vGlow = 0.5 + 0.5 * sin(uTime + position.x * 0.02);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying float vGlow;
        void main() {
          gl_FragColor = vec4(0.3, 0.9, 1.0, uOpacity * (0.55 + vGlow * 0.45));
        }
      `,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    coreGroup.add(coreMesh);

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x5fe9ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const glowMesh = new THREE.Mesh(new THREE.SphereGeometry(47, 48, 48), glowMaterial);
    coreGroup.add(glowMesh);

    const coreRings: THREE.Mesh<THREE.TorusGeometry, THREE.MeshBasicMaterial>[] = [];
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(128 + i * 46, 0.85, 8, 180),
        new THREE.MeshBasicMaterial({
          color: i === 1 ? 0xffd47d : 0x5fe9ff,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
        }),
      );
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      coreGroup.add(ring);
      coreRings.push(ring);
    }
    scene.add(coreGroup);

    // 7. 12 Cognitive heads
    const headGroup = new THREE.Group();
    interface HeadNode {
      name: string;
      node: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
      angle: number;
      baseX: number;
      baseY: number;
      baseZ: number;
      phase: number;
    }
    const headNodes: HeadNode[] = [];

    HEADS.forEach((name, index) => {
      const angle = (index / HEADS.length) * Math.PI * 2;
      const radius = 230;

      const node = new THREE.Mesh(
        new THREE.SphereGeometry(5.5, 16, 16),
        new THREE.MeshBasicMaterial({
          color: COLORS[index]!,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
        }),
      );

      node.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.58,
        Math.sin(angle * 2.0) * 82,
      );
      headGroup.add(node);

      headNodes.push({
        name,
        node,
        angle,
        baseX: node.position.x,
        baseY: node.position.y,
        baseZ: node.position.z,
        phase: Math.random() * Math.PI * 2,
      });
    });
    scene.add(headGroup);

    // 8. Connecting lines
    interface NetworkLine {
      line: THREE.Line;
      geometry: THREE.BufferGeometry;
      material: THREE.LineBasicMaterial;
      head: HeadNode;
      index: number;
    }
    const networkLines: NetworkLine[] = [];

    headNodes.forEach((head, index) => {
      const points = [new THREE.Vector3(0, 0, 0), head.node.position.clone()];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: COLORS[index]!,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(geometry, material);
      headGroup.add(line);

      networkLines.push({
        line,
        geometry,
        material,
        head,
        index,
      });
    });

    // 9. Comets
    interface Comet {
      trail: THREE.Line;
      head: THREE.Mesh;
      geometry: THREE.BufferGeometry;
      material: THREE.LineBasicMaterial;
      points: THREE.Vector3[];
      offset: number;
      speed: number;
      phase: number;
    }
    const comets: Comet[] = [];

    for (let i = 0; i < CONFIG.cometCount; i++) {
      const points: THREE.Vector3[] = [];
      const startAngle = Math.random() * Math.PI * 2;

      for (let j = 0; j < 12; j++) {
        const t = j / 11;
        const radius = 1100 - t * 850;
        points.push(
          new THREE.Vector3(
            Math.cos(startAngle + t * 1.2) * radius,
            randomBetween(-480, 480) * (1 - t * 0.55),
            Math.sin(startAngle + t * 1.2) * radius * 0.52,
          ),
        );
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0x69eaff : 0xffd47d,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const trail = new THREE.Line(geometry, material);
      scene.add(trail);

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(5.5, 16, 16),
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0x9cf3ff : 0xffe0a1,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
        }),
      );
      scene.add(head);

      comets.push({
        trail,
        head,
        geometry,
        material,
        points,
        offset: Math.random(),
        speed: randomBetween(0.028, 0.085),
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 10. Explosion Particles
    const explosionCount = isMobile ? 900 : 2200;
    const explosionPositions = new Float32Array(explosionCount * 3);
    const explosionVelocity: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < explosionCount; i++) {
      const point = randomSphere(3);
      explosionPositions[i * 3] = 0;
      explosionPositions[i * 3 + 1] = 0;
      explosionPositions[i * 3 + 2] = 0;

      explosionVelocity.push({
        x: point.x * randomBetween(160, 620),
        y: point.y * randomBetween(160, 620),
        z: point.z * randomBetween(160, 620),
      });
    }

    const explosionGeometry = new THREE.BufferGeometry();
    explosionGeometry.setAttribute("position", new THREE.BufferAttribute(explosionPositions, 3));

    const explosionMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: isMobile ? 2.2 : 3.8,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const explosion = new THREE.Points(explosionGeometry, explosionMaterial);
    scene.add(explosion);

    // 11. Dynamic Updates Helpers
    const updateStars = (
      time: number,
      convergenceVal: number,
      technologyVal: number,
      releaseVal: number,
    ) => {
      const positions = starGeometry.attributes.position.array as Float32Array;

      for (let i = 0; i < STAR_COUNT; i++) {
        const base = starBase[i]!;
        const angle = base.angle + time * base.speed;
        const orbitX = base.x * Math.cos(angle) - base.z * Math.sin(angle);
        const orbitZ = base.x * Math.sin(angle) + base.z * Math.cos(angle);

        const spatialX = lerp(base.x, orbitX, convergenceVal);
        const spatialY = lerp(
          base.y,
          base.y + Math.sin(time * 0.6 + base.angle) * 70,
          convergenceVal,
        );
        const spatialZ = lerp(base.z, orbitZ, convergenceVal);

        const nodeX = spatialX * (1 - technologyVal * 0.72);
        const nodeY = spatialY * (1 - technologyVal * 0.72);
        const nodeZ = spatialZ * (1 - technologyVal * 0.72);

        const burst = releaseVal * releaseVal * (1 + base.depth);

        positions[i * 3] = nodeX + spatialX * burst * 0.18;
        positions[i * 3 + 1] = nodeY + spatialY * burst * 0.18;
        positions[i * 3 + 2] = nodeZ + spatialZ * burst * 0.18;
      }
      starGeometry.attributes.position.needsUpdate = true;
      starMaterial.uniforms.uTime.value = time;
      starMaterial.uniforms.uTechnology.value = technologyVal;
      starMaterial.uniforms.uOpacity.value = lerp(0.94, 0.16, technologyVal);
    };

    const updateData = (time: number, technologyVal: number, coreProgressVal: number) => {
      const positions = dataGeometry.attributes.position.array as Float32Array;

      for (let i = 0; i < DATA_COUNT; i++) {
        const item = dataBase[i]!;
        const cycle = (time * item.speed + item.phase) % 1;
        const radius = lerp(item.radius, 62, coreProgressVal) * (1 - cycle * coreProgressVal);
        const angle = item.angle + time * 0.17 + cycle * 1.3;

        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius * 0.58;
        positions[i * 3 + 2] = item.z + Math.sin(time + item.phase) * 95;
      }
      dataGeometry.attributes.position.needsUpdate = true;
      dataMaterial.uniforms.uTime.value = time;
      dataMaterial.uniforms.uOpacity.value = technologyVal * 0.76;
    };

    const updateComets = (time: number, progressVal: number) => {
      const cometOpacity =
        smoothstep(0.03, 0.16, progressVal) * (1 - smoothstep(0.69, 0.88, progressVal));

      comets.forEach((comet) => {
        const local = (time * comet.speed + comet.offset) % 1;
        const index = Math.floor(local * (comet.points.length - 1));
        const point = comet.points[clamp(index, 0, comet.points.length - 1)]!;

        comet.head.position.copy(point);
        comet.material.opacity = cometOpacity * 0.75;
        comet.head.material.opacity = cometOpacity * 0.95;
      });
    };

    const updateNetwork = (time: number, technologyVal: number, coreProgressVal: number) => {
      headGroup.rotation.z = time * 0.018;
      headGroup.rotation.y = Math.sin(time * 0.15) * 0.12;

      headNodes.forEach((head, index) => {
        const pulse = 0.7 + 0.3 * Math.sin(time * 2.3 + head.phase);
        const scale = 1 + pulse * coreProgressVal * 0.42;

        head.node.scale.setScalar(scale);
        head.node.material.opacity = technologyVal * coreProgressVal * (0.58 + pulse * 0.4);
        head.node.position.z = head.baseZ + Math.sin(time * 0.7 + head.phase) * 18;

        const lineData = networkLines[index]!;
        const array = lineData.geometry.attributes.position.array as Float32Array;

        array[0] = 0;
        array[1] = 0;
        array[2] = 0;
        array[3] = head.node.position.x;
        array[4] = head.node.position.y;
        array[5] = head.node.position.z;

        lineData.geometry.attributes.position.needsUpdate = true;
        lineData.material.opacity = technologyVal * coreProgressVal * (0.14 + pulse * 0.28);
      });
    };

    const updateCore = (time: number, coreProgressVal: number, releaseVal: number) => {
      coreGroup.scale.setScalar(lerp(0.001, 1.0, coreProgressVal) * (1 + releaseVal * 4.5));
      coreMesh.rotation.x = time * 0.21;
      coreMesh.rotation.y = time * 0.32;

      coreMaterial.uniforms.uTime.value = time;
      coreMaterial.uniforms.uOpacity.value = coreProgressVal * (0.5 + releaseVal * 2.1);
      glowMaterial.opacity = coreProgressVal * (0.12 + releaseVal * 0.5);

      coreRings.forEach((ring, index) => {
        ring.material.opacity = coreProgressVal * (0.22 + releaseVal * 0.8);
        ring.rotation.x += 0.002 + index * 0.001;
        ring.rotation.y += 0.004 + index * 0.001;
      });
    };

    const updateExplosion = (releaseVal: number) => {
      const positions = explosionGeometry.attributes.position.array as Float32Array;

      for (let i = 0; i < explosionCount; i++) {
        const velocity = explosionVelocity[i]!;
        positions[i * 3] = velocity.x * releaseVal;
        positions[i * 3 + 1] = velocity.y * releaseVal;
        positions[i * 3 + 2] = velocity.z * releaseVal;
      }
      explosionGeometry.attributes.position.needsUpdate = true;
      explosionMaterial.opacity = releaseVal * (1 - releaseVal * 0.35);
    };

    // 12. Main Simulation & Animation Loop
    let startTimestamp: number | null = null;
    const clock = new THREE.Clock();

    const loop = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsedMs = timestamp - startTimestamp;
      const progressVal = clamp(elapsedMs / CONFIG.duration, 0, 1);
      const time = clock.getElapsedTime();

      setElapsed(elapsedMs);

      // Delta-time based milestones
      const convergenceVal = smoothstep(0.16, 0.48, progressVal);
      const technologyVal = smoothstep(0.39, 0.69, progressVal);
      const coreProgressVal = smoothstep(0.63, 0.84, progressVal);
      const releaseVal = smoothstep(0.86, 0.96, progressVal);

      nebulaMaterial.uniforms.uTime.value = time;
      nebulaMaterial.uniforms.uTechnology.value = technologyVal;

      updateStars(time, convergenceVal, technologyVal, releaseVal);
      updateData(time, technologyVal, coreProgressVal);
      updateComets(time, progressVal);
      updateNetwork(time, technologyVal, coreProgressVal);
      updateCore(time, coreProgressVal, releaseVal);
      updateExplosion(releaseVal);

      // Scale & Rotate technological grids
      gridGroup.scale.setScalar(lerp(0.01, 1.0, technologyVal));
      gridGroup.position.y = lerp(-500, -270, technologyVal);
      gridGroup.rotation.z = time * 0.006;
      gridMaterial.opacity = technologyVal * 0.3;

      // Adjust camera positions smoothly
      camera.position.z = lerp(CONFIG.initialCameraZ, CONFIG.finalCameraZ, technologyVal);
      camera.position.x = Math.sin(time * 0.12) * 24 * technologyVal;
      camera.position.y = Math.cos(time * 0.13) * 16 * technologyVal;

      // Camera vibration on core release
      camera.position.x += Math.sin(time * 23.0) * releaseVal * 5;
      camera.position.y += Math.cos(time * 19.0) * releaseVal * 4;
      camera.lookAt(0, 0, 0);

      // UI phase updates
      if (progressVal < 0.22) {
        setStatusText("Cartografiando campo estelar...");
      } else if (progressVal < 0.48) {
        setStatusText("Convergiendo memoria y territorio...");
      } else if (progressVal < 0.7) {
        setStatusText("Construyendo plano tecnológico...");
      } else if (progressVal < 0.86) {
        setStatusText("Sincronizando 12 cabezas cognitivas...");
      } else if (progressVal < 0.96) {
        setStatusText("Activando núcleo Isabella...");
      } else {
        setStatusText("Transferencia al espacio Isabella...");
      }

      renderer.render(scene, camera);

      if (progressVal >= 1.0) {
        finish();
      } else {
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    rafRef.current = requestAnimationFrame(loop);

    // Resizing boundary
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, CONFIG.basePixelRatio));
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.Line) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, reduced]);

  const progress = Math.min(1, elapsed / CONFIG.duration);
  const phase = [...PHASES].reverse().find((p) => elapsed >= p.at * 1000) ?? PHASES[0]!;

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 overflow-hidden bg-[#01030a] select-none">
      {/* Background Audio */}
      <audio ref={audioRef} preload="auto" crossOrigin="anonymous">
        <source src={BACKGROUND_AUDIO_SRC} type="audio/mpeg" />
      </audio>

      {/* First-click gateway: visual identity and audio are intentionally user-initiated. */}
      {!started && (
        <div className="absolute inset-0 z-[100] grid place-items-center overflow-y-auto bg-[radial-gradient(circle_at_50%_42%,rgba(43,67,108,0.24),transparent_34%),linear-gradient(135deg,rgba(1,3,10,0.96),rgba(7,12,22,0.88))] p-6 sm:p-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/70 to-transparent" />
          <div className="w-[min(640px,100%)] animate-rise text-center">
            <div className="mb-8 flex items-center justify-center gap-3 font-mono text-[9px] font-semibold uppercase tracking-[0.38em] text-cyan-200/70">
              <span className="h-px w-10 bg-cyan-200/30" />
              Nodo Cero · Real del Monte
              <span className="h-px w-10 bg-cyan-200/30" />
            </div>
            <div className="relative mx-auto mb-8 w-[min(560px,94vw)] overflow-hidden rounded-[28px] border border-white/15 bg-black/30 p-2 shadow-[0_30px_100px_-35px_rgba(96,165,250,0.7)] backdrop-blur-sm">
              <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-amber-200/20" />
              <img src="/assets/logo-isabella.jpeg" data-official-source={OFFICIAL_LOGO_SRC} alt="Isabella Villaseñor AI — identidad oficial" className="relative block aspect-[16/9] w-full rounded-[21px] object-cover opacity-95" referrerPolicy="no-referrer" />
            </div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.32em] text-amber-100/70">Una nueva era de inteligencia soberana</p>
            <h1 className="text-balance font-display text-[clamp(2.3rem,7vw,5.2rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-pearl">Entra al nacimiento de algo especial.</h1>
            <p className="mx-auto mt-6 max-w-[480px] text-pretty text-sm leading-7 text-slate-300/80">Una presencia cognitiva para guiar, proteger y crear contigo. Tu primer click inicia la experiencia visual y sonora de Isabella.</p>
            <button onClick={startExperience} aria-label="Iniciar experiencia con audio" className="group mt-8 inline-flex items-center gap-4 rounded-full border border-amber-100/40 bg-amber-50 px-7 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-slate-950 shadow-[0_15px_45px_-15px_rgba(253,230,138,0.8)] transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_22px_60px_-15px_rgba(103,232,249,0.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200">
              <span className="grid size-8 place-items-center rounded-full bg-slate-950 text-amber-100 transition-transform group-hover:scale-110">→</span>
              Iniciar experiencia
            </button>
            <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.22em] text-slate-500">Audio inmersivo · Presiona Enter para continuar</p>
          </div>
        </div>
      )}

      {/* 3D Canvas rendering */}
      {started && !reduced && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      )}

      {/* Cinematic Phase Layout */}
      {started && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <img
            src="/assets/logo-isabella.jpeg"
            data-official-source={OFFICIAL_LOGO_SRC}
            alt="Marca de Isabella Villaseñor"
            className="mb-8 w-[min(380px,72vw)] rounded-2xl opacity-90 mix-blend-screen transition-all"
            style={{ filter: `brightness(${0.55 + progress * 0.6})` }}
          />
          <h2 className="text-iridescent animate-rise font-display text-[28px] sm:text-[42px] leading-tight font-black tracking-tight text-pearl">
            {phase.title}
          </h2>
          <p className="mt-3 font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.32em] text-muted-foreground max-w-[500px] leading-relaxed">
            {phase.sub}
          </p>
        </div>
      )}

      {/* UI Controls Footer */}
      {started && (
        <div className="absolute inset-x-0 bottom-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pb-6 sm:px-10">
          <div className="flex-1 max-w-sm">
            <div className="h-[2px] w-full bg-border/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] transition-[width] duration-200"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="mt-2.5 font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
              Activación cognitiva {Math.round(progress * 100)}% · {statusText}
            </p>
          </div>
          <button
            onClick={finish}
            className="rounded-xl border border-border/45 bg-slate-950/60 hover:bg-slate-900/80 px-4 py-2 font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground hover:text-pearl transition-all cursor-pointer w-fit self-end sm:self-auto"
          >
            Omitir Intro · Esc
          </button>
        </div>
      )}

      {/* Shading, vignette & whiteout overlays */}
      <div className="absolute inset-0 pointer-events-none vignette z-8 mix-blend-multiply bg-radial-vignette" />
      <div className="absolute inset-0 pointer-events-none color-grade z-9 mix-blend-screen bg-linear-colorgrade" />
      <div className="absolute inset-0 pointer-events-none scanlines z-10 opacity-5 bg-repeating-scanlines" />
      <div
        id="whiteout"
        className={`absolute inset-0 z-50 bg-white pointer-events-none transition-opacity duration-[1350ms] ${
          finished ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
