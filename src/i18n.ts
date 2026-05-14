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
    demoHeading: 'Try sample interiors',
    demoNote:
      'First link is your luxury penthouse GLB from this site (~21 MB — use Wi‑Fi). Other links use public Khronos / three.js URLs.',
    demoPenthouse: 'Luxury penthouse — fully furnished (this site)',
    demoSponza: 'Sponza atrium (large interior, glTF)',
    demoInteriorBedroom: 'Bedroom interior (GLB, three.js)',
    demoInteriorKitchen: 'Kitchen scene (GLB, three.js)',
    demoInteriorHall: 'Indoor pool room — large interior (GLB, three.js)'
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
    demoHeading: 'डेमो इंटीरियर आज़माएँ',
    demoNote:
      'पहला लिंक आपका लग्ज़री पेंटहाउस GLB है (~21 MB — Wi‑Fi बेहतर)। बाकी सार्वजनिक ख्रोनोस / three.js लिंक।',
    demoPenthouse: 'लग्ज़री पेंटहाउस — पूरी सजावट (इसी साइट)',
    demoSponza: 'स्पोंज़ा एट्रियम (बड़ा इंटीरियर, glTF)',
    demoInteriorBedroom: 'बेडरूम इंटीरियर (GLB, three.js)',
    demoInteriorKitchen: 'रसोई दृश्य (GLB, three.js)',
    demoInteriorHall: 'इंडोर पूल रूम — बड़ा इंटीरियर (GLB, three.js)'
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
