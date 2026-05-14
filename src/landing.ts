import { getLang, setLang, t, type Lang } from './i18n';

const SAMPLE_TOURS: { key: string; url: string }[] = [
  {
    key: 'demoBedroom',
    url: 'https://threejs.org/examples/models/gltf/minimalistic_modern_bedroom.glb'
  },
  {
    key: 'demoSponza',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Sponza/glTF/Sponza.gltf'
  },
  {
    key: 'demoPool',
    url: 'https://threejs.org/examples/models/gltf/pool.glb'
  },
  {
    key: 'demoHallway',
    url: 'https://threejs.org/examples/models/gltf/space_ship_hallway.glb'
  },
  {
    key: 'demoDuck',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb'
  },
  {
    key: 'demoHelmet',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb'
  },
  {
    key: 'demoAstronaut',
    url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'
  }
];

function renderDemoTours(lang: Lang): void {
  const ul = document.getElementById('demo-tours');
  if (!ul) return;
  ul.replaceChildren();
  const base = import.meta.env.BASE_URL;
  for (const item of SAMPLE_TOURS) {
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
