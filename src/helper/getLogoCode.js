// USE FOR CHEVRON
// export const LOGO_CODE_MAP = {
//   "Boost Mobile": "BM",
//   "GenMobile": "GM",
//   "Chevron - The Human Energy Company": "CHVC",
//   "Chevron Logo": "CHV",
//   "Delo Logo + Label Vertical": "DELO-HORZ",
//   "Oronite Logo + Label Vertical": "ORO-HORZ",
//   "Texaco Logo + Label Vertical": "TEX-HORZ",
//   "Delo Logo + Label Horizontal": "DELO",
//   "Texaco Logo + Label Horizontal": "TEX",
//   "Chevron Logo + Label Horizontal": "CHVC-HORZ",
//   "Havoline Horizontal": "HAV-HORZ",
//   "Havoline Vertical": "HAV",
//   "CHV-RETIREE": "CHV-RETIREE"
// };
export const LOGO_CODE_MAP = {
  "CE": "CE",
  "CE Path": "CEP",
  "CE Cares": "CEC",
  "CE/Lean": "CE/LEAN",
  "CE HVac Solutions": "CEHVS"
};

// USE FOR TAMKO
// export const LOGO_CODE_MAP = {
//   "Building Products": "TAM-BP",
//   "Tamko Building Products LLC": "TAM-BP",
//   "Building Products LLC / Pro Line": "TAM-BP/PROLINE",
//   "Building Products LLC / Tamko Edge": "TAM-BP/EDGE",
//   "Building Products LLC / Titan XT": "TAM-BP/TXT",
//   "Building Products LLC#Pro Line": "TAM-BP/PROLINE",
//   "Mastercraft Pro": "MCPRO",
//   "No Deco": "BLANK",
//   "Stormfighter Flex": "SFLEX",
//   "Stormfighter Flex#Pro Line#Tamko": "SFLEX/PROLINE",
//   "Stormfighter Flex#Tamko": "SFLEX/TAM",
//   "Stormfighter Flex#Tamko Pro Line": "SFLEX/PROLINE",
//   "TITANXT": "TXT",
//   "Tamko": "TAM",
//   "Tamko America's Shingles": "TAM-AS",
//   "Tamko Edge": "EDGE",
//   "Tamko Edge / TAMKO": "EDGE/TAM",
//   "Tamko Edge/ Building Products LLC": "EDGE/TAM-BP",
//   "Tamko Heritage _FrontDesign": "TshirtFront",
//   "Tamko Pro": "TPRO",
//   "Tamko Pro Line": "PROLINE",
//   "Tamko Pro Line / Stormfighter Flex": "PROLINE/SFLEX",
//   "Tamko Pro Line/Titan Bolt": "TAMPRO/BOLT",
//   "Tamko#80 Years": "TAM/80",
//   "Tamko#Titan XT": "TAM/TXT",
//   "Tamko/Pro Line": "TAM-BP/PROLINE",
//   "Tamko_Edge Design": "TAM-EDGE/Design",
//   "Tamko_Edge Patch": "TAM-EDGE/Patch",
//   "Tamko_Stormfighter Flex_BackDesign": "TshirtBack",
//   "Tamko_Stormfighter Flex_FrontDesign": "TshirtFront",
//   "Team Tamko": "TTAM",
//   "Titan XT#Building Products LLC": "TXT/TAM-BP",
//   "Titan XT#Tamko": "TXT/TAM",
//   "Titan XT#Tamko Pro Line": "TXT/PROLINE"
// }

const LOGO_CODE_LOOKUP = Object.keys(LOGO_CODE_MAP).reduce((acc, key) => {
  acc[key.toLowerCase()] = LOGO_CODE_MAP[key];
  return acc;
}, {});

export function getLogoCode(code) {
  return code
    ? LOGO_CODE_LOOKUP[code.trim().toLowerCase()] || null
    : null;
} 