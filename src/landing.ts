import { getLang, setLang, t, type Lang } from './i18n';

/** Same-origin asset under `public/` (reliable on Vercel / GitHub Pages). */
function hostedAssetUrl(path: string): string {
  const base = import.meta.env.BASE_URL;
  return new URL(path.replace(/^\//, ''), window.location.origin + base).href;
}

/** Khronos Sponza (glTF + sidecar assets; same-origin relative URLs resolve on raw.githubusercontent.com). */
const SPONZA_GLTF =
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Sponza/glTF/Sponza.gltf';

/**
 * Three interior GLBs from three.js examples — single-file, HTTPS, CORS `*` (verified for browser fetch).
 * @see https://threejs.org/examples/#webgl_loader_gltf
 */
const PUBLIC_INTERIOR_GLBS: { key: string; url: string }[] = [
  {
    key: 'demoInteriorBedroom',
    url: 'https://threejs.org/examples/models/gltf/minimalistic_modern_bedroom.glb'
  },
  {
    key: 'demoInteriorKitchen',
    url: 'https://threejs.org/examples/models/gltf/coffeemat.glb'
  },
  {
    key: 'demoInteriorHall',
    url: 'https://threejs.org/examples/models/gltf/pool.glb'
  }
];

function sampleTourList(): { key: string; url: string }[] {
  return [
    { key: 'demoPenthouse', url: hostedAssetUrl('samples/luxury-penthouse.glb') },
    { key: 'demoSponza', url: SPONZA_GLTF },
    ...PUBLIC_INTERIOR_GLBS
  ];
}

function renderDemoTours(lang: Lang): void {
  const ul = document.getElementById('demo-tours');
  if (!ul) return;
  ul.replaceChildren();
  const base = import.meta.env.BASE_URL;
  for (const item of sampleTourList()) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'demo-link';
    a.href = `${base}tour.html?glb=${encodeURIComponent(item.url)}`;
    a.textContent = t(item.key, lang);
    li.appendChild(a);
    ul.appendChild(li);
  }
}

function applyLang(lang: Lang): void {
  document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key, lang);
  });
  const toggle = document.getElementById('lang-toggle');
  if (toggle) toggle.textContent = t('langToggle', lang);
  renderDemoTours(lang);
}

const lang = getLang();
applyLang(lang);

document.getElementById('lang-toggle')?.addEventListener('click', () => {
  const next: Lang = getLang() === 'hi' ? 'en' : 'hi';
  setLang(next);
  applyLang(next);
});
