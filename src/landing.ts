import { getLang, setLang, t, type Lang } from './i18n';

const SPONZA_GLTF =
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Sponza/glTF/Sponza.gltf';

/** GLB files under `public/samples/` — same origin as the site (Vercel / GitHub Pages). */
function hostedAssetUrl(path: string): string {
  const base = import.meta.env.BASE_URL;
  return new URL(path.replace(/^\//, ''), window.location.origin + base).href;
}

/** Sponza (external glTF) plus three hosted interior GLBs that load in PlayCanvas with movement. */
function sampleTourList(): { key: string; url: string }[] {
  return [
    { key: 'demoSponza', url: SPONZA_GLTF },
    { key: 'demoInteriorBedroom', url: hostedAssetUrl('samples/bedroom.glb') },
    { key: 'demoInteriorKitchen', url: hostedAssetUrl('samples/kitchen.glb') },
    { key: 'demoInteriorHall', url: hostedAssetUrl('samples/hall.glb') }
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
