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
      'Sponza loads from Khronos over the network. Bedroom, kitchen, and hall load from this site — same tour controls (walk, look) in PlayCanvas.',
    demoSponza: 'Sponza atrium (large interior, glTF)',
    demoInteriorBedroom: 'Bedroom (hosted GLB)',
    demoInteriorKitchen: 'Kitchen scene (hosted GLB)',
    demoInteriorHall: 'Corridor / hall (hosted GLB)'
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
      'स्पोंज़ा नेटवर्क से ख्रोनोस से लोड होता है। बेडरूम, रसोई और हॉल इसी साइट से — PlayCanvas में वही चलना/घूमना।',
    demoSponza: 'स्पोंज़ा एट्रियम (बड़ा इंटीरियर, glTF)',
    demoInteriorBedroom: 'बेडरूम (होस्ट किया GLB)',
    demoInteriorKitchen: 'रसोई दृश्य (होस्ट किया GLB)',
    demoInteriorHall: 'कॉरिडोर / हॉल (होस्ट किया GLB)'
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
