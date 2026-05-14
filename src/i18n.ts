export type Lang = 'en' | 'hi';

const STRINGS: Record<Lang, Record<string, string>> = {
  en: {
    brand: 'Ghar 360',
    tagline: 'Walk through homes in 3D — share one link with anyone in India.',
    ctaTour: 'Open demo tour',
    ctaPublish: 'Publish a flat (beta)',
    langToggle: 'हिंदी',
    footNote:
      'Built with PlayCanvas (WebGL). Works on common phones; use Wi‑Fi or 4G for large scans.',
    publishTitle: 'Publish',
    tourTitle: 'Tour',
    pubHeading: 'Connect a scan',
    pubSlug: 'Link name (in URL)',
    pubGlb: 'GLB file URL (HTTPS, CORS allowed)',
    pubLabel: 'Display name (optional)',
    pubSubmit: 'Save & show link',
    tourTap: 'Tap canvas to look around (desktop: click for mouse lock)',
    tourLoad: 'Loading…',
    tourErr: 'Could not load model. Check URL and CORS.',
    tourBack: 'Home',
    demoHeading: 'Try sample spaces',
    demoNote:
      'First links load files from this site (good for Vercel). Others are external demos. Same tour player as your GLB.',
    demoHostedBedroom: 'On this site — modern bedroom',
    demoHostedShaderBall: 'On this site — shader ball (materials)',
    demoHostedDuck: 'On this site — tiny duck (quick test)',
    demoBedroom: 'Modern bedroom (interior)',
    demoSponza: 'Sponza atrium (large interior, glTF)',
    demoPool: 'Pool scene',
    demoHallway: 'Sci‑fi corridor',
    demoDuck: 'Khronos Duck (tiny test)',
    demoHelmet: 'Damaged Helmet (materials test)',
    demoAstronaut: 'Astronaut'
  },
  hi: {
    brand: 'घर 360',
    tagline: '3D में घर देखें — एक लिंक से पूरे भारत में किसी को भी भेजें।',
    ctaTour: 'डेमो टूर खोलें',
    ctaPublish: 'फ्लैट प्रकाशित करें (बीटा)',
    langToggle: 'English',
    footNote:
      'PlayCanvas (WebGL) से बना। साधारण फोन पर चलता है; बड़े स्कैन के लिए Wi‑Fi या 4G बेहतर है।',
    publishTitle: 'प्रकाशन',
    tourTitle: 'टूर',
    pubHeading: 'स्कैन जोड़ें',
    pubSlug: 'लिंक नाम (URL में)',
    pubGlb: 'GLB फ़ाइल URL (HTTPS, CORS)',
    pubLabel: 'नाम (वैकल्पिक)',
    pubSubmit: 'सेव करें और लिंक दिखाएँ',
    tourTap: 'देखने के लिए कैनवास पर टैप करें (डेस्कटॉप: माउस लॉक)',
    tourLoad: 'लोड हो रहा है…',
    tourErr: 'मॉडल लोड नहीं हुआ। URL और CORS जाँचें।',
    tourBack: 'होम',
    demoHeading: 'डेमो स्पेस आज़माएँ',
    demoNote:
      'पहले लिंक इसी साइट की फ़ाइलें हैं (Vercel पर ठीक)। बाकी बाहरी डेमो। वही टूर प्लेयर जो आपके GLB के लिए है।',
    demoHostedBedroom: 'इसी साइट — आधुनिक बेडरूम',
    demoHostedShaderBall: 'इसी साइट — शेडर बॉल (मटीरियल)',
    demoHostedDuck: 'इसी साइट — छोटा डक (तुरंत)',
    demoBedroom: 'आधुनिक बेडरूम (अंदर)',
    demoSponza: 'स्पोंज़ा एट्रियम (बड़ा इंटीरियर, glTF)',
    demoPool: 'पूल दृश्य',
    demoHallway: 'साइ‑फ़ाई कॉरिडोर',
    demoDuck: 'ख्रोनोस डक (छोटा टेस्ट)',
    demoHelmet: 'डैमेज्ड हेलमेट (मटीरियल टेस्ट)',
    demoAstronaut: 'अंतरिक्ष यात्री'
  }
};

const LANG_KEY = 'ret_lang';

export function getLang(): Lang {
  const v = localStorage.getItem(LANG_KEY);
  return v === 'hi' ? 'hi' : 'en';
}

export function setLang(lang: Lang): void {
  localStorage.setItem(LANG_KEY, lang);
}

export function t(key: string, lang: Lang): string {
  return STRINGS[lang][key] ?? STRINGS.en[key] ?? key;
}
