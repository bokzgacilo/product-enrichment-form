export const LOGO_CODE_MAP = {
  "CHVC": "CHVC",
  "CHV": "CHV",
  "DELO-HORZ": "DELO-HORZ",
  "ORO-HORZ": "ORO-HORZ",
  "TEX-HORZ": "TEX-HORZ",
  "DELO": "DELO",
  "TEX": "TEX",
  "CHVC-HORZ": "CHVC-HORZ",
  "HAV-HORZ": "HAV-HORZ",
  "HAV": "HAV",
  "CHV-RETIREE": "CHV-RETIREE"
};

const LOGO_CODE_LOOKUP = Object.keys(LOGO_CODE_MAP).reduce((acc, key) => {
  acc[key.toLowerCase()] = LOGO_CODE_MAP[key];
  return acc;
}, {});

export function getLogoCode(code) {
  return code
    ? LOGO_CODE_LOOKUP[code.trim().toLowerCase()] || null
    : null;
}