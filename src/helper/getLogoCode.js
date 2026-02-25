export const LOGO_CODE_MAP = {
  "Boost Mobile": "BM",
  "GenMobile": "GM",
  "Chevron - The Human Energy Company": "CHVC",
  "Chevron Logo": "CHV",
  "Delo Logo + Label Vertical": "DELO-HORZ",
  "Oronite Logo + Label Vertical": "ORO-HORZ",
  "Texaco Logo + Label Vertical": "TEX-HORZ",
  "Delo Logo + Label Horizontal": "DELO",
  "Texaco Logo + Label Horizontal": "TEX",
  "Chevron Logo + Label": "CHVC-HORZ",
  "Havoline Horizontal": "HAV-HORZ",
  "Havoline Vertical": "HAV",
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