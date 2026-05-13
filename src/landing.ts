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

const lang = getLang();
applyLang(lang);

document.getElementById('lang-toggle')?.addEventListener('click', () => {
  const next: Lang = getLang() === 'hi' ? 'en' : 'hi';
  setLang(next);
  applyLang(next);
});
