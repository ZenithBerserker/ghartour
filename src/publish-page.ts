import { getLang, setLang, t, type Lang } from './i18n';

function applyLang(lang: Lang): void {
  document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key, lang);
  });
  const toggle = document.getElementById('lang-toggle');
  if (toggle) toggle.textContent = t('langToggle', lang);
}

applyLang(getLang());

document.getElementById('lang-toggle')?.addEventListener('click', () => {
  const next: Lang = getLang() === 'hi' ? 'en' : 'hi';
  setLang(next);
  applyLang(next);
});

const STORAGE_KEY = 'ret_tours';

type TourRecord = { glbUrl: string; label: string; created: number };

function loadTours(): Record<string, TourRecord> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as Record<string, TourRecord>;
  } catch {
    return {};
  }
}

function saveTour(slug: string, glbUrl: string, label: string): void {
  const all = loadTours();
  all[slug] = { glbUrl, label, created: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

document.getElementById('publish-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const slug = (document.getElementById('slug') as HTMLInputElement).value.trim().toLowerCase();
  const glbUrl = (document.getElementById('glb-url') as HTMLInputElement).value.trim();
  const label = (document.getElementById('label') as HTMLInputElement).value.trim();
  const out = document.getElementById('publish-out');
  if (!slug || !glbUrl) {
    if (out) out.textContent = getLang() === 'hi' ? 'स्लग और GLB URL आवश्यक हैं।' : 'Slug and GLB URL are required.';
    return;
  }
  if (!/^[a-z0-9-]{2,40}$/.test(slug)) {
    if (out) out.textContent = getLang() === 'hi' ? 'स्लग: छोटे अक्षर, संख्या, हाइफ़न।' : 'Use 2–40 chars: a-z, 0-9, hyphen.';
    return;
  }
  saveTour(slug, glbUrl, label);
  const tourUrl = new URL('tour.html', new URL('.', window.location.href));
  tourUrl.searchParams.set('t', slug);
  const link = tourUrl.href;
  if (out) {
    out.innerHTML = '';
    const a = document.createElement('a');
    a.href = link;
    a.textContent = link;
    a.className = 'share-link';
    out.appendChild(document.createTextNode(getLang() === 'hi' ? 'आपका लिंक: ' : 'Your link: '));
    out.appendChild(a);
  }
});
