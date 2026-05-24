/**
 * Three.js Cyberpunk Scene
 * Particles, wireframe structures, grid floor, connecting lines
 */
export function initScene(canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;
  camera.position.y = 5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const CYAN = 0x00fff5;
  const MAGENTA = 0xff00ff;
  const PURPLE = 0x7b2fff;

  // ── GRID FLOOR ──────────────────────────────────
  const gridGeometry = new THREE.BufferGeometry();
  const gridVertices = [];
  const gridSize = 80;
  const gridDivisions = 40;

  for (let i = -gridSize / 2; i <= gridSize / 2; i += gridSize / gridDivisions) {
    gridVertices.push(-gridSize / 2, 0, i, gridSize / 2, 0, i);
    gridVertices.push(i, 0, -gridSize / 2, i, 0, gridSize / 2);
  }

  gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridVertices, 3));
  const gridMaterial = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.08 });
  const grid = new THREE.LineSegments(gridGeometry, gridMaterial);
  grid.position.y = -10;
  scene.add(grid);

  // ── PARTICLES ───────────────────────────────────
  const particleCount = 600;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleSizes = new Float32Array(particleCount);
  const particleColors = new Float32Array(particleCount * 3);

  const colorPalette = [
    new THREE.Color(CYAN),
    new THREE.Color(MAGENTA),
    new THREE.Color(PURPLE),
  ];

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 80;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    particleSizes[i] = Math.random() * 2 + 0.5;

    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    particleColors[i * 3] = color.r;
    particleColors[i * 3 + 1] = color.g;
    particleColors[i * 3 + 2] = color.b;
  }

  particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute('size', new THREE.Float32BufferAttribute(particleSizes, 1));
  particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));

  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float uTime;
      void main() {
        vColor = color;
        vec3 pos = position;
        pos.y += sin(uTime * 0.5 + position.x * 0.1) * 0.5;
        pos.x += cos(uTime * 0.3 + position.z * 0.1) * 0.3;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (200.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
        vAlpha = 0.4 + 0.3 * sin(uTime + position.x);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        float glow = 1.0 - smoothstep(0.0, 0.5, d);
        gl_FragColor = vec4(vColor, glow * vAlpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // ── WIREFRAME STRUCTURES ────────────────────────
  const icoGeometry = new THREE.IcosahedronGeometry(6, 1);
  const icoMaterial = new THREE.MeshBasicMaterial({ color: CYAN, wireframe: true, transparent: true, opacity: 0.12 });
  const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
  icosahedron.position.set(15, 5, -10);
  scene.add(icosahedron);

  const octGeometry = new THREE.OctahedronGeometry(4, 0);
  const octMaterial = new THREE.MeshBasicMaterial({ color: MAGENTA, wireframe: true, transparent: true, opacity: 0.1 });
  const octahedron = new THREE.Mesh(octGeometry, octMaterial);
  octahedron.position.set(-18, -3, -8);
  scene.add(octahedron);

  const torusGeometry = new THREE.TorusGeometry(5, 0.3, 8, 32);
  const torusMaterial = new THREE.MeshBasicMaterial({ color: PURPLE, wireframe: true, transparent: true, opacity: 0.08 });
  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  torus.position.set(0, 10, -15);
  torus.rotation.x = Math.PI / 4;
  scene.add(torus);

  // ── CONNECTING LINES ────────────────────────────
  const lineCount = 30;
  const lineGeometry = new THREE.BufferGeometry();
  const linePositions = new Float32Array(lineCount * 6);

  for (let i = 0; i < lineCount; i++) {
    const idx = i * 6;
    linePositions[idx] = (Math.random() - 0.5) * 60;
    linePositions[idx + 1] = (Math.random() - 0.5) * 40;
    linePositions[idx + 2] = (Math.random() - 0.5) * 60;
    linePositions[idx + 3] = linePositions[idx] + (Math.random() - 0.5) * 20;
    linePositions[idx + 4] = linePositions[idx + 1] + (Math.random() - 0.5) * 20;
    linePositions[idx + 5] = linePositions[idx + 2] + (Math.random() - 0.5) * 20;
  }

  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lineMaterial = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.06 });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  // ── MOUSE TRACKING ──────────────────────────────
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── ANIMATION LOOP ──────────────────────────────
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    particleMaterial.uniforms.uTime.value = elapsed;

    icosahedron.rotation.x = elapsed * 0.15;
    icosahedron.rotation.y = elapsed * 0.1;

    octahedron.rotation.x = elapsed * 0.2;
    octahedron.rotation.z = elapsed * 0.15;

    torus.rotation.x = Math.PI / 4 + elapsed * 0.08;
    torus.rotation.y = elapsed * 0.12;

    grid.material.opacity = 0.06 + Math.sin(elapsed * 0.5) * 0.02;

    lines.rotation.y = elapsed * 0.02;

    // Parallax
    camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
    camera.position.y += (5 - mouseY * 2 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  // ── RESIZE ──────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
