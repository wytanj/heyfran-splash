import { el, teaser } from '../shared.js';

/**
 * 3 · dollhouse-peek. A tiny Bugis+ floor as a dollhouse under a slow orbit.
 * Simplified cubes in the fran-game brand and retail palette. Three.js is
 * loaded only for this rendition.
 */
const brand = {
  yellow: 0xffe14d,
  yellowSoft: 0xfff4a8,
  blue: 0x5bbfe0,
  cream: 0xfffef5,
  peach: 0xf2d2ae,
  tan: 0xc4a070,
  brown: 0x3a2415,
};
const retail = {
  wall: 0xe8e2d8,
  gondola: 0x8a8a8a,
  gondolaDark: 0x6e6e6e,
  header: 0x1a1a1a,
  floor: 0xcfcfc8,
  drawer: 0xe4dfd4,
  barrisol: 0xfff4c2,
  mall: 0x2a2722,
};

function hasWebGL() {
  try {
    const probe = document.createElement('canvas');
    return Boolean(probe.getContext('webgl2') || probe.getContext('webgl'));
  } catch {
    return false;
  }
}

export async function mount(root) {
  const canvas = el('canvas', 'floor');
  root.append(canvas);
  teaser(root, {
    tone: 'white',
    eyebrow: 'heyfran',
  });

  if (!hasWebGL()) {
    canvas.remove();
    return;
  }

  const THREE = await import('three');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' });
  } catch (err) {
    console.warn('dollhouse: no WebGL, showing the overlay only', err);
    canvas.remove();
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = false;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(retail.mall);
  scene.fog = new THREE.Fog(retail.mall, 14, 30);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);

  const mat = (color, o = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: o.roughness ?? 0.72, metalness: o.metalness ?? 0.04, emissive: o.emissive ?? 0x000000, emissiveIntensity: o.emissiveIntensity ?? 0 });
  const box = (w, h, d, material, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    m.position.set(x, y, z);
    scene.add(m);
    return m;
  };

  const M = {
    floor: mat(retail.floor, { roughness: 0.92 }),
    wall: mat(retail.wall, { roughness: 0.88 }),
    gondola: mat(retail.gondola, { roughness: 0.48, metalness: 0.18 }),
    gondolaDark: mat(retail.gondolaDark, { roughness: 0.5, metalness: 0.2 }),
    header: mat(retail.header, { roughness: 0.45 }),
    drawer: mat(retail.drawer, { roughness: 0.86 }),
    canopy: mat(brand.yellow, { roughness: 0.4, emissive: brand.yellow, emissiveIntensity: 0.35 }),
    barrisol: mat(retail.barrisol, { roughness: 0.35, emissive: 0xfff1b0, emissiveIntensity: 0.55 }),
    products: [brand.yellow, brand.blue, brand.peach, brand.tan, brand.cream, brand.yellowSoft].map((c) => mat(c, { roughness: 0.6 })),
  };

  // Floor slab and two back walls: the dollhouse has its front cut away.
  const W = 10;
  const D = 7;
  box(W, 0.2, D, M.floor, 0, -0.1, 0);
  box(W, 3, 0.15, M.wall, 0, 1.5, -D / 2);
  box(0.15, 3, D, M.wall, -W / 2, 1.5, 0);
  // Yellow canopy over the entrance and a soft barrisol strip on the back wall.
  box(3.2, 0.12, 1.1, M.canopy, W / 2 - 1.8, 2.7, D / 2 + 0.1);
  box(0.12, 2.7, 0.12, M.gondola, W / 2 - 0.3, 1.35, D / 2 + 0.55);
  box(0.12, 2.7, 0.12, M.gondola, W / 2 - 3.3, 1.35, D / 2 + 0.55);
  box(W - 1, 0.08, 0.5, M.barrisol, 0, 2.9, -D / 2 + 0.4);

  // Wall bays along the back wall.
  for (let i = 0; i < 5; i += 1) {
    const x = -W / 2 + 1.2 + i * 1.9;
    box(1.6, 0.9, 0.5, M.drawer, x, 0.45, -D / 2 + 0.4);
    box(1.6, 0.06, 0.45, M.gondola, x, 1.4, -D / 2 + 0.4);
    box(1.6, 0.06, 0.45, M.gondola, x, 2.0, -D / 2 + 0.4);
    box(1.6, 0.22, 0.12, M.header, x, 2.5, -D / 2 + 0.2);
    for (let s = 0; s < 2; s += 1) {
      for (let p = 0; p < 4; p += 1) {
        const pm = M.products[(i + s + p) % M.products.length];
        box(0.18, 0.28, 0.18, pm, x - 0.6 + p * 0.4, 1.43 + s * 0.6 + 0.14, -D / 2 + 0.4);
      }
    }
  }

  // Three gondolas on the floor, each a grey base with two shelves of testers.
  const gondolas = [
    [-2.4, 0.4],
    [0.2, 0.4],
    [2.8, 0.4],
  ];
  gondolas.forEach(([gx, gz], gi) => {
    box(1.8, 0.5, 0.7, M.gondolaDark, gx, 0.25, gz);
    box(1.8, 0.05, 0.7, M.gondola, gx, 0.9, gz);
    box(1.8, 0.05, 0.7, M.gondola, gx, 1.35, gz);
    box(0.08, 1.4, 0.7, M.gondola, gx, 0.7, gz);
    for (let s = 0; s < 3; s += 1) {
      const y = 0.5 + s * 0.45;
      for (let p = 0; p < 6; p += 1) {
        const pm = M.products[(gi + s + p) % M.products.length];
        box(0.16, 0.26, 0.16, pm, gx - 0.7 + p * 0.28, y + 0.13, gz + (p % 2 ? 0.18 : -0.18));
      }
    }
  });

  // Wisp: a small glowing sphere drifting between gondolas.
  const wisp = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 18, 14),
    new THREE.MeshStandardMaterial({ color: brand.yellowSoft, emissive: brand.yellow, emissiveIntensity: 1.6, roughness: 0.3 }),
  );
  wisp.position.set(1.2, 0.45, 2.0);
  scene.add(wisp);
  const wispLight = new THREE.PointLight(brand.yellow, 2.2, 4.5, 2);
  wisp.add(wispLight);

  // Lights low: dim hemi, one warm key, cool fill, same recipe as fran-game.
  scene.add(new THREE.HemisphereLight(0xfff6e4, 0x8a8680, 0.42));
  const sun = new THREE.DirectionalLight(0xfff3d6, 0.9);
  sun.position.set(4, 8, 5);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xdde7ee, 0.22);
  fill.position.set(-5, 4, -3);
  scene.add(fill);

  function resize() {
    const w = root.clientWidth || innerWidth;
    const h = root.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < h ? 48 : 38;
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize);
  resize();

  const center = new THREE.Vector3(0.3, 0.6, 0.2);
  const pitch = 0.72;
  const dist = 17;
  let yaw = -Math.PI / 4;
  const clock = new THREE.Clock();
  let raf = 0;

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    if (!reduce) yaw += dt * 0.09;
    const cp = Math.cos(pitch);
    camera.position.set(
      center.x + Math.sin(yaw) * cp * dist,
      center.y + Math.sin(pitch) * dist,
      center.z + Math.cos(yaw) * cp * dist,
    );
    camera.lookAt(center);
    wisp.position.x = 1.2 + Math.sin(t * 0.5) * 2.4;
    wisp.position.z = 1.9 + Math.cos(t * 0.35) * 0.9;
    wisp.position.y = 0.45 + Math.sin(t * 2.1) * 0.08;
    renderer.render(scene, camera);
    if (!reduce) raf = requestAnimationFrame(frame);
  }

  function start() {
    cancelAnimationFrame(raf);
    clock.getDelta();
    frame();
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else start();
  });
  start();
  canvas.classList.add('is-ready');
}
