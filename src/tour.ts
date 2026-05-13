import {
  Application,
  Color,
  Entity,
  FILLMODE_FILL_WINDOW,
  RESOLUTION_AUTO,
  Vec3,
  KEY_W,
  KEY_A,
  KEY_S,
  KEY_D,
  KEY_SHIFT,
  MOUSEBUTTON_LEFT,
  Mouse
} from 'playcanvas';
import { getLang, t } from './i18n';

const STORAGE_KEY = 'ret_tours';

type TourRecord = { glbUrl: string; label: string; created: number };

function readTourSlug(url: URL): string | null {
  const t = url.searchParams.get('t');
  return t && t.length > 0 ? t : null;
}

function readDirectGlb(url: URL): string | null {
  const g = url.searchParams.get('glb');
  return g && g.length > 0 ? g : null;
}

function resolveGlbUrl(): string | null {
  const url = new URL(window.location.href);
  const direct = readDirectGlb(url);
  if (direct) return direct;
  const slug = readTourSlug(url);
  if (!slug) return null;
  try {
    const map = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Record<string, TourRecord>;
    const rec = map[slug];
    return rec?.glbUrl ?? null;
  } catch {
    return null;
  }
}

function buildDemoRoom(app: Application): void {
  const root = app.root;

  const floor = new Entity('floor');
  floor.addComponent('model', { type: 'box' });
  floor.setLocalScale(14, 0.12, 14);
  floor.setLocalPosition(0, -0.06, 0);
  root.addChild(floor);

  const wallH = 3.2;
  const half = 6.9;
  const thick = 0.2;

  const mkWall = (name: string, sx: number, sy: number, sz: number, x: number, y: number, z: number) => {
    const w = new Entity(name);
    w.addComponent('model', { type: 'box' });
    w.setLocalScale(sx, sy, sz);
    w.setLocalPosition(x, y, z);
    root.addChild(w);
  };

  mkWall('wall-n', 14, wallH, thick, 0, wallH * 0.5, -half);
  mkWall('wall-s', 14, wallH, thick, 0, wallH * 0.5, half);
  mkWall('wall-w', thick, wallH, 14, -half, wallH * 0.5, 0);
  mkWall('wall-e', thick, wallH, 14, half, wallH * 0.5, 0);

  const pillar = new Entity('pillar');
  pillar.addComponent('model', { type: 'cylinder' });
  pillar.setLocalScale(0.35, 1.4, 0.35);
  pillar.setLocalPosition(2.2, 1.4, -1.5);
  root.addChild(pillar);
}

function applyHudStrings(): void {
  const lang = getLang();
  document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key, lang);
  });
}

function hideLoading(): void {
  document.getElementById('loading')?.remove();
}

function showLoadError(): void {
  const lang = getLang();
  const el = document.getElementById('loading');
  if (el) el.textContent = t('tourErr', lang);
}

function main(): void {
  applyHudStrings();

  const canvas = document.getElementById('app-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;

  const app = new Application(canvas);
  const mobile = window.matchMedia('(max-width: 768px)').matches;
  app.graphicsDevice.maxPixelRatio = mobile ? 1 : Math.min(2, window.devicePixelRatio || 1);

  app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
  app.setCanvasResolution(RESOLUTION_AUTO);
  window.addEventListener('resize', () => app.resizeCanvas());

  app.scene.ambientLight = new Color(0.38, 0.4, 0.45);

  const camera = new Entity('camera');
  camera.addComponent('camera', {
    clearColor: new Color(0.07, 0.09, 0.12),
    farClip: 200,
    fov: mobile ? 72 : 68
  });
  app.root.addChild(camera);
  camera.setPosition(0, 1.58, 5.2);
  camera.setEulerAngles(0, 180, 0);

  const sun = new Entity('sun');
  sun.addComponent('light', {
    type: 'directional',
    castShadows: !mobile,
    shadowDistance: 24,
    normalOffsetBias: 0.02,
    shadowBias: 0.02,
    intensity: 1.05
  });
  app.root.addChild(sun);
  sun.setEulerAngles(52, 35, 0);

  const glbUrl = resolveGlbUrl();
  if (!glbUrl) {
    buildDemoRoom(app);
  }

  let yaw = 180;
  let pitch = 0;
  const eyeHeight = 1.58;
  const moveTmp = new Vec3();
  const forwardFlat = new Vec3();
  const rightFlat = new Vec3();

  const moveStick = { active: false, id: -1, ox: 0, oy: 0, cx: 0, cy: 0, maxR: 72 };
  const lookDrag = { active: false, id: -1, lx: 0, ly: 0 };

  const rect = () => canvas.getBoundingClientRect();

  canvas.addEventListener(
    'touchstart',
    (e) => {
      const r = rect();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i]!;
        const x = touch.clientX - r.left;
        const y = touch.clientY - r.top;
        const nx = x / r.width;
        if (!moveStick.active && nx < 0.42) {
          moveStick.active = true;
          moveStick.id = touch.identifier;
          moveStick.ox = moveStick.cx = x;
          moveStick.oy = moveStick.cy = y;
        } else if (!lookDrag.active && nx > 0.45) {
          lookDrag.active = true;
          lookDrag.id = touch.identifier;
          lookDrag.lx = x;
          lookDrag.ly = y;
        }
      }
    },
    { passive: true }
  );

  canvas.addEventListener(
    'touchmove',
    (e) => {
      const r = rect();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i]!;
        if (moveStick.active && touch.identifier === moveStick.id) {
          moveStick.cx = touch.clientX - r.left;
          moveStick.cy = touch.clientY - r.top;
        }
        if (lookDrag.active && touch.identifier === lookDrag.id) {
          const x = touch.clientX - r.left;
          const y = touch.clientY - r.top;
          const dx = x - lookDrag.lx;
          const dy = y - lookDrag.ly;
          lookDrag.lx = x;
          lookDrag.ly = y;
          yaw -= dx * 0.22;
          pitch -= dy * 0.18;
          pitch = Math.max(-88, Math.min(88, pitch));
        }
      }
      if (moveStick.active || lookDrag.active) e.preventDefault();
    },
    { passive: false }
  );

  const endTouch = (e: TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const id = e.changedTouches[i]!.identifier;
      if (moveStick.active && id === moveStick.id) moveStick.active = false;
      if (lookDrag.active && id === lookDrag.id) lookDrag.active = false;
    }
  };
  canvas.addEventListener('touchend', endTouch);
  canvas.addEventListener('touchcancel', endTouch);

  app.mouse.on('mousemove', (e) => {
    if (Mouse.isPointerLocked()) {
      yaw -= e.dx * 0.18;
      pitch -= e.dy * 0.18;
      pitch = Math.max(-88, Math.min(88, pitch));
    }
  });

  app.mouse.on('mousedown', (e) => {
    if (!mobile && e.button === MOUSEBUTTON_LEFT && !Mouse.isPointerLocked()) {
      app.mouse.enablePointerLock(undefined, () => {});
    }
  });

  const startApp = () => {
    app.on('update', (dt) => {
      const kb = app.keyboard;
      const yawRad = (yaw * Math.PI) / 180;
      forwardFlat.set(-Math.sin(yawRad), 0, -Math.cos(yawRad));
      rightFlat.set(Math.cos(yawRad), 0, -Math.sin(yawRad));

      let mx = 0;
      let mz = 0;
      if (kb.isPressed(KEY_W)) {
        mx += forwardFlat.x;
        mz += forwardFlat.z;
      }
      if (kb.isPressed(KEY_S)) {
        mx -= forwardFlat.x;
        mz -= forwardFlat.z;
      }
      if (kb.isPressed(KEY_D)) {
        mx += rightFlat.x;
        mz += rightFlat.z;
      }
      if (kb.isPressed(KEY_A)) {
        mx -= rightFlat.x;
        mz -= rightFlat.z;
      }

      if (moveStick.active) {
        let dx = moveStick.cx - moveStick.ox;
        let dy = moveStick.cy - moveStick.oy;
        const len = Math.hypot(dx, dy);
        if (len > moveStick.maxR) {
          const s = moveStick.maxR / len;
          dx *= s;
          dy *= s;
        }
        const nx = moveStick.maxR > 0 ? dx / moveStick.maxR : 0;
        const ny = moveStick.maxR > 0 ? -dy / moveStick.maxR : 0;
        mx += forwardFlat.x * ny + rightFlat.x * nx;
        mz += forwardFlat.z * ny + rightFlat.z * nx;
      }

      const speed = kb.isPressed(KEY_SHIFT) ? 4.2 : 2.4;
      const lenH = Math.hypot(mx, mz);
      if (lenH > 1e-4) {
        mx = (mx / lenH) * speed * dt;
        mz = (mz / lenH) * speed * dt;
      } else {
        mx = mz = 0;
      }

      moveTmp.copy(camera.getPosition());
      moveTmp.x += mx;
      moveTmp.z += mz;
      const limit = 6.2;
      moveTmp.x = Math.max(-limit, Math.min(limit, moveTmp.x));
      moveTmp.z = Math.max(-limit, Math.min(limit, moveTmp.z));
      moveTmp.y = eyeHeight;
      camera.setPosition(moveTmp);
      camera.setEulerAngles(pitch, yaw, 0);
    });

    app.start();
    hideLoading();
  };

  if (glbUrl) {
    app.assets.loadFromUrl(glbUrl, 'container', (err, asset) => {
      if (err || !asset?.resource) {
        buildDemoRoom(app);
        showLoadError();
        startApp();
        return;
      }
      try {
        const entity = asset.resource.instantiateRenderEntity({
          castShadows: !mobile
        });
        app.root.addChild(entity);
        entity.setLocalPosition(0, 0, 0);
      } catch {
        showLoadError();
      }
      startApp();
    });
  } else {
    startApp();
  }
}

main();
